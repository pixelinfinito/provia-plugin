import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { reviewDescription, reviewWorkflow, renderMarkdown } from '../scripts/review-actions.mjs';

const root = path.resolve(import.meta.dirname, '..');
const script = path.join(root, 'scripts/review-actions.mjs');
const complete = 'Tarefa: Confirmar o cabimento.\nComo: 1. Abrir o mapa. 2. Comparar.\nEvidência: Captura anexada.\nConcluído quando: A referência está registada.\nExcepções: Sem cabimento, devolver.';

test('all five bundled examples and the rewritten fixture pass the gate; the original fixture does not', () => {
  for (const name of ['procurement', 'it-service', 'employee-onboarding', 'procedure-control', 'corrective-action']) {
    const result = spawnSync(process.execPath, [script, path.join(root, 'examples', name, 'workflow.yaml')], { encoding: 'utf8' });
    assert.equal(result.status, 0, `${name}: ${result.stdout}`);
    const report = JSON.parse(result.stdout);
    assert.equal(report.summary.complete, report.summary.applicable);
    assert.equal(report.summary.dueMissing, 0);
  }
  const rewritten = spawnSync(process.execPath, [script, path.join(root, 'tests/forward-evaluation/action-writing-1.0.2/workflow-rewritten-1.1.yaml')], { encoding: 'utf8' });
  assert.equal(rewritten.status, 0);
  const original = spawnSync(process.execPath, [script, path.join(root, 'tests/forward-evaluation/action-writing-1.0.2/workflow.yaml')], { encoding: 'utf8' });
  assert.equal(original.status, 1);
  assert.equal(JSON.parse(original.stdout).summary.leaks, 2);
});

test('detects each missing part in both languages, ignoring accents and case', () => {
  assert.deepEqual(reviewDescription(complete).missing, []);
  assert.deepEqual(reviewDescription('Task: x\nHow: y\nEvidence: z\nDone when: w\nExceptions: v').missing, []);
  assert.deepEqual(reviewDescription('TAREFA: x\ncomo: y\nevidencia: z\nconcluido quando: w\nexcecoes: v').missing, []);
  assert.deepEqual(reviewDescription('Tarefa: x\nComo: y\nEvidência: z').missing, ['doneWhen', 'exceptions']);
  assert.deepEqual(reviewDescription('').missing, ['task', 'method', 'evidence', 'doneWhen', 'exceptions']);
  assert.deepEqual(reviewDescription('A tarefa é confirmar. Como: y\nEvidência: z').missing, ['task', 'method', 'doneWhen', 'exceptions'], 'labels count only at the start of a line');
});

test('flags implementer notes that leaked into the assignee brief', () => {
  for (const leak of ['Atribuição pendente de configuração.', 'Ver setup.md para os responsáveis.', 'Resolver o UUID do grupo antes de publicar.', 'Endpoint $API_URL a configurar', 'See setup.md', 'pending configuration in the manifest']) {
    assert.ok(reviewDescription(`${complete}\n${leak}`).leaks.length > 0, leak);
  }
  assert.deepEqual(reviewDescription(`${complete}\nTodas as medidas executadas. O manifesto de carga é conferido.`).leaks.length, 1, 'Portuguese "todo" is fine; "manifesto" is still flagged');
  assert.deepEqual(reviewDescription(complete).leaks, []);
});

test('applies the five parts only to human and AI work, keeps due separate from completeness and reports length', () => {
  const text = JSON.stringify({
    apiVersion: 'provia.ao/v1', kind: 'Workflow', metadata: { name: 'Teste', prefix: 'TST', description: 'x' }, triggers: [{ type: 'manual', label: 'a', enabled: true, config: {} }], fields: [],
    actions: [
      { id: 'a', name: 'Fazer', type: 'standard', executionMode: 'sequential', required: true, description: complete },
      { id: 'b', name: 'Avisar', type: 'notification', executionMode: 'sequential', required: true, description: 'Informa as Finanças por email.', config: { recipients: [] } },
      { id: 'c', name: 'Esperar', type: 'wait', executionMode: 'sequential', required: true, config: { conditionType: 'duration', conditionValue: 'PT1H' } },
      { id: 'd', name: 'Decidir', type: 'decision', executionMode: 'sequential', required: true, description: 'x'.repeat(5001), config: { branches: [{ label: 'Ok', outcome: 'continue' }] } },
    ],
  });
  const report = reviewWorkflow(text);
  assert.equal(report.valid, true);
  const byId = Object.fromEntries(report.actions.map(action => [action.id, action]));
  assert.equal(byId.a.complete, true); assert.equal(byId.a.due, 'missing');
  assert.equal(byId.b.applicable, false); assert.equal(byId.b.complete, true); assert.equal(byId.b.due, 'not_applicable');
  assert.equal(byId.c.applicable, false); assert.equal(byId.c.complete, false); assert.equal(byId.c.empty, true);
  assert.equal(byId.d.tooLong, true); assert.equal(byId.d.complete, false);
  assert.equal(report.summary.applicable, 2);
  assert.equal(report.summary.dueMissing, 2);
  assert.match(renderMarkdown(report, 'x'), /over 5000/);
});

test('returns a structured result for unparsable input and exits 2 for a missing file', () => {
  assert.equal(reviewWorkflow('actions: [').valid, false);
  const result = spawnSync(process.execPath, [script, path.join(root, 'nope.yaml')], { encoding: 'utf8' });
  assert.equal(result.status, 2);
});
