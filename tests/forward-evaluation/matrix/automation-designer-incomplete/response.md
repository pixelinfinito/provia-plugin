The tenant read was declined, so this stays a disconnected design; nothing was read from or written to Provia.

## What I delivered (all in the working directory)

| File | Content |
| --- | --- |
| `workflow.yaml` | Schedule trigger `0 8 1 * *`, `Africa/Luanda`, `missedBehavior: catch-up-one`; manual fallback trigger; fields `review_period` / `review_outcome`; one standard action «Conduct the monthly review» with the five-part brief and a 5-workday due |
| `provia-project.json` | New manifest (none existed): workflow, triggers, unresolved actor `monthly-reviewer`, 7 setup notes, decisions D1–D7 |
| `monthly-review-trigger-spec.md` | The specification: confirmed vs assumed vs unresolved, cron alternatives and what numeric cron cannot express, the missed-run policy (both platform-side and people-side), access, integration requirements list |
| `setup.md`, `project.html` | Generated from the manifest |
| `validation.json`, `review-actions.json` | Actual script outputs |

## The missed-run policy in one paragraph

`catch-up-one`: if the scheduler misses the slot (08:00 Luanda = 07:00 UTC, no DST), exactly one case opens on recovery, and the reviewer's brief tells them to cover every month without a completed review, recording the months in `review_period`. `skip` was rejected because a missed month would leave no trace; `catch-up-all` only makes sense if each month must be its own case (D4). The people-side miss is handled by the due date (overdue visibility) and the manual trigger; the escalation notification is not emitted because its recipient is unknown (D6).

## What was verified and what is pending

- `validate-workflow.mjs`: valid, backend schema checks passed, 0 errors/warnings, `readyToPublish: false` with two setup items (`trigger_setup`, `assignment_missing`).
- `review-actions.mjs`: 1 action, all five parts present, no implementer-note leak.
- `build-project-map.mjs --check`: 1 warning (action has no owner), 0 readiness blocks, 1 unresolved actor.
- Pending: the review's scope (D1), the reviewing team (D2 — drives assignee, manual-trigger allowlist and access), the day/hour (D3, assumed 1st at 08:00), the service level (D5, 5 workdays illustrative), overdue recipient (D6), entity/API dependency (D7). Also verify in the destination product how far back the catch-up window reaches; the bundled contract fixes only the option names.

Assumptions stated: Angola as provisional country context, English output, no external system involved. No ids, groups or endpoints were invented.

**Recommended next step:** `provia-workflow-designer`, once the process owner answers D1 and D2 — the trigger is done, but the workflow around it (what is reviewed, by whom, with which evidence) is what's missing.

```text
Use provia-workflow-designer with provia-project.json and workflow.yaml in this folder. The monthly schedule trigger (Africa/Luanda, catch-up-one) is designed; resolve decisions D1–D7 from the supplied procedure: define the review scope, the reviewing group as assigneeRef, the manual-trigger allowlist and access grants, the service level and the overdue notification recipient. Country: Angola; reply in English.
```