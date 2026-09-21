# Rollout plan: company-wide Provia adoption after the pilot

Prepared 2026-09-21 by `provia-organization-rollout` (provia-skills 1.2.0). Companion files: `provia-project.json` (manifest), `project.html` (map; open the Groups, Decisions and Acesso tabs), `setup.md` (generated handover).

Context: country, jurisdiction, language and timezone were not supplied. Angola / Africa/Luanda / AOA are a provisional starting context (decision D4). The Provia connector was present but not authorized in this session, so nothing was read from or written to a tenant; this plan is built from the request alone.

## 1. What the request says and what it does not

Confirmed facts (source `rollout-request-2026-09-21`):

| Fact | Section |
| --- | --- |
| A company-wide rollout is wanted next week (week of 2026-09-28). | 1 |
| The pilot has 2 completed cases and 8 blocked cases. | 2 |
| There is no named process owner. | 3 |

Not supplied, and therefore not in this plan: the pilot workflow (name, actions, assignees), the case export, the cause of each block, the org chart, department list, headcount, administrators, any SOP or policy, any email address.

## 2. Readiness verdict

The rollout is **not ready** to go company-wide next week. This is the plan's conclusion, not a refusal to prepare it; sections 3 to 9 prepare everything that can be prepared now, and section 10 lists what the sponsor must decide.

Why, against the expansion criteria this skill applies (review completed cases, confusion, late work and missing evidence before expanding):

1. **Ownership gap.** No process owner exists. Nobody is authorized to accept the design, decide on the 8 blocked cases, hold `edit` on the workflow or sign off a wave. The manifest carries an `unnamed` placeholder group (`process_owner`) and decision D1; until D1 is resolved the rollout has no accountable person.
2. **Evidence gap.** 2 of 10 pilot cases completed (20%); 8 are blocked. Two completed cases are not enough execution evidence to learn where confusion, late work or missing evidence occur, and a block rate of 80% means the workflow, the assignments or the training have a defect that would be copied to every department on day one.
3. **Unknown cause.** The request does not say *why* the 8 cases are blocked (missing assignee, waiting on a decision, a required field nobody can fill, a permission problem, or an external dependency). Each cause has a different fix; none can be applied without the export (D2).

What "company-wide next week" would mean in practice: the same block rate applied to a larger volume, a queue of stuck cases with no owner to decide on them, and support demand landing on nobody in particular. If the sponsor still wants the date, D3 records that as an accepted risk with a named owner; the wave structure below still applies, compressed.

## 3. Roles: four kinds of authority, kept apart

| Authority | What it actually needs | Who (proposed) | Written where |
| --- | --- | --- | --- |
| Organization administration | Provia organization Owner/Admin: members, billing, settings, sees every workflow by role. Not a workflow group. | Unknown (D6). Usually IT or the Provia implementer. | Provia organization settings; not in this manifest |
| Group administration | Maintains membership of the groups below. | Unknown (D6). Proposed: the same administrators, with changes requested by the process owner. | Provia Groups screen |
| Process ownership | Owns the workflow design (`edit` on the workflow), answers decisions, accepts each wave. One person plus a delegate. | Placeholder group `process_owner` (D1) | `groups[]`, later `workflows[].access` |
| Action responsibility | Executes or decides individual actions; sees only the cases that carry them. | `pilot_team` now; the departmental teams named in D5 per wave | `workflows[].actions[].assigneeRef` once the workflow is registered (D2) |

Nobody in this plan needs organization admin to do their process work. If "everyone should be an admin" comes up during the rollout: an assignee needs no grant at all to work their own cases; a process owner needs `edit`; only the person who grants, revokes, archives or deletes needs `admin`. `view` on a workflow shows every case of it, so it is not a convenience level.

Proposed permissions are described here; nothing has been granted.

## 4. Groups design (data in `provia-project.json → groups[]`)

| Key | Name (must be unique in the tenant) | Kind | Purpose | Members | Flags |
| --- | --- | --- | --- | --- | --- |
| `process_owner` | Process owner (pilot workflow) | role | Owns the pilot process; accepts design, decides blocked cases, signs off waves | Role only, no email | `unnamed`, `single_person` |
| `pilot_team` | Pilot team | team | Executed the 10 pilot cases; reference users for wave 1 | Role only, no email | `unnamed` |
| `rollout_support` | Provia rollout support | team | First-line support, blocked-case log, adoption measures | Role only, no email | `unnamed` |

Not created, by rule:

