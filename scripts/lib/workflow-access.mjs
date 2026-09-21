// Workflow access as data: grantee vocabulary, the --check rules for `workflows[].access`, manual-trigger
// allowlists, retained tenant grants and the deterministic `workflow_access_apply` request with its revision.
// Levels and limits are read from the bundled engine so this file cannot drift from the product contract.
import { createHash } from 'node:crypto';
import * as engine from '../../contracts/workflow-v1/engine.mjs';

const unwrap = schema => { while (schema?._def && (schema._def.innerType || schema._def.schema)) schema = schema._def.innerType || schema._def.schema; return schema; };
const planShape = engine.importWorkflowPlanSchema.shape;
const accessSchema = planShape.access ? unwrap(planShape.access) : null;

/** True when the bundled engine (feature 027 or later) carries `access` inside the portable document. */
export const ENGINE_SUPPORTS_ACCESS = accessSchema !== null;
/** `view < create_incident < edit < admin`, in rank order, from the import plan schema (falls back to the documented list). */
export const LEVELS = accessSchema ? unwrap(unwrap(accessSchema.shape.grants).element).shape.level.options : ['view', 'create_incident', 'edit', 'admin'];
export const ACCESS_DEFAULTS = accessSchema ? unwrap(accessSchema.shape.default).options : ['creator_only'];
export const MAX_GRANTS = accessSchema ? unwrap(accessSchema.shape.grants)._def.maxLength?.value ?? 200 : 200;
export const SENSITIVITIES = ['open', 'internal', 'restricted'];
export const GROUP_KINDS = ['team', 'container', 'role'];
export const DUE_IN_SOURCE_KINDS = ['calendar_day', 'countdown', 'event_relative', 'legal'];
export const TEMPLATE_SCOPES = ['workflow', 'action'];
export const TRIGGER_TYPES = ['manual', 'email', 'webhook', 'schedule', 'form'];
const triggerUnion = unwrap(unwrap(planShape.triggers).element);
const scheduleOption = (triggerUnion.options ?? []).find(option => option.shape?.type?.value === 'schedule');
/** Schedule `missedBehavior` values (`skip`, `catch-up-one`, `catch-up-all`), from the engine. */
export const MISSED_BEHAVIORS = scheduleOption ? unwrap(scheduleOption.shape.config).shape.missedBehavior.options : ['skip', 'catch-up-one', 'catch-up-all'];
const decisionOption = unwrap(unwrap(unwrap(unwrap(planShape.actions).element).shape.decisionOptions).element);
/** Maximum length of a decision branch label, from the engine. */
export const DECISION_LABEL_MAX = decisionOption.shape.label._def.checks.find(check => check.kind === 'max')?.value ?? 50;

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Document template codes cited in descriptions, e.g. `PIX-GC-MOD-003`; `workflows[].templates[]` must list each one. */
export const TEMPLATE_CODE = /\b[A-Z]{2,6}(?:-[A-Z0-9]{1,8}){1,4}-MOD-[A-Z0-9]{1,8}(?:-[A-Z0-9]{1,8})*\b/g;

export const rank = level => LEVELS.indexOf(level);
export const atLeast = (level, floor) => rank(level) >= rank(floor);

/** Parses a manifest grantee. Returns null for anything invalid, including any UUID. */
export function parseGrantee(value) {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (!text || UUID.test(text)) return null;
  if (text === 'organization') return { kind: 'organization', ref: 'organization' };
  if (text === 'creator') return { kind: 'creator', ref: 'creator' };
  if (text.startsWith('group:')) { const ref = text.slice(6).trim(); return ref && !UUID.test(ref) ? { kind: 'group', ref } : null; }
  if (text.startsWith('user:')) { const ref = text.slice(5).trim().toLowerCase(); return EMAIL.test(ref) && !UUID.test(ref) ? { kind: 'user', ref } : null; }
  return null;
}

const fold = text => String(text ?? '').normalize('NFC').trim().toLowerCase();

/** Members of a group plus its direct children (Provia allows one level of sub-groups). */
export function membership(groups, key) {
  const direct = groups.filter(group => group.key === key || group.parentKey === key);
  const people = [];
  for (const group of direct) for (const member of group.members ?? []) people.push({ group: group.key, email: member.email ? String(member.email).toLowerCase() : null, role: member.role ?? null, verified: member.verified === true });
  return people;
}

