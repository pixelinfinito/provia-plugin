import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWorkflow } from '../scripts/validate-workflow.mjs';

export function workflow() {
  return {
    apiVersion: 'provia.ao/v1', kind: 'Workflow',
    metadata: { name: 'Pedido de compra', prefix: 'COMP', description: 'Processo de compras de uma organização em Angola.' },
    triggers: [{ type: 'manual', label: 'Iniciar pedido', config: {}, enabled: true }],
    fields: [{ name: 'amount', label: 'Montante', type: 'currency', required: true, config: { currency: 'AOA', decimals: 2 } }],
    actions: [{ id: 'review', name: 'Rever o pedido', type: 'standard', assignee: { type: 'creator' }, required: true, executionMode: 'sequential' }],
  };
}
const check = (data) => validateWorkflow(JSON.stringify(data));
test('a minimal Angolan workflow passes file checks but still needs destination validation', () => {
  const result = check(workflow());
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.destinationValidation, 'not_run');
  assert.equal(result.readyToPublish, false);
  assert.equal(result.backendSchemaValidation, 'passed');
});
for (const [label, mutate] of [
  ['quoted boolean', d => d.actions[0].required = 'false'],
  ['execution typo', d => d.actions[0].executionMode = 'paralell'],
  ['fractional offset', d => d.actions[0].due = { offsetDays: 1.8 }],
  ['unsupported due basis', d => d.actions[0].due = { offsetDays: 1, basis: 'after_previous' }],
  ['invalid assignee', d => d.actions[0].assignee = { type: 'team' }],
  ['unsupported action', d => d.actions[0].type = 'ai_agent'],
  ['malformed AI artifacts', d => { d.actions[0].assignee = { type: 'ai_agent', id: '11111111-1111-4111-8111-111111111111' }; d.actions[0].aiWorker = { requiredArtifacts: {} }; }],
  ['bad cron', d => d.triggers = [{ type: 'schedule', label: 'Diário', config: { cronExpression: 'nonsense', timezone: 'Africa/Luanda' } }]],
  ['bad timezone', d => d.triggers = [{ type: 'schedule', label: 'Diário', config: { cronExpression: '0 9 * * *', timezone: 'Not/AZone' } }]],
  ['form trigger', d => d.triggers = [{ type: 'form', label: 'Formulário', config: {} }]],
  ['HTTP object headers', d => { d.actions[0].type = 'http_request'; d.actions[0].config = { endpoint: 'https://example.com', method: 'POST', headers: { Authorization: '$TOKEN' } }; }],
  ['duplicate IDs', d => d.actions.push({ ...d.actions[0] })],
  ['unknown YAML version', d => d.apiVersion = 'provia.ao/v99'],
  ['too many actions', d => d.actions = Array.from({ length: 101 }, (_, i) => ({ ...d.actions[0], id: 'a' + i }))],
]) test(`rejects ${label}`, () => assert.equal(check((d => { mutate(d); return d; })(workflow())).valid, false));
test('invalid syntax returns a structured result rather than throwing', () => {
  assert.equal(validateWorkflow('actions: [').valid, false);
});
test('UTF-8 byte limit applies before parsing', () => {
  const result = validateWorkflow('é'.repeat(524289));
  assert.equal(result.errors[0].code, 'file_too_large');
});
test('does not echo input values in diagnostics', () => {
  const data = workflow(); data.actions[0].required = 'sensitive-synthetic-value';
  assert.ok(!JSON.stringify(check(data)).includes('sensitive-synthetic-value'));
});
test('lists form and memory setup without inventing portable sections', () => {
  const data = workflow(); data.actions[0].type = 'form_fill'; data.metadata.agentMemoryEnabled = true;
  const result = check(data);
  assert.ok(result.setupRequired.some(x => x.code === 'form_fill_link'));
  assert.ok(result.setupRequired.some(x => x.code === 'memory_documents'));
});
test('records organization references as unverified dependencies', () => {
  const data = workflow(); data.actions[0].assignee = { type: 'group', id: '22222222-2222-4222-8222-222222222222' };
  const result = check(data);
  assert.equal(result.valid, true);
  assert.ok(result.setupRequired.some(x => x.code === 'organization_reference'));
});
test('known secret references are dependencies even in ordinary headers', () => {
  const data = workflow(); data.actions[0].type = 'http_request';
  data.actions[0].config = { endpoint: 'https://example.com', method: 'GET', headers: [{ key: 'X-Tenant', value: '{{secret:TENANT_ID}}', enabled: true }] };
  assert.ok(check(data).setupRequired.some(x => x.code === 'organization_secret'));
});
test('legacy API version is readable, with a migration warning', () => {
  const data = workflow(); data.apiVersion = 'provia.io/v1';
  assert.equal(check(data).valid, true);
  assert.ok(check(data).warnings.some(x => x.code === 'legacy_version'));
});
test('unresolved child workflow prevents claiming complete backend configuration validation', () => {
  const data = workflow(); data.actions[0].type = 'sub_workflow'; data.actions[0].config = { workflow: 'CHILD' };
  const result = check(data);
  assert.equal(result.valid, true, JSON.stringify(result));
  assert.equal(result.backendSchemaValidation, 'partial_unresolved_references');
  assert.ok(result.setupRequired.some(x => x.code === 'workflow_reference'));
});
test('trigger allowlists are reported as destination dependencies', () => {
  const data = workflow(); data.triggers[0].config = { allowedUsers: ['11111111-1111-4111-8111-111111111111'] };
  assert.ok(check(data).setupRequired.some(x => x.path.startsWith('triggers')));
});
test('omitted ownership is a visible setup requirement, not publication readiness', () => {
  const data = workflow(); delete data.actions[0].assignee;
  const result = check(data);
  assert.equal(result.valid, true);
  assert.ok(result.setupRequired.some(x => x.code === 'assignment_missing'));
});

