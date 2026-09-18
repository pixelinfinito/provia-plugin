Neither record can be confirmed overdue.

- **P1**: two rows contradict each other for the same record at the same observation time (`completed` vs `blocked`). That's a data conflict, not evidence either way — I flagged it rather than picking the more convenient reading, per the honesty rule against choosing convenient records.
- **P2**: `open` with no due date. "Overdue" requires a due date to compare against the observation time; with none present, this is a data/configuration gap (the action's due-date rule likely wasn't set), not lateness.

Full write-up with recommended next steps and two open decisions is saved to `triage-report.md` in the working directory. No `provia-project.json` was found, so owners are named generically (export owner, workflow owner) rather than by group key.

Next recommended skill: `provia-process-improvement` isn't right yet — the real gap here is data quality, not performance. If you can supply the actual export rows (with real timestamps and the workflow's due-date configuration), re-run `provia-operations-triage` with that file plus any `provia-project.json` you have, e.g.:

```text
Use provia-operations-triage with the attached export (correct/deduplicated rows) and provia-project.json. Reconcile the P1 status conflict and confirm whether P2's due-date field is populated before re-assessing what's overdue.
```