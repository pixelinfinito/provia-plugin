#!/usr/bin/env node
// Builds the `workflow_access_apply` request for one workflow from the manifest and its receipts, and the operation revision
// that keys it. The idempotency key is `<project.key>/access/<workflow key>/<revision>`; the revision is reused only when the
// canonical hash of the complete payload (workflowId or workflowName, grants, mode, groupRefs) equals a stored operation, so a
// corrected group mapping or a switch of selector mints a new key instead of answering IDEMPOTENCY_CONFLICT. `--retry` resends
// the last stored payload verbatim. The script prints the request and the operation entry to append to
// `workflows[].access.operations[]`; it never calls the tool and never writes the manifest.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadManifest, checkManifest } from './lib/project-manifest.mjs';
import { planAccessApply } from './lib/workflow-access.mjs';

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const [manifestFile, workflowKey] = args;
    const option = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
    const flags = new Set(args.filter(arg => arg.startsWith('--')));
    for (const flag of flags) if (!['--workflow-id', '--mode', '--retry', '--output'].includes(flag)) throw new Error(`Unknown option ${flag}`);
    if (!manifestFile || !workflowKey || workflowKey.startsWith('--')) throw new Error('Usage: node scripts/plan-workflow-access.mjs provia-project.json <workflow key> [--workflow-id <uuid>] [--mode merge|replace] [--retry] [--output request.json]');
    const { manifest, raw, baseDir } = loadManifest(manifestFile);
    const { errors } = checkManifest(raw, baseDir);
    if (errors.length) throw new Error(`Manifest errors: ${errors.map(e => `${e.path}: ${e.message}`).join('; ')}`);
    const plan = planAccessApply(manifest, workflowKey, { workflowId: option('--workflow-id') ?? null, mode: option('--mode') ?? 'merge', retry: flags.has('--retry') });
    const result = {
      request: plan.request, dryRunFirst: { ...plan.request, dryRun: true }, operation: plan.operation, reuse: plan.reuse, pendingGroupRefs: plan.pending,
      note: plan.reuse ? 'Same payload as a stored operation: the key is reused for a retry and the payload is sent verbatim.' : 'New payload: a new revision was minted. Append `operation` to workflows[].access.operations[] once the call is made, then read workflow_get.access back into access.applied[].',
    };
    if (plan.request.mode === 'replace') result.note += ' replace revokes every grant outside this set: run the dry run, have the reviewer accept revoked[], then commit.';
    const output = option('--output');
    if (output) writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = plan.pending.length && plan.request.mode === 'replace' ? 1 : 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
