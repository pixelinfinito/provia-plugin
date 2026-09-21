# Purchase request with three supplier quotations: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| compras | Purchase request | Import the YAML as a draft and review the preview (`workflow.yaml`) |
| compras / register-quotation | Register the supplier quotations received | Assign the group to the action once the group exists (`compras`) |
| compras / register-quotation | Register the supplier quotations received | Set the deadline; the design proposes no `due` |
| compras / select-quotation | Select the winning quotation | Assign the group to the action once the group exists (`compras`) |
| compras / select-quotation | Select the winning quotation | Set the deadline; the design proposes no `due` |

## Workflow access

Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.

| Workflow | Sensitivity | Grantee | Level | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| `compras` | internal | creator and organization administrators only (`default: creator_only`) | — | No source states who may open a purchase request, so the workflow is declared creator-only until decision D3 is resolved. Purchasing sees the cases that carry its actions without a grant. | — |
| `compras` | internal | `group:compras` | — | Sees its own cases only (no grant) | — |

## Groups to create

- `compras` Purchasing [team]: Requests and registers supplier quotations and selects the winning quotation. Proposed by provia-form-designer; the request names no team.. Proposed members: Purchasing officer

## Group flags

- `compras`: Owner unnamed in the sources. The request does not name who collects quotations; Purchasing is assumed.

## Forms to create and link

- `cotacao-fornecedor` Supplier quotation: Create the form and link it to the Form Fill action (compras / cotacao-fornecedor)

## Open decisions

- **D1** Who submits each quotation response: Purchasing staff signed in to Provia (assumed), or the suppliers themselves through an external link? External access depends on the configured form behaviour and has not been checked. (Owner: Purchasing lead)
- **D2** What is the deadline for collecting the three quotations and for selecting one? No service level was supplied, so both actions have no due offset. (Owner: Purchasing lead)
- **D3** Who may open a purchase request (any employee, or only Purchasing)? The workflow is declared creator-only until this is answered. (Owner: Process owner)
- **D4** The request asked for each response amount to be mapped to the same incident field purchase_amount. Multiple responses cannot map competing values, and even if they could, the last submission would silently overwrite the others. The design records the amount through the review action select-quotation instead. Confirm this, or choose the alternative of three single-response Form Fill actions mapping to quotation_1_amount, quotation_2_amount and quotation_3_amount plus the same review step. (Owner: Purchasing lead)
- **D5** May the case continue with fewer than three quotations when suppliers do not answer, and who authorizes that exception? The action brief currently sends the question to the Purchasing lead by comment. (Owner: Purchasing lead)

## Setup notes

- `compras`: The form "Supplier quotation" (forms[].key cotacao-fornecedor) must be created in Provia and linked to action register-quotation after import; forms are not carried by the YAML.
- `compras`: Configure the Form Fill link to accept multiple responses (one per quotation). Verify in the Provia form settings that multiple responses are allowed on this link and that the action can be completed after three responses; the plugin cannot read those settings offline.
- `compras`: Do not map quotation_amount (or any form field) to incident metadata on this link: the response policy is multiple responses, and multiple responses cannot map competing values to the incident (references/provia-capabilities.md). purchase_amount is filled by action select-quotation.
- `compras`: Assign register-quotation and select-quotation to the Purchasing group once the group exists; the YAML carries no assignee.
- `compras`: Both actions have no due offset: no service level was supplied (decision D2).
- `compras`: Respondents are assumed internal (Purchasing staff signed in to Provia). If suppliers are meant to submit the form themselves, confirm the external access model in the Provia form settings before promising a link (decision D1).
- `compras`: File upload limits on the form field quotation_file must be confirmed in the Provia form settings; the 10 MB per file value in quotation-form.md is a recommendation, not a product limit.

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
