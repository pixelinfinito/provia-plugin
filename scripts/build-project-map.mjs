#!/usr/bin/env node
// Checks a provia-project/v1 manifest, renders the offline project map and generates the setup handover.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkManifest, analyze, renderSetup, loadManifest, labelsFor } from './lib/project-manifest.mjs';
import { render as renderCatalogue } from './build-entity-catalogue.mjs';
import * as engine from '../contracts/workflow-v1/engine.mjs';

const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const NODE_W = 210, NODE_H = 44, GAP = 14, COL = 330, TOP = 24, LEFT = 24, INDENT = 18;
const KINDS = ['source', 'section', 'workflow', 'action', 'group', 'ai_profile', 'form', 'entity_type'];

const UI = {
  pt: { map: 'Mapa', catalogue: 'Catálogo', pending: 'Pendências', decisions: 'Decisões', search: 'Pesquisar nós', legend: 'Verde: resolvido por recibo. Vermelho: por resolver. Cinzento: sem dependência de destino.',
    kinds: { source: 'Fontes', section: 'Secções', workflow: 'Workflows', action: 'Acções', group: 'Grupos', ai_profile: 'Perfis de IA', form: 'Formulários', entity_type: 'Tipos de entidade' },
    select: 'Seleccione um nó no mapa ou na lista.', noCatalogue: 'O manifesto não tem tipos de entidade.', none: 'Nada pendente.', where: 'Onde', item: 'Item', todo: 'O que fazer', owner: 'Dono', status: 'Estado',
    fromYaml: 'Do ficheiro YAML', description: 'Instrução', due: 'Prazo', evidence: 'Evidência', sources: 'Fontes', folded: 'Passos incorporados', assignee: 'Responsável', form: 'Formulário', entities: 'Entidades', members: 'Membros', flags: 'Sinalizações', purpose: 'Finalidade', parent: 'Grupo-pai', file: 'Ficheiro', type: 'Tipo', kind: 'Categoria', mode: 'Modo', open: 'em aberto', resolved: 'resolvida', receipt: 'Recibo', fields: 'Campos', edges: 'Ligações',
    notice: 'Mapa gerado sem ligação ao Provia. Nada aqui cria, altera ou publica configuração; é a base de revisão com o cliente e a origem do apply em modo ligado.' },
  en: { map: 'Map', catalogue: 'Catalogue', pending: 'Pending', decisions: 'Decisions', search: 'Search nodes', legend: 'Green: resolved by a receipt. Red: unresolved. Grey: no destination dependency.',
    kinds: { source: 'Sources', section: 'Sections', workflow: 'Workflows', action: 'Actions', group: 'Groups', ai_profile: 'AI profiles', form: 'Forms', entity_type: 'Entity types' },
    select: 'Select a node on the map or in the list.', noCatalogue: 'The manifest has no entity types.', none: 'Nothing pending.', where: 'Where', item: 'Item', todo: 'What to do', owner: 'Owner', status: 'Status',
    fromYaml: 'From the YAML file', description: 'Brief', due: 'Due', evidence: 'Evidence', sources: 'Sources', folded: 'Folded steps', assignee: 'Owner', form: 'Form', entities: 'Entities', members: 'Members', flags: 'Flags', purpose: 'Purpose', parent: 'Parent group', file: 'File', type: 'Type', kind: 'Kind', mode: 'Mode', open: 'open', resolved: 'resolved', receipt: 'Receipt', fields: 'Fields', edges: 'Edges',
    notice: 'Map generated without a Provia connection. Nothing here creates, changes or publishes configuration; it is the review baseline with the customer and the source of the connected-mode apply.' }
};

/** Attach description, due and assignee from each workflow file so the panel shows the assignee's brief. */
function attachYaml(manifest, baseDir, nodes) {
  for (const workflow of manifest.workflows ?? []) {
    if (!workflow.file || !baseDir) continue;
    const file = resolve(baseDir, workflow.file);
    if (!existsSync(file)) continue;
    let draft;
    try { draft = engine.parseYamlToDraft(readFileSync(file, 'utf8')).draft; } catch { continue; }
    for (const action of draft?.actions ?? []) {
      const node = nodes.find(item => item.id === `action:${workflow.key}:${action.id}`);
      if (node) node.yaml = { description: action.description ?? null, due: action.due ?? null, assignee: action.assignee ?? null, type: action.type };
    }
  }
}

