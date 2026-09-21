## What was missing, and what I did about it

- **The SOP itself was not supplied** — the request refers to "this onboarding SOP" but nothing was attached and the working directory was empty.
- **The tenant could not be read** — the Provia MCP server is listed, but the `org_get_context` call was not permitted in this session, so I worked in disconnected mode. Nothing was read from or written to any organization.
- No country, roles, approval rules, service levels or exceptions were given. Angola is a provisional context.

Rather than stop, I recorded an **assumed onboarding outline** as source `sop-onboarding-assumed` (kind `other`, sections A1–A9) and built the whole design against it, so every row is traceable and every assumption is one decision away from being replaced. No deadline, threshold, approver authority or statutory obligation was invented: those are left unset and logged as decisions D1–D10.

## Artefacts (all in the working directory)

| File | Content |
| --- | --- |
| `workflow-design.md` | The five-part deliverable: classification table, action table, Mermaid flow, skeleton notes, manifest summary, checks run, facts/recommendations/unresolved |
| `workflow.yaml` | `provia.ao/v1` skeleton, prefix `ONB`, 6 fields, 10 actions with full five-part briefs, 3 decisions with named branches |
| `provia-project.json` | Manifest v1.1: source, 4 proposed groups, workflow with `access`, `ownerArea`, trigger, `unresolvedEntityTypes: [employee]`, decisions D1–D10 |
| `project.html`, `setup.md` | Map and handover generated from the manifest |

## The design in one glance

`register_hire` (creator/HR) → `prepare_contract` (hr) → **`approve_contract`** (hr_management: Approve / Return for correction → prepare_contract / Cancel) → **`record_signature`** (hr: Signed / Postponed → register_hire / Withdrawn → cancel) → parallel `provision_access` (it_support) + `register_payroll` (hr) → `induct_employee` (person in `hiring_manager` field, fallback role group) → `prepare_probation_review` (hr) → **`review_probation`** (hiring manager: Confirm / Extend → prepare_probation_review / End during probation) → `close_onboarding` (hr).

Non-branch exceptions (missing approval, missing documents, missing equipment, no-show, blocked registration, etc.) are in each action's `Exceptions:` line. Access: `hr` → `create_incident`, `hr_management` → `edit`; IT and hiring managers get no grant.

## Checks actually run

- `build-project-map.mjs --check`: **0 errors, 0 warnings, 2 infos** (assigned groups without a grant — intended). 1 unresolved entity key, 43 pending setup items.
- `review-actions.mjs workflow.yaml`: 10/10 briefs complete, 0 implementer-note leaks, `due` missing on 10/10 by design.
- `validate-workflow.mjs`: **not run** (belongs to `provia-workflow-package`).

## Open decisions before packaging

D1 supply/confirm the SOP · D2 real actor names · D3 service levels · D4 probation length and who decides · D5 contract approver and delegate · D6 restricted vs internal · D7 Employee entity type · D8 jurisdiction and statutory registrations · D9 separation process · D10 notifications.

**Recommended next step:** re-run `provia-workflow-designer` once the actual SOP is available — it is the input everything else depends on, and any section that contradicts A1–A9 changes actions and branches. If the outline is confirmed as-is instead, `provia-organization-rollout` is next to turn the four flagged groups into real owners.

```text
Use provia-workflow-designer with the attached onboarding SOP and provia-project.json in this directory. Replace source sop-onboarding-assumed (sections A1–A9) with the real procedure, reclassify every step, and resolve decisions D1–D10 where the SOP answers them. Keep the action ids in workflow.yaml where the work is unchanged. Country: confirm (Angola was provisional); reply in English.
```