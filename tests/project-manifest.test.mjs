import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { checkManifest, analyze, renderSetup } from '../scripts/lib/project-manifest.mjs';
import { renderMap } from '../scripts/build-project-map.mjs';
import { resolveWorkflow } from '../scripts/resolve-workflow-refs.mjs';
import { emit } from '../scripts/lib/yaml-emit.mjs';
import { validateWorkflow } from '../scripts/validate-workflow.mjs';
import * as engine from '../contracts/workflow-v1/engine.mjs';

const root = path.resolve(import.meta.dirname, '..');
const examples = ['procurement', 'it-service', 'employee-onboarding', 'procedure-control', 'corrective-action'];
const load = name => JSON.parse(fs.readFileSync(path.join(root, 'examples', name, 'provia-project.json'), 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));

test('every bundled example has a manifest that checks clean against its workflow file', () => {
  for (const name of examples) {
    const manifest = load(name);
    const { errors, warnings } = checkManifest(manifest, path.join(root, 'examples', name));
    assert.deepEqual(errors, [], `${name}: ${JSON.stringify(errors)}`);
    assert.deepEqual(warnings, [], `${name}: ${JSON.stringify(warnings)}`);
    assert.equal(manifest.project.generator, `provia-skills/${JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version}`);
  }
});

test('bundled setup.md and project.html are generated from the manifest', () => {
  for (const name of examples) {
    const dir = path.join(root, 'examples', name);
    const manifest = load(name);
    assert.equal(fs.readFileSync(path.join(dir, 'setup.md'), 'utf8'), renderSetup(manifest), `${name}: setup.md is stale; run build-project-map.mjs --setup`);
    assert.equal(fs.readFileSync(path.join(dir, 'project.html'), 'utf8'), renderMap(manifest, dir), `${name}: project.html is stale; run build-project-map.mjs --output`);
  }
});

test('the map is offline, escapes data and carries the catalogue and pending items as data', () => {
  const dir = path.join(root, 'examples', 'procurement');
  const manifest = load(dir === '' ? '' : 'procurement');
  manifest.groups[0].name = '</script><img src=x onerror=alert(1)>';
  const html = renderMap(manifest, dir);
  assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+href=|fetch\(/);
  assert.doesNotMatch(html, /<img src=x/);
  assert.ok(html.includes('\\u003cimg'), 'data is embedded with < escaped so it can never close the script');
  assert.ok(!html.includes('<iframe'), 'entity types are rendered on demand, not through an embedded catalogue');
  assert.ok(html.includes('Tarefa: Decidir se o pedido de compra avança'), 'action brief from the YAML is embedded');
  const data = JSON.parse(html.match(/id="project-data">([\s\S]*?)<\/script>/)[1]);
  assert.ok(data.edges.some(edge => edge.kind === 'assignee' && edge.status === 'unresolved'));
  assert.ok(data.edges.some(edge => edge.kind === 'entity'));
  assert.ok(data.edges.some(edge => edge.kind === 'source'));
  assert.equal(data.entityTypes.length, 1, 'the catalogue travels once, as data');
  assert.ok(data.issues.some(item => item.category === 'setup' && item.what === 'create_entity_type' && item.objectId === 'entity/fornecedor'));
});

