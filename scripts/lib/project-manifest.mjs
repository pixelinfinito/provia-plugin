// Shared logic for provia-project manifests (v1.1, v1 accepted): normalisation of the alternate shapes agents produce,
// shape and reference checks, the access rules, the analysis behind the map and the generated handover.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { validateTypes } from '../build-entity-catalogue.mjs';
import * as engine from '../../contracts/workflow-v1/engine.mjs';
import {
  LEVELS, ACCESS_DEFAULTS, MAX_GRANTS, SENSITIVITIES, GROUP_KINDS, DUE_IN_SOURCE_KINDS, TEMPLATE_SCOPES, TRIGGER_TYPES, UUID, TEMPLATE_CODE,
  ENGINE_SUPPORTS_ACCESS, parseGrantee, atLeast, whoCanStart, retainedExcess, retainedBlock, grantApplied, currentOperation, allowlistFingerprint, startVerified, readBackCurrent, instant,
} from './workflow-access.mjs';

export const SCHEMA = 'provia-project/v1.1';
export const LEGACY_SCHEMA = 'provia-project/v1';
const KEY = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
const ACTION_TYPES = new Set(['standard', 'decision', 'sub_workflow', 'notification', 'wait', 'http_request', 'form_fill']);
const SOURCE_KINDS = new Set(['sop', 'policy', 'checklist', 'export', 'interview', 'catalogue', 'other']);
const WORKFLOW_STATUS = new Set(['design', 'packaged', 'validated', 'imported', 'change_planned']);
const FORM_STATUS = new Set(['designed', 'created', 'linked']);
const RECEIPT_KINDS = new Set(['entity_type', 'group', 'workflow', 'form', 'tag', 'access', 'user']);
const RESOLVING = new Set(['created', 'updated', 'no_op']);
const GROUP_FLAGS = new Set(['single_person', 'alias', 'segregation', 'requester', 'external', 'unnamed']);
const HUMAN = ['standard', 'decision', 'form_fill'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = value => typeof value === 'string' && value.trim().length > 0;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const list = value => Array.isArray(value) ? value : [];
const clone = value => JSON.parse(JSON.stringify(value));

/**
 * Accepts the alternate shapes parallel agents produce and returns the canonical manifest plus one note per change:
 * `sections` as strings, `sourceRefs` as `source#anchor`, `folded` as strings and `forms[].name`.
 */
export function normalizeManifest(raw) {
  const notes = [];
  if (!object(raw)) return { manifest: raw, notes };
  const manifest = clone(raw);
  const note = (location, message) => notes.push({ path: location, message });
  const refs = (owner, location) => {
    if (!Array.isArray(owner?.sourceRefs)) return;
    owner.sourceRefs = owner.sourceRefs.map((ref, i) => {
      if (typeof ref !== 'string') return ref;
      const [source, ...rest] = ref.split('#');
      note(`${location}.sourceRefs[${i}]`, `Normalized "${ref}" to { source, section }`);
      return rest.length ? { source, section: rest.join('#') } : { source };
    });
  };
  for (const [index, source] of list(manifest.sources).entries()) {
    if (!object(source)) continue;
    if (Array.isArray(source.sections)) source.sections = source.sections.map((section, i) => {
      if (typeof section !== 'string') return section;
      note(`sources[${index}].sections[${i}]`, `Normalized "${section}" to { anchor }`);
      return { anchor: section };
    });
  }
  for (const [index, group] of list(manifest.groups).entries()) if (object(group)) refs(group, `groups[${index}]`);
  for (const [index, workflow] of list(manifest.workflows).entries()) {
    if (!object(workflow)) continue;
    refs(workflow, `workflows[${index}]`);
    for (const [i, action] of list(workflow.actions).entries()) {
      if (!object(action)) continue;
      refs(action, `workflows[${index}].actions[${i}]`);
      if (Array.isArray(action.folded)) action.folded = action.folded.map((folded, j) => {
        if (typeof folded !== 'string') return folded;
        note(`workflows[${index}].actions[${i}].folded[${j}]`, 'Normalized a folded step string to { summary }');
        return { summary: folded };
      });
    }
    for (const [i, grant] of list(workflow.access?.grants).entries()) if (object(grant)) refs(grant, `workflows[${index}].access.grants[${i}]`);
  }
  for (const [index, decision] of list(manifest.decisions).entries()) if (object(decision)) refs(decision, `decisions[${index}]`);
  for (const [index, form] of list(manifest.forms).entries()) {
    if (object(form) && form.title == null && text(form.name)) { form.title = form.name; delete form.name; note(`forms[${index}].name`, 'Normalized `name` to `title`'); }
  }
  return { manifest, notes };
}

/** Group keys the manifest actions assign, including `field:` fallbacks (whose role group owns work per case). */
function assignedGroupsOf(workflow, groupKeys) {
  const keys = new Set();
  for (const action of list(workflow.actions)) {
    const ref = action?.assigneeRef;
    if (text(ref) && !ref.startsWith('ai:') && !ref.startsWith('field:') && !['creator', 'previous'].includes(ref) && groupKeys.has(ref)) keys.add(ref);
    if (text(ref) && ref.startsWith('field:') && text(action.assigneeFallback) && groupKeys.has(action.assigneeFallback)) keys.add(action.assigneeFallback);
  }
  return keys;
}

function readWorkflowFile(workflow, baseDir) {
  if (!text(workflow.file) || !baseDir) return { file: null };
  const file = path.resolve(baseDir, workflow.file);
  if (!existsSync(file)) return { file, missing: true };
  try {
    const source = readFileSync(file, 'utf8');
    const parsed = engine.parseYamlToDraft(source);
    if (!parsed.draft || parsed.syntaxErrors.length) return { file, broken: true };
    return { file, source, draft: parsed.draft };
  } catch { return { file, broken: true }; }
}

/** Returns { errors, warnings, infos }. Errors make the manifest unusable; warnings are design gaps the map also shows; infos are reported, never blocking. */
export function checkManifest(input, baseDir) {
  const errors = [], warnings = [], infos = [];
  const error = (location, message) => errors.push({ path: location, message });
  const warn = (location, message) => warnings.push({ path: location, message });
  const info = (location, message) => infos.push({ path: location, message });
  if (!object(input) || ![SCHEMA, LEGACY_SCHEMA].includes(input.schemaVersion)) return { errors: [{ path: 'schemaVersion', message: `Expected ${SCHEMA}` }], warnings, infos };
  const { manifest, notes } = normalizeManifest(input);
  for (const item of notes) warn(item.path, item.message);
  if (manifest.schemaVersion === LEGACY_SCHEMA) warn('schemaVersion', `Legacy ${LEGACY_SCHEMA}; write ${SCHEMA}. The access rules apply either way; scripts/reconcile-access.mjs proposes the missing access sections`);
  const project = manifest.project;
  if (!object(project)) error('project', 'Missing project block');
  else {
    for (const name of ['key', 'title', 'language', 'country']) if (!text(project[name])) error(`project.${name}`, 'Required text');
    if (text(project.key) && !KEY.test(project.key)) error('project.key', 'Use a stable ASCII identifier');
  }
  const organization = manifest.organization;
  const connected = object(organization) && organization.mode === 'connected';
  if (!object(organization)) error('organization', 'Missing organization block');
  else if (!['disconnected', 'connected'].includes(organization.mode)) error('organization.mode', 'Use disconnected or connected');
  else if (connected && !(text(organization.tenantId) && text(organization.productRevision))) error('organization', 'Connected mode requires tenantId and productRevision from org_get_context');

  const unique = (items, location, field) => {
    const seen = new Set();
    for (const [index, item] of items.entries()) {
      const value = item?.[field];
      if (!text(value) || !KEY.test(value)) error(`${location}[${index}].${field}`, 'Required stable ASCII identifier');
      else if (seen.has(value)) error(`${location}[${index}].${field}`, `Duplicate ${field} ${value}`);
      seen.add(value);
    }
    return seen;
  };
  for (const name of ['sources', 'entityTypes', 'groups', 'workflows', 'forms', 'aiProfiles', 'decisions', 'receipts']) {
    if (manifest[name] !== undefined && !Array.isArray(manifest[name])) error(name, 'Must be an array');
  }
  const sources = list(manifest.sources), groups = list(manifest.groups), workflows = list(manifest.workflows);
  const forms = list(manifest.forms), profiles = list(manifest.aiProfiles), decisions = list(manifest.decisions), receipts = list(manifest.receipts);
  const sourceIds = unique(sources, 'sources', 'id');
  const sections = new Map();
  const sourceEmails = new Set();
  for (const [index, source] of sources.entries()) {
    if (!text(source.title)) error(`sources[${index}].title`, 'Required');
    if (!SOURCE_KINDS.has(source.kind)) error(`sources[${index}].kind`, 'Unknown source kind');
    const anchors = new Set();
    for (const [i, section] of list(source.sections).entries()) {
      if (!object(section) || !text(section.anchor)) error(`sources[${index}].sections[${i}]`, 'Section needs an anchor');
      else if (anchors.has(section.anchor)) error(`sources[${index}].sections[${i}]`, `Duplicate anchor ${section.anchor}`);
      else anchors.add(section.anchor);
    }
    for (const [i, email] of list(source.emails).entries()) {
      if (!text(email) || !EMAIL.test(email)) error(`sources[${index}].emails[${i}]`, 'Not an email address');
      else sourceEmails.add(email.toLowerCase());
    }
    if (text(source.id)) sections.set(source.id, anchors);
  }
  const checkSourceRefs = (refs, location) => {
    let ok = 0;
    for (const [i, ref] of list(refs).entries()) {
      if (!object(ref) || !sourceIds.has(ref.source)) { error(`${location}[${i}]`, 'Unknown source id'); continue; }
      const anchors = sections.get(ref.source);
      if (ref.section !== undefined && anchors.size && !anchors.has(ref.section)) { error(`${location}[${i}].section`, `Source ${ref.source} has no section ${ref.section}`); continue; }
      ok += 1;
    }
    return ok;
  };
  const typeKeys = unique(list(manifest.entityTypes), 'entityTypes', 'key');
  if (list(manifest.entityTypes).length) {
    try { validateTypes(manifest.entityTypes); } catch (caught) { error('entityTypes', caught.message); }
  }
  // Groups: shape, one level of sub-groups, members with verification evidence, unique tenant names.
  const groupKeys = unique(groups, 'groups', 'key');
  const parents = new Map(groups.map(group => [group.key, group.parentKey ?? null]));
  const verifiedEmails = new Set();
  const unverifiedMembers = [];
  const names = new Map();
  for (const [index, group] of groups.entries()) {
    if (!text(group.name)) error(`groups[${index}].name`, 'Required');
    else {
      const name = group.name.normalize('NFC').trim().toLowerCase();
      if (names.has(name)) warn(`groups[${index}].name`, `Groups ${names.get(name)} and ${group.key} share the name "${group.name}"; the importer reports the grant ambiguous and drops it`);
      else names.set(name, group.key);
    }
    if (group.kind !== undefined && !GROUP_KINDS.includes(group.kind)) error(`groups[${index}].kind`, `Use ${GROUP_KINDS.join(', ')}`);
    if (group.membersComplete !== undefined && typeof group.membersComplete !== 'boolean') error(`groups[${index}].membersComplete`, 'membersComplete is a boolean: true only when members[] is the tenant group\'s complete list');
    if (group.membersComplete === true && list(group.members).some(member => object(member) && member.email && member.verified !== true)) warn(`groups[${index}].membersComplete`, 'A complete member list with unverified emails is a contradiction; verify them or drop the flag');
    if (group.area !== undefined && group.area !== null && !(text(group.area) && KEY.test(group.area))) error(`groups[${index}].area`, 'Area is a short ASCII key');
    if (group.parentKey != null) {
      if (!groupKeys.has(group.parentKey)) error(`groups[${index}].parentKey`, 'Unknown group key');
      else if (parents.get(group.parentKey)) error(`groups[${index}].parentKey`, 'Provia allows one level of sub-groups; the parent already has a parent');
      if (group.parentKey === group.key) error(`groups[${index}].parentKey`, 'A group cannot be its own parent');
    }
    for (const [i, member] of list(group.members).entries()) {
      const at = `groups[${index}].members[${i}]`;
      if (!object(member) || !(text(member.role) || text(member.email))) { error(at, 'A member needs a role or an email'); continue; }
      if (member.email != null && !EMAIL.test(member.email)) error(`${at}.email`, 'Not an email address; never use IDs here');
      else if (member.email != null) {
        if (member.verified === true) {
          verifiedEmails.add(member.email.toLowerCase());
          if (!(text(member.source) && (member.source === 'users_search' || sourceIds.has(member.source)))) warn(`${at}.source`, 'A verified email names its evidence: a source id or users_search');
        } else { unverifiedMembers.push({ group: group.key, email: member.email }); info(`${at}.email`, `${member.email} is unverified: no declared source and no users_search result`); }
      }
    }
    for (const [i, flag] of list(group.flags).entries()) {
      if (!object(flag) || !GROUP_FLAGS.has(flag.code)) error(`groups[${index}].flags[${i}]`, 'Unknown flag code');
    }
    checkSourceRefs(group.sourceRefs, `groups[${index}].sourceRefs`);
  }
  const areaOf = key => groups.find(group => group.key === key)?.area ?? null;
  const workflowKeys = unique(workflows, 'workflows', 'key');
  const formKeys = unique(forms, 'forms', 'key');
  const profileKeys = unique(profiles, 'aiProfiles', 'key');
  // Rule 2: connected mode trusts the tenant's published level list (setup_references_list.permissionLevels) when the manifest recorded it.
  const tenantLevels = list(organization?.permissionLevels?.resourceTypes?.workflow?.levels).map(level => level?.level).filter(text);
  if (connected && object(organization?.permissionLevels) && !tenantLevels.length) warn('organization.permissionLevels', 'permissionLevels carries no resourceTypes.workflow.levels; the bundled list is used');
  const levels = connected && tenantLevels.length ? tenantLevels : LEVELS;
  const receiptIndexByKey = new Map();
  for (const receipt of receipts) if (object(receipt) && RESOLVING.has(receipt.outcome) && object(receipt.ref)) receiptIndexByKey.set(`${receipt.ref.kind}:${receipt.ref.key}`, receipt);
  const actionsByWorkflow = new Map();
  const ownedGroups = new Set();
  const workflowArea = new Map(workflows.map(workflow => [workflow.key, workflow.ownerArea ?? null]));
  for (const [index, workflow] of workflows.entries()) {
    const at = `workflows[${index}]`;
    if (!text(workflow.name)) error(`${at}.name`, 'Required');
    if (workflow.prefix !== undefined && !/^[A-Z0-9]{2,10}$/.test(workflow.prefix)) error(`${at}.prefix`, 'Prefix is 2–10 uppercase alphanumeric characters');
    if (workflow.status !== undefined && !WORKFLOW_STATUS.has(workflow.status)) error(`${at}.status`, 'Unknown workflow status');
    if (workflow.ownerArea !== undefined && workflow.ownerArea !== null && !(text(workflow.ownerArea) && KEY.test(workflow.ownerArea))) error(`${at}.ownerArea`, 'Owner area is a short ASCII key');
    checkSourceRefs(workflow.sourceRefs, `${at}.sourceRefs`);
    const yaml = readWorkflowFile(workflow, baseDir);
    const yamlFields = new Map(list(yaml.draft?.fields).map(field => [field?.name, field]));
    const localIds = unique(list(workflow.actions), `${at}.actions`, 'localId');
    actionsByWorkflow.set(workflow.key, localIds);
    const templateCodes = new Set(list(workflow.templates).map(template => template?.code));
    for (const [i, template] of list(workflow.templates).entries()) {
      if (!object(template) || !text(template.code) || !text(template.title)) error(`${at}.templates[${i}]`, 'A template needs code and title');
      if (object(template) && template.scope !== undefined && !TEMPLATE_SCOPES.includes(template.scope)) error(`${at}.templates[${i}].scope`, 'Use workflow or action');
    }
    const citedCodes = new Set();
    for (const [i, unresolved] of [...list(workflow.unresolvedActors).map(item => ['unresolvedActors', item]), ...list(workflow.unresolvedEntityTypes).map(item => ['unresolvedEntityTypes', item])].entries()) {
      const [field, item] = unresolved;
      if (!(text(item) || (object(item) && (text(item.key) || text(item.name))))) error(`${at}.${field}[${i}]`, 'Record the key or name the registry lacks');
    }
    const filledBefore = new Set();
    for (const form of forms) if (form.kind === 'trigger' && form.workflowRef === workflow.key) for (const field of list(form.fields)) filledBefore.add(typeof field === 'string' ? field : field?.key ?? field?.name);
    const admins = new Set(list(workflow.access?.grants).filter(grant => object(grant) && grant.level === 'admin').map(grant => parseGrantee(grant.grantee)).filter(parsed => parsed?.kind === 'group').map(parsed => parsed.ref));
    for (const [i, action] of list(workflow.actions).entries()) {
      const loc = `${at}.actions[${i}]`;
      if (!text(action.name)) error(`${loc}.name`, 'Required');
      if (!ACTION_TYPES.has(action.type)) error(`${loc}.type`, 'Unsupported action type');
      checkSourceRefs(action.sourceRefs, `${loc}.sourceRefs`);
      const ref = action.assigneeRef;
      if (ref != null) {
        if (!text(ref)) error(`${loc}.assigneeRef`, 'Use a group key, creator, previous, ai:<profile key> or field:<field key>');
        else if (ref.startsWith('ai:')) { if (!profileKeys.has(ref.slice(3))) error(`${loc}.assigneeRef`, 'Unknown AI profile key'); }
        else if (ref.startsWith('field:')) {
          // Design intent only: neither the contract nor the backend assigns from a case field. The fallback is what the YAML carries.
          const fieldKey = ref.slice(6);
          const fallback = action.assigneeFallback;
          if (!text(fallback)) error(`${loc}.assigneeFallback`, `field:${fieldKey} needs a fallback (a role group key or creator) that the YAML can carry`);
          else if (fallback !== 'creator' && !groupKeys.has(fallback)) error(`${loc}.assigneeFallback`, `Unknown group key ${fallback}`);
          else if (fallback !== 'creator') ownedGroups.add(fallback);
          if (yaml.draft) {
            const field = yamlFields.get(fieldKey);
            if (!field) error(`${loc}.assigneeRef`, `Field ${fieldKey} does not exist in ${workflow.file}`);
            else if (field.type !== 'user') error(`${loc}.assigneeRef`, `Field ${fieldKey} is ${field.type}, not user`);
          } else warn(`${loc}.assigneeRef`, `Cannot verify field ${fieldKey}: no parsed workflow file next to the manifest`);
          if (!filledBefore.has(fieldKey)) warn(`${loc}.assigneeRef`, `Field ${fieldKey} is not filled by an earlier action (setsFields) or the intake form before this action runs`);
        } else if (!['creator', 'previous'].includes(ref)) {
          if (!groupKeys.has(ref)) error(`${loc}.assigneeRef`, `Unknown group key ${ref}`);
          else { ownedGroups.add(ref); if (action.type === 'decision' && admins.has(ref)) warn(`${loc}.assigneeRef`, `Group ${ref} holds admin on this workflow and also decides ${action.localId}; review segregation`); }
        }
      } else if (HUMAN.includes(action.type)) warn(`${loc}.assigneeRef`, `Action ${action.localId} has no owner`);
      for (const key of list(action.setsFields)) if (text(key)) filledBefore.add(key);
      if (action.formRef != null && !formKeys.has(action.formRef)) error(`${loc}.formRef`, 'Unknown form key');
      else if (action.formRef != null) for (const field of list(forms.find(form => form.key === action.formRef)?.fields)) filledBefore.add(typeof field === 'string' ? field : field?.key ?? field?.name);
      if (action.type === 'form_fill' && action.formRef == null) warn(`${loc}.formRef`, `Form Fill action ${action.localId} has no form yet`);
      for (const [j, key] of list(action.entityRefs).entries()) if (!typeKeys.has(key)) error(`${loc}.entityRefs[${j}]`, `Unknown entity type key ${key}`);
      for (const [j, folded] of list(action.folded).entries()) if (!object(folded) || !text(folded.summary)) error(`${loc}.folded[${j}]`, 'A folded step needs a summary');
      if (action.due != null && !(object(action.due) && (Number.isInteger(action.due.offsetDays) || Number.isInteger(action.due.offsetHours)))) error(`${loc}.due`, 'due needs integer offsetDays or offsetHours');
      if (action.dueInSource != null && !(object(action.dueInSource) && text(action.dueInSource.text) && DUE_IN_SOURCE_KINDS.includes(action.dueInSource.kind))) error(`${loc}.dueInSource`, `dueInSource needs text and kind (${DUE_IN_SOURCE_KINDS.join(', ')})`);
      const description = [action.description, list(yaml.draft?.actions).find(item => item?.id === action.localId)?.description].filter(text).join('\n');
      for (const code of description.match(TEMPLATE_CODE) ?? []) citedCodes.add(code);
    }
    for (const code of citedCodes) if (!templateCodes.has(code)) warn(`${at}.templates`, `Template ${code} is cited in a description but has no templates[] entry`);
    for (const [i, key] of list(workflow.subWorkflowRefs).entries()) {
      if (!workflowKeys.has(key)) error(`${at}.subWorkflowRefs[${i}]`, `Unknown workflow key ${key}`);
      else if (key === workflow.key) error(`${at}.subWorkflowRefs[${i}]`, 'A workflow cannot be its own sub-workflow');
      else if (workflow.ownerArea && workflowArea.get(key) && workflowArea.get(key) !== workflow.ownerArea) info(`${at}.subWorkflowRefs[${i}]`, `Cross-area edge: ${workflow.key} (${workflow.ownerArea}) calls ${key} (${workflowArea.get(key)}); unaffected by grants, the platform creates the child for the decider`);
    }
    // Triggers as data: manual allowlists are start restrictions below the create_incident holders (rule 8).
    for (const [i, trigger] of list(workflow.triggers).entries()) {
      const loc = `${at}.triggers[${i}]`;
      if (!object(trigger) || !TRIGGER_TYPES.includes(trigger.type)) { error(loc, `A trigger needs type (${TRIGGER_TYPES.join(', ')})`); continue; }
      if (trigger.manual != null && trigger.type !== 'manual') error(`${loc}.manual`, 'Only a manual trigger has an allowlist');
      for (const [j, key] of list(trigger.manual?.allowedGroups).entries()) {
        if (!groupKeys.has(key)) error(`${loc}.manual.allowedGroups[${j}]`, UUID.test(String(key)) ? 'Use the group key; the id comes from the receipt' : `Unknown group key ${key}`);
        else if (connected && !receiptIndexByKey.has(`group:${key}`)) error(`${loc}.manual.allowedGroups[${j}]`, `No receipt resolves group ${key}; the allowlist cannot be written and must not be dropped`);
      }
      for (const [j, email] of list(trigger.manual?.allowedUsers).entries()) {
        if (!text(email) || !EMAIL.test(email)) error(`${loc}.manual.allowedUsers[${j}]`, 'Use the member email, never an id');
        else if (connected && !receiptIndexByKey.has(`user:${email.toLowerCase()}`)) error(`${loc}.manual.allowedUsers[${j}]`, `No users_search receipt resolves ${email}; the allowlist cannot be written and must not be dropped`);
      }
      if (trigger.manual?.applied != null && !(object(trigger.manual.applied) && text(trigger.manual.applied.at) && instant(trigger.manual.applied.at) !== null && text(trigger.manual.applied.hash))) error(`${loc}.manual.applied`, 'applied records when and which restriction was written to the tenant: { at: <ISO 8601 date-time>, hash, by? }; the hash comes from the apply_manual_start item');
      else if (object(trigger.manual?.applied)) {
        const workflowReceipt = receiptIndexByKey.get(`workflow:${workflow.key}`);
        if (!workflowReceipt) warn(`${loc}.manual.applied`, 'The allowlist is recorded as applied but no receipt resolves the workflow; readiness stays blocked');
        else if (trigger.manual.applied.hash !== allowlistFingerprint(trigger, workflowReceipt.resource?.id, receiptIndexByKey)) warn(`${loc}.manual.applied`, 'The recorded application is for a different allowlist, different principal ids or another workflow; the current restriction is not applied and readiness stays blocked');
      }
    }
    // An enabled manual trigger in the workflow file that the manifest does not describe bypasses a declared restriction.
    const manifestManual = list(workflow.triggers).filter(trigger => trigger?.type === 'manual');
    if (yaml.draft && manifestManual.some(trigger => (trigger.manual?.allowedGroups?.length ?? 0) + (trigger.manual?.allowedUsers?.length ?? 0) > 0)) {
      const yamlManual = list(yaml.draft.triggers).filter(trigger => trigger?.type === 'manual');
      for (const [i, trigger] of yamlManual.entries()) {
        const described = trigger.label ? manifestManual.some(spec => spec.label === trigger.label) : Boolean(manifestManual[i] && !manifestManual[i].label);
        if (!described && trigger.enabled !== false) error(`${at}.file`, `Enabled manual trigger "${trigger.label ?? i}" in ${workflow.file} has no manifest counterpart; it admits everyone with the start permission and bypasses the declared restriction`);
      }
    }
    checkAccess(workflow, { at, groups, groupKeys, receiptIndexByKey, verifiedEmails, sourceEmails, checkSourceRefs, areaOf, connected, levels, yaml, error, warn, info });
    if (yaml.file) {
      if (yaml.missing) warn(`${at}.file`, `${workflow.file} not found next to the manifest`);
      else if (yaml.broken) error(`${at}.file`, `${workflow.file} could not be parsed`);
      else {
        const draft = yaml.draft;
        const yamlIds = list(draft.actions).map(action => action?.id);
        const manifestIds = [...localIds];
        if (yamlIds.join('\n') !== manifestIds.join('\n')) error(`${at}.file`, `Action ids in ${workflow.file} (${yamlIds.join(', ')}) differ from the manifest (${manifestIds.join(', ')})`);
        if (workflow.prefix && draft.metadata?.prefix !== workflow.prefix) error(`${at}.file`, `Prefix in ${workflow.file} differs from the manifest`);
        if (/^permissions\s*:/m.test(yaml.source)) error(`${at}.file`, `${workflow.file} carries a permissions: key; the engine rejects it (schema.unknown_key). Emit access instead`);
        if (ENGINE_SUPPORTS_ACCESS && list(workflow.access?.grants).length && !object(draft.access)) warn(`${at}.file`, `${workflow.file} has no access section while the manifest declares grants; run scripts/emit-workflow-access.mjs`);
      }
    }
  }
  for (const group of groups) {
    if (ownedGroups.has(group.key) || group.kind === 'container') continue;
    if (!list(group.flags).some(flag => ['requester', 'external'].includes(flag.code))) warn(`groups.${group.key}`, `Group ${group.key} owns no action`);
  }
  for (const [index, form] of forms.entries()) {
    const at = `forms[${index}]`;
    if (!text(form.title)) error(`${at}.title`, 'Required');
    if (!['trigger', 'action'].includes(form.kind)) error(`${at}.kind`, 'Use trigger or action');
    if (form.status !== undefined && !FORM_STATUS.has(form.status)) error(`${at}.status`, 'Unknown form status');
    if (!workflowKeys.has(form.workflowRef)) error(`${at}.workflowRef`, 'Unknown workflow key');
    else if (form.kind === 'action') {
      const ids = actionsByWorkflow.get(form.workflowRef);
      if (!ids?.has(form.actionRef)) error(`${at}.actionRef`, 'Unknown action in that workflow');
      else {
        const action = workflows.find(w => w.key === form.workflowRef).actions.find(a => a.localId === form.actionRef);
        if (action.type !== 'form_fill') error(`${at}.actionRef`, 'An action form must point at a form_fill action');
      }
    } else if (form.actionRef != null) error(`${at}.actionRef`, 'A trigger form has no actionRef');
  }
  for (const [index, profile] of profiles.entries()) {
    if (!text(profile.name)) error(`aiProfiles[${index}].name`, 'Required');
    if (profile.workflowRef != null && !workflowKeys.has(profile.workflowRef)) error(`aiProfiles[${index}].workflowRef`, 'Unknown workflow key');
  }
  unique(decisions, 'decisions', 'id');
  for (const [index, decision] of decisions.entries()) {
    if (!text(decision.question)) error(`decisions[${index}].question`, 'Required');
    if (!['open', 'resolved'].includes(decision.status)) error(`decisions[${index}].status`, 'Use open or resolved');
    else if (decision.status === 'resolved' && !text(decision.resolution)) error(`decisions[${index}].resolution`, 'A resolved decision records its resolution');
    else if (decision.status === 'open' && !text(decision.owner)) warn(`decisions[${index}].owner`, `Open decision ${decision.id} has no owner`);
    checkSourceRefs(decision.sourceRefs, `decisions[${index}].sourceRefs`);
  }
  const keysByKind = { entity_type: typeKeys, group: groupKeys, workflow: workflowKeys, form: formKeys, access: workflowKeys, tag: null, user: null };
  for (const [index, receipt] of receipts.entries()) {
    const at = `receipts[${index}]`;
    if (!object(receipt) || !text(receipt.tool) || !text(receipt.outcome)) { error(at, 'A receipt needs tool and outcome'); continue; }
    if (!object(receipt.ref) || !RECEIPT_KINDS.has(receipt.ref.kind)) { error(`${at}.ref`, 'ref.kind must be entity_type, group, workflow, form, tag, access or user'); continue; }
    const keys = keysByKind[receipt.ref.kind];
    if (keys && !keys.has(receipt.ref.key)) error(`${at}.ref.key`, `No ${receipt.ref.kind === 'access' ? 'workflow' : receipt.ref.kind} with key ${receipt.ref.key}`);
    if (receipt.ref.kind === 'user' && !(text(receipt.ref.key) && EMAIL.test(receipt.ref.key) && receipt.ref.key === receipt.ref.key.toLowerCase())) error(`${at}.ref.key`, 'A user receipt (users_search) is keyed by the lower-case email');
    if (RESOLVING.has(receipt.outcome) && !text(receipt.resource?.id)) error(`${at}.resource.id`, 'A resolving receipt carries the destination id');
  }
  return { errors, warnings, infos };
}

/** Rules 1–8 for one workflow's `access`; see references/workflow-access.md. */
function checkAccess(workflow, ctx) {
  const { at, groups, groupKeys, receiptIndexByKey, verifiedEmails, sourceEmails, checkSourceRefs, areaOf, connected, levels, yaml, error, warn, info } = ctx;
  const access = workflow.access;
  const loc = `${at}.access`;
  if (access !== undefined && !object(access)) { error(loc, 'access is an object'); return; }
  const grants = list(access?.grants);
  if (!grants.length && access?.default !== 'creator_only') { error(loc, 'Every workflow declares access: at least one grant, or default: creator_only (rule 3)'); }
  if (access === undefined) return;
  if (access.default !== undefined && !ACCESS_DEFAULTS.includes(access.default)) error(`${loc}.default`, `Use ${ACCESS_DEFAULTS.join(', ')}`);
  if (access.sensitivity !== undefined && !SENSITIVITIES.includes(access.sensitivity)) error(`${loc}.sensitivity`, `Use ${SENSITIVITIES.join(', ')}`);
  if (grants.length > MAX_GRANTS) error(`${loc}.grants`, `At most ${MAX_GRANTS} grants`);
  const restricted = access.sensitivity === 'restricted';
  const assigned = assignedGroupsOf(workflow, groupKeys);
  const granted = new Set();
  const seen = new Set();
  let starters = 0, organizationStarter = false;
  for (const [i, grant] of grants.entries()) {
    const g = `${loc}.grants[${i}]`;
    if (!object(grant)) { error(g, 'A grant is { grantee, level, reason, sourceRefs }'); continue; }
    if (Array.isArray(grant.level)) { error(`${g}.level`, 'One level per grant; the levels are cumulative'); continue; }
    if (!levels.includes(grant.level)) { error(`${g}.level`, `Use one of ${levels.join(', ')}${levels !== LEVELS ? ' (tenant list from setup_references_list.permissionLevels)' : ''} (rule 2)`); continue; }
    const parsed = parseGrantee(grant.grantee);
    if (!parsed) { error(`${g}.grantee`, typeof grant.grantee === 'string' && UUID.test(grant.grantee.replace(/^(group|user):/, '')) ? 'Never a UUID: use group:<key>, user:<email>, organization or creator' : 'Use group:<key>, user:<email>, organization or creator'); continue; }
    if (seen.has(`${parsed.kind}:${parsed.ref}`)) error(`${g}.grantee`, `Duplicate grantee ${grant.grantee}; keep the highest level`);
    seen.add(`${parsed.kind}:${parsed.ref}`);
    if (!text(grant.reason)) warn(`${g}.reason`, 'A grant without a reason cannot be reviewed with the customer');
    const refs = checkSourceRefs(grant.sourceRefs, `${g}.sourceRefs`);
    if (parsed.kind === 'creator') { if (grant.level !== 'admin') warn(`${g}.level`, 'The creator always has admin; this row is documentation and the importer drops it'); continue; }
    if (parsed.kind === 'group') {
      if (!groupKeys.has(parsed.ref)) { error(`${g}.grantee`, `Unknown group key ${parsed.ref} (rule 1)`); continue; }
      granted.add(parsed.ref);
      if (assigned.has(parsed.ref) && atLeast(grant.level, 'view') && !(text(grant.reason) && refs > 0)) {
        const message = `Group ${parsed.ref} executes actions of this workflow and already sees its own cases; a workflow-level ${grant.level} exposes every case and needs a reason with sourceRefs (rule 4)`;
        if (restricted) error(`${g}`, message); else warn(`${g}`, message);
      }
      const area = areaOf(parsed.ref);
      if (atLeast(grant.level, 'create_incident') && workflow.ownerArea && area && area !== workflow.ownerArea) info(`${g}`, `Cross-area start: ${parsed.ref} (${area}) may open ${workflow.key} (${workflow.ownerArea}) (rule 7)`);
    }
    if (parsed.kind === 'user' && !(verifiedEmails.has(parsed.ref) || sourceEmails.has(parsed.ref))) error(`${g}.grantee`, `${parsed.ref} is not a verified member (groups[].members[].verified) and appears in no sources[].emails (rule 1)`);
    if (parsed.kind === 'organization') {
      if (restricted && atLeast(grant.level, 'view')) error(`${g}`, 'A restricted workflow cannot grant view-or-above to the organization (rule 5)');
      if (atLeast(grant.level, 'create_incident')) organizationStarter = true;
    }
    if (atLeast(grant.level, 'create_incident')) {
      starters += 1;
      if (restricted) (text(access.note) ? info : warn)(`${g}`, `${grant.grantee} may open cases and therefore sees every case of this restricted workflow${text(access.note) ? '; limitation recorded in access.note' : '; record the limitation in access.note and decisions[]'} (rule 5)`);
    }
  }
  for (const key of assigned) if (!granted.has(key)) info(`${loc}`, `Assigned group ${key} holds no workflow grant: its members see the cases that carry their actions (rule 4)`);
  // Rule 8: allowlists narrow the start permission; check they leave someone able to start.
  const manual = list(workflow.triggers).filter(trigger => trigger?.type === 'manual' && trigger.enabled !== false);
  const restrictedTriggers = manual.filter(trigger => (trigger.manual?.allowedGroups?.length ?? 0) + (trigger.manual?.allowedUsers?.length ?? 0) > 0);
  if (restrictedTriggers.length) {
    if (organizationStarter && starters === 1) info(`${at}.triggers`, 'The allowlist deliberately narrows manual starts below the organization-wide create_incident grant; organization Owners outside it are refused too (rule 8)');
    const result = whoCanStart(workflow, groups);
    if (result && !result.able.length) {
      const evidence = result.unknown.length ? ` Missing evidence: ${result.unknown.join('; ')}.` : '';
      if (result.determinable) error(`${at}.triggers`, 'The enabled manual triggers admit nobody: the allowlisted groups have no members and no user is listed, so no one can start (rule 8)');
      else warn(`${at}.triggers`, `Cannot determine who can start manually: the admitted set and the explicit create_incident holders share no verified member.${evidence}${connected ? ' Connected mode cannot ask canStart for another member; keep the verification step in setup.md.' : ''} (rule 8)`);
    }
  }
  // Retained tenant grants (applied[] read back from workflow_get.access) are judged like proposals.
  for (const [i, held] of list(access.applied).entries()) if (!object(held) || !['group', 'user', 'organization'].includes(held.granteeType) || !text(held.granteeRef) || !LEVELS.includes(held.level)) error(`${loc}.applied[${i}]`, 'applied[] entries are { granteeType, granteeRef, granteeId?, level, id? } from workflow_get.access');
  for (const held of retainedExcess(workflow, groups, receiptIndexByKey)) {
    const block = retainedBlock(held, workflow, assigned);
    const label = `${held.granteeType}:${held.granteeRef} at ${held.level}${held.approvedLevel ? ` (approved ${held.approvedLevel})` : ' (not in the manifest)'}`;
    if (block) warn(`${loc}.applied`, `Readiness blocked: the tenant retains ${label}; ${block}`);
    else info(`${loc}.applied`, `The tenant retains ${label}; merge never revokes, review it`);
  }
  for (const [i, entry] of (Array.isArray(access.startVerification) ? access.startVerification : access.startVerification !== undefined ? [access.startVerification] : []).entries()) {
    if (!(object(entry) && text(entry.member) && EMAIL.test(entry.member) && text(entry.at) && text(entry.hash) && (['canStart', 'cannot_start'].includes(entry.result) || typeof entry.canStart === 'boolean'))) error(`${loc}.startVerification[${i}]`, 'A start verification records { member: <email>, at, result: canStart | cannot_start, hash } with the hash of the allowlist it verified');
    else if (instant(entry.at) === null) error(`${loc}.startVerification[${i}].at`, 'at must be an ISO 8601 date-time (e.g. 2026-09-21T09:30:00Z); verifications are ordered by the instant they denote');
  }
  if (access.appliedWorkflowId !== undefined && !text(access.appliedWorkflowId)) error(`${loc}.appliedWorkflowId`, 'appliedWorkflowId is the workflow id the read-back came from');
  else if (text(access.appliedWorkflowId)) {
    const current = receiptIndexByKey.get(`workflow:${workflow.key}`)?.resource?.id;
    if (current && current !== access.appliedWorkflowId) warn(`${loc}.applied`, `The read-back came from workflow ${access.appliedWorkflowId}, not the current destination ${current}; no grant counts as applied and no retained grant is judged until the destination is read again`);
  }
  for (const [i, operation] of list(access.operations).entries()) {
    if (!object(operation) || !Number.isInteger(operation.revision) || !text(operation.idempotencyKey) || !text(operation.hash) || !object(operation.payload)) error(`${loc}.operations[${i}]`, 'An operation records revision, idempotencyKey, hash and the complete payload it was minted for');
  }
  if (yaml?.draft && object(yaml.draft.access) && !ENGINE_SUPPORTS_ACCESS) warn(`${at}.file`, 'The bundled engine predates access in the portable document; keep the section in access.yaml');
}

/** Index of resolving receipts by kind:key. */
export function receiptIndex(manifest) {
  const index = new Map();
  for (const receipt of list(manifest.receipts)) {
    if (RESOLVING.has(receipt.outcome) && receipt.ref) index.set(`${receipt.ref.kind}:${receipt.ref.key}`, receipt);
  }
  return index;
}

/** Everything the map and the handover need: nodes, edges, unresolved items, the access matrix and readiness. */
export function analyze(input) {
  const manifest = normalizeManifest(input).manifest;
  const receipts = receiptIndex(manifest);
  const resolved = (kind, key) => receipts.get(`${kind}:${key}`) ?? null;
  const unresolved = [];
  const add = (item) => unresolved.push(item);
  const nodes = [], edges = [];
  const node = (id, kind, label, data, status = 'neutral') => { nodes.push({ id, kind, label, data, status }); return id; };
  const edge = (from, to, kind, status = 'neutral') => edges.push({ from, to, kind, status });
  const sectionNodes = new Set();
  const sourceNode = (ref) => {
    if (!ref?.source) return null;
    if (ref.section == null) return `source:${ref.source}`;
    const id = `section:${ref.source}:${ref.section}`;
    sectionNodes.add(id);
    return id;
  };
  const groups = list(manifest.groups);
  const groupKeys = new Set(groups.map(group => group.key));
  for (const source of list(manifest.sources)) node(`source:${source.id}`, 'source', source.title, source);
  for (const type of list(manifest.entityTypes)) {
    const receipt = resolved('entity_type', type.key);
    node(`entity:${type.key}`, 'entity_type', type.name, type, receipt ? 'resolved' : 'unresolved');
    if (!receipt) add({ kind: 'entity_type', key: type.key, name: type.name, what: 'create_entity_type' });
  }
  for (const group of groups) {
    const receipt = resolved('group', group.key);
    node(`group:${group.key}`, 'group', group.name, group, receipt ? 'resolved' : 'unresolved');
    if (!receipt) add({ kind: 'group', key: group.key, name: group.name, what: 'create_group', members: list(group.members) });
    for (const flag of list(group.flags)) add({ kind: 'group', key: group.key, name: group.name, what: `flag_${flag.code}`, detail: flag.detail });
    for (const member of list(group.members)) if (member?.email && member.verified !== true) add({ kind: 'group', key: group.key, name: group.name, what: 'verify_email', ref: member.email });
    if (group.parentKey) edge(`group:${group.parentKey}`, `group:${group.key}`, 'parent');
    for (const ref of list(group.sourceRefs)) { const from = sourceNode(ref); if (from) edge(from, `group:${group.key}`, 'justifies'); }
  }
  for (const profile of list(manifest.aiProfiles)) {
    node(`ai:${profile.key}`, 'ai_profile', profile.name, profile, 'unresolved');
    add({ kind: 'ai_profile', key: profile.key, name: profile.name, what: 'configure_ai_profile' });
  }
  for (const form of list(manifest.forms)) {
    const receipt = resolved('form', form.key);
    node(`form:${form.key}`, 'form', form.title, form, receipt ? 'resolved' : 'unresolved');
    if (!receipt) add({ kind: 'form', key: form.key, name: form.title, what: form.kind === 'trigger' ? 'create_trigger_form' : 'create_and_link_form', workflow: form.workflowRef, action: form.actionRef });
    if (form.kind === 'trigger') edge(`form:${form.key}`, `workflow:${form.workflowRef}`, 'starts');
  }
  const access = [], readiness = [];
  for (const workflow of list(manifest.workflows)) {
    const receipt = resolved('workflow', workflow.key);
    node(`workflow:${workflow.key}`, 'workflow', workflow.name, workflow, receipt ? 'resolved' : 'unresolved');
    if (!receipt) add({ kind: 'workflow', key: workflow.key, name: workflow.name, what: 'import_workflow_draft', file: workflow.file ?? null, status: workflow.status ?? 'design' });
    for (const ref of list(workflow.sourceRefs)) { const from = sourceNode(ref); if (from) edge(from, `workflow:${workflow.key}`, 'justifies'); }
    for (const key of list(workflow.subWorkflowRefs)) edge(`workflow:${workflow.key}`, `workflow:${key}`, 'sub_workflow', resolved('workflow', key) ? 'resolved' : 'unresolved');
    for (const item of list(workflow.unresolvedActors)) add({ kind: 'workflow', key: workflow.key, name: workflow.name, what: 'register_actor', ref: typeof item === 'string' ? item : item?.key ?? item?.name });
    for (const item of list(workflow.unresolvedEntityTypes)) add({ kind: 'workflow', key: workflow.key, name: workflow.name, what: 'register_entity_type', ref: typeof item === 'string' ? item : item?.key ?? item?.name });
    for (const action of list(workflow.actions)) {
      const id = `action:${workflow.key}:${action.localId}`;
      let status = 'neutral';
      const ref = action.assigneeRef;
      if (ref == null) {
        if (HUMAN.includes(action.type)) { status = 'unresolved'; add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: 'assign_owner' }); }
      } else if (ref.startsWith('ai:')) {
        edge(id, `ai:${ref.slice(3)}`, 'assignee', 'unresolved');
        add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: 'assign_ai_profile', ref });
      } else if (ref.startsWith('field:')) {
        status = 'unresolved';
        add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: 'owner_per_case', ref, detail: action.assigneeFallback ?? null });
        if (action.assigneeFallback && action.assigneeFallback !== 'creator') edge(id, `group:${action.assigneeFallback}`, 'fallback', resolved('group', action.assigneeFallback) ? 'resolved' : 'unresolved');
      } else if (!['creator', 'previous'].includes(ref)) {
        const ok = resolved('group', ref);
        edge(id, `group:${ref}`, 'assignee', ok ? 'resolved' : 'unresolved');
        if (!ok) add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: 'assign_group', ref });
      }
      if (action.formRef) {
        const ok = resolved('form', action.formRef);
        edge(id, `form:${action.formRef}`, 'form', ok ? 'resolved' : 'unresolved');
      } else if (action.type === 'form_fill') { status = 'unresolved'; add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: 'design_form' }); }
      for (const key of list(action.entityRefs)) edge(id, `entity:${key}`, 'entity', resolved('entity_type', key) ? 'resolved' : 'unresolved');
      for (const sref of list(action.sourceRefs)) { const from = sourceNode(sref); if (from) edge(from, id, 'source'); }
      if (action.due == null && HUMAN.includes(action.type)) add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: action.dueInSource ? 'due_manual' : 'due_open', detail: action.dueInSource ? `${action.dueInSource.kind}: ${action.dueInSource.text}` : undefined });
      else if (action.dueInSource) add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: 'due_manual', detail: `${action.dueInSource.kind}: ${action.dueInSource.text}` });
      node(id, 'action', action.name, { ...action, workflow: workflow.key }, status);
    }
    // Access matrix, allowlists and retained tenant grants.
    const entry = accessEntry(manifest, workflow, groups, groupKeys, receipts);
    access.push(entry);
    for (const grant of entry.grants) if (grant.kind === 'group') edge(`workflow:${workflow.key}`, `group:${grant.ref}`, 'grant', grant.applied ? 'resolved' : 'neutral');
    const unapplied = entry.grants.filter(grant => grant.kind !== 'creator' && !grant.applied);
    if (unapplied.length) add({ kind: 'workflow', key: workflow.key, name: workflow.name, what: 'apply_access', detail: unapplied.map(grant => `${grant.grantee} → ${grant.level}`).join(', ') + (entry.receipt && !entry.receipt.complete ? ` (${entry.receipt.problem})` : '') });
    else if (entry.grants.some(grant => grant.kind !== 'creator') && !entry.readBack) add({ kind: 'workflow', key: workflow.key, name: workflow.name, what: 'readback_access' });
    if (entry.staleReadBack) add({ kind: 'workflow', key: workflow.key, name: workflow.name, what: 'readback_access', detail: `the recorded read-back came from workflow ${entry.staleReadBack.from}, not the destination ${entry.staleReadBack.destination}; read workflow_get with includeAccess on the destination before judging applied or retained grants` });
    for (const warning of entry.warnings) add({ kind: 'workflow', key: workflow.key, name: workflow.name, what: 'access_disabled', detail: warning });
    for (const trigger of entry.allowlists) if (!trigger.verified) add({ kind: 'workflow', key: workflow.key, name: workflow.name, what: { unresolved: 'restrict_manual_start', resolved: 'apply_manual_start', applied: 'verify_can_start' }[trigger.state], ref: [...trigger.groups, ...trigger.users].join(', '), detail: trigger.state === 'applied' ? trigger.verification : trigger.missing.length ? `missing ids: ${trigger.missing.join(', ')}` : trigger.fingerprint ? `manual.applied.hash: ${trigger.fingerprint}` : null, blocking: trigger.state !== 'applied' });
    for (const held of entry.retainedExcess) add({ kind: 'workflow', key: workflow.key, name: workflow.name, what: held.block ? 'remove_retained_grant' : 'review_retained_grant', ref: `${held.granteeType}:${held.granteeRef} → ${held.level}`, detail: held.block ?? null, blocking: Boolean(held.block) });
    const openAllowlists = entry.allowlists.filter(trigger => trigger.state !== 'applied');
    readiness.push({ workflow: workflow.key, blocked: entry.retainedExcess.some(held => held.block) || openAllowlists.length > 0, reasons: [...entry.retainedExcess.filter(held => held.block).map(held => held.block), ...openAllowlists.map(trigger => `manual start restriction to ${[...trigger.groups, ...trigger.users].join(', ')} ${trigger.state === 'unresolved' ? 'cannot be written yet (ids missing)' : 'not confirmed applied in the tenant'}`)] });
  }
  for (const id of sectionNodes) {
    const [, source, ...rest] = id.split(':');
    const anchor = rest.join(':');
    const entry = list(manifest.sources).find(item => item.id === source);
    const section = list(entry?.sections).find(item => item.anchor === anchor);
    node(id, 'section', `§${anchor} ${section?.title ?? ''}`.trim(), { source, anchor, title: section?.title ?? null });
    edge(`source:${source}`, id, 'contains');
  }
  const decisions = list(manifest.decisions);
  for (const decision of decisions) if (decision.status === 'open') add({ kind: 'decision', key: decision.id, name: decision.question, what: 'decide', owner: decision.owner ?? null });
  return { nodes, edges, unresolved, decisions, receipts: list(manifest.receipts), access, readiness, engineSupportsAccess: ENGINE_SUPPORTS_ACCESS };
}

