import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { parseStream, casePrompt, statusTable } from '../scripts/run-skill-evaluations.mjs';

const root = path.resolve(import.meta.dirname, '..');

test('parseStream extracts the final result and a tool log from a stream-json transcript', () => {
  const lines = [
    { type: 'system', subtype: 'init' },
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 't1', name: 'Bash', input: { command: 'node scripts/validate-workflow.mjs workflow.yaml' } }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't1', content: '{"valid": true}' }] } },
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 't2', name: 'Write', input: { file_path: '/tmp/x/setup.md', content: '...' } }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't2', content: [{ type: 'text', text: 'written' }], is_error: false }] } },
    { type: 'result', result: 'Final answer', total_cost_usd: 0.1, num_turns: 3, stop_reason: 'end_turn' },
  ].map(line => JSON.stringify(line)).join('\n');
  const parsed = parseStream(lines + '\nnot json\n');
  assert.equal(parsed.result.result, 'Final answer');
  assert.deepEqual(parsed.tools.map(tool => [tool.tool, tool.input, tool.output]), [['Bash', 'node scripts/validate-workflow.mjs workflow.yaml', '{"valid": true}'], ['Write', '/tmp/x/setup.md', 'written']]);
});

test('the case prompt names the skill and asks for artefacts in the working directory', () => {
  const prompt = casePrompt({ skill: 'provia-workflow-package', prompt: 'Gere o YAML.' });
  assert.ok(prompt.includes('provia-skills:provia-workflow-package'));
  assert.ok(prompt.includes('current working directory'));
  assert.ok(prompt.endsWith('Gere o YAML.'));
});

test('status and dry-run modes make no model calls', () => {
  const status = spawnSync(process.execPath, [path.join(root, 'scripts/run-skill-evaluations.mjs'), '--status'], { encoding: 'utf8' });
  assert.equal(status.status, 0);
  const summary = JSON.parse(status.stdout);
  assert.equal(summary.total, 48);
  const dry = spawnSync(process.execPath, [path.join(root, 'scripts/run-skill-evaluations.mjs'), '--only', 'process-discovery-normal', '--dry-run'], { encoding: 'utf8', env: { ...process.env, CLAUDE_CLI: '/nonexistent/claude' } });
  assert.equal(dry.status, 0);
  assert.match(dry.stdout, /\[dry-run\] process-discovery-normal: \/nonexistent\/claude/);
  assert.match(dry.stdout, /--plugin-dir/);
  const table = statusTable([{ status: 'passed', run: { pluginVersion: '0.0.0' } }, { status: 'not_run' }]);
  assert.equal(table.stale, 1);
  assert.equal(table.counts.not_run, 1);
});

test('skillLoaded detects a Skill call or a read of the SKILL.md', async () => {
  const { skillLoaded } = await import('../scripts/run-skill-evaluations.mjs');
  assert.equal(skillLoaded([{ tool: 'Skill', input: 'provia-skills:provia-diagnose' }], 'provia-diagnose'), true);
  assert.equal(skillLoaded([{ tool: 'Read', input: '/x/provia-plugin/skills/provia-diagnose/SKILL.md' }], 'provia-diagnose'), true);
  assert.equal(skillLoaded([{ tool: 'Read', input: '/x/references/next-step.md' }], 'provia-diagnose'), false);
  assert.equal(skillLoaded([], 'provia-diagnose'), false);
});

for (const loaded of [false, true]) {
  test(`evaluation CLI records a passing judgement with skillLoaded=${loaded} correctly`, () => {
    const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'provia-evaluation-status-')));
    try {
      fs.mkdirSync(path.join(dir, 'scripts'));
      fs.mkdirSync(path.join(dir, 'tests'));
      fs.copyFileSync(path.join(root, 'scripts/run-skill-evaluations.mjs'), path.join(dir, 'scripts/run-skill-evaluations.mjs'));
      fs.copyFileSync(path.join(root, 'package.json'), path.join(dir, 'package.json'));
      const matrix = path.join(dir, 'tests/skill-evaluations.json');
      fs.writeFileSync(matrix, JSON.stringify([{ id: 'fixture', skill: 'provia-process-knowledge', prompt: 'Review the exception.', expected: 'Keep the policy unchanged.', status: 'not_run' }]));
      const cli = path.join(dir, 'fixture-cli.mjs');
      fs.writeFileSync(cli, `#!/usr/bin/env node
const judge = process.argv[process.argv.indexOf('--output-format') + 1] === 'json';
if (judge) console.log(JSON.stringify({ result: JSON.stringify({ verdict: 'pass', reasons: ['Fixture judgement'], violations: [] }) }));
else {
  if (${loaded}) console.log(JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', id: 'read-skill', name: 'Read', input: { file_path: '/plugin/skills/provia-process-knowledge/SKILL.md' } }] } }));
  console.log(JSON.stringify({ type: 'result', result: 'Keep the policy unchanged.', stop_reason: 'end_turn', num_turns: 1 }));
}
`);
      fs.chmodSync(cli, 0o755);
      const run = spawnSync(process.execPath, [path.join(dir, 'scripts/run-skill-evaluations.mjs'), '--only', 'fixture', '--judge'], {
        encoding: 'utf8', env: { ...process.env, CLAUDE_CLI: cli }, timeout: 15000,
      });
      assert.equal(run.status, 0, run.stderr);
      const [record] = JSON.parse(fs.readFileSync(matrix, 'utf8'));
      assert.equal(record.run.skillLoaded, loaded);
      assert.equal(record.judge.verdict, 'pass');
      assert.equal(record.status, loaded ? 'passed' : 'unclear');
      if (!loaded) assert.match(record.judge.note, /never loaded the skill/);
      assert.equal(fs.existsSync(path.join(dir, 'tests/forward-evaluation/matrix/fixture/run.json')), true);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
}
