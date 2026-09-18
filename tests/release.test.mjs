import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { validateWorkflow } from '../scripts/validate-workflow.mjs';
const root = path.resolve(import.meta.dirname, '..');
const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
test('all five business examples validate, pass the action gate and include a generated setup handover', () => {
  const entries = fs.readdirSync(path.join(root, 'examples'), { withFileTypes: true }).filter(x => x.isDirectory());
  assert.equal(entries.length, 5);
  for (const entry of entries) {
    const folder = path.join(root, 'examples', entry.name);
    const result = validateWorkflow(fs.readFileSync(path.join(folder, 'workflow.yaml'), 'utf8'));
    assert.equal(result.valid, true, `${entry.name}: ${JSON.stringify(result)}`);
    assert.equal(result.readyToPublish, false);
    assert.ok(fs.readFileSync(path.join(folder, 'setup.md'), 'utf8').includes('Angola'));
    assert.ok(fs.readFileSync(path.join(folder, 'workflow.yaml'), 'utf8').startsWith(`# provia-skills ${version}`), `${entry.name}: attribution header`);
    assert.ok(fs.existsSync(path.join(folder, 'provia-project.json')));
  }
});
test('contract integrity is independently verifiable', () => {
  assert.match(execFileSync(process.execPath, ['scripts/check-contract.mjs'], { cwd: root, encoding: 'utf8' }), /verified/);
});
test('release is reproducible, has one root, both manifests, examples and offline validator', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-release-test-'));
  try {
    const a = path.join(dir, 'a'), b = path.join(dir, 'b');
    execFileSync('python3', ['scripts/build-release.py', '--output', a, '--allow-stale-evaluations'], { cwd: root });
    execFileSync('python3', ['scripts/build-release.py', '--output', b, '--allow-stale-evaluations'], { cwd: root });
    const zip = `provia-skills-${version}.zip`;
    assert.deepEqual(fs.readFileSync(path.join(a, zip)), fs.readFileSync(path.join(b, zip)));
    const entries = execFileSync('unzip', ['-Z1', path.join(a, zip)], { encoding: 'utf8' }).trim().split('\n');
    assert.ok(entries.every(x => x.startsWith('provia-skills/') && !x.includes('/../')));
    for (const expected of ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json', 'scripts/validate-workflow.mjs', 'scripts/build-project-map.mjs', 'scripts/lib/project-manifest.mjs', 'scripts/review-actions.mjs', 'scripts/build-skills.mjs', 'contracts/workflow-v1/engine.mjs', 'examples/procurement/workflow.yaml', 'examples/procurement/provia-project.json', 'references/project-manifest.md', 'references/skill-conventions.md']) assert.ok(entries.includes('provia-skills/' + expected));
    assert.equal(entries.filter(x => x.endsWith('/SKILL.md')).length, 16);
    assert.ok(!entries.some(x => /node_modules|\.git\/|dist\//.test(x)));
    const release = JSON.parse(fs.readFileSync(path.join(a, 'release.json'), 'utf8'));
    assert.equal(release.version, version);
    assert.equal(release.skillCount, 16);
    assert.equal(release.evaluations.cases, 48);
    execFileSync('unzip', ['-q', path.join(a, zip), '-d', path.join(dir, 'extract')]);
    const result = JSON.parse(execFileSync(process.execPath, ['scripts/validate-workflow.mjs', 'examples/procurement/workflow.yaml'], { cwd: path.join(dir, 'extract/provia-skills'), encoding: 'utf8' }));
    assert.equal(result.valid, true);
    const metadataResult = JSON.parse(execFileSync(process.execPath, ['scripts/validate-workflow.mjs', 'examples/metadata-fields.yaml'], { cwd: path.join(dir, 'extract/provia-skills'), encoding: 'utf8' }));
    assert.equal(metadataResult.valid, true);
    assert.equal(metadataResult.backendSchemaValidation, 'passed');
    const extracted = path.join(dir, 'extract/provia-skills');
    execFileSync(process.execPath, ['scripts/build-entity-catalogue.mjs', 'examples/entity-catalogue.json', '--output', path.join(dir, 'catalogue.html')], { cwd: extracted });
    assert.equal(fs.readFileSync(path.join(dir, 'catalogue.html'), 'utf8'), fs.readFileSync(path.join(extracted, 'examples/entity-catalogue.html'), 'utf8'));
    execFileSync(process.execPath, ['scripts/build-project-map.mjs', 'examples/procurement/provia-project.json', '--output', path.join(dir, 'project.html')], { cwd: extracted });
    assert.equal(fs.readFileSync(path.join(dir, 'project.html'), 'utf8'), fs.readFileSync(path.join(extracted, 'examples/procurement/project.html'), 'utf8'));
    assert.equal(execFileSync(process.execPath, ['scripts/review-actions.mjs', 'examples/procurement/workflow.yaml'], { cwd: extracted, encoding: 'utf8' }).includes('"complete": true'), true);
    assert.match(execFileSync(process.execPath, ['scripts/build-skills.mjs', '--check'], { cwd: extracted, encoding: 'utf8' }), /match catalog.json/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('the release gate refuses stale or untriaged evaluations unless bypassed, and records the bypass', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-gate-test-'));
  try {
    const cases = JSON.parse(fs.readFileSync(path.join(root, 'tests/skill-evaluations.json'), 'utf8'));
    const fresh = cases.map(entry => ({ ...entry, status: 'passed', run: { pluginVersion: version } }));
    const stale = fresh.map((entry, index) => index === 0 ? { ...entry, run: { pluginVersion: '0.0.0' } } : entry);
    const untriaged = fresh.map((entry, index) => index === 0 ? { ...entry, status: 'failed' } : entry);
    const triaged = fresh.map((entry, index) => index === 0 ? { ...entry, status: 'failed', triage: 'Known wording flake; tracked.' } : entry);
    for (const [name, matrix, ok] of [['fresh', fresh, true], ['stale', stale, false], ['untriaged', untriaged, false], ['triaged', triaged, true]]) {
      const file = path.join(dir, `${name}.json`);
      fs.writeFileSync(file, JSON.stringify(matrix));
      const run = () => execFileSync('python3', ['scripts/build-release.py', '--output', path.join(dir, name), '--evaluations', file], { cwd: root, stdio: 'pipe' });
      if (ok) { run(); assert.equal(JSON.parse(fs.readFileSync(path.join(dir, name, 'release.json'), 'utf8')).evaluationGate, 'passed', name); }
      else assert.throws(run, /Evaluation gate/, name);
    }
    execFileSync('python3', ['scripts/build-release.py', '--output', path.join(dir, 'bypass'), '--evaluations', path.join(dir, 'stale.json'), '--allow-stale-evaluations'], { cwd: root, stdio: 'pipe' });
    const release = JSON.parse(fs.readFileSync(path.join(dir, 'bypass/release.json'), 'utf8'));
    assert.equal(release.evaluationGate, 'bypassed');
    assert.equal(release.evaluations.notRunForThisVersion, 1);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('release output cannot overlap source inputs or their ancestors', () => {
  for (const output of [root, path.dirname(root), path.join(root, 'scripts'), path.join(root, 'examples', 'nested-release')]) {
    assert.throws(() => execFileSync('python3', ['scripts/build-release.py', '--output', output], { cwd: root, stdio: 'pipe' }), /Invalid release output/);
  }
});
