# Pedido de assistência de TI: setup and review

Country: Angola. Language: Portuguese (pt-AO). Timezone: Africa/Luanda. This is a synthetic training draft, not an approved company policy.

## Before publication

- All sample actions are deliberately assigned to the incident creator so a learner can exercise the draft without invented organization IDs. **Replace these assignments with the actual people/groups before production.** This does not implement segregation of duties.
- Configure support groups, access restrictions and any ticket integration. Define urgency from business impact, not a promise of automatic SLA escalation.
- Create any intake or evidence forms, entity records, tags, files, Pages and memory documents separately. These are not transported by this YAML.
- Confirm required fields, due dates and exception paths with the process owner. This example does not encode legislation, holidays, tax rates or retention periods.
- Run `node scripts/validate-workflow.mjs examples/it-service/workflow.yaml` from the plugin root. Passing local checks leaves destination validation and publication pending.
- Import the YAML as a draft in Provia, review preview warnings, resolve references and run the server validation offered by the import flow.

## Pilot cases

1. Complete a normal synthetic incident and inspect its evidence.
2. Omit a required field and confirm the visible validation.
3. Exercise rejection/cancellation if configured; do not assume a label changes execution.
4. Confirm that the correct people can act and unauthorized users cannot.

## Configuração em português

Este exemplo destina-se a formação em Angola. Todas as acções estão atribuídas ao criador do pedido para permitir um ensaio sem identificadores fictícios. Antes de publicar, configure os responsáveis reais, as permissões, os formulários e as regras aprovadas pela organização. Valide o ficheiro e reveja a importação no Provia. O exemplo não define obrigações legais nem substitui a revisão do dono do processo.
