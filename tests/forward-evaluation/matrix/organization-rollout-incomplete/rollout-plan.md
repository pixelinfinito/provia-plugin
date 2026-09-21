# Cross-department rollout: ownership, access, training and adoption plan

Generated 2026-09-21 by `provia-organization-rollout` (provia-skills 1.2.0). Companion files: `provia-project.json` (the design as data), `project.html` (map, Acesso tab), `setup.md` (handover generated from the manifest).

## 1. What this plan rests on

**Confirmed fact (the only one).** The request: "Design group ownership and training for a cross-department rollout. Some required context is unavailable." Recorded as source `pedido-2026-09-21`.

**Not supplied.** Organization name, departments, org chart, administrators, process owner, the pilot process and its procedure, existing workflows, pilot results, existing permissions, rollout constraints, country, language, tenant plan.

**Assumptions used to keep working (each is also a decision in the manifest).**

| Assumption | Why | Decision |
| --- | --- | --- |
| Angola, Africa/Luanda, AOA as provisional context | Plugin convention when no country is supplied; nothing legal is derived from it | D6 |
| English display names for groups | The request is in English; names must be unique in the tenant, so they are confirmed before creation | D6 |
| Two departments, "A" (pilot) and "B" (second wave) | "Cross-department" needs at least two; "rollout" implies pilot then expansion | D2 |
| Disconnected mode | The host lists the Provia implementer server but permission to call `org_get_context` was not granted; nothing was read from a tenant | D9 |

No emails, IDs, thresholds or tenant facts were invented. Every group below is a placeholder flagged `unnamed`.

## 2. Four kinds of authority, kept apart

| Authority | Who (manifest key) | What it may do | What it must not do |
| --- | --- | --- | --- |
| Organization administration | `administradores_provia` (role) | Invite users, maintain groups and memberships, hold `admin` on workflows to grant/revoke access, archive | Own a process; decide inside a workflow where it holds `admin` (access rule 6) |
| Group administration | The lead of each department container (`departamento_a`, `departamento_b`) once named | Keep the membership of their own executing team current | Change another department's group or workflow access |
| Process ownership | `dono_processo_piloto` (role) | Answer design decisions, hold `edit` on the pilot workflow (which includes publishing a version), sign off pilot results | Execute or approve the cases of their own workflow unless the source says so |
| Action responsibility | `equipa_a`, later `equipa_b` (teams) | Execute Standard, Form Fill and Decision actions assigned to the group; see the cases that carry their actions without any grant | Hold `view` on the workflow unless the source says the team follows every case |

Permissions above are proposed, not granted. Nothing was created or changed in Provia.

## 3. Groups design (data in `provia-project.json › groups[]`)

| Key | Name | Kind | Parent | Flags | Owns actions today |
| --- | --- | --- | --- | --- | --- |
| `administradores_provia` | Provia administrators | role | — | unnamed, single_person | none (by design) |
| `dono_processo_piloto` | Process owner – pilot process | role | — | unnamed, single_person | none (by design) |
| `departamento_a` | Department A (pilot – to be named) | container | — | unnamed | n/a (container) |
| `equipa_a` | Department A – executing team | team | `departamento_a` | unnamed, segregation | none: no workflow exists yet |
| `departamento_b` | Department B (second wave – to be named) | container | — | unnamed | n/a (container) |
| `equipa_b` | Department B – executing team | team | `departamento_b` | unnamed | none: no workflow exists yet |
| `apoio_rollout` | Provia rollout support (champions) | team | — | unnamed | none (by design) |

Members are listed by role only; `verified: false` everywhere because no source carries an email and `users_search` was not available. The requester is not a group: when the pilot workflow is designed, its first action uses `assigneeRef: creator`. External parties (suppliers, auditors) get no group; they are modelled as forms or evidence if the pilot process needs them.

**Segregation.** `equipa_a` carries a `segregation` flag rather than a second group, because the sources do not say whether the same team raises and approves. If D5 answers "yes", add a separate approver group (for example `aprovadores_a`) before the workflow designer assigns a Decision action; do not let one team hold both.

## 4. Access matrix across the project

`workflows[]` is empty, so the Acesso tab of `project.html` has no rows and `--check` reports "access declared on 0/0". The policy the pilot workflow must follow when it is designed:

| Grantee | Level | Condition | Why |
| --- | --- | --- | --- |
| `organization` | `create_incident` | only if any employee may open a case of the pilot process | Openers need this; `view` would expose every case |
| `group:departamento_a` (or the real opener group) | `create_incident` | if the source restricts openers to the pilot department | Narrower than organization; add a manual-trigger allowlist only if the source restricts starts further |
| `group:dono_processo_piloto` | `edit` | always | Owns the design and publishes versions |
| `group:administradores_provia` | `admin` | always | Grant/revoke/archive; must not also decide in the workflow |
| `group:equipa_a` | no grant | default | Assignees see their own cases; `view` only with a source-backed reason ("the team follows every case") |
| `group:equipa_b` | no grant | until Department B joins | Cross-area starts appear as a rule-7 info when they occur |

`sensitivity` is set from the source's own words when the procedure is supplied (`restricted` for disciplinary, payroll, whistleblowing or "confidencial"); on a restricted workflow `organization` never gets `view`-or-above, and any `create_incident` grant needs an `access.note` saying starters see every case.

## 5. Ownership coverage check

Run: `node scripts/build-project-map.mjs provia-project.json --check` (plugin root, 2026-09-21).

Result: 0 workflows, 7 groups; 5 warnings ("owns no action" on every non-container group), 0 errors, 0 readiness blocks, 26 pending items. The warnings are correct: there is no workflow to own. **Coverage cannot be computed until D3 supplies the pilot procedure and the workflow designer adds `workflows[]` with `assigneeRef` per action.** Ready means: every human action resolves to a group key, `creator` or a `field:` intent with a fallback; every `team` group owns at least one action; no `admin` holder decides.

