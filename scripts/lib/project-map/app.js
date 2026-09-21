/* Offline project map: one data store, views rendered on demand from the location hash. No network, no dependencies. */
(() => {
'use strict';
const DATA = JSON.parse(document.getElementById('project-data').textContent);
const T = DATA.labels;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
const raw = s => new Raw(String(s));
const part = v => v == null || v === false ? '' : v instanceof Raw ? v.s : Array.isArray(v) ? v.map(part).join('') : esc(String(v));
function html(strings, ...values) { let out = strings[0]; for (let i = 0; i < values.length; i++) out += part(values[i]) + strings[i + 1]; return new Raw(out); }
const fmt = (template, values) => String(template).replace(/\{(\w+)\}/g, (m, k) => values[k] != null ? values[k] : m);
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const list = v => Array.isArray(v) ? v : [];
const enumLabel = (table, value) => value == null ? '' : (T.enums[table] && T.enums[table][value]) || String(value);
const isPt = String(DATA.project.language || '').toLowerCase().startsWith('pt');

/* ---------- Index: every object once, by id ---------- */
const OBJ = new Map();
const register = (id, kind, label, data, extra) => { const o = Object.assign({ id, kind, label, data }, extra || {}); OBJ.set(id, o); return o; };
const workflowsByKey = new Map(), groupsByKey = new Map(), formsByKey = new Map(), entitiesByKey = new Map(), entitiesByName = new Map(), profilesByKey = new Map(), sourcesByCode = new Map();
for (const source of DATA.sources) {
  register(source.id, 'source', source.title, source);
  sourcesByCode.set(source.code, source);
  for (const section of source.sections) register(section.id, 'section', ('§' + section.anchor + ' ' + (section.title || '')).trim(), section, { parent: source.id });
}
for (const type of DATA.entityTypes) { register(type.id, 'entity', type.name, type); entitiesByKey.set(type.key, type); entitiesByName.set(norm(type.name), type); }
for (const group of DATA.groups) { register(group.id, 'group', group.name, group); groupsByKey.set(group.key, group); }
for (const form of DATA.forms) { register(form.id, 'form', form.title || form.key, form); formsByKey.set(form.key, form); }
for (const profile of DATA.aiProfiles) { register(profile.id, 'ai', profile.name, profile); profilesByKey.set(profile.key, profile); }
for (const workflow of DATA.workflows) {
  register(workflow.id, 'workflow', workflow.name, workflow);
  workflowsByKey.set(workflow.key, workflow);
  for (const action of workflow.actions) register(action.id, 'action', action.name, action, { parent: workflow.id, workflow });
}
for (const decision of DATA.decisions) register(decision.id, 'decision', decision.code + ' ' + decision.question, decision);

const issueWorkflows = issue => issue.workflows || (issue.workflow ? [issue.workflow] : []);
const push = (map, key, value) => { if (!map.has(key)) map.set(key, []); map.get(key).push(value); };
const issuesByObject = new Map(), issuesByWorkflow = new Map();
for (const issue of DATA.issues) {
  if (issue.objectId) { if (!issuesByObject.has(issue.objectId)) issuesByObject.set(issue.objectId, []); issuesByObject.get(issue.objectId).push(issue); }
  for (const key of issueWorkflows(issue)) push(issuesByWorkflow, key, issue);
}
const entityUsedBy = new Map(), formUsedBy = new Map(), groupActions = new Map(), groupFallback = new Map(), profileActions = new Map(), refsBySource = new Map(), calledBy = new Map();
const sourceRefId = ref => ref && ref.source ? (ref.section != null ? 'source/' + ref.source + '/section/' + ref.section : 'source/' + ref.source) : null;
const noteRefs = (refs, id) => { for (const ref of list(refs)) { const target = sourceRefId(ref); if (!target) continue; push(refsBySource, target, id); if (ref.section != null) push(refsBySource, 'source/' + ref.source, id); } };
for (const workflow of DATA.workflows) {
  noteRefs(workflow.sourceRefs, workflow.id);
  for (const key of list(workflow.subWorkflowRefs)) push(calledBy, key, workflow.key);
  for (const grant of list(workflow.access && workflow.access.grants)) noteRefs(grant.sourceRefs, workflow.id);
  for (const action of workflow.actions) {
    noteRefs(action.sourceRefs, action.id);
    for (const key of list(action.entityRefs)) push(entityUsedBy, key, action.id);
    if (action.formRef) push(formUsedBy, action.formRef, action.id);
    const ref = action.assigneeRef;
    if (typeof ref === 'string') {
      if (ref.startsWith('ai:')) push(profileActions, ref.slice(3), action.id);
      else if (ref.startsWith('field:')) { if (action.assigneeFallback && action.assigneeFallback !== 'creator') push(groupFallback, action.assigneeFallback, action.id); }
      else if (!['creator', 'previous'].includes(ref)) push(groupActions, ref, action.id);
    }
  }
}
for (const group of DATA.groups) noteRefs(group.sourceRefs, group.id);
for (const decision of DATA.decisions) noteRefs(decision.sourceRefs, decision.id);
const accessOf = key => DATA.access.find(entry => entry.workflow === key) || null;
const areaOf = workflow => workflow.ownerArea || '';

/* ---------- Routing ---------- */
const main = document.getElementById('main');
const nav = document.getElementById('nav');
const live = document.getElementById('live');
const scrollMemory = new Map();
let currentHash = null;
function parseHash(hash) {
  const value = (hash || location.hash || '').replace(/^#/, '');
  const at = value.indexOf('?');
  const path = decodeURIComponent(at === -1 ? value : value.slice(0, at));
  const params = new URLSearchParams(at === -1 ? '' : value.slice(at + 1));
  return { path, params };
}
function hashFor(path, params) {
  const query = params ? [...Object.entries(params)].filter(([, v]) => v != null && v !== '').map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&') : '';
  return '#' + path + (query ? '?' + query : '');
}
function replaceParams(changes, keepFocus) {
  const { path, params } = parseHash();
  const next = Object.fromEntries(params.entries());
  Object.assign(next, changes);
  history.replaceState(null, '', hashFor(path, next));
  render({ keepScroll: true, keepFocus });
}
const href = (path, params) => hashFor(path, params);
const link = (id, text) => { const o = OBJ.get(id); return o ? html`<a href="${href(id)}">${text || o.label}</a>` : html`<code>${text || id}</code>`; };
const kindChip = kind => html`<span class="chip kind">${T.kinds[kind] || kind}</span>`;
const chip = (text, tone) => html`<span class="chip ${tone || ''}">${text}</span>`;
const prop = (label, value) => (value == null || value === '' || (Array.isArray(value) && !value.length)) ? '' : html`<dt>${label}</dt><dd>${Array.isArray(value) ? raw(value.map(part).join('<br>')) : value}</dd>`;
const sourceLinks = refs => list(refs).map(ref => { const id = sourceRefId(ref); const source = sourcesByCode.get(ref.source); const label = source ? source.title + (ref.section != null ? ' §' + ref.section : '') : ref.source + (ref.section != null ? ' §' + ref.section : ''); return id ? link(id, label) : html`<code>${label}</code>`; });
function due(d) { if (!d) return ''; const parts = []; if (d.offsetDays != null) parts.push(d.offsetDays + ' ' + (d.offsetType ? enumLabel('offsetType', d.offsetType) : 'd')); if (d.offsetHours != null) parts.push(d.offsetHours + ' h'); if (d.basis) parts.push(enumLabel('basis', d.basis)); return parts.join(' · '); }
function ownerOf(action) {
  const ref = action.assigneeRef;
  if (ref == null) return html`<span class="red">${T.fields.none}</span>`;
  if (ref === 'creator') return html`${T.enums.creator}`;
  if (ref === 'previous') return html`${T.enums.previous}`;
  if (ref.startsWith('ai:')) return link('ai/' + ref.slice(3), (profilesByKey.get(ref.slice(3)) || {}).name || ref);
  if (ref.startsWith('field:')) return html`<code>${ref}</code>${action.assigneeFallback ? html` · ${T.fields.fallback}: ${action.assigneeFallback === 'creator' ? T.enums.creator : link('group/' + action.assigneeFallback)}` : ''}`;
  return link('group/' + ref, (groupsByKey.get(ref) || {}).name || ref);
}
function copyButton(value) { const text = value == null ? '' : typeof value === 'string' ? value : JSON.stringify(value, null, 2); return html`<button type="button" data-copy="1" data-value="${text}" aria-label="${T.fields.copy}: ${text.slice(0, 40)}">${T.fields.copy}</button>`; }
function copyChip(value) { const text = value == null ? '' : typeof value === 'string' ? value : JSON.stringify(value, null, 2); return html`<span class="copy"><code>${text}</code><button type="button" data-copy="1" data-value="${text}" aria-label="${T.fields.copy}: ${text.slice(0, 40)}">${T.fields.copy}</button></span>`; }
function crumbs(items) { return html`<p class="crumbs"><a href="#">${T.misc.breadcrumbHome}</a>${items.map(item => html`<span aria-hidden="true">›</span>${item.href ? html`<a href="${item.href}">${item.label}</a>` : html`<span>${item.label}</span>`}`)}</p>`; }
const receiptChip = receipt => receipt ? chip(T.status.receiptResolved + (receipt.id ? ' · ' + receipt.id : ''), 'ok') : chip(T.status.pendingSetup, 'warn');
function issueRows(issues, options) {
  options = options || {};
  if (!issues.length) return html`<p class="empty">${T.review.none}</p>`;
  return html`<div class="scroll-x"><table><thead><tr><th>${T.review.category}</th>${options.object === false ? '' : html`<th>${T.review.object}</th>`}<th>${T.review.item}</th><th>${T.review.nextStep}</th><th>${T.review.note}</th></tr></thead><tbody>${issues.map(issue => html`<tr id="${issue.id}"><td>${chip(T.enums.category[issue.category], { blocker: 'bad', validation: issue.severity === 'error' ? 'bad' : issue.severity === 'info' ? 'info' : 'warn', design: 'info', setup: '' }[issue.category])}${issue.severity ? html` <span class="small muted">${T.enums.severity[issue.severity]}</span>` : ''}</td>${options.object === false ? '' : html`<td>${issue.objectId ? link(issue.objectId) : html`<span class="muted">—</span>`}${issue.objectId && OBJ.get(issue.objectId) ? html` <span class="small muted">${T.kinds[OBJ.get(issue.objectId).kind]}</span>` : ''}</td>`}<td>${issue.category === 'validation' ? html`<code class="small">${issue.path}</code>` : issue.kind === 'decision' ? issue.key : issue.name || (issue.objectId && OBJ.get(issue.objectId) ? OBJ.get(issue.objectId).label : '')}${issue.ref ? html` <code>${issue.ref}</code>` : ''}${issue.blocking ? html` ${chip(T.status.blocked, 'bad')}` : ''}</td><td>${issue.text}${issue.detail ? html`<br><span class="small muted">${issue.detail}</span>` : ''}${issue.owner ? html`<br><span class="small">${T.fields.owner}: ${issue.owner}</span>` : ''}</td><td><textarea class="issue-note" data-note-key="${noteKey(issue)}" aria-label="${T.review.note}" placeholder="${T.review.notePlaceholder}">${getNote(noteKey(issue))}</textarea></td></tr>`)}</tbody></table></div>`;
}

/* ---------- Review notes (browser-local, keyed by object id) ---------- */
const NOTES_KEY = 'provia-map-notes:' + DATA.project.key;
const noteKey = issue => [issue.objectId || 'project', issue.what, issue.ref || '', issue.path || ''].join('|');
function loadNotes() { try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}') || {}; } catch { return {}; } }
function saveNotes(notes) { try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); return true; } catch { return false; } }
const getNote = key => { const notes = loadNotes(); return typeof notes[key] === 'string' ? notes[key] : ''; };
function download(name, text, type) { const blob = new Blob([text], { type: type || 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function exportNotes(markdown) {
  const notes = loadNotes();
  const entries = Object.entries(notes).filter(([, note]) => typeof note === 'string' && note.trim()).map(([key, note]) => { const [objectId, what, ref, path] = key.split('|'); const o = OBJ.get(objectId); return { key, objectId, object: o ? o.label : objectId, kind: o ? o.kind : null, item: what, ref: ref || null, path: path || null, note }; });
  if (!entries.length) { toast(T.review.noNotes); return; }
  const stamp = new Date().toISOString();
  if (markdown) {
    const lines = ['# ' + DATA.project.title + ': ' + T.review.notes, '', T.misc.generatedFrom + ' · ' + (DATA.project.updatedAt || '') + ' · ' + stamp, '', T.review.notIncorporated, ''];
    for (const entry of entries) lines.push('## ' + entry.object + ' (`' + entry.objectId + '`)', '', '- ' + T.review.item + ': `' + entry.item + '`' + (entry.ref ? ' `' + entry.ref + '`' : '') + (entry.path ? ' `' + entry.path + '`' : ''), '', entry.note, '');
    download('review-notes-' + DATA.project.key + '.md', lines.join('\n'), 'text/markdown');
  } else download('review-notes-' + DATA.project.key + '.json', JSON.stringify({ schemaVersion: 'provia-review-notes/v1', project: DATA.project.key, title: DATA.project.title, manifestUpdatedAt: DATA.project.updatedAt || null, exportedAt: stamp, incorporated: false, notes: entries }, null, 2));
}
function importNotes(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let parsed = null;
    try { parsed = JSON.parse(String(reader.result)); } catch { parsed = null; }
    if (!parsed || parsed.schemaVersion !== 'provia-review-notes/v1' || !Array.isArray(parsed.notes)) { toast(T.review.importInvalid); return; }
    if (parsed.project !== DATA.project.key) { toast(fmt(T.review.importOtherProject, { p: parsed.project || '?' })); return; }
    const notes = loadNotes();
    let added = 0, conflicts = 0;
    for (const entry of parsed.notes) {
      if (!entry || typeof entry.key !== 'string' || typeof entry.note !== 'string') continue;
      const current = typeof notes[entry.key] === 'string' ? notes[entry.key] : '';
      if (current.trim() === entry.note.trim()) continue;
      if (!current.trim()) { notes[entry.key] = entry.note; added += 1; }
      else { notes[entry.key] = current + '\n--- ' + T.review.importedMarker + ' ' + (parsed.exportedAt || '') + ' ---\n' + entry.note; conflicts += 1; }
    }
    if (!saveNotes(notes)) { toast(T.review.saveFailed); return; }
    toast(fmt(T.review.imported, { n: added, m: conflicts }));
    render({ keepScroll: true });
  };
  reader.onerror = () => toast(T.review.importInvalid);
  reader.readAsText(file);
}
let toastTimer = null;
function toast(text) { live.textContent = text; live.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => live.classList.remove('show'), 1800); }

/* ---------- Five-part brief ---------- */
const BRIEF = [['task', /^(tarefa|task)\s*:/i], ['how', /^(como|how)\s*:/i], ['evidence', /^(evid[êe]ncia|evidence)\s*:/i], ['done', /^(conclu[íi]do quando|done when)\s*:/i], ['exceptions', /^(excep[çc][õo]es|exce[çc][õo]es|exceptions)\s*:/i]];
function parseBrief(description) {
  if (!description) return null;
  const parts = []; let current = null;
  for (const line of String(description).split(/\r?\n/)) {
    const hit = BRIEF.find(([, re]) => re.test(line.trim()));
    if (hit) { current = { key: hit[0], text: line.trim().replace(hit[1], '').trim() }; parts.push(current); }
    else if (current) current.text += (current.text ? '\n' : '') + line;
    else if (line.trim()) { current = { key: null, text: line.trim() }; parts.push(current); }
  }
  return parts.length ? parts : null;
}
function briefHtml(description) {
  const parts = parseBrief(description);
  if (!parts) return html`<p class="muted">${T.fields.none}</p>`;
  return parts.map(p => {
    const steps = p.key === 'how' ? p.text.split(/(?:^|\s)(?=\d{1,2}\.\s)/).map(s => s.trim()).filter(Boolean) : null;
    const body = steps && steps.length > 1 && steps.every(s => /^\d{1,2}\.\s/.test(s)) ? html`<ol class="brief">${steps.map(s => html`<li>${s.replace(/^\d{1,2}\.\s/, '')}</li>`)}</ol>` : html`<p>${p.text}</p>`;
    return html`<div class="brief-part">${p.key ? html`<div class="k">${T.fields.brief[p.key]}</div>` : ''}${body}</div>`;
  });
}
const exceptionsOf = action => { const parts = parseBrief(action.yaml && action.yaml.description) || parseBrief(action.description); const p = parts && parts.find(x => x.key === 'exceptions'); return p ? p.text : null; };

/* ---------- Views ---------- */
function statusCards(workflow) {
  const r = workflow.review;
  const validation = r.validation.errors ? chip(fmt(T.status.validationErrors, { n: r.validation.errors }), 'bad') : r.validation.warnings ? chip(fmt(T.status.validationWarnings, { n: r.validation.warnings }), 'warn') : chip(T.status.validationOk, 'ok');
  const approval = r.decisions.open ? chip(fmt(T.status.decisionsOpen, { n: r.decisions.open }), 'warn') : chip(T.status.decisionsNone, 'ok');
  const evidence = r.evidence.readinessBlocked ? chip(T.status.blocked, 'bad') : r.evidence.receipt ? chip(T.status.applied + ' · ' + (r.evidence.receipt.id || ''), 'ok') : chip(T.status.notApplied, '');
  return html`<div class="status-row">
    <div class="card"><div class="k">${T.status.design}</div><div class="v">${chip(T.status.workflow[r.design] || r.design, r.design === 'validated' || r.design === 'imported' ? 'ok' : 'info')} ${r.designOpen ? chip(fmt(T.status.designOpen, { n: r.designOpen }), 'warn') : ''}</div></div>
    <div class="card"><div class="k">${T.status.validation}</div><div class="v">${validation} ${r.validation.infos ? html`<span class="small muted">${fmt(T.status.validationInfos, { n: r.validation.infos })}</span>` : ''}</div></div>
    <div class="card"><div class="k">${T.status.approval}</div><div class="v">${approval}</div></div>
    <div class="card"><div class="k">${T.status.application}</div><div class="v">${evidence} ${r.evidence.accessApplied === true ? chip(T.status.accessApplied, 'ok') : r.evidence.accessApplied === false ? chip(T.status.accessPending, '') : ''}${r.blockers ? html` ${chip(r.blockers + ' × ' + T.enums.category.blocker, 'bad')}` : ''}</div></div>
  </div>`;
}
const workflowGroups = workflow => { const keys = new Set(); for (const action of workflow.actions) { const ref = action.assigneeRef; if (typeof ref === 'string' && !ref.includes(':') && !['creator', 'previous'].includes(ref)) keys.add(ref); if (typeof ref === 'string' && ref.startsWith('field:') && workflow && action.assigneeFallback && action.assigneeFallback !== 'creator') keys.add(action.assigneeFallback); } return [...keys]; };

function viewOverview() {
  const areas = new Map();
  for (const workflow of DATA.workflows) push(areas, areaOf(workflow), workflow);
  const counts = { design: 0, validation: 0, setup: 0, blocker: 0 };
  for (const issue of DATA.issues) counts[issue.category] += 1;
  const actions = DATA.workflows.reduce((n, w) => n + w.actions.length, 0);
  const cards = [['workflows', DATA.workflows.length, T.nav.workflows], ['entities', DATA.entityTypes.length, T.nav.entities], ['forms', DATA.forms.length, T.nav.forms], ['groups', DATA.groups.length, T.nav.groups], ['sources', DATA.sources.length, T.nav.sources], ['profiles', DATA.aiProfiles.length, T.nav.profiles], ['decisions', DATA.decisions.length, T.nav.decisions]];
  return html`${crumbs([{ label: T.overview.title }])}<h2 id="view-title" tabindex="-1">${T.overview.title}</h2><p class="lead">${DATA.organization.name ? DATA.organization.name + ' · ' : ''}${DATA.project.country} · ${DATA.project.language}${DATA.project.timezone ? ' · ' + DATA.project.timezone : ''}. ${actions} ${T.overview.actions}.</p>
  <h3>${T.overview.workflowsByArea}</h3>
  ${DATA.workflows.length ? [...areas.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([area, workflows]) => html`<h4>${area || T.nav.noArea}</h4><div class="scroll-x"><table><thead><tr><th>${T.overview.workflow}</th><th>${T.overview.owners}</th><th>${T.status.design}</th><th>${T.status.validation}</th><th>${T.overview.decisions}</th><th>${T.enums.category.setup}</th><th>${T.overview.evidence}</th></tr></thead><tbody>${workflows.map(workflow => { const r = workflow.review; return html`<tr><td>${link(workflow.id)}<br><span class="small muted">${workflow.prefix ? workflow.prefix + ' · ' : ''}${workflow.actions.length} ${T.overview.actions}</span></td><td>${workflowGroups(workflow).map(key => link('group/' + key)).reduce((acc, item, i) => acc.concat(i ? [raw(', '), item] : [item]), [])}</td><td>${chip(T.status.workflow[r.design] || r.design, r.design === 'validated' || r.design === 'imported' ? 'ok' : 'info')}${r.designOpen ? html`<br>${chip(fmt(T.status.designOpen, { n: r.designOpen }), 'warn')}` : ''}</td><td>${r.validation.errors ? chip(fmt(T.status.validationErrors, { n: r.validation.errors }), 'bad') : r.validation.warnings ? chip(fmt(T.status.validationWarnings, { n: r.validation.warnings }), 'warn') : chip(T.status.validationOk, 'ok')}</td><td class="num">${r.decisions.open ? html`<a href="${href('review', { cat: 'design', wf: workflow.key })}">${r.decisions.open}</a>` : '0'}</td><td class="num">${r.setup ? html`<a href="${href('review', { cat: 'setup', wf: workflow.key })}">${r.setup}</a>` : '0'}</td><td>${r.evidence.readinessBlocked ? chip(T.status.blocked, 'bad') : r.evidence.receipt ? chip(T.status.applied, 'ok') : chip(T.status.notApplied, '')}</td></tr>`; })}</tbody></table></div>`) : html`<p class="empty">${T.overview.noWorkflows}</p>`}
  <h3>${T.overview.directories}</h3><div class="cards">${cards.map(([route, n, label]) => html`<div class="card"><a href="#${route}"><div class="n">${n}</div><div class="t">${label}</div></a></div>`)}</div>
  <h3>${T.overview.queues}</h3><div class="cards">${['blocker', 'design', 'validation', 'setup'].map(cat => html`<div class="card"><a href="${href('review', { cat })}"><div class="n ${cat === 'blocker' && counts[cat] ? 'red' : ''}">${counts[cat]}</div><div class="t">${T.enums.category[cat]}</div></a></div>`)}</div>
  <p class="small muted">${T.header.notice}</p>`;
}

function directory(route, title, items, columns, filterKey) {
  const { params } = parseHash();
  const q = norm(params.get('q') || '');
  const shown = q ? items.filter(item => norm(filterKey(item)).includes(q)) : items;
  return html`${crumbs([{ label: title }])}<h2 id="view-title" tabindex="-1">${title} <span class="chip">${items.length}</span></h2>
  <div class="toolbar"><label for="dir-filter">${T.directory.filter}</label><input id="dir-filter" type="search" data-param="q" value="${params.get('q') || ''}"><span class="small muted">${q ? fmt(T.review.filtered, { n: shown.length, m: items.length }) : ''}</span></div>
  ${shown.length ? html`<div class="scroll-x"><table><thead><tr>${columns.map(c => html`<th>${c[0]}</th>`)}</tr></thead><tbody>${shown.map(item => html`<tr>${columns.map(c => html`<td>${c[1](item)}</td>`)}</tr>`)}</tbody></table></div>` : html`<p class="empty">${T.directory.empty}</p>`}`;
}
const viewWorkflows = () => directory('workflows', T.directory.workflows, DATA.workflows, [[T.fields.name, w => link(w.id)], [T.fields.prefix, w => w.prefix || ''], [T.fields.area, w => areaOf(w) || T.nav.noArea], [T.overview.actions, w => w.actions.length], [T.status.design, w => T.status.workflow[w.review.design] || w.review.design], [T.overview.decisions, w => w.review.decisions.open], [T.overview.evidence, w => w.review.evidence.receipt ? T.status.applied : T.status.notApplied]], w => w.name + ' ' + w.key + ' ' + (w.prefix || '') + ' ' + areaOf(w));
const viewEntities = () => directory('entities', T.directory.entities, DATA.entityTypes, [[T.fields.name, t => link(t.id)], [T.fields.key, t => html`<code>${t.key}</code>`], [T.fields.fieldsCount, t => list(t.fields).length], [T.fields.owner, t => t.owner || ''], [T.fields.usedBy, t => (entityUsedBy.get(t.key) || []).length], [T.fields.status, t => receiptChip(t.receipt)]], t => t.name + ' ' + t.key + ' ' + (t.description || '') + ' ' + list(t.fields).map(f => f.key + ' ' + f.label).join(' '));
const viewForms = () => directory('forms', T.directory.forms, DATA.forms, [[T.fields.title, f => link(f.id)], [T.fields.kind, f => T.enums.formKind[f.kind] || f.kind], [T.fields.workflow, f => link('workflow/' + f.workflowRef)], [T.fields.action, f => f.actionRef ? link('workflow/' + f.workflowRef + '/action/' + f.actionRef) : ''], [T.fields.fieldsCount, f => list(f.fields).length], [T.fields.status, f => (T.status.form[f.status] || f.status || '') + ' · ' + (f.receipt ? T.status.receiptResolved : T.status.pendingSetup)]], f => (f.title || '') + ' ' + f.key + ' ' + list(f.fields).map(x => (x.key || x.name || '') + ' ' + (x.label || '')).join(' '));
const viewGroups = () => directory('groups', T.directory.groups, DATA.groups, [[T.fields.name, g => link(g.id)], [T.fields.key, g => html`<code>${g.key}</code>`], [T.fields.kind, g => T.enums.groupKind[g.kind] || g.kind || ''], [T.fields.area, g => g.area || ''], [T.fields.parent, g => g.parentKey ? link('group/' + g.parentKey) : ''], [T.fields.members, g => list(g.members).length], [T.fields.assignedActions, g => (groupActions.get(g.key) || []).length], [T.fields.status, g => receiptChip(g.receipt)]], g => g.name + ' ' + g.key + ' ' + (g.purpose || '') + ' ' + list(g.members).map(m => (m.role || '') + ' ' + (m.email || '')).join(' '));
const viewSources = () => directory('sources', T.directory.sources, DATA.sources, [[T.fields.title, s => link(s.id)], [T.fields.kind, s => T.enums.sourceKind[s.kind] || s.kind], [T.fields.version, s => s.version || ''], [T.fields.effectiveDate, s => s.effectiveDate || ''], [T.fields.sections, s => s.sections.length], [T.fields.referencedBy, s => (refsBySource.get(s.id) || []).length]], s => s.title + ' ' + s.code + ' ' + s.sections.map(x => x.anchor + ' ' + (x.title || '')).join(' '));
const viewProfiles = () => directory('profiles', T.directory.profiles, DATA.aiProfiles, [[T.fields.name, p => link(p.id)], [T.fields.key, p => html`<code>${p.key}</code>`], [T.fields.workflow, p => p.workflowRef ? link('workflow/' + p.workflowRef) : ''], [T.fields.action, p => p.workflowRef && p.actionRef ? link('workflow/' + p.workflowRef + '/action/' + p.actionRef) : ''], [T.fields.purpose, p => p.purpose || '']], p => p.name + ' ' + p.key + ' ' + (p.purpose || ''));
const viewDecisions = () => directory('decisions', T.directory.decisions, DATA.decisions, [[T.fields.code, d => link(d.id, d.code)], [T.fields.question, d => d.question], [T.fields.status, d => chip(d.status === 'open' ? T.status.open : T.status.resolved, d.status === 'open' ? 'warn' : 'ok')], [T.fields.owner, d => d.owner || ''], [T.fields.related, d => d.related.map(key => link('workflow/' + key))], [T.fields.sources, d => sourceLinks(d.sourceRefs)]], d => d.code + ' ' + d.question + ' ' + (d.owner || '') + ' ' + (d.resolution || ''));

function tabs(id, items, active) {
  return html`<div class="tabs" role="tablist" aria-label="${id}">${items.map(([key, label, count]) => html`<button type="button" role="tab" id="tab-${key}" aria-selected="${key === active}" aria-controls="panel-${key}" data-tab="${key}" tabindex="${key === active ? 0 : -1}">${label}${count != null ? html` <span class="chip">${count}</span>` : ''}</button>`)}</div>`;
}

function viewWorkflow(workflow) {
  const { params } = parseHash();
  const tab = params.get('tab') || 'overview';
  const issues = issuesByWorkflow.get(workflow.key) || [];
  const related = DATA.decisions.filter(decision => decision.related.includes(workflow.key));
  const entry = accessOf(workflow.key);
  const groups = workflowGroups(workflow);
  const forms = DATA.forms.filter(form => form.workflowRef === workflow.key);
  const entities = [...new Set(workflow.actions.flatMap(action => list(action.entityRefs)))];
  const exceptions = workflow.actions.map(action => ({ action, text: exceptionsOf(action) })).filter(item => item.text);
  const yaml = workflow.yaml || { present: false, reason: 'none' };
  const head = html`${crumbs([{ label: T.nav.workflows, href: '#workflows' }, { label: workflow.name }])}<h2 id="view-title" tabindex="-1">${workflow.name}</h2>
  <div class="chips">${kindChip('workflow')}${workflow.prefix ? chip(workflow.prefix) : ''}${chip((T.fields.area) + ': ' + (areaOf(workflow) || T.nav.noArea))}${entry && entry.sensitivity ? chip(T.fields.sensitivity + ': ' + enumLabel('sensitivity', entry.sensitivity)) : ''}${workflow.file ? chip(workflow.file) : ''}</div>
  ${statusCards(workflow)}
  ${tabs('workflow', [['overview', T.tabs.overview], ['flow', T.tabs.flow, workflow.actions.length], ['dependencies', T.tabs.dependencies], ['access', T.tabs.access], ['review', T.tabs.review, issues.length]], tab)}`;
  let body;
  if (tab === 'flow') body = html`<section id="panel-flow" role="tabpanel" aria-labelledby="tab-flow"><h3>${T.flow.title}</h3>${!yaml.present ? html`<p class="lead">${yaml.reason === 'broken' ? T.fields.brokenYaml : T.fields.noYaml}</p>` : ''}<div class="flow-wrap">${raw(flowSvg(workflow))}</div><p class="legend">${yaml.present ? T.flow.legend : T.flow.manifestOnly}</p>
    <h3>${T.kindsPlural.action}</h3><ol class="actions-list">${workflow.actions.map(action => html`<li class="${action.yaml && action.yaml.executionMode === 'parallel' ? 'parallel' : ''}"><h4>${link(action.id)}</h4><div class="row"><span>${enumLabel('actionType', action.type)}</span><span>${T.fields.owner}: ${ownerOf(action)}</span>${action.due ? html`<span>${T.fields.due}: ${due(action.due)}</span>` : html`<span class="muted">${T.fields.dueUnset}</span>`}${action.formRef ? html`<span>${T.fields.form}: ${link('form/' + action.formRef)}</span>` : ''}${list(action.entityRefs).length ? html`<span>${T.fields.entities}: ${list(action.entityRefs).map((key, i) => html`${i ? ', ' : ''}${link('entity/' + key)}`)}</span>` : ''}${action.yaml && action.yaml.executionMode === 'parallel' ? chip(T.flow.parallel, 'info') : ''}</div>${action.yaml && list(action.yaml.config && action.yaml.config.branches).length ? html`<div class="row">${list(action.yaml.config.branches).map(branch => html`<span>${branch.label} → ${enumLabel('outcome', branch.outcome || 'continue')}${branch.outcome === 'trigger_workflow' ? html` <span class="muted">(${T.flow.andContinues})</span>` : ''}${branch.target ? html` ${link('workflow/' + workflow.key + '/action/' + branch.target, branch.target)}` : ''}${branch.workflow ? html` ${workflowsByKey.has(branch.workflow) ? link('workflow/' + branch.workflow) : html`<code>${branch.workflow}</code>`}` : ''}${branch.requiresComment ? html` <span class="muted">(${T.fields.requiresComment.toLowerCase()})</span>` : ''}</span>`)}</div>` : ''}</li>`)}</ol></section>`;
  else if (tab === 'dependencies') body = html`<section id="panel-dependencies" role="tabpanel" aria-labelledby="tab-dependencies"><h3>${T.graph.title}</h3><p class="lead">${T.graph.intro}</p><div class="graph-wrap">${raw(graphSvg(workflow.key))}</div><p class="small"><a href="${href('graph', { wf: workflow.key })}">${T.nav.graph} →</a></p></section>`;
  else if (tab === 'access') body = html`<section id="panel-access" role="tabpanel" aria-labelledby="tab-access"><h3>${T.access.title}</h3><p class="lead">${T.access.intro}</p>${accessTable(entry ? [entry] : [])}</section>`;
  else if (tab === 'review') body = html`<section id="panel-review" role="tabpanel" aria-labelledby="tab-review"><h3>${T.review.title}</h3>${issueRows(issues)}${related.some(d => d.status === 'resolved') ? html`<h3>${T.review.decisionsTitle}</h3><ul class="plain">${related.filter(d => d.status === 'resolved').map(decision => html`<li>${chip(decision.status === 'open' ? T.status.open : T.status.resolved, decision.status === 'open' ? 'warn' : 'ok')} ${link(decision.id)}${decision.owner ? html` <span class="small muted">· ${T.fields.owner}: ${decision.owner}</span>` : ''}</li>`)}</ul>` : ''}</section>`;
  else body = html`<section id="panel-overview" role="tabpanel" aria-labelledby="tab-overview"><div class="two"><div>
    ${yaml.present && yaml.metadata && yaml.metadata.description ? html`<h3>${T.fields.purposeOfWorkflow}</h3><p>${yaml.metadata.description}</p>` : ''}
    <h3>${T.fields.trigger}</h3>${list(workflow.triggers).length || (yaml.present && yaml.triggers.length) ? html`<ul class="plain">${(list(workflow.triggers).length ? workflow.triggers : yaml.triggers).map(trigger => html`<li>${enumLabel('triggerType', trigger.type)}${trigger.label ? ' · ' + trigger.label : ''}${trigger.enabled === false ? html` <span class="muted">(off)</span>` : ''}${trigger.manual && (list(trigger.manual.allowedGroups).length || list(trigger.manual.allowedUsers).length) ? html`<br><span class="small">${T.access.allowlist}: ${list(trigger.manual.allowedGroups).map((key, i) => html`${i ? ', ' : ''}${link('group/' + key)}`)}${list(trigger.manual.allowedUsers).map(email => html`, ${email}`)}</span>` : ''}</li>`)}</ul>` : html`<p class="muted">${T.fields.none}</p>`}
    <h3>${T.fields.responsibleGroups}</h3>${groups.length ? html`<ul class="plain">${groups.map(key => html`<li>${link('group/' + key)} <span class="small muted">· ${(groupActions.get(key) || []).filter(id => id.startsWith(workflow.id + '/')).length + (groupFallback.get(key) || []).filter(id => id.startsWith(workflow.id + '/')).length} ${T.overview.actions}</span></li>`)}</ul>` : html`<p class="muted">${T.fields.none}</p>`}
    <h3>${T.fields.linkedForms}</h3>${forms.length ? html`<ul class="plain">${forms.map(form => html`<li>${link(form.id)} <span class="small muted">· ${T.enums.formKind[form.kind]}${form.actionRef ? html` · ${link(workflow.id + '/action/' + form.actionRef)}` : ''}</span></li>`)}</ul>` : html`<p class="muted">${T.fields.none}</p>`}
    <h3>${T.fields.linkedEntities}</h3>${entities.length ? html`<ul class="plain">${entities.map(key => html`<li>${link('entity/' + key)}</li>`)}</ul>` : html`<p class="muted">${T.fields.none}</p>`}
    ${list(workflow.subWorkflowRefs).length ? html`<h3>${T.fields.subWorkflows}</h3><ul class="plain">${workflow.subWorkflowRefs.map(key => html`<li>${link('workflow/' + key)}</li>`)}</ul>` : ''}
    ${(calledBy.get(workflow.key) || []).length ? html`<h3>${T.fields.calledBy}</h3><ul class="plain">${calledBy.get(workflow.key).map(key => html`<li>${link('workflow/' + key)}</li>`)}</ul>` : ''}
    </div><div>
    <h3>${T.fields.sources}</h3>${list(workflow.sourceRefs).length ? html`<ul class="plain">${sourceLinks(workflow.sourceRefs).map(item => html`<li>${item}</li>`)}</ul>` : html`<p class="muted">${T.fields.none}</p>`}
    ${yaml.present && yaml.fields.length ? html`<h3>${T.fields.caseFields}</h3><div class="scroll-x"><table><thead><tr><th>${T.fields.key}</th><th>${T.fields.label}</th><th>${T.fields.type}</th><th>${T.fields.required}</th></tr></thead><tbody>${yaml.fields.map(field => html`<tr><td><code>${field.name}</code></td><td>${field.label || ''}</td><td>${field.type}</td><td>${field.required ? T.fields.yes : T.fields.no}</td></tr>`)}</tbody></table></div>` : ''}
    ${list(workflow.templates).length ? html`<h3>${T.fields.templates}</h3><ul class="plain">${workflow.templates.map(t => html`<li><code>${t.code}</code> ${t.title}${t.scope ? html` <span class="small muted">(${t.scope})</span>` : ''}</li>`)}</ul>` : ''}
    ${list(workflow.setupNotes).length ? html`<h3>${T.fields.setupNotes}</h3><ul>${workflow.setupNotes.map(note => html`<li>${note}</li>`)}</ul>` : ''}
    ${list(workflow.unresolvedActors).length ? html`<h3>${T.fields.unresolvedActors}</h3><ul class="plain">${workflow.unresolvedActors.map(item => html`<li><code>${typeof item === 'string' ? item : item.key || item.name}</code></li>`)}</ul>` : ''}
    ${list(workflow.unresolvedEntityTypes).length ? html`<h3>${T.fields.unresolvedEntityTypes}</h3><ul class="plain">${workflow.unresolvedEntityTypes.map(item => html`<li><code>${typeof item === 'string' ? item : item.key || item.name}</code></li>`)}</ul>` : ''}
    </div></div>
    ${exceptions.length ? html`<h3>${T.fields.exceptions}</h3><ul>${exceptions.map(item => html`<li><strong>${link(item.action.id)}</strong>: ${item.text}</li>`)}</ul>` : ''}
    ${related.filter(d => d.status === 'open').length ? html`<h3>${T.fields.openQuestions}</h3><ul class="plain">${related.filter(d => d.status === 'open').map(decision => html`<li>${link(decision.id)}${decision.owner ? html` <span class="small muted">· ${T.fields.owner}: ${decision.owner}</span>` : ''}</li>`)}</ul>` : ''}
    </section>`;
  return html`${head}${body}`;
}

function viewAction(action, workflow) {
  const y = action.yaml || null;
  const index = action.index;
  const previous = workflow.actions[index - 1], next = workflow.actions[index + 1];
  const issues = issuesByObject.get(action.id) || [];
  const branches = y && y.config ? list(y.config.branches) : [];
  const config = y && y.config ? Object.fromEntries(Object.entries(y.config).filter(([k]) => k !== 'branches')) : null;
  return html`${crumbs([{ label: T.nav.workflows, href: '#workflows' }, { label: workflow.name, href: '#' + workflow.id }, { label: action.name }])}<h2 id="view-title" tabindex="-1">${action.name}</h2>
  <div class="chips">${kindChip('action')}${chip(enumLabel('actionType', action.type))}${chip(T.fields.position + ' ' + (index + 1) + ' ' + T.fields.of + ' ' + workflow.actions.length)}${y && y.executionMode === 'parallel' ? chip(T.flow.parallel, 'info') : ''}${y && y.priority ? chip(enumLabel('priority', y.priority)) : ''}${issues.some(i => i.blocking) ? chip(T.status.blocked, 'bad') : ''}</div>
  <div class="two"><div>
  <h3>${T.fields.instructions}</h3>${briefHtml((y && y.description) || action.description)}
  </div><div>
  <dl class="props">
  ${prop(T.fields.owner, ownerOf(action))}
  ${y && y.assignee ? prop(T.fields.assignee, enumLabel('assigneeType', y.assignee.type) + (y.assignee.id ? ' ' + y.assignee.id : '')) : ''}
  ${y && y.aiWorker ? prop(T.fields.aiWorker, JSON.stringify(y.aiWorker)) : ''}
  ${prop(T.fields.due, action.due ? due(action.due) : y && y.due ? due(y.due) : html`<span class="muted">${T.fields.dueUnset}</span>`)}
  ${action.dueInSource ? prop(T.fields.dueInSource, action.dueInSource.kind + ': ' + action.dueInSource.text) : ''}
  ${prop(T.fields.form, action.formRef ? link('form/' + action.formRef) : null)}
  ${prop(T.fields.entities, list(action.entityRefs).map(key => link('entity/' + key)))}
  ${prop(T.fields.evidence, list(action.evidence))}
  ${prop(T.fields.sources, sourceLinks(action.sourceRefs))}
  ${prop(T.fields.folded, list(action.folded).map(f => (f.section ? '§' + f.section + ' ' : '') + f.summary))}
  ${y ? prop(T.fields.requiredAction, y.required === false ? T.fields.no : T.fields.yes) : ''}
  ${y ? prop(T.fields.executionMode, enumLabel('executionMode', y.executionMode)) : ''}
  </dl>
  ${branches.length ? html`<h3>${T.fields.branches}</h3><div class="scroll-x"><table><thead><tr><th>${T.fields.label}</th><th>${T.fields.outcome}</th><th>${T.fields.targetAction}</th><th>${T.fields.requiresComment}</th></tr></thead><tbody>${branches.map(branch => html`<tr><td>${branch.label}</td><td>${enumLabel('outcome', branch.outcome || 'continue')}</td><td>${branch.target ? link(workflow.id + '/action/' + branch.target, branch.target) : branch.workflow ? (workflowsByKey.has(branch.workflow) ? link('workflow/' + branch.workflow) : html`<code>${branch.workflow}</code>`) : ''}</td><td>${branch.requiresComment ? T.fields.yes : T.fields.no}</td></tr>`)}</tbody></table></div>` : ''}
  ${config && Object.keys(config).length ? html`<details class="tech"><summary>${T.fields.config}</summary><pre>${JSON.stringify(config, null, 2)}</pre></details>` : ''}
  </div></div>
  ${issues.length ? html`<h3>${T.review.title}</h3>${issueRows(issues, { object: false })}` : ''}
  <div class="pager"><span>${previous ? html`← ${link(previous.id)}` : ''}</span><span>${next ? html`${link(next.id)} →` : ''}</span></div>`;
}

const fieldKey = field => field.key || field.name || '';
const fieldLabel = field => field.label || field.key || field.name || '';
function viewEntity(type) {
  const { params } = parseHash();
  const tab = params.get('tab') || 'fields';
  const focusField = params.get('field') || '';
  const fields = list(type.fields);
  const outbound = fields.filter(field => field.targetType).map(field => ({ field, target: entitiesByKey.get(field.targetType) || entitiesByName.get(norm(field.targetType)) || null }));
  const inbound = DATA.entityTypes.filter(other => other.key !== type.key && list(other.fields).some(field => field.targetType && (field.targetType === type.key || norm(field.targetType) === norm(type.name)))).map(other => ({ other, fields: list(other.fields).filter(field => field.targetType && (field.targetType === type.key || norm(field.targetType) === norm(type.name))) }));
  const users = entityUsedBy.get(type.key) || [];
  const issues = issuesByObject.get(type.id) || [];
  let body;
  if (tab === 'relationships') body = html`<section id="panel-relationships" role="tabpanel"><h3>${T.fields.relationships}</h3>${outbound.length ? html`<ul class="plain">${outbound.map(({ field, target }) => html`<li><code>${field.key}</code> ${fieldLabel(field)} → ${target ? link(target.id) : html`<code>${field.targetType}</code>`}</li>`)}</ul>` : html`<p class="muted">${T.fields.none}</p>`}
    ${inbound.length ? html`<h3>${T.fields.referencedBy}</h3><ul class="plain">${inbound.map(({ other, fields: f }) => html`<li>${link(other.id)} <span class="small muted">(${f.map(x => x.key).join(', ')})</span></li>`)}</ul>` : ''}
    <h3>${T.fields.usedBy}</h3>${users.length ? html`<ul class="plain">${users.map(id => html`<li>${link(id)} <span class="small muted">· ${OBJ.get(id).workflow.name}</span></li>`)}</ul>` : html`<p class="muted">${T.fields.none}</p>`}</section>`;
  else if (tab === 'json') body = html`<section id="panel-json" role="tabpanel"><h3>${T.fields.jsonOf}</h3><p><button type="button" data-copy="1" data-value="${JSON.stringify(stripMeta(type), null, 2)}">${T.fields.copy}</button> <button type="button" data-download="${type.key}.json" data-value="${JSON.stringify(stripMeta(type), null, 2)}">${T.fields.downloadJson}</button></p><pre>${JSON.stringify(stripMeta(type), null, 2)}</pre></section>`;
  else body = html`<section id="panel-fields" role="tabpanel"><h3>${T.fields.fieldsCount} <span class="chip">${fields.length}</span></h3>
    <div class="scroll-x"><table><thead><tr><th>${T.fields.key}</th><th>${T.fields.label}</th><th>${T.fields.type}</th><th>${T.fields.required}</th><th>${T.fields.group}</th><th>${T.fields.priority}</th><th>${T.fields.helpText}</th></tr></thead><tbody>${fields.map(field => html`<tr><td><a href="${href(type.id, { tab: 'fields', field: field.key })}"><code>${field.key}</code></a> ${copyButton(field.key)}</td><td>${field.label}</td><td>${field.type}${field.targetType ? html` → ${(entitiesByKey.get(field.targetType) || entitiesByName.get(norm(field.targetType))) ? link((entitiesByKey.get(field.targetType) || entitiesByName.get(norm(field.targetType))).id) : field.targetType}` : ''}</td><td>${field.required ? T.fields.yes : T.fields.no}</td><td>${field.group || ''}</td><td>${field.priority || ''}</td><td>${field.helpText || ''}</td></tr>`)}</tbody></table></div>
    <h3>${T.fields.technical}</h3>${fields.map(field => html`<details class="tech" id="field-${field.key}" ${field.key === focusField ? 'open' : ''}><summary>${field.label} <code>${field.key}</code> · ${field.type}</summary><dl class="props">${prop(T.fields.key, copyChip(field.key))}${prop(T.fields.label, copyChip(field.label))}${prop(T.fields.type, copyChip(field.type))}${prop(T.fields.group, field.group ? copyChip(field.group) : null)}${prop(T.fields.helpText, field.helpText ? copyChip(field.helpText) : null)}${prop(T.fields.example, field.example != null ? copyChip(field.example) : null)}${Object.hasOwn(field, 'defaultValue') ? prop(T.fields.defaultValue, copyChip(field.defaultValue)) : ''}${prop(T.fields.target, field.targetType ? copyChip(field.targetType) : null)}${prop(T.fields.purpose, field.purpose)}${prop(T.fields.source, field.source)}${prop(T.fields.maintainer, field.maintainer)}${prop(T.fields.sensitivity, field.sensitivity)}${field.config ? prop(T.fields.config, Object.entries(field.config).map(([k, v]) => html`<span>config.${k}: ${copyChip(v)}</span>`)) : ''}${list(field.options).length ? prop(T.fields.options, list(field.options).map(option => html`<span>${copyChip(option.value)} → ${copyChip(option.label)}${Object.hasOwn(option, 'parentValue') ? html` <span class="small muted">(parent: ${option.parentValue})</span>` : ''}</span>`)) : ''}</dl></details>`)}
    ${list(type.coverage).length ? html`<h3>${T.fields.coverage}</h3><ul>${type.coverage.map(entry => html`<li><strong>${entry.dimension}</strong>: ${entry.decision}. ${entry.reason}</li>`)}</ul>` : ''}
    ${list(type.setup).length ? html`<h3>${T.fields.setup}</h3><ul>${type.setup.map(x => html`<li>${x}</li>`)}</ul>` : ''}
    ${list(type.readiness).length ? html`<h3>${T.fields.readiness}</h3><ul>${type.readiness.map(x => html`<li>${x}</li>`)}</ul>` : ''}</section>`;
  return html`${crumbs([{ label: T.nav.entities, href: '#entities' }, { label: type.name }])}<h2 id="view-title" tabindex="-1">${type.name}</h2>
  <div class="chips">${kindChip('entity')}${chip(T.fields.key + ': ' + type.key)}${type.icon ? chip(T.fields.icon + ': ' + type.icon) : ''}${receiptChip(type.receipt)}</div>
  ${type.description ? html`<p class="lead">${type.description}</p>` : ''}
  <dl class="props">${prop(T.fields.purpose, type.purpose)}${prop(T.fields.owner, type.owner)}${prop(T.fields.namePattern, type.namePattern)}${prop(T.fields.name, copyChip(type.name))}${prop(T.fields.icon, type.icon ? copyChip(type.icon) : null)}${prop(T.fields.description, type.description ? copyChip(type.description) : null)}</dl>
  ${tabs('entity', [['fields', T.tabs.fields, fields.length], ['relationships', T.tabs.relationships, outbound.length + inbound.length + users.length], ['json', T.tabs.json]], tab)}${body}
  ${issues.length ? html`<h3>${T.review.title}</h3>${issueRows(issues, { object: false })}` : ''}`;
}
function stripMeta(object) { const { id, receipt, ...rest } = object; return rest; }

function previewControl(field) {
  const type = String(field.type || 'text');
  const options = list(field.options).length ? field.options : list(field.config && field.config.options);
  if (['select', 'multi_select', 'dropdown'].includes(type) || options.length) return html`<select disabled ${type === 'multi_select' ? 'multiple' : ''}>${options.length ? options.map(option => html`<option>${typeof option === 'string' ? option : option.label || option.value}</option>`) : html`<option>—</option>`}</select>`;
  if (['textarea', 'rich_text', 'long_text', 'text_area'].includes(type)) return html`<textarea disabled rows="3"></textarea>`;
  if (['checkbox', 'boolean'].includes(type)) return html`<input type="checkbox" disabled>`;
  if (type === 'file') return html`<input type="file" disabled>`;
  if (['number', 'currency', 'integer', 'decimal'].includes(type)) return html`<input type="number" disabled placeholder="${type}${field.config && field.config.currency ? ' · ' + field.config.currency : ''}">`;
  if (['date', 'datetime', 'date_time'].includes(type)) return html`<input type="date" disabled>`;
  return html`<input type="text" disabled placeholder="${type}">`;
}
function viewForm(form) {
  const { params } = parseHash();
  const tab = params.get('tab') || 'preview';
  const fields = list(form.fields).map(field => typeof field === 'string' ? { key: field } : field);
  const known = new Set(['key', 'name', 'label', 'type', 'required', 'helpText', 'help', 'mapsTo', 'options', 'config']);
  const issues = issuesByObject.get(form.id) || [];
  const action = form.actionRef ? OBJ.get('workflow/' + form.workflowRef + '/action/' + form.actionRef) : null;
  const users = formUsedBy.get(form.key) || [];
  const body = tab === 'fields' ? html`<section id="panel-fields" role="tabpanel"><div class="scroll-x"><table><thead><tr><th>${T.fields.key}</th><th>${T.fields.label}</th><th>${T.fields.type}</th><th>${T.fields.required}</th><th>${T.fields.mapsTo}</th><th>${T.fields.options}</th><th>${T.fields.technical}</th></tr></thead><tbody>${fields.map(field => { const extra = Object.fromEntries(Object.entries(field).filter(([k]) => !known.has(k))); const options = list(field.options).length ? field.options : list(field.config && field.config.options); return html`<tr><td><code>${fieldKey(field)}</code></td><td>${fieldLabel(field)}</td><td>${field.type || ''}</td><td>${field.required ? T.fields.yes : T.fields.no}</td><td>${field.mapsTo ? html`<code>${field.mapsTo}</code>` : ''}</td><td>${options.map(o => typeof o === 'string' ? o : (o.label || o.value)).join(', ')}</td><td>${Object.keys(extra).length || field.config ? html`<code class="small">${JSON.stringify(Object.assign({}, extra, field.config ? { config: field.config } : {}))}</code>` : ''}</td></tr>`; })}</tbody></table></div></section>`
    : html`<section id="panel-preview" role="tabpanel"><div class="field-preview">${fields.length ? fields.map(field => html`<div class="f"><label>${fieldLabel(field)}${field.required ? html` <span class="req" aria-label="${T.fields.required}">*</span>` : ''}</label>${field.helpText || field.help ? html`<div class="help">${field.helpText || field.help}</div>` : ''}${previewControl(field)}${field.mapsTo ? html`<div class="help">${T.fields.mapsTo}: <code>${field.mapsTo}</code></div>` : ''}</div>`) : html`<p class="muted">${T.fields.none}</p>`}</div></section>`;
  return html`${crumbs([{ label: T.nav.forms, href: '#forms' }, { label: form.title || form.key }])}<h2 id="view-title" tabindex="-1">${form.title || form.key}</h2>
  <div class="chips">${kindChip('form')}${chip(T.enums.formKind[form.kind] || form.kind)}${form.status ? chip(T.status.form[form.status] || form.status, 'info') : ''}${receiptChip(form.receipt)}</div>
  <dl class="props">${prop(T.fields.key, copyChip(form.key))}${prop(T.fields.workflow, link('workflow/' + form.workflowRef))}${prop(T.fields.action, action ? link(action.id) : null)}${prop(T.fields.usedBy, users.map(id => link(id)))}${prop(T.fields.fieldsCount, fields.length + ' · ' + T.fields.required.toLowerCase() + ': ' + fields.filter(f => f.required).length)}</dl>
  ${tabs('form', [['preview', T.tabs.preview], ['fields', T.tabs.fields, fields.length]], tab)}${body}
  ${issues.length ? html`<h3>${T.review.title}</h3>${issueRows(issues, { object: false })}` : ''}`;
}

function viewGroup(group) {
  const children = DATA.groups.filter(other => other.parentKey === group.key);
  const actions = groupActions.get(group.key) || [];
  const fallbacks = groupFallback.get(group.key) || [];
  const grants = DATA.access.flatMap(entry => entry.grants.filter(grant => grant.kind === 'group' && grant.ref === group.key).map(grant => ({ entry, grant })));
  const allowlists = DATA.access.flatMap(entry => entry.allowlists.filter(item => item.groups.includes(group.key)).map(item => ({ entry, item })));
  const issues = issuesByObject.get(group.id) || [];
  return html`${crumbs([{ label: T.nav.groups, href: '#groups' }, { label: group.name }])}<h2 id="view-title" tabindex="-1">${group.name}</h2>
  <div class="chips">${kindChip('group')}${group.kind ? chip(T.enums.groupKind[group.kind] || group.kind) : ''}${group.area ? chip(T.fields.area + ': ' + group.area) : ''}${receiptChip(group.receipt)}${list(group.flags).map(flag => chip(T.enums.flag[flag.code] || flag.code, 'warn'))}</div>
  ${group.purpose ? html`<p class="lead">${group.purpose}</p>` : ''}
  <div class="two"><div>
  <dl class="props">${prop(T.fields.key, copyChip(group.key))}${prop(T.fields.name, copyChip(group.name))}${prop(T.fields.parent, group.parentKey ? link('group/' + group.parentKey) : null)}${prop(T.fields.children, children.map(child => link(child.id)))}${prop(T.fields.sources, sourceLinks(group.sourceRefs))}</dl>
  <h3>${T.fields.members} <span class="chip">${list(group.members).length}</span>${group.membersComplete === true ? html` ${chip('completo', 'ok')}` : ''}</h3>${list(group.members).length ? html`<div class="scroll-x"><table><thead><tr><th>${T.fields.role}</th><th>${T.fields.email}</th><th>${T.fields.verified}</th><th>${T.fields.source}</th></tr></thead><tbody>${group.members.map(member => html`<tr><td>${member.role || ''}</td><td>${member.email || ''}</td><td>${member.email ? (member.verified === true ? chip(T.fields.verified, 'ok') : chip(T.fields.unverified, 'warn')) : ''}</td><td>${member.source || ''}</td></tr>`)}</tbody></table></div>` : html`<p class="muted">${T.fields.none}</p>`}
  ${list(group.flags).length ? html`<h3>${T.fields.flags}</h3><ul>${group.flags.map(flag => html`<li><strong>${T.enums.flag[flag.code] || flag.code}</strong>${flag.detail ? ': ' + flag.detail : ''}</li>`)}</ul>` : ''}
  </div><div>
  <h3>${T.fields.responsibilities}</h3>
  <h4>${T.fields.assignedActions} <span class="chip">${actions.length + fallbacks.length}</span></h4>${actions.length || fallbacks.length ? html`<ul class="plain">${actions.map(id => html`<li>${link(id)} <span class="small muted">· ${OBJ.get(id).workflow.name}</span></li>`)}${fallbacks.map(id => html`<li>${link(id)} <span class="small muted">· ${OBJ.get(id).workflow.name} · ${T.fields.fallback}</span></li>`)}</ul>` : html`<p class="muted">${T.fields.none}</p>`}
  <h4>${T.fields.heldGrants}</h4>${grants.length ? html`<ul class="plain">${grants.map(({ entry, grant }) => html`<li>${link('workflow/' + entry.workflow)} → ${enumLabel('level', grant.level)} ${grant.applied ? chip(T.access.applied, 'ok') : chip(T.access.toApply, '')}${grant.reason ? html`<br><span class="small muted">${grant.reason}</span>` : ''}</li>`)}</ul>` : html`<p class="muted">${T.fields.none}</p>`}
  ${allowlists.length ? html`<h4>${T.fields.allowlists}</h4><ul class="plain">${allowlists.map(({ entry, item }) => html`<li>${link('workflow/' + entry.workflow)} · ${item.label} ${chip(item.state, item.state === 'applied' ? 'ok' : 'bad')}</li>`)}</ul>` : ''}
  </div></div>
  ${issues.length ? html`<h3>${T.review.title}</h3>${issueRows(issues, { object: false })}` : ''}`;
}

function viewSource(source, section) {
  const refsOf = id => (refsBySource.get(id) || []).filter((v, i, a) => a.indexOf(v) === i);
  const refList = ids => ids.length ? html`<ul class="plain">${ids.map(id => html`<li>${kindChip(OBJ.get(id) ? OBJ.get(id).kind : 'issue')} ${link(id)}${OBJ.get(id) && OBJ.get(id).kind === 'action' ? html` <span class="small muted">· ${OBJ.get(id).workflow.name}</span>` : ''}</li>`)}</ul>` : html`<p class="muted">${T.fields.none}</p>`;
  if (section) return html`${crumbs([{ label: T.nav.sources, href: '#sources' }, { label: source.title, href: '#' + source.id }, { label: '§' + section.anchor }])}<h2 id="view-title" tabindex="-1">§${section.anchor} ${section.title || ''}</h2><div class="chips">${kindChip('section')}</div><h3>${T.fields.referencedBy}</h3>${refList(refsOf(section.id))}`;
  const direct = refsOf(source.id);
  return html`${crumbs([{ label: T.nav.sources, href: '#sources' }, { label: source.title }])}<h2 id="view-title" tabindex="-1">${source.title}</h2>
  <div class="chips">${kindChip('source')}${chip(T.enums.sourceKind[source.kind] || source.kind)}${source.version ? chip(T.fields.version + ' ' + source.version) : ''}${source.effectiveDate ? chip(source.effectiveDate) : ''}</div>
  <dl class="props">${prop(T.fields.code, copyChip(source.code))}${prop(T.fields.emails, list(source.emails))}</dl>
  <h3>${T.fields.sections} <span class="chip">${source.sections.length}</span></h3>${source.sections.length ? html`<div class="scroll-x"><table><thead><tr><th>§</th><th>${T.fields.title}</th><th>${T.fields.referencedBy}</th></tr></thead><tbody>${source.sections.map(section => { const refs = refsOf(section.id); return html`<tr><td><a href="#${section.id}">§${section.anchor}</a></td><td>${section.title || ''}</td><td>${refs.slice(0, 8).map((id, i) => html`${i ? ', ' : ''}${link(id)}`)}${refs.length > 8 ? html` <a href="#${section.id}">+${refs.length - 8} ${T.misc.more}</a>` : ''}</td></tr>`; })}</tbody></table></div>` : html`<p class="muted">${T.fields.none}</p>`}
  <h3>${T.fields.referencedBy}</h3>${refList(direct)}`;
}

function viewProfile(profile) {
  const actions = profileActions.get(profile.key) || [];
  const issues = issuesByObject.get(profile.id) || [];
  const { id, ...rest } = profile;
  return html`${crumbs([{ label: T.nav.profiles, href: '#profiles' }, { label: profile.name }])}<h2 id="view-title" tabindex="-1">${profile.name}</h2><div class="chips">${kindChip('ai')}</div>
  <dl class="props">${prop(T.fields.key, copyChip(profile.key))}${prop(T.fields.purpose, profile.purpose)}${prop(T.fields.workflow, profile.workflowRef ? link('workflow/' + profile.workflowRef) : null)}${prop(T.fields.action, profile.workflowRef && profile.actionRef ? link('workflow/' + profile.workflowRef + '/action/' + profile.actionRef) : null)}${prop(T.fields.assignedActions, actions.map(x => link(x)))}</dl>
  <details class="tech"><summary>${T.fields.jsonOf}</summary><pre>${JSON.stringify(rest, null, 2)}</pre></details>
  ${issues.length ? html`<h3>${T.review.title}</h3>${issueRows(issues, { object: false })}` : ''}`;
}

function viewDecision(decision) {
  const issues = issuesByObject.get(decision.id) || [];
  return html`${crumbs([{ label: T.nav.decisions, href: '#decisions' }, { label: decision.code }])}<h2 id="view-title" tabindex="-1">${decision.code}: ${decision.question}</h2>
  <div class="chips">${kindChip('decision')}${chip(decision.status === 'open' ? T.status.open : T.status.resolved, decision.status === 'open' ? 'warn' : 'ok')}</div>
  <dl class="props">${prop(T.fields.owner, decision.owner)}${prop(T.fields.raisedBy, decision.raisedBy)}${prop(T.fields.resolution, decision.resolution)}${prop(T.fields.sources, sourceLinks(decision.sourceRefs))}${prop(T.fields.related, decision.related.map(key => link('workflow/' + key)))}</dl>
  ${issues.length ? issueRows(issues, { object: false }) : ''}`;
}

function accessTable(entries) {
  const rows = [];
  for (const entry of entries) {
    const cell = (grantee, level, reason, sources, status) => rows.push(html`<tr><td>${link('workflow/' + entry.workflow)}</td><td>${entry.ownerArea || '—'}</td><td>${entry.sensitivity ? enumLabel('sensitivity', entry.sensitivity) : '—'}</td><td>${grantee}</td><td>${level}</td><td>${reason}</td><td>${sources}</td><td>${status}</td></tr>`);
    const grants = entry.grants.filter(grant => grant.kind !== 'creator');
    if (!entry.declared) cell('—', '—', html`<span class="red">${T.access.notDeclared}</span>`, '—', '—');
    else if (!grants.length) cell(T.access.creatorOnly, '—', entry.note || '—', '—', '—');
    for (const grant of grants) cell(grant.kind === 'group' ? link('group/' + grant.ref, grant.name || grant.ref) : grant.kind === 'organization' ? T.enums.organization : grant.grantee, enumLabel('level', grant.level), grant.reason || '—', grant.sourceRefs.length ? sourceLinks(grant.sourceRefs).map((x, i) => html`${i ? ', ' : ''}${x}`) : '—', grant.applied ? chip(T.access.applied, 'ok') : chip(T.access.toApply, ''));
    for (const key of entry.assigned) cell(link('group/' + key), '—', T.access.seesOwn, '—', '—');
    for (const trigger of entry.allowlists) cell(html`${T.access.allowlist} ${trigger.groups.map((key, i) => html`${i ? ', ' : ''}${link('group/' + key)}`)}${trigger.users.map(u => html`, ${u}`)}`, T.access.start, trigger.label, '—', trigger.state === 'applied' ? chip(T.access.applied, 'ok') : html`${chip(T.access.blocked, 'bad')} <span class="small">${trigger.state}</span>`);
  }
  const retained = entries.filter(entry => entry.retainedExcess.length);
  return html`<div class="scroll-x"><table><thead><tr>${T.access.columns.map(c => html`<th>${c}</th>`)}</tr></thead><tbody>${rows}</tbody></table></div>
  ${retained.length ? html`<h3>${T.access.retained}</h3><ul>${retained.flatMap(entry => entry.retainedExcess.map(held => html`<li>${link('workflow/' + entry.workflow)}: ${held.granteeType}:${held.granteeRef} → ${enumLabel('level', held.level)}${held.approvedLevel ? html` (${T.access.approved} ${enumLabel('level', held.approvedLevel)})` : html` (${T.access.notInManifest})`}${held.block ? html` — ${chip(T.access.blocked, 'bad')} ${held.block}` : ''}</li>`))}</ul>` : ''}
  ${entries.length ? html`<h3>${T.access.readiness}</h3><ul class="plain">${entries.map(entry => { const item = DATA.readiness.find(r => r.workflow === entry.workflow); return html`<li>${link('workflow/' + entry.workflow)}: ${item && item.blocked ? html`${chip(T.access.blocked, 'bad')} ${item.reasons.join('; ')}` : chip(T.access.ready, 'ok')}</li>`; })}</ul>` : ''}`;
}
const viewAccess = () => html`${crumbs([{ label: T.access.title }])}<h2 id="view-title" tabindex="-1">${T.access.title}</h2><p class="lead">${T.access.intro}</p>${accessTable(DATA.access)}`;

function viewReview() {
  const { params } = parseHash();
  const cat = params.get('cat') || '', wf = params.get('wf') || '', area = params.get('area') || '', kind = params.get('kind') || '', q = norm(params.get('q') || '');
  const counts = { design: 0, validation: 0, setup: 0, blocker: 0 };
  for (const issue of DATA.issues) counts[issue.category] += 1;
  const areas = [...new Set(DATA.workflows.map(areaOf))].sort();
  const kinds = [...new Set(DATA.issues.map(issue => issue.objectId ? (OBJ.get(issue.objectId) || {}).kind : null).filter(Boolean))].sort();
  const shown = DATA.issues.filter(issue => (!cat || issue.category === cat) && (!wf || issueWorkflows(issue).includes(wf)) && (!area || issueWorkflows(issue).some(key => areaOf(workflowsByKey.get(key) || {}) === area)) && (!kind || (issue.objectId && (OBJ.get(issue.objectId) || {}).kind === kind)) && (!q || norm([issue.name || '', issue.text, issue.ref, issue.detail, issue.path, issue.objectId && OBJ.get(issue.objectId) ? OBJ.get(issue.objectId).label : ''].join(' ')).includes(q)));
  const order = { blocker: 0, design: 1, validation: 2, setup: 3 };
  shown.sort((a, b) => (b.blocking - a.blocking) || (order[a.category] - order[b.category]) || String(issueWorkflows(a)[0] || '').localeCompare(String(issueWorkflows(b)[0] || '')) || String(a.objectId || '').localeCompare(String(b.objectId || '')));
  const select = (name, label, options, value) => html`<label for="review-${name}">${label}</label><select id="review-${name}" data-param="${name}"><option value="">${T.search.all}</option>${options.map(([v, l]) => html`<option value="${v}" ${v === value ? 'selected' : ''}>${l}</option>`)}</select>`;
  return html`${crumbs([{ label: T.review.title }])}<h2 id="view-title" tabindex="-1">${T.review.title}</h2><p class="lead">${T.review.intro}</p>
  <div class="queue-tabs">${[['', T.review.all, DATA.issues.length], ['blocker', T.enums.category.blocker, counts.blocker], ['design', T.enums.category.design, counts.design], ['validation', T.enums.category.validation, counts.validation], ['setup', T.enums.category.setup, counts.setup]].map(([key, label, n]) => html`<a href="${href('review', Object.assign(Object.fromEntries(params.entries()), { cat: key }))}" aria-current="${key === cat}">${label} <span class="chip">${n}</span></a>`)}</div>
  <div class="toolbar">${select('wf', T.review.workflow, DATA.workflows.map(w => [w.key, w.name]), wf)}${select('area', T.search.area, areas.map(a => [a, a || T.nav.noArea]), area)}${select('kind', T.search.type, kinds.map(k => [k, T.kinds[k] || k]), kind)}<label for="review-q">${T.nav.search}</label><input id="review-q" type="search" data-param="q" value="${params.get('q') || ''}"><a href="#review">${T.search.clear}</a><span class="small muted">${fmt(T.review.filtered, { n: shown.length, m: DATA.issues.length })}</span></div>
  ${issueRows(shown)}
  <h3>${T.review.notes}</h3><p class="lead">${T.review.notesIntro} ${T.review.notIncorporated}</p>
  <div class="toolbar"><button type="button" data-notes="export">${T.review.export}</button><button type="button" data-notes="markdown">${T.review.exportMd}</button><label for="notes-import"><span class="sr">${T.review.importNotes}</span></label><input id="notes-import" type="file" accept="application/json" data-notes="import"><button type="button" data-notes="clear">${T.review.clearNotes}</button></div>`;
}

/* ---------- Search ---------- */
let searchIndex = null;
function indexText(o) {
  const d = o.data;
  switch (o.kind) {
    case 'workflow': return [d.name, d.key, d.prefix, d.ownerArea, d.yaml && d.yaml.metadata && d.yaml.metadata.description, list(d.setupNotes).join(' ')].join(' ');
    case 'action': return [d.name, d.localId, d.type, d.description, d.yaml && d.yaml.description, list(d.evidence).join(' '), d.assigneeRef].join(' ');
    case 'entity': return [d.name, d.key, d.description, d.purpose, list(d.fields).map(f => f.key + ' ' + f.label + ' ' + (f.helpText || '')).join(' ')].join(' ');
    case 'form': return [d.title, d.key, list(d.fields).map(f => (typeof f === 'string' ? f : (f.key || f.name || '') + ' ' + (f.label || '') + ' ' + (f.helpText || f.help || ''))).join(' ')].join(' ');
    case 'group': return [d.name, d.key, d.purpose, d.area, list(d.members).map(m => (m.role || '') + ' ' + (m.email || '')).join(' ')].join(' ');
    case 'source': return [d.title, d.code, d.kind].join(' ');
    case 'section': return [d.anchor, d.title].join(' ');
    case 'ai': return [d.name, d.key, d.purpose].join(' ');
    case 'decision': return [d.code, d.question, d.owner, d.resolution].join(' ');
    default: return o.label;
  }
}
function snippet(text, q) { const n = norm(text); const at = n.indexOf(q); if (at === -1) return text.slice(0, 140); const start = Math.max(0, at - 60); return (start ? '…' : '') + text.slice(start, at) + '\u0001' + text.slice(at, at + q.length) + '\u0002' + text.slice(at + q.length, at + q.length + 80); }
function viewSearch() {
  const { params } = parseHash();
  const q = norm(params.get('q') || '').trim();
  const kind = params.get('kind') || '', area = params.get('area') || '', wf = params.get('wf') || '', status = params.get('status') || '';
  if (!searchIndex) searchIndex = [...OBJ.values()].map(o => ({ o, text: indexText(o), n: norm(indexText(o)) }));
  const areaOfObject = o => o.kind === 'workflow' ? areaOf(o.data) : o.kind === 'action' ? areaOf(o.workflow) : o.kind === 'group' ? (o.data.area || '') : o.kind === 'form' ? areaOf(workflowsByKey.get(o.data.workflowRef) || {}) : null;
  const workflowOfObject = o => o.kind === 'workflow' ? o.data.key : o.kind === 'action' ? o.workflow.key : o.kind === 'form' ? o.data.workflowRef : o.kind === 'ai' ? o.data.workflowRef : null;
  const statusOfObject = o => o.kind === 'workflow' ? o.data.status : o.kind === 'form' ? o.data.status : o.kind === 'decision' ? o.data.status : null;
  const hits = q ? searchIndex.filter(({ o, n }) => n.includes(q) && (!kind || o.kind === kind) && (!area || areaOfObject(o) === area) && (!wf || workflowOfObject(o) === wf) && (!status || statusOfObject(o) === status)) : [];
  const select = (name, label, options, value) => html`<label for="search-${name}">${label}</label><select id="search-${name}" data-param="${name}"><option value="">${T.search.all}</option>${options.map(([v, l]) => html`<option value="${v}" ${v === value ? 'selected' : ''}>${l}</option>`)}</select>`;
  const byKind = new Map();
  for (const hit of hits) push(byKind, hit.o.kind, hit);
  return html`${crumbs([{ label: T.nav.search }])}<h2 id="view-title" tabindex="-1">${T.nav.search}</h2><p class="lead">${T.search.hint}</p>
  <div class="toolbar">${select('kind', T.search.type, Object.entries(T.kinds).filter(([k]) => k !== 'issue').map(([k, l]) => [k, l]), kind)}${select('area', T.search.area, [...new Set(DATA.workflows.map(areaOf).concat(DATA.groups.map(g => g.area || '')))].filter(Boolean).sort().map(a => [a, a]), area)}${select('wf', T.search.workflow, DATA.workflows.map(w => [w.key, w.name]), wf)}${select('status', T.search.status, [['design', T.status.workflow.design], ['packaged', T.status.workflow.packaged], ['validated', T.status.workflow.validated], ['imported', T.status.workflow.imported], ['change_planned', T.status.workflow.change_planned], ['designed', T.status.form.designed], ['created', T.status.form.created], ['linked', T.status.form.linked], ['open', T.status.open], ['resolved', T.status.resolved]], status)}</div>
  ${!q ? html`<p class="empty">${T.search.empty}</p>` : hits.length ? html`<p role="status">${fmt(T.search.results, { n: hits.length, q: params.get('q') })}</p>${[...byKind.entries()].map(([k, items]) => html`<h3>${T.kindsPlural[k] || k} <span class="chip">${items.length}</span></h3>${items.slice(0, 200).map(({ o, text }) => html`<div class="result"><a href="${href(o.id)}">${o.label}</a> ${kindChip(o.kind)}<div class="where">${o.kind === 'action' ? html`${T.search.in} ${o.workflow.name}` : o.kind === 'section' ? html`${T.search.in} ${OBJ.get(o.parent).label}` : html`<code>${o.id}</code>`}</div><div class="small">${raw(esc(snippet(text, q)).replace('\u0001', '<mark>').replace('\u0002', '</mark>'))}</div></div>`)}${items.length > 200 ? html`<p class="muted">+${items.length - 200}</p>` : ''}`)}` : html`<p class="empty" role="status">${fmt(T.search.none, { q: params.get('q') })}</p>`}`;
}

/* ---------- Diagrams ---------- */
function wrap(text, max, lines) { const words = String(text).split(/\s+/); const out = []; let line = ''; for (const word of words) { if ((line + ' ' + word).trim().length > max && line) { out.push(line); line = word; } else line = (line + ' ' + word).trim(); } if (line) out.push(line); if (out.length > lines) { out.length = lines; out[lines - 1] = out[lines - 1].slice(0, max - 1) + '…'; } return out; }
const svgText = (x, y, lines, cls, size) => lines.map((line, i) => `<text x="${x}" y="${y + i * (size || 14)}" class="${cls || ''}">${esc(line)}</text>`).join('');
const FILL = { standard: '#ffffff', decision: '#fef3c7', sub_workflow: '#ede9fe', notification: '#e0f2fe', wait: '#e0f2fe', http_request: '#e0f2fe', form_fill: '#dcfce7', terminal: '#f2f4f7', start: '#e0e7ff' };
function flowSvg(workflow) {
  const W = 220, COLW = 250, GAP = 56, LEFT = 60, TOP = 20;
  const lineCount = Math.max(1, ...workflow.actions.map(action => wrap(action.name, 32, 3).length));
  const H = 32 + 14 * lineCount;
  const rows = [];
  for (const action of workflow.actions) {
    const parallel = action.yaml && action.yaml.executionMode === 'parallel';
    const last = rows[rows.length - 1];
    if (parallel && last && last.parallel) last.actions.push(action); else rows.push({ parallel, actions: [action] });
  }
  const maxCols = Math.max(1, ...rows.map(row => row.actions.length));
  const pos = new Map();
  let y = TOP;
  pos.set('start', { x: LEFT, y, w: W, h: 36 }); y += 36 + GAP;
  for (const row of rows) { row.actions.forEach((action, i) => pos.set(action.id, { x: LEFT + i * COLW, y, w: W, h: H })); y += H + GAP; }
  pos.set('end', { x: LEFT, y, w: W, h: 36 });
  const termX = LEFT + maxCols * COLW + 60;
  let termBottom = 0, terminals = [], edges = [], backCount = 0;
  const arrow = (a, b, label, dashed) => { const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y; const mid = (y1 + y2) / 2; edges.push({ d: x1 === x2 ? `M${x1},${y1} L${x2},${y2}` : `M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`, label, lx: (x1 + x2) / 2 + 6, ly: mid, dashed }); };
  const side = (a, b, label) => { const x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y + b.h / 2; edges.push({ d: `M${x1},${y1} C${x1 + 40},${y1} ${x2 - 40},${y2} ${x2},${y2}`, label, lx: x1 + 6, ly: y1 - 8 }); };
  const back = (a, b, label) => { backCount += 1; const gx = LEFT - 20 - backCount * 12; const x1 = a.x, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y + b.h / 2; edges.push({ d: `M${x1},${y1} C${gx},${y1} ${gx},${y2} ${x2},${y2}`, label, lx: gx + 4, ly: (y1 + y2) / 2, dashed: true, back: true }); };
  const terminal = (from, label, kind, target) => { const p = pos.get(from.id); const ty = Math.max(p.y, termBottom + 10); const node = { x: termX, y: ty, w: W, h: 36, label, kind, target }; termBottom = ty + 36; terminals.push(node); return node; };
  rows.forEach((row, r) => {
    const nextRow = rows[r + 1];
    const targets = nextRow ? nextRow.actions.map(a => pos.get(a.id)) : [pos.get('end')];
    for (const action of row.actions) {
      const p = pos.get(action.id);
      const branches = action.type === 'decision' && action.yaml && action.yaml.config ? list(action.yaml.config.branches) : [];
      if (!branches.length) { for (const t of targets) arrow(p, t, null); continue; }
      const continues = branches.filter(b => !b.outcome || b.outcome === 'continue' || b.outcome === 'trigger_workflow').map(b => b.label);
      if (continues.length) for (const t of targets) arrow(p, t, continues.join(' / '));
      for (const branch of branches) {
        if (branch.outcome === 'return_to_action' && branch.target) { const t = pos.get(workflow.id + '/action/' + branch.target); if (t) back(p, t, branch.label); else side(p, terminal(action, branch.label + ' → ' + branch.target, 'terminal'), branch.label); }
        else if (branch.outcome === 'cancel_incident') side(p, terminal(action, T.flow.cancelled, 'terminal'), branch.label);
        else if (branch.outcome === 'trigger_workflow') { const target = branch.workflow && workflowsByKey.get(branch.workflow); side(p, terminal(action, T.flow.triggerWorkflow + ' ' + (target ? target.name : branch.workflow || '?'), 'sub_workflow', target ? target.id : null), branch.label + ' (+)'); }
      }
      if (!continues.length && branches.length) { const t = pos.get('end'); edges.push({ d: `M${p.x + p.w / 2},${p.y + p.h} L${p.x + p.w / 2},${p.y + p.h + 8}`, label: T.flow.decisionNoContinue, lx: p.x + p.w / 2 + 6, ly: p.y + p.h + 14 }); void t; }
    }
  });
  for (const t of rows.length ? rows[0].actions.map(a => pos.get(a.id)) : [pos.get('end')]) arrow(pos.get('start'), t, null);
  const width = termX + (terminals.length ? W + 20 : 0), height = Math.max(pos.get('end').y + 36, termBottom) + 20;
  const parts = [`<svg class="flow" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(T.flow.title)}"><defs><marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#667085"/></marker></defs>`];
  for (const e of edges) parts.push(`<path d="${e.d}" fill="none" stroke="${e.back ? '#b91c1c' : '#667085'}" stroke-width="1.6" ${e.dashed ? 'stroke-dasharray="5 4"' : ''} marker-end="url(#flow-arrow)"/>` + (e.label ? `<text x="${e.lx}" y="${e.ly}" class="edge-label" paint-order="stroke" stroke="#fff" stroke-width="4">${esc(e.label)}</text>` : ''));
  const box = (p, fill, lines, meta, id, stroke) => `<g class="node" ${id ? `tabindex="0" role="link" data-href="#${esc(id)}"` : ''} transform="translate(${p.x},${p.y})"><rect width="${p.w}" height="${p.h}" rx="8" fill="${fill}" stroke="${stroke || '#98a2b3'}" stroke-width="1.2"/>${svgText(10, meta ? 18 : Math.round(p.h / 2 + 4 - 7 * (lines.length - 1)), lines)}${meta ? `<text x="10" y="${p.h - 10}" class="edge-label">${esc(meta)}</text>` : ''}</g>`;
  const triggers = list(workflow.triggers).length ? workflow.triggers : (workflow.yaml && workflow.yaml.triggers) || [];
  parts.push(box(pos.get('start'), FILL.start, [T.flow.start + (triggers.length ? ': ' + triggers.map(t => t.label || enumLabel('triggerType', t.type)).join(', ') : '')].map(s => s.length > 30 ? s.slice(0, 29) + '…' : s), null));
  for (const row of rows) for (const action of row.actions) { const owner = action.assigneeRef ? (action.assigneeRef.startsWith('ai:') ? (profilesByKey.get(action.assigneeRef.slice(3)) || {}).name || action.assigneeRef : action.assigneeRef === 'creator' ? T.enums.creator : action.assigneeRef === 'previous' ? T.enums.previous : action.assigneeRef.startsWith('field:') ? action.assigneeRef : (groupsByKey.get(action.assigneeRef) || {}).name || action.assigneeRef) : '—'; parts.push(box(pos.get(action.id), FILL[action.type] || '#fff', wrap(action.name, 32, 3), (enumLabel('actionType', action.type) + ' · ' + owner).slice(0, 40), action.id, action.type === 'decision' ? '#b45309' : null)); }
  parts.push(box(pos.get('end'), FILL.terminal, [T.flow.end], null));
  for (const t of terminals) parts.push(box(t, FILL[t.kind] || FILL.terminal, wrap(t.label, 30, 2), null, t.target, t.kind === 'terminal' ? '#b91c1c' : null));
  parts.push('</svg>');
  return parts.join('');
}

function graphSvg(scopeKey) {
  const KIND_COL = { source: 0, section: 0, workflow: 1, action: 1, group: 2, ai: 2, form: 3, entity: 4 };
  let edges, nodeIds;
  if (scopeKey) {
    const workflow = workflowsByKey.get(scopeKey);
    if (!workflow) return '';
    const own = new Set([workflow.id, ...workflow.actions.map(a => a.id)]);
    edges = DATA.edges.filter(e => own.has(e.from) || own.has(e.to));
    nodeIds = new Set([...own]); for (const e of edges) { nodeIds.add(e.from); nodeIds.add(e.to); }
    for (const id of [...nodeIds]) { const o = OBJ.get(id); if (o && o.kind === 'section') nodeIds.add(o.parent); }
  } else {
    const lift = id => { const o = OBJ.get(id); return !o ? null : o.kind === 'action' ? o.parent : o.kind === 'section' ? o.parent : id; };
    const seen = new Set(); edges = [];
    for (const e of DATA.edges) { const from = lift(e.from), to = lift(e.to); if (!from || !to || from === to) continue; const key = from + '>' + to + '>' + e.kind; if (seen.has(key)) continue; seen.add(key); edges.push({ from, to, kind: e.kind, status: e.status }); }
    nodeIds = new Set(); for (const e of edges) { nodeIds.add(e.from); nodeIds.add(e.to); } for (const w of DATA.workflows) nodeIds.add(w.id);
  }
  const nodes = [...nodeIds].map(id => OBJ.get(id)).filter(Boolean);
  const columns = [[], [], [], [], []];
  const order = { source: 0, section: 1, workflow: 0, action: 1, group: 0, ai: 1, form: 0, entity: 0 };
  for (const o of nodes) columns[KIND_COL[o.kind] ?? 4].push(o);
  const W = 220, GAP = 12, COL = 330, TOP = 20, LEFT = 20, INDENT = 18;
  const H = 20 + 13 * Math.max(1, ...nodes.map(o => wrap(o.label, 30, 3).length));
  const pos = new Map(); let height = 0, colIndex = 0;
  for (const column of columns) {
    if (!column.length) continue;
    column.sort((a, b) => (a.parent || a.id).localeCompare(b.parent || b.id, undefined, { numeric: true }) || order[a.kind] - order[b.kind] || a.id.localeCompare(b.id, undefined, { numeric: true }));
    let y = TOP;
    for (const o of column) { const indent = o.kind === 'action' || o.kind === 'section' || (o.kind === 'group' && o.data.parentKey) || o.kind === 'ai' ? INDENT : 0; pos.set(o.id, { x: LEFT + colIndex * COL + indent, y, w: W - indent, h: H }); y += H + GAP; }
    height = Math.max(height, y); colIndex += 1;
  }
  const width = LEFT * 2 + Math.max(colIndex - 1, 0) * COL + W, total = height + TOP;
  const stroke = { resolved: '#15803d', unresolved: '#b91c1c', neutral: '#98a2b3' };
  const fill = { source: '#eef2f7', section: '#f8fafc', workflow: '#e0e7ff', action: '#ffffff', group: '#fef3c7', ai: '#ede9fe', form: '#dcfce7', entity: '#ffe4e6' };
  const parts = [`<svg class="graph" viewBox="0 0 ${width} ${total}" width="${width}" height="${total}" role="img" aria-label="${esc(T.graph.title)}"><defs><marker id="dep-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#667085"/></marker></defs>`];
  for (const e of edges) {
    if (['contains', 'parent'].includes(e.kind)) continue;
    const a = pos.get(e.from), b = pos.get(e.to); if (!a || !b) continue;
    let d;
    if (Math.abs(a.x - b.x) < COL / 2) { const x1 = a.x + a.w, y1 = a.y + a.h / 2, y2 = b.y + b.h / 2, x2 = b.x + b.w; d = `M${x1},${y1} C${x1 + 60},${y1} ${x2 + 60},${y2} ${x2},${y2}`; }
    else { const forward = a.x < b.x; const x1 = forward ? a.x + a.w : a.x, y1 = a.y + a.h / 2, x2 = forward ? b.x : b.x + b.w, y2 = b.y + b.h / 2, c = (x2 - x1) / 2; d = `M${x1},${y1} C${x1 + c},${y1} ${x2 - c},${y2} ${x2},${y2}`; }
    parts.push(`<path d="${d}" fill="none" stroke="${stroke[e.status] || stroke.neutral}" stroke-width="${e.status === 'neutral' ? 1.2 : 1.8}" marker-end="url(#dep-arrow)"><title>${esc(OBJ.get(e.from).label + ' — ' + enumLabel('edge', e.kind) + ' — ' + OBJ.get(e.to).label)}</title></path>`);
  }
  for (const o of nodes) { const p = pos.get(o.id); if (!p) continue; const lines = wrap(o.label, 30, 3); parts.push(`<g class="node" tabindex="0" role="link" data-href="#${esc(o.id)}" transform="translate(${p.x},${p.y})"><title>${esc(o.label)}</title><rect width="${p.w}" height="${p.h}" rx="8" fill="${fill[o.kind] || '#fff'}" stroke="#98a2b3" stroke-width="1"/><text x="8" y="13" class="edge-label">${esc(T.kinds[o.kind] || o.kind)}</text>${svgText(8, 28, lines, '', 13)}</g>`); }
  parts.push('</svg>');
  return parts.join('');
}
function viewGraph() {
  const { params } = parseHash();
  const wf = params.get('wf') || '';
  const projectNodes = new Set(); for (const e of DATA.edges) { const lift = id => { const o = OBJ.get(id); return o && (o.kind === 'action' || o.kind === 'section') ? o.parent : id; }; projectNodes.add(lift(e.from)); projectNodes.add(lift(e.to)); }
  const large = !wf && projectNodes.size > 400 && params.get('force') !== '1';
  return html`${crumbs([{ label: T.graph.title }])}<h2 id="view-title" tabindex="-1">${T.graph.title}</h2><p class="lead">${T.graph.intro}</p>
  <div class="toolbar"><label for="graph-scope">${T.graph.scope}</label><select id="graph-scope" data-param="wf"><option value="">${T.graph.project}</option>${DATA.workflows.map(w => html`<option value="${w.key}" ${w.key === wf ? 'selected' : ''}>${w.name}</option>`)}</select></div>
  ${large ? html`<p class="empty">${fmt(T.graph.tooLarge, { n: projectNodes.size })} <a href="${href('graph', { force: '1' })}">${T.graph.render}</a></p>` : html`<div class="graph-wrap">${raw(graphSvg(wf || null))}</div>`}`;
}

/* ---------- Render ---------- */
const ROUTES = { '': viewOverview, workflows: viewWorkflows, entities: viewEntities, forms: viewForms, groups: viewGroups, sources: viewSources, profiles: viewProfiles, decisions: viewDecisions, review: viewReview, access: viewAccess, graph: viewGraph, search: viewSearch };
function viewFor(path) {
  if (Object.hasOwn(ROUTES, path)) return ROUTES[path]();
  const o = OBJ.get(path);
  if (!o) return html`<h2 id="view-title" tabindex="-1">${fmt(T.misc.notFound, { id: path })}</h2><p><a href="#">${T.nav.overview}</a></p>`;
  switch (o.kind) {
    case 'workflow': return viewWorkflow(o.data);
    case 'action': return viewAction(o.data, o.workflow);
    case 'entity': return viewEntity(o.data);
    case 'form': return viewForm(o.data);
    case 'group': return viewGroup(o.data);
    case 'source': return viewSource(o.data, null);
    case 'section': return viewSource(OBJ.get(o.parent).data, o.data);
    case 'ai': return viewProfile(o.data);
    case 'decision': return viewDecision(o.data);
    default: return html`<p>${o.label}</p>`;
  }
}
function render(options) {
  options = options || {};
  const { path, params } = parseHash();
  const hash = location.hash;
  const focusId = options.keepFocus && document.activeElement && document.activeElement.id;
  const caret = focusId && typeof document.activeElement.selectionStart === 'number' ? document.activeElement.selectionStart : null;
  if (currentHash != null && !options.keepScroll) scrollMemory.set(currentHash, main.scrollTop);
  main.innerHTML = String(viewFor(path));
  const o = OBJ.get(path);
  document.title = (o ? o.label : (T.nav[path] || T.overview.title)) + ' · ' + DATA.project.title;
  markNav(path, params);
  const focusField = params.get('field') && document.getElementById('field-' + params.get('field'));
  if (path === 'search' && document.activeElement !== navSearch) navSearch.value = params.get('q') || '';
  if (options.keepScroll) { /* filters and tabs keep the reading position */ }
  else if (focusField) main.scrollTop = Math.max(0, focusField.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 12);
  else main.scrollTop = scrollMemory.get(hash) || 0;
  if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus({ preventScroll: true }); if (caret != null && typeof el.setSelectionRange === 'function') try { el.setSelectionRange(caret, caret); } catch {} } }
  else if (!options.keepScroll) { const title = document.getElementById('view-title'); if (title && currentHash != null) title.focus({ preventScroll: true }); }
  if (window.innerWidth <= 900 && !options.keepScroll) nav.classList.remove('open');
  currentHash = hash;
}

