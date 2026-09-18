#!/usr/bin/env node
// Substitutes destination ids from manifest receipts into a copy of a workflow YAML: group assignees,
// sub-workflow targets and decision trigger targets. It never edits the source file and never invents an id.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as engine from '../contracts/workflow-v1/engine.mjs';
import { loadManifest, checkManifest, receiptIndex } from './lib/project-manifest.mjs';
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
    const ref = entry?.assigneeRef;
    if (ref && !['creator', 'previous'].includes(ref) && !ref.startsWith('ai:')) {
      const receipt = receipts.get(`group:${ref}`);
      if (receipt) { action.assignee = { type: 'group', id: receipt.resource.id }; applied.push({ action: action.id, field: 'assignee', ref, id: receipt.resource.id }); }
      else pending.push({ action: action.id, field: 'assignee', ref });
    }
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
  const header = yamlText.split('\n').filter(line => line.startsWith('#')).join('\n');
  const text = `${header ? header + '\n' : ''}# Resolved from provia-project.json receipts: ${applied.length} substitution(s), ${pending.length} still pending.\n${emit(draft)}`;
  return { text, applied, pending };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [manifestFile, workflowKey, yamlFile, flag, output, ...extra] = process.argv.slice(2);
    if (!manifestFile || !workflowKey || !yamlFile || flag !== '--output' || !output || extra.length) throw new Error('Usage: node scripts/resolve-workflow-refs.mjs provia-project.json <workflow key> workflow.yaml --output resolved.yaml');
    if (resolve(yamlFile) === resolve(output)) throw new Error('Output must be a different file from the source YAML');
    const { manifest, baseDir } = loadManifest(manifestFile);
    const { errors } = checkManifest(manifest, baseDir);
    if (errors.length) throw new Error(`Manifest errors: ${errors.map(e => `${e.path}: ${e.message}`).join('; ')}`);
    const result = resolveWorkflow(manifest, workflowKey, readFileSync(yamlFile, 'utf8'));
    writeFileSync(output, result.text);
    console.log(JSON.stringify({ output, applied: result.applied, pending: result.pending }, null, 2));
    process.exitCode = 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
