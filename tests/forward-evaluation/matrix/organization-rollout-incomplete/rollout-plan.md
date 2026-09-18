# Cross-department rollout: group ownership and training

Plugin artefact only. Nothing described here has been created in Provia; `organization.mode` is `disconnected`. See `provia-project.json`, `project.html` (offline map) and `setup.md` (handover) alongside this report.

## What is missing

No org chart, administrator list, process owner names, SOPs/workflows, department list, pilot results or country confirmation were supplied with this request. The design below is therefore a **starter ownership framework**, not a finished group design: it covers the authorities every Provia rollout needs regardless of process, and flags every actor as `unnamed` until the organization names them. No email, ID, threshold or department name has been invented. Country, language, currency and timezone are set to the plugin's provisional default (Angola / en / AOA / Africa-Luanda per [country context](../../../references/country-context.md)) and are themselves an open decision (D7).

Because no workflow was supplied, ownership coverage cannot be checked: no proposed group owns an action yet (`--check` reports this as a warning, not an error), and `process_owner_unassigned` cannot be assigned real work until a workflow with `assigneeRef` exists.

## Confirmed facts

None. No source documents, org chart or prior Provia configuration were provided.

## Proposed groups (as data in `provia-project.json` → `groups[]`)

| Key | Name | Purpose | Flag |
| --- | --- | --- | --- |
| `org_admin` | Provia Organization Administrator | Tenant licensing, integrations, org-wide settings — not process ownership | `unnamed` |
| `group_admin` | Group Administrator | Creates groups and maintains membership as departments join | `unnamed` |
| `rollout_steering` | Rollout Steering Group | Cross-department coordination: sequencing, shared decisions, pilot-to-next-department approval | `unnamed` |
| `process_owner_unassigned` | Process Owner (department to confirm) | Placeholder for the pilot department's accountable owner | `unnamed` |

Organization administration, group administration, process ownership and action-level responsibility are kept as four distinct authorities on purpose, so that naming one role later does not collapse the others into it. These are proposed roles only; nothing has been granted in Provia.

Once departments and processes are named (decision D1), replace `process_owner_unassigned` with one flat group per department (for example `process_owner_<department>`) — Provia allows only one level of sub-groups, so department process-owner groups should not nest under `rollout_steering`, only reference it in their `purpose` text.

## Ownership coverage check

Not runnable. `workflows[]` is empty, so there are no actions to check `assigneeRef` coverage against, and every proposed group currently owns no action (four warnings from `--check`, expected at this stage). Re-run `node scripts/build-project-map.mjs provia-project.json --check` after a workflow is added.

## Open decisions (`decisions[]`, all status `open`)

- **D1** — Which departments/processes are in scope, and in what sequence after the pilot? Owner: rollout sponsor (unnamed).
- **D2** — Who is the Provia Organization Administrator? Owner: IT leadership (unnamed).
- **D3** — Who is the Group Administrator? Owner: Operations/HR leadership (unnamed).
- **D4** — Who is the executive sponsor, and who are the named process owners per department? Owner: executive sponsor (unnamed).
- **D5** — Which workflow(s), with actions and `assigneeRef`, will this rollout carry? Blocks ownership coverage.
- **D6** — Once actions exist, does any proposed group both request and approve (or prepare and validate) within the same process? Segregation cannot be assessed without workflow actions.
- **D7** — What country, language, currency and timezone actually apply? Angola/en/AOA/Africa-Luanda used here only as the plugin's provisional default.

If everyone ends up proposed as `org_admin`, or the same team is proposed to both request and approve, keep the groups separate and resolve it as a segregation decision rather than merging them — the authority needed by each role is different even when one person currently fills two.

## Training exercises (role-specific, to run once D1–D5 are resolved)

- **Organization Administrator** (`org_admin`): configure a group, verify a role/licence assignment, confirm the integration checklist for the next department joining.
- **Group Administrator** (`group_admin`): add and remove a member from a department group, verify the group correctly shows on the project map after a change.
- **Process Owner** (per department, once named): start a case, complete a standard action, make a decision (approve/reject with a comment), review a status report for their department's queue.
- **Requester / end user**: submit a request through the intake form, track its status, respond to a request for more information. (Uses `assigneeRef: creator`, not a group — no separate group needed for this role.)

Support during exercises: the Rollout Steering Group fields questions during the pilot; escalations that need a platform change go to `org_admin`/`group_admin` rather than being worked around locally.

## Rollout milestones

1. **Resolve blocking decisions** — D1–D5 answered; at minimum the pilot department, its process owner and its workflow are named.
2. **Configure pilot ownership** — create `org_admin`, `group_admin`, `rollout_steering` and the pilot department's process-owner group in Provia; replace `process_owner_unassigned` in the manifest.
3. **Run the pilot** — one department, real cases, role-specific exercises above completed by each actor.
4. **Review pilot evidence** — confusion points, late work, missing evidence pulled from completed incidents, not from account creation or login counts.
5. **Expand by wave** — add the next department's process-owner group per the sequence agreed in D1; `rollout_steering` approves each wave.

## Adoption measures (per department, after the pilot)

- Completed useful work: cases actually finished per action, not accounts created or logins.
- Ownership coverage: share of actions with a resolved `assigneeRef` (group, `creator`, or `ai:<profile>`), tracked via `--check`.
- Timeliness: actions completed within their `due` offset vs. overdue.
- Evidence completeness: actions missing required evidence at completion.
- Escalations to `org_admin`/`group_admin`: a high rate signals unclear ownership rather than a training gap.

Respect each department's actual plan/role availability for reports and AI profiles when setting these measures; none has been confirmed here.
