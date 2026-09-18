# Expense reimbursement: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Status

Mode: no Provia connection (manual configuration).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| expense-reimbursement | Expense reimbursement | Import the YAML as a draft and review the preview (`expense-reimbursement/workflow.yaml`) |
| expense-reimbursement / decide | Decide on the expense reimbursement claim | Assign the group to the action once the group exists (`managers`) |
| expense-reimbursement / decide | Decide on the expense reimbursement claim | Set the deadline; the design proposes no `due` |
| expense-reimbursement / pay | Pay the approved reimbursement | Assign the group to the action once the group exists (`finance`) |
| expense-reimbursement / pay | Pay the approved reimbursement | Set the deadline; the design proposes no `due` |

## Groups to create

- `managers` Managers: Approve or reject employee expense reimbursement claims.. Proposed members: Manager
- `finance` Finance: Process and pay approved employee expense reimbursement claims.. Proposed members: Finance officer

## Group flags

- `managers`: Owner unnamed in the sources. The checklist names the role "manager" but there is no org chart to resolve which manager owns which employee's claim. Provia needs either a per-employee reporting reference or a single shared group approving all claims until an org chart is supplied.
- `finance`: Segregation of duties: confirm distinct owners. If a Finance group member submits their own expense claim, the same group would end up paying itself. Confirm whether a second approver or an alternate payer is required for Finance's own claims.

## Forms to create and link

- `expense-claim-intake` Expense reimbursement request: Create the intake form and link it to the workflow (expense-reimbursement / expense-claim-intake)

## Open decisions

- **D1** No org chart was supplied. How is the specific manager for each employee's claim identified and assigned (a reporting-line lookup, a single shared approving group, or manual assignment per case)? (Owner: Process owner)
- **D2** No policy on limits was supplied. Is there a maximum reimbursable amount, a category of expenses that is excluded, or a higher amount that needs an additional approver? Provia does not route on amount automatically; a stated rule would be applied by the manager's Decision, not invented here. (Owner: Finance director)
- **D3** No service level was supplied for manager approval. What is the expected turnaround (for example, 2 workdays from submission)? (Owner: Process owner)
- **D4** The checklist states Finance pays "within the month", but Provia's due field only supports a fixed number of days/workdays from activation or creation, not a calendar month-end. How should this be represented (a fixed workday offset from approval, a monthly payment-run date handled outside the due field, or a scheduled reminder)? (Owner: Finance director)
- **D5** Should a Finance group member be allowed to process payment for their own submitted expense claim, or does that require a second approver for segregation of duties? (Owner: Finance director)
- **D6** The checklist does not mention a correction path if a manager wants more information rather than rejecting outright. Is a "return for correction" outcome needed? If so, claim submission should be modelled as a Form Fill action (with a return target) instead of an intake trigger form. (Owner: Process owner)

## Setup notes

- `expense-reimbursement`: The checklist has only three lines and does not name an org chart, service levels or approval/expense limits; the gaps are recorded as open decisions D1-D6 below rather than invented.
- `expense-reimbursement`: The training YAML assigns both actions to the case creator so it can be imported and trialled without fabricated destination ids. The intended owners are the groups in this manifest (managers, finance); reassign the actions once those groups exist in Provia.
- `expense-reimbursement`: Step (a), "employee submits receipts", is modelled as the workflow's intake form (see forms[]) rather than as a workflow action, because it is data collected before the case exists. The manual trigger in workflow.yaml is a portable placeholder; a form trigger cannot be authored in YAML and must be linked in Provia after import.
- `expense-reimbursement`: The Decision action only has Approve/Reject outcomes. The checklist does not mention returning a claim for correction, and there is no prior action to return to because submission is a form, not a workflow action. If the customer wants a correction loop, model claim submission as a Form Fill action instead of a trigger form so a return target exists (see D6).
- `expense-reimbursement`: No `due` is proposed on either action: the checklist states no approval turnaround, and "pays within the month" cannot be expressed as the fixed day/workday offset the due field supports. See D3 and D4.

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs expense-reimbursement/workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
