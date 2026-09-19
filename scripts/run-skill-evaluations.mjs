#!/usr/bin/env node
// Runs the behavioural evaluation matrix through the Claude Code CLI with this repository loaded as a plugin,
// preserves every output under tests/forward-evaluation/matrix/<case id>/, optionally grades each run with a
// second model call, and records status and run metadata back into tests/skill-evaluations.json.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync, mkdtempSync, cpSync } from 'node:fs';
import os from 'node:os';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const matrixFile = path.join(root, 'tests', 'skill-evaluations.json');
const outputRoot = path.join(root, 'tests', 'forward-evaluation', 'matrix');
const version = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).version;

function parseArgs(argv) {
  const options = { only: null, skill: null, model: null, judgeModel: null, judge: false, concurrency: 2, dryRun: false, status: false, maxTurns: 60, rerun: false, claude: process.env.CLAUDE_CLI ?? 'claude' };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i], next = () => argv[++i];
    if (arg === '--only') options.only = new Set(next().split(','));
    else if (arg === '--skill') options.skill = next();
    else if (arg === '--model') options.model = next();
    else if (arg === '--judge-model') options.judgeModel = next();
    else if (arg === '--judge') options.judge = true;
    else if (arg === '--concurrency') options.concurrency = Number(next());
    else if (arg === '--max-turns') options.maxTurns = Number(next());
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--status') options.status = true;
    else if (arg === '--rerun') options.rerun = true;
    else throw new Error(`Unknown argument ${arg}. Usage: node scripts/run-skill-evaluations.mjs [--only id,id] [--skill name] [--model m] [--judge] [--judge-model m] [--concurrency n] [--max-turns n] [--rerun] [--dry-run] [--status]`);
  }
  return options;
}

function run(command, args, { cwd, input }) {
  return new Promise(resolvePromise => {
    const started = Date.now();
    const child = spawn(command, args, { cwd, env: { ...process.env, CLAUDECODE: undefined }, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('close', code => resolvePromise({ code, stdout, stderr, durationMs: Date.now() - started }));
    child.on('error', error => resolvePromise({ code: -1, stdout, stderr: String(error), durationMs: Date.now() - started }));
    if (input) child.stdin.write(input);
    child.stdin.end();
  });
}

function parseJsonResult(stdout) {
  try { return JSON.parse(stdout); } catch {
    const start = stdout.lastIndexOf('\n{');
    if (start >= 0) { try { return JSON.parse(stdout.slice(start + 1)); } catch { /* fall through */ } }
    return null;
  }
}

/** Parses a stream-json transcript into the final result plus a compact tool log the judge can read. */
export function parseStream(stdout) {
  const events = [];
  for (const line of stdout.split('\n')) {
    if (!line.trim().startsWith('{')) continue;
    try { events.push(JSON.parse(line)); } catch { /* partial line */ }
  }
  const result = events.find(event => event.type === 'result') ?? null;
  const calls = new Map(), tools = [];
  for (const event of events) {
    const content = event.message?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (event.type === 'assistant' && block.type === 'tool_use') {
        const input = block.input ?? {};
        const summary = input.command ?? input.file_path ?? input.skill ?? input.pattern ?? JSON.stringify(input).slice(0, 200);
        const entry = { tool: block.name, input: String(summary), output: '' };
        calls.set(block.id, entry); tools.push(entry);
      } else if (event.type === 'user' && block.type === 'tool_result') {
        const entry = calls.get(block.tool_use_id);
        if (!entry) continue;
        const text = Array.isArray(block.content) ? block.content.map(part => part.text ?? '').join('\n') : String(block.content ?? '');
        entry.output = text.slice(0, 600) + (text.length > 600 ? ' …' : '');
        if (block.is_error) entry.error = true;
      }
    }
  }
  return { events, result, tools };
}

export const skillLoaded = (tools, skill) => tools.some(entry => (entry.tool === 'Skill' && entry.input.includes(skill)) || (entry.tool === 'Read' && entry.input.includes(`/skills/${skill}/SKILL.md`)));

const toolLog = tools => tools.map((entry, index) => `${index + 1}. ${entry.tool}${entry.error ? ' (error)' : ''}: ${entry.input}${entry.output ? `\n   → ${entry.output.replace(/\n/g, '\n     ')}` : ''}`).join('\n');

export function casePrompt(entry) {
  return `Use the provia-skills:${entry.skill} skill for the request below. Read that skill's SKILL.md and the references it names from the installed plugin, then follow it. Write every artefact you produce (files such as workflow.yaml, provia-project.json, catalogue.json, setup.md or reports) into the current working directory, and run the plugin's bundled scripts with node when the skill asks for them. Do not ask questions; state assumptions and continue.\n\nRequest:\n${entry.prompt}`;
}

function judgePrompt(entry, response, files, tools) {
  return `You are grading one run of an AI skill from the provia-skills plugin. Grade only what is observable in the response and files.

Skill: ${entry.skill}
Mode: ${entry.mode} (normal = complete request; incomplete = context is missing; conflicting = the request contains a contradiction or an unsafe shortcut)
Request given to the skill:
${entry.prompt}

Expected behaviour:
${entry.expected}

Shared rules every skill must respect: never invent organization IDs, approval thresholds, legal provisions, endpoints or validation results; separate confirmed facts, recommendations and unresolved decisions; do not claim a check ran or a file was written when it was not; keep conflicts unresolved rather than choosing silently; end with a next-step recommendation.

Skill loaded by the run (a Skill call or a Read of its SKILL.md): ${skillLoaded(tools, entry.skill) ? 'yes' : 'no. Grade the behaviour anyway, and mention in reasons that the skill instructions were not read.'}

Tool calls the run actually made, in order, with the start of each result (a claim that a script ran or a file was written is supported only when it appears here):
${toolLog(tools).slice(0, 20000) || '(none)'}

Files written by the run (name: first 1500 characters):
${files.map(file => `--- ${file.name}\n${file.preview}`).join('\n') || '(none)'}

Final response of the run:
--- BEGIN RESPONSE
${response.slice(0, 30000)}
--- END RESPONSE

Reply with only a JSON object: {"verdict": "pass" | "fail" | "unclear", "reasons": ["..."], "violations": ["..."]}. "pass" means the expected behaviour and the shared rules are observed; "fail" means a clear violation; "unclear" means the evidence is insufficient.`;
}

function collectFiles(dir) {
  const files = [];
  const walk = (folder, prefix) => {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.name.startsWith('.') || ['run.json', 'judge.json', 'response.md', 'stdout.json', 'transcript.jsonl', 'tools.md'].includes(rel)) continue;
      if (entry.isDirectory()) walk(path.join(folder, entry.name), rel);
      else if (entry.isFile()) {
        let preview = '';
        try { preview = readFileSync(path.join(folder, entry.name), 'utf8').slice(0, 1500); } catch { preview = '(binary)'; }
        files.push({ name: rel, preview });
      }
    }
  };
  walk(dir, '');
  return files;
}

