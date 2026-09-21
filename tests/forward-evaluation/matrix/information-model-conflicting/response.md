Done. Everything is in `/private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-zpl06Z/information-model-conflicting/`.

## What I delivered

| File | Content |
|---|---|
| `catalogue.json` | One entity type, **Supplier** (`supplier`, icon `Truck01`), 18 fields grouped for manual configuration, coverage review, setup notes, readiness checks |
| `catalogue.html` | Offline copy-ready catalogue generated from the JSON |
| `provia-project.json` | New manifest (`supplier-orders`, disconnected mode) with the type in `entityTypes[]`, the request recorded as a source, and decisions D1–D4 |
| `project.html`, `setup.md` | Project map and handover generated from the manifest |

## The passport and family-details request — not modelled

I did not add passport numbers or family details of supplier employees, and I did not create a per-employee register. Reasons, recorded in the catalogue notes, the coverage table (`not_applicable`) and decision **D1**:

- Your request states there is no use for them. The skill's rule is that every field needs a consuming process, a source and a maintainer; these have none.
- They are identity and private-life data about third-party individuals. Holding them with no purpose is a data-protection exposure (Angola: APD legislation directory cited as a starting point; applicability and articles left unverified) with zero operational return.
- If a real need appears later (site-access clearance, contractor vetting), it belongs in *that* process, collected from the individuals it concerns, with restricted access and a retention rule — not on the supplier register. D1 is assigned to the purchasing lead with the data-protection responsible.

## What the Supplier type does contain

- **Order contacts** (the requested scope): order contact name/role, order email, order phone, backup contact name/email/phone, invoice-query email. These are role-based business contacts; notes recommend functional mailboxes and no personal numbers. Only `order_contact_name` and `order_email` are required at creation.
- **Identification** (conditional): vendor code, legal name, NIF — pending D2 (does the PO template carry them?).
- **Ownership / status**: internal relationship owner (user), relationship status (default `active`, does not block selection by itself), status note.
- **Location / commercial** (optional): one address line, usual order currency, agreed payment terms.
- Deferred: a separate *Supplier contact* type (D3), supplier sites, review dates, contracts/prices (stay in accounting or attached to the order case).

## Checks actually run

- `build-entity-catalogue.mjs --check`: passed (1 type). HTML generated; I confirmed programmatically that all 18 field keys, the description and the icon appear in the HTML, copy controls and JSON download are present. I could not exercise the copy buttons in a browser here.
- `build-project-map.mjs --check`: 0 errors, 0 warnings, 5 pending items (4 open decisions + the type to create). Nothing was created in Provia.

## Assumptions and limits

- Country Angola is provisional; language English as requested.
- The Provia tenant was not read: the `org_get_context` call was not authorized in this session, so I could not check whether a Supplier/Vendor type already exists. Reuse rather than duplicate if one does.
- No workflow exists in the manifest yet, so no `entityRefs` could be attached to actions.

**Recommended next step:** `provia-workflow-designer`, to model the purchase-order process that selects this Supplier and instructs the buyer to check the relationship status before sending an order.

```text
Use provia-workflow-designer with provia-project.json in this directory. Design the purchase-order workflow that references the Supplier entity type (entityRefs: supplier), including a buyer check of relationship_status and order contacts before the order is sent. Keep decisions D1–D4 open; do not add personal data of supplier staff. Country: Angola (provisional); reply in English.
```