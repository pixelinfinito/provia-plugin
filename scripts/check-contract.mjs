import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const folder = new URL('../contracts/workflow-v1/', import.meta.url);
const lock = JSON.parse(fs.readFileSync(new URL('contract-lock.json', folder), 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
if (hash(fs.readFileSync(new URL('engine.mjs', folder))) !== lock.engineSha256) throw new Error('Bundled contract checksum mismatch. Rebuild from the approved Provia source.');
if (process.argv[2]) {
  for (const [name, expected] of Object.entries(lock.sourceFiles)) {
    if (hash(fs.readFileSync(path.join(process.argv[2], name))) !== expected) throw new Error(`Contract source changed: ${name}. Refresh the contract and rerun the examples and tests.`);
  }
}
console.log(`Contract integrity verified: ${lock.sourceRevision}${process.argv[2] ? '; source fingerprints match' : '; source checkout not compared'}`);
