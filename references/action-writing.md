# Write and review action names

Read the source procedure and the action's purpose, type, instructions and configuration before choosing a verb.

## Name the work

Write every action name as a concise instruction describing the work expected. In Portuguese, start with an infinitive verb; in English, start with a base-form action verb. Use a verb, an object and only the qualifier needed to identify the task. Aim for 3–10 words and roughly 80 characters when meaning permits. These are editorial guidelines, not Provia contract limits.

Do not copy an actor-led sentence, step number, approval threshold or a form's noun title into the action name. Keep the name useful regardless of who is assigned. Avoid vague verbs such as "Process" or "Tratar" without an object. Apply the convention to Standard, Decision, Form Fill, Notification, Wait, HTTP Request and Sub-workflow actions, including AI-assigned Standard actions.

Choose the verb by the actual work. Preparing, reviewing, deciding, executing and confirming are different tasks. Renaming a payment confirmation must not turn it into payment execution. If the source describes several acts or authorities, flag the design question. Do not silently split, merge or reroute actions as an editorial correction.

## Separate names, instructions and configuration

| Information | Place |
| --- | --- |
| Brief instruction naming the expected work | `actions[].name` |
| What to do, criteria, conditions, completion evidence and necessary coordination | `actions[].description` |
| Actual designated executor, using a real destination reference | `actions[].assignee` |
| Intended functional role and delegation when destination references are unknown | Assignment table and `setup.md` |
| Deadline | `due` where representable, plus case calendar or instructions |
| Decision outcomes and routing | `config.branches` |

Write descriptions as direct instructions. Avoid routinely repeating "Responsável: GC" when configuration already carries that assignment. Retain other participants when necessary for coordination, authority or segregation. For example, "Conferir a existência das duas assinaturas bancárias exigidas" is a completion criterion, not redundant role text.

This convention applies only to action display names. Workflow, form, entity, document and field names, field keys, action IDs and decision outcome labels need not start with verbs. A form can remain "Protocolo de experiência" while its Form Fill action is "Registar o protocolo de experiência". "Aprovado" can remain an outcome label.

## Examples and semantic checks

| Source or observed name | Proposed action name | Preserve or review |
| --- | --- | --- |
| GC confirma o pagamento da gratificação | Confirmar o pagamento da gratificação | GC assignment or handover; confirmation evidence; no payment execution |
| Contabilista calcula a folha | Calcular a folha salarial | Accountant assignment and payroll calculation criteria |
| RGC apresenta o lote ao DG, but the designed action is a DG decision | Validar o lote salarial | DG authority, presentation and checks in instructions; verify source/design agreement |
| Chefia e colaborador realizam a conversa | Realizar a conversa de avaliação | Participation of both people in the instructions |
| Aprovação da despesa, as a Decision | Decidir sobre a despesa | Rejection and return branches, thresholds and authority |
| Confirmação de recepção, as Form Fill | Confirmar a recepção | Form title, binding, mappings and response policy |
| Protocolo de experiência, as Form Fill | Registar o protocolo de experiência | Separate unchanged form/document name |
| DG decide até 15 milhões… | Decidir o investimento por marco | Threshold, exceptions and DG authority in description/configuration |
| Finance confirms receipt | Confirm receipt | Finance assignment; receipt evidence |
| Expense approval, as a Decision | Decide on the expense | Approval, rejection and rework outcomes |
| AI summary of supplier proposals | Summarize supplier proposals | AI assignment, output contract and human review |

Accept "Propor uma alteração ao orçamento". Portuguese infinitives do not all end in `ar`, `er` or `ir`. Accept "Informar o DG sobre o desvio" because DG is a relevant recipient, not an actor prefix. Removing "GC" from "GC confirma o pagamento" is insufficient: the verb must become "Confirmar".

Keep "Consultar o estado do pagamento" distinct from "Executar o pagamento", especially for HTTP operations. For "GC prepara; DG aprova; signatários executam", identify the separate acts and authorities; a decision to redesign that sequence is outside a wording-only edit.

## Review before handover

Review every action, not just names matching suspicious linguistic patterns:

1. Check the initial verb, object, clarity and useful brevity in the output language.
2. Compare the name with the source, action type, description and actual operation. Resolve wording that misstates the work; flag uncertain business meaning.
3. Confirm that assignments, authority, coordination, conditions and completion evidence remain available in their appropriate fields or handover.
4. For an existing export, compare before and after. A wording-only edit may change reviewed names/descriptions, but must preserve IDs, branch destinations and labels, assignments, fields, form bindings, due settings, external calls, permissions and all other behavior. Report any proposed behavioral change separately.
5. Deliver `editorial-review.md` separately from the exact structural `validation.json`. Record the workflow, reviewed scope/action count, findings with action ID, observed name, reason, proposed or applied wording and unresolved questions. State what was actually checked; if review was not performed, say so.

A linguistic suspicion calls for review; it does not make YAML technically invalid. Structural `valid: true` does not establish editorial quality. Do not modify the contract engine, fingerprint, official validator report or routing to enforce this convention. Do not claim a regex or a list of accepted verbs certifies semantic quality.
