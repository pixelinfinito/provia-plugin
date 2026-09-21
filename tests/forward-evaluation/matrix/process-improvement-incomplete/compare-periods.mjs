#!/usr/bin/env node
// Compare two reporting periods of one Provia workflow without mixing waiting time and active work.
//
// Input: a CSV with ONE ROW PER ACTION INSTANCE (see records-template.csv). Column names are mapped
// with --map so any export layout can be used; nothing about the export format is assumed here.
//
// Usage:
//   node compare-periods.mjs records.csv \
//     --period "A=2026-06-01..2026-06-30" --period "B=2026-08-01..2026-08-31" \
//     [--tz Africa/Luanda] [--version v3[,v4]] [--assume-tz +01:00] \
//     [--map incident_id=Incident,action_id=Step,...] [--json results.json]
//
// Definitions (documented in process-improvement-report.md, section 3):
//   cycle_time(incident)      = incident_closed_at - incident_created_at
//   waiting(action)           = action_started_at - action_activated_at      (queue: available but nobody working)
//   active(action)            = action_completed_at - action_started_at      (someone is working)
//   unclassified(action)      = action_completed_at - action_activated_at    when action_started_at is absent
//   wait-type actions         = whole duration counted as waiting (systemic wait), never as active
// Cohort per period = incidents whose incident_closed_at falls inside the period (close-date cohort).
// Open incidents are reported separately as age at period end; they are never mixed into cycle time.
// Statistics: n, median, p85, mean, in calendar hours and in workday hours (Mon–Fri only; Provia's
// workday model skips weekends, not public holidays). Nothing here measures individual performance.

import { readFileSync, writeFileSync } from 'node:fs';

const REQUIRED = [
  'incident_id', 'incident_created_at', 'incident_closed_at', 'workflow_version',
  'action_id', 'action_type', 'action_activated_at', 'action_started_at', 'action_completed_at',
];

// ---------- arguments ----------
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help')) {
  console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').slice(1, 22).map(l => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(0);
}
const file = args[0];
const opt = { periods: [], tz: 'Africa/Luanda', versions: null, assumeTz: null, map: {}, json: null };
for (let i = 1; i < args.length; i++) {
  const a = args[i]; const v = () => args[++i];
  if (a === '--period') { const [label, range] = v().split('='); const [from, to] = range.split('..'); opt.periods.push({ label, from, to }); }
  else if (a === '--tz') opt.tz = v();
  else if (a === '--version') opt.versions = new Set(v().split(',').map(s => s.trim()));
  else if (a === '--assume-tz') opt.assumeTz = v();
  else if (a === '--map') for (const pair of v().split(',')) { const [k, c] = pair.split('='); opt.map[k.trim()] = c.trim(); }
  else if (a === '--json') opt.json = v();
  else { console.error(`Unknown argument ${a}`); process.exit(2); }
}
if (opt.periods.length !== 2) { console.error('Exactly two --period arguments are required (label=YYYY-MM-DD..YYYY-MM-DD).'); process.exit(2); }

// ---------- CSV ----------
function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}
const raw = parseCsv(readFileSync(file, 'utf8'));
const header = raw[0].map(h => h.trim());
const col = {};
for (const k of REQUIRED) {
  const name = opt.map[k] ?? k;
  const idx = header.indexOf(name);
  if (idx < 0) { console.error(`Missing column "${name}" for ${k}. Use --map ${k}=<column>.`); process.exit(2); }
  col[k] = idx;
}
const records = raw.slice(1).map(r => Object.fromEntries(REQUIRED.map(k => [k, (r[col[k]] ?? '').trim()])));

// ---------- time helpers ----------
const HOUR = 3600_000;
const checks = { naiveTimestamps: 0, unparsable: 0 };
function parseTs(s) {
  if (!s) return null;
  const hasOffset = /(Z|[+-]\d{2}:?\d{2})$/i.test(s);
  let str = s;
  if (!hasOffset) { checks.naiveTimestamps++; if (!opt.assumeTz) return null; str = s.replace(' ', 'T') + opt.assumeTz; }
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) { checks.unparsable++; return null; }
  return d;
}
function tzOffsetMs(date, tz) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(date);
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}
function zonedStartOfDay(ymd, tz) {
  const [y, m, d] = ymd.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d);
  return new Date(guess - tzOffsetMs(new Date(guess), tz));
}
function weekdayIn(date, tz) {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(date);
}
function workdayHours(from, to, tz) {
  if (!(to > from)) return 0;
  let total = 0; let cursor = from;
  while (cursor < to) {
    const localMidnightNext = (() => {
      const off = tzOffsetMs(cursor, tz);
      const local = new Date(cursor.getTime() + off);
      const next = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + 1);
      return new Date(next - tzOffsetMs(new Date(next), tz));
    })();
    const segEnd = localMidnightNext < to ? localMidnightNext : to;
    const wd = weekdayIn(cursor, tz);
    if (wd !== 'Sat' && wd !== 'Sun') total += (segEnd - cursor) / HOUR;
    cursor = segEnd;
  }
  return total;
}
const calHours = (a, b) => (b - a) / HOUR;

