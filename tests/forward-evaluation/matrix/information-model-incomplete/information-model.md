# Supplier vs purchase request: where each field belongs

Deliverable of `provia-information-model`, 2026-09-21. Companion files: `catalogue.json` (source of truth), `catalogue.html` (offline, copy-ready), `provia-project.json` (manifest with `entityTypes[]` and decisions), `project.html`, `setup.md`.

## What was available and what was not

**Confirmed facts.** The working directory contained no manifest, procedure, sample records or system inventory. The Provia tenant could not be read in this session (the `org_get_context` call was not permitted), so the work is in disconnected mode. The request was in English; no country was given.

**Assumptions used.** Angola as provisional context (AOA, Africa/Luanda) — never as a legal basis. A typical purchasing lifecycle: request → approval → budget confirmation → order → receipt/invoice. Purchasing maintains supplier records; Finance owns the accounting code and confirms the NIF. Each assumption that changes the model is an open decision (D1–D7 in `setup.md`).

**Product references used.** `references/entity-design.md`, `references/metadata-fields.md` (19 types, revision `2641364d…`), `references/entity-icons.json` (snapshot `36772f7c…`), `references/entity-catalogue-format.md`, `references/project-manifest.md`.

## The rule for the split

Ask two questions of every field:

1. **Is it true of the supplier regardless of which request is open?** Then it lives on the **Supplier entity**, entered once and maintained by Purchasing. Examples: NIF, commercial email, payment terms, status.
2. **Is it a fact of one purchase — what, why, how much, when, who approved, what was ordered?** Then it lives on the **purchase-request case** (workflow metadata) or in the **action's evidence** (decision comment, attached quotation). It is never copied into the supplier record.

A purchase request is therefore **not** a second entity type. It is one execution (incident) of the purchasing workflow. Modelling it as an entity would duplicate every case, and Provia already gives each case a number, creator, timestamps, status and history. The request links to the supplier through one `entity` field; that link is how the request avoids repeating supplier data.

Two deliberate consequences:

- **No inverse list on the supplier** ("all requests for this supplier"). Provia shows linked cases from the record; a maintained list field would go stale.
- **Copying is not synchronization.** If a notification needs the supplier's email, the workflow reads it from the linked record at that moment. Do not map supplier fields into case fields "for convenience"; the copy diverges the day the supplier changes contact.

## Supplier — entity type (`supplier`, icon `Truck01`)

Paste-ready description, Name pattern and the complete field dictionary are in `catalogue.json` / `catalogue.html`. Summary:

| Group | Field (key) | Type | Priority | Required at creation | Maintainer |
| --- | --- | --- | --- | --- | --- |
| Identification | Legal name (`legal_name`) | text | conditional | no | Purchasing |
| Identification | NIF (`tax_number`) | text | core | no | Purchasing; Finance confirms |
| Identification | Accounting supplier code (`supplier_code`) | text | conditional | no | Finance |
| Classification | Category (`category`) | select: goods / services / works / goods_and_services | core | no | Purchasing |
| Contacts | Commercial contact (`contact_name`) | text | core | no | Purchasing |
| Contacts | Commercial email (`contact_email`) | email | core | no | Purchasing |
| Contacts | Commercial phone (`contact_phone`) | phone | optional | no | Purchasing |
| Contacts | Address (`address`) | text | conditional | no | Purchasing |
| Contacts | Country (`country`) | text | conditional (foreign suppliers) | no | Purchasing |
| Ownership | Relationship owner (`relationship_owner`) | user | core | no | Purchasing lead |
| Relationship | Status (`status`) | select: prospective / active / suspended / closed | core | **yes** | Purchasing |
| Relationship | Approved on (`approved_on`) | date | conditional (if qualification exists, D5) | no | Purchasing |
| Commercial terms | Invoicing currency (`currency`) | select: aoa / usd / eur | core | no | Purchasing |
| Commercial terms | Payment terms (`payment_terms`) | select: prepayment / on_delivery / net_30 / net_60 (illustrative) | core | no | Purchasing |
| Commercial terms | Typical lead time (`lead_time_days`) | number | optional | no | Purchasing |
| Commercial terms | Framework agreement (`agreement_url`) | url | conditional | no | Purchasing |
| Commercial terms | Agreement valid until (`agreement_end`) | date | conditional | no | Purchasing |
| Notes | Notes (`notes`) | rich_text | optional | no | Purchasing |

Native Name = trading name; UUID, creator and timestamps are native. Nothing else is required at creation, so a buyer can register a supplier from a business card and complete it later. **Readiness before the first order:** Status = active, NIF, commercial email, currency, payment terms. The Status field does not block selection on its own — the order action's brief has to tell the assignee to check it.

**Held elsewhere, on purpose.** Bank details and tax certificates (accounting system; sensitive, no Provia consumer), the signed contract (document repository, linked by `agreement_url`), supplier rating (pending an evaluation process, D5).

