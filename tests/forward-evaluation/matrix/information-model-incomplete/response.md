## Short answer

**Supplier** is the only entity type. **Purchase request is a case** (one run of the purchasing workflow), not a second entity. The test for each field: if it's true of the supplier regardless of which request is open, it goes on the supplier record; if it's a fact of one purchase, it goes on the case or in the action's evidence. The request links to the supplier through one `entity` field — that link is what stops supplier data being retyped per request.

**Supplier entity** (`supplier`, icon `Truck01`, 18 fields): legal name, NIF, accounting code · category · commercial contact/email/phone, address, country · relationship owner · status (the only creation-time required field) and approval date · currency, payment terms, lead time, framework agreement + end date · notes. Bank details and tax certificates stay in accounting; the contract stays in the repository.

**Purchase-request case fields**: request number (auto_number `PR-`), items, justification, category, cost centre, estimated amount, currency, needed-by, supplier link, quotations (file), approved amount, budget confirmed, order number. Approval reason, requester and dates are action evidence or native.

## Context that was unavailable

No procedure, sample records or system inventory were in the working directory, and the tenant read (`org_get_context`) was not permitted, so this is disconnected mode. I proceeded on stated assumptions (Angola/AOA provisional, Purchasing maintains suppliers, Finance owns the accounting code) and logged the seven things that need confirming as decisions D1–D7 with owners — notably: existing systems of record, whether the ERP assigns a supplier code, country/currency, whether supplier qualification exists, whether cost centre becomes a shared entity, and approval thresholds.

## Files written (working directory)

- `catalogue.json` / `catalogue.html` — source of truth and offline copy-ready catalogue
- `provia-project.json` — new manifest with `entityTypes[]` and decisions (no workflows exist yet, so no `entityRefs`)
- `project.html`, `setup.md` — map and handover
- `information-model.md` — the split rule, both field dictionaries, walkthrough, checks

## Checks

Catalogue `--check` passed (1 type); project map `--check` reports 0 errors, 0 warnings, 8 pending items. HTML was generated and has copy controls and no external scripts, but I did not exercise the buttons in a browser. Nothing was created in Provia.

**Recommended next step:** `provia-workflow-designer`, because the purchase-request fields above only become real once a workflow carries them, and D7 (approval steps and thresholds) is what that skill needs to settle first.

```text
Use provia-workflow-designer with provia-project.json in this directory. Design the purchase request workflow (request → approval → budget confirmation → order) using the supplier entity type already in entityTypes[], add the case fields listed in information-model.md, set entityRefs on the actions that select the supplier, and resolve decisions D6 and D7 from the purchasing procedure. Country: Angola (provisional); reply in English.
```