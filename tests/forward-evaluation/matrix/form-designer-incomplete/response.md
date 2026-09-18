Everything validates cleanly. All artefacts are written to the working directory:

- **`form-it-self-service-request.md`** — the form specification: 13 fields (respondent identity, request type, urgency, summary, rich-text description, affected system, optional attachment, preferred contact, optional needed-by date, and an acknowledgement checkbox), validation rules, access-model options, why category/sub-type isn't a dependent select (forms don't preserve that binding), proposed field mappings, a confirmation message that avoids promising an unconfirmed SLA or reference-number format, and testing steps.
- **`provia-project.json`** — manifest with a placeholder `it-request` workflow (status `design`, no actions — since no SOP/workflow was supplied) and the `it-request-intake` trigger form bound to it, plus four open decisions (`D1` access model, `D2` workflow not yet designed, `D3` attachment limits, `D4` no source SOP).
- **`project.html`** / **`setup.md`** — generated map and handover (`node scripts/build-project-map.mjs provia-project.json --check` passed clean).

Key assumption, stated rather than guessed: with no workflow, catalogue, or SOP available, I added only a minimal placeholder workflow entry so the form has somewhere to bind — I deliberately didn't invent classification/diagnosis/resolution actions or an owning group, since that's workflow-designer's job, not this skill's.

Next recommended step: `provia-workflow-designer`, to turn the four open decisions — especially D2 (the actual IT request process) — into real actions, owner and routing. Copyable request:

```text
Use provia-workflow-designer with provia-project.json in this folder (project it-self-service). Design the IT request workflow (key it-request) that the trigger form it-request-intake feeds: classification, diagnosis, resolution and confirmation to the requester. Resolve decisions D1–D4 where you can, or carry forward the ones that need the process owner. Country: Angola (provisional); reply in English.
```