/** A group's member list is the tenant's only when the manifest says so (`membersComplete: true`); a proposed list, or none, proves nothing about the tenant group. */
export function membershipKnown(groups, key) {
  const direct = groups.filter(group => group.key === key || group.parentKey === key);
  return direct.length > 0 && direct.every(group => group.membersComplete === true);
}

/**
 * Rule 8, membership-aware: who holds create_incident-or-above and is admitted by at least one enabled manual trigger.
 * Returns null when there is nothing to restrict (no enabled manual trigger, or an open one).
 */
export function whoCanStart(workflow, groups) {
  const triggers = (workflow.triggers ?? []).filter(trigger => trigger?.type === 'manual' && trigger.enabled !== false);
  if (!triggers.length) return null;
  const restricted = triggers.filter(trigger => (trigger.manual?.allowedGroups?.length ?? 0) + (trigger.manual?.allowedUsers?.length ?? 0) > 0);
  if (restricted.length < triggers.length) return null; // one open trigger admits everyone with the start permission
  const grants = (workflow.access?.grants ?? []).map(grant => ({ ...grant, parsed: parseGrantee(grant.grantee) })).filter(grant => grant.parsed && atLeast(grant.level, 'create_incident'));
  const unknown = [];
  const starters = new Set();
  let everyone = false;
  for (const grant of grants) {
    if (grant.parsed.kind === 'organization') everyone = true;
    else if (grant.parsed.kind === 'user') starters.add(grant.parsed.ref);
    else if (grant.parsed.kind === 'group') for (const person of membership(groups, grant.parsed.ref)) {
      if (!person.email) unknown.push(`${person.group}: ${person.role ?? 'member'} without email`);
      else { starters.add(person.email); if (!person.verified) unknown.push(`${person.group}: ${person.email} unverified`); }
    }
  }
  const admitted = new Set();
  for (const trigger of restricted) {
    for (const email of trigger.manual?.allowedUsers ?? []) admitted.add(String(email).toLowerCase());
    for (const key of trigger.manual?.allowedGroups ?? []) {
      const people = membership(groups, key);
      if (!people.length && !membershipKnown(groups, key)) unknown.push(`${key}: membership not described in the manifest (set membersComplete: true only when the list is the tenant's)`);
      for (const person of people) {
        if (!person.email) unknown.push(`${person.group}: ${person.role ?? 'member'} without email`);
        else { admitted.add(person.email); if (!person.verified) unknown.push(`${person.group}: ${person.email} unverified`); }
      }
    }
  }
  const able = [...admitted].filter(email => everyone || starters.has(email));
  // The creator and organization Owners/Admins hold the start permission implicitly and the manifest does not know who they
  // are; any admitted person may be one of them. An empty intersection is therefore evidence missing, never a definitive
  // "nobody"; only an allowlist that admits no one at all is provably closed.
  if (!able.length && admitted.size) unknown.push(`the implicit creator and organization administrators are not named in the manifest; any admitted principal (${[...admitted].join(', ')}) may be one of them`);
  return { able, admitted: [...admitted], starters: [...starters], everyone, unknown: [...new Set(unknown)], determinable: admitted.size === 0 && unknown.length === 0 };
}

/** Grantee as the tenant knows it: `group:<name>` for a browser import, `group:<key>` when `groupRefs` travels with the plan. */
export function yamlGrantee(grant, groups, { byName = true } = {}) {
  const parsed = parseGrantee(grant.grantee);
  if (!parsed) return null;
  if (parsed.kind === 'group') {
    if (!byName) return `group:${parsed.ref}`;
    const group = groups.find(item => item.key === parsed.ref);
    return group?.name ? `group:${group.name}` : null;
  }
  if (parsed.kind === 'user') return `user:${parsed.ref}`;
  return parsed.kind;
}