function modernFields() {
  return [
    { name: 'reference', label: 'Referência', type: 'auto_number', required: false, config: { prefix: 'REQ-', padding: 5, startAt: 10 } },
    { name: 'category', label: 'Categoria', type: 'select', required: false, config: { options: [{ value: 'service', label: 'Serviço' }, { value: 'goods', label: 'Bens' }] } },
    { name: 'detail', label: 'Detalhe', type: 'multi_select', required: false, config: { parentField: 'category', options: [{ value: 'support', label: 'Apoio', parentValue: 'service' }] } },
  ];
}
test('accepts auto-number and dependent multi-select fields in a portable workflow', () => {
  const data = workflow(); data.fields = modernFields();
  const result = check(data);
  assert.equal(result.valid, true, JSON.stringify(result));
  assert.equal(result.backendSchemaValidation, 'passed');
});
for (const [name, mutate] of [
  ['required auto-number', f => f[0].required = true],
  ['auto-number default', f => f[0].defaultValue = 'REQ-00010'],
  ['invalid padding', f => f[0].config.padding = 11],
  ['fractional start', f => f[0].config.startAt = 1.5],
  ['invalid affix', f => f[0].config.prefix = 'RE Q'],
  ['missing parent', f => f[2].config.parentField = 'missing'],
  ['multi-select parent', f => f[1].type = 'multi_select'],
  ['unlinked child option', f => delete f[2].config.options[0].parentValue],
  ['unknown parent option', f => f[2].config.options[0].parentValue = 'missing'],
  ['dependent default', f => f[2].defaultValue = ['support']],
  ['orphan parent value', f => delete f[2].config.parentField],
  ['self dependency', f => f[2].config.parentField = 'detail'],
]) test(`rejects ${name} in workflow metadata`, () => {
  const data = workflow(); data.fields = modernFields(); mutate(data.fields);
  assert.equal(check(data).valid, false);
});
test('rejects an unknown dependent parent even without auto-number fields', () => {
  const data = workflow(); data.fields = modernFields().slice(1); data.fields[1].config.parentField = 'missing';
  assert.equal(check(data).valid, false);
});
test('preserves automatic-number and dependent configurations through import conversion', async () => {
  const engine = await import('../contracts/workflow-v1/engine.mjs');
  const data = workflow(); data.fields = modernFields();
  const parsed = engine.parseYamlToDraft(JSON.stringify(data));
  const validated = engine.validateWorkflowDraft(parsed.draft, {}, parsed.lineOf);
  const request = engine.planToImportRequest(engine.buildImportPlan(validated.draft, { prefix: 'COMP', secretValues: {} }));
  const result = engine.importWorkflowPlanSchema.parse(request);
  for (const field of data.fields) {
    const converted = result.workflow.metadataSchema.find(f => f.name === field.name);
    assert.equal(converted.type, field.type);
    assert.deepEqual(converted.config, field.config);
  }
});
test('rejects a dependency cycle in workflow fields', () => {
  const data = workflow(); data.fields = modernFields().slice(1);
  data.fields[1].type = 'select';
  data.fields[0].config.parentField = 'detail';
  data.fields[0].config.options.forEach(o => o.parentValue = 'support');
  assert.equal(check(data).valid, false);
});
for (const [name, index, value] of [['auto-number', 0, 'REQ-00010'], ['dependent', 2, ['support']]]) {
  test(`rejects ${name} config defaults even when the top-level default is empty`, () => {
    const data = workflow(); data.fields = modernFields();
    data.fields[index].defaultValue = null;
    data.fields[index].config.defaultValue = value;
    assert.equal(check(data).valid, false);
  });
}
