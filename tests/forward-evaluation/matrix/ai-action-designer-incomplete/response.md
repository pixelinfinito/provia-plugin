All artefacts are in the working directory and the checks were re-run after the last edit.

## What was produced

| File | Content |
| --- | --- |
| `ai-profile-classify-it-requests.md` | The profile: objective, readable/writable field contract, provisional category and priority rules, behaviour on missing and contradictory evidence, review policy, profile-vs-memory split, 10 evaluation cases, prerequisites, paste-ready instructions |
| `workflow.yaml` | Container workflow `IT request` (prefix `ITR`): `classify` (Standard, AI-assigned, `aiWorker` with `reviewRequired: true`, `mode: safe`, threshold 0.7, no tools) → `review-classification` (Decision: Confirm / Correct / Not an IT request) → `fulfil` (placeholder). Five-part briefs on all three |
| `provia-project.json` | Manifest: `aiProfiles[]` entry `classify-it-requests`, `assigneeRef: ai:classify-it-requests` on the action, proposed group `service-desk`, access section, decisions D1–D9 |
| `validation.json`, `action-review.md`, `setup.md`, `project.html` | Actual script outputs |

## What was checked

- `validate-workflow.mjs`: `valid: true`, 0 errors/warnings; backend schema checks **not run** because the AI profile id is the placeholder `$AI_PROFILE_CLASSIFY_IT_REQUESTS` (I did not invent a UUID). An in-memory probe with a nil UUID passed the backend schema, so the rest of the file is sound.
- `review-actions.mjs`: 3/3 actions have all five parts, no leaked implementer notes, 3 without `due` (no service level was supplied).
- `build-project-map.mjs --check`: 0 errors, 0 warnings, 1 info (service desk has no view grant, deliberate pending D5), 20 setup items.
- Not checked: any Provia tenant. The `org_get_context` call was not permitted in this session, so the work is disconnected — plan, AI settings, existing groups and fields are unknown.

## Assumptions and open decisions

Since no procedure, taxonomy, team, fields or country were supplied, the design is provisional throughout: Angola/English as context (D9), a six-value category list (D1), a four-level priority scale (D2), a `service-desk` reviewer group with no members (D3), organisation-wide `create_incident` (D4), no shared-queue grant (D5), a placeholder fulfilment step (D6), no deadlines (D7), confidence 0.7 (D8). Each is a `decisions[]` entry with an owner. The plugin does not create the profile in Provia; `setup.md` says what the implementer must do by hand.

**Recommended next step**: `provia-workflow-designer`, once IT supplies its request procedure — the container workflow here exists only to host the profile, and D1/D2/D6 (real categories, priorities and the fulfilment process) can't be settled without it.

```text
Use provia-workflow-designer with provia-project.json and workflow.yaml in this folder and the IT request procedure attached. Keep the AI profile classify-it-requests on the classify action and the human review decision as designed; replace the provisional category and priority lists with the procedure's own (decisions D1, D2) and design the fulfilment actions that replace the placeholder (D6). Country: confirm (Angola was provisional); reply in English.
```