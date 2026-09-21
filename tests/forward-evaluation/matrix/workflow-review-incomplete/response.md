## Short answer

It depends on where the parallel actions sit in the list, and I could not check that because no workflow was supplied.

**What the product does** (confirmed from the pinned contract engine): every action has an `order` and an `executionMode` of `sequential` (default) or `parallel`. There is no separate predecessor list. Sequential actions wait for the action before them; parallel actions start together with their neighbours. So:

- Parallel actions placed **after** the budget approval Decision cannot start before it. Approval gates them.
- Parallel actions placed **before** the Decision are active while approval is still undecided. That is the only way they "start before approval". Whether that is acceptable is a policy question I can't answer without the SOP.
- The most common defect in this pattern is a Reject branch with no explicit `outcome`. It defaults to `continue`, so a rejected request still activates everything downstream. Reject should be `cancel_incident` with a required comment; rework should be `return_to_action`.

One caveat: the engine carries schema and preview rules, not the runtime scheduler, so test a parallel action placed right after a sequential Decision in the destination before publishing.

## What ran, what didn't

- `review-actions.mjs workflow.yaml`: **not run**, exit 2, no file. No action names or briefs were reviewed.
- `build-project-map.mjs --check`: ran on a minimal manifest I created; 0 errors, but it contains 0 workflows, so it says nothing about the real workflow's access or readiness.
- Provia connector: tool present, permission not granted this session, so nothing was read from a tenant. Authorize it via your claude.ai connector settings if you want the export pulled directly.

## Artefacts in the working directory

- `review.md`: findings F1 to F7 (contract errors vs. policy gaps vs. improvements), the gate and access results as they actually stand, five test scenarios including one that tests the question itself.
- `provia-project.json`: minimal manifest, disconnected mode, Angola as provisional country, five open decisions (D1 which actions / which Decision; D2 what may start before approval and its fate on rejection; D3 preparatory vs. committing work; D4 approval authority and thresholds; D5 service levels for `due`). Owners are named by role because no groups were supplied.
- `setup.md`: generated from the manifest; lists the five decisions, nothing else pending.

To finish the review, drop `workflow.yaml` (or the Provia export) and the approval paragraph of the SOP into this directory.

**Next step:** rerun `provia-workflow-review` once the file exists. If the design itself is still open, `provia-workflow-designer` first, to place committing work after the Decision and preparatory work before it.

```text
Use provia-workflow-review with provia-project.json in this directory plus the attached workflow.yaml and the budget-approval section of the SOP. Resolve decisions D1–D5, run review-actions.mjs and build-project-map.mjs --check, and confirm which parallel actions sit before the approval Decision. Country: Angola (provisional); reply in English.
```