## Answer

**Supplier is an entity type. A purchase request is not** — it's a workflow case. The rule that decides every ambiguous field:

> The supplier holds what stays true **between** requests. The request holds what is true of **this one execution**.

Test when unsure: if the next request to the same supplier repeats the value unchanged, it's a supplier field; if the next request gives it a different value, it's a case field. Usual invoicing currency → supplier. Amount → request.

| | Supplier (entity `supplier`) | Purchase request (workflow case) |
| --- | --- | --- |
| Identity | Registered name, NIF, accounting code | — (the workflow prefix already gives each case a reference) |
| Classification | Supply category → sub-category (dependent), criticality | Procurement route, cost centre, requesting department |
| Contacts | Commercial contact, email, phone, collection address, country | — |
| Commercial | Usual currency, agreed payment term, agreement valid until | Estimated amount, request currency, needed by, approved amount |
| Lifecycle | Status, registration valid until, last evaluation + rating | Approval decision, decision reason, PO number, received on, invoice ref |
| Link | — | `selected_supplier`: one `entity` reference, set at award — not a copy of the supplier's fields |

Three calls worth flagging: **quotations stay on a Form Fill submission**, not as case fields (three quotations are three sets of values; promote only the winner and the awarded amount). **Bank details stay out of Provia** — the finance system has its own confirmation procedure, and a second unowned copy is a fraud surface; the ERP link covers lookup. **Qualification status was merged into one `relationship_status`** rather than kept as a second overlapping status field.

## Missing context — what I assumed

Nothing was supplied: no procedure, form, export, existing catalogue, workflow design, or manifest. A Provia MCP server is exposed here, but `org_get_context` wasn't authorized in this non-interactive session, so no tenant was read — existing types, icons and permission levels are unverified. To use the connected reads you'd need to grant that tool (via `/mcp` or connector settings in an interactive session).

So this is a reasoned baseline, labelled as such throughout. Country is provisionally **Angola** (AOA, Africa/Luanda) since none was stated. No legal or fiscal requirement is asserted anywhere. The sub-category options are a demonstration of the dependent-selection mechanism, not a recommendation — they must be replaced before setup. Nine open decisions carry owners (D1–D9 in `setup.md`), of which four could change the design materially: real categories (D1), whether a supplier evaluation process exists at all (D2 — if not, drop both evaluation fields rather than ship a register that goes stale), who assigns the supplier code (D4), and whether one supplier needs several contacts (D6 — entity fields can't hold repeating sub-records, so "yes" means a second type).

## Files written

- `catalogue.json` / `catalogue.html` — the Supplier type: description, `Truck01`, Name pattern, 19 grouped fields with keys, types, options, help text, maintainers and sensitivity, coverage across 8 dimensions, setup notes with the manual-entry walkthrough and deferred-candidate dispositions
- `purchase-request-fields.md` — the case side (the catalogue schema only carries entity types), plus the ambiguous-field table and the open decisions
- `provia-project.json`, `project.html`, `setup.md` — new manifest carrying the type and the decisions forward

Checks actually run: `build-entity-catalogue.mjs --check` passed (1 type; editorial shape, icon, field types, dependent parent chain and parent/child example agreement); HTML generated. `build-project-map.mjs --check` passed (1 entity type, 10 pending items, 0 warnings), map and handover written. I inspected both HTML sources — no external references, copy controls and clipboard fallback present — but no browser tool exists here, so I did not open them or click a copy button. Structural validity isn't business correctness, and none of this was created in Provia.

---

Next: **`provia-workflow-designer`** — the split above is only provable once the purchase request has actions and owners, and D5 (thresholds) blocks both the approval branches and `procurement_route`.

```text
Use provia-workflow-designer with provia-project.json in this directory. Design the purchase request workflow — intake, sourcing, approval, order, receipt — using the case fields in purchase-request-fields.md and the supplier entity type in the manifest. Approval thresholds are unresolved (D5): propose a structure and leave the amounts as an open decision. Country: Angola (provisional, D9); reply in English.
```