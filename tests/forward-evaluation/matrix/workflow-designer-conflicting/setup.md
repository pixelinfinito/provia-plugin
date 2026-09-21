# Request approval (SOP sections 2 and 7): Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| request-approval | Request approval | Import the YAML as a draft and review the preview (`workflow.yaml`) |
| request-approval / prepare | Prepare the request for approval | Set the deadline; the design proposes no `due` |
| request-approval / decide | Decide on the request | Set the owner; the action has none in the design |
| request-approval / decide | Decide on the request | Set the deadline; the design proposes no `due` |

## Workflow access

Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.

| Workflow | Sensitivity | Grantee | Level | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| `request-approval` | internal | creator and organization administrators only (`default: creator_only`) | — | The source does not say who opens a request, who owns the design or how sensitive the cases are. No grant is proposed until decision D3 names the starters; `creator_only` is a placeholder, not a design choice. Sensitivity `internal` is an assumption. | — |

## Groups to create

- `department_managers` Department managers [team]: Approver named in SOP section 2. Candidate assignee of the decision «Decide on the request» if decision D1 resolves in favour of section 2 or a two-step approval.. Proposed members: Department manager
- `finance_director` Finance director [team]: Approver named in SOP section 7 («only the finance director approves»). Candidate assignee of the decision «Decide on the request» if decision D1 resolves in favour of section 7 or a two-step approval.. Proposed members: Finance director

## Group flags

- `department_managers`: Owner unnamed in the sources. The source does not say which department manager: the requester's own manager (a per-case owner) or a fixed group. See decision D4.
- `finance_director`: Single-person actor: name a delegate. One named position. A group is proposed so ownership survives absences; the delegate is decision D5.

## Open decisions

- **D1** Who approves the request? SOP section 2 says the department manager approves; section 7 says only the finance director approves. Possible resolutions: (a) section 7 supersedes section 2 (one decision by the finance director); (b) section 2 applies and section 7 is an error or a different process (one decision by the department manager); (c) both apply in sequence (department manager, then finance director: two decision actions); (d) each applies to a different scope, for example an amount band or a request category the fragments do not mention. The designer did not choose. (Owner: Process owner / author of the SOP)
- **D2** What is the request being approved, what starts a case and what ends it? Only the two approval sentences were supplied; the workflow name «Request approval», the fields `request_summary` and `justification` and the `prepare` action are placeholders. (Owner: Process owner)
- **D3** Who may open a request (create_incident: every employee, a team, or a named group) and which group owns the workflow design (edit)? The manifest declares `creator_only` until this is answered. (Owner: Process owner)
- **D4** If the department manager approves (D1 a/c/d): is it the requester's own department manager, chosen per case, or a fixed group of managers? A per-case owner needs a `user` field on the case with `assigneeRef: field:<key>` and a fallback group, which the product cannot assign automatically yet. (Owner: Process owner)
- **D5** Who decides in the finance director's absence? Section 7 says «only the finance director», so a delegate would change the rule and must be confirmed by the process owner. (Owner: Finance director)
- **D6** What is the service level for the decision and for preparing the request? No deadline was supplied; `due` stays unset until one is stated. (Owner: Process owner)
- **D7** Does the procedure allow «Reject» (case cancelled) and «Return for rework» (back to the requester)? Both branches are recommendations; the source gives only the approval. (Owner: Process owner)
- **D8** Country, language, currency and timezone of the organization. Angola, English, AOA and Africa/Luanda are provisional; no country was supplied. (Owner: Implementer)

## Setup notes

- `request-approval`: Action `decide` has no assignee: SOP section 2 names the department manager and section 7 names only the finance director. Assign it only after decision D1 is resolved; if the resolution is a two-step approval, the design gains a second decision action and must be re-run through provia-workflow-designer.
- `request-approval`: Groups `department_managers` and `finance_director` are proposals derived from the two sentences supplied; neither has members or an area yet.
- `request-approval`: No service level was supplied: `due` is unset on both actions (decision D6).
- `request-approval`: The `prepare` action, the fields `request_summary` and `justification`, and the «Return for rework» and «Reject» branches are recommendations: the source contains no intake, rejection or rework step (decisions D2 and D7).

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