// ---------- periods ----------
const periods = opt.periods.map(p => {
  const start = zonedStartOfDay(p.from, opt.tz);
  const endExclusive = zonedStartOfDay(p.to, opt.tz); endExclusive.setTime(endExclusive.getTime() + 24 * HOUR);
  return { ...p, start, endExclusive, days: Math.round((endExclusive - start) / (24 * HOUR)) };
});
const inPeriod = (d, p) => d && d >= p.start && d < p.endExclusive;

// ---------- data checks ----------
const versionsSeen = new Map();
const dupKeys = new Map();
let filteredOut = 0;
const rows = [];
for (const r of records) {
  versionsSeen.set(r.workflow_version || '(blank)', (versionsSeen.get(r.workflow_version || '(blank)') ?? 0) + 1);
  if (opt.versions && !opt.versions.has(r.workflow_version)) { filteredOut++; continue; }
  const key = `${r.incident_id}|${r.action_id}|${r.action_activated_at}`;
  dupKeys.set(key, (dupKeys.get(key) ?? 0) + 1);
  rows.push({
    ...r,
    created: parseTs(r.incident_created_at), closed: parseTs(r.incident_closed_at),
    activated: parseTs(r.action_activated_at), started: parseTs(r.action_started_at), completed: parseTs(r.action_completed_at),
  });
}
const duplicates = [...dupKeys.values()].filter(n => n > 1).reduce((s, n) => s + n - 1, 0);
const allCreated = rows.map(r => r.created).filter(Boolean);
const coverage = allCreated.length ? { min: new Date(Math.min(...allCreated)), max: new Date(Math.max(...allCreated)) } : null;

// ---------- incidents ----------
const incidents = new Map();
for (const r of rows) {
  if (!incidents.has(r.incident_id)) incidents.set(r.incident_id, { id: r.incident_id, created: r.created, closed: r.closed, version: r.workflow_version, actions: [] });
  incidents.get(r.incident_id).actions.push(r);
}