function layout(manifest, analysis) {
  const positions = new Map();
  const columns = [[], [], [], [], []];
  const byId = new Map(analysis.nodes.map(node => [node.id, node]));
  for (const source of manifest.sources ?? []) {
    columns[0].push({ id: `source:${source.id}`, indent: 0 });
    for (const section of source.sections ?? []) if (byId.has(`section:${source.id}:${section.anchor}`)) columns[0].push({ id: `section:${source.id}:${section.anchor}`, indent: 1 });
  }
  for (const workflow of manifest.workflows ?? []) {
    columns[1].push({ id: `workflow:${workflow.key}`, indent: 0 });
    for (const action of workflow.actions ?? []) columns[1].push({ id: `action:${workflow.key}:${action.localId}`, indent: 1 });
  }
  const groups = manifest.groups ?? [];
  for (const group of groups.filter(item => !item.parentKey)) {
    columns[2].push({ id: `group:${group.key}`, indent: 0 });
    for (const child of groups.filter(item => item.parentKey === group.key)) columns[2].push({ id: `group:${child.key}`, indent: 1 });
  }
  for (const profile of manifest.aiProfiles ?? []) columns[2].push({ id: `ai:${profile.key}`, indent: 0 });
  for (const form of manifest.forms ?? []) columns[3].push({ id: `form:${form.key}`, indent: 0 });
  for (const type of manifest.entityTypes ?? []) columns[4].push({ id: `entity:${type.key}`, indent: 0 });
  let height = 0, index = 0;
  for (const column of columns) {
    const items = column.filter(item => byId.has(item.id));
    if (!items.length) continue;
    let y = TOP;
    for (const item of items) {
      positions.set(item.id, { x: LEFT + index * COL + item.indent * INDENT, y, w: NODE_W - item.indent * INDENT, h: NODE_H });
      y += NODE_H + GAP;
    }
    height = Math.max(height, y);
    index += 1;
  }
  return { positions, width: LEFT * 2 + Math.max(index - 1, 0) * COL + NODE_W, height: height + TOP };
}

function svg(analysis, geometry) {
  const { positions, width, height } = geometry;
  const stroke = { resolved: '#15803d', unresolved: '#b91c1c', neutral: '#98a2b3' };
  const fill = { source: '#eef2f7', section: '#f8fafc', workflow: '#e0e7ff', action: '#ffffff', group: '#fef3c7', ai_profile: '#ede9fe', form: '#dcfce7', entity_type: '#ffe4e6' };
  const paths = [];
  for (const [index, edge] of analysis.edges.entries()) {
    if (['contains', 'parent'].includes(edge.kind)) continue;
    const a = positions.get(edge.from), b = positions.get(edge.to);
    if (!a || !b) continue;
    let d;
    if (Math.abs(a.x - b.x) < COL / 2) {
      const x1 = a.x + a.w, y1 = a.y + a.h / 2, y2 = b.y + b.h / 2, x2 = b.x + b.w;
      d = `M${x1},${y1} C${x1 + 60},${y1} ${x2 + 60},${y2} ${x2},${y2}`;
    } else {
      const forward = a.x < b.x;
      const x1 = forward ? a.x + a.w : a.x, y1 = a.y + a.h / 2, x2 = forward ? b.x : b.x + b.w, y2 = b.y + b.h / 2;
      const c = (x2 - x1) / 2;
      d = `M${x1},${y1} C${x1 + c},${y1} ${x2 - c},${y2} ${x2},${y2}`;
    }
    paths.push(`<path id="edge-${index}" data-from="${escape(edge.from)}" data-to="${escape(edge.to)}" data-kind="${edge.kind}" d="${d}" fill="none" stroke="${stroke[edge.status]}" stroke-width="${edge.status === 'neutral' ? 1.2 : 1.8}" marker-end="url(#arrow)"/>`);
  }
  const boxes = [];
  for (const node of analysis.nodes) {
    const p = positions.get(node.id);
    if (!p) continue;
    const label = node.label.length > 30 ? node.label.slice(0, 29) + '…' : node.label;
    boxes.push(`<g class="node" data-id="${escape(node.id)}" tabindex="0" role="button" aria-label="${escape(node.label)}" transform="translate(${p.x},${p.y})"><rect width="${p.w}" height="${p.h}" rx="8" fill="${fill[node.kind]}" stroke="${stroke[node.status]}" stroke-width="${node.status === 'neutral' ? 1 : 2}"/><text x="10" y="18" font-size="10" fill="#475467">${escape(node.kind.replace('_', ' '))}</text><text x="10" y="34" font-size="13" fill="#182230">${escape(label)}</text></g>`);
  }
  return `<svg id="graph" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" role="img"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#667085"/></marker></defs>${paths.join('')}${boxes.join('')}</svg>`;
}