function accessEntry(manifest, workflow, groups, groupKeys, receipts) {
  const access = workflow.access ?? {};
  // A grant counts as applied only when the tenant read-back (access.applied[]) shows it at its level or above.
  // A read-back from another workflow (appliedWorkflowId ≠ the destination receipt) is not evidence here, in either direction.
  const readBack = readBackCurrent(workflow, receipts);
  const staleReadBack = Array.isArray(access.applied) && !readBack ? { from: access.appliedWorkflowId, destination: receipts.get(`workflow:${workflow.key}`)?.resource?.id ?? null } : null;
  const grants = [];
  for (const grant of list(access.grants)) {
    const parsed = parseGrantee(grant?.grantee);
    if (!parsed) continue;
    const group = parsed.kind === 'group' ? groups.find(item => item.key === parsed.ref) : null;
    grants.push({ grantee: grant.grantee, kind: parsed.kind, ref: parsed.ref, name: group?.name ?? (parsed.kind === 'group' ? parsed.ref : null), level: grant.level, reason: grant.reason ?? null, sourceRefs: list(grant.sourceRefs), resolved: parsed.kind === 'group' ? Boolean(receipts.get(`group:${parsed.ref}`)) : parsed.kind === 'organization', applied: parsed.kind === 'creator' || (readBack && grantApplied(grant, access.applied, groups, receipts)) });
  }
  // The access receipt is complete only when it resolved every grant and belongs to the operation the manifest would send now.
  const rawReceipt = receipts.get(`access:${workflow.key}`) ?? null;
  let receipt = null;
  if (rawReceipt) {
    const operation = currentOperation(manifest, workflow.key);
    const problem = list(rawReceipt.unresolved).length ? `receipt left ${list(rawReceipt.unresolved).length} grant(s) unresolved`
      : list(access.operations).length && !operation ? 'the approved grants or the destination workflow changed after the recorded operation'
      : operation && !rawReceipt.idempotencyKey ? `receipt carries no idempotencyKey and cannot be tied to the current operation ${operation.idempotencyKey}`
      : operation && rawReceipt.idempotencyKey !== operation.idempotencyKey ? `receipt ${rawReceipt.idempotencyKey} is not the current operation ${operation.idempotencyKey}`
      : null;
    receipt = { at: rawReceipt.at ?? null, tool: rawReceipt.tool, outcome: rawReceipt.outcome, idempotencyKey: rawReceipt.idempotencyKey ?? null, complete: problem === null, problem };
  }
  const warnings = [];
  for (const item of list(manifest.receipts)) if (['access', 'workflow'].includes(item?.ref?.kind) && item.ref.key === workflow.key) for (const warning of list(item.warnings)) { const code = typeof warning === 'string' ? warning : warning?.code; if (code === 'access_disabled' && !warnings.length) warnings.push(`access_disabled (${item.tool}): the tenant keeps IMPORT_ACCESS_ENABLED off; zero grants were written`); }
  const assigned = assignedGroupsOf(workflow, groupKeys);
  const held = retainedExcess(workflow, groups, receipts).map(item => ({ ...item, block: retainedBlock(item, workflow, assigned) }));
  // Allowlist states: unresolved (ids missing; the YAML cannot carry it), resolved (ids known; the restriction is still to be
  // written and confirmed) and applied (manual.applied recorded after the import or the UI step, and the workflow has a receipt).
  // Group or user receipts prove the principals resolve, not that the workflow restriction exists in the tenant.
  const allowlists = [];
  const workflowReceipt = receipts.get(`workflow:${workflow.key}`) ?? null;
  for (const trigger of list(workflow.triggers)) {
    if (trigger?.type !== 'manual' || trigger.enabled === false) continue;
    const groupKeysListed = list(trigger.manual?.allowedGroups), users = list(trigger.manual?.allowedUsers);
    if (!groupKeysListed.length && !users.length) continue;
    const missing = [...groupKeysListed.filter(key => !receipts.get(`group:${key}`)), ...users.filter(email => !receipts.get(`user:${String(email).toLowerCase()}`))];
    // The attestation is bound to the allowlist contents and the destination workflow: a changed list or another workflow invalidates it.
    const fingerprint = allowlistFingerprint(trigger, workflowReceipt?.resource?.id ?? null, receipts);
    const attested = object(trigger.manual.applied) && workflowReceipt && trigger.manual.applied.hash === fingerprint;
    const state = missing.length ? 'unresolved' : attested ? 'applied' : 'resolved';
    // The named verification counts only against the fingerprint of the restriction as applied; a changed list reopens it.
    const verified = state === 'applied' && startVerified(access, fingerprint);
    allowlists.push({ label: trigger.label ?? 'manual', groups: groupKeysListed, users, missing, state, resolved: !missing.length, fingerprint: workflowReceipt ? fingerprint : null, verified, verification: verified ? 'verified' : `pending (hash ${fingerprint})` });
  }
  const applied = grants.some(grant => grant.kind !== 'creator') ? grants.every(grant => grant.applied) && (receipt?.complete ?? true) : null;
  return { workflow: workflow.key, name: workflow.name, ownerArea: workflow.ownerArea ?? null, sensitivity: access.sensitivity ?? null, default: access.default ?? null, note: access.note ?? null, declared: grants.length > 0 || access.default === 'creator_only', grants, receipt, readBack, staleReadBack, applied, appliedGrants: list(access.applied), retainedExcess: held, allowlists, warnings, assigned: [...assigned].filter(key => !grants.some(grant => grant.kind === 'group' && grant.ref === key)) };
}

