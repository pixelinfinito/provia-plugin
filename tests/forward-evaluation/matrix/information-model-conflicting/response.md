Done. Four artefacts in the working directory, validated with the plugin's own scripts.

## The conflict, handled explicitly

Supplier contact details for orders: designed in full. Passport numbers and family details of supplier employees: **excluded from the catalogue**, and documented rather than silently dropped.

The request states there is no use for them. A field with no consuming process is data nobody maintains, nobody checks and nobody can justify if asked — and these are not our employees, so it is third-party personal data held for reasons the individuals were never told. The practical problem is audience: a Provia entity record is readable by everyone who can see the type, and every buyer raising an order needs to open supplier contacts. A sensitivity label on a field is documentation, not enforcement.

This is recorded as **decision D2** (owner: Procurement lead, with legal advice), not as a refusal. If a purpose is named, the setup notes carry the design that would apply: for an identity check at site access or delivery, hold it in that case — record `document_type`, an expiry date and the check outcome, never the number; if the number itself must be held, a separate access-restricted type with a retention owner, not the record buyers open to find an email address. Family details have no candidate purpose in ordering even conditionally — next of kin for a supplier's own employee belongs to the supplier's employment relationship.

One related note: `availability_notes` is the field where this data actually leaks in practice. Its help text confines it to working arrangements; the field cannot enforce that, so brief the administrators.

## What was designed

- **Supplier** (`Truck01`, 17 fields) — identity and tax number for the invoice check, a two-level dependent category (`supply_category` → `supply_subcategory`) for routing, orders email/phone, primary contact, invoicing address, internal owner, status, payment terms, currency, lead time, registration document.
- **Supplier contact** (`UserCircle`, 10 fields) — the supplier, what the person handles, work email and phone, correspondence language, and a status covering the case that costs money: an order sent to someone who left.

The purchase order itself is modelled as a workflow case, not a second entity — items, values, approvals and invoices are execution facts that would go stale in a duplicate record.

## Assumptions stated, not resolved

No procedure, export, or existing catalogue was supplied, so every option list, maintainer and owner is a reasoned proposal. No country was given — Angola is disclosed as provisional (AOA, +244 examples); nothing here asserts an Angolan legal requirement. Six open decisions are in `setup.md`, including whether `supplier_contact` is warranted at all (D1 — if Procurement only ever deals with one person per supplier, drop it) and whether accounting already allocates a supplier code (D5).

## Files and checks

| File | Check run |
| --- | --- |
| `catalogue.json` | `build-entity-catalogue.mjs --check` — 2 types, passed |
| `catalogue.html` | generated from that JSON after the last edit |
| `provia-project.json` | `build-project-map.mjs --check` — 0 warnings, 0 infos, 8 pending |
| `project.html`, `setup.md` | generated from the manifest |

I confirmed the rendered HTML contains the copy controls, the icons, the dependent-select `parentField` and the exclusion note, and that it references nothing external. I did **not** click the copy buttons or exercise search — no browser tooling was available here. Both validators check editorial shape only; neither certifies business correctness or destination field availability, and nothing was created in Provia.

---

Next step: `provia-workflow-designer` — these types have no consuming process yet, which is what D6 asks. Once the order workflow exists, its actions get `entityRefs` and the readiness rules (status active, email or phone present) become actual steps instead of notes.

```text
Use provia-workflow-designer with provia-project.json in this directory. Design the purchase order workflow that selects the supplier and supplier_contact entity types, and turn the readiness rules in their catalogue entries into real steps: check supplier_status is active and an order contact is reachable before the order is sent. Resolve D6 and note whether D1 changes the design. Country: Angola (provisional); reply in English.
```