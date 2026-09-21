#!/usr/bin/env node
// One-off reconciliation: proposes `workflows[].access` for every workflow of a 1.1.x manifest from what it already holds,
// under the same rule 4 as fresh designs, and lists the questions a reviewer must answer. It writes a copy of the manifest,
// never the source, and marks every proposal `reason: "proposto por reconciliação"` for human review in project.html.
// With a tenant snapshot (workflow_get.access per workflow key) it also records `access.applied[]` so the retained-excess
// review judges the real tenant state. It never applies anything: the apply is a separate, reviewed `workflow_access_apply`.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadManifest, checkManifest, receiptIndex, SCHEMA, LEGACY_SCHEMA } from './lib/project-manifest.mjs';
import { retainedExcess, retainedBlock, readBackCurrent, parseGrantee, LEVELS } from './lib/workflow-access.mjs';

export const RECONCILED_REASON = 'proposto por reconciliação';
const RESTRICTED = /restrit|confidencial|disciplinar|den[uú]ncia|salarial|payroll|whistleblow|disciplinary|confidential|restricted/i;
const OPEN_START = /qualquer (colaborador|trabalhador|funcion[aá]rio)|toda a organiza|todos os colaboradores|any employee|anyone in the organi[sz]ation|all employees/i;
const list = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' && value.trim().length > 0;

function sourceText(manifest, refs) {
  const parts = [];
  for (const ref of list(refs)) {
    const source = list(manifest.sources).find(item => item.id === ref?.source);
    if (!source) continue;
    parts.push(source.title ?? '', source.summary ?? '');
    for (const section of list(source.sections)) if (ref.section == null || section.anchor === ref.section) parts.push(section.title ?? '', section.summary ?? '');
  }
  return parts.join(' ');
}

/** Proposes access for one workflow; returns { access, review } or null when the workflow already declares it. */
export function proposeAccess(manifest, workflow) {
  if (workflow.access && (list(workflow.access.grants).length || workflow.access.default === 'creator_only')) return null;
  const groups = list(manifest.groups);
  const groupKeys = new Set(groups.map(group => group.key));
  const actions = list(workflow.actions);
  const first = actions[0];
  const notes = [...list(workflow.setupNotes), workflow.name ?? '', sourceText(manifest, workflow.sourceRefs)].join(' ');
  const restricted = RESTRICTED.test(notes);
  const grants = [], review = [];
  const firstRefs = list(first?.sourceRefs).length ? first.sourceRefs : list(workflow.sourceRefs);
  const openStart = OPEN_START.test([sourceText(manifest, firstRefs), ...list(first?.evidence), first?.description ?? ''].join(' '));
  if (first?.assigneeRef === 'creator') {
    if (openStart && !restricted) grants.push({ grantee: 'organization', level: 'create_incident', reason: RECONCILED_REASON, sourceRefs: firstRefs });
    else review.push({ workflow: workflow.key, question: restricted ? 'Who may open a case of this restricted workflow? The first action belongs to the creator; name the starter group.' : 'Who may open a case? The first action belongs to the creator; grant `organization` if any employee may, otherwise the starter group.', proposed: null });
  } else if (text(first?.assigneeRef) && groupKeys.has(first.assigneeRef)) {
    grants.push({ grantee: `group:${first.assigneeRef}`, level: 'create_incident', reason: RECONCILED_REASON, sourceRefs: firstRefs });
  } else if (first) review.push({ workflow: workflow.key, question: `The first action ${first.localId} has no group owner; name who opens the case.`, proposed: null });
  // Assigned groups get no view: their members already see the cases that carry their actions (rule 4).
  const assigned = new Set(actions.map(action => action.assigneeRef).filter(ref => text(ref) && groupKeys.has(ref)));
  for (const key of assigned) {
    if (grants.some(grant => grant.grantee === `group:${key}`)) continue;
    const queue = actions.filter(action => action.assigneeRef === key).flatMap(action => [...list(action.evidence), ...list(action.folded).map(folded => folded.summary), sourceText(manifest, action.sourceRefs)]).join(' ');
    const sharedQueue = /fila|acompanha todos|v[eê] todos os pedidos|todos os casos|shared queue|sees all requests|every case/i.test(queue);
    if (sharedQueue && !restricted) {
      const refs = actions.filter(action => action.assigneeRef === key).flatMap(action => list(action.sourceRefs)).slice(0, 1);
      grants.push({ grantee: `group:${key}`, level: 'view', reason: RECONCILED_REASON, sourceRefs: refs });
    } else review.push({ workflow: workflow.key, group: key, question: `Does team ${key} need every case of ${workflow.key}, or only the cases that carry its actions? Add group:${key}/view with a reason and sourceRefs only if the source says so.`, proposed: 'none' });
  }
  const access = { grants, sensitivity: restricted ? 'restricted' : 'internal' };
  if (!grants.length) access.default = 'creator_only';
  if (restricted && grants.some(grant => grant.level === 'create_incident')) access.note = 'Quem abre vê todos os casos do workflow; a Direcção/decisores vêem apenas os casos que lhes são atribuídos (limitação a registar em decisions[])';
  return { access, review };
}

const GRANTEE_TYPES = new Set(['group', 'user', 'organization']);
/**
 * Applies a tenant snapshot `{ [workflow key]: { grants: [...] } | { unavailable } }` (from workflow_get with includeAccess)
 * as `access.applied[]`. A malformed entry throws: previous evidence is never replaced by an empty list by accident.
 */
