# Supplier quotation comparison and award: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| supplier-selection | Supplier quotation comparison and award | Import the YAML as a draft and review the preview (`workflow.yaml`) |
| supplier-selection | Supplier quotation comparison and award | Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` section in the import preview. group:purchasing → edit |
| supplier-selection / register_request | Register the purchase need and attach the quotations | Set the deadline; the design proposes no `due` |
| supplier-selection / compare_quotations | Compare the supplier quotations and prepare a recommendation | Assign the AI profile to the action (`ai:compare-quotations`) |
| supplier-selection / compare_quotations | Compare the supplier quotations and prepare a recommendation | Set the deadline; the design proposes no `due` |
| supplier-selection / decide_award | Decide the supplier award | Assign the group to the action once the group exists (`purchasing`) |
| supplier-selection / decide_award | Decide the supplier award | Set the deadline; the design proposes no `due` |

## Workflow access

Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.

| Workflow | Sensitivity | Grantee | Level | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| `supplier-selection` | internal | `group:purchasing` (Purchasing) | edit | Purchasing owns the process design and the award decision; edit lets it maintain and publish versions. Assumption pending D3. (request-2026-09-21 §select) | to apply |

## Groups to create

- `purchasing` Purchasing [team]: Reviews the AI comparison and decides the supplier award. Proposed group; the request names no team.. Proposed members: Purchasing officer

## Group flags

- `purchasing`: Owner unnamed in the sources. The request does not name who reviews or decides; Purchasing is a proposal.

## AI profiles to configure

- `compare-quotations` Supplier quotation comparison

## Open decisions

- **D1** The request asked the AI to select the winner and approve its own recommendation without a human decision. The design keeps the award as a human Decision action (decide_award) because AI agents are assignees on Standard actions only, Decision outcomes are chosen by a person, and final approvals stay with authorized people. Does the process owner accept this separation, or is there an authorized policy for automatic awards that should be reviewed first? (Owner: Purchasing manager (process owner))
- **D2** Which evaluation criteria and weights apply (price, delivery, payment terms, warranty, compliance), and how many quotations are required per purchase? The profile defaults to price-then-delivery and needs at least two matching quotations until policy says otherwise. (Owner: Purchasing manager)
- **D3** Who may open a supplier-selection case: any employee (organization create_incident) or only Purchasing? Access is creator_only until decided. (Owner: Purchasing manager)
- **D4** Does award authority depend on the purchase amount (a threshold above which someone other than Purchasing decides)? No threshold was supplied and none was invented; decide_award tells the decider to hand over when the amount exceeds their authority. (Owner: Finance director / Purchasing manager)
- **D5** Are quotations always PDF, or must images and spreadsheets be accepted? The artifact contract accepts PDF up to 20 MB; other formats need the profile settings changed. (Owner: Purchasing manager)

## Setup notes

- `supplier-selection`: Create the AI agent profile 'Supplier quotation comparison' in Provia (plan and settings permitting) and set it as the ai_agent assignee of action compare_quotations; the YAML carries no profile id because none exists yet.
- `supplier-selection`: Confirm in the Provia profile settings that reviewRequired holds the AI output for a human reviewer before the action completes, and configure who reviews (proposed: Purchasing).
- `supplier-selection`: The request asked the AI to approve its own recommendation. This is not configured: AI agents are assignees on Standard actions only and Decision outcomes are chosen by a person (see D1).
- `supplier-selection`: Agent Memory is disabled (agentMemoryEnabled: false). If the purchasing team later approves a glossary of supplier names or standing criteria, add it as a memory document in Provia; YAML does not carry memory.
- `supplier-selection`: Attach the reviewed evaluation cases in ai-profile-compare-supplier-quotations.md to the profile test run before publishing.

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