function stats(values) {
  const v = values.filter(x => Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return { n: 0, median: null, p85: null, mean: null };
  const q = p => v[Math.min(v.length - 1, Math.ceil(p * v.length) - 1)];
  return { n: v.length, median: q(0.5), p85: q(0.85), mean: v.reduce((a, b) => a + b, 0) / v.length };
}

const results = { file, tz: opt.tz, generatedAt: new Date().toISOString(), checks: {}, periods: [] };
for (const p of periods) {
  const completed = [...incidents.values()].filter(i => i.closed && i.created && inPeriod(i.closed, p));
  const createdIn = [...incidents.values()].filter(i => inPeriod(i.created, p));
  const openAtEnd = [...incidents.values()].filter(i => i.created && i.created < p.endExclusive && (!i.closed || i.closed >= p.endExclusive));
  const missingClose = createdIn.filter(i => !i.closed).length;

  const cycleCal = completed.map(i => calHours(i.created, i.closed));
  const cycleWd = completed.map(i => workdayHours(i.created, i.closed, opt.tz));

  const perIncident = completed.map(i => {
    let waiting = 0, active = 0, unclassified = 0, overlap = false;
    for (const a of i.actions) {
      if (!a.activated || !a.completed) continue;
      const isWait = /^wait$/i.test(a.action_type);
      if (isWait) waiting += calHours(a.activated, a.completed);
      else if (a.started) { waiting += calHours(a.activated, a.started); active += calHours(a.started, a.completed); }
      else unclassified += calHours(a.activated, a.completed);
    }
    if (waiting + active + unclassified > calHours(i.created, i.closed) + 1e-6) overlap = true; // parallel actions
    return { waiting, active, unclassified, overlap };
  });

  const byAction = {};
  for (const i of completed) for (const a of i.actions) {
    if (!a.activated || !a.completed) continue;
    const b = (byAction[a.action_id] ??= { type: a.action_type, waiting: [], active: [], unclassified: [] });
    if (/^wait$/i.test(a.action_type)) b.waiting.push(calHours(a.activated, a.completed));
    else if (a.started) { b.waiting.push(calHours(a.activated, a.started)); b.active.push(calHours(a.started, a.completed)); }
    else b.unclassified.push(calHours(a.activated, a.completed));
  }

  results.periods.push({
    label: p.label, from: p.from, to: p.to, days: p.days,
    cohort: { completedInPeriod: completed.length, createdInPeriod: createdIn.length, openAtPeriodEnd: openAtEnd.length, createdInPeriodWithoutCloseDate: missingClose },
    cycleTimeHours: { calendar: stats(cycleCal), workday: stats(cycleWd) },
    perIncidentHours: {
      waiting: stats(perIncident.map(x => x.waiting)),
      active: stats(perIncident.map(x => x.active)),
      unclassified: stats(perIncident.map(x => x.unclassified)),
      incidentsWithOverlappingActions: perIncident.filter(x => x.overlap).length,
    },
    openAgeAtPeriodEndHours: stats(openAtEnd.map(i => calHours(i.created, p.endExclusive))),
    byAction: Object.fromEntries(Object.entries(byAction).map(([k, b]) => [k, { type: b.type, waiting: stats(b.waiting), active: stats(b.active), unclassified: stats(b.unclassified) }])),
  });
}

const totalActions = rows.length;
results.checks = {
  rowsRead: records.length, rowsAfterVersionFilter: rows.length, rowsFilteredOutByVersion: filteredOut,
  workflowVersionsSeen: Object.fromEntries(versionsSeen),
  duplicateActionRows: duplicates,
  naiveTimestampsWithoutOffset: checks.naiveTimestamps, assumedOffset: opt.assumeTz, unparsableTimestamps: checks.unparsable,
  actionsWithoutStartedAt: rows.filter(r => !r.started && r.completed && !/^wait$/i.test(r.action_type)).length,
  actionsWithoutCompletedAt: rows.filter(r => r.activated && !r.completed).length,
  incidentsWithoutCloseDate: [...incidents.values()].filter(i => !i.closed).length,
  createdCoverage: coverage ? { min: coverage.min.toISOString(), max: coverage.max.toISOString() } : null,
  periodLengthsEqual: periods[0].days === periods[1].days,
  activeWorkMeasurable: totalActions > 0 && rows.filter(r => !r.started && r.completed && !/^wait$/i.test(r.action_type)).length === 0,
};

// ---------- output ----------
const f = x => (x == null ? '—' : x.toFixed(1));
const line = (label, a, b) => `| ${label} | ${a} | ${b} |`;
const [A, B] = results.periods;
const out = [];
out.push(`# Period comparison — ${file}`, '', `Timezone for day boundaries and workdays: ${opt.tz}. Generated ${results.generatedAt}.`, '');
out.push('## Data checks', '');
for (const [k, v] of Object.entries(results.checks)) out.push(`- ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
out.push('');
if (!results.checks.activeWorkMeasurable) out.push('> Active work is NOT measurable from this file: some non-wait actions have no started_at. Only cycle time and unclassified duration are reported for them. Do not read unclassified time as work.', '');
if (duplicates) out.push(`> ${duplicates} duplicate action rows were counted; deduplicate the export before trusting the figures.`, '');
out.push('## Cohort (incidents closed inside each period)', '');
out.push(`| Measure | ${A.label} (${A.from}..${A.to}, ${A.days} d) | ${B.label} (${B.from}..${B.to}, ${B.days} d) |`, '| --- | --- | --- |');
out.push(line('Completed in period (n)', A.cohort.completedInPeriod, B.cohort.completedInPeriod));
out.push(line('Created in period', A.cohort.createdInPeriod, B.cohort.createdInPeriod));
out.push(line('Open at period end', A.cohort.openAtPeriodEnd, B.cohort.openAtPeriodEnd));
out.push(line('Open age at period end, median h', f(A.openAgeAtPeriodEndHours.median), f(B.openAgeAtPeriodEndHours.median)));
out.push('', '## Cycle time (hours per completed incident)', '', `| Measure | ${A.label} | ${B.label} |`, '| --- | --- | --- |');
for (const [k, lbl] of [['calendar', 'calendar'], ['workday', 'workday (Mon–Fri)']]) {
  out.push(line(`${lbl} median`, f(A.cycleTimeHours[k].median), f(B.cycleTimeHours[k].median)));
  out.push(line(`${lbl} p85`, f(A.cycleTimeHours[k].p85), f(B.cycleTimeHours[k].p85)));
}
out.push('', '## Waiting vs active (calendar hours summed per completed incident)', '', `| Measure | ${A.label} | ${B.label} |`, '| --- | --- | --- |');
for (const k of ['waiting', 'active', 'unclassified']) {
  out.push(line(`${k} median`, f(A.perIncidentHours[k].median), f(B.perIncidentHours[k].median)));
  out.push(line(`${k} p85`, f(A.perIncidentHours[k].p85), f(B.perIncidentHours[k].p85)));
}
out.push(line('incidents with overlapping (parallel) actions', A.perIncidentHours.incidentsWithOverlappingActions, B.perIncidentHours.incidentsWithOverlappingActions));
out.push('', '## By action (median calendar hours)', '', `| Action | Type | waiting ${A.label} | waiting ${B.label} | active ${A.label} | active ${B.label} | unclassified ${A.label} | unclassified ${B.label} |`, '| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const id of new Set([...Object.keys(A.byAction), ...Object.keys(B.byAction)])) {
  const a = A.byAction[id] ?? {}, b = B.byAction[id] ?? {};
  out.push(`| ${id} | ${(a.type ?? b.type) || ''} | ${f(a.waiting?.median)} | ${f(b.waiting?.median)} | ${f(a.active?.median)} | ${f(b.active?.median)} | ${f(a.unclassified?.median)} | ${f(b.unclassified?.median)} |`);
}
out.push('', '_Sums of waiting/active per incident can exceed cycle time when actions run in parallel; compare per-action figures in that case. No figure here describes an individual person._');
console.log(out.join('\n'));
if (opt.json) { writeFileSync(opt.json, JSON.stringify(results, null, 2)); console.error(`Wrote ${opt.json}`); }
