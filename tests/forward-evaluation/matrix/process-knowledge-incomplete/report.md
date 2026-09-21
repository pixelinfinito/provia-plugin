# Process knowledge report — runbook and memory glossary (draft)

Skill: `provia-process-knowledge` · Date: 2026-09-21 · Project: `unnamed-procedure` · Mode: disconnected

## 1. What was supplied

Nothing. The working directory was empty: no procedure text, no `provia-project.json`, no workflow YAML or export, no policy, no incident lessons. The request names an "approved procedure" but the document was not attached.

The host lists the Provia connector (`org_get_context`), but the call was not permitted in this session, so the organization's workflows could not be read either. No retry was attempted.

## 2. Assumptions stated to continue

| Assumption | Basis | Recorded as |
| --- | --- | --- |
| Country Angola, timezone Africa/Luanda, currency AOA | Plugin convention when no country is supplied: Angola is a *provisional* starting context, not a fact | D5 |
| Response language English | Language of the request | D5 |
| The procedure's workflow version is unknown | No manifest or export | Both deliverables are labelled **draft**, as the skill requires when the approved version is unknown |
| Update owner not named | No source | D4 |

## 3. Deliverables

| File | Content | What is real in it |
| --- | --- | --- |
| `runbook.md` | Concise runbook structure: purpose/trigger, roles, five-part step blocks, exceptions, evidence, escalation, maintenance, proposed changes | Provia mechanics (access levels, workday counting, five-part brief format, where evidence lives). Every procedure-specific slot is `[FROM PROCEDURE]` / `[FROM WORKFLOW]` / `[FROM POLICY]` — nothing was invented. |
| `memory-glossary.md` | Proposed Agent Memory glossary in two parts | Part A: 18 Provia product terms confirmed from `provia-capabilities.md`, `action-writing.md`, `workflow-access` conventions. Part B (organization terms): empty by design, with the categories to look for. |
| `provia-project.json` | Manifest, `provia-project/v1.1`, one placeholder source, zero workflows, five open decisions | Shape validated (see §5). |
| `setup.md` | Generated handover | Lists the five open decisions; nothing pending to configure because nothing was designed. |
| `project.html` | Generated offline map | Same content as the manifest. |

## 4. Confirmed facts, recommendations, unresolved decisions

**Confirmed (from product references only):** Agent Memory documents, pages and forms are configured in Provia separately after YAML import; YAML does not carry them. Memory holds stable approved guidance; case facts stay in the incident. Workday offsets skip weekends, not public holidays. Workflow access levels are `view` < `create_incident` < `edit` < `admin`.

**Recommendations:**
1. When the procedure arrives, write each step as a five-part brief in `runbook.md` §3 and reuse the same text as the action `description`; run `node scripts/review-actions.mjs workflow.yaml` from the plugin root once a YAML exists.
2. If any step names no evidence, propose one and mark it as a recommendation rather than leaving the step unprovable.
3. Keep pilot workarounds in `runbook.md` §4 as exceptions to review; do not promote them to policy without the process owner's approval.
4. Translate the glossary to pt-AO only if the organization confirms Portuguese as its working language.

**Unresolved decisions (owners in the manifest):** D1 procedure identity and version · D2 workflow version · D3 organization terms · D4 update owner and memory reviewer · D5 country/language/currency/timezone.

## 5. Checks run

| Check | Covered | Result |
| --- | --- | --- |
| `node scripts/build-project-map.mjs provia-project.json --check` | `provia-project.json` only | 0 workflows, 0 groups, 0 entity types, 0 forms; 0 readiness blocks; 5 pending items (the decisions); 0 warnings, 0 errors |
| `--setup setup.md`, `--output project.html` | manifest | written |
| `review-actions.mjs` | not run | no workflow YAML exists |
| Markdown deliverables | no script validates them | reviewed by hand only |

The manifest check confirms structure, not business correctness. Nothing was created, read or changed in Provia.

## 6. Policy conflicts

None assessed — no workflow or policy to compare. `decisions[]` carries the missing-input questions instead.