- **Requesters** (whoever starts a case): `assigneeRef: creator` on the first action, no group.
- **Organization administrators**: an organization role, not a group (D6).
- **Departments of the expansion waves**: not named in the source; they are added to `groups[]` as `team` entries (one per department, `area` set) when D5 supplies them. Do not create one "Company" group as an assignee: it would make every case everybody's and nobody's.

No email was supplied, so no member is `verified`; `--check` and `setup.md` list all three groups as unnamed. No `alias` or `external` situations can be detected without sources.

`--check` result on the manifest (run 2026-09-21): 0 errors, 3 warnings, all of the form "group owns no action". The warnings are correct: no workflow is registered yet (D2), so ownership coverage cannot be computed. They will clear when the pilot workflow's actions are added with `assigneeRef` values.

## 5. Ownership coverage check

Could not run. The check needs `workflows[].actions[].assigneeRef`; the request does not supply the workflow. When the export arrives (D2), the check is:

- every human action has an `assigneeRef` that resolves to a group key, `creator`, or a `field:` intent with an `assigneeFallback`;
- every `team` group owns at least one action;
- no group that would hold `admin` also decides in the same workflow;
- any pair "request and approve" or "prepare and validate" held by the same group becomes a `segregation` flag and a decision for the process owner.

Likely finding, to verify against the export: some of the 8 blocked cases sit on an action whose assignee is a specific person rather than a group, or on an action with no assignee at all. That is the most common cause of a block after a pilot with borrowed ownership, and the reason this plan prefers team ownership (section 7).

## 6. Access matrix (proposed; cannot be data until D2)

The matrix lives in `workflows[].access` and is reviewed in the Acesso tab of `project.html`. With zero workflows registered the tab is empty. Proposed shape for the pilot workflow, to be confirmed by the process owner (D7):

| Grantee | Level | Reason | Status |
| --- | --- | --- | --- |
| `organization` | `create_incident` | Any employee opens a case, if the process is company-wide as the request implies | proposed; needs a source statement |
| `group:process_owner` | `edit` | Owns the design and publishes versions | proposed |
| `group:pilot_team`, departmental teams | none | Assignees see their own cases without a grant | rule 4 default |
| `group:rollout_support` | none by default | Support works from the assignee's screen or the process owner's; a `view` grant would expose every case and needs a source-backed reason | proposed |

`admin` stays with the organization administrators (D6) and is not granted to a group that also decides in the workflow. Sensitivity is unknown; if the process handles disciplinary, payroll or whistleblowing matters it becomes `restricted` and `organization` can hold nothing at `view` or above.

If the intent is "everyone can view but only some departments start cases", that is a manual-trigger allowlist, which narrows starts below `create_incident` and is enforced by Provia (`TRIGGER_NOT_ALLOWED`, Owners included). It is not carried by a browser YAML import and needs a named verification step.

## 7. Assignment approach

Recommendation: assign every action to a **group**, never to a named person, so that ownership survives absences and departmental turnover during the waves. A one-person role (the process owner) is still modelled as a group with a delegate.

Available approaches and where they are configured:

| Approach | Portable in YAML | Where |
| --- | --- | --- |
| Group as default responsible for the action | yes (`defaultResponsibleType/Id` after import) | workflow draft |
| `creator` for the requester's own steps | yes | workflow draft |
| Owner taken from a case field (`field:<key>`) | design intent only; needs `assigneeFallback` | set manually per case |
| Assignment strategy within a group (round-robin, load, manual pick) | **no** (`assignmentStrategy` is not in the pinned contract) | Provia UI, configuration outside the package; listed in `setup.md` |

## 8. Rollout milestones

Dates assume decisions D1 and D2 are answered by 2026-09-24. Every gate is a review by the process owner with the support team; no gate is passed by calendar alone.

| Wave | When | Scope | Entry gate | Exit gate |
| --- | --- | --- | --- | --- |
| 0. Repair the pilot | 2026-09-22 to 2026-10-03 | Name the owner (D1). Get the export (D2). Triage the 8 blocked cases by cause; unblock or cancel each with a recorded reason. Register the workflow in the manifest, fix assignees, run `--check` to 0 errors. Create the three groups with real members. | D1 resolved | ≥ 8 of the 10 pilot cases closed (completed or cancelled with reason); 0 blocked cases older than 5 workdays; every action owned by a group; training exercises (section 9) passed by every pilot member |
| 1. First department | week of 2026-10-06 (2 weeks) | One department chosen by the process owner (D5): the one with the most pilot participants or the most cases per week | Wave 0 exit gate; department team in `groups[]` with verified emails; access matrix (D7) reviewed | ≥ 10 completed cases in the department; blocked share ≤ 20% of cases opened; every blocked case has a named next actor within 1 workday; support log reviewed with zero "don't know who owns this" entries |
| 2. Remaining departments | from week of 2026-10-20, in batches of 2 to 3 departments per week | Order fixed in D5 | Wave 1 exit gate; department teams created; one trained contact per department | Same measures as wave 1, per department |
| 3. Steady state | 4 weeks after the last batch | Support handed to the process owner and administrators; first process-improvement review | All departments live | Adoption review (section 10) presented to the sponsor |