const LABELS = {
  pt: {
    title: 'Entrega de configuração', generated: 'Gerado a partir de `provia-project.json`', mode: 'Modo',
    modes: { manual: 'configuração manual (sem recibos registados)', partial: 'aplicação parcial ({n} recibos registados; itens pendentes abaixo)', applied: 'aplicado ({n} recibos registados; nada pendente)' },
    connectedNote: 'Modo ligado declarado no manifesto; enquanto não houver recibos, cada item abaixo é configuração manual.',
    status: 'Estado', unresolved: 'Configuração pendente', none: 'Nada pendente.', item: 'Item', action: 'O que fazer', where: 'Onde',
    groups: 'Grupos a criar', members: 'Membros propostos', types: 'Tipos de entidade a criar', forms: 'Formulários a criar e ligar', profiles: 'Perfis de IA a configurar',
    decisions: 'Decisões em aberto', owner: 'Dono', receipts: 'Recibos (já resolvido)', validation: 'Validação', notes: 'Notas de configuração', flags: 'Sinalizações de grupos',
    access: 'Acesso ao workflow', accessIntro: 'Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.',
    accessColumns: ['Workflow', 'Sensibilidade', 'Destinatário', 'Nível', 'Razão', 'Estado'], creatorOnly: 'apenas criador e administradores da organização (`default: creator_only`)',
    accessYaml: 'O motor incluído neste pacote ainda não transporta `access` no YAML: a secção está em `access.yaml` ao lado de `workflow.yaml` e aplica-se à mão ou com `workflow_access_apply`.',
    accessApplied: 'aplicado', accessPending: 'por aplicar', seesOwn: 'Vê apenas os seus casos (sem concessão)', retained: 'Concessões retidas no destino', retainedIntro: 'Concessões que o destino mantém e o manifesto não aprova. `merge` nunca revoga; as marcadas como bloqueio impedem a prontidão até uma remoção confirmada por nova leitura de `workflow_get.access`.',
    blocked: 'BLOQUEIO', unverified: 'Emails por verificar', unverifiedIntro: 'Sem fonte declarada nem resultado de `users_search`; confirmar antes de criar o grupo.',
    validationText: 'Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.',
    footer: 'Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.',
    what: {
      create_entity_type: 'Criar o tipo de entidade com os campos do catálogo (página do tipo no mapa)', create_group: 'Criar o grupo e adicionar os membros', create_trigger_form: 'Criar o formulário de entrada e ligá-lo ao workflow',
      create_and_link_form: 'Criar o formulário e ligá-lo à acção Form Fill', configure_ai_profile: 'Configurar o perfil de IA no Provia e atribuí-lo à acção', import_workflow_draft: 'Importar o YAML como rascunho e rever a pré-visualização',
      assign_owner: 'Definir o responsável; a acção não tem dono no desenho', assign_group: 'Atribuir o grupo à acção depois de o grupo existir', assign_ai_profile: 'Atribuir o perfil de IA à acção', design_form: 'Desenhar o formulário desta acção Form Fill',
      due_open: 'Definir o prazo; o desenho não propõe `due`', due_manual: 'Configurar o prazo à mão em cada caso; a fonte fixa um prazo que `due` não exprime', decide: 'Decidir', flag_single_person: 'Actor de pessoa única: definir substituto', flag_alias: 'Nomes alternativos: confirmar a designação', flag_segregation: 'Segregação de funções: confirmar responsáveis distintos',
      flag_requester: 'Requerente: usa o criador do caso', flag_external: 'Actor externo: não é um grupo', flag_unnamed: 'Responsável sem nome nas fontes',
      owner_per_case: 'Responsável definido à mão em cada caso: o produto não atribui a partir de um campo; o YAML leva o substituto', verify_email: 'Confirmar o email (fonte declarada ou `users_search`) antes de o usar', apply_access: 'Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação',
      access_disabled: 'O destino devolveu `access_disabled`: nenhuma concessão foi escrita; repetir depois da activação', restrict_manual_start: 'Restringir o início manual aos principais indicados (bloqueio: o YAML não leva a lista até existirem os identificadores)', apply_manual_start: 'Escrever a restrição de início manual no destino (importar o YAML resolvido ou definir a lista na UI) e registar `manual.applied`; até lá a prontidão fica bloqueada', verify_can_start: 'Verificação pendente: um membro identificado do grupo de arranque inicia sessão e confirma o botão Iniciar (`canStart: true`)', readback_access: 'Ler `workflow_get.access` de volta para `access.applied[]`; sem leitura, nenhuma concessão conta como aplicada',
      register_actor: 'Registar o actor no registo canónico de grupos ou mapeá-lo para uma chave existente', register_entity_type: 'Registar o tipo de entidade no catálogo ou mapeá-lo para uma chave existente',
      remove_retained_grant: 'Remover a concessão retida (revogação na UI ou `replace` revisto com dry run aceite); a prontidão fica bloqueada até nova leitura confirmar', review_retained_grant: 'Rever a concessão retida: acrescentá-la ao manifesto com razão e fontes, ou removê-la'
    }
  },
  en: {
    title: 'Setup handover', generated: 'Generated from `provia-project.json`', mode: 'Mode',
    modes: { manual: 'manual configuration (no receipts recorded)', partial: 'partially applied ({n} receipts recorded; pending items below)', applied: 'applied ({n} receipts recorded; nothing pending)' },
    connectedNote: 'Connected mode is declared in the manifest; until receipts exist, every item below is manual configuration.',
    status: 'Status', unresolved: 'Pending configuration', none: 'Nothing pending.', item: 'Item', action: 'What to do', where: 'Where',
    groups: 'Groups to create', members: 'Proposed members', types: 'Entity types to create', forms: 'Forms to create and link', profiles: 'AI profiles to configure',
    decisions: 'Open decisions', owner: 'Owner', receipts: 'Receipts (already resolved)', validation: 'Validation', notes: 'Setup notes', flags: 'Group flags',
    access: 'Workflow access', accessIntro: 'Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.',
    accessColumns: ['Workflow', 'Sensitivity', 'Grantee', 'Level', 'Reason', 'Status'], creatorOnly: 'creator and organization administrators only (`default: creator_only`)',
    accessYaml: 'The engine bundled with this package predates `access` in the YAML: the section sits in `access.yaml` next to `workflow.yaml` and is applied by hand or with `workflow_access_apply`.',
    accessApplied: 'applied', accessPending: 'to apply', seesOwn: 'Sees its own cases only (no grant)', retained: 'Grants retained in the tenant', retainedIntro: 'Grants the tenant holds that the manifest does not approve. `merge` never revokes; those marked as blocking stop readiness until a removal is confirmed by a fresh `workflow_get.access` read.',
    blocked: 'BLOCKED', unverified: 'Emails to verify', unverifiedIntro: 'No declared source and no `users_search` result; confirm before creating the group.',
    validationText: 'Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.',
    footer: 'This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.',
    what: {
      create_entity_type: 'Create the entity type with the catalogue fields (entity type page of the map)', create_group: 'Create the group and add the members', create_trigger_form: 'Create the intake form and link it to the workflow',
      create_and_link_form: 'Create the form and link it to the Form Fill action', configure_ai_profile: 'Configure the AI profile in Provia and assign it to the action', import_workflow_draft: 'Import the YAML as a draft and review the preview',
      assign_owner: 'Set the owner; the action has none in the design', assign_group: 'Assign the group to the action once the group exists', assign_ai_profile: 'Assign the AI profile to the action', design_form: 'Design the form for this Form Fill action',
      due_open: 'Set the deadline; the design proposes no `due`', due_manual: 'Configure the deadline by hand per case; the source sets a deadline `due` cannot express', decide: 'Decide', flag_single_person: 'Single-person actor: name a delegate', flag_alias: 'Alternative names: confirm the designation', flag_segregation: 'Segregation of duties: confirm distinct owners',
      flag_requester: 'Requester: uses the case creator', flag_external: 'External actor: not a group', flag_unnamed: 'Owner unnamed in the sources',
      owner_per_case: 'Owner set manually per case: the product cannot assign from a field; the YAML carries the fallback', verify_email: 'Confirm the email (declared source or `users_search`) before using it', apply_access: 'Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` section in the import preview',
      access_disabled: 'The tenant answered `access_disabled`: no grant was written; repeat after activation', restrict_manual_start: 'Restrict manual start to the listed principals (blocking: the YAML carries no allowlist until the ids exist)', apply_manual_start: 'Write the manual-start restriction to the tenant (import the resolved YAML or set the list in the UI) and record `manual.applied`; readiness stays blocked until then', verify_can_start: 'Pending verification: an identified member of the starter group signs in and confirms the Start button (`canStart: true`)', readback_access: 'Read `workflow_get.access` back into `access.applied[]`; without a read-back no grant counts as applied',
      register_actor: 'Register the actor in the canonical group registry or map it to an existing key', register_entity_type: 'Register the entity type in the catalogue or map it to an existing key',
      remove_retained_grant: 'Remove the retained grant (UI revocation or a reviewed `replace` with an accepted dry run); readiness stays blocked until a fresh read confirms', review_retained_grant: 'Review the retained grant: add it to the manifest with reason and sources, or remove it'
    }
  }
};
export const labelsFor = language => (String(language ?? '').toLowerCase().startsWith('pt') ? LABELS.pt : LABELS.en);

