// Builds the data model the offline project map renders on demand: every object once, referenced by a stable id,
// plus the review queues (design questions, validation findings, setup pending, blockers), statuses and edges.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { analyze, checkManifest, labelsFor, normalizeManifest } from '../project-manifest.mjs';
import * as engine from '../../../contracts/workflow-v1/engine.mjs';
import { labels } from './labels.mjs';

const list = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' && value.trim().length > 0;

/** Stable object ids: kind/key, with actions and sections nested under their parent. */
export const ids = {
  source: id => `source/${id}`,
  section: (source, anchor) => `source/${source}/section/${anchor}`,
  workflow: key => `workflow/${key}`,
  action: (workflow, localId) => `workflow/${workflow}/action/${localId}`,
  group: key => `group/${key}`,
  form: key => `form/${key}`,
  entity: key => `entity/${key}`,
  profile: key => `ai/${key}`,
  decision: id => `decision/${id}`,
};

/** Converts the analysis node ids (kind:key) to map ids (kind/key). */
export function mapId(analysisId) {
  const [kind, ...rest] = analysisId.split(':');
  switch (kind) {
    case 'source': return ids.source(rest.join(':'));
    case 'section': return ids.section(rest[0], rest.slice(1).join(':'));
    case 'workflow': return ids.workflow(rest.join(':'));
    case 'action': return ids.action(rest[0], rest.slice(1).join(':'));
    case 'group': return ids.group(rest.join(':'));
    case 'form': return ids.form(rest.join(':'));
    case 'entity': return ids.entity(rest.join(':'));
    case 'ai': return ids.profile(rest.join(':'));
    default: return analysisId;
  }
}

// Which review queue an unresolved item belongs to. Blocking items always land in the blockers queue.
const DESIGN = new Set(['decide', 'flag_single_person', 'flag_alias', 'flag_segregation', 'flag_requester', 'flag_external', 'flag_unnamed', 'assign_owner', 'design_form', 'due_open', 'register_actor', 'register_entity_type']);
const BLOCKER = new Set(['access_disabled', 'remove_retained_grant', 'restrict_manual_start', 'apply_manual_start']);
export function categoryOf(item) {
  if (item.blocking || BLOCKER.has(item.what)) return 'blocker';
  if (DESIGN.has(item.what)) return 'design';
  return 'setup';
}

function objectIdOf(item) {
  switch (item.kind) {
    case 'entity_type': return ids.entity(item.key);
    case 'group': return ids.group(item.key);
    case 'ai_profile': return ids.profile(item.key);
    case 'form': return ids.form(item.key);
    case 'workflow': return ids.workflow(item.key);
    case 'action': return ids.action(item.workflow, item.key);
    case 'decision': return ids.decision(item.key);
    default: return null;
  }
}

/** Maps a checker path (workflows[0].actions[2].due) to the object it concerns. */
function objectIdOfPath(path, manifest) {
  const at = (name, index) => list(manifest[name])[Number(index)];
  let match;
  if ((match = /^workflows\[(\d+)\]\.actions\[(\d+)\]/.exec(path))) {
    const workflow = at('workflows', match[1]);
    const action = list(workflow?.actions)[Number(match[2])];
    return workflow && action ? ids.action(workflow.key, action.localId) : null;
  }
  if ((match = /^workflows\[(\d+)\]/.exec(path))) return at('workflows', match[1]) ? ids.workflow(at('workflows', match[1]).key) : null;
  if ((match = /^groups\[(\d+)\]/.exec(path))) return at('groups', match[1]) ? ids.group(at('groups', match[1]).key) : null;
  if ((match = /^groups\.([A-Za-z0-9_.-]+)/.exec(path))) return ids.group(match[1]);
  if ((match = /^forms\[(\d+)\]/.exec(path))) return at('forms', match[1]) ? ids.form(at('forms', match[1]).key) : null;
  if ((match = /^entityTypes\[(\d+)\]/.exec(path))) return at('entityTypes', match[1]) ? ids.entity(at('entityTypes', match[1]).key) : null;
  if ((match = /^decisions\[(\d+)\]/.exec(path))) return at('decisions', match[1]) ? ids.decision(at('decisions', match[1]).id) : null;
  if ((match = /^sources\[(\d+)\]/.exec(path))) return at('sources', match[1]) ? ids.source(at('sources', match[1]).id) : null;
  if ((match = /^aiProfiles\[(\d+)\]/.exec(path))) return at('aiProfiles', match[1]) ? ids.profile(at('aiProfiles', match[1]).key) : null;
  return null;
}