**Not added.** `display_name`, `source_system`, `source_url`, `verified_at`, a version field, or a Provia `auto_number` next to the accounting code. If the organization has no external code, D3 swaps `supplier_code` for an `auto_number` (`prefix: SUP-`, `padding: 4`).

**Coverage review** (identity, contacts/location, ownership, status/lifecycle, commercial terms, relationships, evidence, performance) is recorded per dimension in the catalogue with the reason for each `included` / `case` / `external` / `pending` decision.

## Purchase request — case metadata, not an entity

These fields belong to the purchasing **workflow** (`fields[]` in its YAML), to be configured when the workflow is designed. The catalogue format carries entity types only, so this dictionary is recorded here and in decisions D6–D7. Names follow the same metadata rules (19 types, snake_case keys).

| Field (key) | Type | Required at intake | Set by | Why it is on the case |
| --- | --- | --- | --- | --- |
| Request number (`request_number`) | auto_number, `prefix: PR-`, `padding: 4` | no (generated) | Provia | Readable reference for the requester and Finance; counter scoped to the workflow family, gaps possible |
| What is needed (`items`) | rich_text | yes | Requester | Lines: description, quantity, specification. Provia has no table type; a structured line list stays in the text or an attached file |
| Justification (`justification`) | rich_text | yes | Requester | Basis for the approval decision; specific to this purchase |
| Category (`category`) | select: goods / services / works | yes | Requester | Routing and reporting; same vocabulary as the supplier category so the two can be compared |
| Cost centre / department (`cost_centre`) | select, or `entity` if D6 makes it a shared type | yes | Requester | Budget confirmation and spend reporting |
| Estimated amount (`estimated_amount`) | currency (AOA, provisional) | yes | Requester | Drives which approval applies (thresholds are policy inputs, D7); a number does not route by itself |
| Currency (`request_currency`) | select: aoa / usd / eur | no (defaults to organization currency once D4 is confirmed) | Requester | Foreign-supplier purchases |
| Needed by (`needed_by`) | date | no | Requester | Lets Purchasing compare with the supplier's lead time |
| Supplier (`supplier`) | entity → `supplier` | no | Requester suggests; Purchasing confirms or replaces at order | **The link that replaces re-typing supplier data.** One field, updated at order time, rather than "suggested" and "final" duplicates |
| Quotations (`quotations`) | file | conditional (from the amount D7 sets) | Requester or Purchasing | Evidence for the decision; stays with the case |
| Approved amount (`approved_amount`) | currency | no | Approver (decision action) | May differ from the estimate; the approval comment itself is action evidence, not a field |
| Budget confirmed (`budget_confirmed`) | boolean | no | Finance | Recorded by the budget action; not a supplier attribute |
| Order number (`order_number`) | text | no | Purchasing | Reference of the order in the accounting/ERP system; the order document itself lives there |

**Kept out of case metadata:** the approval decision and its reason (decision action + mandatory comment), the requester (native creator), request date and status (native), delivery confirmation narrative (action evidence). Anything the intake form collects that no action or report reads (e.g. "preferred colour") stays on the form submission.

## Manual-entry walkthrough

*Supplier.* A buyer registers «Demonstration Supplies, Lda.» knowing trading name, category = goods, a contact name and email, Status = prospective. Later they add NIF and address from the supplier's registration document; Finance adds the accounting code after creating the supplier in accounting; currency and payment terms follow the first negotiation; Status becomes active when the organization clears the supplier. The NIF is typed in Provia and in accounting — one unavoidable double entry; accounting is authoritative and Purchasing copies once.

*Purchase request.* A requester opens a case: items, justification, category, cost centre, estimated amount, needed-by, and picks the supplier from the list (or leaves it empty). Nothing about the supplier is typed. The approver records the decision; Finance ticks budget confirmed; Purchasing confirms the supplier link and records the order number. Supplier contact and terms are read from the linked record when the order is prepared.

*Unresolved maintenance effort:* who updates payment terms when a supplier renegotiates, and who moves a supplier to suspended — both need an owner (D2) before go-live.

## Checks performed

- `node scripts/build-entity-catalogue.mjs catalogue.json --check` — 1 type, editorial checks passed (shape, icon, field types, select examples). Not a Provia import validation.
- `node scripts/build-entity-catalogue.mjs catalogue.json --output catalogue.html` — rendered; the file has no external scripts and carries copy controls for type name, icon, description, Name convention and field keys. **Not exercised in a browser** in this session: copy buttons, search and JSON download remain to be clicked by the reviewer.
- `node scripts/build-project-map.mjs provia-project.json --check` — 0 workflows, 1 entity type, 0 errors, 0 warnings, 8 pending items (the entity type to create and D1–D7).
- `--output project.html` and `--setup setup.md` — generated from the same manifest.

Nothing was created or changed in Provia.
