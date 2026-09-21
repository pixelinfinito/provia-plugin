# IT request classification with human review: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| it-requests | IT request | Import the YAML as a draft and review the preview (`workflow.yaml`) |
| it-requests | IT request | Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` section in the import preview. organization → create_incident |
| it-requests / classify | Classify the IT request | Assign the AI profile to the action (`ai:classify-it-requests`) |
| it-requests / classify | Classify the IT request | Set the deadline; the design proposes no `due` |
| it-requests / review-classification | Confirm the classification of the IT request | Assign the group to the action once the group exists (`service-desk`) |
| it-requests / review-classification | Confirm the classification of the IT request | Set the deadline; the design proposes no `due` |
| it-requests / fulfil | Fulfil the IT request | Assign the group to the action once the group exists (`service-desk`) |
| it-requests / fulfil | Fulfil the IT request | Set the deadline; the design proposes no `due` |

## Workflow access

Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.

| Workflow | Sensitivity | Grantee | Level | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| `it-requests` | internal | `organization` | create_incident | Assumption: any employee may open an IT request. No source confirms it; see decision D4. (request-2026-09-21 §gap) | to apply |
| `it-requests` | internal | `group:service-desk` | — | Sees its own cases only (no grant) | — |

## Groups to create

- `service-desk` Service desk [team]: Reviews the AI-proposed classification of IT requests and fulfils them. Proposed by the AI action designer because no source names the reviewing team.

## Group flags

- `service-desk`: Owner unnamed in the sources. No source names the team or its members; confirm the real group name and membership with IT before setup.

## AI profiles to configure

- `classify-it-requests` Classify IT requests

## Open decisions

- **D1** Which category list does IT actually use? The profile ships a provisional list (incident, service_request, access_request, change_request, information, unclear). Replace it with the organisation's own list before the pilot, or confirm the provisional one. (Owner: IT manager)
- **D2** Which priority scale and impact rules apply? The profile ships a provisional four-level scale (critical, high, medium, low) driven by who is blocked. Confirm the scale, the rules and any service levels per priority. (Owner: IT manager)
- **D3** Who reviews the AI proposal? The design assumes a «Service desk» team. Confirm the real group, its members and whether a second person must confirm critical priorities. (Owner: IT manager)
- **D4** May any employee open an IT request (organization-wide create_incident), or only some groups? The access section assumes any employee. (Owner: IT manager)
- **D5** Does the service desk need to see every IT request (a shared queue, which requires a view grant), or only the cases assigned to its members? (Owner: IT manager)
- **D6** What happens after classification? The fulfil action is a placeholder; the real resolution steps, routing by category and any approvals need the IT procedure. (Owner: IT manager)
- **D7** Service levels: how soon must the AI proposal exist and how soon must the reviewer confirm it? No due is set on any action because no service level was supplied. (Owner: IT manager)
- **D8** Confidence threshold: the profile proposes 0.7 as a starting value so that low-confidence proposals are visibly flagged to the reviewer. Confirm or adjust after the pilot evaluation cases are run. (Owner: IT manager)
- **D9** Country and language: Angola and English were used provisionally because none was supplied. Confirm the country of operation and whether case labels and briefs should be in pt-AO. (Owner: Project sponsor)

## Setup notes

- `it-requests`: AI profile: create the profile «Classify IT requests» in Provia (AI settings) with the instructions in ai-profile-classify-it-requests.md, then replace the placeholder $AI_PROFILE_CLASSIFY_IT_REQUESTS in workflow.yaml (actions[0].assignee.id) with the profile id Provia shows. The plugin does not create AI profiles.
- `it-requests`: AI availability: AI-assigned actions depend on the organisation's plan, the AI settings and the permissions of the signed-in implementer. Confirm in the Provia UI that AI agents can be assigned to Standard actions before importing.
- `it-requests`: Agent Memory: metadata.agentMemoryEnabled is false. If IT supplies its category list and service catalogue, add them as approved memory documents in Provia and set the flag; YAML never carries memory content.
- `it-requests`: Reviewer group: create or map the «Service desk» group and set it as owner of review-classification and fulfil; the YAML omits these assignees because no destination id exists.
- `it-requests`: The fulfil action is a placeholder for the real resolution process; design it with provia-workflow-designer once IT supplies its procedure (decision D6).

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
