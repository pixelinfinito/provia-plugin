Done. Four artefacts in the working directory.

**`form-it-request.md`** — the form specification. It is an **intake form** (trigger), not a Form Fill: submission creates the incident, so `actionRef` is null. Eight fields, three required — `summary`, `description`, `request_type`, `impact`, `affected_service`, `location`, `contact_phone`, `attachments` — each with validation, a one-to-one mapping to a case metadata field, and the reason it exists. Plus uploads policy, the confirmation text, the setup sequence and a test plan.

Two product constraints shaped the fields, both from `references/metadata-fields.md`: the form field enum excludes `auto_number` (no case reference can be asked or generated on the form), and form option definitions do not preserve dependent-option bindings (so `request_type` is a flat list, not a cascade into sub-categories).

The confirmation states that the request is registered and that IT will make contact — and deliberately carries no deadline, no case reference and no email promise, because none of the three is established. Each omission is an open decision, not an oversight.

**The missing context.** Nothing was supplied: no procedure, service catalogue, group list, or form-behaviour check, and no Provia organization is connected. The decision that actually blocks is the respondent access model (D1). The spec presents the three options side by side — authenticated employees, a named subset, people without an account — with what each does to the fields and to the access grants, and designs on the authenticated option because that is what the manifest can declare honestly. **No external or anonymous link is promised**, since the configured form behaviour was not verified. Access testing is marked pending; I ran no test against any environment.

**`provia-project.json`** — form `pedido-ti` in `forms[]` with `workflowRef: pedidos-ti`, the `suporte-ti` group, and nine open decisions with owners. The workflow entry is a labelled skeleton (one triage action) created so the form has a destination to be traced to; everything after triage was neither supplied nor designed (D9).

**`setup.md`** and **`project.html`**, generated from the manifest.

`node scripts/build-project-map.mjs provia-project.json --check` passed: 0 errors, 0 warnings, 1 info (IT Support holds no workflow grant — that is D4, and rule 4 says not to propose `view` from assignment alone), 16 pending setup items. That check covers the manifest's shape and references only; it does not validate the Markdown spec, and it says nothing about whether these are the right questions for your organization.

Next step: `provia-workflow-designer`, because the form currently drains into a one-action skeleton — the intake is only as useful as what happens after triage.

```text
Use provia-workflow-designer with provia-project.json in this directory. Design the IT support request workflow (key pedidos-ti) after the existing triage action: assignment, resolution, closure, and any approval path for new equipment or access requests. Keep the intake form pedido-ti and its field mappings intact, and declare the seven case metadata fields the form maps to. Decisions D1–D9 are open; do not resolve them by assumption. Country: Angola (provisional); reply in English.
```