function readYaml(workflow, baseDir) {
  if (!text(workflow.file)) return { present: false, reason: 'none' };
  if (!baseDir) return { present: false, reason: 'missing' };
  const file = resolve(baseDir, workflow.file);
  if (!existsSync(file)) return { present: false, reason: 'missing' };
  try {
    const parsed = engine.parseYamlToDraft(readFileSync(file, 'utf8'));
    if (!parsed.draft || parsed.syntaxErrors.length) return { present: false, reason: 'broken' };
    const draft = parsed.draft;
    return {
      present: true,
      metadata: draft.metadata ?? {},
      triggers: list(draft.triggers),
      fields: list(draft.fields),
      entities: draft.entities ?? null,
      access: draft.access ?? null,
      actions: list(draft.actions).map(action => ({
        id: action.id, name: action.name, type: action.type, description: action.description ?? null, executionMode: action.executionMode ?? 'sequential',
        required: action.required, priority: action.priority ?? null, due: action.due ?? null, assignee: action.assignee ?? null, aiWorker: action.aiWorker ?? null, config: action.config ?? null,
      })),
    };
  } catch { return { present: false, reason: 'broken' }; }
}

/** The complete model; deterministic for the same manifest and files. */
export function buildModel(input, baseDir) {
  const manifest = normalizeManifest(input).manifest;
  const analysis = analyze(manifest);
  const checks = checkManifest(manifest, baseDir);
  const L = labelsFor(manifest.project.language);
  const pt = String(manifest.project.language ?? '').toLowerCase().startsWith('pt');
  const T = labels(pt);
  const receipts = new Map();
  for (const receipt of list(manifest.receipts)) if (receipt?.ref && ['created', 'updated', 'no_op'].includes(receipt.outcome)) receipts.set(`${receipt.ref.kind}:${receipt.ref.key}`, receipt);
  const receiptOf = (kind, key) => { const r = receipts.get(`${kind}:${key}`); return r ? { id: r.resource?.id ?? null, tool: r.tool, outcome: r.outcome, at: r.at ?? null } : null; };

  const workflows = list(manifest.workflows).map(workflow => {
    const yaml = readYaml(workflow, baseDir);
    const yamlActions = new Map(list(yaml.actions).map(action => [action.id, action]));
    const actions = list(workflow.actions).map((action, index) => {
      const y = yamlActions.get(action.localId) ?? null;
      return { ...action, id: ids.action(workflow.key, action.localId), index, yaml: y };
    });
    const { actions: _drop, ...rest } = yaml;
    return { ...workflow, id: ids.workflow(workflow.key), actions, yaml: rest, receipt: receiptOf('workflow', workflow.key) };
  });

  const decisions = list(manifest.decisions).map(decision => {
    const sources = new Set(list(decision.sourceRefs).map(ref => ref.source));
    const related = text(decision.workflowRef) ? [decision.workflowRef] : workflows.filter(workflow => list(workflow.sourceRefs).some(ref => sources.has(ref.source)) || workflow.actions.some(action => list(action.sourceRefs).some(ref => sources.has(ref.source)))).map(workflow => workflow.key);
    return { ...decision, id: ids.decision(decision.id), code: decision.id, related };
  });

  const relatedOf = new Map(decisions.map(decision => [decision.code, decision.related]));
  // Review items: unresolved configuration and decisions from the analysis, validation findings from the checker.
  const issues = [];
  let sequence = 0;
  for (const item of analysis.unresolved) {
    const objectId = objectIdOf(item);
    const workflows = item.kind === 'decision' ? relatedOf.get(item.key) ?? [] : null;
    issues.push({ id: `issue-${sequence++}`, category: categoryOf(item), objectId, workflow: item.workflow ?? (item.kind === 'workflow' ? item.key : null), ...(workflows ? { workflows } : {}), kind: item.kind, what: item.what, key: item.key ?? null, text: L.what[item.what] ?? item.what, ref: item.ref ?? null, detail: item.detail ?? null, blocking: Boolean(item.blocking), owner: item.owner ?? null, ...(objectId ? {} : { name: item.name }) });
  }
  for (const [severity, entries] of [['error', checks.errors], ['warning', checks.warnings], ['info', checks.infos]]) {
    for (const entry of entries) {
      const objectId = objectIdOfPath(entry.path, manifest);
      const workflow = objectId?.startsWith('workflow/') ? objectId.split('/')[1] : null;
      issues.push({ id: `issue-${sequence++}`, category: 'validation', severity, objectId, workflow, kind: 'validation', what: 'validation', text: entry.message, path: entry.path, blocking: severity === 'error' });
    }
  }

  const byWorkflow = key => issues.filter(issue => issue.workflow === key || (issue.workflows ?? []).includes(key));
  for (const workflow of workflows) {
    const own = byWorkflow(workflow.key);
    const entry = analysis.access.find(item => item.workflow === workflow.key) ?? null;
    const readiness = analysis.readiness.find(item => item.workflow === workflow.key) ?? null;
    const related = decisions.filter(decision => decision.related.includes(workflow.key));
    workflow.review = {
      design: workflow.status ?? 'design',
      designOpen: own.filter(issue => issue.category === 'design' && issue.what !== 'decide').length,
      validation: { warnings: own.filter(issue => issue.category === 'validation' && issue.severity === 'warning').length, infos: own.filter(issue => issue.category === 'validation' && issue.severity === 'info').length, errors: own.filter(issue => issue.category === 'validation' && issue.severity === 'error').length },
      decisions: { open: related.filter(decision => decision.status === 'open').length, resolved: related.filter(decision => decision.status === 'resolved').length },
      setup: own.filter(issue => issue.category === 'setup').length,
      blockers: own.filter(issue => issue.category === 'blocker').length,
      evidence: { receipt: workflow.receipt, accessApplied: entry?.applied ?? null, readinessBlocked: readiness?.blocked ?? false, reasons: readiness?.reasons ?? [] },
    };
  }

  const receiptCount = list(manifest.receipts).length;
  const evidenceState = receiptCount === 0 ? 'manual' : analysis.unresolved.some(item => !item.what.startsWith('flag_')) ? 'partial' : 'applied';

  return {
    schemaVersion: 'provia-project-map/v2',
    project: { ...manifest.project },
    organization: { name: manifest.organization?.name ?? null, sector: manifest.organization?.sector ?? null, mode: manifest.organization?.mode ?? 'disconnected', tenantId: manifest.organization?.tenantId ?? null, productRevision: manifest.organization?.productRevision ?? null },
    evidence: { receipts: receiptCount, state: evidenceState, engineSupportsAccess: analysis.engineSupportsAccess },
    sources: list(manifest.sources).map(source => ({ ...source, id: ids.source(source.id), code: source.id, sections: list(source.sections).map(section => ({ ...section, id: ids.section(source.id, section.anchor) })) })),
    entityTypes: list(manifest.entityTypes).map(type => ({ ...type, id: ids.entity(type.key), receipt: receiptOf('entity_type', type.key) })),
    groups: list(manifest.groups).map(group => ({ ...group, id: ids.group(group.key), receipt: receiptOf('group', group.key) })),
    workflows,
    forms: list(manifest.forms).map(form => ({ ...form, id: ids.form(form.key), receipt: receiptOf('form', form.key) })),
    aiProfiles: list(manifest.aiProfiles).map(profile => ({ ...profile, id: ids.profile(profile.key) })),
    decisions,
    receipts: list(manifest.receipts).map(receipt => ({ tool: receipt.tool, outcome: receipt.outcome, ref: receipt.ref ?? null, id: receipt.resource?.id ?? null, at: receipt.at ?? null, warnings: list(receipt.warnings).map(warning => typeof warning === 'string' ? warning : warning?.code ?? null).filter(Boolean) })),
    access: analysis.access,
    readiness: analysis.readiness,
    issues,
    edges: analysis.edges.map(edge => ({ from: mapId(edge.from), to: mapId(edge.to), kind: edge.kind, status: edge.status })),
    labels: T,
  };
}
