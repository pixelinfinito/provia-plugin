// Acceptance cases of specs/1.2-workflow-access.md §7: manifest access rules, packaging, connected-mode planning and reconciliation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { checkManifest, analyze, renderSetup, normalizeManifest, receiptIndex, SCHEMA } from '../scripts/lib/project-manifest.mjs';
import { LEVELS, MISSED_BEHAVIORS, DECISION_LABEL_MAX, ENGINE_SUPPORTS_ACCESS, planAccessApply, hashRequest, whoCanStart, retainedExcess, retainedBlock } from '../scripts/lib/workflow-access.mjs';
import { emitAccess } from '../scripts/emit-workflow-access.mjs';
import { resolveWorkflow } from '../scripts/resolve-workflow-refs.mjs';
import { reconcile, RECONCILED_REASON } from '../scripts/reconcile-access.mjs';
import { renderMap } from '../scripts/build-project-map.mjs';
import { validateWorkflow } from '../scripts/validate-workflow.mjs';
import { reviewDescription } from '../scripts/review-actions.mjs';
import * as engine from '../contracts/workflow-v1/engine.mjs';

const root = path.resolve(import.meta.dirname, '..');
const load = name => JSON.parse(fs.readFileSync(path.join(root, 'examples', name, 'provia-project.json'), 'utf8'));
const yamlOf = name => fs.readFileSync(path.join(root, 'examples', name, 'workflow.yaml'), 'utf8');
const messages = items => items.map(item => `${item.path}: ${item.message}`).join('\n');
const has = (items, pattern) => items.some(item => pattern.test(item.message));
const source = (source, section) => [{ source, section }];

/** A synthetic HR project: an open purchasing workflow and a restricted disciplinary one, with verified members. */
function project() {
  return {
    schemaVersion: SCHEMA,
    project: { key: 'pix', title: 'Pixel', language: 'pt-AO', country: 'Angola', generator: 'provia-skills/1.2.0' },
    organization: { name: 'Pixel', mode: 'disconnected', tenantId: null, productRevision: null },
    sources: [
      { id: 'pix-gc-pro-002', title: 'Procedimento de compras', kind: 'sop', sections: [{ anchor: 'ambito' }, { anchor: 'responsabilidades' }] },
      { id: 'pix-ch-pro-009', title: 'Procedimento disciplinar', kind: 'sop', sections: [{ anchor: 'instauracao' }, { anchor: 'instrucao' }], emails: ['dg@pixel.ao'] },
    ],
    groups: [
      { key: 'gestao_corporativa', name: 'Gestão Corporativa', kind: 'team', area: 'gestao_corporativa', members: [{ role: 'Técnico', email: 'gc@pixel.ao', verified: true, source: 'pix-gc-pro-002' }], sourceRefs: source('pix-gc-pro-002', 'responsabilidades') },
      { key: 'capital_humano', name: 'Capital Humano', kind: 'team', area: 'capital_humano', members: [{ role: 'Técnico de RH', email: 'rh@pixel.ao', verified: true, source: 'users_search' }], sourceRefs: source('pix-ch-pro-009', 'instauracao') },
      { key: 'instrutores', name: 'Instrutores', kind: 'team', area: 'capital_humano', parentKey: 'capital_humano', members: [{ role: 'Instrutor', email: 'instrutor@pixel.ao', verified: true, source: 'users_search' }], sourceRefs: source('pix-ch-pro-009', 'instrucao') },
      { key: 'direccao', name: 'Direcção Geral', kind: 'container', area: 'direccao', members: [{ role: 'Director', email: 'dg@pixel.ao', verified: true, source: 'pix-ch-pro-009' }], sourceRefs: source('pix-ch-pro-009', 'instauracao') },
    ],
    workflows: [
      {
        key: 'compras', name: 'Pedido de compra', prefix: 'COMP', ownerArea: 'gestao_corporativa', sourceRefs: source('pix-gc-pro-002'),
        actions: [
          { localId: 'registar', name: 'Registar o pedido', type: 'standard', assigneeRef: 'creator', sourceRefs: source('pix-gc-pro-002', 'ambito'), due: { offsetDays: 1 } },
          { localId: 'processar', name: 'Processar o pedido', type: 'standard', assigneeRef: 'gestao_corporativa', sourceRefs: source('pix-gc-pro-002', 'responsabilidades'), due: { offsetDays: 2 } },
        ],
        access: {
          grants: [
            { grantee: 'organization', level: 'create_incident', reason: 'Qualquer colaborador abre um pedido de compra', sourceRefs: source('pix-gc-pro-002', 'ambito') },
            { grantee: 'group:gestao_corporativa', level: 'view', reason: 'A área acompanha todos os pedidos em curso', sourceRefs: source('pix-gc-pro-002', 'responsabilidades') },
          ],
          sensitivity: 'internal',
        },
      },
      {
        key: 'disciplinar', name: 'Processo disciplinar', prefix: 'DISC', ownerArea: 'capital_humano', sourceRefs: source('pix-ch-pro-009'),
        actions: [
          { localId: 'instaurar', name: 'Instaurar o processo', type: 'standard', assigneeRef: 'capital_humano', sourceRefs: source('pix-ch-pro-009', 'instauracao'), due: { offsetDays: 2 } },
          { localId: 'instruir', name: 'Instruir o processo', type: 'standard', assigneeRef: 'instrutores', sourceRefs: source('pix-ch-pro-009', 'instrucao'), due: { offsetDays: 10 } },
          { localId: 'decidir', name: 'Decidir a sanção', type: 'decision', assigneeRef: 'direccao', sourceRefs: source('pix-ch-pro-009', 'instauracao'), due: { offsetDays: 5 } },
        ],
        access: {
          grants: [{ grantee: 'group:capital_humano', level: 'create_incident', reason: 'Executa o circuito e abre o caso', sourceRefs: source('pix-ch-pro-009', 'instauracao') }],
          sensitivity: 'restricted',
          note: 'Quem abre vê todos os casos do workflow; a Direcção decide e vê apenas os casos que lhe são atribuídos',
        },
      },
    ],
    forms: [], aiProfiles: [], decisions: [], receipts: [],
  };
}
const check = manifest => checkManifest(manifest, null);

test('levels, missed behaviours and the decision label limit come from the bundled engine', () => {
  assert.deepEqual(LEVELS, ['view', 'create_incident', 'edit', 'admin']);
  assert.deepEqual(MISSED_BEHAVIORS, ['skip', 'catch-up-one', 'catch-up-all']);
  assert.equal(DECISION_LABEL_MAX, 50);
  assert.equal(ENGINE_SUPPORTS_ACCESS, true);
  const doc = fs.readFileSync(path.join(root, 'references/action-configs.md'), 'utf8');
  for (const value of MISSED_BEHAVIORS) assert.ok(doc.includes(`\`${value}\``), `action-configs.md documents ${value}`);
  assert.ok(doc.includes(`${DECISION_LABEL_MAX} characters`));
});

test('the synthetic project passes the access rules: purchasing is open, the disciplinary workflow restricted', () => {
  const { errors, warnings, infos } = check(project());
  assert.deepEqual(errors, [], messages(errors));
  assert.deepEqual(warnings, [], messages(warnings));
  assert.ok(has(infos, /instrutores holds no workflow grant/), 'the instructor group sees its own cases');
  assert.ok(has(infos, /direccao holds no workflow grant/));
  assert.ok(has(infos, /limitation recorded in access.note/), 'restricted starter limitation is reported, not hidden');
});

test('rule 3: a workflow without access fails --check; default creator_only clears it and the handover lists it as creator-only', () => {
  const manifest = project();
  delete manifest.workflows[0].access;
  assert.ok(has(check(manifest).errors, /rule 3/));
  manifest.workflows[0].access = { default: 'creator_only' };
  assert.deepEqual(check(manifest).errors, []);
  assert.match(renderSetup(manifest), /`compras` \| — \| apenas criador e administradores/);
});

test('rule 1: user grantees need verified evidence; group grantees must resolve; UUIDs are never grantees', () => {
  const manifest = project();
  manifest.workflows[0].access.grants.push({ grantee: 'user:ghost@pixel.ao', level: 'view', reason: 'x' });
  assert.ok(has(check(manifest).errors, /ghost@pixel.ao is not a verified member/));
  manifest.workflows[0].access.grants.pop();
  manifest.workflows[0].access.grants.push({ grantee: 'user:dg@pixel.ao', level: 'view', reason: 'Named in the source', sourceRefs: source('pix-ch-pro-009') });
  assert.deepEqual(check(manifest).errors, [], 'an email listed in sources[].emails is verified');
  manifest.workflows[0].access.grants.push({ grantee: 'group:ghost', level: 'view', reason: 'x' });
  assert.ok(has(check(manifest).errors, /Unknown group key ghost \(rule 1\)/));
  manifest.workflows[0].access.grants.pop();
  manifest.workflows[0].access.grants.push({ grantee: 'group:11111111-1111-4111-8111-111111111111', level: 'view', reason: 'x' });
  assert.ok(has(check(manifest).errors, /Never a UUID/));
});