If the sponsor overrides D3 and keeps the company-wide date (2026-09-28): waves 1 and 2 collapse into one, wave 0 still has to happen in the four working days before it, and the exit gate of wave 0 becomes the go/no-go on 2026-09-26. Whoever accepts that risk is named in D3.

## 9. Training: role-specific exercises

Each exercise is done in Provia by the trainee, on a training case that is clearly labelled and cancelled afterwards (or in a dedicated training workflow if administrators prefer). Support observes; the process owner signs the checklist. "Done" is the artefact in Provia, not attendance.

| Role | Exercise | Done when |
| --- | --- | --- |
| Requester (any employee) | Start a case, fill the intake, attach one file, find the case again in "my cases" | The case exists with the file and the requester can open it without help |
| Assignee (pilot / department team) | Take an assigned action, add the evidence the action asks for, complete it; then find a case that is due tomorrow | Action completed with evidence; the trainee names the due date without support |
| Decider | Open a Decision, choose an outcome including a rejection, write the mandatory comment, watch where the case goes | Rejection recorded with comment; trainee explains where the case went and why |
| Process owner | Review the workflow's open cases, identify one that is blocked, reassign it to a group, record the reason; read the case report (availability depends on plan and role) | A reassignment with reason exists; the owner has read one report or knows it is not available on this plan |
| Support | Reproduce a block from the pilot export, find who can act, unblock it, log it in the blocked-case log | The log entry names cause, actor and fix |
| Administrators | Create a group, add a member by email, grant `edit` to the process owner group on the workflow, revoke it again | Grants visible on the workflow; group membership matches `groups[]` |

Materials: one page per role, in the organization's language (D4), with exact Provia UI labels; the action descriptions themselves are the primary instruction and should be written as a five-part brief (task, method, evidence, done-when, exceptions) once the workflow is registered.

Support during the rollout: `rollout_support` is first line (named in D5), the process owner is second line for process questions, administrators for permissions and membership. Publish one channel and one response time (proposed: same workday).

## 10. Adoption measures

Measure useful completed work and ownership, not accounts created or logins. Reviewed weekly by the process owner and support during waves, monthly in steady state.

| Measure | Definition | Target at wave exit |
| --- | --- | --- |
| Completed cases | Cases closed as completed, per department per week | Wave 1: ≥ 10; then ≥ the department's stated weekly volume |
| Blocked share | Blocked cases ÷ cases opened, same period | ≤ 20% (pilot today: 80%) |
| Time to next actor | Workdays from a case becoming blocked to a named person or group acting on it | ≤ 1 workday |
| Ownership coverage | Actions with a resolved group assignee ÷ human actions (from `--check`) | 100% |
| Late actions | Actions completed after their due date ÷ completed actions | Baseline in wave 1, then falling |
| Evidence present | Completed actions whose required evidence (file, comment, form) is present | 100% of a sampled 10 cases per week |
| Support demand | Support log entries per 10 cases, by category (how-to, ownership, permission, defect) | Falling wave over wave; ownership category at 0 by wave 2 |

Reports and AI depend on plan, role and settings; scheduled report delivery is not implemented in this baseline, so the weekly numbers come from an export or from the case list until confirmed otherwise.

## 11. What is confirmed, recommended and unresolved

Confirmed: the three facts in section 1; the manifest passes `--check` with 0 errors and 3 expected warnings; `project.html` and `setup.md` were generated from it; nothing was read from or written to Provia.

Recommended: the staged rollout (section 8), group-based ownership (section 7), the proposed access shape (section 6), the exercises and measures (sections 9 and 10).

Unresolved (all in `decisions[]`, owners named): D1 process owner and delegate; D2 workflow and case export; D3 accept the staged plan or record the company-wide date as accepted risk; D4 country and language; D5 members, support contacts and wave order; D6 organization and group administrators; D7 access matrix. D1 gates everything else.

Not done, and why: the pilot workflow is not registered (no export supplied); ownership coverage and segregation review did not run (no actions to check); no group was created in Provia (disconnected session, no emails); no access was applied. When the connector is authorized and the emails arrive, `groups_apply_plan` can create the three groups from `groups[]` after the process owner reviews them in `project.html`.
