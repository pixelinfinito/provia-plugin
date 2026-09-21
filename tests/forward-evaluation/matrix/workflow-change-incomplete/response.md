Done. Here is where things stand.

## What was delivered (all in the working directory)

| File | Content |
| --- | --- |
| `workflow-change-plan.md` | The deliverable: inputs available vs. missing, confirmed product behaviour, semantic-comparison frame with the YAML/manifest fragment for the new Decision action, impact assessment (open cases, dependencies, people), 11-step draft-version plan in connected and disconnected modes, 10 test cases, recovery instructions, manifest update, state summary |
| `provia-project.json` | New manifest (none existed): the change request as source `cr-extra-approval`, decisions D1–D8 with owners, `mode: disconnected`, no receipts |
| `setup.md`, `project.html` | Generated from the manifest with `build-project-map.mjs --setup` / `--output` |

`node scripts/build-project-map.mjs provia-project.json --check` ran clean: 0 workflows, 0 readiness blocks, 8 pending items (the decisions), 0 warnings. That validates the manifest shape only.

## The core answer to the request

Publishing a new version does **not** lose evidence: open cases keep their instantiated actions, comments, files and field values, and finish on the old path. Evidence is lost only by avoidable moves, which the plan rules out: cancelling and re-opening cases to force them through the approval, re-importing YAML (new lineage, no history, no grants, no cases), or removing/renaming/requiring fields open cases hold. The right mechanics: a new draft **on the same workflow id** (`workflow_create_draft_version` + `workflow_update_draft_actions`, or a new draft in the UI), one inserted Decision, no field or form changes, out-of-band approval recorded on any open case the owner says must be approved. Recovery is another draft version reapplying the previous design, never a re-import.

## What is unavailable or pending

- **Active-incident impact check: pending.** No incident export was supplied and the Provia connector (`org_get_context`) was declined, so nothing was read from a tenant. The Provia connector needs authorizing via claude.ai connector settings before connected mode can be used.
- **No current design**, so the before/after table is a frame to fill from the live export, and `workflows[]` in the manifest is empty — writing `status: change_planned` against an invented workflow would violate the honesty rules. The exact fragment to append is in §3/§8 of the plan.
- `validate-workflow.mjs` and `review-actions.mjs` were not run: there is no YAML to run them on.
- Country (Angola) and language (English) are provisional (D8).

**Recommended next step:** `provia-workflow-change` again, once the live export and the incident list exist — that is what closes D1 and D6 and lets the `change_planned` entry be written. If the customer wants the design of the approval itself refined first (approver, outcomes, brief), `provia-workflow-designer` is the alternative.

```text
Use provia-workflow-change with provia-project.json and workflow-change-plan.md in this directory. Attached: the live YAML export of the workflow (workflow.current.yaml) and the export of its open incidents. Fill the semantic comparison in §3, close the active-incident impact check (D6), confirm D2–D5, append the workflow entry with status change_planned and the new decision action, and regenerate setup.md and project.html. Country: Angola (confirm); reply in English.
```