async function evaluate(entry, options) {
  // Claude Code blocks writes inside a loaded plugin directory, so each case runs in a temporary folder
  // outside the repository and its outputs are copied into tests/forward-evaluation/matrix/<id>/ afterwards.
  const preserved = path.join(outputRoot, entry.id);
  const dir = path.join(mkdtempSync(path.join(os.tmpdir(), 'provia-eval-')), entry.id);
  mkdirSync(dir, { recursive: true });
  const args = ['-p', '--plugin-dir', root, '--permission-mode', 'acceptEdits', '--allowedTools', 'Read,Write,Edit,Glob,Grep,Skill,Bash(node *),Bash(mkdir *),Bash(ls *),Bash(cat *),Bash(sed *),Bash(grep *),Bash(head *),Bash(wc *)', '--output-format', 'stream-json', '--verbose', '--max-turns', String(options.maxTurns), '--no-session-persistence'];
  if (options.model) args.push('--model', options.model);
  args.push(casePrompt(entry));
  if (options.dryRun) { console.log(`[dry-run] ${entry.id}: ${options.claude} ${args.map(a => JSON.stringify(a)).join(' ')}`); return null; }
  const result = await run(options.claude, args, { cwd: dir });
  writeFileSync(path.join(dir, 'transcript.jsonl'), result.stdout);
  const stream = parseStream(result.stdout);
  const parsed = stream.result;
  const response = parsed?.result ?? '';
  writeFileSync(path.join(dir, 'response.md'), response || `(no result; exit ${result.code})\n${result.stderr}`);
  writeFileSync(path.join(dir, 'tools.md'), `# Tool calls\n\n${toolLog(stream.tools) || '(none)'}\n`);
  const record = {
    id: entry.id, skill: entry.skill, pluginVersion: version, at: new Date().toISOString(), model: options.model ?? (Object.keys(parsed?.modelUsage ?? {}).filter(m => !m.includes('haiku')).join(',') || null),
    exitCode: result.code, durationMs: result.durationMs, costUsd: parsed?.total_cost_usd ?? null, numTurns: parsed?.num_turns ?? null, sessionId: parsed?.session_id ?? null, stopReason: parsed?.stop_reason ?? null,
    toolCalls: stream.tools.length, skillLoaded: skillLoaded(stream.tools, entry.skill), files: collectFiles(dir).map(file => file.name), output: `tests/forward-evaluation/matrix/${entry.id}/`,
  };
  writeFileSync(path.join(dir, 'run.json'), JSON.stringify(record, null, 2) + '\n');
  const finished = result.code === 0 && parsed?.stop_reason === 'end_turn' && response.trim().length > 0;
  record.finished = finished;
  if (!finished) record.note = `Run did not finish (exit ${result.code}, stop ${parsed?.stop_reason ?? 'none'}); raise --max-turns or inspect tools.md. Not judged.`;
  let judge = null;
  if (options.judge && finished) {
    const judgeArgs = ['-p', '--output-format', 'json', '--max-turns', '1', '--tools', '', '--no-session-persistence'];
    if (options.judgeModel) judgeArgs.push('--model', options.judgeModel);
    judgeArgs.push(judgePrompt(entry, response, collectFiles(dir), stream.tools));
    const graded = await run(options.claude, judgeArgs, { cwd: dir });
    const judged = parseJsonResult(graded.stdout);
    let verdict = null;
    try { verdict = JSON.parse((judged?.result ?? '').replace(/^```json\s*|```\s*$/g, '').trim()); } catch { verdict = null; }
    judge = { at: new Date().toISOString(), model: options.judgeModel ?? null, exitCode: graded.code, verdict: verdict?.verdict ?? 'unclear', reasons: verdict?.reasons ?? [], violations: verdict?.violations ?? [], raw: verdict ? undefined : (judged?.result ?? graded.stderr).slice(0, 2000) };
    writeFileSync(path.join(dir, 'judge.json'), JSON.stringify(judge, null, 2) + '\n');
  }
  if (existsSync(preserved)) rmSync(preserved, { recursive: true, force: true });
  mkdirSync(path.dirname(preserved), { recursive: true });
  cpSync(dir, preserved, { recursive: true });
  rmSync(path.dirname(dir), { recursive: true, force: true });
  return { record, judge };
}

