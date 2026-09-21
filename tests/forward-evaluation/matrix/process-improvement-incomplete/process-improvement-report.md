# Period comparison — waiting time vs active work

Skill: `provia-process-improvement` (provia-skills 1.2.0). Date: 2026-09-21. Status: **incomplete — no execution records were supplied**.

## 0. What was and was not available

| Input the procedure needs | Supplied | Consequence |
| --- | --- | --- |
| Two comparable reporting periods (dates) | No | Periods are placeholders `A` and `B` until named. |
| Workflow and version scope | No | Cannot check that both periods ran the same design. |
| Raw incident/action records (export) | No | No calculation could run. The working directory was empty. |
| Metric definitions already in use by the organization | No | Definitions in section 3 are this report's proposal, to be confirmed. |
| Business question (which process, why now) | No | Findings cannot be prioritized; see decision D1. |
| `provia-project.json` | No | A new manifest was created with the open decisions only. |
| Country, language, timezone | No | Angola is used as the provisional context (Africa/Luanda, workdays Mon–Fri). Reply language: English, as requested. |

A connected `provia-implementer` server is exposed by the host (`org_get_context` is listed). It was **not** queried: its tools read configuration (entity types, groups, workflows, forms), not incident execution records, so it cannot supply the missing exports, and this task changes no configuration. If the tenant is confirmed, `org_get_context` can be run to pin `tenantId` and `productRevision` in the manifest.

Nothing in this report is a measured result. No figure was computed, no Provia report was opened, and no check was run against real data.

## 1. Confirmed facts

- The working directory contained no files at the start of this task.
- The script `compare-periods.mjs` in this directory was executed once on a throwaway synthetic fixture to confirm it runs and that its checks fire (duplicate rows, naive timestamps, missing `started_at`, version filter, unequal period lengths). The fixture was deleted; its numbers are not evidence about any process.
- Provia's workday model skips Saturday and Sunday only; public holidays are not skipped (product reference: `provia-capabilities.md`). Report availability is role/plan dependent; scheduled report delivery is not implemented in the pinned baseline, so the measurement plan below relies on manual exports.

## 2. Pre-comparison checks (procedure step 1)

Run before any number is compared. `compare-periods.mjs` performs the mechanical ones and prints them under "Data checks".

| Check | Why | How |
| --- | --- | --- |
| Time coverage | A period that starts before the export's first record, or ends after the last, is under-counted. | `createdCoverage` vs the period bounds. |
| Timezone | Day boundaries and weekend detection move with the zone; Provia stores UTC, people read Africa/Luanda (+01:00). Naive timestamps are ambiguous. | Timestamps must carry an offset; otherwise `--assume-tz` is a stated assumption and the count of naive stamps is printed. |
| Duplicates | Re-exports and joins duplicate action rows and inflate waiting/active sums. | `duplicateActionRows` (same incident, action id and activation time). |
| Missing completion dates | Open incidents must not enter cycle time; excluding them silently biases the period that has more open cases. | `incidentsWithoutCloseDate`, open cases reported as age at period end. |
| Comparable workflow versions | Actions added, removed or re-sequenced between versions change what "waiting at approval" means. | `workflowVersionsSeen`; restrict with `--version` or map action ids explicitly. |
| Equal period lengths and volume | 30 vs 31 days and a volume change alter both the cohort and the queue. | `periodLengthsEqual`, `createdInPeriod`. |

## 3. Metric definitions (procedure step 2)

All durations are per incident or per action instance, never per person.

| Metric | Formula | Denominator | Exclusions |
| --- | --- | --- | --- |
| Cycle time | `incident_closed_at − incident_created_at` | Incidents **closed inside the period** (close-date cohort) | Open incidents; cancelled incidents reported separately if the export marks them |
| Waiting (queue) | `action_started_at − action_activated_at` | Completed action instances of the cohort | — |
| Active work | `action_completed_at − action_started_at` | Completed action instances **with a `started_at`** | Wait-type actions (always waiting) |
| Systemic wait | Whole duration of `Wait` actions and of any action waiting on an external party | Same cohort | Never counted as active |
| Unclassified | `action_completed_at − action_activated_at` when `started_at` is absent | Actions without a start mark | Must not be read as work |
| Open age | `period_end − incident_created_at` | Incidents open at period end | — |

