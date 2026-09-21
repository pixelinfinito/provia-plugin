# Workflow review: Purchase request (`PUR`)

Reviewed by `provia-workflow-review` on 2026-09-21. Disconnected mode: nothing was read from or written to a Provia organization. Country context Angola is provisional (none was supplied); it affects only the currency code carried in the YAML and the timezone in the manifest, not any finding below.

**Verdict: not ready for publication.** The file is structurally valid and every action brief passes the review gate, but the execution sequence contradicts the supplied policy: ordering starts at case creation, before the manager has decided. This is a business-policy defect, not a file defect, and the validator cannot see it.

## 0. What was supplied and what was assumed

Supplied in the request:

- A workflow described as "passes file checks; request and ordering run in parallel".
- A policy statement: "the manager must approve before ordering".

Not supplied: the workflow file itself, the manifest, the policy document, the organization, owners, thresholds, deadlines. No question was asked; the review proceeds on these assumptions, all recorded in `provia-project.json`:

| # | Assumption | Effect on findings |
| --- | --- | --- |
| A1 | The workflow has three actions: `request` (register the request), `order` (place the order), `approve` (manager's decision). `request` and `order` are `executionMode: parallel` in positions 1–2; `approve` is `sequential` in position 3. | Reproduces "request and ordering run in parallel". If the real file has no approval action at all, F1 becomes "the policy control is absent" rather than "mis-sequenced" — same verdict, larger correction. |
| A2 | Intended owners: the requester (creator) registers; a **Department managers** group decides; a **Purchasing** group orders. The reconstructed YAML assigns everything to `creator` as a draft simplification (no destination ids exist). | Ownership findings F3, F6. |
| A3 | Any employee may open a request (`organization` → `create_incident`). | Access finding, D5. |
| A4 | Due offsets 1/2/3 workdays are the submitted values, not policy. | D6. |

`workflow.yaml` in this folder is the reconstruction under A1–A4, kept exactly as reviewed. `workflow.proposed.yaml` is the correction; it is not applied to the reviewed design.

## 1. Checks actually run

| Check | Command (plugin root) | File | Result |
| --- | --- | --- | --- |
| Portable YAML validation | `node scripts/validate-workflow.mjs workflow.yaml` | `workflow.yaml` | `valid: true`, backend schema checks passed, 0 errors, 0 warnings. `destinationValidation: not_run`, `readyToPublish: false`. Output kept in `validation.json`. |
| Action review gate | `node scripts/review-actions.mjs workflow.yaml --markdown` | `workflow.yaml` | 3/3 human actions have all five parts; 0 leaked implementer notes; 0 without `due`. Output in `action-review.md`. |
| Manifest and access rules | `node scripts/build-project-map.mjs provia-project.json --check` | `provia-project.json` + `workflow.yaml` | 0 errors, 0 warnings, 2 infos (rule 4: `purchasing` and `managers` hold no grant, see their own cases). 0 readiness blocks. Action ids and prefix match the YAML. |
| Setup handover | `… --setup setup.md` | generated | 13 pending items, 6 open decisions. |
| Project map | `… --output project.html` | generated | Execution-flow view shows `request` and `order` as one parallel block before `approve`. |
| Proposed correction | validator + review gate on `workflow.proposed.yaml` | `workflow.proposed.yaml` | `valid: true`; 3/3 briefs complete. |

Not run: destination validation (no tenant), import preview, publication. None of the above certifies business or legal compliance.

## 2. Findings, by priority

Severity: **Blocker** stops publication; **Major** must be resolved or explicitly accepted by the process owner; **Minor** is an improvement.

### F1 — Blocker · Ordering does not wait for the manager's approval (policy defect)

- **Evidence.** `workflow.yaml`: `request` and `order` both carry `executionMode: parallel` at positions 1–2; `approve` is position 3. In Provia, consecutive parallel actions start together when the preceding sequential action completes — here, at case creation (provia-capabilities.md: "Sequential execution enforces predecessors; parallel work is appropriate only for independent tasks"). The project map's execution flow renders `request ∥ order → approve`.
- **Policy.** Source `purchasing-policy`, §approval-before-ordering: "the manager must approve before ordering".
- **Consequence.** Purchasing can issue the order on day 1 with an unapproved amount and cost centre; the manager decides afterwards. "Reject" then cancels a case whose order has already gone to the supplier; "Return" sends the requester back to correct a request that has already been ordered. The control exists in the file but is inoperative.
- **Why the file checks pass.** The validator checks schema and contract, not business precedence. Structural `valid: true` is not business correctness (skill-conventions.md, honesty rules).
- **Correction (proposed, not applied).** `workflow.proposed.yaml`: all three actions `sequential`, in the order `request → approve → order`; `approve` keeps its three branches with `Return → request`; the `order` brief names the approval as its precondition and tells Purchasing to stop if the case history does not show "Approve". Ids, labels, fields, access and due values unchanged.
- **Decision.** D1 — confirm the sequence and whether any exception (threshold, emergency, framework contract) lets ordering start earlier. Until D1 is resolved, publication is blocked regardless of file validity.

### F2 — Major · Rejection and return arrive after the irreversible step

- **Evidence.** `approve.config.branches`: `Reject → cancel_incident`, `Return → return_to_action(request)`. With the submitted sequence, both fire after `order` may be complete.
- **Consequence.** Nothing in the design tells anyone to cancel the supplier order; the case simply closes or loops back. Evidence of the cancellation would not exist.
- **Correction.** Resolved automatically by F1's re-sequencing. If the owner insists on parallel ordering (D1), a fourth action "Cancel the order with the supplier" reachable from "Reject" would be needed, with its own evidence — recorded as D4.

### F3 — Major · The approver and the orderer are the same principal in the file

- **Evidence.** All three actions: `assignee.type: creator`. The manifest names `managers` for `approve` and `purchasing` for `order`, but the YAML cannot carry group keys without destination ids (workflow-yaml.md).
- **Consequence.** As imported, the requester registers, approves and orders their own request. The policy's control ("the manager") is not exercised by a manager.
- **Correction.** Before import: create the two groups and set `assignee` to the group ids (`setup.md`, pending items "Assign the group to the action"). The segregation flag on `managers` (a manager approving their own request) is D2.

### F4 — Major · The ordering brief does not mention approval

- **Evidence.** `order.description`, `How:` steps 1–4 cover supplier register, issuing, sending and reference; no step checks that the request was approved, and `Exceptions:` covers only supplier-register problems.
- **Consequence.** Even after re-sequencing, an assignee reading the brief has no instruction to verify the approval outcome or what to do when it is missing (e.g. a case re-opened after a version change).
- **Correction.** Applied in `workflow.proposed.yaml`: step 1 "Confirm that the decision shows Approve in the case history"; exception "If the case history does not show the manager's approval, do not place the order: comment and stop." Editorial, not a contract error.

### F5 — Minor · The decision's exception names no authority

- **Evidence.** `approve.description`, `Exceptions:` "If the amount exceeds your approval authority … return the request so that it can be routed to the competent authority." No threshold and no authority are named anywhere.
- **Consequence.** The manager cannot tell from the brief when this applies or to whom to route.
- **Correction.** Do not invent a threshold. D3 asks the finance director; once answered, either add the amount and the authority to the brief or add a second decision action.

### F6 — Minor · Ownership and visibility (access rules)

- **Evidence.** `--check`: rule 4 infos for `purchasing` and `managers` (no grant; they see the cases carrying their actions). `organization → create_incident` is assumed (A3) and carries a reason and sourceRef.
- **Consequence.** None blocking. If Purchasing works from a shared queue of all requests, it needs a `view` grant with a source-backed reason (rule 4); nothing supplied says so.
- **Decision.** D5.

### F7 — Minor · Deadlines are unsourced

- **Evidence.** `due` 1/2/3 workdays from activation on the three actions; no source states a service level.
- **Correction.** Keep as submitted for the pilot or remove; D6 records the question. Workdays skip weekends, not public holidays.

### Passed

- Every action has a name that starts with a verb and names the work; names agree with type (`approve` is a decision; `order` executes, does not confirm).
- Every action has completion evidence stated in the brief (`Evidence:` part) and mirrored in the manifest `evidence[]`.
- The decision has continue, return and cancel outcomes; return targets a real action id; rejection requires a comment.
- No implementer notes leaked into descriptions; all briefs well under the 5000-character limit.
- Access declared; no rule 1/3/5 errors; no `field:` assignees; no allowlist; no retained tenant grants (no tenant read).
- No Form Fill, entity, HTTP or secret dependencies to check (none present).

## 3. Per-action review gate

From `action-review.md` (`workflow.yaml` as reviewed):

| Action | Type | Five parts | Leaks | Length | Due | Semantic notes |
| --- | --- | --- | --- | --- | --- | --- |
| `request` Register the purchase request | standard | complete | none | 686 | set | Done-when could name the hand-off to the manager (added in the proposal). |
| `order` Place the order with the supplier | standard | complete | none | 659 | set | F4: no approval precondition. |
| `approve` Decide on the purchase request | decision | complete | none | 701 | set | F5: exception names no authority or threshold. |

## 4. Access readiness

`--check` result: **no readiness block**. 0 errors, 0 warnings, 2 rule-4 infos. Not evaluated (no tenant): retained grants, `workflow_get.access` read-back, allowlist resolution, `canStart` verification. Sensitivity `internal` is assumed; nothing supplied marks purchasing as restricted.

Access readiness passing does **not** make the workflow publishable: F1 is a policy block that the access rules do not measure.

## 5. Decisions appended to `provia-project.json`

| Id | Question | Owner |
| --- | --- | --- |
| D1 | Confirm `request → approve → order`; any exception that allows ordering before approval? | Process owner (purchasing) |
| D2 | Who is "the manager" per request; which group; who approves a manager's own request? | Process owner (purchasing) |
| D3 | Approval threshold and the authority above it? | Finance director |
| D4 | If ordering stays parallel: who cancels a placed order on rejection, and what evidence? (moot if D1 confirms) | Process owner (purchasing) |
| D5 | Who may open a request; does Purchasing need to see every case? | Process owner (purchasing) |
| D6 | Service levels for the three actions? | Process owner (purchasing) |

## 6. Test scenarios (for the corrected sequence, after D1)

Expected visible results in Provia; none of these was executed.

| Scenario | Steps | Expected |
| --- | --- | --- |
| Normal | Requester registers (amount, cost centre, title) → manager chooses "Approve" → Purchasing places the order and fills `order_reference`. | Case completes; `order` becomes active only after `approve` shows "Approve"; history shows the three completions in that order. |
| Rejected | Requester registers → manager chooses "Reject" with a comment. | Case cancelled; `order` never activates; no order reference exists; the rejection comment is in the history. |
| Returned / incomplete | Requester registers without a quotation → manager chooses "Return" with a comment → requester completes `request` again → manager approves. | `request` re-activates for the creator; `order` stays inactive until the second decision; both decision comments visible. |
| Ordering blocked by missing approval | (Only reachable if the sequence were still parallel or a version change re-opened a case.) Purchasing opens `order` and finds no "Approve" in the history. | Per the corrected brief, Purchasing does not complete `order`, comments and stops; the case shows an open `order` and the comment. |
| Failed integration | Not applicable: no HTTP, notification or sub-workflow action exists. | — |

A regression check for F1 itself: on the **submitted** file, start a case and observe that both `request` and `order` are active at once, before any decision. That observation is the defect.

## 7. Pending before publication

1. Resolve D1; adopt `workflow.proposed.yaml` (or an owner-approved variant) as the design.
2. Create the `managers` and `purchasing` groups; set the two assignees (F3); resolve D2.
3. Resolve D3 and update the decision brief.
4. Import as a draft, review the preview, run destination validation.
5. Publication is a decision for an authorized person in Provia; this review does not make it.

## Artefacts in this folder

`workflow.yaml` (as reviewed), `workflow.proposed.yaml` (correction), `validation.json`, `action-review.md`, `provia-project.json`, `setup.md`, `project.html`, this report.
