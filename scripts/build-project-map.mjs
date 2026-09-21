#!/usr/bin/env node
// Checks a provia-project manifest (v1.1), renders the offline project map (scripts/lib/project-map) and generates the setup handover.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkManifest, analyze, renderSetup, loadManifest } from './lib/project-manifest.mjs';
import { buildModel } from './lib/project-map/model.mjs';

const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const asset = name => readFileSync(new URL(`./lib/project-map/${name}`, import.meta.url), 'utf8');

/**
 * Renders the offline project map: one HTML file that embeds every object once (JSON) and renders the selected view on demand.
 * Deterministic for the same manifest and workflow files; no network, no external assets.
 */
export function renderMap(manifest, baseDir) {
  const model = buildModel(manifest, baseDir);
  const T = model.labels;
  const data = JSON.stringify(model).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const css = asset('app.css');
  const js = asset('app.js');
  if (js.includes('</script')) throw new Error('app.js must not contain a closing script tag');
  const evidence = T.header.evidenceStates[model.evidence.state].replace('{n}', String(model.evidence.receipts));
  const counts = { design: 0, validation: 0, setup: 0, blocker: 0 };
  for (const issue of model.issues) counts[issue.category] += 1;
  return `<!doctype html><html lang="${escape(manifest.project.language)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="generator" content="${escape(manifest.project.generator ?? 'provia-skills')}"><title>${escape(manifest.project.title)}</title>
<style>${css}</style></head><body>
<a class="skip" href="#main">${T.nav.skip}</a>
<div class="app">
<header class="top"><h1>${escape(manifest.project.title)}</h1><div class="meta"><span>${escape(manifest.project.country)} · ${escape(manifest.project.language)}</span><span>${T.header.configuredMode}: ${escape(T.header.modes[model.organization.mode] ?? model.organization.mode)}</span><span>${T.header.evidence}: ${escape(evidence)}</span><span>${T.header.generated} ${escape(manifest.project.generator ?? 'provia-skills')}${manifest.project.updatedAt ? ' · ' + T.header.updated + ' ' + escape(manifest.project.updatedAt) : ''}</span></div>
<div class="tools"><button type="button" id="menu" class="menu-btn" aria-expanded="false" aria-controls="nav">${T.nav.menu}</button><button type="button" id="back" title="${T.nav.back}" aria-label="${T.nav.back}">←</button><button type="button" id="forward" title="${T.nav.forward}" aria-label="${T.nav.forward}">→</button><button type="button" id="print">${T.nav.print}</button></div>
<p class="notice">${model.evidence.receipts === 0 ? T.header.noConnection + ' ' : ''}${T.header.notice}</p></header>
<div class="body"><nav class="side" id="nav" aria-label="${T.nav.overview}"><label for="nav-search" class="sr">${T.nav.search}</label><input id="nav-search" type="search" placeholder="${T.search.placeholder}" autocomplete="off"><div id="nav-tree"></div></nav>
<main id="main" tabindex="-1"><noscript><h2>${escape(manifest.project.title)}</h2><p>${T.overview.workflowsByArea}: ${model.workflows.map(workflow => escape(workflow.name)).join(', ') || '—'}. ${T.nav.entities}: ${model.entityTypes.length}. ${T.nav.groups}: ${model.groups.length}. ${T.nav.forms}: ${model.forms.length}. ${T.enums.category.blocker}: ${counts.blocker}. ${T.enums.category.design}: ${counts.design}. ${T.enums.category.validation}: ${counts.validation}. ${T.enums.category.setup}: ${counts.setup}.</p></noscript></main></div></div>
<div id="live" class="status-live" role="status" aria-live="polite"></div>
<script type="application/json" id="project-data">${data}</script>
<script>${js}</script></body></html>`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [input, flag, output, ...extra] = process.argv.slice(2);
    const usage = 'Usage: node scripts/build-project-map.mjs provia-project.json --check | --output project.html | --setup setup.md';
    if (!input || extra.length || !((flag === '--check' && !output) || ((flag === '--output' || flag === '--setup') && output))) throw new Error(usage);
    if (output && resolve(input) === resolve(output)) throw new Error('Output must be a separate file');
    if (flag === '--output' && extname(output).toLowerCase() !== '.html') throw new Error('The map output must be an .html file');
    if (flag === '--setup' && extname(output).toLowerCase() !== '.md') throw new Error('The setup output must be a .md file');
    const { manifest, raw, baseDir } = loadManifest(input);
    const { errors, warnings, infos } = checkManifest(raw, baseDir);
    for (const item of infos) console.error(`info ${item.path}: ${item.message}`);
    for (const warning of warnings) console.error(`warning ${warning.path}: ${warning.message}`);
    if (errors.length) { for (const error of errors) console.error(`error ${error.path}: ${error.message}`); throw new Error(`${errors.length} manifest error(s). Nothing written.`); }
    const analysis = analyze(manifest);
    if (flag === '--output') writeFileSync(output, renderMap(manifest, baseDir));
    if (flag === '--setup') writeFileSync(output, renderSetup(manifest, analysis));
    const workflows = manifest.workflows ?? [];
    const unresolvedKeys = workflows.reduce((sum, workflow) => sum + (workflow.unresolvedActors ?? []).length + (workflow.unresolvedEntityTypes ?? []).length, 0);
    const declared = analysis.access.filter(entry => entry.declared).length;
    const blocked = analysis.readiness.filter(item => item.blocked).length;
    console.log(`Manifest ${manifest.project.key}: ${workflows.length} workflows, ${(manifest.groups ?? []).length} groups, ${(manifest.entityTypes ?? []).length} entity types, ${(manifest.forms ?? []).length} forms; access declared on ${declared}/${workflows.length}, ${blocked} readiness block(s), ${unresolvedKeys} unresolved actor/entity key(s); ${analysis.unresolved.length} pending item(s), ${warnings.length} warning(s), ${infos.length} info(s). Plugin artefact only; nothing was created in Provia.${output ? ` ${flag === '--output' ? 'Map' : 'Handover'} written to ${output}.` : ''}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
