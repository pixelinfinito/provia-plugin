import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { check, frontmatterDescription, renderSkill, renderDocEn, renderDocPt } from '../scripts/build-skills.mjs';

import { parseYamlToDraft } from '../contracts/workflow-v1/engine.mjs';

const root = path.resolve(import.meta.dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));

test('SKILL.md files and README tables are generated from catalog.json and current', () => {
  assert.deepEqual(check(), []);
  assert.equal(catalog.skills.length, 16);
});

test('every skill has Portuguese and English trigger phrases within the frontmatter limit and points to the shared conventions', () => {
  for (const skill of catalog.skills) {
    const description = frontmatterDescription(skill);
    assert.ok(description.length <= 1024, skill.name);
    for (const phrase of skill.triggers.pt) assert.ok(description.includes(`«${phrase}»`), `${skill.name}: ${phrase}`);
    const file = fs.readFileSync(path.join(root, 'skills', skill.name, 'SKILL.md'), 'utf8');
    assert.match(file, /^---\nname: provia-[a-z-]+\ndescription: .+\n---\n/);
    assert.ok(file.includes('references/skill-conventions.md'));
    assert.ok(file.includes('references/project-manifest.md'));
    assert.ok(!file.includes('This plugin has no Provia connection'), `${skill.name}: preamble moved to the conventions reference`);
    for (const reference of skill.references) assert.ok(fs.existsSync(path.join(root, reference.path)), `${skill.name}: ${reference.path}`);
  }
});

test('the evaluation matrix covers every skill with normal, incomplete and conflicting cases', () => {
  const cases = JSON.parse(fs.readFileSync(path.join(root, 'tests/skill-evaluations.json'), 'utf8'));
  assert.equal(cases.length, 48);
  for (const skill of catalog.skills) {
    const modes = cases.filter(entry => entry.skill === skill.name).map(entry => entry.mode).sort();
    assert.deepEqual(modes, ['conflicting', 'incomplete', 'normal'], skill.name);
  }
  assert.ok(new Set(cases.map(entry => entry.id)).size === cases.length);
});

test('docs pages are written in both languages with docusaurus frontmatter', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-docs-'));
  try {
    const en = path.join(dir, 'docs/guides/provia-skills/skills'), pt = path.join(dir, 'i18n/pt/docusaurus-plugin-content-docs/current/guides/provia-skills/skills');
    fs.mkdirSync(en, { recursive: true }); fs.mkdirSync(pt, { recursive: true });
    const output = execFileSync(process.execPath, [path.join(root, 'scripts/build-skills.mjs'), '--docs', dir], { encoding: 'utf8' });
    assert.match(output, /32 docs pages written/);
    const page = fs.readFileSync(path.join(en, 'workflow-designer.mdx'), 'utf8');
    assert.match(page, /^---\ntitle: "Procedure-to-workflow designer"\n/);
    assert.equal(page, renderDocEn(catalog.skills.find(skill => skill.slug === 'workflow-designer')));
    const ptPage = fs.readFileSync(path.join(pt, 'bootstrap.mdx'), 'utf8');
    assert.match(ptPage, /Arrancar um projecto de implementação/);
    assert.equal(ptPage, renderDocPt(catalog.skills.find(skill => skill.slug === 'bootstrap')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('generated skill frontmatter parses without changing descriptions or triggers', () => {
  const punctuated = {
    ...catalog.skills[0],
    description: 'Design: "quoted" values # with punctuation.',
    triggers: { en: ['a: b', 'line one\nline two'], pt: ['rever: acções'] },
  };
  for (const skill of [...catalog.skills, punctuated]) {
    const frontmatter = renderSkill(skill).split('---\n')[1];
    const parsed = parseYamlToDraft(frontmatter);
    assert.deepEqual(parsed.syntaxErrors, [], skill.name);
    assert.equal(parsed.draft.name, skill.name);
    assert.equal(parsed.draft.description, frontmatterDescription(skill));
  }
});