Reported as n, median and p85 (mean shown but not used for conclusions), in calendar hours and in workday hours (Mon–Fri, Africa/Luanda). Per-incident sums of waiting and active can exceed cycle time when actions run in parallel; the script flags those incidents and the per-action table is the reliable view in that case.

`action_started_at` is the field that separates waiting from work. Which Provia event stands for it (claim/assignment, first comment, first field edit, an explicit "start" step) is not documented in the plugin references and is not assumed here — decision D3.

## 4. Calculation status — incomplete

| Period | Dates | n completed | Cycle time median / p85 | Waiting median | Active median | Unclassified median |
| --- | --- | --- | --- | --- | --- | --- |
| A | not supplied | — | — | — | — | — |
| B | not supplied | — | — | — | — | — |

Reproduce once records exist, from this directory (terminal command):

```bash
node compare-periods.mjs records.csv --period "A=YYYY-MM-DD..YYYY-MM-DD" --period "B=YYYY-MM-DD..YYYY-MM-DD" --tz Africa/Luanda --json results.json
```

`records.csv` is one row per action instance with the columns of `records-template.csv`; use `--map` to rename columns from the actual export and `--version` to restrict to comparable workflow versions.

## 5. Bottlenecks, causes and the proposed change (procedure steps 3–4)

No bottleneck is identified: there are no underlying cases, decisions or comments to connect a finding to. Presenting a candidate cause now would be an invention, and the skill's honesty rules forbid attributing a change in duration to a person before volume and complexity are controlled for.

**No process change is proposed in this run.** The one measurable step that is justified today is to make the comparison possible:

- Change: produce the two period exports at action-instance grain with the nine fields in `records-template.csv`, and agree which event is `started_at`.
- Owner: process owner of the workflow in scope — not named (decision D2).
- Expected mechanism: separates queue time from work time so that a later change (owner, deadline, notification, parallelization) can be aimed at the segment that is actually long.
- Follow-up measure: the tables in section 4 filled for A and B, with the data checks clean (no duplicates, no naive timestamps, `activeWorkMeasurable: true`).
- Confounders to record with the data: volume per period, mix of request types or amount bands, workflow version, staffing changes, public holidays inside either period (not skipped by the workday model).

If the comparison later shows that a redesign is needed (new step, changed owner, changed due offset), hand it to `provia-workflow-change`.

## 6. Limitations

- Everything above is method. No value was measured.
- Column names and the meaning of `started_at` are assumptions to be mapped against the real export.
- Angola/Africa/Luanda is provisional; a different country changes the working-week assumption in the workday figures.
- The script treats an incident's version as the version on its rows; if a design was republished mid-case the export must say which version each action ran on.

## 7. Unresolved decisions (recorded in `provia-project.json`)

| Id | Question | Owner |
| --- | --- | --- |
| D1 | Which workflow, which two periods, and what business question motivates the comparison? | Requester |
| D2 | Who is the process owner accountable for the follow-up measure? | Requester / management |
| D3 | Which Provia event marks the start of active work on an action (`started_at`)? | Process owner with the Provia administrator |
| D4 | Are both periods on the same workflow version, or how do action ids map between versions? | Provia administrator |
| D5 | Confirm country, timezone and language (Angola, Africa/Luanda, English assumed). | Requester |

## Artefacts in this directory

- `process-improvement-report.md` — this report.
- `compare-periods.mjs` — reproducible calculation (Node 20.11+, no dependencies). Smoke-tested on a synthetic fixture only.
- `records-template.csv` — required columns.
- `provia-project.json` — manifest with decisions D1–D5; checked with `build-project-map.mjs --check`.
- `setup.md`, `project.html` — generated from the manifest.
