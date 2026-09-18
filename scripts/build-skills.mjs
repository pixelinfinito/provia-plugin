#!/usr/bin/env node
// Single source for the skills: catalog.json generates skills/*/SKILL.md, the README tables and the docs pages.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const version = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).version;
const NOTE = '<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->';
const README_BEGIN = '<!-- skills:begin -->', README_END = '<!-- skills:end -->';

if (catalog.schemaVersion !== 'provia-skills-catalog/v2') throw new Error('Unsupported catalog schemaVersion');
const stages = new Map(catalog.stages.map(stage => [stage.key, stage]));
for (const skill of catalog.skills) {
  for (const key of ['name', 'slug', 'stage', 'title', 'titlePt', 'description', 'inputs', 'deliverable', 'incomplete', 'conflict']) {
    if (typeof skill[key] !== 'string' || !skill[key].trim()) throw new Error(`${skill.name ?? '?'}: missing ${key}`);
  }
  if (!stages.has(skill.stage)) throw new Error(`${skill.name}: unknown stage ${skill.stage}`);
  if (!Array.isArray(skill.procedure) || !skill.procedure.length) throw new Error(`${skill.name}: procedure`);
  if (!skill.triggers?.en?.length || !skill.triggers?.pt?.length) throw new Error(`${skill.name}: triggers in both languages are required`);
  if (!skill.examples?.pt || !skill.examples?.en) throw new Error(`${skill.name}: examples`);
  if (!skill.manifest?.reads || !skill.manifest?.appends) throw new Error(`${skill.name}: manifest reads/appends`);
  if (!skill.pt?.description || !skill.pt?.steps?.length) throw new Error(`${skill.name}: pt block`);
  if (skill.name !== `provia-${skill.slug}`) throw new Error(`${skill.name}: slug mismatch`);
  const description = frontmatterDescription(skill);
  if (description.length > 1024) throw new Error(`${skill.name}: frontmatter description exceeds 1024 characters`);
}
const names = catalog.skills.map(skill => skill.name);
if (new Set(names).size !== names.length) throw new Error('Duplicate skill names');

export function frontmatterDescription(skill) {
  const en = skill.triggers.en.map(text => `"${text}"`).join(', ');
  const pt = skill.triggers.pt.map(text => `«${text}»`).join(', ');
  return `${skill.description} Use when the user asks for ${en}, or says ${pt}.`;
}