export function renderMap(manifest, baseDir) {
  const analysis = analyze(manifest);
  attachYaml(manifest, baseDir, analysis.nodes);
  const geometry = layout(manifest, analysis);
  const pt = String(manifest.project.language).toLowerCase().startsWith('pt');
  const T = pt ? UI.pt : UI.en;
  const L = labelsFor(manifest.project.language);
  const rail = KINDS.map(kind => {
    const items = analysis.nodes.filter(node => node.kind === kind);
    if (!items.length) return '';
    const pending = items.filter(node => node.status === 'unresolved').length;
    return `<details open><summary>${T.kinds[kind]} <small>${items.length}${pending ? ` · <span class="red">${pending}</span>` : ''}</small></summary><ul>${items.map(node => `<li><button type="button" class="rail-node status-${node.status}" data-id="${escape(node.id)}">${escape(node.label)}</button></li>`).join('')}</ul></details>`;
  }).join('');
  const pending = analysis.unresolved.length ? `<table><thead><tr><th>${T.where}</th><th>${T.item}</th><th>${T.todo}</th></tr></thead><tbody>${analysis.unresolved.map(item => `<tr><td>${escape([item.workflow, item.key].filter(Boolean).join(' / '))}</td><td>${escape(item.name)}</td><td>${escape(L.what[item.what] ?? item.what)}${item.ref ? ` <code>${escape(item.ref)}</code>` : ''}${item.detail ? `. ${escape(item.detail)}` : ''}</td></tr>`).join('')}</tbody></table>` : `<p>${T.none}</p>`;
  const decisions = analysis.decisions.length ? `<ul>${analysis.decisions.map(decision => `<li><strong>${escape(decision.id)}</strong> ${escape(decision.question)} <small>(${decision.status === 'open' ? T.open : T.resolved}${decision.owner ? `, ${T.owner}: ${escape(decision.owner)}` : ''})</small>${decision.resolution ? `<br>${escape(decision.resolution)}` : ''}</li>`).join('')}</ul>` : `<p>${T.none}</p>`;
  const types = manifest.entityTypes ?? [];
  const catalogue = types.length
    ? `<iframe title="${T.catalogue}" srcdoc="${escape(renderCatalogue({ schemaVersion: 'provia-entity-catalogue/v1', title: manifest.project.title, language: manifest.project.language, country: manifest.project.country, notes: [], types }))}" allow="clipboard-write"></iframe>`
    : `<p>${T.noCatalogue}</p>`;
  const data = JSON.stringify({ nodes: analysis.nodes, edges: analysis.edges, labels: T, what: L.what }, null, 0).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="${escape(manifest.project.language)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(manifest.project.title)}</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f4f6f9;color:#182230;font:15px/1.5 system-ui,sans-serif}header{padding:16px 24px;background:#fff;border-bottom:1px solid #d0d5dd}h1{margin:0 0 4px;font-size:22px}h2{font-size:18px;margin:0 0 12px}.notice{margin:8px 0 0;padding:10px 12px;background:#eaf0ff;border-radius:8px;font-size:14px}
.tabs{display:flex;gap:6px;margin-top:12px}.tabs button{padding:8px 14px;border:1px solid #98a2b3;border-radius:8px 8px 0 0;background:#f9fafb;cursor:pointer;font:inherit}.tabs button[aria-selected=true]{background:#fff;border-bottom-color:#fff;font-weight:600}
.panel:not([data-active]){display:none}#map[data-active]{display:grid;grid-template-columns:240px 1fr 340px;min-height:calc(100vh - 150px)}
aside{padding:12px;border-right:1px solid #d0d5dd;background:#fff;overflow:auto}aside ul{list-style:none;padding:0 0 0 6px;margin:4px 0}aside summary{cursor:pointer;font-weight:600}
.rail-node{display:block;width:100%;text-align:left;padding:3px 6px;border:0;background:none;cursor:pointer;font:inherit;border-left:3px solid #98a2b3;margin:2px 0;border-radius:0 4px 4px 0}.rail-node.status-unresolved{border-left-color:#b91c1c}.rail-node.status-resolved{border-left-color:#15803d}.rail-node:hover,.rail-node[aria-current]{background:#eaf0ff}
#canvas{overflow:auto;padding:8px}#detail{padding:14px;border-left:1px solid #d0d5dd;background:#fff;overflow:auto}#detail dl{display:grid;grid-template-columns:110px 1fr;gap:4px 10px;font-size:14px}#detail dt{color:#475467}#detail dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
.node{cursor:pointer}.node:focus-visible rect,.node.selected rect{stroke:#2563eb!important;stroke-width:3!important}path.dim{opacity:.15}path.hot{stroke-width:3!important}
.red{color:#b91c1c}input{padding:8px;border:1px solid #98a2b3;border-radius:6px;width:100%;font:inherit;margin-bottom:8px}table{border-collapse:collapse;width:100%;background:#fff}th,td{border:1px solid #d0d5dd;padding:8px;text-align:left;vertical-align:top;font-size:14px}#pending,#decisions{padding:24px}iframe{width:100%;height:calc(100vh - 160px);border:1px solid #d0d5dd;background:#fff}code{background:#f2f4f7;padding:1px 4px;border-radius:4px}
@media(max-width:900px){#map{grid-template-columns:1fr}aside,#detail{border:0;border-bottom:1px solid #d0d5dd}}
</style></head><body>
<header><h1>${escape(manifest.project.title)}</h1><div>${escape(manifest.project.country)} · ${escape(manifest.project.language)} · ${T.mode}: ${escape(manifest.organization.mode)} · ${escape(manifest.project.generator ?? 'provia-skills')}${manifest.project.updatedAt ? ' · ' + escape(manifest.project.updatedAt) : ''}</div>
<p class="notice">${T.notice}</p>
<div class="tabs" role="tablist"><button role="tab" aria-selected="true" data-tab="map">${T.map}</button><button role="tab" aria-selected="false" data-tab="catalogue">${T.catalogue} <small>${types.length}</small></button><button role="tab" aria-selected="false" data-tab="pending">${T.pending} <small>${analysis.unresolved.length}</small></button><button role="tab" aria-selected="false" data-tab="decisions">${T.decisions} <small>${analysis.decisions.length}</small></button></div></header>
<section id="map" class="panel" data-active role="tabpanel"><aside><input id="search" type="search" placeholder="${T.search}" aria-label="${T.search}">${rail}<p><small>${T.legend}</small></p></aside><div id="canvas">${svg(analysis, geometry)}</div><div id="detail"><p>${T.select}</p></div></section>
<section id="catalogue" class="panel" role="tabpanel">${catalogue}</section>
<section id="pending" class="panel" role="tabpanel"><h2>${T.pending}</h2>${pending}</section>
<section id="decisions" class="panel" role="tabpanel"><h2>${T.decisions}</h2>${decisions}</section>
<script type="application/json" id="project-data">${data}</script>
<script>
const data = JSON.parse(document.getElementById('project-data').textContent);
const T = data.labels, byId = new Map(data.nodes.map(n => [n.id, n]));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.querySelectorAll('.tabs button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', b === button));
  document.querySelectorAll('.panel').forEach(p => p.toggleAttribute('data-active', p.id === button.dataset.tab));
}));
function due(d) { if (!d) return null; const parts = []; if (d.offsetDays != null) parts.push(d.offsetDays + ' d'); if (d.offsetHours != null) parts.push(d.offsetHours + ' h'); return parts.join(' ') + (d.offsetType ? ' ' + d.offsetType : '') + (d.basis ? ' · ' + d.basis : ''); }
function row(label, value) { return value == null || value === '' || (Array.isArray(value) && !value.length) ? '' : '<dt>' + esc(label) + '</dt><dd>' + (Array.isArray(value) ? value.map(v => esc(typeof v === 'string' ? v : JSON.stringify(v))).join('\\n') : esc(typeof value === 'string' ? value : JSON.stringify(value))) + '</dd>'; }
function show(id) {
  const node = byId.get(id); if (!node) return;
  document.querySelectorAll('.node').forEach(g => g.classList.toggle('selected', g.dataset.id === id));
  document.querySelectorAll('.rail-node').forEach(b => b.dataset.id === id ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'));
  document.querySelectorAll('#graph path').forEach(p => { const hot = p.dataset.from === id || p.dataset.to === id; p.classList.toggle('hot', hot); p.classList.toggle('dim', !hot); });
  const d = node.data, y = node.yaml || {};
  let html = '<h2>' + esc(node.label) + '</h2><dl>' + row(T.kind, node.kind) + row(T.status, node.status);
  if (node.kind === 'action') html += row(T.type, d.type) + row(T.assignee, d.assigneeRef) + row(T.due, due(d.due || y.due)) + row(T.evidence, d.evidence) + row(T.form, d.formRef) + row(T.entities, d.entityRefs) + row(T.sources, (d.sourceRefs || []).map(r => r.source + (r.section ? ' §' + r.section : ''))) + row(T.folded, (d.folded || []).map(f => (f.section ? '§' + f.section + ' ' : '') + f.summary)) + row(T.description, d.description || y.description);
  else if (node.kind === 'group') html += row(T.parent, d.parentKey) + row(T.purpose, d.purpose) + row(T.members, (d.members || []).map(m => [m.role, m.email].filter(Boolean).join(' '))) + row(T.flags, (d.flags || []).map(f => f.code + (f.detail ? ': ' + f.detail : ''))) + row(T.sources, (d.sourceRefs || []).map(r => r.source + (r.section ? ' §' + r.section : '')));
  else if (node.kind === 'form') html += row(T.type, d.kind) + row(T.status, d.status) + row('Workflow', d.workflowRef) + row(T.type === 'Tipo' ? 'Acção' : 'Action', d.actionRef) + row(T.fields, (d.fields || []).map(f => typeof f === 'string' ? f : (f.label || f.key || JSON.stringify(f))));
  else if (node.kind === 'entity_type') html += row(T.purpose, d.purpose) + row(T.fields, (d.fields || []).map(f => f.key + ' (' + f.type + ')')) + row(T.description, d.description);
  else if (node.kind === 'workflow') html += row(T.status, d.status) + row(T.file, d.file) + row('Prefix', d.prefix) + row(T.sources, (d.sourceRefs || []).map(r => r.source + (r.section ? ' §' + r.section : '')));
  else if (node.kind === 'source') html += row(T.type, d.kind) + row('Version', d.version) + row(T.fields, (d.sections || []).map(s => '§' + s.anchor + ' ' + (s.title || '')));
  else if (node.kind === 'section') html += row(T.sources, d.source);
  else if (node.kind === 'ai_profile') html += row(T.purpose, d.purpose) + row('Workflow', d.workflowRef);
  const edges = data.edges.filter(e => e.from === id || e.to === id).map(e => (e.from === id ? '→ ' + (byId.get(e.to) || {}).label : '← ' + (byId.get(e.from) || {}).label) + ' (' + e.kind + ')');
  html += row(T.edges, edges) + '</dl>';
  document.getElementById('detail').innerHTML = html;
}
document.querySelectorAll('.node').forEach(g => { g.addEventListener('click', () => show(g.dataset.id)); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(g.dataset.id); } }); });
document.querySelectorAll('.rail-node').forEach(b => b.addEventListener('click', () => { show(b.dataset.id); const g = document.querySelector('.node[data-id="' + CSS.escape(b.dataset.id) + '"]'); if (g) g.scrollIntoView({ block: 'center', inline: 'center' }); }));
document.getElementById('search').addEventListener('input', e => { const term = e.target.value.toLocaleLowerCase(); document.querySelectorAll('.rail-node').forEach(b => { b.parentElement.hidden = term && !b.textContent.toLocaleLowerCase().includes(term); }); });
</script></body></html>`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [input, flag, output, ...extra] = process.argv.slice(2);
    const usage = 'Usage: node scripts/build-project-map.mjs provia-project.json --check | --output project.html | --setup setup.md';
    if (!input || extra.length || !((flag === '--check' && !output) || ((flag === '--output' || flag === '--setup') && output))) throw new Error(usage);
    if (output && resolve(input) === resolve(output)) throw new Error('Output must be a separate file');
    if (flag === '--output' && extname(output).toLowerCase() !== '.html') throw new Error('The map output must be an .html file');
    if (flag === '--setup' && extname(output).toLowerCase() !== '.md') throw new Error('The setup output must be a .md file');
    const { manifest, baseDir } = loadManifest(input);
    const { errors, warnings } = checkManifest(manifest, baseDir);
    for (const warning of warnings) console.error(`warning ${warning.path}: ${warning.message}`);
    if (errors.length) { for (const error of errors) console.error(`error ${error.path}: ${error.message}`); throw new Error(`${errors.length} manifest error(s). Nothing written.`); }
    const analysis = analyze(manifest);
    if (flag === '--output') writeFileSync(output, renderMap(manifest, baseDir));
    if (flag === '--setup') writeFileSync(output, renderSetup(manifest, analysis));
    console.log(`Manifest ${manifest.project.key}: ${(manifest.workflows ?? []).length} workflows, ${(manifest.groups ?? []).length} groups, ${(manifest.entityTypes ?? []).length} entity types, ${(manifest.forms ?? []).length} forms; ${analysis.unresolved.length} pending item(s), ${warnings.length} warning(s). Plugin artefact only; nothing was created in Provia.${output ? ` ${flag === '--output' ? 'Map' : 'Handover'} written to ${output}.` : ''}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
