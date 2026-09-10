import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { validateWorkflow } from '../scripts/validate-workflow.mjs';
const root = path.resolve(import.meta.dirname, '..');
test('all five business examples validate and include a separate setup handover', () => {
  const entries = fs.readdirSync(path.join(root, 'examples'), { withFileTypes: true }).filter(x => x.isDirectory());
  assert.equal(entries.length, 5);
  for (const entry of entries) {
    const folder = path.join(root, 'examples', entry.name);
    const result = validateWorkflow(fs.readFileSync(path.join(folder, 'workflow.yaml'), 'utf8'));
    assert.equal(result.valid, true, `${entry.name}: ${JSON.stringify(result)}`);
    assert.equal(result.readyToPublish, false);
    assert.ok(fs.readFileSync(path.join(folder, 'setup.md'), 'utf8').includes('Angola'));
  }
});
test('contract integrity is independently verifiable', () => {
  assert.match(execFileSync(process.execPath, ['scripts/check-contract.mjs'], { cwd: root, encoding: 'utf8' }), /verified/);
});
test('release is reproducible, has one root, both manifests, examples and offline validator', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-release-test-'));
  try {
    const a = path.join(dir, 'a'), b = path.join(dir, 'b');
    execFileSync('python3', ['scripts/build-release.py', '--output', a], { cwd: root });
    execFileSync('python3', ['scripts/build-release.py', '--output', b], { cwd: root });
    const zip = 'provia-skills-1.0.0.zip';
    assert.deepEqual(fs.readFileSync(path.join(a, zip)), fs.readFileSync(path.join(b, zip)));
    const entries = execFileSync('unzip', ['-Z1', path.join(a, zip)], { encoding: 'utf8' }).trim().split('\n');
    assert.ok(entries.every(x => x.startsWith('provia-skills/') && !x.includes('/../')));
    for (const expected of ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json', 'scripts/validate-workflow.mjs', 'contracts/workflow-v1/engine.mjs', 'examples/procurement/workflow.yaml']) assert.ok(entries.includes('provia-skills/' + expected));
    assert.equal(entries.filter(x => x.endsWith('/SKILL.md')).length, 14);
    assert.ok(!entries.some(x => /node_modules|\.git\/|dist\//.test(x)));
    const release = JSON.parse(fs.readFileSync(path.join(a, 'release.json'), 'utf8'));
    assert.equal(release.version, '1.0.0');
    assert.equal(release.skillCount, 14);
    execFileSync('unzip', ['-q', path.join(a, zip), '-d', path.join(dir, 'extract')]);
    const result = JSON.parse(execFileSync(process.execPath, ['scripts/validate-workflow.mjs', 'examples/procurement/workflow.yaml'], { cwd: path.join(dir, 'extract/provia-skills'), encoding: 'utf8' }));
    assert.equal(result.valid, true);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