/** The portable `access` section of a workflow, from the manifest. `creator` rows are kept for documentation only. */
export function accessSection(workflow, groups, options = {}) {
  const access = workflow.access ?? {};
  const grants = [];
  for (const grant of access.grants ?? []) {
    const grantee = yamlGrantee(grant, groups, options);
    if (grantee) grants.push({ grantee, level: grant.level });
  }
  const section = {};
  if (access.default || !grants.length) section.default = access.default ?? 'creator_only';
  if (grants.length) section.grants = grants;
  return section;
}

/** Importer-shaped grants for `workflow_import_draft.plan.access` or `workflow_access_apply.grants`; `creator` is dropped. */
export function planGrants(workflow, groups, receipts = new Map()) {
  const grants = [], groupRefs = {}, pending = [];
  for (const grant of workflow.access?.grants ?? []) {
    const parsed = parseGrantee(grant.grantee);
    if (!parsed || parsed.kind === 'creator') continue;
    if (parsed.kind === 'organization') { grants.push({ granteeType: 'organization', granteeRef: 'organization', level: grant.level }); continue; }
    if (parsed.kind === 'user') { grants.push({ granteeType: 'user', granteeRef: parsed.ref, level: grant.level }); continue; }
    const receipt = receipts.get(`group:${parsed.ref}`);
    const entry = { granteeType: 'group', granteeRef: parsed.ref, level: grant.level };
    if (receipt?.resource?.id) { entry.granteeId = receipt.resource.id; groupRefs[parsed.ref] = receipt.resource.id; }
    else pending.push(parsed.ref);
    grants.push(entry);
  }
  return { grants, groupRefs, pending };
}

