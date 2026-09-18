# Employee onboarding: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Status

Mode: no Provia connection (manual configuration).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| onboarding | Employee onboarding | Import the YAML as a draft and review the preview (`workflow.yaml`) |
| onboarding / decidir_admissao | Decide on the admission request | Assign the group to the action once the group exists (`recursos_humanos`) |
| onboarding / decidir_admissao | Decide on the admission request | Set the deadline; the design proposes no `due` |
| onboarding / preparar_contrato | Prepare the employment contract | Assign the group to the action once the group exists (`recursos_humanos`) |
| onboarding / preparar_contrato | Prepare the employment contract | Set the deadline; the design proposes no `due` |
| onboarding / confirmar_assinatura_contrato | Confirm the signed contract | Assign the group to the action once the group exists (`recursos_humanos`) |
| onboarding / confirmar_assinatura_contrato | Confirm the signed contract | Set the deadline; the design proposes no `due` |
| onboarding / notificar_ti_instalacoes | Notify IT and Facilities of the confirmed hire | Assign the group to the action once the group exists (`recursos_humanos`) |
| onboarding / provisionar_contas_ti | Provision IT accounts and equipment | Assign the group to the action once the group exists (`ti`) |
| onboarding / provisionar_contas_ti | Provision IT accounts and equipment | Set the deadline; the design proposes no `due` |
| onboarding / preparar_espaco_e_cartao | Prepare workspace and access badge | Assign the group to the action once the group exists (`instalacoes`) |
| onboarding / preparar_espaco_e_cartao | Prepare workspace and access badge | Set the deadline; the design proposes no `due` |
| onboarding / agendar_orientacao | Schedule the Day 1 orientation | Assign the group to the action once the group exists (`recursos_humanos`) |
| onboarding / agendar_orientacao | Schedule the Day 1 orientation | Set the deadline; the design proposes no `due` |
| onboarding / realizar_orientacao_dia1 | Deliver the Day 1 welcome and first-week review | Set the deadline; the design proposes no `due` |
| onboarding / confirmar_formacao_obrigatoria | Confirm mandatory compliance training | Assign the group to the action once the group exists (`recursos_humanos`) |
| onboarding / confirmar_formacao_obrigatoria | Confirm mandatory compliance training | Set the deadline; the design proposes no `due` |
| onboarding / arquivar_registo_admissao | Archive the onboarding record | Assign the group to the action once the group exists (`recursos_humanos`) |
| onboarding / arquivar_registo_admissao | Archive the onboarding record | Set the deadline; the design proposes no `due` |

## Groups to create

- `recursos_humanos` Human Resources: Owns admission decision support, contract issuance, orientation scheduling, training confirmation and record archiving.. Proposed members: HR officer
- `ti` IT: Provisions system accounts and equipment for new hires.. Proposed members: IT technician
- `instalacoes` Facilities: Prepares the new hire's workspace and access badge.. Proposed members: Facilities officer

## Group flags

- `recursos_humanos`: Segregation of duties: confirm distinct owners. HR both prepares the contract and later confirms the signed contract; the SOP does not separate these authorities. Kept as one group here because no second approver is named; raised as decision D5.

## Open decisions

- **D1** No real SOP document was supplied. Is this reconstructed generic onboarding process an acceptable starting point, or should it be replaced with the organization's actual procedure before any further design work? (Owner: Process owner)
- **D2** Who holds authority to confirm headcount/budget for a new hire: HR alone, or does Finance also need to confirm before 'Decide on the admission request' can approve? (Owner: HR / Finance leadership)
- **D3** The reconstructed SOP names no return/correction path for the admission decision, only an implicit rejection. 'Decide on the admission request' currently only supports Approve (continue) and Reject (cancel_incident) because no prior action exists in this workflow for a 'return' outcome to target. Is starting a new request after rejection acceptable, or must an earlier correction step be designed? (Owner: Process owner)
- **D4** No service level is stated for contract countersignature, IT/Facilities provisioning or training completion. What deadlines, if any, should apply, and what should happen if they are missed beyond the generic exception text proposed? (Owner: Process owner)
- **D5** HR both prepares the contract and later confirms it was signed, with no second approver named. Is this acceptable, or should confirmation move to a different group to separate preparation from verification? (Owner: HR leadership)
- **D6** The 30-day checklist confirmation is proposed with due.basis = activation (30 calendar days after the case is created/approved), but the SOP means 30 days after the new hire's actual start date. These can differ when approval happens before the start date. Should the due offset be measured from a different point, and how should the gap between case activation and the start_date field be handled operationally? (Owner: Process owner)
- **D7** The reconstructed SOP never states who has a Provia login among 'candidate' and 'new hire': the trigger intake, contract signature and training completion are currently designed as HR/manager-confirmed steps about that person rather than steps that person performs directly. Should the new hire receive direct system access (for example via a Form Fill link) for any of these steps once accounts exist? (Owner: Process owner)
- **D8** No background-check, eligibility-verification or reference-check step is named in the reconstructed SOP. Does the real process include one, and if so, where does it sit relative to contract issuance? (Owner: Process owner)

## Setup notes

- `onboarding`: No real customer SOP was supplied for this task; every step, owner and rule above is a reconstructed placeholder and must be replaced with the organization's actual procedure before packaging or publication.
- `onboarding`: No country/organization context was supplied; Angola/Africa/Luanda/AOA are provisional defaults per the plugin's country-context rule, not confirmed facts.

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
