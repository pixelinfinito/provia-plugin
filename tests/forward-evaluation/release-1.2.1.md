# Provia Skills 1.2.1 release verification

## Publication status

Publication is held pending the maintainer's decision on the incomplete evaluation gate. The release source and documentation changes are committed locally. No v1.2.1 tag or GitHub release has been published.

## Completed checks

- 152 non-browser automated tests passed. The browser scenario was not rerun for this formatting-guidance patch.
- `build-skills --check` passed for all 16 generated skills and README tables.
- Bundled contract checksum verification passed. The contract remains at `fed8efaf019abc901cb2b229f3676dc4031126fa`; source drift was not claimed to be resolved.
- Claude's repository marketplace manifest validation passed.
- Five versioned example maps and handovers regenerated and passed the automated release checks.
- The rich Markdown example parsed as a YAML string, retained its formatting through JSON, produced the expected Markdown elements and passed both workflow validation and the action review gate. It is 1,854 source characters, below the bundled limit of 5,000.
- All eight changed skills passed the skill-creator frontmatter validator.
- English and Portuguese documentation builds, translation/public-content checks and all 56 documentation tests passed.

## Behavioral evaluation attempt

On 23 September 2026, the existing 48-case matrix ran through the configured Claude Code model (`claude-opus-5[1m]`):

```sh
node scripts/run-skill-evaluations.mjs --judge --concurrency 8 --max-turns 100
```

Nine cases passed. Workflow Designer's incomplete-input case finished execution, but its grading call hit the account limit and returned no verdict. Thirty-eight cases did not finish or could not start after Claude reported the account rate/weekly limit. Only 18 cases loaded their intended skill, and only 10 completed execution. These results do not establish a complete behavioral pass for 1.2.1.

Current statuses in `tests/skill-evaluations.json` are preserved as **9 passed, 1 unclear, 38 error**. Per-case `run.json`, `response.md`, `tools.md`, grades where available and generated artifacts remain under `matrix/<case>/`. Raw transcripts stay ignored. The previous completed evaluation record is preserved in Git tag `v1.2.0`; prior-version regrade metadata was removed from current records so it cannot be mistaken for a current result.

The runner's `stale: 0` means every case has a current-version attempt record, not that every case ran successfully. The archive builder currently checks versions and untriaged failures but does not reject `error` or `finished: false`. Do not interpret that check as evidence that this behavioral gate passed.

No automatic retry is scheduled. After Claude capacity is available, explicitly rerun the incomplete cases, because the runner's default selection skips current-version attempts:

```sh
node scripts/run-skill-evaluations.mjs --only "$(node -e 'const fs=require("fs");const c=JSON.parse(fs.readFileSync("tests/skill-evaluations.json"));console.log(c.filter(x=>x.status!=="passed").map(x=>x.id).join(","))')" --judge --max-turns 100
```

## Distribution and scope

This patch changes skill instructions, shared references, release metadata, generated examples and documentation. It does not change the YAML contract or executable plugin tools. Installation remains marketplace-only; no plugin installation ZIP is published. The guide distinguishes the newer editor's 20,000-character allowance from the bundled validator's 5,000-character limit.