/** Stable JSON: sorted keys, no whitespace, so the same request always hashes the same. */
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => value[key] === undefined ? null : `${JSON.stringify(key)}:${canonical(value[key])}`).filter(Boolean).join(',')}}`;
  return JSON.stringify(value);
}
export const hashRequest = request => createHash('sha256').update(canonical(request)).digest('hex');

/**
 * The `workflow_access_apply` request for a workflow and the operation revision that keys it.
 * The same payload reuses its revision (a retry); any change to the payload mints the next one.
 */
export function planAccessApply(manifest, workflowKey, { workflowId = null, mode = 'merge', retry = false } = {}) {
  const workflow = (manifest.workflows ?? []).find(item => item.key === workflowKey);
  if (!workflow) throw new Error(`No workflow ${workflowKey} in the manifest`);
  if (!['merge', 'replace'].includes(mode)) throw new Error('mode must be merge or replace');
  const receipts = new Map();
  for (const receipt of manifest.receipts ?? []) if (['created', 'updated', 'no_op'].includes(receipt.outcome) && receipt.ref) receipts.set(`${receipt.ref.kind}:${receipt.ref.key}`, receipt);
  const operations = workflow.access?.operations ?? [];
  const last = operations.length ? operations[operations.length - 1] : null;
  if (retry) {
    if (!last) throw new Error('Nothing to retry: the workflow has no recorded access operation');
    return { request: { ...last.payload, idempotencyKey: last.idempotencyKey }, operation: last, reuse: true, pending: [] };
  }
  const id = workflowId ?? receipts.get(`workflow:${workflowKey}`)?.resource?.id ?? null;
  const { grants, groupRefs, pending } = planGrants(workflow, manifest.groups ?? [], receipts);
  const payload = { ...(id ? { workflowId: id } : { workflowName: workflow.name }), grants, mode, ...(Object.keys(groupRefs).length ? { groupRefs } : {}) };
  const hash = hashRequest(payload);
  // Only the latest operation is a retry candidate: returning to an earlier policy is a new change, and reusing that old key
  // would make the server replay the old result while the later policy stays in effect.
  const same = last && last.hash === hash ? last : null;
  const revision = same ? same.revision : operations.reduce((max, operation) => Math.max(max, Number(operation.revision) || 0), 0) + 1;
  const idempotencyKey = same ? same.idempotencyKey : `${manifest.project.key}/access/${workflowKey}/${revision}`;
  return { request: { ...payload, idempotencyKey }, operation: same ?? { revision, idempotencyKey, hash, payload }, reuse: Boolean(same), pending };
}

/**
 * Fingerprint of a manual-trigger allowlist as applied to one destination workflow: the keys and emails, the destination ids
 * they resolved to (a repointed receipt changes what was written) and the workflow id. `manual.applied.hash` must equal it.
 */
export function allowlistFingerprint(trigger, workflowId, receipts = new Map()) {
  const groups = [...(trigger.manual?.allowedGroups ?? [])].sort();
  const users = [...(trigger.manual?.allowedUsers ?? [])].map(email => String(email).toLowerCase()).sort();
  return hashRequest({
    workflowId: workflowId ?? null,
    allowedGroups: groups.map(key => ({ key, id: receipts.get(`group:${key}`)?.resource?.id ?? null })),
    allowedUsers: users.map(email => ({ email, id: receipts.get(`user:${email}`)?.resource?.id ?? null })),
  });
}

/** Parses a recorded timestamp as an instant (ms since epoch); null when it is not a parseable date-time. */
export function instant(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

/**
 * A start verification counts when a named member's **latest** recorded result for the current allowlist fingerprint is
 * `canStart`. Entries are grouped by member and fingerprint and ordered by the instant `at` denotes (parsed, so timezone
 * offsets and fractional seconds compare correctly; the later entry in the list wins an equal instant), so a later
 * `cannot_start` supersedes an earlier success instead of being masked by it. An entry whose `at` is not a date-time is
 * ignored: it cannot be placed in time.
 */
export function startVerified(access, fingerprint) {
  const entries = Array.isArray(access?.startVerification) ? access.startVerification : access?.startVerification ? [access.startVerification] : [];
  const latest = new Map();
  for (const entry of entries) {
    if (!(entry && typeof entry === 'object' && typeof entry.member === 'string' && entry.hash === fingerprint)) continue;
    const at = instant(entry.at);
    if (at === null) continue;
    const member = fold(entry.member);
    const previous = latest.get(member);
    if (!previous || at >= previous.at) latest.set(member, { at, entry });
  }
  return [...latest.values()].some(({ entry }) => entry.result === 'canStart' || (entry.result === undefined && entry.canStart === true));
}

/**
 * Whether `access.applied[]` is a read-back of the current destination: when the manifest records `appliedWorkflowId` and a
 * workflow receipt exists, both must name the same workflow. Evidence from another workflow proves nothing for this one, in
 * either direction: it neither marks a grant applied nor instructs a revocation.
 */
export function readBackCurrent(workflow, receipts = new Map()) {
  const access = workflow.access ?? {};
  if (!Array.isArray(access.applied)) return false;
  const destination = receipts.get(`workflow:${workflow.key}`)?.resource?.id ?? null;
  return !(typeof access.appliedWorkflowId === 'string' && access.appliedWorkflowId && destination && access.appliedWorkflowId !== destination);
}

/**
 * Whether a read-back group grant is the manifest group. When both the recorded `granteeId` and the receipt id exist they
 * must match; a name or key match is only a fallback while one identity is unknown, never an override of conflicting ids.
 */
function sameGroup(held, { id = null, name = null, key = null }) {
  if (held.granteeId && id) return held.granteeId === id;
  return (name && fold(held.granteeRef) === name) || (key && held.granteeRef === key);
}

/** The recorded operation whose payload equals what the manifest would send now, or null (no key was minted for the current request). */
export function currentOperation(manifest, workflowKey) {
  const workflow = (manifest.workflows ?? []).find(item => item.key === workflowKey);
  const operations = workflow?.access?.operations ?? [];
  if (!operations.length) return null;
  const last = operations[operations.length - 1];
  const receipts = new Map();
  for (const receipt of manifest.receipts ?? []) if (['created', 'updated', 'no_op'].includes(receipt.outcome) && receipt.ref) receipts.set(`${receipt.ref.kind}:${receipt.ref.key}`, receipt);
  const { grants, groupRefs } = planGrants(workflow, manifest.groups ?? [], receipts);
  // The destination is the current workflow receipt; an operation recorded for another workflow id is not the current one.
  const id = receipts.get(`workflow:${workflowKey}`)?.resource?.id ?? last.payload?.workflowId ?? null;
  const payload = { ...(id ? { workflowId: id } : { workflowName: workflow.name }), grants, mode: last.payload?.mode ?? 'merge', ...(Object.keys(groupRefs).length ? { groupRefs } : {}) };
  return hashRequest(payload) === last.hash ? last : null;
}

/** Whether a read-back grant (`access.applied[]`) covers an approved manifest grant at its level or above. */
export function grantApplied(grant, applied, groups, receipts = new Map()) {
  const parsed = parseGrantee(grant.grantee);
  if (!parsed || parsed.kind === 'creator') return true;
  const group = parsed.kind === 'group' ? groups.find(item => item.key === parsed.ref) : null;
  const id = parsed.kind === 'group' ? receipts.get(`group:${parsed.ref}`)?.resource?.id ?? null : null;
  return applied.some(held => {
    if (!held || held.granteeType !== parsed.kind || rank(held.level) < rank(grant.level)) return false;
    if (parsed.kind === 'organization') return true;
    if (parsed.kind === 'user') return fold(held.granteeRef) === parsed.ref;
    return sameGroup(held, { id, name: group?.name ? fold(group.name) : null, key: parsed.ref });
  });
}

/**
 * Grants the tenant holds that the approved manifest does not, or holds above the approved level (from `access.applied[]`).
 * A read-back from another workflow (`appliedWorkflowId` ≠ the current destination) yields nothing: it cannot instruct a
 * revocation under a workflow it never described; the caller asks for a fresh read instead.
 */
export function retainedExcess(workflow, groups, receipts = new Map()) {
  if (!readBackCurrent(workflow, receipts)) return [];
  const applied = workflow.access.applied;
  const approved = [];
  for (const grant of workflow.access?.grants ?? []) {
    const parsed = parseGrantee(grant.grantee);
    if (!parsed || parsed.kind === 'creator') continue;
    const group = parsed.kind === 'group' ? groups.find(item => item.key === parsed.ref) : null;
    approved.push({ ...grant, parsed, name: group?.name ? fold(group.name) : null, id: parsed.kind === 'group' ? receipts.get(`group:${parsed.ref}`)?.resource?.id ?? null : null });
  }
  const excess = [];
  for (const held of applied) {
    if (!held || !LEVELS.includes(held.level)) continue;
    const match = approved.find(grant => {
      if (grant.parsed.kind !== held.granteeType) return false;
      if (held.granteeType === 'organization') return true;
      if (held.granteeType === 'user') return grant.parsed.ref === fold(held.granteeRef);
      return sameGroup(held, { id: grant.id, name: grant.name, key: grant.parsed.ref });
    });
    if (!match) excess.push({ ...held, approvedLevel: null, groupKey: heldGroupKey(held, groups, receipts) });
    else if (rank(held.level) > rank(match.level)) excess.push({ ...held, approvedLevel: match.level, groupKey: match.parsed.kind === 'group' ? match.parsed.ref : null });
  }
  return excess;
}

function heldGroupKey(held, groups, receipts) {
  if (held.granteeType !== 'group') return null;
  const ids = groups.map(group => receipts.get(`group:${group.key}`)?.resource?.id ?? null);
  // Identity first: a held grant that names a known id belongs to that group whatever the names say.
  const byId = held.granteeId ? groups.findIndex((_, i) => ids[i] === held.granteeId) : -1;
  if (byId >= 0) return groups[byId].key;
  const byName = groups.findIndex((group, i) => sameGroup(held, { id: ids[i], name: group.name ? fold(group.name) : null, key: group.key }));
  return byName >= 0 ? groups[byName].key : null;
}

/** Why a retained grant blocks readiness (rule 5, admin outside the approved set, rule 4 on a restricted workflow), or null. */
export function retainedBlock(held, workflow, assignedGroups) {
  const restricted = workflow.access?.sensitivity === 'restricted';
  if (restricted && held.granteeType === 'organization' && atLeast(held.level, 'view')) return 'rule 5: organization holds view-or-above on a restricted workflow; only a confirmed removal clears it';
  if (held.level === 'admin' && held.approvedLevel !== 'admin') return 'admin held outside the approved set';
  if (restricted && held.granteeType === 'group' && held.groupKey && assignedGroups.has(held.groupKey) && held.approvedLevel === null) return 'rule 4: an assigned group holds view-or-above on a restricted workflow without a source-backed grant in the manifest';
  return null;
}
