import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkManifest } from '../scripts/lib/project-manifest.mjs';
import { buildModel, categoryOf, mapId } from '../scripts/lib/project-map/model.mjs';
import { renderMap } from '../scripts/build-project-map.mjs';
import { writeLargeProject } from './helpers/large-project.mjs';
import { launch } from './helpers/chrome.mjs';

const root = path.resolve(import.meta.dirname, '..');
const procurement = () => JSON.parse(fs.readFileSync(path.join(root, 'examples', 'procurement', 'provia-project.json'), 'utf8'));
const dataOf = html => JSON.parse(html.match(/id="project-data">([\s\S]*?)<\/script>/)[1]);
const count = (text, needle) => text.split(needle).length - 1;
const markup = html => html.replace(/<script[\s\S]*?<\/script>/g, '');

test('the model stores every object once with stable ids and links issues to objects', () => {
  const model = buildModel(procurement(), path.join(root, 'examples', 'procurement'));
  const ids = new Set([...model.workflows.map(w => w.id), ...model.workflows.flatMap(w => w.actions.map(a => a.id)), ...model.entityTypes.map(e => e.id), ...model.groups.map(g => g.id), ...model.forms.map(f => f.id), ...model.sources.map(s => s.id), ...model.sources.flatMap(s => s.sections.map(x => x.id)), ...model.decisions.map(d => d.id)]);
  assert.ok(ids.has('workflow/compras/action/decidir'));
  assert.ok(ids.has('entity/fornecedor'));
  assert.ok(ids.has('source/sop-compras/section/2'));
  for (const issue of model.issues) if (issue.objectId) assert.ok(ids.has(issue.objectId), `issue ${issue.what} points at ${issue.objectId}`);
  for (const edge of model.edges) { assert.ok(ids.has(edge.from), edge.from); assert.ok(ids.has(edge.to), edge.to); }
  assert.deepEqual([...new Set(model.issues.map(issue => issue.category))].sort(), ['design', 'setup', 'validation']);
  assert.equal(mapId('action:compras:decidir'), 'workflow/compras/action/decidir');
  assert.equal(categoryOf({ what: 'decide' }), 'design');
  assert.equal(categoryOf({ what: 'create_group' }), 'setup');
  assert.equal(categoryOf({ what: 'apply_manual_start' }), 'blocker');
  assert.equal(categoryOf({ what: 'create_group', blocking: true }), 'blocker');
  const decide = model.workflows[0].actions.find(action => action.localId === 'decidir');
  assert.equal(decide.yaml.config.branches.length, 3, 'branches come from the YAML');
  assert.equal(decide.yaml.executionMode, 'sequential');
  assert.match(decide.yaml.description, /^Tarefa: /);
});

test('statuses are separate: design, validation, customer approval and application evidence', () => {
  const model = buildModel(procurement(), path.join(root, 'examples', 'procurement'));
  const review = model.workflows[0].review;
  assert.equal(review.design, 'validated');
  assert.deepEqual(review.validation, { warnings: 0, infos: 2, errors: 0 });
  assert.deepEqual(review.decisions, { open: 2, resolved: 0 });
  assert.equal(review.evidence.receipt, null);
  assert.equal(review.evidence.accessApplied, false);
  assert.equal(model.evidence.state, 'manual');
  assert.equal(model.organization.mode, 'disconnected');
  const html = renderMap(procurement(), path.join(root, 'examples', 'procurement'));
  assert.ok(html.includes('Modo configurado: desligado'));
  assert.ok(html.includes('Evidência de aplicação: sem recibos'));
  const connected = procurement();
  connected.organization = { ...connected.organization, mode: 'connected', tenantId: 't-1', productRevision: 'r-1' };
  const connectedHtml = renderMap(connected, path.join(root, 'examples', 'procurement'));
  assert.ok(connectedHtml.includes('Modo configurado: ligado'), 'configured mode is reported as configured');
  assert.ok(connectedHtml.includes('Evidência de aplicação: sem recibos'), 'evidence is reported separately from the configured mode');
});

test('the map is a single offline file that embeds the data once and renders nothing up front', () => {
  const html = renderMap(procurement(), path.join(root, 'examples', 'procurement'));
  assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+href=|fetch\(|<iframe/);
  assert.equal(count(markup(html), '<svg'), 0, 'diagrams are drawn on demand');
  assert.equal(count(markup(html), '<table'), 0, 'no view is pre-rendered');
  assert.equal(count(html, 'Tarefa: Decidir se o pedido de compra avan'), 1, 'the action brief is embedded once');
  assert.equal(count(html, '"name":"Fornecedor"'), 1, 'the entity type is embedded once');
  assert.ok(html.includes('<noscript>'));
  const data = dataOf(html);
  assert.equal(data.schemaVersion, 'provia-project-map/v2');
  assert.ok(data.labels.enums.actionType.decision === 'Decisão');
  const english = procurement();
  english.project.language = 'en';
  assert.ok(dataOf(renderMap(english, path.join(root, 'examples', 'procurement'))).labels.enums.actionType.decision === 'Decision');
});

