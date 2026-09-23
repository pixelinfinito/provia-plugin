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

Provia stores the action instruction field, `description`, as a Markdown string and renders it as rich text. It is the whole brief the assignee receives, so it must let them do the work without asking. Write it in the second person to the assignee, in the output language, as five labelled parts in this order:

| Part | Label (pt-AO / en) | Content | Example (pt-AO) |
| --- | --- | --- | --- |
| Task | `Tarefa:` / `Task:` | One sentence: what to produce or decide | Confirmar que existe cabimento orçamental para o montante pedido. |
| Method | `Como:` / `How:` | Numbered steps naming the concrete system, document or person involved | 1. Abrir o mapa orçamental do centro de custo no SAP. 2. Comparar o saldo disponível com o montante em `purchase_amount`. |
| Evidence | `Evidência:` / `Evidence:` | Exactly what to attach or fill before completing, and where (file, field, comment) | Anexar a captura do saldo com data; preencher `budget_reference`. |
| Done when | `Concluído quando:` / `Done when:` | The observable condition | O saldo cobre o montante e a referência orçamental está registada. |
| Exceptions | `Excepções:` / `Exceptions:` | What to do when it cannot be completed as described | Se não houver cabimento, não concluir: comentar o défice e devolver ao requerente pela decisão «Devolver». |

Each label starts a line as literal text, including the colon: `Tarefa:` or `Task:`, for example. Keep labels outside bold, headings, quotes and code fences so the bundled action review gate and project map can identify the five parts. Format the content within each part with Markdown.

## Format for reading and execution

- Separate the five parts with blank lines. Put each numbered method step on its own line; use bullet lists for several evidence items or exception paths.
- Use **bold** sparingly for a critical condition or outcome, inline code for exact field keys, and descriptive links to procedures the user actually supplied. Preserve the URL; do not invent a link for a missing document.
- Choose formatting by its purpose using the examples below. Keep the five labels outside headings, emphasis, quotes and code fences.
- Store Markdown source in the existing `description` string. Do not emit raw HTML, Tiptap/editor JSON or a new formatting property. Raw HTML and embedded images are not rendered as rich content; link to supporting documents instead. Supported link schemes are `https:`, `http:` and `mailto:`.
- In YAML use a literal block scalar, `description: |-` or `description: |`, with consistent indentation to preserve line breaks and lists. Do not use folded `>` for a formatted brief. In a JSON manifest use the same Markdown string with normal JSON newline escaping, without double-escaping it.
- Review both the instructions and the presentation: steps stay in order, evidence remains explicit, links have a supplied destination and formatting has not changed approval criteria or routing. The current offline project map extracts the five parts but displays Markdown source inside them; check rich-text presentation in Provia.

The current Provia editor permits 20,000 source characters. The bundled 1.2.1 contract and action review gate still enforce 5000, with a warning above 4500. Until that contract is refreshed, keep generated descriptions within 5000 characters including Markdown syntax and newlines, and run the bundled validator. Do not bypass validation because a newer destination permits more. Keep lengthy background material in a Page or a linked procedure.

### Choose the formatting for the work

Use the formats that make the particular action easier to execute. A short confirmation may need only a sentence and an evidence item; a decision may benefit from a table and a quoted criterion.

| Format | Markdown source | When to use it |
| --- | --- | --- |
| Bold | `**Não aprovar sem evidência.**` | Emphasize a critical condition, required deliverable or exact outcome. Avoid bolding whole paragraphs. |
| Italic | `*Confirmar a versão em vigor.*` | Add a short clarification. Do not make a mandatory instruction look optional. |
| Inline code | `` `purchase_amount` `` | Identify an exact field key, filename or value that the assignee must recognize. |
| Blockquote | `> Regra do procedimento: «…»` | Separate a short excerpt from a supplied procedure, or a clearly labelled operational note. Attribute real quotations to the supplied document and section; formatting does not establish authority. |
| Subheading | `### Critérios de decisão` | Divide a long method into smaller topics inside `Como:` / `How:`. Keep the five main labels as literal text. |
| Numbered list | `1. Conferir o montante pedido.` | Show the order of execution, one step per line. Indent supporting bullets beneath the step they explain. |
| Bullet list | `- Anexar a proposta seleccionada.` | List evidence items or independent checks without implying an order. |
| Task list | `- [ ] Justificação conferida.` | Provide a read-only reminder. Description checkboxes cannot be ticked to record progress, collect evidence or complete an action. Use forms or case fields for recorded answers. |
| Link | `[Procedimento de compras](https://example.org/procedimentos/compras)` | Link to the exact supplied procedure with a descriptive label. This example URL is illustrative, not an organization resource. |
| Table | See the decision table below. | Compare a few outcomes or criteria. Keep cells brief and avoid wide tables on mobile. |
| Fenced code block | See the technical excerpt below. | Preserve an exact payload, command or multiline example when the assignee needs it. State whether it is an example or an instruction to execute. |
| Strikethrough | `~~Enviar por correio electrónico~~ Registar no caso.` | Show an old/new wording comparison in a review draft. Remove obsolete wording from the final operational description rather than leaving contradictory instructions visible. |
| Horizontal rule | `---` on its own line | Separate a supplementary excerpt in a long brief, when blank lines are insufficient. Keep it indented inside the YAML description block. |

For example, a technical method can show the shape of a response without asking the assignee to run anything:

````markdown
### Exemplo de resposta

O exemplo abaixo serve apenas para comparar a estrutura. Não contém dados de um caso real.