/* ---------- Navigation rail ---------- */
const navSearch = document.getElementById('nav-search');
function buildNav() {
  const areas = new Map();
  for (const workflow of DATA.workflows) push(areas, areaOf(workflow), workflow);
  const counts = { design: 0, validation: 0, setup: 0, blocker: 0 };
  for (const issue of DATA.issues) counts[issue.category] += 1;
  const item = (path, label, count, tone) => html`<li><a href="#${path}" data-nav="${path}">${label}${count != null ? html` <span class="count ${tone || ''}">${count}</span>` : ''}</a></li>`;
  const list = html`<ul>${item('', T.nav.overview)}</ul>
  <div class="section">${T.nav.workflows}</div>
  ${[...areas.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([area, workflows]) => html`<details ${areas.size <= 6 ? 'open' : ''}><summary>${area || T.nav.noArea} <span class="count">${workflows.length}</span></summary><ul>${workflows.map(workflow => html`<li><a href="#${workflow.id}" data-nav="${workflow.id}">${workflow.name}</a></li>`)}</ul></details>`)}
  <ul>${item('workflows', T.nav.directory)}</ul>
  <div class="section">${T.overview.directories}</div>
  <ul>${item('entities', T.nav.entities, DATA.entityTypes.length)}${item('forms', T.nav.forms, DATA.forms.length)}${item('groups', T.nav.groups, DATA.groups.length)}${item('sources', T.nav.sources, DATA.sources.length)}${item('profiles', T.nav.profiles, DATA.aiProfiles.length)}${item('decisions', T.nav.decisions, DATA.decisions.length)}</ul>
  <div class="section">${T.nav.review}</div>
  <ul>${item('review', T.nav.review, DATA.issues.length)}${item('review?cat=blocker', T.enums.category.blocker, counts.blocker, counts.blocker ? 'red' : '')}${item('review?cat=design', T.enums.category.design, counts.design)}${item('review?cat=validation', T.enums.category.validation, counts.validation)}${item('review?cat=setup', T.enums.category.setup, counts.setup)}${item('access', T.nav.access)}${item('graph', T.nav.graph)}</ul>`;
  document.getElementById('nav-tree').innerHTML = String(list);
}
function markNav(path, params) {
  const o = OBJ.get(path);
  const target = o ? (o.kind === 'action' ? o.parent : o.kind === 'section' ? o.parent : o.kind === 'workflow' ? o.id : { entity: 'entities', form: 'forms', group: 'groups', source: 'sources', ai: 'profiles', decision: 'decisions' }[o.kind]) : path === 'review' && params.get('cat') ? 'review?cat=' + params.get('cat') : path;
  for (const a of nav.querySelectorAll('a[data-nav]')) { if (a.dataset.nav === target) { a.setAttribute('aria-current', 'page'); const details = a.closest('details'); if (details) details.open = true; } else a.removeAttribute('aria-current'); }
}

