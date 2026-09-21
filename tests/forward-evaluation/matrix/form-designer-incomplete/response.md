The design is done. Everything is in the working directory; here is what was produced, what was verified, and what remains open.

## What was unavailable, and the assumptions I worked under

- **No procedure, SLA, category list or team names** were supplied; the only source is your one-line request.
- **No existing workflow or manifest** in the working directory.
- **Tenant read was not granted** (`org_get_context` permission denied), so this is a disconnected-mode design — nothing was read from or written to a Provia organization.
- **Country/language not stated**: Angola, Africa/Luanda and AOA are the provisional context; the response is in English with a pt-AO label column.

## Artefacts (all in the working directory)

| File | Content |
| --- | --- |
| `it-request-form.md` | The form specification: intake-vs-Form-Fill decision, respondents and access, 9 fields with validation/help/mappings, uploads, the confirmation text (en + pt-AO), an optional closing "Resolution confirmation" Form Fill with its five-part action brief, testing steps, open decisions |
| `provia-project.json` | New manifest: source, placeholder workflow `it-request` (actions `triage`, `resolve`, `confirm-resolution`; `organization → create_incident`; sensitivity `internal`), proposed group `it-support`, `forms[]` with `workflowRef`/`actionRef`, `formRef` on the Form Fill action, decisions D1–D7 |
| `project.html` | Offline map rendered from the manifest (form previews included) |
| `setup.md` | Handover: 7 pending configuration items, access table, group and forms to create, the open decisions |

## Key design choices

- **Intake (trigger) form**, since self-service submission must create a case. A placeholder workflow was added only so the form has a destination — it is not a finished workflow design.
- **`urgency` (requester's view) is separate from `priority` (set by IT at triage)**, so every request doesn't arrive as "high".
- **Flat `request_type` select**, because the form schema in the pinned revision does not preserve dependent-option bindings.
- **Confirmation promises no deadline, no direct-contact channel and no case reference** — none of those were supplied or verified. The text says what was recorded, who reviews it, how they'll be notified, and where to follow it (My cases).
- **No file-size number** in the help text until the destination limit is verified.

## What was checked and what was not

- `node scripts/build-project-map.mjs provia-project.json --check`: 0 errors, 0 warnings, 1 info (IT Support intentionally holds no `view` grant), 18 pending items. This validates the manifest's shape and references only — not the Markdown specification and not business correctness.
- No form was created, linked, previewed or tested in Provia. Access testing is pending (D1).

## Open decisions (owners are functional roles until named)

D1 access model (signed-in vs external link) · D2 real IT team, members, shared-queue `view`? · D3 department and request-type lists · D4 response targets · D5 confirmation-screen capabilities in the destination · D6 route when the requester answers "not solved" · D7 country/language confirmation.

---

**Recommended next step: `provia-workflow-designer`** — the form now has a placeholder workflow with three actions and no routing; the workflow itself (decisions, the "not solved" return path, deadlines, the real IT team) needs designing before anything can be packaged.

```text
Use provia-workflow-designer with provia-project.json in this directory. Complete the placeholder workflow `it-request` that the intake form `it-request-intake` feeds: keep the case fields and the three actions, add the routing for a "not solved" resolution confirmation (decision D6), and resolve decisions D2 and D4 from the IT procedure I will supply. Country: Angola (provisional, D7); reply in English.
```