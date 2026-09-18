import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';

const script = new URL('../scripts/build-entity-catalogue.mjs', import.meta.url).pathname;
const sample = () => ({
  schemaVersion: 'provia-entity-catalogue/v1', title: 'Catálogo de demonstração', language: 'pt-AO', country: 'Angola',
  notes: ['Proposta para configuração manual.'],
  types: [{ key: 'supplier', name: 'Fornecedor', description: 'Fornecedores de compras e manutenção.', icon: 'Truck01',
    namePattern: 'Designação comercial', purpose: 'Compras e avaliação', owner: 'Compras',
    coverage: [{ dimension: 'Contactos', decision: 'included', reason: 'A equipa contacta o fornecedor para propostas.' }],
    setup: ['Confirmar permissões.'], readiness: ['Validar antes da primeira contratação.'],
    fields: [{ key: 'contact_email', label: 'Email comercial', type: 'email', required: false, group: 'Contactos',
      helpText: 'Endereço para pedidos de proposta.', purpose: 'Solicitar propostas', priority: 'core',
      source: 'Fornecedor', maintainer: 'Compras', sensitivity: 'Interna', example: 'compras@example.com' },
    { key: 'status', label: 'Situação', type: 'select', required: true, group: 'Relação', helpText: 'Situação confirmada.',
      purpose: 'Consulta antes da compra', priority: 'core', source: 'Avaliação', maintainer: 'Compras', sensitivity: 'Interna',
      options: [{ value: 'pending', label: 'Por validar' }, { value: 'active', label: 'Activo' }], example: 'pending', defaultValue: 'pending' }]
  }]
});

function run(data, args = []) {
  const dir = mkdtempSync(join(tmpdir(), 'provia-catalogue-'));
  const input = join(dir, 'catalogue.json'), output = join(dir, 'catalogue.html');
  writeFileSync(input, JSON.stringify(data));
  const result = spawnSync(process.execPath, [script, input, ...(args.length ? args : ['--output', output])], { encoding: 'utf8' });
  const html = existsSync(output) ? readFileSync(output, 'utf8') : null;
  rmSync(dir, { recursive: true, force: true });
  return { ...result, html };
}

test('renders the complete catalogue and embeds identical JSON for offline download', () => {
  const data = sample(), result = run(data);
  assert.equal(result.status, 0, result.stderr);
  for (const text of ['Fornecedor', 'Email comercial', 'Por validar', 'Confirmar permissões.', 'Validar antes da primeira contratação.', 'Solicitar propostas', 'Truck01']) assert.ok(result.html.includes(text), text);
  const embedded = result.html.match(/<script type="application\/json" id="catalogue-data">([\s\S]*?)<\/script>/)[1];
  assert.deepEqual(JSON.parse(embedded), data);
  assert.match(result.html, /lang="pt-AO"/);
  assert.match(result.html, /Copiar/);
  assert.match(result.html, /execCommand\('copy'\)/);
  assert.doesNotMatch(result.html, /<script[^>]+src=|<link[^>]+href=|fetch\(/);
});

test('escapes imported text and script closing sequences without changing downloadable data', () => {
  const data = sample();
  data.types[0].description = '</textarea><img src=x onerror=alert(1)></script><script>alert(2)</script>';
  const result = run(data);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.html, /<img src=x|<script>alert/);
  assert.ok(result.html.includes('&lt;img'));
  assert.deepEqual(JSON.parse(result.html.match(/id="catalogue-data">([\s\S]*?)<\/script>/)[1]), data);
});

for (const [name, mutate] of [
  ['unsupported icon', d => { d.types[0].icon = 'IconTruckDelivery'; }],
  ['duplicate field', d => { d.types[0].fields.push(d.types[0].fields[0]); }],
  ['duplicate type', d => { d.types.push(d.types[0]); }],
  ['invalid select example', d => { d.types[0].fields[1].example = 'approved'; }],
  ['invalid default', d => { d.types[0].fields[1].defaultValue = 'approved'; }],
  ['quoted required flag', d => { d.types[0].fields[0].required = 'false'; }],
  ['unsupported field type', d => { d.types[0].fields[0].type = 'relation'; }],
  ['missing entity target', d => { d.types[0].fields[0].type = 'entity'; }],
  ['unknown catalogue target', d => { d.types[0].fields[0].type = 'entity'; d.types[0].fields[0].targetType = 'missing'; }],
  ['entity target on a text field', d => { d.types[0].fields[0].targetType = 'supplier'; }],
  ['options on a text field', d => { d.types[0].fields[0].options = [{ value: 'yes', label: 'Sim' }]; }],
  ['missing description', d => { delete d.types[0].description; }],
  ['empty coverage', d => { d.types[0].coverage = []; }],
]) test(`rejects ${name} before writing HTML`, () => {
  const data = sample(); mutate(data);
  const result = run(data);
  assert.notEqual(result.status, 0);
  assert.equal(result.html, null);
  assert.match(result.stderr, /Invalid catalogue/);
});

test('check command validates without creating HTML', () => {
  const result = run(sample(), ['--check']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.html, null);
  assert.match(result.stdout, /not.*import|não.*import/);
});

