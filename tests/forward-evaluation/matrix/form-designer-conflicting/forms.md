# Form specification: supplier quotations

Workflow: `purchase-request` (`workflow.yaml`). Angola / AOA and English are provisional assumptions — no country or language was stated in the request; confirm before packaging.

## The conflict in the request

The request asked to collect three supplier quotations as multiple Form Fill responses and map each response's amount into the *same* incident amount field. That cannot be built as stated, for two independent reasons:

1. **Product rule.** "Single responses may map values; multiple responses remain separate for review and cannot map competing values to incident metadata" (`references/provia-capabilities.md`). If the three quotations are collected as multiple responses to *one* Form Fill action, none of their fields — not even to three different case fields — can be mapped into incident metadata at all. They would stay as unmapped, separately reviewable responses.
2. **Data loss, even if it were allowed.** If it were technically possible to map three responses into one scalar field, each later submission would silently overwrite the earlier one. Since a case field holds a single value, "map each response to the same field" means only the last-processed quotation would ever be visible — the other two would be lost, and which one "wins" would depend on submission order, not on which quotation was actually best.

## Resolution applied

Three **single-response** Form Fill actions, one per supplier, each mapping its own response into its **own** case field:

| Action (`actions[].id`) | Form | Maps to |
| --- | --- | --- |
| `cotacao_1` | Supplier quotation — slot 1 | `quote_1_supplier`, `quote_1_amount` |
| `cotacao_2` | Supplier quotation — slot 2 | `quote_2_supplier`, `quote_2_amount` |
| `cotacao_3` | Supplier quotation — slot 3 | `quote_3_supplier`, `quote_3_amount` |

None of the three map to `purchase_amount`. A fourth action, `selecionar_proposta` (Standard, not Form Fill), is where a person compares the three recorded quotations and manually sets `purchase_amount` and `selected_supplier` to the chosen one, with a mandatory comment naming the reason. That is the "review step" the conflict requires: the incident amount field gets exactly one, deliberate, evidenced write instead of three competing automatic ones.

This is a recommendation, not the only possible design. An alternative — collecting the three quotations as multiple responses to a single Form Fill action, left unmapped, with the reviewer opening each response individually during `selecionar_proposta` — is also valid and closer to the literal "multiple Form Fill responses" wording, at the cost of the three amounts not being individually visible as case metadata (for reporting, filtering, etc.) until someone reads the responses. The three-action design is used here because it keeps every quotation comparable in case metadata; switch to the alternative if the case list should not need three near-duplicate fields per request.

## Form: "Supplier quotation" (used three times, once per slot)

Applies identically to the forms behind `cotacao_1`, `cotacao_2` and `cotacao_3`; only the slot number and the field it writes to change.

**Kind:** action form (Form Fill), single response. Not a trigger/intake form — it does not create the incident, it supplies evidence to one already open.

**Respondents and access:** Internal — a member of the Purchasing group who received the supplier's quotation by email, phone or in person fills the form on the case, on the supplier's behalf, and attaches the supplier's own document as proof. This avoids assuming external/anonymous submission works a particular way, which has not been checked against a configured Provia organization (no `provia-implementer` connection is available in this session). If suppliers should submit their own quotation through an external link instead, that needs the respondent-access model confirmed in Provia first — see **Decisions**, D3.

**Fields:**

| Field | Type | Required | Maps to case field | Notes |
| --- | --- | --- | --- | --- |
| Supplier name | Text | Yes | `quote_N_supplier` | Free text; the three suppliers are not assumed to already exist as records in Provia. |
| Quoted amount | Currency (AOA) | Yes | `quote_N_amount` | The total quoted price, same currency and decimal convention as the case's other amount fields. |
| Quotation document | File upload | No | Not mapped — attached to the response as evidence | Accept PDF, JPG or PNG, max 10 MB, because a supplier quotation is normally a scanned or emailed document and the reviewer in `selecionar_proposta` needs to open it to compare terms beyond the price. Exact accepted types/size are a Provia form-builder setting; the values above are a starting recommendation, not a verified default. |
| Notes | Text (multi-line) | No | Not mapped — visible on the response only | Free text for delivery time, payment terms or anything the amount field does not capture; read manually during selection. |

**Validation:** "Quoted amount" greater than zero; "Supplier name" non-empty. No dependency between the three forms is enforced by the form itself — the workflow's `executionMode: parallel` on all three `cotacao_*` actions is what requires all three to complete before `selecionar_proposta` starts (a join, not a form-level rule).

**Confirmation:** On submission, the response is saved to the case; the form does not promise the requester or supplier anything beyond "recorded" — no deadline is stated in the confirmation message, since none is configured as an SLA yet (see Decision D4 in `provia-project.json`).

**Testing steps (manual, after building the form in Provia):**
1. Submit `cotacao_1` with a supplier name, amount and attached document; confirm `quote_1_supplier`/`quote_1_amount` update on the case and no other quote fields change.
2. Repeat for `cotacao_2` and `cotacao_3`; confirm each writes only its own pair of fields.
3. Confirm `selecionar_proposta` cannot start until all three responses are submitted (parallel join).
4. In `selecionar_proposta`, set `purchase_amount` and `selected_supplier`; confirm the case shows all three original quotations *and* the selected one side by side, so the choice is auditable.
5. Attempt a second `cotacao_1` submission (if the action allows more than one attempt) and confirm it does not silently change `purchase_amount` — only `selecionar_proposta` should ever write that field.

## Decisions carried to `provia-project.json`

- **D2** (resolved) — the mapping conflict above; resolution applied as described.
- **D3** (open) — should suppliers submit their own quotation through an external link, instead of Purchasing entering it on their behalf? Needs the respondent-access model confirmed in Provia.
- **D4** (open) — what happens if a supplier does not respond within the 3-workday due date on `cotacao_1`/`cotacao_2`/`cotacao_3`: proceed with two quotations, extend, or require a documented sole-source justification?