test('the large fixture checks clean, renders within budget and does not duplicate objects', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-large-'));
  try {
    const manifest = writeLargeProject(dir);
    const { errors } = checkManifest(manifest, dir);
    assert.deepEqual(errors, []);
    const started = Date.now();
    const html = renderMap(manifest, dir);
    const seconds = (Date.now() - started) / 1000;
    assert.ok(seconds < 60, `render took ${seconds}s`);
    const data = dataOf(html);
    const actions = data.workflows.reduce((n, w) => n + w.actions.length, 0);
    assert.ok(actions >= 1800, `actions: ${actions}`);
    assert.ok(data.entityTypes.length >= 300 && data.decisions.length >= 800 && data.issues.length > 2000, `entities ${data.entityTypes.length}, decisions ${data.decisions.length}, issues ${data.issues.length}`);
    assert.equal(count(html, '"name":"Tipo 0001"'), 1, 'each entity type appears once');
    assert.equal(count(markup(html), '<svg'), 0);
    assert.ok(html.length < 16 * 1024 * 1024, `size ${html.length}`);
    assert.ok(data.workflows.some(w => w.actions.some(a => a.yaml && a.yaml.executionMode === 'parallel')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('browser: navigation, search, references, review filters, keyboard, deep links, narrow screens and print at scale', async t => {
  const page = await launch();
  if (!page) { t.skip('no Chrome installed'); return; }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'provia-large-'));
  try {
    const manifest = writeLargeProject(dir);
    const file = path.join(dir, 'project.html');
    fs.writeFileSync(file, renderMap(manifest, dir));
    const url = 'file://' + file;
    const go = async hash => { await page.eval(`new Promise(r => { location.hash = ${JSON.stringify(hash)}; setTimeout(r, 40); })`); };
    const title = () => page.eval('document.getElementById("view-title").textContent.trim()');
    const started = Date.now();
    await page.goto(url);
    await page.eval('new Promise(r => setTimeout(r, 100))');
    assert.deepEqual(page.errors(), []);
    assert.equal(await title(), 'Visão geral do projecto');
    assert.ok(Date.now() - started < 30000);
    // Find an action through search with accents ignored.
    await page.eval('(() => { const i = document.getElementById("nav-search"); i.value = "accao e seccao"; i.dispatchEvent(new Event("input", { bubbles: true })); })()');
    await page.eval('new Promise(r => setTimeout(r, 400))');
    assert.match(await page.eval('location.hash'), /^#search\?q=/);
    assert.ok(await page.eval('document.querySelectorAll(".result").length') > 0, 'accent-insensitive search finds actions');
    assert.ok(await page.eval('document.querySelector("[role=status]").textContent.includes("resultados")'));
    // Follow an entity reference from an action, inspect its fields, return to the action.
    await go('#workflow/wf_0007/action/a_04');
    assert.equal(await title(), manifest.workflows[7].actions[4].name);
    await page.eval('document.querySelector("#main a[href=\'#entity/tipo_0039\']").click()');
    await page.eval('new Promise(r => setTimeout(r, 40))');
    assert.equal(await title(), 'Tipo 0039');
    assert.equal(await page.eval('document.querySelectorAll("#panel-fields tbody tr").length'), 20);
    assert.ok(await page.eval('document.querySelector("#panel-fields tbody").textContent.includes("Texto de ajuda do campo 0")'));
    await page.eval('new Promise(r => { window.addEventListener("hashchange", () => setTimeout(r, 40), { once: true }); history.back(); })');
    assert.equal(await title(), manifest.workflows[7].actions[4].name);
    // Filter the review queues to one workflow.
    await go('#review?cat=design');
    const all = await page.eval('document.querySelectorAll("#main tbody tr").length');
    assert.ok(all > 100, `design queue has ${all} rows`);
    await page.eval('(() => { const s = document.getElementById("review-wf"); s.value = "wf_0003"; s.dispatchEvent(new Event("input", { bubbles: true })); })()');
    await page.eval('new Promise(r => setTimeout(r, 80))');
    const filtered = await page.eval('document.querySelectorAll("#main tbody tr").length');
    assert.ok(filtered > 0 && filtered < all, `filtered ${filtered} of ${all}`);
    assert.match(await page.eval('location.hash'), /wf=wf_0003/);
    // A review note persists across reloads and is keyed by object id.
    await page.eval('(() => { const a = document.querySelector("#main textarea[data-note-key]"); a.value = "Confirmar com o cliente"; a.dispatchEvent(new Event("input", { bubbles: true })); })()');
    const noteKey = await page.eval('document.querySelector("#main textarea[data-note-key]").dataset.noteKey');
    assert.match(noteKey, /^(workflow|group|decision|entity|form)\//);
    await page.goto(url + '#review?cat=design&wf=wf_0003');
    await page.eval('new Promise(r => setTimeout(r, 100))');
    assert.equal(await page.eval('document.querySelector("#main textarea[data-note-key]").value'), 'Confirmar com o cliente');
    // Keyboard: arrow keys move between tabs of a workflow page and update the URL.
    await go('#workflow/wf_0002');
    await page.eval('(() => { const b = document.getElementById("tab-overview"); b.focus(); b.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })); })()');
    await page.eval('new Promise(r => setTimeout(r, 40))');
    assert.equal(await page.eval('document.activeElement.id'), 'tab-flow');
    assert.match(await page.eval('location.hash'), /tab=flow/);
    assert.ok(await page.eval('document.querySelectorAll("svg.flow .node").length') >= 30, 'the flow diagram draws every action');
    assert.ok(await page.eval('document.querySelectorAll("svg.flow path[stroke-dasharray]").length') > 0, 'return branches are drawn as dashed back edges');
    assert.ok(await page.eval('document.querySelectorAll("svg.flow text").length') > 0);
    assert.equal(await page.eval('[...document.querySelectorAll("svg.flow .node text")].filter(t => t.textContent.endsWith("…")).length'), 0, 'action labels are wrapped, not truncated');
    // Deep link on a fresh load, then Back/Forward buttons.
    await page.goto(url + '#workflow/wf_0002/action/a_05?tab=x');
    await page.eval('new Promise(r => setTimeout(r, 100))');
    assert.equal(await title(), manifest.workflows[2].actions[5].name);
    assert.ok(await page.eval('document.querySelector(".crumbs").textContent.includes("Processo 0002")'));
    // Scroll position is restored when returning to a directory.
    await go('#entities');
    await page.eval('document.getElementById("main").scrollTop = 600');
    await page.eval('document.querySelector("#main tbody a").click()');
    await page.eval('new Promise(r => setTimeout(r, 40))');
    await page.eval('new Promise(r => { window.addEventListener("hashchange", () => setTimeout(r, 40), { once: true }); history.back(); })');
    assert.equal(await page.eval('document.getElementById("main").scrollTop'), 600);
    // Copy control reports through the live region.
    await go('#entity/tipo_0001');
    await page.eval('document.querySelector("#main [data-copy]").click()');
    await page.eval('new Promise(r => setTimeout(r, 100))');
    assert.ok(await page.eval('document.getElementById("live").textContent.length') > 0);
    // Narrow screen: single column, no horizontal page scroll, menu toggles the navigation.
    await page.viewport(390, 800);
    await go('#workflow/wf_0001');
    await page.eval('new Promise(r => setTimeout(r, 80))');
    assert.equal(await page.eval('getComputedStyle(document.getElementById("nav")).display'), 'none');
    assert.ok(await page.eval('document.documentElement.scrollWidth <= window.innerWidth'), 'no horizontal page scroll');
    assert.ok(await page.eval('document.getElementById("main").scrollWidth <= document.getElementById("main").clientWidth + 1'), 'content fits the narrow viewport');
    await page.eval('document.getElementById("menu").click()');
    assert.equal(await page.eval('getComputedStyle(document.getElementById("nav")).display'), 'block');
    // Print: navigation hidden, content unbounded.
    await page.viewport(1280, 900);
    await page.media('print');
    assert.equal(await page.eval('getComputedStyle(document.getElementById("nav")).display'), 'none');
    assert.equal(await page.eval('getComputedStyle(document.getElementById("main")).overflowY'), 'visible');
    await page.media('');
    // Defect 1: a trigger_workflow branch starts another workflow and continues the current one.
    await go('#workflow/wf_0005?tab=flow');
    const labels = await page.eval('[...document.querySelectorAll("svg.flow text.edge-label")].map(t => t.textContent)');
    assert.ok(labels.some(l => l.includes('Escalar') && l.includes('Aprovar')), 'the trigger branch joins the continuation edge: ' + labels.filter(l => l.includes('Escalar')).join('|'));
    assert.ok(await page.eval('[...document.querySelectorAll("svg.flow .node text")].some(t => t.textContent.startsWith("Inicia "))'), 'the started workflow is drawn as a side node');
    assert.ok(!labels.includes('Sem ramo que continue'));
    assert.ok(await page.eval('document.querySelector("svg.flow [data-href=\'#workflow/wf_0006\']") !== null'), 'the side node links to the started workflow');
    // Defect 2: field links stay on the entity page, expand the field and keep copying separate.
    await go('#entity/tipo_0002');
    await page.eval('document.querySelector("#panel-fields tbody a").click()');
    await page.eval('new Promise(r => setTimeout(r, 60))');
    assert.equal(await title(), 'Tipo 0002');
    assert.match(await page.eval('location.hash'), /^#entity\/tipo_0002\?tab=fields&field=campo_00$/);
    assert.equal(await page.eval('document.getElementById("field-campo_00").open'), true);
    assert.ok(await page.eval('document.getElementById("main").scrollTop') > 0, 'the field is brought into view inside the content pane');
    assert.equal(await page.eval('document.querySelectorAll("#panel-fields tbody a [data-copy]").length'), 0, 'copy buttons are not nested in links');
    // Defect 3: typing in the search box from another page keeps the focus in the box.
    await go('#group/grupo_0001');
    await page.eval('(() => { const i = document.getElementById("nav-search"); i.focus(); i.value = "grupo"; i.dispatchEvent(new Event("input", { bubbles: true })); })()');
    await page.eval('new Promise(r => setTimeout(r, 400))');
    assert.equal(await page.eval('document.activeElement.id'), 'nav-search');
    assert.match(await page.eval('location.hash'), /^#search\?q=grupo$/);
    await page.eval('new Promise(r => { window.addEventListener("hashchange", () => setTimeout(r, 40), { once: true }); history.back(); })');
    assert.equal(await title(), 'Grupo 0001 da área recursos_humanos');
    // Defect 4: workflow-filtered design queues include the decisions related to that workflow.
    await go('#review?cat=design&wf=wf_0003');
    assert.ok(await page.eval('[...document.querySelectorAll("#main tbody tr")].some(tr => tr.textContent.includes("Decisão"))'), 'related decisions appear in the workflow-filtered queue');
    // Defect 5: notes from another project or an unknown schema are refused; same-project conflicts are appended.
    const importFile = async json => page.eval(`(() => { const input = document.querySelector("[data-notes=import]"); const dt = new DataTransfer(); dt.items.add(new File([${JSON.stringify(JSON.stringify(json))}], "notes.json", { type: "application/json" })); input.files = dt.files; input.dispatchEvent(new Event("change", { bubbles: true })); return new Promise(r => setTimeout(r, 150)); })()`);
    await go('#review?cat=design&wf=wf_0003');
    const key = await page.eval('document.querySelector("#main textarea[data-note-key]").dataset.noteKey');
    await page.eval('(() => { const a = document.querySelector("#main textarea[data-note-key]"); a.value = "nota local"; a.dispatchEvent(new Event("input", { bubbles: true })); })()');
    await importFile({ schemaVersion: 'provia-review-notes/v1', project: 'outro', notes: [{ key, note: 'nota estrangeira' }] });
    assert.ok(await page.eval('document.getElementById("live").textContent.includes("outro projecto")'));
    assert.equal(await page.eval(`(${JSON.stringify(key)}, JSON.parse(localStorage.getItem("provia-map-notes:grande"))[${JSON.stringify(key)}])`), 'nota local');
    await importFile({ notes: [{ key, note: 'sem esquema' }] });
    assert.ok(await page.eval('document.getElementById("live").textContent.includes("inválido")'));
    await importFile({ schemaVersion: 'provia-review-notes/v1', project: 'grande', exportedAt: '2026-09-21T10:00:00Z', notes: [{ key, note: 'nota importada' }] });
    const merged = await page.eval(`JSON.parse(localStorage.getItem("provia-map-notes:grande"))[${JSON.stringify(key)}]`);
    assert.ok(merged.startsWith('nota local') && merged.includes('importado') && merged.endsWith('nota importada'), merged);
    assert.ok(await page.eval('document.getElementById("live").textContent.includes("1 em conflito")'));
    // Dependency view stays optional and scoped.
    await go('#graph');
    assert.ok(await page.eval('document.querySelector(".empty") !== null'), 'the project-wide graph is not drawn for a large project without confirmation');
    await go('#graph?wf=wf_0004');
    assert.ok(await page.eval('document.querySelectorAll("svg.graph .node").length') > 30);
    assert.deepEqual(page.errors(), []);
  } finally { await page.close(); fs.rmSync(dir, { recursive: true, force: true }); }
});
