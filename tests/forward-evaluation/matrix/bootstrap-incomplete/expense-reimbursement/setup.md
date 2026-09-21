# Expense reimbursement: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| expense-reimbursement | Expense reimbursement | Import the YAML as a draft and review the preview (`expense-reimbursement/workflow.yaml`) |
| expense-reimbursement | Expense reimbursement | Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` section in the import preview. organization → create_incident |
| expense-reimbursement / submit_claim | Submit the expense receipts | Set the deadline; the design proposes no `due` |
| expense-reimbursement / approve_claim | Decide on the expense claim | Owner set manually per case: the product cannot assign from a field; the YAML carries the fallback (`field:manager`). line_managers |
| expense-reimbursement / approve_claim | Decide on the expense claim | Set the deadline; the design proposes no `due` |
| expense-reimbursement / pay_claim | Pay the approved reimbursement | Assign the group to the action once the group exists (`finance`) |
| expense-reimbursement / pay_claim | Pay the approved reimbursement | Configure the deadline by hand per case; the source sets a deadline `due` cannot express. calendar_day: Finance pays within the month |

## Workflow access

Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.

| Workflow | Sensitivity | Grantee | Level | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| `expense-reimbursement` | internal | `organization` | create_incident | Item (a) says the employee submits receipts; read as any employee of the organization may open a claim for their own expenses. (checklist-reimbursement §a) | to apply |
| `expense-reimbursement` | internal | `group:line_managers` | — | Sees its own cases only (no grant) | — |
| `expense-reimbursement` | internal | `group:finance` | — | Sees its own cases only (no grant) | — |

## Groups to create

- `line_managers` Line managers [role]: Approve the expense claims of the employees who report to them (checklist item b). Fallback owner of the approval when the approving manager named in the claim cannot be assigned per case.. Proposed members: Line manager of the claimant
- `finance` Finance [team]: Pay approved expense claims within the month and record the payment evidence (checklist item c).. Proposed members: Accounts payable officer

## Group flags

- `line_managers`: Owner unnamed in the sources. The checklist says «manager» without an org chart; which managers approve, and for whom, is unknown. Membership must come from the customer (decision D2).
- `line_managers`: Segregation of duties: confirm distinct owners. A manager who submits a claim must not approve it. The design assigns the approval to the manager named in the claim (field `manager`), with this group as fallback; the customer must confirm the rule for managers' own claims (decision D3).
- `finance`: Owner unnamed in the sources. «Finance» is named as a department; no members, lead or process owner were supplied (decision D1 and D6).

## Forms to create and link

- `expense-claim-intake` Expense claim: Create the intake form and link it to the workflow (expense-reimbursement / expense-claim-intake)

## Open decisions

- **D1** Who owns the expense reimbursement process (the person or group that will hold the `edit` grant, sign off the design and answer the other decisions)? No process owner is named in the checklist. (Owner: Customer sponsor)
- **D2** Which manager approves each claim: the claimant's direct line manager, a department head, or any member of a managers group? Provia cannot route by the requester's manager automatically; the design has the claimant name the approving manager in the field `manager` and keeps the group Line managers as fallback. The customer must supply the org chart or the list of approving managers. (Owner: Customer sponsor / Human Resources)
- **D3** Segregation: who approves a claim submitted by a manager, and is a claimant ever allowed to approve their own claim? The checklist does not say. (Owner: Process owner (D1))
- **D4** Service levels: how many workdays does the employee have to complete a returned claim, and how many does the manager have to decide? None were supplied, so `due` is unset on `submit_claim` and `approve_claim`. (Owner: Process owner (D1))
- **D5** «Finance pays within the month»: within the calendar month of approval, of submission, or of the expense? And is a fixed offset acceptable instead (for example 10 workdays after approval) so the deadline can be configured as `due`? Until answered, the payment deadline is set manually per claim. (Owner: Finance lead)
- **D6** Where does Finance take the claimant's bank details from (payroll, accounting system, HR file), and by which means are reimbursements paid (bank transfer, cash, payroll)? This decides whether an Employee entity type is needed in Provia; the design keeps bank details out of Provia. (Owner: Finance lead)
- **D7** Does Finance need to see every claim (a `view` grant on the workflow) to plan the monthly payment run, or only the claims that reach the payment action? The checklist does not say; no view grant is proposed. (Owner: Finance lead)
- **D8** The checklist has no rejection or correction path. The design proposes three outcomes for the manager: Approve, Return for correction (back to the employee) and Reject (closes the claim). Confirm or change. (Owner: Process owner (D1))
- **D9** Policy on limits: maximum amounts per claim or category, eligible expense categories, receipt requirements (original vs copy, minimum information) and what happens above a manager's authority. No policy exists; the decision brief tells the manager to apply the policy in force and to return the claim when unsure. Provide the policy or confirm that none applies for the pilot. (Owner: Finance lead / management)
- **D10** Language of the deliverable: the project was written in English as requested. Confirm whether the action names, briefs and form labels shown to employees in Angola should be delivered in pt-AO before publication. (Owner: Customer sponsor)

## Setup notes

- `expense-reimbursement`: Owners: `approve_claim` is intended for the manager the claimant names in the case field `manager`; the product cannot assign from a case field, so the fallback group Line managers (a role group) is the configured owner and the case owner is set manually per claim until the customer confirms the routing (decision D2).
- `expense-reimbursement`: Groups Line managers and Finance have no members: the customer supplied no org chart. Add members in Provia before the pilot.
- `expense-reimbursement`: The YAML omits `assignee` on `approve_claim` and `pay_claim` because the destination group ids are unknown; set them in Provia after creating the groups, or run resolve-workflow-refs.mjs once receipts exist.
- `expense-reimbursement`: No `due` is set on any action: the checklist gives no service level for submission or approval, and «within the month» (item c) is a calendar deadline the contract's offset-based `due` cannot express. Configure the payment deadline per case or agree an offset (decisions D4 and D5).
- `expense-reimbursement`: The intake form `expense-claim-intake` is a recommendation for self-service starts; forms are not carried by YAML and must be created and linked in Provia. Without it, employees start the claim from the manual trigger and fill the fields in `submit_claim`.
- `expense-reimbursement`: The rejection and return-for-correction branches are proposed, not in the checklist (decision D8).
- `expense-reimbursement`: Expense categories in `expense_category` are a proposed starting list, not customer policy; adjust to the customer's policy on limits once it exists (decision D9).
- `expense-reimbursement`: Claimants' bank details are not stored in Provia; Finance pays from the payroll or accounting system of record (decision D6).

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs expense-reimbursement/workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