test('rule 2 and shape: one valid level per grant, creator rows are documentation, a missing reason is a warning', () => {
  const manifest = project();
  manifest.workflows[0].access.grants[0].level = ['view', 'admin'];
  assert.ok(has(check(manifest).errors, /One level per grant/));
  manifest.workflows[0].access.grants[0].level = 'owner';
  assert.ok(has(check(manifest).errors, /rule 2/));
  manifest.workflows[0].access.grants[0].level = 'create_incident';
  manifest.workflows[0].access.grants.push({ grantee: 'creator', level: 'view' });
  const result = check(manifest);
  assert.deepEqual(result.errors, []);
  assert.ok(has(result.warnings, /creator always has admin/));
  assert.ok(has(result.warnings, /without a reason/));
});

test('rule 4: a view grant to an assigned group needs reason and sourceRefs; error on a restricted workflow, warning elsewhere', () => {
  const manifest = project();
  manifest.workflows[1].access.grants.push({ grantee: 'group:instrutores', level: 'view', reason: 'Trabalham a partir de uma fila' });
  let result = check(manifest);
  assert.ok(result.errors.some(item => /rule 4/.test(item.message) && item.path === 'workflows[1].access.grants[1]'), messages(result.errors));
  manifest.workflows[1].access.grants[1].sourceRefs = source('pix-ch-pro-009', 'instrucao');
  assert.deepEqual(check(manifest).errors, [], 'a source-backed justification satisfies rule 4');
  manifest.workflows[0].access.grants[1].sourceRefs = [];
  result = check(manifest);
  assert.deepEqual(result.errors, []);
  assert.ok(has(result.warnings, /rule 4/), 'internal workflow: warning only');
});

test('rule 5: organization view-or-above on a restricted workflow is the canonical invalid example; nothing justifies it', () => {
  const manifest = project();
  manifest.workflows[1].access.grants.push({ grantee: 'organization', level: 'create_incident', reason: 'Toda a organização', sourceRefs: source('pix-ch-pro-009') });
  const result = check(manifest);
  assert.ok(has(result.errors, /rule 5/), messages(result.errors));
  delete manifest.workflows[1].access.note;
  manifest.workflows[1].access.grants.pop();
  assert.ok(has(check(manifest).warnings, /sees every case of this restricted workflow/), 'starter limitation is a warning until recorded');
});

test('rule 6 and 7: admin plus decision is a segregation warning; a cross-area start grant is information', () => {
  const manifest = project();
  manifest.workflows[1].access.grants.push({ grantee: 'group:direccao', level: 'admin', reason: 'Administra o workflow', sourceRefs: source('pix-ch-pro-009') });
  const result = check(manifest);
  assert.deepEqual(result.errors, [], messages(result.errors));
  assert.ok(has(result.warnings, /holds admin on this workflow and also decides/));
  manifest.workflows[0].access.grants.push({ grantee: 'group:capital_humano', level: 'create_incident', reason: 'RH também abre', sourceRefs: source('pix-gc-pro-002') });
  assert.ok(has(check(manifest).infos, /Cross-area start: capital_humano \(capital_humano\) may open compras \(gestao_corporativa\)/));
});

test('rule 8: allowlist keys resolve; narrowing below an organization grant is information; nobody-can-start is membership-aware', () => {
  const manifest = project();
  const compras = manifest.workflows[0];
  compras.triggers = [{ type: 'manual', label: 'Iniciar', enabled: true, manual: { allowedGroups: ['ghost'] } }];
  assert.ok(has(check(manifest).errors, /Unknown group key ghost/));
  compras.triggers[0].manual.allowedGroups = ['capital_humano'];
  let result = check(manifest);
  assert.deepEqual(result.errors, [], messages(result.errors));
  assert.ok(has(result.infos, /deliberately narrows manual starts/));
  // Only Capital Humano may start the restricted workflow; an allowlist to a group sharing no member is evidence missing, not a
  // definitive "nobody": the implicit creator or an administrator may be among the admitted.
  const disciplinar = manifest.workflows[1];
  disciplinar.triggers = [{ type: 'manual', label: 'Abrir', manual: { allowedGroups: ['gestao_corporativa'] } }];
  result = check(manifest);
  assert.deepEqual(result.errors, [], messages(result.errors));
  assert.ok(has(result.warnings, /Cannot determine who can start manually.*implicit creator and organization administrators.*gc@pixel.ao/), messages(result.warnings));
  // An allowlist that admits nobody at all is provably closed only when the manifest holds the tenant's complete member list.
  disciplinar.triggers = [{ type: 'manual', label: 'Abrir', manual: { allowedGroups: ['direccao'] } }];
  manifest.groups[3].members = [];
  result = check(manifest);
  assert.ok(!has(result.errors, /admit nobody/), 'a proposed or absent member list proves nothing about the tenant group');
  assert.ok(has(result.warnings, /membership not described in the manifest/));
  manifest.groups[3].membersComplete = true;
  assert.ok(has(check(manifest).errors, /admit nobody/));
  delete manifest.groups[3].membersComplete;
  manifest.groups[3].members = [{ role: 'Director' }];
  assert.ok(!has(check(manifest).errors, /admit nobody/), 'a role-only member is unknown, not absent');
  manifest.groups[3].members = [{ role: 'Director', email: 'dg@pixel.ao', verified: true, source: 'pix-ch-pro-009' }];
  // A second, open manual trigger admits everyone with the start permission.
  disciplinar.triggers.push({ type: 'manual', label: 'Abrir sem restrição' });
  assert.deepEqual(check(manifest).errors, []);
  // Children of the allowlisted group are admitted (one level of sub-groups).
  disciplinar.triggers = [{ type: 'manual', label: 'Abrir', manual: { allowedGroups: ['capital_humano'] } }];
  disciplinar.access.grants[0].grantee = 'group:instrutores';
  assert.deepEqual(check(manifest).errors, [], 'instrutores is a child of capital_humano');
  // Unverified membership: a warning with the missing evidence, never a definitive error.
  disciplinar.triggers = [{ type: 'manual', label: 'Abrir', manual: { allowedGroups: ['gestao_corporativa'] } }];
  manifest.groups[0].members[0].verified = false;
  result = check(manifest);
  assert.deepEqual(result.errors, [], messages(result.errors));
  assert.ok(has(result.warnings, /Cannot determine who can start manually.*gc@pixel.ao unverified/));
  // Creator-only: the implicit creator and administrators are not named, so an allowlist is evidence missing, not "nobody".
  disciplinar.access = { default: 'creator_only', sensitivity: 'restricted' };
  disciplinar.triggers = [{ type: 'manual', label: 'Abrir', manual: { allowedUsers: ['owner@pixel.ao'] } }];
  result = check(manifest);
  assert.ok(!has(result.errors, /Nobody holds/), messages(result.errors));
  assert.ok(has(result.warnings, /Cannot determine who can start manually.*implicit creator and organization administrators/));
  disciplinar.access = { grants: [{ grantee: 'group:capital_humano', level: 'create_incident', reason: 'x', sourceRefs: source('pix-ch-pro-009', 'instauracao') }], sensitivity: 'restricted', note: 'n' };
  // Disabled or absent manual triggers: nothing to restrict.
  disciplinar.triggers = [{ type: 'manual', label: 'Abrir', enabled: false, manual: { allowedGroups: ['gestao_corporativa'] } }];
  assert.equal(whoCanStart(disciplinar, manifest.groups), null);
  assert.deepEqual(check(manifest).errors, []);
});

test('duplicate group names, container groups and unresolved keys', () => {
  const manifest = project();
  manifest.groups[1].name = 'gestão corporativa';
  const result = check(manifest);
  assert.ok(has(result.warnings, /share the name/));
  assert.ok(!has(result.warnings, /direccao owns no action/), 'container groups own no action by design');
  manifest.groups.push({ key: 'arquivo', name: 'Arquivo', kind: 'team', members: [] });
  assert.ok(has(check(manifest).warnings, /arquivo owns no action/));
  manifest.workflows[0].unresolvedActors = ['Tesouraria'];
  manifest.workflows[0].unresolvedEntityTypes = [{ name: 'Contrato-quadro' }];
  const analysis = analyze(manifest);
  assert.ok(analysis.unresolved.some(item => item.what === 'register_actor' && item.ref === 'Tesouraria'));
  assert.ok(analysis.unresolved.some(item => item.what === 'register_entity_type' && item.ref === 'Contrato-quadro'));
});

