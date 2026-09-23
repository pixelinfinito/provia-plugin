# Purchase request — where each field belongs

Companion to `catalogue.json` / `catalogue.html`. The entity catalogue schema only carries entity types, so the
purchase-request side is specified here instead.

## Context actually available

Nothing was supplied: no purchasing procedure, no intake form, no case export, no existing entity catalogue, no
workflow design, and no `provia-project.json` in the working directory. A Provia MCP server is exposed in this
session, but the read call was not authorised, so no destination organization was read either.

Everything below is a reasoned baseline derived from the question. It is a proposal to confirm, not a record of
anything the organization told us. Country is provisionally Angola (AOA, Africa/Luanda) because none was stated.
No legal or fiscal requirement is asserted anywhere in this document.

## The rule that decides the split

**The supplier holds what stays true between requests. The request holds what is true of this one execution.**

A supplier is a stable object: it is selected across many cases, it has its own lifecycle (registration,
approval, suspension, retirement), and several processes reuse it. That is an entity type.

A purchase request is one execution of a process. It has a start, a decision and an end. In Provia that is a
**workflow case (incident)**, with case metadata fields and action evidence — not an entity type. Creating a
"Purchase request" entity alongside the case would duplicate every value and leave two records to keep in step.

Practical test when a field is ambiguous: *if the next request to the same supplier would repeat this value
unchanged, it belongs to the supplier; if the next request would give it a different value, it belongs to the
request.* The supplier's usual invoicing currency stays the same across requests. The amount of this request
does not.

## Supplier — entity type `supplier`

Full specification, with types, keys, options, help text, maintainers and setup notes, is in `catalogue.json`
and readable with copy controls in `catalogue.html`. Summary of what it holds:

| Group | Fields |
| --- | --- |
| Identity | Registered name, taxpayer number (NIF), supplier code in the accounting system |
| Classification | Supply category, supply sub-category (dependent), criticality if the supplier fails |
| Ownership | Relationship owner |
| Contacts | Commercial contact, commercial email, commercial phone, collection/delivery address, country of establishment |
| Commercial terms | Usual invoicing currency, agreed payment term (days), agreement or price list valid until |
| Qualification and lifecycle | Supplier status, registration valid until, last evaluation, last evaluation rating |
| Reference | Record in the accounting system (URL) |

Trading name is the native record Name. No field duplicates the native Name, UUID, creator or timestamps.

Explicitly **not** on the supplier: bank account details (they stay in the finance system, which has its own
confirmation procedure — a second copy in Provia is a fraud surface with no owner), prices, invoice history,
balances, and anything about a particular order.

## Purchase request — workflow case metadata

These are workflow fields (`fields[]` in the workflow YAML), not entity fields. Types are from the Provia
metadata set. Keys are proposals.

### Known at intake — the requester fills these

| Field | Key | Type | Required at creation | Why it belongs to the request |
| --- | --- | --- | --- | --- |
| What is needed | `need_description` | `rich_text` | yes | Different every time |
| Business justification | `justification` | `rich_text` | yes | Specific to this need |
| Quantity | `quantity` | `number` | yes | Per request |
| Unit | `unit` | `text` | no | Per line item |
| Estimated amount | `estimated_amount` | `currency` (`currencyCode: AOA`) | yes | Drives the approval route |
| Currency of this request | `request_currency` | `select` (aoa / usd / eur) | no | May differ from the supplier's usual currency |
| Needed by | `needed_by` | `date` | yes | Per request |
| Requesting department | `requesting_department` | `select` | yes | Per requester, not per supplier |
| Cost centre or budget line | `cost_centre` | `select` | yes | Charged per request |

### Set during execution — not known at intake

| Field | Key | Type | Set by | Note |
| --- | --- | --- | --- | --- |
| Selected supplier | `selected_supplier` | `entity` → `supplier` | The award or sourcing action | This is the only link between the two objects. One reference, not a copy of the supplier's fields |
| Procurement route | `procurement_route` | `select` (direct purchase / three quotations / tender) | Procurement, at triage | Provia does not derive this from the amount automatically; whoever sets it does so by reading the threshold |
| Approval decision | `approval_decision` | `select` (approved / rejected / returned for revision) | The decision action | An action outcome, never a supplier attribute |
| Approved amount | `approved_amount` | `currency` | The approver | Can differ from the estimate |
| Reason for rejection or return | `decision_reason` | `rich_text` | The approver | Required on the rejection path |
| Purchase order number | `po_number` | `text` | Whoever raises the order in the ERP | The ERP assigns it; Provia records it |
| Goods or service received on | `received_on` | `date` | Receiving | Per delivery |
| Supplier invoice reference | `invoice_reference` | `text` | Finance | Per invoice |

