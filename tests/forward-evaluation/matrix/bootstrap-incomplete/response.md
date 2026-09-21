The map embeds every object and loads no external assets. The bootstrap is complete. Summary of what was done, what was verified and what the customer must decide:

## Files written (working directory)

| File | What |
| --- | --- |
| `provia-project.json` | Manifest `provia-project/v1.1`: 1 source, 2 groups, 1 workflow (3 actions, access, triggers), 1 intake form, 0 entity types, 10 open decisions |
| `project.html` | Offline project map rendered from the manifest |
| `expense-reimbursement/workflow.yaml` | `provia.ao/v1` package with the `access` section emitted by `emit-workflow-access.mjs` |
| `expense-reimbursement/validation.json` | Exact validator output |
| `expense-reimbursement/review-actions.json` | Exact action review gate output |
| `expense-reimbursement/editorial-review.md` | Semantic review of names and briefs |
| `expense-reimbursement/design.md` | Classification table, action table, Mermaid flow, access, information-model reasoning, form and rollout notes |
| `expense-reimbursement/setup.md` | Handover generated with `--setup` (23 pending items) |

No `catalogue.json`: the process needs no entity type (the claimant is the native case creator; bank details stay in the payroll/accounting system — D6), and the catalogue format requires at least one type.

## Design in one paragraph

Manual trigger (plus a recommended intake form) → `submit_claim` (creator) → `approve_claim` (Decision: Approve / Return for correction / Reject, comment required on the last two) → `pay_claim` (Finance). The approval is intended for the manager the claimant names in the `manager` user field, with a `role` group **Line managers** as fallback, because Provia cannot route to "the requester's manager". Access: `organization` → `create_incident`; no `view` grants; sensitivity `internal`.

## Verified

- `validate-workflow.mjs`: `valid: true`, 0 errors, 0 warnings, backend schema checks passed; 2 `assignment_missing` setup items (owners of `approve_claim` and `pay_claim` — group ids unknown); `readyToPublish: false`; destination validation not run.
- `review-actions.mjs`: 3/3 briefs complete, 0 leaked implementer notes, `due` unset on all 3 by design.
- `build-project-map.mjs --check`: 0 errors, 0 warnings, 2 infos (rule 4: assigned groups without a grant), 0 readiness blocks, 0 unresolved actor/entity keys.

## Not done, and why

- **Connected mode**: the host lists a Provia implementer server, but the `org_get_context` call was not permitted in this session, so nothing was read from or applied to a tenant. The manifest is in `disconnected` mode; `receipts[]` is empty.
- **Assignees, deadlines, form**: omitted from the YAML (no ids, no service levels, forms not portable); all listed in `setup.md`.

## What the customer must provide (open decisions, owner in the manifest)

D1 process owner · D2 which manager approves whom (org chart) · D3 segregation rule for managers' own claims · D4 service levels for submission and approval · D5 what "within the month" means, or an offset · D6 source of bank details and payment means · D7 whether Finance sees every claim · D8 confirm the Return/Reject branches · D9 policy on limits and categories · D10 whether the employee-facing text should be pt-AO.

Recommended next step: `provia-workflow-review`, so the customer review runs against the packaged design with the ten decisions in front of the process owner, and any resolved decision (D4/D5 deadlines, D2 routing, D7 view grant) feeds back into the manifest before import.

```text
Use provia-workflow-review on provia-project.json and expense-reimbursement/workflow.yaml. Review ownership, sequencing, evidence, exceptions and publication readiness, and record which of decisions D1–D10 the process owner resolved. Country: Angola; reply in English.
```