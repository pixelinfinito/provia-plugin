# Operational triage — blocked actions delaying incidents

**Skill:** provia-operations-triage (provia-skills 1.2.0, contract revision `fed8efaf019a…`)
**Prepared:** 2026-09-21
**Mode:** disconnected (no tenant read; the Provia MCP call was not authorized in this session)
**Provisional context:** Angola, response language English, timezone Africa/Luanda (WAT, UTC+1) — assumed because none was supplied (decision D3)

## 1. Export period and observation time

**Not available.** The working directory contained no incident or action export, no observation timestamp, no `provia-project.json` and no workflow file when this triage started. This document is therefore a snapshot of what could be verified — which is that the inputs are missing — and not a description of live Provia state.

## 2. Confirmed facts

| # | Fact | Evidence |
| --- | --- | --- |
| F1 | No incident or action records were supplied. | Directory listing of the working directory on 2026-09-21: empty. |
| F2 | No observation time, timezone or export period was supplied. | Same. |
| F3 | No project manifest, workflow YAML or groups design was supplied, so no action owner can be named by group key. | Same; `provia-project.json` was created by this skill and holds only decisions. |
| F4 | The destination organization was not read. | `org_get_context` was called and the permission was not granted; no other Provia tool was used. The implementer server in any case exposes no incident-record tool (its tools cover entity types, groups, users, workflows, forms and tags), so live incidents could not have been read even with permission. |

## 3. Attention list

**Empty by necessity.** No blocked, overdue, unassigned or stalled action can be named, because there are no records to cite. Per the skill rules, without due dates and an export time this report does not claim which work is overdue, and it does not invent incident references, statuses or owners.

## 4. What “blocked” means in Provia, so the export can be read correctly

These definitions come from the plugin's product reference (`provia-capabilities.md`), not from your data. They are what the triage will apply once records exist:

- **Blocked (dependency):** sequential execution enforces predecessors. An action whose predecessor is not completed cannot start; the incident waits on the *predecessor's* assignee, not on the blocked action's assignee. The person who can act is the owner of the earliest incomplete predecessor.
- **Blocked (decision):** a Decision action with no recorded outcome holds every downstream action. Outcomes are continue, cancel, trigger another workflow or return to an action; a "return to" outcome re-opens earlier work, which looks like a stall in an export unless the history is read.
- **Blocked (sub-workflow):** a Sub-workflow action waits for the child incident; the parent's timeout and cancellation behaviour decide whether it releases on its own.
- **Waiting (by design):** Wait actions depend on time, metadata or a webhook. They are not blocked unless the condition they wait for is itself stuck (e.g. a webhook that never arrived).
- **Waiting (integration):** an HTTP Request action needs an allowed destination and configured secrets; a failed or unconfigured call surfaces as an action that never completes.
- **Unassigned:** an active action with no assignee, or an assignee who is not a member of the group the design expects.
- **Overdue:** an active action past its due date at the observation time. Due dates in workdays skip weekends, not public holidays, so a workday deadline that spans an Angolan holiday still counts the holiday.

## 5. Records needed to complete this triage

Supply one authorized export (CSV, XLSX or JSON) with, at minimum, the columns below, plus the export's observation time and timezone. A column template is in `triage-intake-template.csv`.

| Column | Why the triage needs it |
| --- | --- |
| `incident_ref`, `workflow_name` | To cite each finding by record reference and to match the manifest workflow key. |
| `action_ref`, `action_name`, `action_type` | To distinguish Standard/Decision/Wait/Sub-workflow/HTTP/Form Fill behaviour (section 4). |
| `action_status` | To separate pending, active, completed, cancelled. Use the exact product status labels from the export, not a translation. |
| `predecessor_action_refs` | To find the incomplete predecessor that actually holds the incident. |
| `assignee` (user or group) | To name who can act; matched to `groups[]` in the manifest when one exists. |
| `activated_at`, `due_at`, `completed_at` | To compute overdue and stalled durations at the observation time. |
| `last_activity_at`, `last_comment` | To tell a stall from a blocked wait and to point at the next record to inspect when history is thin. |
| `decision_outcome` (Decision actions) | To detect decisions taken but not propagated, and "return to" loops. |

Also useful, not required: the workflow YAML or `provia-project.json` (for owner group keys and designed due offsets), and any notification/HTTP failure log for the same period.

## 6. Recommendations

1. **Export the incidents in question** with the columns in section 5, note the export timestamp and timezone, and re-run this triage on that file. Ownership of this step: the process owner or Provia administrator (decision D1).
2. **Attach the project manifest or workflow YAML** if one exists, so findings can name owners by group key instead of free-text assignee names (decision D2).
3. **Confirm country, language and timezone** before findings are dated (decision D3). Overdue calculations change if the export timezone differs from Africa/Luanda.

No record was completed, no message was sent and nothing was changed in Provia.

## 7. Unresolved decisions

Recorded in `provia-project.json` → `decisions[]`:

- **D1** — Which export should the triage read? Owner: requester (process owner / Provia administrator). Open.
- **D2** — Which manifest, workflow and groups apply? Owner: requester (implementer). Open.
- **D3** — Confirm country, language and timezone (Angola / en / Africa/Luanda assumed). Owner: requester. Open.

## 8. Checks run

- `node scripts/build-project-map.mjs provia-project.json --check` — passed: 0 workflows, 0 groups, 3 pending items, 0 warnings. This validates the manifest shape only; it does not validate this report or any incident data.
- No other script applies without an export.

## References used

- `references/skill-conventions.md` (honesty rules, disconnected mode, manifest)
- `references/provia-capabilities.md` (action types, sequencing, waits, decisions, workday rule)
- `references/project-manifest.md` (decisions shape, checker command)
- `references/connected-mode.md` (tool list; no incident-record tool)