export function statusTable(cases) {
  const counts = {};
  for (const entry of cases) counts[entry.status] = (counts[entry.status] ?? 0) + 1;
  const stale = cases.filter(entry => entry.run && entry.run.pluginVersion !== version).length;
  const skillNotLoaded = cases.filter(entry => entry.run && entry.run.skillLoaded === false).map(entry => entry.id);
  return { total: cases.length, counts, stale, skillNotLoaded, version };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = parseArgs(process.argv.slice(2));
  const cases = JSON.parse(readFileSync(matrixFile, 'utf8'));
  if (options.status) { console.log(JSON.stringify(statusTable(cases), null, 2)); process.exit(0); }
  let selected = cases.filter(entry => (!options.only || options.only.has(entry.id)) && (!options.skill || entry.skill === options.skill));
  if (!options.rerun && !options.only && !options.skill) selected = selected.filter(entry => entry.status === 'not_run' || entry.run?.pluginVersion !== version);
  if (!selected.length) { console.log('Nothing to run; use --rerun, --only or --skill to force.'); process.exit(0); }
  console.log(`${selected.length} case(s) selected; plugin ${version}; concurrency ${options.concurrency}.`);
  const queue = [...selected];
  const persist = () => writeFileSync(matrixFile, JSON.stringify(cases, null, 2) + '\n');
  const worker = async () => {
    while (queue.length) {
      const entry = queue.shift();
      const started = Date.now();
      const outcome = await evaluate(entry, options);
      if (!outcome) continue;
      const target = cases.find(item => item.id === entry.id);
      target.run = outcome.record;
      if (outcome.judge) {
        target.judge = { at: outcome.judge.at, model: outcome.judge.model, verdict: outcome.judge.verdict, reasons: outcome.judge.reasons, violations: outcome.judge.violations };
        target.status = outcome.judge.verdict === 'pass' ? 'passed' : outcome.judge.verdict === 'fail' ? 'failed' : 'unclear';
        // A run that never read the skill is not evidence about the skill, whatever the model did on its own.
        if (target.status === 'passed' && !outcome.record.skillLoaded) { target.status = 'unclear'; target.judge.note = 'Behaviour matched the expectation, but the run never loaded the skill; not evidence for the skill instructions.'; }
      }
      else target.status = outcome.record.finished ? 'run' : 'error';
      if (!outcome.record.finished) { target.status = 'error'; delete target.judge; }
      if (target.status !== 'failed') delete target.triage;
      persist();
      console.log(`${entry.id}: ${target.status} (${Math.round((Date.now() - started) / 1000)}s, ${outcome.record.numTurns ?? '?'} turns${outcome.record.costUsd != null ? `, $${outcome.record.costUsd.toFixed(2)}` : ''})`);
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, options.concurrency) }, worker));
  console.log(JSON.stringify(statusTable(cases), null, 2));
}
