# Workflow review: can the parallel actions start before budget approval?

Date: 2026-09-21. Skill: provia-workflow-review, disconnected mode. Country context: Angola, provisional (no country was supplied). Response language: English, as asked.

## 1. What this review had to work with

| Input the skill needs | Supplied? | Consequence |
| --- | --- | --- |
| Workflow design or export (`workflow.yaml`) | No. The working directory was empty. | The action review gate could not run. No action ids, names, `order`, `executionMode`, owners, branches or `due` could be traced. |
| Project manifest (`provia-project.json`) | No. Created here as a minimal manifest that carries only the open decisions. | `--check` ran on that minimal manifest; it has no workflow to evaluate, so it says nothing about the real workflow's access or readiness. |
| Procedure / SOP | No. | Policy questions (what may start before approval, who approves, thresholds) cannot be adjudicated. They are recorded as decisions D1 to D5. |
| Destination organization (Provia connector) | Tool present, permission not granted in this session. | Nothing was read from a tenant. No `workflows_list`, no export. |

So the question "can these parallel actions start before budget approval?" has two halves. What the product does is answerable from the pinned contract and is answered below. Whether it *should* happen in your process depends on the SOP, and I do not have it.

## 2. Answer, as far as the product contract goes

Confirmed from `contracts/workflow-v1/engine.mjs` and `references/provia-capabilities.md`:

- Every action carries `order` (its position in the list) and `executionMode`, which is `sequential` or `parallel`. `sequential` is the default. There is no separate predecessor list in the portable YAML. Sequencing is position plus mode.
- Sequential execution enforces predecessors. A sequential action does not become active until the action before it completes.
- Parallel actions start together with their neighbours. The engine's own preview warns "All actions are set to parallel - they will all start simultaneously" when every action is parallel.
- A Decision has named outcomes only: `continue`, `cancel_incident`, `return_to_action` (target is a local action id) and `trigger_workflow`. There is no value-based gate. A bare "Reject" label with no outcome defaults to `continue`, which means a rejected request keeps flowing.

What follows from that for your question:

1. If the parallel actions sit **after** the budget approval Decision in the action list, they cannot start before it. The Decision is their predecessor. Approval gates them, whatever their `executionMode`.
2. If the parallel actions sit **before** the Decision, or at the same position with `executionMode: parallel`, they are active while approval is still undecided. That is the only way they can "start before budget approval". Whether that is acceptable is a business question, not a product one.
3. If the Decision's Reject outcome is not `cancel_incident` (or a `return_to_action` back to the requester), the parallel actions that follow it still start after a rejection. That is the most common defect in this pattern and it is a contract-level check, not a policy one.

One thing I cannot confirm from the engine alone: exactly how the runtime treats a parallel action placed immediately after a sequential Decision (does it wait for the Decision, or for the action before the Decision?). The bundled engine carries the schema and preview rules, not the runtime scheduler. Verify this in the destination with a test case before publishing, and see https://docs.provia.ao/ for the current behaviour. Do not take my reading of the contract as a substitute for that test.

## 3. Findings, prioritized

Findings are stated as what to check once the file exists, because there is no file yet. Each one says whether it is a product contract error, a business-policy gap or an optional improvement.

| # | Finding | Kind | Evidence needed | Proposed correction |
| --- | --- | --- | --- | --- |
| F1 | Position of the parallel actions relative to the approval Decision decides the answer. Actions listed before the Decision run before approval. | Contract fact | `workflow.yaml` actions list: `order` and `executionMode` of each candidate action and of the Decision | Move any action that commits the organization (order, contract, payment, fund reservation) after the Decision, `executionMode: sequential`. Keep only preparatory work (quotations, specification, availability checks) before it, and only if the SOP allows (D2, D3). |
| F2 | Reject outcome may default to `continue`. | Contract error if present | Decision `config.branches[]`: `outcome` on every branch | Reject → `cancel_incident`, `requiresComment: true`. Return for rework → `return_to_action` targeting the intake or preparation action. Approve → `continue`. |
| F3 | Work started before approval has no defined fate on rejection. If the incident is cancelled, in-flight parallel actions end with it; if the outcome is `return_to_action`, they may stay open next to a reopened earlier step. | Business-policy gap | SOP statement on what happens to preparatory work after a rejection (D2) | Record the rule in the Decision's `Exceptions:` and in each parallel action's `Exceptions:` ("if the request is rejected, do not complete; comment what was done"). |
| F4 | No owner information. Every action needs an `assigneeRef` by group key; the approver must not be the requester or the preparer. | Contract error (missing assignee) plus segregation policy gap | Manifest `groups[]`, `assigneeRef` per action, budget authority (D4) | Fill `assigneeRef` per action. Raise a `segregation` flag on the approver group if it also prepares or requests. Add a threshold Decision or a second approver only if the SOP states one; never invent a threshold. |
| F5 | No `due` on any action can be proposed. | Business-policy gap | Service level per action from the SOP (D5) | Set `due` from the SOP; otherwise leave unset and keep D5 open. |
| F6 | Evidence of approval. A Decision without a required comment or a mapped field leaves no reviewable record of *why* it was approved. | Optional improvement, unless the SOP requires a record | SOP on approval evidence | `requiresComment: true` on Reject and Return at minimum; a `budget_reference` field filled by the approver if the SOP names one. |
| F7 | Access not declared. A workflow without `access` fails `--check` (rule 3) and imports creator-only. | Contract error at check time | `workflows[].access` in the manifest | Declare who opens (`create_incident`) and who owns the design (`edit`); assignee groups get no `view` unless the SOP says they see every case. |

