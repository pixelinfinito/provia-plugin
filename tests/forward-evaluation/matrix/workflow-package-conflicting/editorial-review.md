# Editorial review — Pedido de Compra (workflow.yaml)

Reviewed scope: all 3 actions in `workflow.yaml`, first draft (no prior version to diff against).

## Names

| Action ID | Name | Check |
| --- | --- | --- |
| `submeter_pedido` | Submeter o pedido de compra | Infinitive verb + object, no actor prefix, no form-title copy. OK. |
| `aprovar_gestor` | Decidir sobre o pedido de compra | Names the decision, not the "Aprovação" outcome label. OK — avoids collapsing the action into its "approve" branch. |
| `confirmar_financas` | Confirmar a disponibilidade orçamental | Confirmation verb, matches the actual check (budget availability), not payment execution. OK. |

## Descriptions

All three actions pass `scripts/review-actions.mjs` (task/method/evidence/done-when/exceptions all present, no implementer-note leaks, all under 5000 characters — see `review-actions.json`).

No implementer notes (assignment-pending language, "ver setup.md", UUID placeholders) were put in any `description`; that information is in `setup.md` instead.

## Findings

- **`due` not set on any action (flagged, not an error).** The source request gave no service-level timing for Request/Approval/Confirmation. Per the action-writing convention, `due` must not be invented — this is an open decision for the process owner, recorded in `setup.md`.
- **Assignees deliberately omitted.** No manifest or destination group/user IDs were supplied with this request. Per the workflow-package contract, an unresolved `assigneeRef` is never invented as a real ID and never silently defaulted to the creator; the intended owner (self-service requester / gestor / Finanças) is documented as a functional role in `setup.md` for the implementer to resolve.
- **Intake form kept out of the YAML.** The user asked for an "embedded intake form definition" inside the workflow YAML. The portable `provia.ao/v1` contract does not carry forms, form triggers or Form Fill links (see Portability exclusions in `workflow-yaml.md`) — only `metadata`, `triggers`, `entities`, `fields` and `actions` are legal top-level keys, and none of them is a form document. `submeter_pedido` is modelled as a `form_fill` action (the correct portable placeholder for a self-service intake step); the actual form question set is delivered separately in `intake-form-pedido-compra.md` and must be built and linked to that action inside Provia after import, as the validator's `form_fill_link` warning confirms.
- **Property names kept in English, values in Portuguese.** The user asked for "Portuguese property names." The YAML schema (`metadata`, `name`, `label`, `type`, `assignee`, `config`, etc.) is a fixed product contract, not a translatable surface — an import would reject or silently drop unknown keys. All user-facing *content* (workflow name, action names, descriptions, field labels, form labels) is in Portuguese, which is where language choice actually applies. See the explanation given to the user for the full boundary.

## Unresolved questions for the process owner

1. Who is the "gestor" (manager) group/user for `aprovar_gestor`, and who in "Finanças" owns `confirmar_financas`?
2. Is there a target turnaround time (days) for approval and for the budget confirmation, to set `due`?
3. Should `aprovar_gestor` also allow a "Devolver" (return-to-requester) branch, or is binary Aprovar/Rejeitar sufficient? The request only named three steps, so this draft keeps two outcomes; flag if a rework path is needed.