test('field: assignees are design intent: a fallback is required, the YAML carries it and the handover says owner-per-case', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-field-'));
  try {
    const manifest = load('procurement');
    const workflow = manifest.workflows[0];
    workflow.actions[1].assigneeRef = 'field:requerente';
    fs.copyFileSync(path.join(root, 'examples/procurement/workflow.yaml'), path.join(dir, 'workflow.yaml'));
    let result = checkManifest(manifest, dir);
    assert.ok(has(result.errors, /needs a fallback/), messages(result.errors));
    workflow.actions[1].assigneeFallback = 'creator';
    result = checkManifest(manifest, dir);
    assert.ok(has(result.errors, /Field requerente does not exist/));
    const text = fs.readFileSync(path.join(dir, 'workflow.yaml'), 'utf8').replace('fields:\n', 'fields:\n  - name: requerente\n    label: Requerente\n    type: user\n    required: false\n');
    fs.writeFileSync(path.join(dir, 'workflow.yaml'), text);
    result = checkManifest(manifest, dir);
    assert.deepEqual(result.errors, [], messages(result.errors));
    assert.ok(has(result.warnings, /not filled by an earlier action/));
    workflow.actions[0].setsFields = ['requerente'];
    result = checkManifest(manifest, dir);
    assert.ok(!has(result.warnings, /not filled/), messages(result.warnings));
    assert.ok(has(result.warnings, /chefias owns no action/), 'the group the field replaced now owns nothing');
    const resolved = resolveWorkflow(manifest, 'compras', text);
    assert.deepEqual(engine.parseYamlToDraft(resolved.text).draft.actions[1].assignee, { type: 'creator' });
    const setup = renderSetup(manifest);
    assert.match(setup, /Responsável definido à mão em cada caso.*`field:requerente`/);
    workflow.actions[1].assigneeFallback = 'chefias';
    const withGroup = resolveWorkflow(manifest, 'compras', text);
    assert.ok(withGroup.pending.some(item => item.ref === 'chefias'), 'the role-group fallback is resolved like any owner');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('dueInSource, templates and alternate shapes are normalised and reported', () => {
  const manifest = project();
  const action = manifest.workflows[0].actions[1];
  delete action.due;
  action.dueInSource = { text: 'até ao dia 5 do mês seguinte', kind: 'calendar_day' };
  action.description = 'Tarefa: usar o modelo PIX-GC-MOD-003.';
  let result = check(manifest);
  assert.deepEqual(result.errors, []);
  assert.ok(has(result.warnings, /Template PIX-GC-MOD-003 is cited/));
  manifest.workflows[0].templates = [{ code: 'PIX-GC-MOD-003', title: 'Requisição interna', scope: 'action' }];
  assert.deepEqual(check(manifest).warnings, []);
  assert.ok(analyze(manifest).unresolved.some(item => item.what === 'due_manual' && /calendar_day/.test(item.detail)));
  action.dueInSource.kind = 'someday';
  assert.ok(has(check(manifest).errors, /dueInSource needs text and kind/));
  action.dueInSource.kind = 'legal';
  // Alternate shapes from parallel agents converge with a normalisation warning.
  manifest.schemaVersion = 'provia-project/v1';
  manifest.sources[0].sections = ['ambito', 'responsabilidades'];
  manifest.workflows[0].actions[0].sourceRefs = ['pix-gc-pro-002#ambito'];
  manifest.workflows[0].actions[0].folded = ['Informar o requerente'];
  manifest.forms.push({ key: 'f', name: 'Formulário', kind: 'trigger', workflowRef: 'compras', fields: [] });
  result = check(manifest);
  assert.deepEqual(result.errors, [], messages(result.errors));
  assert.ok(has(result.warnings, /Normalized "pix-gc-pro-002#ambito"/));
  assert.ok(has(result.warnings, /Normalized `name` to `title`/));
  assert.ok(has(result.warnings, /Legacy provia-project\/v1/));
  assert.equal(normalizeManifest(manifest).manifest.forms[0].title, 'Formulário');
});

test('unverified emails are listed in the handover; the mode line derives from the receipts', () => {
  const manifest = project();
  manifest.groups[0].members.push({ role: 'Estagiário', email: 'novo@pixel.ao' });
  const result = check(manifest);
  assert.deepEqual(result.errors, []);
  assert.ok(has(result.infos, /novo@pixel.ao is unverified/));
  let setup = renderSetup(manifest);
  assert.match(setup, /## Emails por verificar\n[\s\S]*novo@pixel.ao/);
  assert.match(setup, /Modo: configuração manual \(sem recibos registados\)/);
  manifest.organization = { name: 'Pixel', mode: 'connected', tenantId: 't-1', productRevision: 'fed8efaf0' };
  setup = renderSetup(manifest);
  assert.match(setup, /Modo ligado declarado no manifesto; enquanto não houver recibos/);
  manifest.receipts.push({ tool: 'group_upsert', outcome: 'created', resource: { kind: 'group', id: '8d3c1a2b-1111-4111-8111-111111111111' }, ref: { kind: 'group', key: 'gestao_corporativa' } });
  assert.deepEqual(check(manifest).errors, []);
  assert.match(renderSetup(manifest), /Modo: aplicação parcial \(1 recibos registados/);
});

test('packaging: the access section goes into workflow.yaml by group name, the validator is green and permissions: is rejected', () => {
  const manifest = load('procurement');
  const yaml = yamlOf('procurement');
  const bare = yaml.replace(/access:[\s\S]*?(?=actions:)/, '');
  assert.ok(validateWorkflow(bare).warnings.some(w => w.path === 'workflow.access.not_declared'));
  const result = emitAccess(manifest, 'compras', bare);
  assert.equal(result.placement, 'workflow.yaml');
  assert.equal(result.accessYaml, null);
  assert.deepEqual(result.section, { grants: [{ grantee: 'organization', level: 'create_incident' }, { grantee: 'group:Compras', level: 'view' }] });
  const report = validateWorkflow(result.text);
  assert.equal(report.valid, true, JSON.stringify(report.errors));
  assert.ok(!report.warnings.some(w => w.path === 'workflow.access.not_declared'));
  const plan = engine.planToImportRequest(engine.buildImportPlan(engine.validateWorkflowDraft(engine.parseYamlToDraft(result.text).draft, {}, () => undefined).draft, { prefix: 'COMP', secretValues: {} }));
  assert.deepEqual(plan.access.grants.map(g => g.granteeRef), ['organization', 'Compras'], 'the importer resolves names, not keys');
  assert.doesNotMatch(result.text, /^permissions:/m);
  const injected = validateWorkflow(bare.replace('actions:', 'permissions:\n  grants: []\nactions:'));
  assert.equal(injected.valid, false);
  assert.ok(injected.errors.some(e => e.path === 'schema.unknown_key'));
  assert.throws(() => emitAccess(manifest, 'compras', bare.replace('actions:', 'permissions: {}\nactions:')), /permissions: key/);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-access-'));
  try {
    fs.copyFileSync(path.join(root, 'examples/procurement/workflow.yaml'), path.join(dir, 'workflow.yaml'));
    manifest.workflows[0].file = 'workflow.yaml';
    fs.writeFileSync(path.join(dir, 'provia-project.json'), JSON.stringify(manifest));
    fs.writeFileSync(path.join(dir, 'workflow.yaml'), bare);
    const checkRun = spawnSync(process.execPath, [path.join(root, 'scripts/build-project-map.mjs'), path.join(dir, 'provia-project.json'), '--check'], { encoding: 'utf8' });
    assert.match(checkRun.stderr, /has no access section while the manifest declares grants/);
    const out = execFileSync(process.execPath, [path.join(root, 'scripts/emit-workflow-access.mjs'), path.join(dir, 'provia-project.json'), 'compras', path.join(dir, 'workflow.yaml'), '--output', path.join(dir, 'workflow.access.yaml')], { encoding: 'utf8' });
    assert.equal(JSON.parse(out).placement, 'workflow.yaml');
    assert.ok(fs.readFileSync(path.join(dir, 'workflow.access.yaml'), 'utf8').includes('grantee: "group:Compras"'));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the browser package carries no allowlist keys and setup.md has the blocking step; receipts turn it into UUIDs', () => {
  const manifest = load('procurement');
  const workflow = manifest.workflows[0];
  workflow.triggers = [{ type: 'manual', label: 'Iniciar pedido', manual: { allowedGroups: ['compras'] } }];
  workflow.access.grants[1].level = 'create_incident';
  let analysis = analyze(manifest);
  assert.ok(analysis.unresolved.some(item => item.what === 'restrict_manual_start' && item.blocking));
  assert.equal(analysis.readiness[0].blocked, true);
  assert.match(renderSetup(manifest), /\*\*BLOQUEIO\*\* Restringir o início manual aos principais indicados/);
  const yaml = yamlOf('procurement');
  let resolved = resolveWorkflow(manifest, 'compras', yaml);
  assert.ok(resolved.pending.some(item => item.field === 'config.allowedGroups/allowedUsers' && item.blocking));
  assert.equal(engine.parseYamlToDraft(resolved.text).draft.triggers[0].config.allowedGroups, undefined, 'never a key in the YAML');
  manifest.organization = { name: 'X', mode: 'connected', tenantId: 't', productRevision: 'fed8efaf0' };
  assert.ok(has(checkManifest(manifest, null).errors, /No receipt resolves group compras; the allowlist cannot be written and must not be dropped/));
  manifest.receipts.push({ tool: 'group_upsert', outcome: 'created', resource: { kind: 'group', id: '8d3c1a2b-2222-4222-8222-222222222222' }, ref: { kind: 'group', key: 'compras' } });
  assert.deepEqual(checkManifest(manifest, null).errors, []);
  resolved = resolveWorkflow(manifest, 'compras', yaml);
  assert.deepEqual(engine.parseYamlToDraft(resolved.text).draft.triggers[0].config.allowedGroups, ['8d3c1a2b-2222-4222-8222-222222222222']);
  assert.deepEqual(resolved.groupRefs, { compras: '8d3c1a2b-2222-4222-8222-222222222222' });
  assert.ok(resolved.access.grants.some(g => g.granteeRef === 'compras' && g.granteeId === '8d3c1a2b-2222-4222-8222-222222222222'));
  assert.equal(validateWorkflow(resolved.text).valid, true);
  // Group ids prove the principals resolve, not that the restriction exists in the tenant: the browser emitter still writes no allowlist.
  const browser = emitAccess(manifest, 'compras', yaml);
  assert.equal(engine.parseYamlToDraft(browser.text).draft.triggers[0].config.allowedGroups, undefined);
  analysis = analyze(manifest);
  assert.equal(analysis.access[0].allowlists[0].state, 'resolved');
  assert.equal(analysis.readiness[0].blocked, true, 'resolved ids do not clear the block');
  assert.ok(analysis.unresolved.some(item => item.what === 'apply_manual_start' && item.blocking));
  assert.match(renderSetup(manifest), /\*\*BLOQUEIO\*\* Escrever a restrição de início manual/);
  // Only a recorded application on an imported workflow clears it; the named verification step stays pending.
  workflow.triggers[0].manual.applied = { at: '2026-09-21T10:00:00Z' };
  assert.ok(has(checkManifest(manifest, null).errors, /applied records when and which restriction/), 'the attestation names the policy it applied');
  manifest.receipts.push({ tool: 'workflow_import_draft', outcome: 'created', resource: { kind: 'workflow', id: '7d3c1a2b-2222-4222-8222-222222222222' }, ref: { kind: 'workflow', key: 'compras' } });
  const fingerprint = analyze(manifest).access[0].allowlists[0].fingerprint;
  assert.ok(fingerprint, 'the apply_manual_start item carries the hash to record');
  assert.ok(analyze(manifest).unresolved.some(item => item.what === 'apply_manual_start' && item.detail.includes(fingerprint)));
  workflow.triggers[0].manual.applied = { at: '2026-09-21T10:00:00Z', hash: 'stale' };
  assert.ok(has(checkManifest(manifest, null).warnings, /different allowlist, different principal ids or another workflow/));
  assert.equal(analyze(manifest).readiness[0].blocked, true);
  workflow.triggers[0].manual.applied.hash = fingerprint;
  manifest.receipts.pop();
  assert.ok(has(checkManifest(manifest, null).warnings, /recorded as applied but no receipt resolves the workflow/));
  assert.equal(analyze(manifest).readiness[0].blocked, true);
  manifest.receipts.push({ tool: 'workflow_import_draft', outcome: 'created', resource: { kind: 'workflow', id: '7d3c1a2b-2222-4222-8222-222222222222' }, ref: { kind: 'workflow', key: 'compras' } });
  analysis = analyze(manifest);
  assert.equal(analysis.access[0].allowlists[0].state, 'applied');
  assert.equal(analysis.readiness[0].blocked, false);
  assert.ok(analysis.unresolved.some(item => item.what === 'verify_can_start' && !item.blocking), 'connected mode keeps the named verification step pending');
  // Changing the list, or the destination workflow, invalidates the attestation.
  workflow.triggers[0].manual.allowedGroups = ['chefias'];
  manifest.receipts.push({ tool: 'group_upsert', outcome: 'created', resource: { kind: 'group', id: '8d3c1a2b-3333-4333-8333-333333333333' }, ref: { kind: 'group', key: 'chefias' } });
  analysis = analyze(manifest);
  assert.equal(analysis.access[0].allowlists[0].state, 'resolved');
  assert.equal(analysis.readiness[0].blocked, true, 'a changed allowlist needs a new application');
  workflow.triggers[0].manual.allowedGroups = ['compras'];
  manifest.receipts.find(receipt => receipt.ref.kind === 'workflow').resource.id = '7d3c1a2b-9999-4999-8999-999999999999';
  assert.equal(analyze(manifest).access[0].allowlists[0].state, 'resolved', 'another destination workflow needs a new application');
  manifest.receipts.find(receipt => receipt.ref.kind === 'workflow').resource.id = '7d3c1a2b-2222-4222-8222-222222222222';
  assert.equal(analyze(manifest).access[0].allowlists[0].state, 'applied');
  // Repointing the group receipt changes what the allowlist writes: the attestation no longer holds.
  manifest.receipts.find(receipt => receipt.ref.kind === 'group' && receipt.ref.key === 'compras').resource.id = '8d3c1a2b-7777-4777-8777-777777777777';
  assert.equal(analyze(manifest).access[0].allowlists[0].state, 'resolved', 'a repointed principal id needs a new application');
  manifest.receipts.find(receipt => receipt.ref.kind === 'group' && receipt.ref.key === 'compras').resource.id = '8d3c1a2b-2222-4222-8222-222222222222';
  // A recorded start verification clears the pending task only when it names a member, confirms canStart and matches the current fingerprint.
  const current = analyze(manifest).access[0].allowlists[0].fingerprint;
  workflow.access.startVerification = { member: 'tecnico@example.ao', at: '2026-09-22T09:00:00Z', result: 'canStart', hash: 'old' };
  assert.ok(analyze(manifest).unresolved.some(item => item.what === 'verify_can_start'), 'a verification of another list does not count');
  workflow.access.startVerification.hash = current;
  assert.deepEqual(checkManifest(manifest, null).errors, []);
  assert.ok(!analyze(manifest).unresolved.some(item => item.what === 'verify_can_start'), 'current evidence clears the task');
  assert.equal(analyze(manifest).access[0].allowlists[0].verified, true);
  workflow.access.startVerification.result = 'cannot_start';
  assert.ok(analyze(manifest).unresolved.some(item => item.what === 'verify_can_start'));
  // The latest result per member decides: an earlier success does not mask a later failure, and a later success clears it again.
  workflow.access.startVerification = [
    { member: 'tecnico@example.ao', at: '2026-09-22T09:00:00Z', result: 'canStart', hash: current },
    { member: 'Tecnico@example.ao', at: '2026-09-23T09:00:00Z', result: 'cannot_start', hash: current },
  ];
  assert.ok(analyze(manifest).unresolved.some(item => item.what === 'verify_can_start'), 'a later cannot_start supersedes the earlier success');
  assert.equal(analyze(manifest).access[0].allowlists[0].verified, false);
  workflow.access.startVerification.push({ member: 'tecnico@example.ao', at: '2026-09-24T09:00:00Z', result: 'canStart', hash: current });
  assert.ok(!analyze(manifest).unresolved.some(item => item.what === 'verify_can_start'), 'the newest result is canStart again');
  workflow.access.startVerification.push({ member: 'outro@example.ao', at: '2026-09-25T09:00:00Z', result: 'cannot_start', hash: current });
  assert.ok(!analyze(manifest).unresolved.some(item => item.what === 'verify_can_start'), 'another member failing does not undo a member whose latest result is canStart');
  // Timestamps are compared as instants, not strings: an offset or a fraction of a second must not reorder the entries.
  workflow.access.startVerification = [
    { member: 'tecnico@example.ao', at: '2026-09-21T10:00:00+01:00', result: 'canStart', hash: current },
    { member: 'tecnico@example.ao', at: '2026-09-21T09:30:00Z', result: 'cannot_start', hash: current },
  ];
  assert.deepEqual(checkManifest(manifest, null).errors, []);
  assert.equal(analyze(manifest).access[0].allowlists[0].verified, false, '09:30Z is 30 minutes after 10:00+01:00');
  workflow.access.startVerification = [
    { member: 'tecnico@example.ao', at: '2026-09-21T09:00:00Z', result: 'canStart', hash: current },
    { member: 'tecnico@example.ao', at: '2026-09-21T09:00:00.100Z', result: 'cannot_start', hash: current },
  ];
  assert.equal(analyze(manifest).access[0].allowlists[0].verified, false, 'fractional seconds order correctly');
  workflow.access.startVerification.reverse();
  assert.equal(analyze(manifest).access[0].allowlists[0].verified, false, 'list order does not matter when the instants differ');
  workflow.access.startVerification = [
    { member: 'tecnico@example.ao', at: '2026-09-21T09:00:00Z', result: 'canStart', hash: current },
    { member: 'tecnico@example.ao', at: '2026-09-21T10:00:00+01:00', result: 'cannot_start', hash: current },
  ];
  assert.equal(analyze(manifest).access[0].allowlists[0].verified, false, 'equal instants: the later entry in the list wins');
  workflow.access.startVerification.reverse();
  assert.equal(analyze(manifest).access[0].allowlists[0].verified, true);
  workflow.access.startVerification = { member: 'tecnico@example.ao', at: 'ontem', result: 'canStart', hash: current };
  assert.ok(has(checkManifest(manifest, null).errors, /at must be an ISO 8601 date-time/));
  assert.equal(analyze(manifest).access[0].allowlists[0].verified, false, 'an entry that cannot be placed in time never verifies');
  workflow.access.startVerification = { member: 'x', at: '2026-09-22' };
  assert.ok(has(checkManifest(manifest, null).errors, /A start verification records/));
  delete workflow.access.startVerification;
  // An enabled manual trigger in the file that the manifest does not describe is an error: it bypasses the restriction.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-bypass-'));
  try {
    fs.writeFileSync(path.join(dir, 'workflow.yaml'), yaml.replace('triggers:\n', 'triggers:\n  - type: manual\n    label: Porta aberta\n    enabled: true\n    config: {}\n'));
    workflow.file = 'workflow.yaml';
    assert.ok(has(checkManifest(manifest, dir).errors, /Porta aberta.*bypasses the declared restriction/));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the resolver handles user allowlists and manifest triggers the YAML lacks, and exits 1 on a blocking item', () => {
  const manifest = load('procurement');
  const workflow = manifest.workflows[0];
  workflow.triggers = [{ type: 'manual', label: 'Iniciar pedido', manual: { allowedUsers: ['starter@example.ao'] } }];
  const yaml = yamlOf('procurement');
  let resolved = resolveWorkflow(manifest, 'compras', yaml);
  assert.ok(resolved.pending.some(item => item.blocking && item.ref === 'starter@example.ao'), 'a user-only allowlist is never ignored');
  assert.deepEqual(engine.parseYamlToDraft(resolved.text).draft.triggers[0].config, {});
  assert.equal(analyze(manifest).access[0].allowlists[0].users[0], 'starter@example.ao');
  manifest.receipts.push({ tool: 'users_search', outcome: 'no_op', resource: { kind: 'user', id: '9d3c1a2b-2222-4222-8222-222222222222', email: 'starter@example.ao' }, ref: { kind: 'user', key: 'starter@example.ao' } });
  assert.deepEqual(checkManifest(manifest, null).errors, []);
  resolved = resolveWorkflow(manifest, 'compras', yaml);
  assert.deepEqual(engine.parseYamlToDraft(resolved.text).draft.triggers[0].config.allowedUsers, ['9d3c1a2b-2222-4222-8222-222222222222']);
  assert.equal(validateWorkflow(resolved.text).valid, true);
  manifest.receipts[0].ref.key = 'Starter@Example.ao';
  assert.ok(has(checkManifest(manifest, null).errors, /keyed by the lower-case email/));
  manifest.receipts.pop();
  const draft = engine.parseYamlToDraft(yaml).draft;
  draft.triggers = [];
  resolved = resolveWorkflow(manifest, 'compras', JSON.stringify(draft));
  assert.ok(resolved.pending.some(item => item.blocking && /no exact counterpart in the YAML/.test(item.reason)), 'a manifest trigger missing from the YAML is rejected, not ignored');
  // A labelled manifest trigger never falls back to an unrelated YAML trigger; an undeclared open trigger is a bypass.
  const two = engine.parseYamlToDraft(yaml).draft;
  two.triggers = [{ type: 'manual', label: 'Unrelated disabled', enabled: false, config: {} }, { type: 'manual', label: 'Open', enabled: true, config: {} }];
  resolved = resolveWorkflow(manifest, 'compras', JSON.stringify(two));
  assert.ok(engine.parseYamlToDraft(resolved.text).draft.triggers.every(trigger => !trigger.config.allowedUsers && !trigger.config.allowedGroups), 'nothing written to an unrelated trigger');
  assert.ok(resolved.pending.some(item => item.blocking && /bypasses the declared restriction/.test(item.reason) && item.ref === 'Open'));
  // Both allowlist arrays are rewritten from the manifest: a principal the manifest no longer lists loses the permission.
  const stale = engine.parseYamlToDraft(yaml).draft;
  stale.triggers[0].config = { allowedUsers: ['22222222-2222-4222-8222-222222222222'] };
  workflow.triggers[0].manual = { allowedGroups: ['compras'] };
  manifest.receipts.push({ tool: 'group_upsert', outcome: 'created', resource: { kind: 'group', id: '8d3c1a2b-2222-4222-8222-222222222222' }, ref: { kind: 'group', key: 'compras' } });
  resolved = resolveWorkflow(manifest, 'compras', JSON.stringify(stale));
  assert.deepEqual(engine.parseYamlToDraft(resolved.text).draft.triggers[0].config, { allowedGroups: ['8d3c1a2b-2222-4222-8222-222222222222'] });
  workflow.triggers[0].manual = {};
  resolved = resolveWorkflow(manifest, 'compras', JSON.stringify(stale));
  assert.deepEqual(engine.parseYamlToDraft(resolved.text).draft.triggers[0].config, {}, 'a trigger the manifest declares open loses a stale YAML allowlist');
  // Enablement follows the manifest: a legacy open trigger the manifest disables cannot stay enabled in the tenant.
  const legacy = engine.parseYamlToDraft(yaml).draft;
  legacy.triggers = [{ type: 'manual', label: 'Iniciar pedido', enabled: true, config: {} }, { type: 'manual', label: 'Legacy', enabled: true, config: {} }];
  workflow.triggers = [{ type: 'manual', label: 'Iniciar pedido', manual: { allowedGroups: ['compras'] } }, { type: 'manual', label: 'Legacy', enabled: false }];
  resolved = resolveWorkflow(manifest, 'compras', JSON.stringify(legacy));
  const triggers = engine.parseYamlToDraft(resolved.text).draft.triggers;
  assert.equal(triggers[1].enabled, false, 'the manifest disables the legacy trigger');
  assert.deepEqual(triggers[0].config.allowedGroups, ['8d3c1a2b-2222-4222-8222-222222222222']);
  assert.ok(resolved.applied.some(item => item.field === 'enabled' && item.trigger === 'Legacy'));
  assert.deepEqual(resolved.pending.filter(item => item.blocking), []);
  manifest.receipts.pop();
  workflow.triggers[0].manual = { allowedUsers: ['starter@example.ao'] };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-resolve-block-'));
  try {
    fs.writeFileSync(path.join(dir, 'provia-project.json'), JSON.stringify(manifest));
    fs.writeFileSync(path.join(dir, 'workflow.yaml'), yaml);
    const cli = spawnSync(process.execPath, [path.join(root, 'scripts/resolve-workflow-refs.mjs'), path.join(dir, 'provia-project.json'), 'compras', path.join(dir, 'workflow.yaml'), '--output', path.join(dir, 'resolved.yaml')], { encoding: 'utf8' });
    assert.equal(cli.status, 1);
    assert.match(cli.stderr, /blocking item/);
    assert.equal(JSON.parse(cli.stdout).blocking, 1);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('connected apply: a deterministic request, revisions minted only when the payload changes, retries verbatim', () => {
  const manifest = project();
  manifest.receipts.push({ tool: 'group_upsert', outcome: 'created', resource: { kind: 'group', id: '8d3c1a2b-1111-4111-8111-111111111111' }, ref: { kind: 'group', key: 'gestao_corporativa' } });
  const first = planAccessApply(manifest, 'compras');
  assert.equal(first.request.idempotencyKey, 'pix/access/compras/1');
  assert.equal(first.request.workflowName, 'Pedido de compra');
  assert.deepEqual(first.request.groupRefs, { gestao_corporativa: '8d3c1a2b-1111-4111-8111-111111111111' });
  assert.deepEqual(first.request.grants[1], { granteeType: 'group', granteeRef: 'gestao_corporativa', granteeId: '8d3c1a2b-1111-4111-8111-111111111111', level: 'view' });
  assert.equal(first.reuse, false);
  manifest.workflows[0].access.operations = [first.operation];
  const again = planAccessApply(manifest, 'compras');
  assert.equal(again.reuse, true, 'same payload reuses the revision');
  assert.equal(again.request.idempotencyKey, 'pix/access/compras/1');
  const retry = planAccessApply(manifest, 'compras', { retry: true });
  assert.deepEqual(retry.request, first.request, 'a retry sends the stored payload verbatim');
  const byId = planAccessApply(manifest, 'compras', { workflowId: '7d3c1a2b-1111-4111-8111-111111111111' });
  assert.equal(byId.request.idempotencyKey, 'pix/access/compras/2', 'switching from workflowName to workflowId is a different operation');
  manifest.workflows[0].access.operations.push(byId.operation);
  manifest.workflows[0].access.grants[1].level = 'edit';
  const changed = planAccessApply(manifest, 'compras', { workflowId: '7d3c1a2b-1111-4111-8111-111111111111' });
  assert.equal(changed.request.idempotencyKey, 'pix/access/compras/3', 'a changed grant mints a new revision');
  manifest.workflows[0].access.operations.push(changed.operation);
  manifest.workflows[0].access.grants[1].level = 'view';
  const back = planAccessApply(manifest, 'compras', { workflowId: '7d3c1a2b-1111-4111-8111-111111111111' });
  assert.equal(back.request.idempotencyKey, 'pix/access/compras/4', 'returning to an earlier policy is a new operation, never a replay of the old key');
  assert.equal(back.reuse, false);
  manifest.workflows[0].access.grants[1].level = 'edit';
  manifest.receipts.push({ tool: 'group_upsert', outcome: 'created', resource: { kind: 'group', id: '8d3c1a2b-3333-4333-8333-333333333333' }, ref: { kind: 'group', key: 'capital_humano' } });
  manifest.workflows[0].access.grants.push({ grantee: 'group:capital_humano', level: 'view', reason: 'x', sourceRefs: source('pix-gc-pro-002') });
  const moreRefs = planAccessApply(manifest, 'compras', { workflowId: '7d3c1a2b-1111-4111-8111-111111111111' });
  assert.notEqual(moreRefs.operation.hash, changed.operation.hash, 'an extra groupRefs entry changes the hash');
  assert.equal(hashRequest({ b: 1, a: [1, 2] }), hashRequest({ a: [1, 2], b: 1 }), 'canonical hashing ignores key order');
  const replace = planAccessApply(manifest, 'disciplinar', { mode: 'replace' });
  assert.equal(replace.request.mode, 'replace');
  assert.deepEqual(replace.pending, [], 'capital_humano resolves');
  const result = check(manifest);
  assert.deepEqual(result.errors, [], messages(result.errors));
  const cli = spawnSync(process.execPath, [path.join(root, 'scripts/plan-workflow-access.mjs'), path.join(root, 'examples/procurement/provia-project.json'), 'compras'], { encoding: 'utf8' });
  assert.equal(cli.status, 0, cli.stderr);
  const printed = JSON.parse(cli.stdout);
  assert.equal(printed.request.idempotencyKey, 'compras-exemplo/access/compras/1');
  assert.equal(printed.dryRunFirst.dryRun, true);
  assert.deepEqual(printed.pendingGroupRefs, ['compras']);
});

test('retained excess: merge keeps what the tenant holds; rule 5 and rule 4 violations block readiness until a confirmed removal', () => {
  const manifest = project();
  const disciplinar = manifest.workflows[1];
  disciplinar.access.applied = [
    { id: 'p1', granteeType: 'group', granteeRef: 'Capital Humano', level: 'create_incident' },
    { id: 'p2', granteeType: 'organization', granteeRef: 'org', level: 'view' },
    { id: 'p3', granteeType: 'group', granteeRef: 'Instrutores', level: 'view' },
    { id: 'p4', granteeType: 'user', granteeRef: 'dg@pixel.ao', level: 'view' },
  ];
  const held = retainedExcess(disciplinar, manifest.groups);
  assert.deepEqual(held.map(item => item.granteeRef), ['org', 'Instrutores', 'dg@pixel.ao'], 'the approved grant at its level is not excess');
  const assigned = new Set(['capital_humano', 'instrutores', 'direccao']);
  assert.match(retainedBlock(held[0], disciplinar, assigned), /rule 5/);
  assert.match(retainedBlock(held[1], disciplinar, assigned), /rule 4/);
  assert.equal(retainedBlock(held[2], disciplinar, assigned), null, 'a user grant outside the set is reported, not blocking');
  let result = check(manifest);
  assert.deepEqual(result.errors, []);
  assert.equal(result.warnings.filter(w => /Readiness blocked/.test(w.message)).length, 2, messages(result.warnings));
  let analysis = analyze(manifest);
  assert.equal(analysis.readiness[1].blocked, true);
  // Identity beats names: when both the recorded granteeId and the receipt id exist they must match. A held grant that carries
  // another group's id is not the approved grant even under the same name, so it stays unapplied and is judged as retained.
  const idA = '8d3c1a2b-aaaa-4aaa-8aaa-aaaaaaaaaaaa', idB = '8d3c1a2b-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  manifest.receipts.push({ tool: 'group_upsert', outcome: 'created', resource: { kind: 'group', id: idB }, ref: { kind: 'group', key: 'capital_humano' } });
  manifest.receipts.push({ tool: 'group_upsert', outcome: 'created', resource: { kind: 'group', id: idA }, ref: { kind: 'group', key: 'instrutores' } });
  const conflicting = { id: 'p5', granteeType: 'group', granteeRef: 'Capital Humano', granteeId: idA, level: 'admin' };
  disciplinar.access.applied = [conflicting];
  disciplinar.access.grants[0].level = 'admin';
  const withIds = retainedExcess(disciplinar, manifest.groups, receiptIndex(manifest));
  assert.equal(withIds.length, 1, 'the name match does not satisfy the approved grant when the ids differ');
  assert.equal(withIds[0].groupKey, 'instrutores', 'the held grant belongs to the group whose id it carries');
  assert.match(retainedBlock(withIds[0], disciplinar, assigned), /admin held outside/);
  analysis = analyze(manifest);
  assert.equal(analysis.access[1].grants[0].applied, false, 'group B\'s admin grant is not satisfied by group A\'s');
  assert.equal(analysis.readiness[1].blocked, true);
  conflicting.granteeId = idB;
  assert.deepEqual(retainedExcess(disciplinar, manifest.groups, receiptIndex(manifest)), [], 'matching ids satisfy the grant');
  assert.equal(analyze(manifest).access[1].grants[0].applied, true);
  delete conflicting.granteeId;
  assert.equal(analyze(manifest).access[1].grants[0].applied, true, 'without a recorded id the name is the only identity and still matches');
  disciplinar.access.grants[0].level = 'create_incident';
  manifest.receipts.splice(-2, 2);
  disciplinar.access.applied = [
    { id: 'p1', granteeType: 'group', granteeRef: 'Capital Humano', level: 'create_incident' },
    { id: 'p2', granteeType: 'organization', granteeRef: 'org', level: 'view' },
    { id: 'p3', granteeType: 'group', granteeRef: 'Instrutores', level: 'view' },
    { id: 'p4', granteeType: 'user', granteeRef: 'dg@pixel.ao', level: 'view' },
  ];
  analysis = analyze(manifest);
  assert.ok(analysis.unresolved.some(item => item.what === 'remove_retained_grant' && item.blocking));
  assert.ok(analysis.unresolved.some(item => item.what === 'review_retained_grant' && /dg@pixel.ao/.test(item.ref)));
  assert.match(renderSetup(manifest), /### Concessões retidas no destino[\s\S]*organization:org → view — \*\*BLOQUEIO\*\*/);
  assert.match(renderMap(manifest, null), /Concessões retidas no destino/);
  // Adding the instructor grant with reason and sourceRefs reruns the rules and clears rule 4; nothing clears rule 5.
  disciplinar.access.grants.push({ grantee: 'group:instrutores', level: 'view', reason: 'Trabalham a partir da fila de processos', sourceRefs: source('pix-ch-pro-009', 'instrucao') });
  result = check(manifest);
  assert.deepEqual(result.errors, [], messages(result.errors));
  assert.equal(result.warnings.filter(w => /Readiness blocked/.test(w.message)).length, 1);
  disciplinar.access.grants.push({ grantee: 'organization', level: 'view', reason: 'tentativa', sourceRefs: source('pix-ch-pro-009') });
  assert.ok(has(check(manifest).errors, /rule 5/), 'a justification does not clear an organization grant on a restricted workflow');
  disciplinar.access.grants.pop();
  // Only a fresh read without the grant clears the block; a planned removal changes nothing here.
  disciplinar.access.applied = disciplinar.access.applied.filter(item => item.id !== 'p2');
  analysis = analyze(manifest);
  assert.equal(analysis.readiness[1].blocked, false);
  // An admin outside the approved set blocks even on an internal workflow.
  manifest.workflows[0].access.applied = [{ granteeType: 'group', granteeRef: 'Gestão Corporativa', level: 'admin' }];
  assert.ok(has(check(manifest).warnings, /Readiness blocked.*admin held outside the approved set/));
  manifest.workflows[0].access.applied = [{ granteeType: 'group', granteeRef: 'Gestão Corporativa', level: 'edit' }];
  assert.ok(has(check(manifest).infos, /retains group:Gestão Corporativa at edit \(approved view\)/));
});

test('access receipts and access_disabled surface in the handover instead of a success claim', () => {
  const manifest = project();
  manifest.receipts.push({ tool: 'workflow_access_apply', idempotencyKey: 'pix/access/compras/1', outcome: 'no_op', resource: { kind: 'workflow', id: '7d3c1a2b-1111-4111-8111-111111111111' }, ref: { kind: 'access', key: 'compras' }, warnings: ['access_disabled'] });
  assert.deepEqual(check(manifest).errors, []);
  let analysis = analyze(manifest);
  assert.ok(analysis.unresolved.some(item => item.what === 'access_disabled'));
  assert.ok(analysis.unresolved.some(item => item.what === 'apply_access' && item.key === 'compras'), 'a receipt alone applies nothing; the read-back decides');
  assert.match(renderSetup(manifest), /access_disabled/);
  // Per-grant completion comes from workflow_get.access; a receipt with unresolved grants or for another operation stays pending.
  manifest.receipts[0].warnings = [];
  manifest.workflows[0].access.applied = [{ granteeType: 'organization', granteeRef: 'org', level: 'create_incident' }];
  analysis = analyze(manifest);
  assert.deepEqual(analysis.access[0].grants.map(grant => grant.applied), [true, false]);
  assert.match(analysis.unresolved.find(item => item.what === 'apply_access').detail, /^group:gestao_corporativa → view$/);
  manifest.workflows[0].access.applied.push({ granteeType: 'group', granteeRef: 'Gestão Corporativa', level: 'view' });
  assert.equal(analyze(manifest).access[0].applied, true);
  assert.ok(!analyze(manifest).unresolved.some(item => item.what === 'apply_access' && item.key === 'compras'));
  manifest.receipts[0].unresolved = [{ index: 1, granteeType: 'group', granteeRef: 'gestao_corporativa', reason: 'not_found' }];
  analysis = analyze(manifest);
  assert.equal(analysis.access[0].applied, false);
  assert.match(analysis.access[0].receipt.problem, /left 1 grant\(s\) unresolved/);
  manifest.receipts[0].unresolved = [];
  const op = planAccessApply(manifest, 'compras').operation;
  manifest.workflows[0].access.operations = [op];
  manifest.receipts[0].idempotencyKey = 'pix/access/compras/0';
  assert.match(analyze(manifest).access[0].receipt.problem, /is not the current operation/);
  delete manifest.receipts[0].idempotencyKey;
  assert.match(analyze(manifest).access[0].receipt.problem, /carries no idempotencyKey/);
  manifest.receipts[0].idempotencyKey = op.idempotencyKey;
  assert.equal(analyze(manifest).access[0].applied, true);
  manifest.workflows[0].access.grants[1].level = 'edit';
  assert.match(analyze(manifest).access[0].receipt.problem, /approved grants or the destination workflow changed/);
  manifest.workflows[0].access.grants[1].level = 'view';
  // The destination is the current workflow receipt: an operation and a read-back for workflow A do not apply to workflow B.
  manifest.receipts.push({ tool: 'workflow_import_draft', outcome: 'created', resource: { kind: 'workflow', id: '7d3c1a2b-bbbb-4bbb-8bbb-bbbbbbbbbbbb' }, ref: { kind: 'workflow', key: 'compras' } });
  assert.match(analyze(manifest).access[0].receipt.problem, /approved grants or the destination workflow changed/, 'the recorded operation named no id, so it is not the current destination');
  manifest.workflows[0].access.operations = [planAccessApply(manifest, 'compras').operation];
  manifest.receipts[0].idempotencyKey = manifest.workflows[0].access.operations[0].idempotencyKey;
  manifest.workflows[0].access.appliedWorkflowId = '7d3c1a2b-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  assert.equal(analyze(manifest).access[0].applied, false, 'a read-back from another workflow proves nothing here');
  assert.ok(has(check(manifest).warnings, /read-back came from workflow 7d3c1a2b-aaaa/));
  // Nor does it instruct anything: a grant read from workflow A is not a retained grant under workflow B.
  manifest.workflows[0].access.sensitivity = 'restricted';
  manifest.workflows[0].access.applied.push({ id: 'x1', granteeType: 'organization', granteeRef: 'org', level: 'view' }, { id: 'x2', granteeType: 'group', granteeRef: 'Instrutores', level: 'admin' });
  const stale = analyze(manifest);
  assert.deepEqual(stale.access[0].retainedExcess, [], 'evidence from another workflow yields no retained excess');
  assert.ok(!stale.unresolved.some(item => item.what === 'remove_retained_grant' && item.key === 'compras'), 'no revocation is instructed under the wrong workflow');
  assert.equal(stale.readiness[0].blocked, false, 'the block comes from a fresh read of the destination, not from A\'s grants');
  assert.ok(stale.unresolved.some(item => item.what === 'readback_access' && item.key === 'compras' && /came from workflow 7d3c1a2b-aaaa.*read workflow_get/.test(item.detail)), 'a fresh read of the destination is requested');
  assert.ok(!has(check(manifest).warnings, /Readiness blocked/), messages(check(manifest).warnings));
  manifest.workflows[0].access.applied.splice(-2, 2);
  manifest.workflows[0].access.sensitivity = 'internal';
  manifest.workflows[0].access.appliedWorkflowId = '7d3c1a2b-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  assert.equal(analyze(manifest).access[0].applied, true);
  manifest.receipts.pop();
  delete manifest.workflows[0].access.appliedWorkflowId;
  manifest.workflows[0].access.operations = [op];
  manifest.receipts[0].idempotencyKey = op.idempotencyKey;
  delete manifest.workflows[0].access.applied;
  assert.ok(analyze(manifest).unresolved.some(item => item.what === 'apply_access' && item.key === 'compras'), 'no read-back, nothing applied');
  manifest.receipts[0].ref.key = 'ghost';
  assert.ok(has(check(manifest).errors, /No workflow with key ghost/));
  manifest.receipts[0] = { tool: 'workflow_import_draft', outcome: 'created', resource: { kind: 'workflow', id: '7d3c1a2b-1111-4111-8111-111111111111' }, ref: { kind: 'workflow', key: 'compras' }, warnings: [{ code: 'access_disabled', path: 'access' }] };
  assert.ok(analyze(manifest).unresolved.some(item => item.what === 'access_disabled' && /workflow_import_draft/.test(item.detail)), 'an import receipt carries the warning too');
});

test('connected mode trusts the tenant level list recorded from setup_references_list', () => {
  const manifest = project();
  manifest.organization = { name: 'Pixel', mode: 'connected', tenantId: 't-1', productRevision: 'fed8efaf0', permissionLevels: { resourceTypes: { workflow: { levels: [{ level: 'view', rank: 1 }, { level: 'edit', rank: 3 }, { level: 'admin', rank: 4 }] } } } };
  const result = check(manifest);
  assert.ok(result.errors.some(item => /Use one of view, edit, admin \(tenant list/.test(item.message)), messages(result.errors));
  manifest.organization.permissionLevels = { resourceTypes: {} };
  const fallback = check(manifest);
  assert.ok(!has(fallback.errors, /rule 2/));
  assert.ok(has(fallback.warnings, /carries no resourceTypes.workflow.levels/));
});

test('the map has an access tab with every workflow × grantee × level row and the readiness list', () => {
  const html = renderMap(project(), null);
  const data = JSON.parse(html.match(/id="project-data">([\s\S]*?)<\/script>/)[1]);
  const compras = data.access.find(entry => entry.workflow === 'compras');
  assert.equal(compras.ownerArea, 'gestao_corporativa');
  assert.equal(compras.sensitivity, 'internal');
  assert.ok(compras.grants.some(grant => grant.grantee === 'organization' && grant.level === 'create_incident'));
  assert.ok(data.access.some(entry => entry.assigned.includes('instrutores')), 'assigned groups without a grant are listed as seeing their own cases');
  assert.ok(data.readiness.some(item => item.workflow === 'compras'));
  assert.equal(data.labels.access.seesOwn, 'vê apenas os seus casos');
  assert.equal(data.labels.access.readiness, 'Prontidão');
});

test('reconciliation proposes access from the first action under rule 4 and leaves assigned teams as questions', () => {
  const manifest = load('procurement');
  delete manifest.workflows[0].access;
  manifest.schemaVersion = 'provia-project/v1';
  manifest.workflows[0].setupNotes.push('Processo confidencial: dados salariais.');
  const result = reconcile(manifest, { today: '2026-09-21' });
  assert.equal(result.manifest.schemaVersion, SCHEMA);
  const access = result.manifest.workflows[0].access;
  assert.equal(access.sensitivity, 'restricted');
  assert.equal(access.default, 'creator_only', 'a creator first action without an open-start source proposes nothing wider');
  assert.ok(result.reviews.some(item => item.group === 'chefias'), 'assigned groups get a question, never a view proposal');
  assert.ok(!access.grants.some(grant => grant.level === 'view'));
  const it = load('it-service');
  delete it.workflows[0].access;
  const proposed = reconcile(it, { today: '2026-09-21' }).manifest.workflows[0].access;
  assert.deepEqual(proposed.grants.map(grant => [grant.grantee, grant.level, grant.reason]), [['group:suporte_ti', 'create_incident', RECONCILED_REASON]]);
  const disciplinary = project();
  delete disciplinary.workflows[1].access;
  disciplinary.workflows[1].setupNotes = ['Procedimento disciplinar'];
  const snapshot = { disciplinar: { grants: [{ id: 'p2', granteeType: 'organization', granteeRef: 'org', level: 'view' }] } };
  const reconciled = reconcile(disciplinary, { snapshot, today: '2026-09-21' });
  assert.equal(reconciled.manifest.workflows[1].access.sensitivity, 'restricted');
  assert.ok(reconciled.manifest.decisions.some(decision => decision.id === 'ACC-disciplinar'), 'starters-see-all limitation recorded');
  assert.equal(reconciled.retainedExcess.length, 1);
  assert.match(reconciled.retainedExcess[0].block, /rule 5/);
  assert.deepEqual(reconciled.staleReadBacks, []);
  // A snapshot taken from another workflow instructs no removal under the destination; the script asks for a fresh read.
  disciplinary.receipts.push({ tool: 'workflow_import_draft', outcome: 'created', resource: { kind: 'workflow', id: '7d3c1a2b-bbbb-4bbb-8bbb-bbbbbbbbbbbb' }, ref: { kind: 'workflow', key: 'disciplinar' } });
  const staleSnapshot = { disciplinar: { workflowId: '7d3c1a2b-aaaa-4aaa-8aaa-aaaaaaaaaaaa', grants: snapshot.disciplinar.grants } };
  const staleReconciled = reconcile(disciplinary, { snapshot: staleSnapshot, today: '2026-09-21' });
  assert.deepEqual(staleReconciled.retainedExcess, [], 'another workflow\'s grants are not retained under this destination');
  assert.equal(staleReconciled.staleReadBacks.length, 1);
  assert.equal(staleReconciled.staleReadBacks[0].appliedWorkflowId, '7d3c1a2b-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
  assert.equal(staleReconciled.staleReadBacks[0].destination, '7d3c1a2b-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
  assert.match(staleReconciled.staleReadBacks[0].action, /read workflow_get/);
  disciplinary.receipts.pop();
  assert.equal(reconciled.proposed[0].key, 'disciplinar', 'restricted workflows are listed first');
  const kept = project();
  kept.workflows[0].access.applied = [{ granteeType: 'organization', granteeRef: 'org', level: 'view' }];
  assert.throws(() => reconcile(kept, { snapshot: { compras: {} } }), /has no grants array/, 'a malformed snapshot never replaces recorded evidence');
  assert.throws(() => reconcile(kept, { snapshot: { compras: { grants: [{ granteeType: 'org' }] } } }), /grants\[0\] is not/);
  assert.deepEqual(kept.workflows[0].access.applied.length, 1);
  const unavailable = reconcile(kept, { snapshot: { compras: { unavailable: 'FORBIDDEN' } } });
  assert.equal(unavailable.manifest.workflows[0].access.appliedUnavailable, 'FORBIDDEN');
  assert.equal(unavailable.manifest.workflows[0].access.applied.length, 1, 'unavailable keeps the previous read');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-reconcile-'));
  try {
    const input = path.join(dir, 'provia-project.json');
    fs.writeFileSync(input, JSON.stringify(manifest));
    const same = spawnSync(process.execPath, [path.join(root, 'scripts/reconcile-access.mjs'), input, '--output', input], { encoding: 'utf8' });
    assert.equal(same.status, 1);
    const ok = spawnSync(process.execPath, [path.join(root, 'scripts/reconcile-access.mjs'), input, '--output', path.join(dir, 'out.json')], { encoding: 'utf8' });
    assert.equal(ok.status, 0, ok.stderr);
    assert.deepEqual(JSON.parse(ok.stdout).checkAfter.errors, []);
    assert.ok(fs.existsSync(path.join(dir, 'out.json')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the action review warns at 4 500 characters before the product limit fails the brief', () => {
  const brief = ['Tarefa: x', 'Como: y', 'Evidência: z', 'Concluído quando: w', 'Excepções: v'].join('\n');
  const long = reviewDescription(brief + '\n' + 'a'.repeat(4600));
  assert.equal(long.nearLimit, true);
  assert.equal(long.tooLong, false);
  const over = reviewDescription(brief + '\n' + 'a'.repeat(5100));
  assert.equal(over.nearLimit, false);
  assert.equal(over.tooLong, true);
});

test('the JSON schema accepts the bundled manifests and the synthetic project', async () => {
  const schema = JSON.parse(fs.readFileSync(path.join(root, 'references/project-manifest.schema.json'), 'utf8'));
  assert.equal(schema.$id, 'https://docs.provia.ao/schemas/provia-project-v1.1.json');
  assert.deepEqual(schema.properties.schemaVersion.enum, [SCHEMA, 'provia-project/v1']);
  assert.deepEqual(schema.$defs.grant.properties.level.enum, LEVELS);
  assert.deepEqual(schema.$defs.group.properties.kind.enum, ['team', 'container', 'role']);
  for (const name of ['procurement', 'it-service', 'employee-onboarding', 'procedure-control', 'corrective-action']) {
    const manifest = load(name);
    for (const key of Object.keys(manifest)) assert.ok(schema.properties[key], `${name}: ${key} is described by the schema`);
    for (const key of Object.keys(manifest.workflows[0])) assert.ok(schema.$defs.workflow.properties[key], `${name}: workflows[].${key} is described by the schema`);
    for (const key of Object.keys(manifest.workflows[0].access)) assert.ok(schema.$defs.access.properties[key], `${name}: access.${key} is described by the schema`);
  }
});
