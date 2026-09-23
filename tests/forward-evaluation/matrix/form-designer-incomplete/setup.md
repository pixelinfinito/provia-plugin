# Self-service IT requests: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.1, 2026-09-23).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| pedidos-ti | IT support request | Import the YAML as a draft and review the preview |
| pedidos-ti | IT support request | Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` section in the import preview. organization → create_incident |
| pedidos-ti / triar-pedido | Triage the IT request | Assign the group to the action once the group exists (`suporte-ti`) |
| pedidos-ti / triar-pedido | Triage the IT request | Set the deadline; the design proposes no `due` |

## Workflow access

Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.

| Workflow | Sensitivity | Grantee | Level | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| `pedidos-ti` | internal | `organization` | create_incident | Assumed, not sourced: a self-service IT request form implies that any employee may open a case. Narrow this grant if the respondent scope in decision D1 turns out to be smaller. | to apply |
| `pedidos-ti` | internal | `group:suporte-ti` | — | Sees its own cases only (no grant) | — |

## Groups to create

- `suporte-ti` IT Support [team]: Receives, triages and works self-service IT requests submitted through the intake form.

## Group flags

- `suporte-ti`: Owner unnamed in the sources. No source named the team, its members or its real Provia group name. Name and membership are assumed and must be confirmed before any grant or assignment is configured (decision D2).

## Forms to create and link

- `pedido-ti` IT request: Create the intake form and link it to the workflow (pedidos-ti / pedido-ti)

## Open decisions

- **D1** Who submits this form, and through which access path? Authenticated employees inside Provia, or people without a Provia account through an external or anonymous link? The configured form behaviour in this environment was not verified, so no external or anonymous path is promised. The answer decides whether requester_name and requester_email are needed and whether the organization-wide create_incident grant is correct. (Owner: IT service owner)
- **D2** What is the real IT service catalogue behind request_type and affected_service, and what is the IT Support team's actual name and membership in Provia? The current option list and the group name are provisional. (Owner: IT service owner)
- **D3** Is there an agreed response or resolution target per impact level, and may the confirmation state it? Until this is answered the confirmation promises only that the request was registered and that IT will make contact, with no deadline. (Owner: IT service owner)
- **D4** Does IT Support work a shared queue that needs a view grant over every IT request, or does assignment alone give them the cases they work? No view grant was proposed without a source saying the team sees every case. (Owner: IT service owner)
- **D5** What upload policy applies: accepted file types, maximum size enforced by the destination, and whether screenshots that may contain colleagues' personal data are acceptable in an internal-sensitivity case? (Owner: IT service owner)
- **D6** Beyond the on-screen confirmation, should the requester receive a notification with the case reference, and can the form confirmation itself display that reference in this environment? Both need verification in Provia; the notification would be designed with provia-automation-designer. (Owner: IT service owner)
- **D7** What is the site, building and floor list that should replace the free-text location field? (Owner: IT service owner)
- **D8** In which language do respondents see this form, and is Angola the operating country? Angola was used as a provisional context (Africa/Luanda, AOA) and the form was drafted in English because the request was in English; a pt-AO version is a translation of the same field keys. (Owner: IT service owner)
- **D9** What happens after triage? The workflow entry pedidos-ti is a skeleton created so the form has a destination: assignment, resolution, closure and any approval for new equipment or access were not supplied and were not designed here. (Owner: IT service owner)

## Setup notes

- `pedidos-ti`: Skeleton only. This workflow entry exists so the intake form has a destination to be traced to; the steps after triage (assignment, resolution, closure and any approval for equipment or access) were not designed and were not supplied. Design them with provia-workflow-designer before packaging.
- `pedidos-ti`: The case metadata schema must declare the fields the intake form maps to before the form is created: summary (text), description (rich_text), request_type (select), impact (select), affected_service (text), location (text), contact_phone (phone). Field keys in the form and in the workflow must match exactly for the mapping to be configurable.
- `pedidos-ti`: Forms are not carried by the portable YAML contract. Create the form, its field mappings, its access path and its confirmation text manually in Provia, or through connected mode, after the workflow draft exists.
- `pedidos-ti`: A case reference (auto_number) cannot be asked on a form: the form field enum excludes auto_number. If the confirmation screen must show a reference, verify in the destination what the form confirmation can display before promising it to respondents.
- `pedidos-ti`: No submission, mapping, access or confirmation test has been run. The test plan in form-it-request.md is pending execution by the implementer in a real environment.

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
