#!/usr/bin/env python3
"""Build a deterministic documentation download from an explicit source allowlist."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, default=root / 'dist')
parser.add_argument('--evaluations', type=Path, default=root / 'tests/skill-evaluations.json', help='behavioural evaluation matrix used by the release gate')
parser.add_argument('--allow-stale-evaluations', action='store_true', help='build even when cases were not run against this version; recorded in release.json')
args = parser.parse_args()
version = json.loads((root / 'package.json').read_text())['version']
SKILL_COUNT = 16
for manifest in ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json']:
    data = json.loads((root / manifest).read_text())
    if data['name'] != 'provia-skills' or data['version'] != version:
        raise SystemExit(f'Manifest mismatch: {manifest}')
lock = json.loads((root / 'contracts/workflow-v1/contract-lock.json').read_text())
if hashlib.sha256((root / 'contracts/workflow-v1/engine.mjs').read_bytes()).hexdigest() != lock['engineSha256']:
    raise SystemExit('Contract checksum mismatch')
folders = ['.claude-plugin', '.codex-plugin', 'skills', 'references', 'contracts', 'examples', 'scripts', 'tests']
output = args.output.resolve()
if output == root or output in root.parents or any(output == root / folder or root / folder in output.parents for folder in folders):
    raise SystemExit('Invalid release output: choose a directory outside bundled source folders and their ancestors')
files = [root / name for name in ['package.json', 'catalog.json', 'README.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md']]
for folder in folders:
    files.extend(p for p in (root / folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.name not in ('.DS_Store', 'transcript.jsonl'))
if any(p.is_symlink() for p in files):
    raise SystemExit('Symlinks are not allowed in releases')
if len(list((root / 'skills').glob('*/SKILL.md'))) != SKILL_COUNT:
    raise SystemExit(f'Expected the full {SKILL_COUNT}-skill catalog')
if len(json.loads((root / 'catalog.json').read_text())['skills']) != SKILL_COUNT:
    raise SystemExit('catalog.json and skills/ disagree; run node scripts/build-skills.mjs')
# Release gate: every behavioural case must have been run against this version; failures need a triage note.
cases = json.loads(args.evaluations.read_text())
stale = [c['id'] for c in cases if c.get('status') == 'not_run' or (c.get('run') or {}).get('pluginVersion') != version]
untriaged = [c['id'] for c in cases if c.get('status') == 'failed' and not c.get('triage')]
evaluations = {
    'cases': len(cases), 'passed': sum(c.get('status') == 'passed' for c in cases), 'failed': sum(c.get('status') == 'failed' for c in cases),
    'unclear': sum(c.get('status') == 'unclear' for c in cases), 'run': sum(c.get('status') == 'run' for c in cases), 'notRunForThisVersion': len(stale), 'untriagedFailures': len(untriaged),
}
if (stale or untriaged) and not args.allow_stale_evaluations:
    raise SystemExit(f'Evaluation gate: {len(stale)} case(s) not run against {version} and {len(untriaged)} untriaged failure(s). Run node scripts/run-skill-evaluations.mjs --judge, triage failures, or pass --allow-stale-evaluations.')
args.output.mkdir(parents=True, exist_ok=True)
archive = args.output / f'provia-skills-{version}.zip'
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for file in sorted(files):
        item = zipfile.ZipInfo('provia-skills/' + file.relative_to(root).as_posix(), date_time=(2026, 1, 1, 0, 0, 0))
        item.create_system = 3
        item.external_attr = 0o100644 << 16
        item.compress_type = zipfile.ZIP_DEFLATED
        z.writestr(item, file.read_bytes(), compresslevel=9)
checksum = hashlib.sha256(archive.read_bytes()).hexdigest()
(args.output / 'SHA256SUMS').write_text(f'{checksum}  {archive.name}\n')
(args.output / 'release.json').write_text(json.dumps({
    'name': 'provia-skills', 'version': version, 'asset': archive.name, 'sha256': checksum,
    'skillCount': SKILL_COUNT, 'evaluations': evaluations, 'evaluationGate': 'bypassed' if (stale or untriaged) else 'passed', 'apiVersion': lock['apiVersion'], 'contractRevision': lock['sourceRevision'],
    'sourceRepository': 'https://github.com/pixelinfinito/provia-plugin',
    'distribution': 'Provia documentation only',
    'runtime': {'validator': 'Node.js 20.11 or newer', 'networkRequired': False},
}, indent=2) + '\n')
print(f'{archive.name}: {checksum}')
