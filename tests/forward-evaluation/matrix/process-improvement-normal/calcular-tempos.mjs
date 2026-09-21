#!/usr/bin/env node
// Cálculo reproduzível de tempos de ciclo, espera e trabalho activo a partir de
// uma exportação CSV do Provia (uma linha por acção de um caso).
//
// Uso (Node 20+, sem rede):
//   node calcular-tempos.mjs exportacao.csv \
//     --caso=incident_id --accao=action_name --activada=activated_at --concluida=completed_at \
//     [--iniciada=started_at] [--criado=incident_created_at] [--concluido-caso=incident_completed_at] \
//     [--grupo=assignee_group] [--versao=workflow_version] [--resultado=decision_outcome] \
//     [--periodo=A:2026-05-01:2026-06-30] [--periodo=B:2026-07-01:2026-08-31] \
//     [--fuso=Africa/Luanda]
//
// Os nomes das colunas variam com a exportação; passe-os nos parâmetros.
// O script não inventa colunas: se faltar uma coluna essencial, pára e diz qual.
// Os períodos classificam os casos pela data de conclusão do caso (denominador:
// casos concluídos no período). Casos sem conclusão são contados à parte, nunca
// misturados nas medianas.

import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const opt = Object.fromEntries(
  args.filter((a) => a.startsWith('--')).map((a) => {
    const [k, ...v] = a.slice(2).split('=');
    return [k, v.join('=')];
  }),
);
const periods = args
  .filter((a) => a.startsWith('--periodo='))
  .map((a) => {
    const [label, from, to] = a.slice('--periodo='.length).split(':');
    return { label, from: new Date(`${from}T00:00:00Z`), to: new Date(`${to}T23:59:59Z`) };
  });

if (!file) fail('Indique o ficheiro CSV exportado do Provia.');
for (const k of ['caso', 'accao', 'activada', 'concluida']) {
  if (!opt[k]) fail(`Falta o parâmetro --${k}=<coluna>. Sem ele o cálculo não é reproduzível.`);
}

// --- CSV -------------------------------------------------------------------
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',' || c === ';') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.some((x) => x !== ''));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

const rows = parseCsv(readFileSync(file, 'utf8'));
if (!rows.length) fail('O ficheiro não tem linhas.');
for (const k of ['caso', 'accao', 'activada', 'concluida']) {
  if (!(opt[k] in rows[0])) fail(`A coluna "${opt[k]}" (--${k}) não existe. Colunas encontradas: ${Object.keys(rows[0]).join(', ')}`);
}

// --- Cobertura e qualidade --------------------------------------------------
const warnings = [];
const noTz = rows.filter((r) => r[opt.activada] && !/([zZ]|[+-]\d{2}:?\d{2})$/.test(r[opt.activada]));
if (noTz.length) warnings.push(`${noTz.length} registos com data sem fuso horário explícito; assumido UTC ao interpretar (confirme --fuso=${opt.fuso ?? 'Africa/Luanda'} na exportação).`);
const seen = new Map();
for (const r of rows) {
  const key = `${r[opt.caso]}|${r[opt.accao]}|${r[opt.activada]}`;
  seen.set(key, (seen.get(key) ?? 0) + 1);
}
const dups = [...seen.values()].filter((n) => n > 1).length;
if (dups) warnings.push(`${dups} combinações caso+acção+activação duplicadas; contadas uma vez.`);
const uniqueRows = [...new Map(rows.map((r) => [`${r[opt.caso]}|${r[opt.accao]}|${r[opt.activada]}`, r])).values()];

const versions = opt.versao ? new Set(uniqueRows.map((r) => r[opt.versao]).filter(Boolean)) : null;
if (versions && versions.size > 1) warnings.push(`Mais de uma versão do workflow na exportação (${[...versions].join(', ')}); compare períodos dentro da mesma versão ou trate a mudança como variável.`);

// --- Funções de tempo ---------------------------------------------------------
const d = (s) => (s ? new Date(s) : null);
const days = (a, b) => (b - a) / 86_400_000;
function workdays(a, b) {
  // Conta apenas seg–sex, como o Provia (feriados não são considerados).
  let n = 0;
  const cur = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()));
  const end = new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()));
  while (cur < end) { cur.setUTCDate(cur.getUTCDate() + 1); if (cur.getUTCDay() % 6) n++; }
  return n;
}
const q = (arr, p) => {
  if (!arr.length) return null;
  const s = [...arr].sort((x, y) => x - y);
  return s[Math.min(s.length - 1, Math.floor(p * s.length))];
};
const fmt = (x) => (x == null ? '—' : x.toFixed(1));