/** Markdown handover generated from unresolved items, access, open decisions, receipts and setup notes. */
export function renderSetup(input, analysis = analyze(input)) {
  const manifest = normalizeManifest(input).manifest;
  const L = labelsFor(manifest.project.language);
  const lines = [];
  const push = (...items) => lines.push(...items);
  const where = item => [item.workflow, item.key].filter(Boolean).join(' / ');
  push(`# ${manifest.project.title}: ${L.title}`, '', `${manifest.project.country} · ${manifest.project.language}${manifest.project.timezone ? ' · ' + manifest.project.timezone : ''}. ${L.generated} (${manifest.project.generator ?? 'provia-skills'}${manifest.project.updatedAt ? ', ' + manifest.project.updatedAt : ''}).`, '');
  const receiptCount = list(manifest.receipts).length;
  const state = receiptCount === 0 ? 'manual' : analysis.unresolved.some(item => !item.what.startsWith('flag_')) ? 'partial' : 'applied';
  push(`## ${L.status}`, '', `${L.mode}: ${L.modes[state].replace('{n}', String(receiptCount))}.`, ...(manifest.organization.mode === 'connected' && state === 'manual' ? ['', L.connectedNote] : []), '');
  const byKind = kind => analysis.unresolved.filter(item => item.kind === kind);
  const groups = byKind('group').filter(item => item.what === 'create_group');
  const flags = byKind('group').filter(item => item.what.startsWith('flag_'));
  const emails = byKind('group').filter(item => item.what === 'verify_email');
  const types = byKind('entity_type'), forms = byKind('form'), profiles = byKind('ai_profile');
  const actions = [...byKind('workflow'), ...byKind('action')];
  push(`## ${L.unresolved}`, '');
  if (!actions.length) push(L.none, '');
  else {
    push(`| ${L.where} | ${L.item} | ${L.action} |`, '| --- | --- | --- |');
    for (const item of actions) push(`| ${where(item)} | ${item.name} | ${item.blocking ? `**${L.blocked}** ` : ''}${L.what[item.what]}${item.ref ? ` (\`${item.ref}\`)` : ''}${item.file ? ` (\`${item.file}\`)` : ''}${item.detail ? `. ${item.detail}` : ''} |`);
    push('');
  }
  if (analysis.access.length) {
    push(`## ${L.access}`, '', L.accessIntro, '');
    if (!analysis.engineSupportsAccess) push(L.accessYaml, '');
    push(`| ${L.accessColumns.join(' | ')} |`, `| ${L.accessColumns.map(() => '---').join(' | ')} |`);
    for (const entry of analysis.access) {
      const rows = entry.grants.filter(grant => grant.kind !== 'creator');
      if (!rows.length) push(`| \`${entry.workflow}\` | ${entry.sensitivity ?? '—'} | ${L.creatorOnly} | — | ${entry.note ?? '—'} | — |`);
      for (const grant of rows) push(`| \`${entry.workflow}\` | ${entry.sensitivity ?? '—'} | \`${grant.grantee}\`${grant.kind === 'group' && grant.name !== grant.ref ? ` (${grant.name})` : ''} | ${grant.level} | ${grant.reason ?? '—'}${grant.sourceRefs.length ? ` (${grant.sourceRefs.map(ref => ref.source + (ref.section ? ' §' + ref.section : '')).join(', ')})` : ''} | ${grant.applied ? L.accessApplied : L.accessPending} |`);
      for (const key of entry.assigned) push(`| \`${entry.workflow}\` | ${entry.sensitivity ?? '—'} | \`group:${key}\` | — | ${L.seesOwn} | — |`);
    }
    push('');
    const retained = analysis.access.filter(entry => entry.retainedExcess.length);
    if (retained.length) {
      push(`### ${L.retained}`, '', L.retainedIntro, '');
      for (const entry of retained) for (const held of entry.retainedExcess) push(`- \`${entry.workflow}\`: ${held.granteeType}:${held.granteeRef} → ${held.level}${held.approvedLevel ? ` (approved ${held.approvedLevel})` : ''}${held.block ? ` — **${L.blocked}**: ${held.block}` : ''}`);
      push('');
    }
  }
  if (groups.length) {
    push(`## ${L.groups}`, '');
    for (const item of groups) {
      const group = manifest.groups.find(g => g.key === item.key);
      const members = item.members.map(member => member.email ? `${member.role ? member.role + ' ' : ''}<${member.email}>${member.verified === true ? '' : ' (?)'}` : member.role).join(', ');
      push(`- \`${item.key}\` ${item.name}${group.kind ? ` [${group.kind}]` : ''}${group.parentKey ? ` (↳ \`${group.parentKey}\`)` : ''}${group.purpose ? `: ${group.purpose}` : ''}${members ? `. ${L.members}: ${members}` : ''}`);
    }
    push('');
  }
  if (emails.length) { push(`## ${L.unverified}`, '', L.unverifiedIntro, ''); for (const item of emails) push(`- \`${item.key}\`: ${item.ref}`); push(''); }
  if (flags.length) { push(`## ${L.flags}`, ''); for (const item of flags) push(`- \`${item.key}\`: ${L.what[item.what]}${item.detail ? `. ${item.detail}` : ''}`); push(''); }
  if (types.length) { push(`## ${L.types}`, ''); for (const item of types) push(`- \`${item.key}\` ${item.name}`); push(''); }
  if (forms.length) { push(`## ${L.forms}`, ''); for (const item of forms) push(`- \`${item.key}\` ${item.name}: ${L.what[item.what]} (${where(item)})`); push(''); }
  if (profiles.length) { push(`## ${L.profiles}`, ''); for (const item of profiles) push(`- \`${item.key}\` ${item.name}`); push(''); }
  const open = analysis.decisions.filter(decision => decision.status === 'open');
  if (open.length) { push(`## ${L.decisions}`, ''); for (const decision of open) push(`- **${decision.id}** ${decision.question}${decision.owner ? ` (${L.owner}: ${decision.owner})` : ''}`); push(''); }
  const notes = list(manifest.workflows).flatMap(workflow => list(workflow.setupNotes).map(note => ({ workflow: workflow.key, note })));
  if (notes.length) { push(`## ${L.notes}`, ''); for (const item of notes) push(`- \`${item.workflow}\`: ${item.note}`); push(''); }
  const files = list(manifest.workflows).filter(workflow => workflow.file);
  if (files.length) { push(`## ${L.validation}`, '', L.validationText, '', '```sh'); for (const workflow of files) push(`node scripts/validate-workflow.mjs ${workflow.file}`); push('```', ''); }
  const receipts = analysis.receipts.filter(receipt => RESOLVING.has(receipt.outcome));
  if (receipts.length) { push(`## ${L.receipts}`, ''); for (const receipt of receipts) push(`- ${receipt.ref.kind} \`${receipt.ref.key}\` → \`${receipt.resource?.id}\` (${receipt.tool}, ${receipt.outcome}${receipt.at ? ', ' + receipt.at : ''})`); push(''); }
  push(L.footer, '');
  return lines.join('\n');
}

/** Reads and normalises a manifest; `notes` lists the alternate shapes that were rewritten. */
export function loadManifest(file) {
  const raw = JSON.parse(readFileSync(file, 'utf8'));
  const { manifest, notes } = normalizeManifest(raw);
  return { manifest, raw, notes, baseDir: path.dirname(path.resolve(file)) };
}