export function applySnapshot(workflow, snapshot) {
  const entry = snapshot?.[workflow.key];
  if (entry === undefined) return false;
  if (entry && typeof entry === 'object' && text(entry.unavailable)) { workflow.access.appliedUnavailable = entry.unavailable; return false; }
  if (!entry || typeof entry !== 'object' || !Array.isArray(entry.grants)) throw new Error(`Snapshot for ${workflow.key} has no grants array (workflow_get.access is { grants: [...] } or { unavailable })`);
  for (const [i, grant] of entry.grants.entries()) {
    if (!grant || typeof grant !== 'object' || !GRANTEE_TYPES.has(grant.granteeType) || !text(grant.granteeRef) || !LEVELS.includes(grant.level)) throw new Error(`Snapshot for ${workflow.key}: grants[${i}] is not { granteeType, granteeRef, level } from workflow_get.access`);
  }
  workflow.access.applied = entry.grants.map(grant => ({ ...(grant.id ? { id: grant.id } : {}), granteeType: grant.granteeType, granteeRef: grant.granteeRef, ...(grant.granteeId ? { granteeId: grant.granteeId } : {}), level: grant.level }));
  if (text(entry.workflowId)) workflow.access.appliedWorkflowId = entry.workflowId; else delete workflow.access.appliedWorkflowId;
  delete workflow.access.appliedUnavailable;
  return true;
}

export function reconcile(manifest, { snapshot = null, today = new Date().toISOString().slice(0, 10) } = {}) {
  const output = JSON.parse(JSON.stringify(manifest));
  if (output.schemaVersion === LEGACY_SCHEMA) output.schemaVersion = SCHEMA;
  const receipts = receiptIndex(output);
  const groups = list(output.groups);
  const groupKeys = new Set(groups.map(group => group.key));
  const proposed = [], reviews = [], excess = [], staleReadBacks = [];
  for (const workflow of list(output.workflows)) {
    const proposal = proposeAccess(output, workflow);
    if (proposal) { workflow.access = { ...proposal.access, ...(workflow.access ?? {}) }; proposed.push(workflow.key); reviews.push(...proposal.review); }
    if (workflow.access && snapshot) applySnapshot(workflow, snapshot);
    if (proposal?.review.length) workflow.accessReview = [...list(workflow.accessReview), ...proposal.review.map(item => ({ question: item.question, group: item.group ?? null, status: 'open' }))];
    if (workflow.access?.applied && !readBackCurrent(workflow, receipts)) {
      // A snapshot taken from another workflow instructs nothing under this destination; ask for a fresh read instead.
      staleReadBacks.push({ workflow: workflow.key, appliedWorkflowId: workflow.access.appliedWorkflowId, destination: receipts.get(`workflow:${workflow.key}`)?.resource?.id ?? null, action: 'read workflow_get with includeAccess on the destination and rerun' });
    } else if (workflow.access?.applied) {
      const assigned = new Set(list(workflow.actions).map(action => action.assigneeRef).filter(ref => text(ref) && groupKeys.has(ref)));
      for (const held of retainedExcess(workflow, groups, receipts)) excess.push({ workflow: workflow.key, ...held, block: retainedBlock(held, workflow, assigned) });
    }
    if (workflow.access?.sensitivity === 'restricted' && list(workflow.access.grants).some(grant => parseGrantee(grant.grantee) && grant.level === 'create_incident')) {
      const id = `ACC-${workflow.key}`;
      if (!list(output.decisions).some(decision => decision.id === id)) output.decisions = [...list(output.decisions), { id, question: `${workflow.name}: quem abre um caso vê todos os casos deste workflow restrito. Aceitar a limitação até existirem regras por caso, ou restringir quem abre?`, owner: 'Dono do processo', status: 'open', raisedBy: 'scripts/reconcile-access.mjs' }];
    }
  }
  output.project = { ...output.project, updatedAt: today };
  const restrictedFirst = list(output.workflows).filter(workflow => proposed.includes(workflow.key)).sort((a, b) => (b.access?.sensitivity === 'restricted') - (a.access?.sensitivity === 'restricted')).map(workflow => ({ key: workflow.key, sensitivity: workflow.access.sensitivity, grants: list(workflow.access.grants).map(grant => `${grant.grantee} → ${grant.level}`), default: workflow.access.default ?? null }));
  return { manifest: output, proposed: restrictedFirst, reviews, retainedExcess: excess, staleReadBacks };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const input = args[0];
    const out = args.indexOf('--output'), snap = args.indexOf('--tenant-access');
    const output = out >= 0 ? args[out + 1] : null;
    const snapshotFile = snap >= 0 ? args[snap + 1] : null;
    const used = new Set([0, out, out + 1, snap, snap + 1].filter(index => index >= 0));
    if (!input || !output || args.some((_, index) => !used.has(index))) throw new Error('Usage: node scripts/reconcile-access.mjs provia-project.json --output provia-project.reconciled.json [--tenant-access access-snapshot.json]');
    if (resolve(input) === resolve(output)) throw new Error('Output must be a separate file; the source manifest is never edited in place');
    const { manifest, baseDir } = loadManifest(input);
    const snapshot = snapshotFile ? JSON.parse(readFileSync(snapshotFile, 'utf8')) : null;
    const result = reconcile(manifest, { snapshot });
    const { errors, warnings } = checkManifest(result.manifest, baseDir);
    writeFileSync(output, JSON.stringify(result.manifest, null, 2) + '\n');
    console.log(JSON.stringify({ output, proposed: result.proposed, accessReview: result.reviews, retainedExcess: result.retainedExcess, staleReadBacks: result.staleReadBacks, checkAfter: { errors, warnings: warnings.length }, note: 'Proposals carry reason "proposto por reconciliação" and wait for human review in project.html; nothing was applied. Apply with workflow_access_apply in merge mode after review.' }, null, 2));
    process.exitCode = errors.length ? 1 : 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