// --- Agregação por caso --------------------------------------------------------
const cases = new Map();
for (const r of uniqueRows) {
  const c = cases.get(r[opt.caso]) ?? { id: r[opt.caso], actions: [], created: null, completed: null };
  c.actions.push(r);
  if (opt.criado && r[opt.criado]) c.created = d(r[opt.criado]);
  if (opt['concluido-caso'] && r[opt['concluido-caso']]) c.completed = d(r[opt['concluido-caso']]);
  cases.set(c.id, c);
}
for (const c of cases.values()) {
  const act = c.actions.map((r) => d(r[opt.activada])).filter(Boolean);
  const done = c.actions.map((r) => d(r[opt.concluida]));
  if (!c.created) c.created = act.length ? new Date(Math.min(...act)) : null;
  if (!c.completed) c.completed = done.every(Boolean) && done.length ? new Date(Math.max(...done)) : null;
  if (!opt['concluido-caso'] && !c.completed) c.open = true;
}
if (!opt['concluido-caso']) warnings.push('Sem coluna de conclusão do caso (--concluido-caso): a conclusão foi aproximada pela última acção concluída; casos com acções por concluir contam como abertos.');

const buckets = periods.length ? periods : [{ label: 'total', from: new Date(0), to: new Date(8.64e15) }];

for (const p of buckets) {
  const inP = [...cases.values()].filter((c) => c.completed && c.completed >= p.from && c.completed <= p.to);
  const open = [...cases.values()].filter((c) => !c.completed && c.created && c.created >= p.from && c.created <= p.to);
  const cycle = inP.filter((c) => c.created).map((c) => days(c.created, c.completed));
  const cycleWd = inP.filter((c) => c.created).map((c) => workdays(c.created, c.completed));
  console.log(`\n== Período ${p.label} (casos concluídos entre ${iso(p.from)} e ${iso(p.to)}) ==`);
  console.log(`Casos concluídos (denominador): ${inP.length}   Casos abertos criados no período (excluídos das medianas): ${open.length}`);
  console.log(`Tempo de ciclo do caso — dias corridos: mediana ${fmt(q(cycle, 0.5))}, P90 ${fmt(q(cycle, 0.9))}; dias úteis (seg–sex): mediana ${fmt(q(cycleWd, 0.5))}, P90 ${fmt(q(cycleWd, 0.9))}`);

  const byAction = new Map();
  for (const c of inP) for (const r of c.actions) {
    const a = d(r[opt.activada]), z = d(r[opt.concluida]), s = opt.iniciada ? d(r[opt.iniciada]) : null;
    if (!a || !z) continue;
    const b = byAction.get(r[opt.accao]) ?? { total: [], wait: [], active: [], n: 0, returned: 0, groups: new Set() };
    b.n++;
    b.total.push(days(a, z));
    if (s) { b.wait.push(days(a, s)); b.active.push(days(s, z)); }
    if (opt.resultado && /return|devolv|retorn/i.test(r[opt.resultado] ?? '')) b.returned++;
    if (opt.grupo && r[opt.grupo]) b.groups.add(r[opt.grupo]);
    byAction.set(r[opt.accao], b);
  }
  const sumMed = [...byAction.values()].reduce((s, b) => s + (q(b.total, 0.5) ?? 0), 0);
  console.log('\nAcção | n | activada→concluída mediana (d) | P90 (d) | espera mediana (d) | activo mediana (d) | % da soma das medianas | devoluções | grupos');
  for (const [name, b] of [...byAction].sort((x, y) => (q(y[1].total, 0.5) ?? 0) - (q(x[1].total, 0.5) ?? 0))) {
    const med = q(b.total, 0.5);
    console.log(`${name} | ${b.n} | ${fmt(med)} | ${fmt(q(b.total, 0.9))} | ${fmt(q(b.wait, 0.5))} | ${fmt(q(b.active, 0.5))} | ${sumMed ? ((med / sumMed) * 100).toFixed(0) : '—'}% | ${b.returned} | ${[...b.groups].join(', ') || '—'}`);
  }
  if (!opt.iniciada) console.log('(espera e activo: sem coluna --iniciada a espera dentro da acção não é observável; só activada→concluída é calculada.)');
}

console.log('\n== Avisos de cobertura ==');
for (const w of warnings) console.log(`- ${w}`);
if (!warnings.length) console.log('- nenhum');
console.log('\nNota: durações brutas por acção não medem o desempenho de uma pessoa; leia-as com o volume, a complexidade e a versão do workflow de cada período.');

function iso(x) { return x.toISOString().slice(0, 10); }
function fail(msg) { console.error(`Erro: ${msg}`); process.exit(1); }