const firstSentence = text => text.split(/(?<=\.)\s/)[0];
const quote = text => text.replace(/"/g, '\\"');
const relative = target => `../../${target}`;

export function renderSkill(skill) {
  const references = skill.references.map(reference => `- [${reference.label}](${relative(reference.path)}): ${reference.when}.`);
  return `---
name: ${skill.name}
description: ${JSON.stringify(frontmatterDescription(skill))}
---

${NOTE}

# ${skill.title}

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

${skill.inputs}

## References
${references.length ? '\n' + references.join('\n') : '\nNo task-specific reference beyond the shared conventions.'}

## Procedure

${skill.procedure.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Deliverable

${skill.deliverable} Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: ${skill.manifest.reads}. Appends: ${skill.manifest.appends}. See [project manifest](../../references/project-manifest.md).

## Examples

- ${skill.examples.pt}
- ${skill.examples.en}

## Incomplete or conflicting input

${skill.incomplete}

${skill.conflict}

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
`;
}

export function renderReadmeTables() {
  const blocks = catalog.stages.map(stage => {
    const rows = catalog.skills.filter(skill => skill.stage === stage.key).map(skill =>
      `| [${skill.name}](skills/${skill.name}/SKILL.md) | ${skill.description} «${skill.triggers.pt[0]}» | ${firstSentence(skill.inputs)} | ${firstSentence(skill.deliverable)} |`);
    return `### ${stage.title}\n\n| Skill and source | When to use it | What to provide | Expected output |\n| --- | --- | --- | --- |\n${rows.join('\n')}`;
  });
  return `${README_BEGIN}\n${blocks.join('\n\n')}\n${README_END}`;
}

function applyReadme(text) {
  const start = text.indexOf(README_BEGIN), end = text.indexOf(README_END);
  if (start < 0 || end < start) throw new Error('README.md lacks the skills:begin/skills:end markers');
  return text.slice(0, start) + renderReadmeTables() + text.slice(end + README_END.length);
}

const footerEn = 'The skill works with the context and records you supply and the project manifest. It reads or changes your Provia organization only through the `provia-implementer` connector, when that is available and you authorize it; otherwise every result is a draft for an authorized user to configure. Review assumptions and remaining configuration with the process owner.';
const footerPt = 'A skill trabalha com o contexto e os registos que fornecer e com o manifesto do projecto. Só consulta ou altera a sua organização Provia através do conector `provia-implementer`, quando este existir e for autorizado; caso contrário, cada resultado é um rascunho para um utilizador autorizado configurar. Reveja pressupostos e configuração pendente com o dono do processo.';

export function renderDocEn(skill) {
  return `---
title: "${quote(skill.title)}"
description: "${quote(skill.description)}"
sidebar_position: ${skill.position}
---

${NOTE}

Use \`${skill.name}\` when you need to ${skill.description.charAt(0).toLowerCase()}${skill.description.slice(1, -1)}. It also answers requests such as ${skill.triggers.en.map(text => `"${text}"`).join(', ')}.

## What to provide

${skill.inputs} State country and output language separately. For Angola, you can request pt-AO output, AOA currency and Africa/Luanda time.

## Example request

\`\`\`text
Use ${skill.name}. Our organization operates in Angola.
${skill.examples.en}
\`\`\`

## How to work

${skill.procedure.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Expected result

${skill.deliverable}

## Project manifest

Reads: ${skill.manifest.reads}. Appends: ${skill.manifest.appends}. See the [project manifest reference](https://github.com/pixelinfinito/provia-plugin/blob/main/references/project-manifest.md).

## What to review

${skill.incomplete} ${skill.conflict}

${footerEn}

See the [usage guide](../using-the-plugin.mdx), [country context](../country-context.mdx) and [full catalogue](../index.mdx).
`;
}

export function renderDocPt(skill) {
  const pt = skill.pt;
  return `---
title: "${quote(skill.titlePt)}"
description: "${quote(pt.description)}"
sidebar_position: ${skill.position}
---

${NOTE}

Use \`${skill.name}\` para ${pt.description.charAt(0).toLowerCase()}${pt.description.slice(1, -1)}. Responde também a pedidos como ${skill.triggers.pt.map(text => `«${text}»`).join(', ')}.

## O que fornecer

${pt.inputs} Indique o país e a língua da resposta. Para Angola, pode pedir pt-AO, moeda AOA e fuso Africa/Luanda.

## Pedido de exemplo

\`\`\`text
Use ${skill.name}. País: Angola. Responda em pt-AO.
${pt.example}
\`\`\`

## Como trabalhar

${pt.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Resultado esperado

${pt.output}

## Manifesto do projecto

Lê: ${skill.manifest.reads}. Acrescenta: ${skill.manifest.appends}. Consulte a [referência do manifesto](https://github.com/pixelinfinito/provia-plugin/blob/main/references/project-manifest.md).

## O que rever

${pt.review}

${footerPt}

Consulte o [guia de utilização](../using-the-plugin.mdx), o [contexto do país](../country-context.mdx) e o [catálogo completo](../index.mdx).
`;
}

export function expectedFiles() {
  const files = new Map();
  for (const skill of catalog.skills) files.set(path.join('skills', skill.name, 'SKILL.md'), renderSkill(skill));
  return files;
}

export function check() {
  const problems = [];
  for (const [file, content] of expectedFiles()) {
    const target = path.join(root, file);
    if (!existsSync(target)) problems.push(`${file}: missing`);
    else if (readFileSync(target, 'utf8') !== content) problems.push(`${file}: differs from catalog.json`);
  }
  const known = new Set(catalog.skills.map(skill => skill.name));
  for (const entry of readdirSync(path.join(root, 'skills'), { withFileTypes: true })) {
    if (entry.isDirectory() && !known.has(entry.name)) problems.push(`skills/${entry.name}: not in catalog.json`);
  }
  const readme = readFileSync(path.join(root, 'README.md'), 'utf8');
  if (applyReadme(readme) !== readme) problems.push('README.md: skill tables differ from catalog.json');
  return problems;
}

function write() {
  for (const [file, content] of expectedFiles()) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), content);
  }
  const readmePath = path.join(root, 'README.md');
  writeFileSync(readmePath, applyReadme(readFileSync(readmePath, 'utf8')));
}

function writeDocs(docsRoot) {
  const en = path.join(docsRoot, 'docs/guides/provia-skills/skills');
  const pt = path.join(docsRoot, 'i18n/pt/docusaurus-plugin-content-docs/current/guides/provia-skills/skills');
  for (const dir of [en, pt]) if (!existsSync(dir)) throw new Error(`Docs directory not found: ${dir}`);
  for (const skill of catalog.skills) {
    writeFileSync(path.join(en, `${skill.slug}.mdx`), renderDocEn(skill));
    writeFileSync(path.join(pt, `${skill.slug}.mdx`), renderDocPt(skill));
  }
  return catalog.skills.length * 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  try {
    if (args[0] === '--check' && args.length === 1) {
      const problems = check();
      if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
      else console.log(`${catalog.skills.length} skills and the README tables match catalog.json (provia-skills ${version}).`);
    } else if (args[0] === '--docs' && args[1] && args.length === 2) {
      console.log(`${writeDocs(path.resolve(args[1]))} docs pages written.`);
    } else if (args.length === 0) {
      write();
      console.log(`${catalog.skills.length} SKILL.md files and the README tables generated from catalog.json.`);
    } else throw new Error('Usage: node scripts/build-skills.mjs [--check | --docs <docs root>]');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
