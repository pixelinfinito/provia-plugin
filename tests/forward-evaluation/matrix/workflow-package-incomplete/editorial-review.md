# Editorial review — not performed

Date: 2026-09-21. Reviewer: provia-workflow-package (provia-skills 1.2.0).

## Scope

The editorial review checks every action's name (verb first, names the work) and its five-part description (task, method, evidence, done-when, exceptions), and removes implementer notes that leaked into text an assignee will read. It runs on `workflow.yaml` with `node scripts/review-actions.mjs workflow.yaml --markdown`.

## Result

No workflow file was supplied and the Provia connector was not authorized in this session, so there were no actions to review. `review-actions.mjs` was not run on a workflow. No findings exist; none were invented.

## When the export arrives

1. Run the review gate: `node scripts/review-actions.mjs <this dir>/workflow.yaml --markdown`.
2. Fix wording only. Do not change assignee, sequence, branch outcomes or targets while fixing descriptions — those belong to decision D2 in `provia-project.json`.
3. Move any note meant for the implementer (ids to fill in, "check with IT", secret names) into the manifest `workflows[].setupNotes`, not the description.
4. Record the findings and fixes here, one row per action: local id, finding, change made.

See `repair-report.md` §4 for the boundary between semantics-preserving repairs and process changes.
