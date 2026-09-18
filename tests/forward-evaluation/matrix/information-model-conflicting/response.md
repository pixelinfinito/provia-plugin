The refusal note and icon choices rendered into the HTML correctly. No browser is available in this session, so I ran the structural validator (`--check` passed, 2 types) and grepped the rendered HTML for key content, but I did not visually exercise the copy/search/download controls — flagging that limit rather than claiming it.

## Summary

**Declined:** passport numbers and family details for supplier employees. You stated there's no use for them — they're identity-document and relatives' data, disproportionate to "contact details for orders," and the skill's own rules bar collecting sensitive data without a named use, source, and maintainer. If a real use shows up later (e.g., ID checks for site access), it should be a narrowly scoped, access-restricted field tied to that specific process, not a default on every contact.

**Delivered** in this directory:
- `catalogue.json` — two entity types: **Supplier** (lean — identity, category, procurement owner, relationship status, fallback general contact) and **Supplier Contact** (the focus — name, job title, department, order email/phone/mobile, preferred channel, primary-contact flag, status, operational notes), each with full field dictionary, coverage review, setup and readiness notes.
- `catalogue.html` — offline, searchable rendering of the same data, validated with the bundled checker (2 types, passed).

Next useful step: if you want an intake form or a workflow action (e.g., "Register supplier contact") built around this, run:

```text
Use provia-form-designer with the Supplier Contact entity in catalogue.json above (fields: supplier, job_title, department, order_email, phone, mobile_phone, preferred_contact_channel, is_primary_contact, status, notes). Design the intake form for registering a supplier contact, its Form Fill action name and field mappings. Country: Angola (provisional); reply in en.
```