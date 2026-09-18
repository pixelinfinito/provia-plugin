# Expense reimbursement — editorial review

Scope: both actions in `workflow.yaml` (`decide`, `pay`). Reviewed against `references/action-writing.md`.

## Deterministic check

`node scripts/review-actions.mjs expense-reimbursement/workflow.yaml` — see `validation.json`'s sibling report reproduced below.

- 2 actions reviewed, both complete: all five description parts present (Task, How, Evidence, Done when, Exceptions), no implementer-note leaks, no length violations.
- `dueMissing: 2` — expected: neither action has a `due` because the checklist gives no approval turnaround (see decision D3) and "pays within the month" is not representable as the fixed day/workday offset the field supports (see decision D4).

## Semantic review

- **`decide` (Decision, type `decision`)**: Name is verb-led and describes the actual authority (deciding on the claim), not the approver's job title. Branches are `Approve` → `continue` and `Reject` → `cancel_incident` with a required comment. The checklist only says "manager approves"; a Reject outcome was added because a Decision action requires named outcomes to be meaningful — this is disclosed as an editorial completion in `setupNotes`, not a business rule invented from the source. No "return for correction" branch exists because there is no prior workflow action to return to (submission is modelled as an intake form, not an action); flagged as decision D6.
- **`pay` (Standard, type `standard`)**: Name distinguishes "pay" from "approve"; it does not collapse decision and payment into one act. Evidence is proof of payment plus a filled `payment_reference` field, matching the "finance pays" checklist line. The exception path acknowledges the case where payment cannot happen within the month, since no policy defines what happens then.
- No approval-amount language, threshold, or statutory reference was introduced anywhere in the two descriptions, consistent with there being no policy on limits and no verified legal source for Angola in this task.
- Assignments in the YAML are `type: creator` for both actions as a training placeholder (see `setupNotes` in the manifest); the intended owners are the `managers` and `finance` groups recorded in `provia-project.json`.

## Not checked

- Business correctness of the two-outcome Decision design, the omission of a correction/return path, and the omission of `due` are all recorded as open decisions (D1–D6) for the process owner and Finance director, not resolved here.
- No destination environment exists to validate group, form or import behavior; `destinationValidation` in `validation.json` is `not_run`.
