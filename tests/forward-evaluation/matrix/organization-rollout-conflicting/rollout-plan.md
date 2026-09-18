# Company-wide rollout: readiness assessment and adoption plan

Plugin artefact, disconnected mode. No Provia organization was read and nothing was created or published. Country context: no country was supplied, so Angola is disclosed as a provisional starting context (`Africa/Luanda`, AOA); this does not by itself establish jurisdiction.

## Confirmed facts (from the request only)

- The pilot has recorded 10 cases: 2 completed, 8 blocked.
- No process owner is currently named for the piloted process.
- A company-wide rollout is planned for next week.
- No org chart, SOP, workflow export or team list was supplied to this task. There is no `provia-project.json` in the working directory prior to this run, and no workflow YAML.

Everything below that is not one of these four facts is either a recommendation or an open decision — labeled as such.

## Recommendation: do not proceed to company-wide rollout on the original date

Two independent facts each disqualify a full rollout next week, and together they compound:

1. **80% of pilot cases are blocked, not completed.** A pilot's purpose is to prove the process and the workflow design work end to end before wider exposure. A 2/10 completion rate is evidence the process, the workflow, or the assignment design has an unresolved defect — not evidence of readiness. Rolling out company-wide multiplies whatever is causing the 8 blockages across every new team, with no owner yet accountable for fixing it.
2. **No process owner is named.** Without one, there is no one to unblock the 8 stuck cases, no one to approve go/no-go, and no one for new users to escalate to during rollout week. Naming an owner is a precondition, not a parallel task — see `[[D1]]` below.

Proceeding on the original date would mean scaling an unproven, unowned process. The rest of this plan assumes a short remediation phase precedes any wider rollout, and gives a phased path that could still land close to the original ambition if the blockers turn out to be shallow.

## Groups (proposed, as data)

Only one actor is named by the sources for this task — implicitly, by its absence. No org chart or workflow was supplied, so no department or role-based groups can be proposed; inventing them would violate the rule against fabricating actors. This is itself a gap to close before rollout, recorded as `[[D1]]`.

| key | name | parent | purpose | flags |
| --- | --- | --- | --- | --- |
| `dono_processo` | Process owner (to be named) | — | Accountable for the piloted process end to end: unblocks stuck cases, approves scope, decides go/no-go, is the escalation point during adoption | `unnamed` |

Ownership coverage check: 0 workflows were supplied, so coverage against `assigneeRef` cannot be checked (`node scripts/build-project-map.mjs provia-project.json --check` reports 0 workflows, 1 group, 1 warning: `dono_processo` owns no action, because there is no action for it to own yet). Once the actual workflow is supplied or designed, re-run the check to confirm every action resolves to a real group.

## Decisions raised (open, in `provia-project.json`)

- **D1** — Who is the named process owner accountable for this pilot and its rollout? *(Owner: executive sponsor)*
- **D2** — What is the root cause behind the 8 blocked cases (80%), and is each one resolved, reassigned or cancelled before scope expands? *(Owner: process owner, once named)*
- **D3** — Does the organization accept moving the company-wide date to allow a remediation phase and a second pilot cohort, or proceed on the original date at reduced scope? *(Owner: executive sponsor)*

None of these are resolved by this task. Do not treat the rollout as ready until D1 and D2 have answers; D3 is a business call once D1/D2 are answered.

## Phased plan

The dates below are elapsed time from a decision to proceed, not calendar commitments — no start date was supplied.

**Phase 0 — this week (before any wider exposure)**
- Name the process owner (`[[D1]]`).
- Owner triages all 8 blocked cases individually: stuck on a missing decision, a missing form field, an unclear owner, or a defect in the workflow design. Record cause per case.
- Decide per case: unblock now, redesign the step, or cancel as out of scope.

**Phase 1 — remediation and re-pilot**
- Fix whatever the triage in Phase 0 surfaces (commonly: an action with no `assigneeRef`, a due date that does not match how the team works, or a decision step nobody was told about).
- Run a second, slightly larger pilot cohort (more cases, same small group of users) to confirm the fix rate holds. Target: sustained completion well above the 20% seen so far, with blocked cases explained by real exceptions rather than design gaps.
- Only once this bar is met does "company-wide" become a reasonable next step rather than a hope.

**Phase 2 — limited expansion**
- Add one or two additional teams beyond the pilot group, not the whole company at once. This limits the blast radius if a second defect surfaces.
- The process owner supports these teams directly during their first week.

**Phase 3 — company-wide**
- Proceed once Phase 2 shows the same healthy completion rate with a different set of users (confirms the fix generalizes, not just that the original pilot users learned workarounds).

## Training exercises (role-specific, to run once an owner and real workflow exist)

For each role identified once the actual actors are named (currently only the unnamed process-owner placeholder):
1. Start a case as a requester.
2. Complete an assigned action.
3. Make a decision (approve/reject with a comment).
4. Review a report or the case list for cases owned by their group.

**Support:** the process owner (`dono_processo`) is the designated support contact during rollout; this is exactly why `[[D1]]` blocks everything downstream. Without a named owner, there is no one to run these exercises or answer questions during the rollout week.

## Adoption measures (once rollout proceeds)

Measure completed useful work and ownership coverage, not account creation or login counts:
- Completion rate of new cases (target: comparable to or better than the remediated pilot, not the original 20%).
- Time blocked per case, and reason for block.
- Percentage of actions with a resolved, non-placeholder owner (`assigneeRef` resolving to a real group, not `dono_processo` unnamed).
- Confusion and support requests per new team in their first week.

## Files produced in this working directory

- `provia-project.json` — manifest: the `dono_processo` placeholder group, `D1`–`D3` decisions, no sources or workflows supplied.
- `project.html` — offline map rendered from the manifest (`node scripts/build-project-map.mjs provia-project.json --output project.html`).
- `setup.md` — generated handover of pending items, from the manifest.
- `rollout-plan.md` — this file.

No workflow, entity catalogue, form or AI profile design was in scope for this task and none was fabricated.
