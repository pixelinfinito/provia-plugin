# Operational triage — attention list

## Export and observation time

No export file or `provia-project.json` was found in the working directory, and no observation-time value, timestamp format or timezone was supplied. This report works only from the two record descriptions given in the request (P1, P2). Treat everything below as a snapshot read of those two descriptions, not as live monitoring of a Provia organization.

## Confirmed facts

- **P1**: two rows in the export describe the same record at the same observation time. One row states status `completed`, the other states status `blocked`. This is a direct contradiction, not two different moments in the record's history.
- **P2**: one row, status `open`, with no due date present in the export.

## Findings

### P1 — status conflict, cannot be classified

The two rows cannot both be true for the same record at the same instant. Picking either one without evidence would mean choosing the more convenient story (`completed` reads as "no action needed"; `blocked` reads as "needs escalation") rather than the correct one — the skill's own guidance is to flag this instead of choosing.

- **Do not treat P1 as completed** — that would suppress a possibly time-sensitive blocked item.
- **Do not treat P1 as blocked and overdue either** — the same export also claims it is finished, and "overdue" cannot be asserted from a record whose current state is itself unknown.
- **Verdict: not classifiable as overdue, on-track or closed from this export alone.**

### P2 — no due date, cannot be classified as overdue

"Overdue" requires comparing a due date to the observation time. P2 has no due date in the export, so there is nothing to compare against. An open record with a missing due date is a **data-quality / configuration gap** (the workflow action's due-date rule likely wasn't set or didn't populate), not evidence of lateness.

- **Verdict: not classifiable as overdue.** Flag as an open item with an ownership/configuration gap instead.

## Answer to "which is overdue"

**Neither record can be confirmed overdue from this export.** P1's true status is unresolved because of the duplicate conflicting rows; P2 has no due date to be overdue against. Asserting either one as overdue would mean inventing a fact the export doesn't support.

## Recommended next steps (not executed)

1. **P1** — the authorized owner of the source system/export pipeline should pull the record's status-change history (or the underlying action-instance log) to see which of the two rows is stale or mis-exported, rather than trusting either row as-is. If the reconciled status is genuinely `blocked`, identify the blocking dependency and escalate to whoever owns that action.
2. **P2** — the workflow owner should check why this action has no due date: either the action's `due` rule (offset/basis) was never configured, or the value failed to populate for this record. Assign an owner to set/fix it before this record can be triaged for lateness.

No manifest (`provia-project.json`) exists in the working directory, so no group key can be cited for either owner above; once one exists, replace "the authorized owner" / "the workflow owner" with the matching `assigneeRef`.

## Decisions

- `D1` — Which system/log is authoritative when an export contains duplicate rows with conflicting status for the same record and observation time? **Status: open. Owner: export/integration owner (unassigned — no manifest to resolve a group key).**
- `D2` — Why does this workflow action allow an `open` record to have no due date, and who fixes it for P2? **Status: open. Owner: workflow owner (unassigned — no manifest to resolve a group key).**
