**Answer: neither P1 nor P2 can be called overdue from this export.**

Assumptions: the working directory contained no export, manifest or observation time, so I worked only from the two facts in your request. Country/timezone are provisional (Angola, `Africa/Luanda`).

**P1 — status conflict, not a finding.** Two rows at the same observation time say `completed` and `blocked`. That is a record conflict; picking either row would be picking the convenient one. Even the `blocked` row would only support "blocked", never "overdue", because no due date was supplied for P1 either. Next record to inspect: P1's incident timeline (last status transition, author, timestamp) and the per-action status list — most likely the two rows describe different objects (incident vs. one action) or a stale duplicate.

**P2 — open, undated, not overdue.** "Overdue" means past a due date; with none, P2 is *open without a deadline*. That is its own attention category (a design or intake gap), not lateness. Next record to inspect: the action's `due` rule in the workflow design and P2's activation time.

Artefacts written to the working directory:
- `triage-report.md` — findings F1/F2, what was not verified, who can act (unnamed: no groups supplied), next steps.
- `provia-project.json` — new minimal manifest with decisions D1 (which P1 row is real), D2 (should P2's action have a due rule), D3 (who owns triage; ownership gap). `build-project-map.mjs --check` ran clean: 0 errors, 0 warnings, 3 pending items (the open decisions). That check validates the manifest only, not the report.

Nothing was completed, closed, or messaged in Provia.

Recommended next step: `provia-workflow-change`, once D1 is resolved from the P1 timeline — it can plan the due-date rule P2's action is missing while cases are open.

```text
Use provia-workflow-change with provia-project.json in this directory. D1 has been resolved as: <state which P1 row is correct and why>. Plan adding a due-date rule to the action P2 is waiting on, assess impact on open cases, and record the change in the manifest. Country: Angola; reply in English.
```