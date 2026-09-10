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
args = parser.parse_args()
version = json.loads((root / 'package.json').read_text())['version']
for manifest in ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json']:
    data = json.loads((root / manifest).read_text())
    if data['name'] != 'provia-skills' or data['version'] != version:
        raise SystemExit(f'Manifest mismatch: {manifest}')
lock = json.loads((root / 'contracts/workflow-v1/contract-lock.json').read_text())
if hashlib.sha256((root / 'contracts/workflow-v1/engine.mjs').read_bytes()).hexdigest() != lock['engineSha256']:
    raise SystemExit('Contract checksum mismatch')
folders = ['.claude-plugin', '.codex-plugin', 'skills', 'references', 'contracts', 'examples', 'scripts', 'tests']
files = [root / name for name in ['package.json', 'catalog.json', 'README.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md']]
for folder in folders:
    files.extend(p for p in (root / folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.name != '.DS_Store')
if any(p.is_symlink() for p in files):
    raise SystemExit('Symlinks are not allowed in releases')
if len(list((root / 'skills').glob('*/SKILL.md'))) != 14:
    raise SystemExit('Expected the full 14-skill catalog')
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
    'skillCount': 14, 'apiVersion': lock['apiVersion'], 'contractRevision': lock['sourceRevision'],
    'sourceRepository': 'https://github.com/pixelinfinito/provia-plugin',
    'distribution': 'Provia documentation only',
    'runtime': {'validator': 'Node.js 20.11 or newer', 'networkRequired': False},
}, indent=2) + '\n')
print(f'{archive.name}: {checksum}')
