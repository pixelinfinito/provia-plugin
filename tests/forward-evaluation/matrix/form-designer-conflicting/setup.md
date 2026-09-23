# Supplier quotation collection: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.1, 2026-09-23).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| supplier-quotations | Supplier quotation collection | Import the YAML as a draft and review the preview (`workflow.yaml`) |
| supplier-quotations | Supplier quotation collection | Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` section in the import preview. group:procurement → create_incident |
| supplier-quotations / collect-quotations | Collect supplier quotations | Assign the group to the action once the group exists (`procurement`) |
| supplier-quotations / collect-quotations | Collect supplier quotations | Set the deadline; the design proposes no `due` |
| supplier-quotations / record-selected-quotation | Record the selected quotation | Assign the group to the action once the group exists (`procurement`) |
| supplier-quotations / record-selected-quotation | Record the selected quotation | Set the deadline; the design proposes no `due` |

## Workflow access

Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.

| Workflow | Sensitivity | Grantee | Level | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| `supplier-quotations` | internal | `group:procurement` (Procurement) | create_incident | Procurement opens the case that collects the three quotations; no other starter was named in the request (request-2026-09-23 §1) | to apply |

## Groups to create

- `procurement` Procurement [team]: Proposed owner of the quotation collection: asks suppliers for quotations, records each response and records the selected quotation. Not confirmed by a supplied source.. Proposed members: Procurement officer

## Group flags

- `procurement`: Segregation of duties: confirm distinct owners. The same group is proposed for collecting the quotations and for recording the selection that writes the case amount. Confirm with the process owner whether these must be different people (decision D2).

## Forms to create and link

- `supplier-quotation` Supplier quotation: Create the form and link it to the Form Fill action (supplier-quotations / supplier-quotation)
- `quotation-selection` Quotation selection: Create the form and link it to the Form Fill action (supplier-quotations / quotation-selection)

## Open decisions

- **D1** Confirm that incident_amount must carry the selected quotation only. Three quotation amounts cannot share one case field; if the process instead needs all three amounts in case metadata, three separate single-response Form Fill actions writing quotation_1_amount, quotation_2_amount and quotation_3_amount are the alternative (see forms.md, Alternative B). (Owner: Process owner (not named))
- **D2** Must the person who collects the quotations be different from the person who records the selection that writes the case amount? (Owner: Process owner (not named))
- **D3** What deadline applies to collecting the quotations and to recording the selection? No service level was supplied, so due is unset on both actions. (Owner: Process owner (not named))
- **D4** Do suppliers submit their own quotations, or does a member of Procurement transcribe them? Form Fill responses are collected inside an existing case; external or anonymous submission was not verified against the configured form behaviour. (Owner: Process owner (not named))
- **D5** Should the supplier be a Provia entity type, so the quotation form references a registered supplier instead of free text in supplier_name? (Owner: Procurement lead (not named))
- **D6** Who approves the selected amount once it reaches incident_amount, and above which value? No approval step or threshold was supplied, so none is designed. (Owner: Process owner (not named))

## Setup notes

- `supplier-quotations`: Forms are not carried by the workflow YAML. Create both forms in Provia and link each one to its Form Fill action before publication.
- `supplier-quotations`: Response policy is the design decision that makes this work: Collect supplier quotations accepts MULTIPLE responses and maps nothing; Record the selected quotation accepts ONE response and carries every mapping.
- `supplier-quotations`: Confirm in the Provia form editor which of the mappings in forms.md are actually offered for the field types used. Mappings to currency (incident_amount) and rich text (selection_rationale) are designed, not verified.
- `supplier-quotations`: Both actions are assigned to the group Procurement in this manifest. The YAML carries no assignee because no destination UUIDs are known; set the owner in Provia or supply receipts.
- `supplier-quotations`: No deadline is configured on either action: none was supplied (decision D3).
- `supplier-quotations`: Scope: this workflow covers the quotation collection only. The purchase request intake, the approval of the selected amount and the order to the supplier are not designed here.

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