## 6. Assignment approaches (explain, do not promise)

- **Group ownership (recommended default).** Assign each action to the team; any member takes it. Continuity survives absences. Portable in YAML through `assigneeRef`.
- **Per-case owner (`field:` intent).** A user field set by an earlier action or the intake form; needs a `role` group or `creator` as fallback. Portable as design data; the owner is set manually per case.
- **Assignment strategies** (round-robin, load-based) exist in the product but are **not carried by the pinned YAML contract**: configuration outside the package, listed in `setup.md`.
- **Named individuals.** Avoid as assignees; use a group even for a one-person actor (`single_person` flag) so the delegate can act.

## 7. Training: role-specific exercises

Each exercise runs on a training copy of the pilot workflow (draft or a sandbox tenant), produces a visible record, and ends with a check the champion can verify. Sessions of 45–60 minutes per role are a recommendation, not a measured figure.

| Role | Exercise | Done when |
| --- | --- | --- |
| Requester (any employee) | Start a case from the Start button, fill the intake, attach one file, find "my cases" | A case exists with the requester as creator and the first action activated |
| Executor (`equipa_a`) | Open an assigned action, read the five-part brief, complete it with the evidence the brief names (comment, file or Form Fill), reassign one action inside the group | Action completed with evidence; next action activated; reassignment visible in history |
| Decider (approver group or team lead) | Take a Decision: one "continue", one rejection with the mandatory comment, one "return to action" | Three outcomes recorded; the rejected case shows the comment; the returned action is active again |
| Process owner (`dono_processo_piloto`) | Read a completed case end to end; resolve one open decision in `project.html`; review a report of late actions (only if the plan provides reports, D8) | Written sign-off of the case; decision marked resolved; report read or "unavailable on this plan" recorded |
| Administrator (`administradores_provia`) | Add a user to `equipa_a`, review the workflow's access list, revoke a test grant, confirm a starter can see the Start button | Membership and access changes visible; named starter verification recorded in `access.startVerification` |
| Champion (`apoio_rollout`) | Run the executor exercise, then answer three scripted questions from a colleague; log each question | Question log exists for the pilot review |

Ask AI, if enabled, is read-only and is introduced only after the executor exercise. Do not train on AI-assigned actions before an agent profile exists.

## 8. Rollout milestones

| # | Milestone | Exit criterion | Blocked by |
| --- | --- | --- | --- |
| M0 | Context complete | D1–D7 resolved; org chart or directory export received; groups renamed with real names; emails verified from a declared source or `users_search` | Everything below |
| M1 | Pilot workflow designed and packaged | `workflows[]` has actions with `assigneeRef`, `access` declared, `--check` with 0 errors and ownership coverage 100 % for human actions; process owner approves in `project.html` | D3, D5 |
| M2 | Groups and access applied | Groups exist in the tenant (manual or `groups_apply_plan` after review); grants read back in `access.applied[]`; a named member of the starter group confirms the Start button | M1, D4, D9 |
| M3 | Training done | Every role in Department A completed its exercise; question log started | M2, D7 |
| M4 | Pilot in Department A | Recommended 4–6 weeks or at least 20 completed cases, whichever comes later; review evidence in section 9 | M3 |
| M5 | Pilot review | Written review of confusion, late work and missing evidence; change plan for the workflow if needed; go/no-go for Department B by the process owner | M4 |
| M6 | Expand to Department B | Department B's owner, team, access rows and training repeated; cross-area starts reviewed (rule 7) | M5, D2 |
| M7 | Steady state | Support moves from champions to the administrators; adoption reviews monthly | M6 |

Durations and case counts are recommendations to be set by the process owner.

## 9. Adoption measures (useful work, not logins)

Measured from completed incidents and the action history, monthly during the pilot and at M5:

| Measure | Source in Provia | Target (proposal) |
| --- | --- | --- |
| Cases completed in Provia vs cases handled outside it | Incident list + the department's own count | ≥ 80 % in Provia by end of M4 |
| Ownership coverage | Human actions with a resolving `assigneeRef` / all human actions | 100 % before M2; unassigned actions in live cases = 0 |
| Actions completed with the evidence the brief names | Action history, comments, files, Form Fill responses | ≥ 90 % |
| Late actions | Actions past `due` / all completed actions | Downward trend; each late action has a named cause in the review |
| Rejections with a comment | Decision outcomes | 100 % |
| Stalled cases (no activity for 5 workdays) | Incident list sorted by last activity | 0 without a comment explaining why |
| Reassignments inside a group | Action history | Reviewed, not targeted: high counts show wrong group membership |
| Support questions per week | Champion question log | Falling by week 3 of the pilot |

Reports and AI depend on plan and permissions (D8); where a report is unavailable, the measure is taken from an export or the incident list.

## 10. Support

First line: `apoio_rollout` (one champion per department plus the implementer) during M3–M5. Second line: `administradores_provia` for membership and access. Design questions go to `dono_processo_piloto` and are recorded as `decisions[]`. Public product navigation: https://docs.provia.ao/ (verify against the tenant's actual UI).

## 11. What was verified, what is pending, what the owner decides

- **Verified:** `provia-project.json` passes the manifest check with 0 errors (5 expected "owns no action" warnings); `project.html` and `setup.md` were generated from it. The check validates the manifest, not this Markdown.
- **Pending:** every group member and email; every workflow, action and access row; tenant read (D9); plan capabilities (D8).
- **Owner decisions:** D1–D9 in the manifest. D1 (process owner) and D3 (pilot procedure) gate everything else. The rollout is **not ready**; it has a structure that can be filled without redesign once those two are answered.
