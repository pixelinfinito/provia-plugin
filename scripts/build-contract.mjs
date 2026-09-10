import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const sourceRoot = path.resolve(process.argv[2] || '');
if (!process.argv[2] || !fs.existsSync(path.join(sourceRoot, 'frontend/src/lib/workflow-io/validate.ts'))) {
  throw new Error('Usage: node scripts/build-contract.mjs /path/to/processonrails');
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pnpm = path.join(sourceRoot, 'node_modules/.pnpm');
const require = createRequire(import.meta.url);
function dependency(name) {
  const directory = fs.readdirSync(pnpm).find(p => p.startsWith(name + '@'));
  if (!directory) throw new Error(`Install Provia dependencies first: missing ${name}`);
  return require(path.join(pnpm, directory, 'node_modules', name));
}
const { build } = dependency('esbuild');
const ts = dependency('typescript');
const aiFile = path.join(sourceRoot, 'frontend/src/components/action/AIAgentConfig.tsx');
const functions = new Set(['normalizeFieldKeys', 'isPositiveNumber', 'getArtifactValidationIssues', 'validateAIAgentConfig']);
const tree = ts.createSourceFile(aiFile, fs.readFileSync(aiFile, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const aiValidation = tree.statements.filter(node => {
  if (ts.isFunctionDeclaration(node)) return functions.has(node.name?.text);
  return ts.isVariableStatement(node) && node.declarationList.declarations.some(d => functions.has(d.name.getText(tree)));
}).map(node => node.getText(tree)).join('\n');
if (aiValidation.match(/(?:const|function) /g)?.length < 4) throw new Error('AI validation extraction changed; review the source contract');
const entry = `
export { parseYamlToDraft } from './frontend/src/lib/workflow-io/parse';
export { validateWorkflowDraft } from './frontend/src/lib/workflow-io/validate';
export { buildImportPlan, planToImportRequest } from './frontend/src/lib/workflow-io/create';
export { extractWorkflowsFromZip } from './frontend/src/lib/workflow-io/zip';
export { importWorkflowPlanSchema } from './backend/src/lib/schemas/workflow-import.schemas';
export { validateTriggerConfigShape } from './backend/src/lib/trigger-config-validation';
export { validateSchemaDefinition } from './backend/src/lib/metadata';
export { httpRequestActionConfigSchema } from './backend/src/lib/schemas/http-request.schemas';
export { waitConfigSchema, notificationConfigSchema, subWorkflowConfigSchema } from './backend/src/lib/schemas/action-type.schemas';
`;
const out = path.join(root, 'contracts/workflow-v1/engine.mjs');
fs.mkdirSync(path.dirname(out), { recursive: true });
const result = await build({
  stdin: { contents: entry, resolveDir: sourceRoot, loader: 'ts', sourcefile: 'contract-entry.ts' },
  outfile: out, bundle: true, platform: 'node', format: 'esm', target: 'node20', minify: true,
  metafile: true, legalComments: 'external',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  alias: { '@': path.join(sourceRoot, 'frontend/src') },
  plugins: [{ name: 'pure-ai-validation', setup(builder) {
    builder.onLoad({ filter: /AIAgentConfig\.tsx$/ }, () => ({ contents: aiValidation, loader: 'ts' }));
  } }],
});
const sha = data => createHash('sha256').update(data).digest('hex');
const sources = {};
const packages = new Map();
for (const input of Object.keys(result.metafile.inputs)) {
  const absolute = path.resolve(input);
  if (!fs.existsSync(absolute)) continue;
  if (absolute.startsWith(sourceRoot + '/') && !absolute.includes('/node_modules/')) {
    sources[path.relative(sourceRoot, absolute)] = sha(fs.readFileSync(absolute));
  } else if (absolute.includes('/node_modules/')) {
    let dir = path.dirname(absolute);
    while (!fs.existsSync(path.join(dir, 'package.json')) && path.dirname(dir) !== dir) dir = path.dirname(dir);
    if (fs.existsSync(path.join(dir, 'package.json'))) packages.set(dir, JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')));
  }
}
sources['frontend/src/components/action/AIAgentConfig.tsx'] = sha(fs.readFileSync(aiFile));
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: sourceRoot, encoding: 'utf8' }).trim();
fs.writeFileSync(path.join(root, 'contracts/workflow-v1/contract-lock.json'), JSON.stringify({
  apiVersion: 'provia.ao/v1', sourceRevision: revision, generatedBy: 'scripts/build-contract.mjs',
  engineSha256: sha(fs.readFileSync(out)), sourceFiles: Object.fromEntries(Object.entries(sources).sort()),
  libraries: [...packages.values()].map(p => ({ name: p.name, version: p.version, license: p.license })).sort((a,b)=>a.name.localeCompare(b.name)),
}, null, 2) + '\n');
let notices = '# Third-party notices\n\nThe contract engine bundles the following libraries.\n';
for (const [dir, p] of packages) {
  const license = fs.readdirSync(dir).find(f => /^(license|licence)(\.|$)/i.test(f));
  if (!license) throw new Error(`Missing license for ${p.name}; review before release`);
  notices += `\n## ${p.name} ${p.version}\n\n${fs.readFileSync(path.join(dir, license), 'utf8')}\n`;
}
fs.writeFileSync(path.join(root, 'THIRD_PARTY_NOTICES.md'), notices);
process.stdout.write(`Built contract from ${revision}: ${fs.statSync(out).size} bytes; ${Object.keys(sources).length} source fingerprints\n`);
