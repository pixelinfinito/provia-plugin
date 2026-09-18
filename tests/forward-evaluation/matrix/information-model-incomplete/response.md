All 15 fields rendered correctly. I inspected the generated markup directly (grep) rather than exercising it in a browser, since no browser tool is available in this session — copy buttons, JSON download and search should be verified manually before relying on them in front of the customer.

## Answer: supplier vs. purchase request

No SOP, sample records, existing catalogue or reporting requirements were supplied for this task, so the split below rests on an assumed generic goods/services procurement flow (request → approval → sourcing/quotation → purchase order → receipt) with Angola as a provisional country context (AOA, Africa/Luanda) — all flagged as unconfirmed in `catalogue.json`.

**Supplier → a Provia entity** (`catalogue.json` / `catalogue.html`, 15 fields, validated with `build-entity-catalogue.mjs`). It qualifies as an entity because it's a stable object selected across many purchase requests, contracts and evaluations, with its own lifecycle. Fields: identity (`supplier_code`, `legal_name`, `tax_number`), classification (`category`), responsibility (`account_owner`), contacts (`contact_name`, `contact_email`, `contact_phone`, `address`), commercial terms (`payment_terms`, `billing_currency`, `bank_details` — flagged sensitive), lifecycle (`relationship_status`, `relationship_start`), and an evaluation reference link (marked `pending` — only add if a real evaluation process exists).

**Purchase request → not an entity.** It's one execution of a process, so per the entity-design rule its data splits three ways instead of becoming a second type:
- **Case metadata** (workflow schema, needed for routing/reporting): requester (native creator), department/cost center, needed-by date, urgency, supplier (entity reference to Supplier — this is how requests reuse supplier data instead of repeating it), estimated total, currency, budget code, PO number.
- **Native workflow features**, not custom fields: approval decision/history, overall request status, action assignee.
- **Form response only**: line items (description/qty/unit/price), justification, delivery location, quotation attachments — mapped to the case only if a specific reporting or routing use needs it.

This disposition is documented in `catalogue.json`'s `notes`; it's a recommendation for the next design step, not workflow YAML. No `provia-project.json` existed in the working directory, so nothing was appended to a manifest — this is a standalone catalogue.

Recommended next step: **`provia-workflow-designer`**, to turn the assumed purchase-request flow into actual actions and confirm which case fields the process really needs (replacing the assumptions here with real ones).

```text
Use provia-workflow-designer to design the purchase-request workflow (request → approval → sourcing → purchase order → receipt). Reuse the Supplier entity type in catalogue.json (key "supplier") via entityRefs, and confirm/replace the case-metadata field list proposed there (requester, department, needed-by date, supplier, estimated total, currency, budget code, PO number). Country: Angola (provisional); reply in English.
```