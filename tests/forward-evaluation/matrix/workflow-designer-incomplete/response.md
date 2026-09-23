Done. Five artefacts are in the working directory.

## The missing context, stated plainly

**No onboarding SOP was supplied.** The request named one; the working directory was empty and no manifest existed. Nothing in this design was read from a customer document. I did not fabricate one, quote one, or cite sections of one.

What I delivered instead: a ten-action design built on an **explicitly declared generic onboarding baseline**, every row labelled `assumed`, so the customer has something concrete to correct rather than a blank page. Eleven open decisions (D1–D11) carry the gaps, with **D1 blocking packaging** until the real SOP is supplied and reconciled.

I also attempted connected mode, since a `provia-implementer` server was offered — the `org_get_context` call was not permitted, so the tenant was never read and nothing was created in Provia.

## The design

**10 actions**, owners by group key: `register_hire` → `collect_documents` → **`approve_plan`** (decision) → fork into `prepare_contract` ‖ `create_access` ‖ `prepare_equipment` → join at **`decide_start`** (decision) → `run_induction` → `introduce_to_team` → **`decide_period_end`** (decision).

The three things the request actually asked for:
- **Actions** — ten, each with the full five-part brief (task, method, evidence, done-when, exceptions) and named evidence.
- **Approvals** — `approve_plan` (plan and access list) and `decide_period_end` (end of period), both human Decisions applying stated criteria. No threshold engine, no amount, no auto-routing.
- **Exception paths** — nine branches: three returns with named targets (`register_hire`, `prepare_contract`, `introduce_to_team`) and three cancellations, all requiring a comment.

Deliberate omissions: every `due` is **unset** (no service level was supplied — D2); no `organization` grant (nothing says any employee may open a case); no `view` for IT or hiring managers (they see the cases carrying their actions); `sensitivity: internal` with a note recording that it is unevidenced (D7).

## What the scripts actually reported

| Check | Result |
| --- | --- |
| `build-project-map.mjs --check` | 0 errors, 0 warnings, 2 infos; access declared 1/1; 0 readiness blocks; 41 pending items |
| `validate-workflow.mjs` | `valid: true`, backend schema passed; `readyToPublish: false`; 10 × `assignment_missing` |
| `review-actions.mjs` | 10/10 complete on all five parts; 0 leaked implementer notes; **10/10 `due` missing** |

The two infos and both sets of ten are the design as intended, surfaced rather than hidden. Structural validity is not business correctness, and this is not publication-ready.

**Files:** `workflow-design.md`, `workflow.yaml`, `provia-project.json`, `setup.md`, `project.html`.

---

Next step: `provia-organization-rollout` — the three groups (`hr`, `it`, `hiring_managers`) are placeholders flagged `unnamed`, and they block ten assignments plus the access apply. Do this *after* the SOP arrives if you can; if the SOP is delayed, the group work is independent and can proceed now.

```text
Use provia-organization-rollout with provia-project.json in this directory. Complete the three proposed groups (hr, it, hiring_managers) with their real tenant names, areas and members, resolve decisions D3, D4 and D6, and review the segregation flag between approve_plan and create_access. The onboarding SOP is still not supplied (D1), so keep every group entry marked as proposed. Country: Angola (provisional, D11); reply in English.
```