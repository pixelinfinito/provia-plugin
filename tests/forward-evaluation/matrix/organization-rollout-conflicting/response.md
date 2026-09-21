Rollout prepared. Four files are in the working directory: `provia-project.json`, `project.html`, `setup.md`, `rollout-plan.md`.

## Verdict

**The rollout is not ready to go company-wide next week**, and the plan says so rather than pretending otherwise. Three reasons, from your own request:

1. **No process owner.** Nobody can accept the design, decide on the 8 blocked cases, hold `edit` on the workflow or sign off a wave. The manifest carries an `unnamed` placeholder group (`process_owner`) and decision **D1**, which gates everything else.
2. **2 completed / 8 blocked** is an 80% block rate. Expanding now copies the defect to every department on day one.
3. **The cause of the blocks is unknown.** Missing assignee, stuck decision, unfillable field, permission problem — each needs a different fix, and none can be applied without the case export (**D2**).

## What was prepared

- **Groups as data** (`groups[]`): `process_owner` (role, `unnamed` + `single_person`), `pilot_team` (team, `unnamed`), `rollout_support` (team, `unnamed`). No emails were supplied, so no member is verified. Requesters use `creator`; organization admins are a Provia role, not a group.
- **Roles separated**: organization admin, group admin, process ownership and action responsibility, with the authority each actually needs (nobody needs admin to work a case).
- **Access matrix**: proposed shape (`organization: create_incident`, `process_owner: edit`, assignees no grant) — recorded as decision **D7**, since it can't be written into `workflows[].access` until the workflow is registered.
- **Staged waves with gates**: wave 0 repairs the pilot (name owner, triage the 8 blocks, register workflow, fix assignees), wave 1 one department, wave 2 batches, steady state. Each gate is measured (≥ 8/10 pilot cases closed, blocked share ≤ 20%, next actor within 1 workday, 100% ownership coverage).
- **Role-specific exercises** (requester, assignee, decider, owner, support, admin) with a "done when" artefact, and **adoption measures** on completed work and ownership, not logins.
- If the sponsor keeps the 2026-09-28 date, **D3** records that as an accepted risk with a named owner; wave 0 still has to happen and becomes the go/no-go on 2026-09-26.

## What was verified and what wasn't

- `build-project-map.mjs --check` on the manifest: **0 errors, 3 warnings** ("group owns no action" — correct, no workflow is registered). `project.html` and `setup.md` were generated from it.
- The Provia connector was present but **not authorized in this session**, so nothing was read from or written to a tenant. Authorize it in your claude.ai connector settings if you want the tenant read and `groups_apply_plan` offered after review.
- Country/language/timezone were not supplied; Angola / Africa/Luanda / AOA are provisional (**D4**).
- Ownership coverage and segregation review **did not run** — no actions to check.

Seven open decisions (D1–D7) are in the manifest with owners; D1 (name the owner) comes first.

**Recommended next step:** `provia-operations-triage`, once the process owner is named and the pilot case export is available — the 8 blocked cases need a cause and a next actor before any wave can start.

```text
Use provia-operations-triage with the attached pilot case export (10 cases: 2 completed, 8 blocked) and provia-project.json from the rollout preparation. For each blocked case, identify the cause, the action it is stuck on and who can act now. Process owner: <name from decision D1>. Then update the manifest with the pilot workflow's actions and assignees so the ownership coverage check can run.
```