## 4. Review gate result (review-actions.mjs)

Not run. Command attempted from this directory:

```
node scripts/review-actions.mjs workflow.yaml
→ exit 2, {"valid":false,"error":"Cannot read the file."}
```

No action names or descriptions were reviewed, deterministically or semantically. The five-part brief check (Task, How, Evidence, Done when, Exceptions), leak detection and `due` presence are all pending the file.

## 5. Access readiness result (build-project-map.mjs --check)

Ran on the minimal manifest written here:

```
Manifest workflow-review: 0 workflows, 0 groups, 0 entity types, 0 forms; access declared on 0/0,
0 readiness block(s), 0 unresolved actor/entity key(s); 5 pending item(s), 0 warning(s), 0 info(s).
```

This is a check of the manifest's shape and of the five open decisions, nothing more. Publication readiness of the actual workflow is **not assessed**. Rules 1 to 8, retained grants and readiness blocks will only be evaluated once `workflows[]` carries the design with its `access` section.

## 6. Decisions recorded in `provia-project.json`

| Id | Question | Owner |
| --- | --- | --- |
| D1 | Which actions are the parallel ones and which is the approval Decision? Supply the YAML or export. | Process owner |
| D2 | Does the procedure allow any work before approval is recorded? Which tasks, and what happens to them on rejection or return? | Process owner |
| D3 | Do the candidate actions commit the organization or only prepare? | Finance / budget authority |
| D4 | Who approves, and is there a threshold with a second authority? | Finance / budget authority |
| D5 | Service level per action, for `due`. | Process owner |

Owners are named by role because no group or person was supplied. Replace them with the real group keys once the manifest has `groups[]`.

## 7. Test scenarios to run before publication

Action ids are placeholders until the file exists. Expected results assume the corrections in section 3.

| Scenario | Steps | Expected visible result |
| --- | --- | --- |
| Normal | Open a case, complete the preparatory actions (if any sit before the Decision), approver chooses Approve. | Actions after the Decision become active only after Approve. Approval comment or `budget_reference` visible on the case. |
| Rejected | Approver chooses Reject with a comment. | Case status cancelled. No action after the Decision ever activates. Any parallel action still open before the Decision is closed with the case, or remains visible as not completed (confirm which, per F3). |
| Incomplete (returned for rework) | Approver chooses Return with a comment. | The target action reopens for its assignee. The comment is visible. Actions after the Decision stay inactive. Repeat approval after rework. |
| Parallel before approval (the question itself) | Place one preparatory action with `executionMode: parallel` before the Decision, one committing action after it. Open a case. | The preparatory action is active at once; the committing action is not visible as active until Approve. If the committing action activates early, the position or mode is wrong. |
| Failed integration | Only if an HTTP Request or notification follows approval (none known). Point it at an unreachable endpoint in test. | The action shows the failure and the case does not silently proceed as if the call succeeded. |

## 8. What was verified, what is pending

Verified: the manifest written here passes `--check` with 0 errors; the contract facts in section 2 come from the pinned engine (`executionMode` enum, `order`, decision outcomes, the all-parallel preview warning).

Pending: everything about the actual workflow. Action review gate, semantic review of names and briefs, owners, segregation, dependencies, `due`, decision branches, access rules, form mappings, entity references, destination validation and publication. None of it was done, because none of it could be.

To complete this review, put these next to `provia-project.json` in this directory and run the skill again:

1. `workflow.yaml` (or the Provia export of the workflow).
2. The procedure that the workflow implements, or at least the paragraph on budget approval.
3. The group list for owners (`groups[]`), or authorize the Provia connector so `groups_list` and `workflow_export_yaml` can be read.