test('renders English controls when the catalogue language is English', () => {
  const data = sample(); data.language = 'en';
  const result = run(data);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.html, />Copy</);
  assert.match(result.html, /lang="en"/);
});

function browserHarness({ denied = false, fallback = false } = {}) {
  const data = sample();
  data.types[0].description = 'Descrição completa\ncom várias linhas';
  const html = run(data).html;
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const copyId = html.match(/data-copy="([^"]+)" aria-label="Copiar: Descrição"/)[1];
  const renderedText = html.match(new RegExp(`<textarea id="${copyId}"[^>]*>([\\s\\S]*?)<\\/textarea>`))[1];
  const events = {}, windowEvents = {}, state = { copied: null, focused: false, selected: false };
  const area = { value: renderedText, style: {}, scrollHeight: 160, focus() { state.focused = true; }, select() { state.selected = true; } };
  const status = { textContent: '' };
  const button = { dataset: { copy: copyId }, addEventListener(name, handler) { events.copy = handler; } };
  const document = {
    getElementById(id) {
      if (id === copyId) return area;
      if (id === 'status') return status;
      return { addEventListener(name, handler) { events[id] = handler; } };
    },
    querySelectorAll(selector) {
      if (selector === '[data-copy]') return [button];
      if (selector === 'textarea') return [area];
      return [];
    },
    execCommand(command) { assert.equal(command, 'copy'); return fallback; }
  };
  const window = { isSecureContext: true, addEventListener(name, handler) { windowEvents[name] = handler; } };
  const navigator = { clipboard: { async writeText(value) { if (denied) throw new Error('denied'); state.copied = value; } } };
  runInNewContext(script, { document, window, navigator });
  return { events, state, area, status };
}

test('copy uses the exact full text, including line breaks', async () => {
  const h = browserHarness(); await h.events.copy();
  assert.equal(h.state.copied, 'Descrição completa\ncom várias linhas');
  assert.equal(h.status.textContent, 'Copiado.');
});

test('denied clipboard and failed fallback select text and explain keyboard copy', async () => {
  const h = browserHarness({ denied: true }); await h.events.copy();
  assert.equal(h.state.focused, true); assert.equal(h.state.selected, true);
  assert.match(h.status.textContent, /Ctrl\+C/);
});

test('successful legacy copy reports success when clipboard permission is denied', async () => {
  const h = browserHarness({ denied: true, fallback: true }); await h.events.copy();
  assert.equal(h.status.textContent, 'Copiado.');
});

test('readonly configuration text expands to its full content height', () => {
  const h = browserHarness();
  assert.equal(h.area.style.height, '162px');
});

function modernCatalogue() {
  const data = sample(), fields = data.types[0].fields;
  delete fields[1].defaultValue;
  fields.push({ ...fields[0], key: 'reference', label: 'Referência', type: 'auto_number', example: 'FOR-0001', config: { prefix: 'FOR-', padding: 4, startAt: 1 } });
  fields.push({ ...fields[1], key: 'reason', label: 'Motivo', example: 'assessment', config: { parentField: 'status' }, options: [{ value: 'assessment', label: 'Em avaliação', parentValue: 'pending' }, { value: 'approved', label: 'Aprovado', parentValue: 'active' }] });
  return data;
}
test('renders auto-number configuration and dependent option bindings as copyable fields', () => {
  const data = modernCatalogue(), result = run(data);
  assert.equal(result.status, 0, result.stderr);
  const cards = result.html.split('<script type="application/json"')[0].split('<details>')[0];
  for (const label of ['prefix', 'padding', 'startAt', 'parentField', 'parentValue']) assert.ok(cards.includes(label), label);
  assert.deepEqual(JSON.parse(result.html.match(/id="catalogue-data">([\s\S]*?)<\/script>/)[1]), data);
});
for (const [name, mutate] of [
  ['required auto-number', f => f[2].required = true],
  ['auto-number default', f => f[2].defaultValue = 'FOR-0001'],
  ['invalid padding', f => f[2].config.padding = 0],
  ['invalid prefix', f => f[2].config.prefix = '-FOR'],
  ['invalid start', f => f[2].config.startAt = 0],
  ['missing parent', f => f[3].config.parentField = 'missing'],
  ['wrong parent type', f => f[1].type = 'multi_select'],
  ['unlinked option', f => delete f[3].options[0].parentValue],
  ['unknown parent value', f => f[3].options[0].parentValue = 'missing'],
  ['child default', f => f[3].defaultValue = 'assessment'],
  ['orphan binding', f => delete f[3].config.parentField],
  ['mismatched child example', f => f[3].example = 'approved'],
  ['self dependency', f => f[3].config.parentField = 'reason'],
  ['cycle', f => { f[1].config = { parentField: 'reason' }; f[1].options.forEach(o => o.parentValue = 'assessment'); }],
]) test(`rejects ${name} in an entity catalogue`, () => {
  const data = modernCatalogue(); mutate(data.types[0].fields);
  const result = run(data);
  assert.notEqual(result.status, 0); assert.equal(result.html, null);
});
test('rejects an invalid dependent binding without auto-number fields', () => {
  const data = modernCatalogue(); data.types[0].fields.splice(2, 1); data.types[0].fields[2].options[0].parentValue = 'missing';
  assert.notEqual(run(data).status, 0);
});
