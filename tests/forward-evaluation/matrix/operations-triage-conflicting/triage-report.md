# Operational triage — P1 / P2 (conflicting export)

Prepared 2026-09-21 with `provia-operations-triage`. Snapshot analysis only; nothing in Provia was read, changed, completed or notified.

## Scope and inputs

| Item | Value |
| --- | --- |
| Export file | **Not supplied.** The working directory was empty; the analysis uses only the two facts stated in the request. |
| Export period | Unknown |
| Observation time | Stated as "the same observation time" for both P1 rows; the actual timestamp and timezone were not supplied |
| Timezone | Provisional `Africa/Luanda` (no country supplied; Angola is the provisional starting context) |
| Project manifest | None existed; a minimal `provia-project.json` was created to carry the open decisions |
| Product reference | `references/provia-capabilities.md` (workdays skip weekends, not public holidays; the baseline defines no automatic "overdue" state) |

## Short answer

**Neither P1 nor P2 can be declared overdue from this export.**

- **P1** has two rows for the same observation time that disagree on status (`completed` vs `blocked`). This is a record conflict, not a finding. Choosing either row would be choosing the more convenient record; the conflict has to be resolved against the incident history first. In addition, no due date for P1 was supplied, so even the `blocked` row would only support "blocked", not "overdue".
- **P2** is open with **no due date**. "Overdue" means past a due date; without one there is nothing to be past. P2 is *open without a deadline*, which may be a configuration or intake gap, but it is not overdue.

## Findings

### F1 — P1: conflicting status at the same observation time (confirmed from the request)

| | |
| --- | --- |
| Evidence | Request text: two rows for P1, same observation time, one `completed`, one `blocked` |
| Classification | **Conflict — unresolved**. Not overdue, not confirmed blocked, not confirmed completed. |
| Why it matters | If P1 is really blocked, downstream actions and the reporter are waiting on it; if it is really completed, a stale duplicate row is polluting the export and any dashboard built on it. |
| Likely causes (not verified) | (a) two rows describe different objects — the incident and one of its actions — and the export flattened them; (b) a duplicate export of the same row before and after a status change with a shared export timestamp; (c) two actions of P1 in different states listed under the incident id. |
| Next record to inspect | The P1 incident timeline / activity log in Provia: the last status transition, its author and timestamp, and the per-action status list. If the export has a row-level id or action id column, compare those two values first. |
| Who can act | The owner of the action that the `blocked` row refers to (unknown — not in the supplied data), or the workflow's Owner/admin. Record the resolution as decision D1. |
| Suggested step | Do not close or reopen anything. Ask the workflow owner to confirm P1's current state from the incident page and to say why the export produced two rows. |

### F2 — P2: open with no due date (confirmed from the request)

| | |
| --- | --- |
| Evidence | Request text: P2 is `open`, due date empty |
| Classification | **Waiting / undated — not overdue.** |
| Why it matters | Undated open work cannot be triaged by lateness and will never surface on an overdue list. If the workflow design defines a `due` offset for this action, the empty value suggests the export column is not the action due date or the action was created before the due rule existed. |
| Next record to inspect | The action's `due` definition in the workflow design (`due.offsetDays`, `basis`) and P2's activation timestamp. If a due rule exists, the due date can be derived and P2 re-evaluated; if none exists, decision D2 asks whether one should. |
| Who can act | The assignee of P2's current action (unknown — not in the supplied data) for progress; the workflow owner for the missing due rule. |
| Suggested step | Do not set a due date on the record from this analysis. Ask the workflow owner whether the action should carry a due offset and, if so, plan it through `provia-workflow-change`. |

## What was not verified

- No export was read; the row contents, ids, assignees, activation times and any due-date columns are unknown.
- No observation timestamp or timezone was supplied, so no "as of" comparison against any due date was possible for either record.
- Ownership (who can act) could not be named by group key: the manifest has no `groups[]` or `workflows[]` yet.

## Open decisions (recorded in `provia-project.json`)

| Id | Question | Owner | Status |
| --- | --- | --- | --- |
| D1 | Which of the two P1 rows reflects the real status at the observation time, and why did the export produce both? | Workflow owner (unnamed — no manifest groups) | open |
| D2 | Should P2's current action carry a due date rule, and if so which offset and basis? | Workflow owner (unnamed — no manifest groups) | open |
| D3 | Who owns triage of this workflow's records (ownership gap: the request names no assignee for P1 or P2)? | Organization administrator | open |

## Recommendations

1. Re-export with the row-level identifier (incident id, action id, status, assignee, activation, due, last-updated, export timestamp) and an explicit observation time in `Africa/Luanda` or the actual timezone.
2. Resolve D1 from the P1 incident timeline before any dashboard or attention list uses this export.
3. Treat "no due date" as its own attention category ("undated open work") so items like P2 are visible without being mislabeled overdue.
