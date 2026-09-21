#!/usr/bin/env node
// Substitutes destination ids from manifest receipts into a copy of a workflow YAML: group assignees, sub-workflow targets,
// decision trigger targets and manual-trigger allowlists (groups from group receipts, users from `user` receipts keyed by
// email). It also carries the manifest access grants as `group:<key>` with the `groupRefs` map (key → id) that
// `workflow_import_draft` and `workflow_access_apply` accept. It never edits the source file and never invents an id; an
// allowlist principal without a receipt, or a manifest manual trigger the YAML lacks, is a blocking pending item (exit 1).
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as engine from '../contracts/workflow-v1/engine.mjs';
import { loadManifest, checkManifest, receiptIndex } from './lib/project-manifest.mjs';
import { accessSection, planGrants, ENGINE_SUPPORTS_ACCESS } from './lib/workflow-access.mjs';
import { emit } from './lib/yaml-emit.mjs';

export function resolveWorkflow(manifest, workflowKey, yamlText) {
  const workflow = (manifest.workflows ?? []).find(item => item.key === workflowKey);
  if (!workflow) throw new Error(`No workflow ${workflowKey} in the manifest`);
  const receipts = receiptIndex(manifest);
  const parsed = engine.parseYamlToDraft(yamlText);
  if (!parsed.draft || parsed.syntaxErrors.length) throw new Error('The workflow could not be parsed');
  const draft = parsed.draft;
  const applied = [], pending = [];
  for (const action of draft.actions ?? []) {
    const entry = (workflow.actions ?? []).find(item => item.localId === action.id);
    let ref = entry?.assigneeRef;
    if (typeof ref === 'string' && ref.startsWith('field:')) ref = entry.assigneeFallback; // the YAML carries the declared fallback
    if (ref && !['creator', 'previous'].includes(ref) && !ref.startsWith('ai:')) {
      const receipt = receipts.get(`group:${ref}`);
      if (receipt) { action.assignee = { type: 'group', id: receipt.resource.id }; applied.push({ action: action.id, field: 'assignee', ref, id: receipt.resource.id }); }
      else pending.push({ action: action.id, field: 'assignee', ref });
    } else if (ref === 'creator' && entry?.assigneeRef?.startsWith('field:')) action.assignee = { type: 'creator' };
    if (action.type === 'sub_workflow' && typeof action.config?.workflow === 'string') {
      const receipt = receipts.get(`workflow:${action.config.workflow}`);
      if (receipt) { action.config.workflow = receipt.resource.id; applied.push({ action: action.id, field: 'config.workflow', ref: receipt.ref.key, id: receipt.resource.id }); }
      else pending.push({ action: action.id, field: 'config.workflow', ref: action.config.workflow });
    }
    for (const branch of action.config?.branches ?? []) {
      if (branch.outcome === 'trigger_workflow' && typeof branch.workflow === 'string') {
        const receipt = receipts.get(`workflow:${branch.workflow}`);
        if (receipt) { branch.workflow = receipt.resource.id; applied.push({ action: action.id, field: `branch ${branch.label}`, ref: receipt.ref.key, id: receipt.resource.id }); }
        else pending.push({ action: action.id, field: `branch ${branch.label}`, ref: branch.workflow });
      }
    }
  }
  // Manual-trigger allowlists: manifest group keys and member emails become destination ids. A principal without a receipt,
  // or a manifest manual trigger with no counterpart in the YAML, is a blocking pending item: the restriction is never dropped
  // silently and the YAML never carries a key or an email where the contract wants a UUID.
  // A labelled manifest trigger matches only the YAML trigger with the same label; an unlabelled one matches by position. Both
  // allowlist arrays are rewritten from the manifest (a principal the manifest no longer lists loses the permission), and an
  // enabled YAML manual trigger the manifest does not describe is a blocking item when a restriction is declared: it would
  // admit everyone with the start permission and bypass the restriction.
  const manualTriggers = (draft.triggers ?? []).filter(trigger => trigger?.type === 'manual');
  const manifestManual = (workflow.triggers ?? []).filter(trigger => trigger?.type === 'manual');
  const matched = new Set();
  const restrictionDeclared = manifestManual.some(spec => (spec.manual?.allowedGroups?.length ?? 0) + (spec.manual?.allowedUsers?.length ?? 0) > 0);
  for (const [index, spec] of manifestManual.entries()) {
    const label = spec.label ?? `manual[${index}]`;
    const groups = spec.manual?.allowedGroups ?? [], users = spec.manual?.allowedUsers ?? [];
    const trigger = spec.label ? manualTriggers.find(item => item.label === spec.label && !matched.has(item)) : (manualTriggers[index] && !matched.has(manualTriggers[index]) && !manualTriggers[index].label ? manualTriggers[index] : null);
    if (!trigger) { if (groups.length || users.length) pending.push({ trigger: label, field: 'triggers', ref: [...groups, ...users].join(','), blocking: true, reason: 'manifest manual trigger has no exact counterpart in the YAML; its allowlist cannot be written' }); continue; }
    matched.add(trigger);
    // Enablement follows the manifest: a trigger the manifest disables must not stay open in the tenant.
    const enabled = spec.enabled !== false;
    if ((trigger.enabled !== false) !== enabled) { trigger.enabled = enabled; applied.push({ trigger: label, field: 'enabled', ref: String(enabled), id: '' }); }
    const groupIds = groups.map(key => receipts.get(`group:${key}`)?.resource?.id ?? null);
    const userIds = users.map(email => receipts.get(`user:${String(email).toLowerCase()}`)?.resource?.id ?? null);
    const missing = [...groups.filter((_, i) => !groupIds[i]), ...users.filter((_, i) => !userIds[i])];
    if (missing.length) { pending.push({ trigger: label, field: 'config.allowedGroups/allowedUsers', ref: missing.join(','), blocking: true }); continue; }
    const { allowedGroups: _g, allowedUsers: _u, ...config } = trigger.config ?? {};
    trigger.config = { ...config, ...(groups.length ? { allowedGroups: groupIds } : {}), ...(users.length ? { allowedUsers: userIds } : {}) };
    if (groups.length || users.length) applied.push({ trigger: label, field: 'config.allowedGroups/allowedUsers', ref: [...groups, ...users].join(','), id: [...groupIds, ...userIds].join(',') });
    else if (_g || _u) applied.push({ trigger: label, field: 'config.allowedGroups/allowedUsers', ref: '(none: the manifest declares this trigger open)', id: '' });
  }
  if (restrictionDeclared) for (const [index, trigger] of manualTriggers.entries()) {
    if (!matched.has(trigger) && trigger.enabled !== false) pending.push({ trigger: trigger.label ?? `triggers[${index}]`, field: 'triggers', ref: trigger.label ?? String(index), blocking: true, reason: 'enabled manual trigger in the YAML has no manifest counterpart; it admits everyone with the start permission and bypasses the declared restriction' });
  }
  const groups = manifest.groups ?? [];
  const access = planGrants(workflow, groups, receipts);
  let ordered = draft;
  if (ENGINE_SUPPORTS_ACCESS && (workflow.access?.grants?.length || workflow.access?.default)) {
    const { access: _drop, actions, ...rest } = draft;
    ordered = { ...rest, access: accessSection(workflow, groups, { byName: false }), actions };
  }
  for (const key of access.pending) pending.push({ field: 'access.groupRefs', ref: key });
  const header = yamlText.split('\n').filter(line => line.startsWith('#')).join('\n');
  const text = `${header ? header + '\n' : ''}# Resolved from provia-project.json receipts: ${applied.length} substitution(s), ${pending.length} still pending.\n${emit(ordered)}`;
  return { text, applied, pending, groupRefs: access.groupRefs, access: ordered.access ? { default: 'creator_only', grants: access.grants } : null };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [manifestFile, workflowKey, yamlFile, flag, output, ...extra] = process.argv.slice(2);
    if (!manifestFile || !workflowKey || !yamlFile || flag !== '--output' || !output || extra.length) throw new Error('Usage: node scripts/resolve-workflow-refs.mjs provia-project.json <workflow key> workflow.yaml --output resolved.yaml');
    if (resolve(yamlFile) === resolve(output)) throw new Error('Output must be a different file from the source YAML');
    const { manifest, raw, baseDir } = loadManifest(manifestFile);
    const { errors } = checkManifest(raw, baseDir);
    if (errors.length) throw new Error(`Manifest errors: ${errors.map(e => `${e.path}: ${e.message}`).join('; ')}`);
    const result = resolveWorkflow(manifest, workflowKey, readFileSync(yamlFile, 'utf8'));
    writeFileSync(output, result.text);
    const blocking = result.pending.filter(item => item.blocking);
    console.log(JSON.stringify({ output, applied: result.applied, pending: result.pending, groupRefs: result.groupRefs, access: result.access, blocking: blocking.length }, null, 2));
    if (blocking.length) console.error(`${blocking.length} blocking item(s): a declared manual-start restriction is not in the output; do not import it as final.`);
    process.exitCode = blocking.length ? 1 : 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
