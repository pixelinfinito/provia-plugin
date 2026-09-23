# Employee onboarding: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.1, 2026-09-23).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| onboarding | Employee onboarding | Import the YAML as a draft and review the preview (`workflow.yaml`) |
| onboarding | Employee onboarding | Register the entity type in the catalogue or map it to an existing key (`employee`) |
| onboarding | Employee onboarding | Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` section in the import preview. group:hr → edit |
| onboarding / register_hire | Register the confirmed hire and open the onboarding case | Assign the group to the action once the group exists (`hr`) |
| onboarding / register_hire | Register the confirmed hire and open the onboarding case | Set the deadline; the design proposes no `due` |
| onboarding / collect_documents | Collect and check the new employee's documents | Assign the group to the action once the group exists (`hr`) |
| onboarding / collect_documents | Collect and check the new employee's documents | Set the deadline; the design proposes no `due` |
| onboarding / approve_plan | Decide on the onboarding plan and the access list | Owner set manually per case: the product cannot assign from a field; the YAML carries the fallback (`field:hiring_manager`). hiring_managers |
| onboarding / approve_plan | Decide on the onboarding plan and the access list | Set the deadline; the design proposes no `due` |
| onboarding / prepare_contract | Prepare the employment contract and the payroll registration | Assign the group to the action once the group exists (`hr`) |
| onboarding / prepare_contract | Prepare the employment contract and the payroll registration | Set the deadline; the design proposes no `due` |
| onboarding / create_access | Create the accounts and the system access | Assign the group to the action once the group exists (`it`) |
| onboarding / create_access | Create the accounts and the system access | Set the deadline; the design proposes no `due` |
| onboarding / prepare_equipment | Prepare the workstation and the equipment | Assign the group to the action once the group exists (`it`) |
| onboarding / prepare_equipment | Prepare the workstation and the equipment | Set the deadline; the design proposes no `due` |
| onboarding / decide_start | Decide whether the start proceeds on the planned date | Assign the group to the action once the group exists (`hr`) |
| onboarding / decide_start | Decide whether the start proceeds on the planned date | Set the deadline; the design proposes no `due` |
| onboarding / run_induction | Run the day-one induction | Assign the group to the action once the group exists (`hr`) |
| onboarding / run_induction | Run the day-one induction | Set the deadline; the design proposes no `due` |
| onboarding / introduce_to_team | Introduce the new employee and agree the role plan | Owner set manually per case: the product cannot assign from a field; the YAML carries the fallback (`field:hiring_manager`). hiring_managers |
| onboarding / introduce_to_team | Introduce the new employee and agree the role plan | Set the deadline; the design proposes no `due` |
| onboarding / decide_period_end | Decide on the end of the onboarding period | Owner set manually per case: the product cannot assign from a field; the YAML carries the fallback (`field:hiring_manager`). hiring_managers |
| onboarding / decide_period_end | Decide on the end of the onboarding period | Set the deadline; the design proposes no `due` |

## Workflow access

Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.

| Workflow | Sensitivity | Grantee | Level | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| `onboarding` | internal | `group:hr` (Human Resources) | edit | Proposed, not evidenced: Human Resources owns the onboarding design and opens every case. edit is cumulative, so it also carries create_incident. Confirm in decision D4 before applying. (request-brief §assumed) | to apply |
| `onboarding` | internal | `group:hiring_managers` | — | Sees its own cases only (no grant) | — |
| `onboarding` | internal | `group:it` | — | Sees its own cases only (no grant) | — |

## Groups to create

- `hr` Human Resources [team]: Opens the onboarding case, collects the employee's documents, prepares the contract and the payroll registration, decides on the start readiness and runs the day-one induction. Proposed actor: no supplied source names it.
- `it` IT [team]: Creates the approved accounts and system access and prepares the workstation and equipment. Proposed actor: no supplied source names it.
- `hiring_managers` Hiring Managers [role]: Fallback owner for the actions the hiring manager of the case performs: approving the onboarding plan and the access list, introducing the employee to the team and deciding on the end of the onboarding period. Used only where the per-case owner in the hiring_manager field cannot be applied.

## Group flags

- `hr`: Owner unnamed in the sources. No supplied source names the team that owns onboarding. The key, the name and the responsibilities are proposals; decision D3 names the real owner.
- `it`: Owner unnamed in the sources. No supplied source names the team that provisions access and equipment. Decision D3 names the real owner.
- `it`: Segregation of duties: confirm distinct owners. IT grants the access that the hiring manager approves in approve_plan. Keep the approval and the provisioning in different groups; decision D5 asks whether privileged access needs a second approver.
- `hiring_managers`: Owner unnamed in the sources. The hiring manager is per case, not a standing team. This role group exists because Provia cannot assign from a case field; decision D6 confirms who holds it.

## Open decisions

- **D1** Which document is the actual onboarding SOP, and where does this proposed design differ from it? Nothing here was derived from a customer document. (Owner: Process owner (onboarding))
- **D2** What service level applies to each action: document collection, contract and payroll, access provisioning, equipment, the readiness decision and the length of the onboarding period? No due was invented. (Owner: Process owner (onboarding))
- **D3** Which real teams own the work proposed here as Human Resources and IT, and what are their names in the tenant? The group keys and names are placeholders. (Owner: Process owner (onboarding))
- **D4** Who opens an onboarding case: Human Resources only, as proposed, or may a hiring manager open one directly? The answer decides whether a second create_incident grant or a manual-start allowlist is needed. (Owner: Process owner (onboarding))
- **D5** Does the hiring manager alone approve the access list, or does privileged or system-administrator access need a second approver? No threshold or approval rule was supplied and none was invented. (Owner: Process owner (onboarding))
- **D6** Provia cannot assign an action from a case field. For approve_plan, introduce_to_team and decide_period_end, should the assignee be set manually per case from hiring_manager, or should the Hiring Managers group hold them? (Owner: Process owner (onboarding))
- **D7** Should this workflow be restricted rather than internal? The case carries identity documents, an employment contract and a payroll registration. No supplied document uses the words that would settle it. (Owner: Process owner (onboarding))
- **D8** Are payroll and benefits registration part of onboarding, as folded into prepare_contract here, or a separate process with its own owner? (Owner: Process owner (onboarding))
- **D9** Is the case opened manually by Human Resources, as designed, or from an intake form handed over by recruiting? A form trigger is not authorable in the portable YAML and must be configured in Provia. (Owner: Process owner (onboarding))
- **D10** Does ending the onboarding period without completing it belong in this workflow at all? decide_period_end closes the case and leaves any employment consequence outside; confirm that a separate process handles it. (Owner: Process owner (onboarding))
- **D11** Country, jurisdiction and response language were not supplied. Angola, Africa/Luanda and AOA are recorded as a provisional starting context and the design is written in English; confirm or correct before publication. (Owner: Process owner (onboarding))

## Setup notes

- `onboarding`: No onboarding SOP was supplied. This workflow is a proposal built on a declared assumed baseline; do not publish it before the actual SOP is supplied and reconciled against it (decision D1).
- `onboarding`: No deadline is set on any action because no service level was supplied. Every due is unset by design, not by omission (decision D2).
- `onboarding`: approve_plan, introduce_to_team and decide_period_end are owned per case by the user in the hiring_manager field. Provia cannot assign from a case field: configure the Hiring Managers group as the assignee and set the owner manually per case, or accept the fallback (decision D6).
- `onboarding`: The intake form trigger is recorded as a proposal only. A form trigger cannot be authored in the portable YAML; it must be created in Provia and specified by provia-form-designer (decision D9).
- `onboarding`: Group ids do not exist yet. The YAML carries no assignee for any action and the access grant is written by group name; both need real destination references before import.
- `onboarding`: A provia-implementer MCP server was offered in the design session but the org_get_context call was not permitted, so the tenant was never read. The design is disconnected: no group, user, entity type or workflow was read from or written to Provia, and every group key here is a proposal rather than a tenant reference.

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