test('a receipt resolves a group reference, colours it green and shortens the handover', () => {
  const manifest = load('procurement');
  const before = analyze(manifest);
  assert.ok(before.unresolved.some(item => item.what === 'assign_group' && item.ref === 'chefias'));
  manifest.receipts.push({ tool: 'group_upsert', idempotencyKey: 'compras-exemplo/groups/chefias', outcome: 'created', resource: { kind: 'group', id: '8d3c1a2b-1111-4111-8111-111111111111', name: 'Chefias de departamento' }, ref: { kind: 'group', key: 'chefias' }, at: '2026-09-18T10:00:00Z' });
  assert.deepEqual(checkManifest(manifest, null).errors, []);
  const after = analyze(manifest);
  assert.ok(!after.unresolved.some(item => item.what === 'assign_group' && item.ref === 'chefias'));
  assert.ok(!after.unresolved.some(item => item.what === 'create_group' && item.key === 'chefias'));
  assert.equal(after.nodes.find(node => node.id === 'group:chefias').status, 'resolved');
  assert.ok(renderSetup(manifest).includes('8d3c1a2b-1111-4111-8111-111111111111'));
  const yaml = fs.readFileSync(path.join(root, 'examples', 'procurement', 'workflow.yaml'), 'utf8');
  const resolved = resolveWorkflow(manifest, 'compras', yaml);
  assert.equal(resolved.applied.length, 1);
  assert.equal(resolved.pending.length, 3, 'two owners and the access groupRefs of compras stay pending');
  assert.ok(resolved.pending.some(item => item.field === 'access.groupRefs' && item.ref === 'compras'));
  assert.deepEqual(resolved.groupRefs, {}, 'no receipt for the granted group yet');
  assert.deepEqual(resolved.access.grants, [{ granteeType: 'organization', granteeRef: 'organization', level: 'create_incident' }, { granteeType: 'group', granteeRef: 'compras', level: 'view' }]);
  const report = validateWorkflow(resolved.text);
  assert.equal(report.valid, true, JSON.stringify(report.errors));
  const original = engine.parseYamlToDraft(yaml).draft, output = engine.parseYamlToDraft(resolved.text).draft;
  assert.deepEqual(output.actions[1].assignee, { type: 'group', id: '8d3c1a2b-1111-4111-8111-111111111111' });
  assert.deepEqual(output.access.grants[1], { grantee: 'group:compras', level: 'view' }, 'connected mode keeps the key; groupRefs carries the id');
  output.actions[1].assignee = original.actions[1].assignee;
  output.access = original.access;
  assert.deepEqual(output, original, 'everything except the substituted assignee and the access grantee form is unchanged');
});

test('a dry-run or failed receipt does not resolve anything', () => {
  const manifest = load('procurement');
  manifest.receipts.push({ tool: 'group_upsert', idempotencyKey: 'x', outcome: 'dry_run', resource: { kind: 'group', name: 'Chefias' }, ref: { kind: 'group', key: 'chefias' } });
  assert.deepEqual(checkManifest(manifest, null).errors, []);
  assert.equal(analyze(manifest).nodes.find(node => node.id === 'group:chefias').status, 'unresolved');
});

for (const [label, mutate, pattern] of [
  ['unknown group key', m => { m.workflows[0].actions[1].assigneeRef = 'ghost'; }, /Unknown group key/],
  ['unknown form key', m => { m.workflows[0].actions[1].formRef = 'ghost'; }, /Unknown form key/],
  ['unknown entity key', m => { m.workflows[0].actions[3].entityRefs = ['ghost']; }, /Unknown entity type key/],
  ['unknown source section', m => { m.workflows[0].actions[0].sourceRefs = [{ source: 'sop-compras', section: '99' }]; }, /no section 99/],
  ['two-level sub-groups', m => { m.groups[1].parentKey = 'chefias'; m.groups[2].parentKey = 'financas'; }, /one level/],
  ['uuid as member email', m => { m.groups[0].members[0].email = '11111111-1111-4111-8111-111111111111'; }, /Not an email/],
  ['duplicate action ids', m => { m.workflows[0].actions[1].localId = 'registar'; }, /Duplicate localId/],
  ['resolved decision without resolution', m => { m.decisions[0].status = 'resolved'; }, /records its resolution/],
  ['receipt without destination id', m => { m.receipts.push({ tool: 'group_upsert', outcome: 'created', resource: { kind: 'group' }, ref: { kind: 'group', key: 'chefias' } }); }, /destination id/],
  ['receipt for unknown key', m => { m.receipts.push({ tool: 'group_upsert', outcome: 'created', resource: { kind: 'group', id: 'x' }, ref: { kind: 'group', key: 'ghost' } }); }, /No group with key ghost/],
  ['connected mode without tenant', m => { m.organization.mode = 'connected'; }, /tenantId/],
  ['action form on a standard action', m => { m.forms.push({ key: 'f', title: 'F', kind: 'action', workflowRef: 'compras', actionRef: 'registar' }); }, /form_fill/],
  ['invalid entity type field', m => { m.entityTypes[0].fields[0].type = 'wrong'; }, /Invalid catalogue/],
]) test(`rejects ${label}`, () => {
  const manifest = load('procurement'); mutate(manifest);
  const { errors } = checkManifest(manifest, null);
  assert.ok(errors.some(error => pattern.test(error.message)), JSON.stringify(errors));
});

