# Expense reimbursement: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| expense-reimbursement | Expense reimbursement | Import the YAML as a draft and review the preview (`expense-reimbursement/workflow.yaml`) |
| expense-reimbursement | Expense reimbursement | Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` section in the import preview. organization → create_incident |
| expense-reimbursement / submit_receipts | Submit the receipts for reimbursement | Set the deadline; the design proposes no `due` |
| expense-reimbursement / decide_claim | Decide on the expense claim | Owner set manually per case: the product cannot assign from a field; the YAML carries the fallback (`field:line_manager`). line_managers |
| expense-reimbursement / decide_claim | Decide on the expense claim | Set the deadline; the design proposes no `due` |
| expense-reimbursement / pay_reimbursement | Pay the approved reimbursement | Assign the group to the action once the group exists (`finance`) |
| expense-reimbursement / pay_reimbursement | Pay the approved reimbursement | Configure the deadline by hand per case; the source sets a deadline `due` cannot express. calendar_day: finance pays within the month |

## Workflow access

Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.

| Workflow | Sensitivity | Grantee | Level | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| `expense-reimbursement` | internal | `organization` | create_incident | Checklist item (a): the employee submits receipts. Any employee of the organization may open a claim; no restriction on who may claim was supplied. (checklist-expense §a) | to apply |
| `expense-reimbursement` | internal | `group:line_managers` | — | Sees its own cases only (no grant) | — |
| `expense-reimbursement` | internal | `group:finance` | — | Sees its own cases only (no grant) | — |

## Groups to create

- `line_managers` Line managers [role]: Placeholder for the employee's manager who approves the claim (checklist item b). The intended owner is the person chosen in the case field line_manager; this group receives the decision only when that field is empty. Membership cannot be proposed without an org chart.. Proposed members: Manager of the claiming employee
- `finance` Finance [team]: Pays approved reimbursements and records the payment evidence (checklist item c).. Proposed members: Finance staff who execute reimbursement payments

## Group flags

- `line_managers`: Owner unnamed in the sources. The checklist says «manager» without naming who manages whom; no org chart was supplied (decision D4).
- `line_managers`: Segregation of duties: confirm distinct owners. A manager's own claim must not be approved by the same person; the checklist does not say who approves a manager's claim (decision D14).
- `finance`: Owner unnamed in the sources. The checklist names «finance» as a function; the people, their emails and a delegate are not supplied (decision D5).

## Forms to create and link

- `expense-claim-intake` Expense claim: Create the intake form and link it to the workflow (expense-reimbursement / expense-claim-intake)

## Open decisions

- **D1** Who owns the design of this workflow (the edit grant) and which area owns the process? The checklist names no process owner; ownerArea is provisionally set to finance. (Owner: Customer sponsor)
- **D2** «Finance pays within the month»: the month of submission or of approval? Can it be expressed as a workday offset after approval (due), or must it stay a calendar-month deadline configured manually? (Owner: Finance lead)
- **D3** There is no policy on limits. Should the manager approve any amount, or is a second approval wanted above some amount or for some categories? No threshold was encoded. (Owner: Finance lead)
- **D4** No org chart: the employee chooses their manager in the intake field line_manager and the group «Line managers» is the fallback. Is this acceptable, or will the customer supply the org chart (employee → manager) so the assignment can be fixed? (Owner: Human resources)
- **D5** Who is in the group «Finance» (names and emails) and who is the delegate when the payer is absent? (Owner: Finance lead)
- **D6** No service levels were supplied: how many workdays does the employee have to submit receipts and the manager to decide? due is left unset on submit_receipts and decide_claim. (Owner: Customer sponsor)
- **D7** The checklist has no rejection or correction path. The design proposes three outcomes for the manager: Approve, Return for correction, Reject (cancels the claim). Confirm or change. (Owner: Customer sponsor)
- **D8** Does Finance need to see every claim (a monthly payment batch), which would require a view grant showing all cases, or only the claims assigned to it? (Owner: Finance lead)
- **D9** Where do the employee's payment details come from? The design does not collect bank details in the claim and assumes Finance pays to the account already registered for the employee (payroll). Confirm. (Owner: Finance lead)
- **D10** Recommendation not in the checklist: notify the employee when the claim is rejected and when it is paid (an in-app/email notification to the creator). Add it? (Owner: Customer sponsor)
- **D11** No entity type is proposed: the claim is a case, the receipts are files, the employee is the case creator and the manager a user field. Should a Cost centre or Employee entity be added once an org chart or cost-centre list exists? (Owner: Customer sponsor)
- **D12** Connected mode: the Provia MCP server was present but the tool call was not permitted in this session, so the tenant was not read and nothing was applied. Grant the implementer tool access (implement:read, and implement:permissions for the organization-wide create_incident grant) and run the apply after review? (Owner: Implementer)
- **D13** The expense category list (travel, meals, transport, accommodation, supplies, other) is a proposal; no category or per-diem policy was supplied. Confirm or replace the list. (Owner: Finance lead)
- **D14** Segregation: who approves a manager's own claim, and who approves when the chosen manager is absent? The decision brief tells a manager not to decide their own claim, but no alternative approver is named. (Owner: Customer sponsor)

## Setup notes

- `expense-reimbursement`: Connected mode was not used: the Provia MCP server was listed in the session, but the org_get_context call was not permitted, so the tenant was not read and nothing was applied. Run the apply steps (groups, workflow draft, form, access) after the customer review, dry run first.
- `expense-reimbursement`: Create the groups «Line managers» (fallback for the manager decision) and «Finance» before importing; the YAML carries no assignee for decide_claim and pay_reimbursement. Set decide_claim's default responsible to «Line managers» and pay_reimbursement's to «Finance» in the draft.
- `expense-reimbursement`: The manager is chosen per case in the field line_manager (user). The product cannot assign from a case field: after import, the assignee of decide_claim must be set per case (or by the group «Line managers» reassigning) until the customer supplies an org chart or an assignment rule.
- `expense-reimbursement`: Configure the intake form «Expense claim» (forms[] key expense-claim-intake) as the form trigger of this workflow; the YAML carries only the manual trigger. Map the form answers to the case fields with the same keys.
- `expense-reimbursement`: The deadline «within the month» (item c) is a calendar-month deadline that the due model (days after activation) cannot express; configure it manually or agree a workday offset (decision D2).
- `expense-reimbursement`: The currency of amount_claimed and amount_approved is AOA (Kz); confirm the currency configuration of the two fields in the destination.
- `expense-reimbursement`: Employee bank details are not collected in the case; Finance pays to the account it already holds for the employee (decision D9).

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs expense-reimbursement/workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
