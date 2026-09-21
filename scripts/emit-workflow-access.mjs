#!/usr/bin/env node
// Writes the manifest's `workflows[].access` into a copy of the workflow YAML for a browser import: `group:<groups[].name>`
// (the importer matches names, not keys), `user:<email>`, `organization`; `creator` rows are documentation the importer drops.
// Against an engine that carries `access` in the portable document the section goes inside the YAML; against an older bundle
// it is written to access.yaml next to the output. It never emits a `permissions:` key and never edits the source file.
// Manual-trigger allowlists are not written here (the contract needs group UUIDs): setup.md carries the blocking step.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as engine from '../contracts/workflow-v1/engine.mjs';
import { loadManifest, checkManifest } from './lib/project-manifest.mjs';
import { accessSection, ENGINE_SUPPORTS_ACCESS } from './lib/workflow-access.mjs';
import { emit } from './lib/yaml-emit.mjs';

export function emitAccess(manifest, workflowKey, yamlText) {
  const workflow = (manifest.workflows ?? []).find(item => item.key === workflowKey);
  if (!workflow) throw new Error(`No workflow ${workflowKey} in the manifest`);
  const parsed = engine.parseYamlToDraft(yamlText);
  if (!parsed.draft || parsed.syntaxErrors.length) throw new Error('The workflow could not be parsed');
  if (/^permissions\s*:/m.test(yamlText)) throw new Error('The YAML carries a permissions: key; remove it (the engine rejects it as schema.unknown_key)');
  const groups = manifest.groups ?? [];
  const section = accessSection(workflow, groups, { byName: true });
  const skipped = (workflow.access?.grants ?? []).filter(grant => typeof grant.grantee === 'string' && grant.grantee.startsWith('group:') && !groups.find(group => group.key === grant.grantee.slice(6))?.name).map(grant => grant.grantee);
  const draft = parsed.draft;
  const header = yamlText.split('\n').filter(line => line.startsWith('#')).join('\n');
  const stamp = `# Access section from provia-project.json (${workflowKey}): ${section.grants?.length ?? 0} grant(s)${section.default ? `, default ${section.default}` : ''}.`;
  if (ENGINE_SUPPORTS_ACCESS) {
    const { access: _drop, actions, ...rest } = draft;
    const ordered = { ...rest, access: section, actions };
    return { placement: 'workflow.yaml', text: `${header ? header + '\n' : ''}${stamp}\n${emit(ordered)}`, accessYaml: null, section, skipped };
  }
  return { placement: 'access.yaml', text: yamlText, accessYaml: `${stamp}\n# Apply by hand or with workflow_access_apply; this engine revision does not carry access inside workflow.yaml.\n${emit({ access: section })}`, section, skipped };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [manifestFile, workflowKey, yamlFile, flag, output, ...extra] = process.argv.slice(2);
    if (!manifestFile || !workflowKey || !yamlFile || flag !== '--output' || !output || extra.length) throw new Error('Usage: node scripts/emit-workflow-access.mjs provia-project.json <workflow key> workflow.yaml --output workflow.access.yaml');
    if (resolve(yamlFile) === resolve(output)) throw new Error('Output must be a different file from the source YAML');
    const { manifest, raw, baseDir } = loadManifest(manifestFile);
    const { errors } = checkManifest(raw, baseDir);
    if (errors.length) throw new Error(`Manifest errors: ${errors.map(e => `${e.path}: ${e.message}`).join('; ')}`);
    const result = emitAccess(manifest, workflowKey, readFileSync(yamlFile, 'utf8'));
    writeFileSync(output, result.text);
    let accessFile = null;
    if (result.accessYaml) { accessFile = join(dirname(resolve(output)), 'access.yaml'); writeFileSync(accessFile, result.accessYaml); }
    console.log(JSON.stringify({ output, placement: result.placement, accessFile, access: result.section, skipped: result.skipped, engineSupportsAccess: ENGINE_SUPPORTS_ACCESS }, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
