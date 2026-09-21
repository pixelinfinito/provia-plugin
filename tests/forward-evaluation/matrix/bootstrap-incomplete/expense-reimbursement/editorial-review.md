# Editorial review — Expense reimbursement (`workflow.yaml`)

Reviewed on 2026-09-21 against `references/action-writing.md`. Scope: all 3 actions of `expense-reimbursement/workflow.yaml` (names, five-part descriptions, branches). Deterministic gate: `scripts/review-actions.mjs` → `review-actions.json` (3 applicable, 3 complete, 0 missing parts, 0 leaked implementer notes, 0 near the 5000-character limit, `due` missing on 3).

## Findings

| Action | Observed name | Check | Finding | Outcome |
| --- | --- | --- | --- | --- |
| `submit_claim` | Submit the expense receipts | Verb-led, names the work of §a; no actor prefix | The name keeps the checklist's noun ("receipts") so the employee recognises the step; the description covers the fields the claim also needs. | No change |
| `submit_claim` | — | Five parts | Task, How (7 numbered steps), Evidence, Done when, Exceptions present. Step 7 covers the return-for-correction path so the same brief serves both the first pass and the rework. | No change |
| `approve_claim` | Decide on the expense claim | Verb matches a Decision (decide, not approve) | The source says "approves"; the action name says "Decide" because the assignee chooses between three outcomes. Outcome labels stay short ("Approve", "Return for correction", "Reject"). | No change |
| `approve_claim` | — | Criteria and authority | The brief tells the manager to apply "the expense policy in force" and to return the claim when the amount exceeds their authority or no policy covers it. No threshold is stated because none exists (decision D9); the brief does not invent one. | Unresolved question D9 |
| `approve_claim` | — | Segregation | The Exceptions part instructs a claimant-manager not to decide their own claim. This is a brief instruction, not an enforced control; the routing rule is decision D3. | Unresolved question D3 |
| `pay_claim` | Pay the approved reimbursement | Verb names execution, not confirmation | The source says "finance pays"; the action is payment execution plus recording, so "Pay" is the right verb. It is not a "Confirm payment" step. | No change |
| `pay_claim` | — | Evidence | Three case fields plus the proof-of-payment file; the source names no evidence, so this is a recommendation. | Recommendation, flagged |
| all | — | Implementer notes in descriptions | None. Notes about missing owners, ids, deadlines and forms are in `setupNotes` and `setup.md` only. | No change |
| all | — | `due` | Unset on every action: no service level was supplied and "within the month" cannot be expressed as an offset (`dueInSource` on `pay_claim`). | Unresolved questions D4, D5 |

## What was not checked

Business correctness of the criteria (no policy exists), the customer's terminology (the deliverable is in English; D10 asks whether pt-AO is wanted before publication), and the behaviour of the destination tenant (no tenant was read).