No `request_number` field is proposed. A Provia workflow already gives each case a reference from the workflow
prefix. Adding an `auto_number` field alongside it creates a second competing reference.

### Form answers, not case metadata

Quotations are the classic mistake. Three quotations for one request are three sets of values; they are
collected on a Form Fill submission during the sourcing action and stay on that submission. Promote a value to
case metadata only when routing, reporting or an integration needs it — typically just the winning supplier and
the awarded amount.

| Collected | Placement |
| --- | --- |
| Quotation per supplier: supplier name, amount, currency, validity date, quotation document | Form response on the sourcing action |
| Comparison note explaining the choice | Form response, or the action's evidence comment |
| Winning supplier and awarded amount | Promote to case metadata (`selected_supplier`, `approved_amount`) — routing and reporting need them |

### Evidence and documents

Quotation PDFs, the signed purchase order, the delivery note and the invoice attach to the case or its actions.
They do not belong on the supplier record, which would accumulate every document from every request with no way
to tell which order they came from.

## Fields that look like they belong to both — and where they actually go

| Value | Belongs to | Reason |
| --- | --- | --- |
| Payment term | Supplier (`payment_terms_days`) | Agreed once with the supplier, reused every request. If a request negotiates a different term, record that on the case as an exception |
| Currency | Both, differently | Supplier holds the *usual* invoicing currency as a warning; the request holds the currency actually quoted |
| Contact person | Supplier | The same person receives every order. A one-off contact for a specific order is case evidence |
| Delivery address | Neither, usually | The supplier's field is the *collection* address. Where *this* order is delivered is a case field if it varies; omit it if there is only one company site |
| Price | Request | A price is always a price *for something, at a time*. The supplier's agreement validity date tells you whether agreed prices still apply |
| Supplier rating | Supplier (`last_evaluation_rating`) | Only if a supplier evaluation process exists. Otherwise drop it |
| Approval threshold | Neither | It is a rule in the workflow, not data on a record |

## What this design does not do

- A status field is a label. `relationship_status: suspended` does **not** stop a requester from selecting that
  supplier, and no custom field grants or blocks anything. Enforcement is a check in a workflow action.
- Provia does not enforce uniqueness on a custom field, so two records for the same taxpayer number remain
  possible. Deduplication is a manual search before creating a record.
- Copying a supplier value into a case is a copy at that moment, not synchronisation. Nothing propagates later.
- The ERP link is a link. There is no connector, and no data moves between the two systems.

## Open decisions — these need an owner before setup

| # | Question | Who should answer | Effect if unanswered |
| --- | --- | --- | --- |
| D1 | What are the organization's real supply categories and sub-categories? | Procurement | The illustrative option lists in the catalogue must not be configured as they stand |
| D2 | Is there a supplier evaluation process? | Procurement | If not, remove `last_evaluation_date` and `last_evaluation_rating` rather than ship fields nobody updates |
| D3 | Which documents must a registered supplier hold, and is any of it statutory rather than internal policy? | Procurement with Legal or Finance | `approval_valid_until` has no defined meaning until this is answered. No statutory requirement is assumed here |
| D4 | Does the accounting/ERP system assign the supplier code, and does it have per-supplier addressable pages? | Finance / IT | Determines whether `supplier_code` stays `text` or becomes an `auto_number`, and whether `erp_record_url` is usable at all |
| D5 | What are the approval thresholds and the route each one triggers? | Finance director | `procurement_route` cannot be specified, and the workflow's decision branches cannot be designed |
| D6 | Does one supplier need several contacts (commercial, technical, billing)? | Procurement | If yes, a second entity type is needed; entity fields cannot hold repeating sub-records |
| D7 | Who may see, create and edit supplier records? | Procurement lead | The catalogue declares no access grants because no group design exists; the proposal in `setup` is unconfirmed |
| D8 | Should Provia prepare payment instructions? | Finance | Only a "yes" would justify revisiting the decision to keep bank details out of Provia |
| D9 | Is the country of operation Angola? | The customer | Currency options, the NIF field and the address format depend on it |