```json
{
  "status": "received",
  "reference": "EXEMPLO-001"
}
```
````

Do not add code blocks to ordinary business actions just to demonstrate formatting. Keep credentials and real personal data out of instructional examples. A blockquote used for a note should say `Nota:`; do not present a recommendation as a quotation from a policy or legislation.

### Preserve the action's meaning

- **Fold, do not emit.** A SOP step that is not an observable unit of work (a hand-off, "the manager is informed", a sub-step of one person's task) becomes a numbered step in `Como` of the action that owns it, never its own action. Record the fold in the manifest (`actions[].folded[]`) so the source-to-design mapping stays complete.
- **Every action names its evidence.** If the source gives none, propose one and flag it as a recommendation; an action without evidence cannot prove it happened.
- **Implementer notes never enter the description.** «Atribuição pendente de configuração», «ver setup.md», «UUID a resolver», placeholders and manifest references go to `setup.md` and `decisions[]`. The assignee must never read a note addressed to the implementer.
- **Propose `due`.** Take it from the SOP's service level when stated; otherwise record an open decision with the process owner and leave `due` unset. Never invent a deadline.
- **Automated actions** (notification, wait, HTTP request, sub-workflow) need a description that explains the operation to whoever reads the case, but the five-part brief applies to the work of people and AI assignees on Standard, Decision and Form Fill actions.
- **Decisions** state the criteria and the meaning of each outcome in `Como` and `Excepções`; the outcome labels stay short.

The review gate is deterministic: `node scripts/review-actions.mjs workflow.yaml` reports, per action, which of the five parts are missing, whether an implementer note leaked, the description length and whether `due` is set. It checks the presence of the labelled parts, not their quality; the semantic review below still applies. `provia-workflow-review` runs it and reports the misses; `provia-workflow-package` runs it before handover.

### Complete formatted brief, pt-AO

This fictional training example assumes a supplied purchasing procedure with three outcomes: approve when justification and budget are confirmed, return for missing information, and reject an unjustified request. It also assumes that procedure requires a reason for rejection or return. The quoted rule and example.org link illustrate formatting only. For a real workflow, use the customer's supplied criteria, quotation and URL; omit the quotation or link when no source is available. Do not carry these sample rules into a customer's process as established policy.

```yaml
description: |-
  Tarefa: **Decidir se o pedido de compra avança**, com base na necessidade descrita e no orçamento do departamento.

  Como:

  1. Ler a justificação e conferir o montante em `purchase_amount`.
     - Confirmar que a proposta anexada corresponde ao bem ou serviço pedido.
     - Identificar informação em falta antes de decidir.
  2. Consultar o [procedimento de compras](https://example.org/procedimentos/compras) e confirmar o cabimento no orçamento do departamento.
     *Usar a versão em vigor do procedimento.*
  3. Escolher o desfecho segundo os critérios seguintes.

  ### Critérios de decisão

  > Regra do procedimento de exemplo: «Não aprovar pedidos sem justificação e cabimento confirmados.»

  | Situação verificada | Desfecho | Registo exigido |
  | --- | --- | --- |
  | Necessidade justificada e cabimento confirmado | **Aprovar** | Referência da evidência de cabimento |
  | Informação insuficiente para decidir | **Devolver** | Comentário que identifica o que falta |
  | Pedido sem justificação aceite | **Rejeitar** | Comentário com o motivo da rejeição |

  Evidência:

  - Ao aprovar, indicar no comentário a referência da evidência de cabimento consultada.
  - Ao rejeitar ou devolver, registar um comentário com o motivo e, quando aplicável, a informação a corrigir.

  Concluído quando: A decisão e os registos exigidos estão guardados no caso.

  Lista de consulta antes de concluir; os quadrados abaixo são apenas lembretes visuais:
  - [ ] Montante e proposta conferidos.
  - [ ] Critério do desfecho confirmado.
  - [ ] Evidência ou comentário exigido registado no caso.

  Excepções:

  > Nota: **Não decidir fora da sua autoridade.**

  Se o montante exceder a sua autoridade, comentar e devolver ao requerente para encaminhar à autoridade competente. Se faltar informação, indicar exactamente o que deve ser corrigido; não substituir a falta de evidência por uma aprovação.
```

The five literal labels remain readable by the existing review gate. Formatting does not configure decision branches, enforce comments or record checklist answers; those behaviours must be configured separately.

## Review before handover

Review every action, not just names matching suspicious linguistic patterns:

1. Check the initial verb, object, clarity and useful brevity in the output language.
2. Compare the name with the source, action type, description and actual operation. Resolve wording that misstates the work; flag uncertain business meaning.
3. Confirm that assignments, authority, coordination, conditions and completion evidence remain available in their appropriate fields or handover.
4. For an existing export, compare before and after. A wording-only edit may change reviewed names/descriptions, but must preserve IDs, branch destinations and labels, assignments, fields, form bindings, due settings, external calls, permissions and all other behavior. Report any proposed behavioral change separately.
5. Deliver `editorial-review.md` separately from the exact structural `validation.json`. Record the workflow, reviewed scope/action count, findings with action ID, observed name, reason, proposed or applied wording and unresolved questions. State what was actually checked; if review was not performed, say so.

A linguistic suspicion calls for review; it does not make YAML technically invalid. Structural `valid: true` does not establish editorial quality. Do not modify the contract engine, fingerprint, official validator report or routing to enforce this convention. Do not claim a regex or a list of accepted verbs certifies semantic quality.
