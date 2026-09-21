# Form specification: Supplier quotation

Project `compras` · workflow `compras` (Purchase request, prefix COMP) · Form Fill action `register-quotation` · manifest key `cotacao-fornecedor`.
Produced by `provia-form-designer` on 2026-09-21 in disconnected mode. Country context Angola and currency AOA are a provisional starting context; the request supplied neither. Response language: English (the request's language).

## 1. The request and the conflict in it

Requested: collect three supplier quotations as multiple Form Fill responses **and** map each response's amount to the same incident amount field.

Those two halves cannot both hold:

- **Product behaviour.** A single Form Fill response can map values into incident metadata and complete the action. When a link accepts multiple responses, the responses are kept as a review collection and cannot map competing values to incident metadata (references/provia-capabilities.md, "Form Fill collects answers inside an incident"; skill procedure step 3).
- **Business behaviour, even if the product allowed it.** Three amounts written to one field would leave the case showing whichever quotation arrived last, with no record of a choice. The amount on a purchase case must be the amount somebody *selected*, not the amount somebody *submitted last*.

Decision taken in this design (recorded as manifest decision **D4**, owner Purchasing lead, open):

1. The form "Supplier quotation" is linked to `register-quotation` with **multiple responses** and **no mappings**. Each quotation stays a separate response with its own document.
2. A separate Standard action, `select-quotation` (Select the winning quotation), reads the three responses and fills the incident fields `purchase_amount`, `selected_supplier`, `selected_quotation_reference`, `quotations_received` and `selection_rationale`. This is the review step the skill calls for when quotations would otherwise overwrite the amount.

Alternative, if the customer insists that amounts land in metadata without a person copying them: three **single-response** Form Fill actions (`register-quotation-1/2/3`), each mapping `quotation_amount` to its own field `quotation_1_amount`, `quotation_2_amount`, `quotation_3_amount` (and supplier name likewise), followed by the same `select-quotation` step. This triples the actions and forms to maintain and still needs the review step to fill `purchase_amount`; it is not the recommendation.

## 2. Intake or evidence?

Submission supplies evidence to an **existing** case: the purchase request already exists (opened with `item_description`, `quantity`, `estimated_amount`). So this is a Form Fill on an action, not an intake form, and it does not create incidents. Manifest: `forms[].kind: "action"`, `workflowRef: compras`, `actionRef: register-quotation`.

## 3. Respondents and access

| Aspect | Design | Status |
| --- | --- | --- |
| Respondent | Purchasing staff (group `compras`, proposed) signed in to Provia, one response per quotation received from a supplier by email or on paper | Assumption; decision **D1** |
| External supplier access | Not promised. Whether suppliers could fill the form through an external link depends on the configured form behaviour in the tenant, which was not read (connected-mode read not permitted in this session) | Unresolved; decision **D1** |
| Anonymous access | Not promised, not needed: every response must name a supplier and is submitted by an identified Purchasing user | Confirmed by design |
| Who sees the responses | The assignees of `register-quotation` and `select-quotation` (own cases, no grant needed) and the case creator. Workflow access is `default: creator_only` until decision **D3** settles who may open purchase requests | Declared in manifest `workflows[].access` |

## 4. Fields

Form definitions have their own schema; the field types below are the workflow metadata types the form is expected to support (`auto_number` is excluded from form fields in the pinned revision, and dependent-option bindings are not preserved in forms, so neither is used here).

| # | Key | Label | Type | Required | Validation / config | Why it is asked |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `supplier_name` | Supplier name | text | yes | 2–120 characters | Identifies the quotation; `select-quotation` copies it to `selected_supplier` |
| 2 | `supplier_tax_number` | Supplier tax number (NIF) | text | no | free text; no format rule is asserted | Lets Purchasing match the supplier in the accounting system later; optional because the request states no requirement |
| 3 | `quotation_reference` | Quotation reference | text | yes | 1–60 characters | Distinguishes this quotation from a revised one from the same supplier; copied to `selected_quotation_reference` |
| 4 | `quotation_date` | Quotation date | date | yes | not after today | Age of the offer |
| 5 | `quotation_amount` | Quotation amount (Kz) | currency | yes | `currency: AOA`, minimum 0, two decimals | The amount to compare; **not mapped** (see §5) |
| 6 | `amount_includes_tax` | Amount includes tax | boolean | no | — | Makes the three amounts comparable; no tax rate is asserted by this design |
| 7 | `validity_date` | Valid until | date | yes | not before `quotation_date` | `select-quotation` must choose an offer still valid |
| 8 | `delivery_days` | Delivery time (calendar days) | number | no | integer ≥ 0 | Comparison criterion besides price |
| 9 | `quotation_file` | Quotation document | file | yes | see §6 | The supplier's own document is the evidence behind the amount typed in field 5 |
| 10 | `notes` | Notes | rich_text | no | ≤ 2000 characters | Conditions (payment terms, partial availability) that the comparison should know |

Field order on the form: 1–3 (who), 4–7 (what and when), 8, 9, 10.

## 5. Mappings

**None.** This is deliberate and must be kept when the form is created:

- The link uses the multiple-response policy so that three quotations coexist on one action. Under that policy responses are a review collection; the product does not map them to incident metadata, and this design does not try to.
- `purchase_amount` (incident field, currency AOA) is written by the assignee of `select-quotation`, together with `selected_supplier`, `selected_quotation_reference`, `quotations_received` and `selection_rationale`. The action's "Done when" ties the amount to one existing response, so the value on the case is always traceable to a submitted quotation.

If the customer chooses the alternative in §1 (three single-response actions), each of those links maps `quotation_amount → quotation_N_amount` and `supplier_name → quotation_N_supplier`, and those six fields must be added to `workflow.yaml` first. Nothing else changes.

## 6. Uploads

| Field | Accepted types | Size | Reason |
| --- | --- | --- | --- |
| `quotation_file` | PDF, JPEG, PNG (one file per response) | Recommended limit 10 MB per file; the actual limit is the tenant's form/file setting and must be confirmed in Provia | The supplier's written quotation is the evidence that the typed amount, reference and validity date are real; a photo is accepted because paper quotations are common |

Each response carries exactly one document. A supplier who sends a revised quotation gets a new response with a new `quotation_reference`; the old one stays for the record and `select-quotation` explains in `selection_rationale` which one was compared.

## 7. Confirmation message (shown after submit)

> Quotation from **{supplier_name}** ({quotation_reference}, {quotation_amount} Kz) was recorded on case {incident reference}. Purchasing will compare the quotations once three have been received and record the selected amount on the case. You can submit another quotation from the same action.

It states what happens next without promising a date: no deadline is configured (decision **D2**). The placeholders are to be replaced with the tokens the Provia form editor actually offers; if the editor cannot interpolate response values, use the static sentence "Your quotation was recorded on this case. Purchasing will compare the quotations once three have been received and record the selected amount on the case."

## 8. Form Fill action

Both the form title and the action are specified, as the skill requires:

- Form title: **Supplier quotation** (a noun title; form names need not start with a verb).
- Action `register-quotation`, type `form_fill`, name **Register the supplier quotations received**, assignee `compras` (by group key in the manifest; the YAML carries no assignee until an id exists). The five-part description is in `workflow.yaml` and passed `review-actions.mjs` (all five parts present, no implementer note leaked, 1152 characters). Its Evidence part names the submitted responses of the form "Supplier quotation".
- Review action `select-quotation`, type `standard`, name **Select the winning quotation**, assignee `compras`, sets the five incident fields listed in §5. Also complete under the review gate (1071 characters).

Neither action has `due`: no service level was supplied (decision D2). Segregation between the person who registers quotations and the person who selects one is not enforced by this design because the request names no such rule; if the customer's procedure requires it, assign `select-quotation` to a different group and record the source.

## 9. Testing steps (to run in Provia after the form is created and linked)

1. Open a draft case of "Purchase request" and reach `register-quotation`.
2. Submit one response with all required fields and a PDF; confirm the confirmation text appears and the response is listed on the action.
3. Submit a second and third response for two other suppliers; confirm all three remain visible and none replaced another.
4. Try a fourth response for a supplier already registered: the form does not block it (no cross-response uniqueness exists), so confirm the action brief's instruction is what prevents duplicates, and decide whether that is acceptable.
5. Try to submit without `quotation_file` and with a negative `quotation_amount`; both must be rejected.
6. Check the incident field `purchase_amount` after the three submissions: it must still be **empty**. If it holds a value, a mapping was configured on the link and must be removed.
7. Complete `register-quotation` (confirm in the form settings whether completion requires a minimum number of responses; if it does not, the "Done when" in the brief is the only control).
8. In `select-quotation`, fill `purchase_amount` with the amount of one response and complete; confirm the case shows that amount, the supplier and the reference.
9. Record the tenant's actual file size limit and whether multiple responses were allowed on the link in `setupNotes` of the manifest.
10. If decision D1 turns to external suppliers, repeat steps 2–6 through the external access path the tenant actually provides, and re-check who can see other suppliers' responses.

## 10. What was verified and what was not

Verified with the bundled scripts on 2026-09-21:

- `validate-workflow.mjs workflow.yaml` → `valid: true`, backend schema checks passed, one product warning (form must be re-linked after import), three setup items (two assignees, one form link). Report: `validation.json`.
- `review-actions.mjs workflow.yaml` → 2 actions, 2 complete, 0 leaks, 2 without due. Report: `action-review.json`.
- `build-project-map.mjs provia-project.json --check` → 0 errors, 0 warnings, 1 info (assigned group `compras` holds no grant, expected), 0 readiness blocks. `project.html` and `setup.md` regenerated.

Not verified: any behaviour of the destination tenant (multiple-response setting, file limits, external form access, group existence). The connected-mode read (`org_get_context`) was not permitted in this session, so nothing was read from or written to a Provia organization. These scripts check structure and cross-references, not business correctness; publication readiness is decided in Provia by an authorized person.

## 11. Open decisions (owner in the manifest)

- **D1** Internal or external respondents.
- **D2** Deadlines for collecting and for selecting.
- **D3** Who may open a purchase request (workflow access).
- **D4** Accept the review-step design instead of mapping three amounts to one field, or choose the three-action alternative.
- **D5** Whether the case may continue with fewer than three quotations and who authorizes it.