/* ---------- Events (delegated) ---------- */
let searchTimer = null;
navSearch.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { const { path, params } = parseHash(); const next = path === 'search' ? Object.fromEntries(params.entries()) : {}; next.q = navSearch.value; if (path === 'search') history.replaceState(null, '', hashFor('search', next)); else { scrollMemory.set(location.hash, main.scrollTop); history.pushState(null, '', hashFor('search', next)); } render({ keepScroll: true, keepFocus: true }); }, 120); });
navSearch.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const first = main.querySelector('.result a'); if (first) first.focus(); } });
document.getElementById('menu').addEventListener('click', () => { nav.classList.toggle('open'); document.getElementById('menu').setAttribute('aria-expanded', nav.classList.contains('open')); });
document.getElementById('back').addEventListener('click', () => history.back());
document.getElementById('forward').addEventListener('click', () => history.forward());
document.getElementById('print').addEventListener('click', () => window.print());
main.addEventListener('click', e => {
  const copy = e.target.closest('[data-copy]');
  if (copy) { copyText(copy.dataset.value); return; }
  const dl = e.target.closest('[data-download]');
  if (dl) { download(dl.dataset.download, dl.dataset.value); return; }
  const tab = e.target.closest('.tabs [data-tab]');
  if (tab) { replaceParams({ tab: tab.dataset.tab }); const el = document.getElementById('tab-' + tab.dataset.tab); if (el) el.focus({ preventScroll: true }); return; }
  const node = e.target.closest('[data-href]');
  if (node) { location.hash = node.dataset.href; return; }
  const notes = e.target.closest('[data-notes]');
  if (notes && notes.dataset.notes === 'export') exportNotes(false);
  else if (notes && notes.dataset.notes === 'markdown') exportNotes(true);
  else if (notes && notes.dataset.notes === 'clear') { toast(saveNotes({}) ? T.review.cleared : T.review.saveFailed); render({ keepScroll: true }); }
});
main.addEventListener('keydown', e => {
  const tab = e.target.closest && e.target.closest('.tabs [role=tab]');
  if (tab && ['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
    const all = [...tab.parentElement.querySelectorAll('[role=tab]')]; let i = all.indexOf(tab);
    i = e.key === 'ArrowRight' ? (i + 1) % all.length : e.key === 'ArrowLeft' ? (i - 1 + all.length) % all.length : e.key === 'Home' ? 0 : all.length - 1;
    e.preventDefault(); replaceParams({ tab: all[i].dataset.tab }); const el = document.getElementById('tab-' + all[i].dataset.tab); if (el) el.focus({ preventScroll: true }); return;
  }
  const node = e.target.closest && e.target.closest('[data-href]');
  if (node && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); location.hash = node.dataset.href; }
});
let paramTimer = null;
main.addEventListener('input', e => {
  const param = e.target.closest('[data-param]');
  if (param) { clearTimeout(paramTimer); const name = param.dataset.param, value = param.value; paramTimer = setTimeout(() => replaceParams({ [name]: value }, true), param.tagName === 'SELECT' ? 0 : 150); return; }
  const note = e.target.closest('[data-note-key]');
  if (note) { const notes = loadNotes(); notes[note.dataset.noteKey] = note.value; toast(saveNotes(notes) ? T.review.savedLocally : T.review.saveFailed); }
});
main.addEventListener('change', e => { const input = e.target.closest('[data-notes=import]'); if (input && input.files && input.files[0]) importNotes(input.files[0]); });
async function copyText(text) {
  try { if (!navigator.clipboard || !window.isSecureContext) throw new Error('fallback'); await navigator.clipboard.writeText(text); toast(T.fields.copied); }
  catch { const area = document.createElement('textarea'); area.value = text; area.setAttribute('readonly', ''); area.style.position = 'fixed'; area.style.left = '-9999px'; document.body.appendChild(area); area.select(); let ok = false; try { ok = document.execCommand('copy'); } catch {} area.remove(); toast(ok ? T.fields.copied : T.fields.copyFallback); }
}
window.addEventListener('hashchange', () => render());
buildNav();
render();
window.__provia = { OBJ, DATA, render, parseHash };
})();
