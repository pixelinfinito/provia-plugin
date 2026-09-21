#!/usr/bin/env node
// Deterministic review gate for action briefs: reports, per action, which of the five description parts are missing,
// leaked implementer notes, over-long descriptions (warning at 4 500 characters, error above the product limit) and unset due
// dates. It checks presence, not quality.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as engine from '../contracts/workflow-v1/engine.mjs';

export const MAX_DESCRIPTION = 5000;
export const WARN_DESCRIPTION = 4500;
const HUMAN_TYPES = new Set(['standard', 'decision', 'form_fill']);
const PARTS = [
  { key: 'task', labels: ['tarefa', 'task'] },
  { key: 'method', labels: ['como', 'how'] },
  { key: 'evidence', labels: ['evidencia', 'evidence'] },
  { key: 'doneWhen', labels: ['concluido quando', 'done when'] },
  { key: 'exceptions', labels: ['excepcoes', 'excecoes', 'exceptions'] },
];
// Text addressed to the implementer, never to the assignee.
const LEAKS = [
  /setup\.md/i, /provia-project\.json/i, /\bmanifesto?\b/i, /\buuid\b/i, /\bTODO\b/, /\bFIXME\b/, /\bplaceholder/i, /\$[A-Z][A-Z0-9_]*/, /\{\{\s*secret:/i,
  /pendente[s]? (de|em) (configura|setup)/i, /a configurar\b/i, /por configurar\b/i, /atribui[cç][aã]o pendente/i, /\bimplementador/i, /\bimplementer\b/i, /pending (configuration|setup|assignment)/i, /to be configured/i, /ver setup/i, /see setup/i,
];
const normalize = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function reviewDescription(description) {
  const text = typeof description === 'string' ? description : '';
  const lines = normalize(text).split(/\r?\n/).map(line => line.trim());
  const parts = {};
  for (const part of PARTS) parts[part.key] = lines.some(line => part.labels.some(label => line.startsWith(label + ':')));
  const leaks = LEAKS.filter(pattern => pattern.test(text)).map(pattern => pattern.source);
  return { parts, missing: PARTS.filter(part => !parts[part.key]).map(part => part.key), leaks, length: text.length, tooLong: text.length > MAX_DESCRIPTION, nearLimit: text.length > WARN_DESCRIPTION && text.length <= MAX_DESCRIPTION, empty: text.trim().length === 0 };
}

export function reviewWorkflow(text) {
  const parsed = engine.parseYamlToDraft(text);
  if (!parsed.draft || parsed.syntaxErrors.length) return { valid: false, error: 'The workflow could not be parsed; run the validator first.', actions: [] };
  const draft = parsed.draft;
  const actions = (draft.actions ?? []).map(action => {
    const applicable = HUMAN_TYPES.has(action.type);
    const review = reviewDescription(action.description);
    const due = action.due ? 'set' : applicable ? 'missing' : 'not_applicable';
    const complete = applicable ? review.missing.length === 0 && review.leaks.length === 0 && !review.tooLong : !review.empty && review.leaks.length === 0 && !review.tooLong;
    return { id: action.id, name: action.name, type: action.type, applicable, complete, parts: review.parts, missing: applicable ? review.missing : [], leaks: review.leaks, length: review.length, tooLong: review.tooLong, nearLimit: review.nearLimit, empty: review.empty, due };
  });
  const applicable = actions.filter(action => action.applicable);
  return {
    valid: true, workflow: draft.metadata?.name ?? null, reviewedActions: actions.length,
    summary: { applicable: applicable.length, complete: applicable.filter(action => action.complete).length, incomplete: applicable.filter(action => !action.complete).length, automatedWithoutDescription: actions.filter(action => !action.applicable && action.empty).length, leaks: actions.filter(action => action.leaks.length).length, dueMissing: actions.filter(action => action.due === 'missing').length, nearLimit: actions.filter(action => action.nearLimit).length },
    warnings: actions.filter(action => action.nearLimit).map(action => ({ id: action.id, code: 'description_near_limit', message: `${action.length} characters; the product limit is ${MAX_DESCRIPTION}. Fold or shorten before it fails.` })),
    actions,
    note: 'Presence of the labelled parts (Tarefa/Task, Como/How, Evidência/Evidence, Concluído quando/Done when, Excepções/Exceptions), leaked implementer notes, length (warning from 4500 characters) and due are checked. Wording quality and business correctness are not certified; see references/action-writing.md.',
  };
}

export function renderMarkdown(report, file) {
  if (!report.valid) return `# Action review\n\n${report.error}\n`;
  const lines = [`# Action review: ${report.workflow ?? file}`, '', `${report.reviewedActions} actions reviewed; ${report.summary.complete} of ${report.summary.applicable} human/AI actions have all five parts; ${report.summary.leaks} with leaked implementer notes; ${report.summary.dueMissing} without \`due\`.`, '', '| Action | Type | Missing parts | Leaks | Length | Due |', '| --- | --- | --- | --- | --- | --- |'];
  for (const action of report.actions) lines.push(`| \`${action.id}\` ${action.name} | ${action.type} | ${action.applicable ? (action.missing.join(', ') || 'none') : action.empty ? 'no description' : 'n/a'} | ${action.leaks.length ? action.leaks.join(', ') : 'none'} | ${action.length}${action.tooLong ? ' (over 5000)' : action.nearLimit ? ' (warning: over 4500)' : ''} | ${action.due} |`);
  lines.push('', report.note, '');
  return lines.join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [file, flag, ...extra] = process.argv.slice(2);
  if (!file || extra.length || (flag && flag !== '--markdown')) { process.stderr.write('Usage: node scripts/review-actions.mjs workflow.yaml [--markdown]\n'); process.exitCode = 2; }
  else {
    try {
      const report = reviewWorkflow(fs.readFileSync(file, 'utf8'));
      process.stdout.write(flag === '--markdown' ? renderMarkdown(report, file) : JSON.stringify(report, null, 2) + '\n');
      process.exitCode = report.valid && report.actions.every(action => action.complete) ? 0 : 1;
    } catch {
      process.stdout.write(JSON.stringify({ valid: false, error: 'Cannot read the file.' }) + '\n');
      process.exitCode = 2;
    }
  }
}
