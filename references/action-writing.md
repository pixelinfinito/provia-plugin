# Write and review action names and descriptions

Read the source procedure and the action's purpose, type, instructions and configuration before choosing a verb.

## Name the work

Write every action name as a concise instruction describing the work expected. In Portuguese, start with an infinitive verb; in English, start with a base-form action verb. Use a verb, an object and only the qualifier needed to identify the task. Aim for 3–10 words and roughly 80 characters when meaning permits. These are editorial guidelines, not Provia contract limits.

Do not copy an actor-led sentence, step number, approval threshold or a form's noun title into the action name. Keep the name useful regardless of who is assigned. Avoid vague verbs such as "Process" or "Tratar" without an object. Apply the convention to Standard, Decision, Form Fill, Notification, Wait, HTTP Request and Sub-workflow actions, including AI-assigned Standard actions.

Choose the verb by the actual work. Preparing, reviewing, deciding, executing and confirming are different tasks. Renaming a payment confirmation must not turn it into payment execution. If the source describes several acts or authorities, flag the design question. Do not silently split, merge or reroute actions as an editorial correction.

## Separate names, instructions and configuration

| Information | Place |
| --- | --- |
| Brief instruction naming the expected work | `actions[].name` |
| The five-part brief to the assignee: task, method, evidence, done-when, exceptions | `actions[].description` |
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

## Write the description as the assignee's brief

Provia gives an action one instruction field, `description`, up to 5000 characters. It is the whole brief the assignee receives, so it must let them do the work without asking. Write it in the second person to the assignee, in the output language, as five labelled parts in this order:

| Part | Label (pt-AO / en) | Content | Example (pt-AO) |
| --- | --- | --- | --- |
| Task | `Tarefa:` / `Task:` | One sentence: what to produce or decide | Confirmar que existe cabimento orçamental para o montante pedido. |
| Method | `Como:` / `How:` | Numbered steps naming the concrete system, document or person involved | 1. Abrir o mapa orçamental do centro de custo no SAP. 2. Comparar o saldo disponível com o montante em `purchase_amount`. |
| Evidence | `Evidência:` / `Evidence:` | Exactly what to attach or fill before completing, and where (file, field, comment) | Anexar a captura do saldo com data; preencher `budget_reference`. |
| Done when | `Concluído quando:` / `Done when:` | The observable condition | O saldo cobre o montante e a referência orçamental está registada. |
| Exceptions | `Excepções:` / `Exceptions:` | What to do when it cannot be completed as described | Se não houver cabimento, não concluir: comentar o défice e devolver ao requerente pela decisão «Devolver». |

Each label starts a line. Keep the whole description under 5000 characters; a brief that needs more belongs partly in a Page or a linked procedure.

Rules that follow:

- **Fold, do not emit.** A SOP step that is not an observable unit of work (a hand-off, "the manager is informed", a sub-step of one person's task) becomes a numbered step in `Como` of the action that owns it, never its own action. Record the fold in the manifest (`actions[].folded[]`) so the source-to-design mapping stays complete.
- **Every action names its evidence.** If the source gives none, propose one and flag it as a recommendation; an action without evidence cannot prove it happened.
- **Implementer notes never enter the description.** «Atribuição pendente de configuração», «ver setup.md», «UUID a resolver», placeholders and manifest references go to `setup.md` and `decisions[]`. The assignee must never read a note addressed to the implementer.
- **Propose `due`.** Take it from the SOP's service level when stated; otherwise record an open decision with the process owner and leave `due` unset. Never invent a deadline.
- **Automated actions** (notification, wait, HTTP request, sub-workflow) need a description that explains the operation to whoever reads the case, but the five-part brief applies to the work of people and AI assignees on Standard, Decision and Form Fill actions.
- **Decisions** state the criteria and the meaning of each outcome in `Como` and `Excepções`; the outcome labels stay short.

The review gate is deterministic: `node scripts/review-actions.mjs workflow.yaml` reports, per action, which of the five parts are missing, whether an implementer note leaked, the description length and whether `due` is set. It checks the presence of the labelled parts, not their quality; the semantic review below still applies. `provia-workflow-review` runs it and reports the misses; `provia-workflow-package` runs it before handover.

Example of a complete brief for a Decision, pt-AO:

```text
Tarefa: Decidir se o pedido de compra avança, com base na necessidade descrita e no orçamento do departamento.
Como: 1. Ler a justificação e o montante em `purchase_amount`. 2. Confirmar que a compra está prevista no plano do departamento. 3. Escolher «Aprovar», «Rejeitar» ou «Devolver».
Evidência: Um comentário com o motivo é obrigatório em «Rejeitar» e «Devolver».
Concluído quando: A decisão fica registada com o comentário exigido.
Excepções: Se o montante exceder a sua autoridade, não decidir: comentar e devolver ao requerente para encaminhar à autoridade competente.
```

## Review before handover

Review every action, not just names matching suspicious linguistic patterns:

1. Check the initial verb, object, clarity and useful brevity in the output language.
2. Compare the name with the source, action type, description and actual operation. Resolve wording that misstates the work; flag uncertain business meaning.
3. Confirm that assignments, authority, coordination, conditions and completion evidence remain available in their appropriate fields or handover.
4. For an existing export, compare before and after. A wording-only edit may change reviewed names/descriptions, but must preserve IDs, branch destinations and labels, assignments, fields, form bindings, due settings, external calls, permissions and all other behavior. Report any proposed behavioral change separately.
5. Deliver `editorial-review.md` separately from the exact structural `validation.json`. Record the workflow, reviewed scope/action count, findings with action ID, observed name, reason, proposed or applied wording and unresolved questions. State what was actually checked; if review was not performed, say so.

A linguistic suspicion calls for review; it does not make YAML technically invalid. Structural `valid: true` does not establish editorial quality. Do not modify the contract engine, fingerprint, official validator report or routing to enforce this convention. Do not claim a regex or a list of accepted verbs certifies semantic quality.