test('warns about an owner-less action, an orphan group and a missing Form Fill form', () => {
  const manifest = load('procurement');
  delete manifest.workflows[0].actions[1].assigneeRef;
  manifest.workflows[0].actions[3].type = 'form_fill';
  const { errors, warnings } = checkManifest(manifest, null);
  assert.deepEqual(errors, []);
  assert.ok(warnings.some(w => /has no owner/.test(w.message)));
  assert.ok(warnings.some(w => /owns no action/.test(w.message)));
  assert.ok(warnings.some(w => /has no form yet/.test(w.message)));
});

test('the checker compares the manifest with the workflow file next to it', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-manifest-'));
  try {
    const manifest = load('procurement');
    fs.copyFileSync(path.join(root, 'examples', 'procurement', 'workflow.yaml'), path.join(dir, 'workflow.yaml'));
    manifest.workflows[0].actions.pop();
    fs.writeFileSync(path.join(dir, 'provia-project.json'), JSON.stringify(manifest));
    const result = spawnSync(process.execPath, [path.join(root, 'scripts/build-project-map.mjs'), path.join(dir, 'provia-project.json'), '--check'], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Action ids in workflow.yaml/);
    assert.match(result.stderr, /Nothing written/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the handover is generated in English for an English project', () => {
  const manifest = load('procurement');
  manifest.project.language = 'en';
  const setup = renderSetup(manifest);
  assert.ok(setup.includes('Pending configuration'));
  assert.ok(setup.includes('Open decisions'));
  assert.ok(!setup.includes('Configuração pendente'));
});

test('the YAML emitter round-trips the bundled examples through the product parser', () => {
  for (const name of examples) {
    const text = fs.readFileSync(path.join(root, 'examples', name, 'workflow.yaml'), 'utf8');
    const draft = engine.parseYamlToDraft(text).draft;
    const again = engine.parseYamlToDraft(emit(draft)).draft;
    assert.deepEqual(again, draft, name);
  }
  const tricky = { a: 'yes', b: 'true', c: '12', d: 'x: y', e: '#tag', f: '', g: null, h: [], i: {}, j: 'multi\nline\n', k: ['a', { b: 1 }], l: 'ends with space ' };
  assert.deepEqual(engine.parseYamlToDraft(emit({ apiVersion: 'provia.ao/v1', kind: 'Workflow', metadata: tricky })).draft.metadata, tricky);
});

test('the resolver CLI refuses to overwrite the source file and needs a known workflow key', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-resolve-'));
  try {
    const manifestFile = path.join(root, 'examples', 'procurement', 'provia-project.json');
    const yaml = path.join(root, 'examples', 'procurement', 'workflow.yaml');
    const same = spawnSync(process.execPath, [path.join(root, 'scripts/resolve-workflow-refs.mjs'), manifestFile, 'compras', yaml, '--output', yaml], { encoding: 'utf8' });
    assert.equal(same.status, 1);
    const unknown = spawnSync(process.execPath, [path.join(root, 'scripts/resolve-workflow-refs.mjs'), manifestFile, 'ghost', yaml, '--output', path.join(dir, 'out.yaml')], { encoding: 'utf8' });
    assert.equal(unknown.status, 1);
    assert.match(unknown.stderr, /No workflow ghost/);
    const ok = execFileSync(process.execPath, [path.join(root, 'scripts/resolve-workflow-refs.mjs'), manifestFile, 'compras', yaml, '--output', path.join(dir, 'out.yaml')], { encoding: 'utf8' });
    assert.equal(JSON.parse(ok).pending.length, 4);
    assert.ok(fs.existsSync(path.join(dir, 'out.yaml')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
