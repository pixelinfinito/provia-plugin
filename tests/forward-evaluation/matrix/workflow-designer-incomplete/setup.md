# Employee onboarding: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| onboarding | Employee onboarding | Import the YAML as a draft and review the preview (`workflow.yaml`) |
| onboarding | Employee onboarding | Register the entity type in the catalogue or map it to an existing key (`employee`) |
| onboarding | Employee onboarding | Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` section in the import preview. group:hr → create_incident, group:hr_management → edit |
| onboarding / register_hire | Register the hire and confirm the start details | Set the deadline; the design proposes no `due` |
| onboarding / prepare_contract | Prepare the employment contract and collect the new hire's documents | Assign the group to the action once the group exists (`hr`) |
| onboarding / prepare_contract | Prepare the employment contract and collect the new hire's documents | Set the deadline; the design proposes no `due` |
| onboarding / approve_contract | Decide on the employment contract | Assign the group to the action once the group exists (`hr_management`) |
| onboarding / approve_contract | Decide on the employment contract | Set the deadline; the design proposes no `due` |
| onboarding / record_signature | Record the outcome of the contract signing | Assign the group to the action once the group exists (`hr`) |
| onboarding / record_signature | Record the outcome of the contract signing | Set the deadline; the design proposes no `due` |
| onboarding / provision_access | Provision the accounts and equipment | Assign the group to the action once the group exists (`it_support`) |
| onboarding / provision_access | Provision the accounts and equipment | Set the deadline; the design proposes no `due` |
| onboarding / register_payroll | Register the employee in payroll and social security | Assign the group to the action once the group exists (`hr`) |
| onboarding / register_payroll | Register the employee in payroll and social security | Configure the deadline by hand per case; the source sets a deadline `due` cannot express. legal: Statutory registration deadlines are not asserted: the SOP and the jurisdiction confirmation are unavailable (decision D8). |
| onboarding / induct_employee | Conduct the first-day welcome and induction | Owner set manually per case: the product cannot assign from a field; the YAML carries the fallback (`field:hiring_manager`). hiring_managers |
| onboarding / induct_employee | Conduct the first-day welcome and induction | Configure the deadline by hand per case; the source sets a deadline `due` cannot express. event_relative: On the employee's first day (`start_date`); a due offset from activation cannot express a case-field date. |
| onboarding / prepare_probation_review | Prepare the probation review | Assign the group to the action once the group exists (`hr`) |
| onboarding / prepare_probation_review | Prepare the probation review | Configure the deadline by hand per case; the source sets a deadline `due` cannot express. event_relative: Before `probation_end_date`; the probation length is unknown (decision D4) and a due offset cannot express a case-field date. |
| onboarding / review_probation | Decide on the end of the probation period | Owner set manually per case: the product cannot assign from a field; the YAML carries the fallback (`field:hiring_manager`). hiring_managers |
| onboarding / review_probation | Decide on the end of the probation period | Configure the deadline by hand per case; the source sets a deadline `due` cannot express. event_relative: By `probation_end_date` (decision D4). |
| onboarding / close_onboarding | Close the onboarding record | Assign the group to the action once the group exists (`hr`) |
| onboarding / close_onboarding | Close the onboarding record | Set the deadline; the design proposes no `due` |

## Workflow access

Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.

| Workflow | Sensitivity | Grantee | Level | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| `onboarding` | internal | `group:hr` (Human Resources) | create_incident | Human Resources opens every onboarding case once the hire is approved (assumed). (sop-onboarding-assumed §A1) | to apply |
| `onboarding` | internal | `group:hr_management` (HR Management) | edit | Owns the process and the workflow design; may publish new versions (assumed process owner). (sop-onboarding-assumed §A4) | to apply |
| `onboarding` | internal | `group:it_support` | — | Sees its own cases only (no grant) | — |
| `onboarding` | internal | `group:hiring_managers` | — | Sees its own cases only (no grant) | — |

## Groups to create

- `hr` Human Resources [team]: Opens onboarding cases, prepares the contract, collects documents, registers payroll and closes the file. Real name of the unit unknown.. Proposed members: HR officer
- `hr_management` HR Management [team]: Approves the employment contract before signature and owns the workflow design. Assumed approver; the SOP may name a different authority.. Proposed members: Head of Human Resources
- `hiring_managers` Hiring managers [role]: Fallback owner for the actions the design assigns to the person in the `hiring_manager` case field (induction and probation review); the product cannot assign from a field yet, so the owner is set per case.
- `it_support` IT Support [team]: Creates accounts and prepares equipment before the start date.. Proposed members: IT technician

## Group flags

- `hr`: Owner unnamed in the sources. The SOP was not supplied; the unit's actual name and members are unknown (decision D2).
- `hr`: Segregation of duties: confirm distinct owners. Prepares the contract (prepare_contract) while hr_management approves it (approve_contract); keep the two groups separate (decision D5).
- `hr_management`: Owner unnamed in the sources. Assumed approver; the actual approving authority is decision D5.
- `hr_management`: Single-person actor: name a delegate. Likely one person; a group is proposed so approvals survive absences. Delegate to be named (decision D5).
- `hr_management`: Segregation of duties: confirm distinct owners. Approves what hr prepares; must not be the same people.
- `hiring_managers`: Owner unnamed in the sources. Membership unknown; whether hiring managers exist as a group in the organization is decision D2.
- `it_support`: Owner unnamed in the sources. Assumed actor; the SOP may split accounts (IT) from equipment and badges (general services) — decision D2.

## Open decisions

- **D1** Supply the actual onboarding SOP (or confirm each assumed section A1–A9). The whole design rests on an assumed outline; any section the SOP contradicts changes the actions and branches. (Owner: Process owner (HR) — to be named)
- **D2** Confirm the real names and members of the actors: the HR unit (hr), the approving HR authority (hr_management), IT Support (it_support), and whether hiring managers exist as a group or are set per case only. (Owner: Process owner (HR) — to be named)
- **D3** Which service levels apply to each action (days before start date for the contract, accounts and registrations; days for the approval; days for closing)? No due was set because none was supplied. (Owner: Process owner (HR) — to be named)
- **D4** What is the probation period, may it be extended, and who decides at its end (assumed: the hiring manager, with HR preparing the review)? (Owner: Process owner (HR) — to be named)
- **D5** Who approves the employment contract before signature (assumed: HR Management), what is their authority limit, and who is the delegate in their absence? The design keeps preparation (hr) and approval (hr_management) in separate groups. (Owner: Head of Human Resources — to be named)
- **D6** Are onboarding files (identification, bank and social-security data, contract terms) treated as restricted in the organization? If yes, sensitivity becomes `restricted` and every HR starter sees every onboarding case (access.note). (Owner: Process owner (HR) — to be named)
- **D7** Does an Employee entity type exist in Provia, and should the onboarding case create or link the employee record? Recorded in unresolvedEntityTypes as `employee`. (Owner: Implementer with the process owner)
- **D8** Confirm the country and jurisdiction (Angola is a provisional context) and which statutory registrations and deadlines apply to a new employee. None are asserted in the design. (Owner: Process owner (HR) with legal counsel)
- **D9** Which process handles the separation when the decision is «End during probation» or the hire withdraws after signature? The closing action records the hand-off only. (Owner: Process owner (HR) — to be named)
- **D10** Should the new hire, the hiring manager and IT be notified automatically (case opened, contract signed, first day, probation review due)? Recommended as notifications for provia-automation-designer; none are in the assumed outline. (Owner: Process owner (HR) — to be named)

## Setup notes

- `onboarding`: Design built on an assumed outline: the customer's onboarding SOP was not supplied and the tenant could not be read (org_get_context not permitted). Replace source sop-onboarding-assumed with the real SOP and re-run the design before packaging (D1).
- `onboarding`: induct_employee and review_probation are owned by the person in the `hiring_manager` case field; the product cannot assign from a field, so the owner is set manually per case (fallback group: Hiring managers).
- `onboarding`: No due offsets are set: no service level was supplied (D3). Deadlines tied to start_date and probation_end_date are recorded in dueInSource and need manual configuration or a case calendar.
- `onboarding`: workflow.yaml carries access grants by group name (Human Resources, HR Management); regenerate with scripts/emit-workflow-access.mjs once the manifest group names are confirmed.
- `onboarding`: No document templates are cited because the source is unavailable; the admission checklist, contract template, induction checklist and evaluation template named in the descriptions must be identified and listed in templates[] once the SOP is supplied.

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
