# Diagnosis: IT request process (TI)

Prepared 2026-09-21 by `provia-diagnose` (provia-skills 1.2.0), disconnected mode. Country: Angola. Nothing was read from or written to a Provia organization; this is an analysis of the three rows supplied in chat.

## 1. What was supplied

| Item | Supplied | Assumption used |
| --- | --- | --- |
| Records | TI-29, TI-31, TI-32 (3 rows) | — |
| Export period | Not stated | Rows span 2026-09-06 (earliest possible open date) to 2026-09-21 |
| Observation time | Not stated | 2026-09-21 (the date of the request); all ages below are computed to this date and are upper-bound estimates if the export is older |
| Timezone | Not stated | Africa/Luanda for display; dates treated as calendar dates |
| Workflow design / version | Not supplied; no `provia-project.json` in the working directory | Only the two state names in the export are known: 'Classify the request', 'Diagnose the problem' |
| Due dates, assignees, action timestamps | Not supplied | — |

Because the export has no observation time and no due dates, **no case is reported as overdue** (operations-triage rule). Cases are reported as *waiting since* a date, with the age computed under the assumption above.

The host listed a Provia MCP server, but the read call (`org_get_context`) was not permitted in this session, so the workflow definition could not be read from the tenant either.

## 2. Attention list (triage)

Ordered by age in the current state. Owners cannot be named: the export carries no assignee and no manifest defines groups (decision D3).

| Priority | Case | State | Since | Age (calendar / workdays, to 2026-09-21) | Classification | Who can act | Next step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **TI-31** | 'Diagnose the problem' | 2026-09-10 (Thu) | 11 cd / 7 wd | **Stalled** (not overdue: no due date in export). Age exceeds the whole cycle of the only closed case, TI-29 (6 days). | Assignee of the action in Provia (unknown here); escalate to the IT process owner (D1) | Open the case, read the last comment and the action's activity log: is the diagnosis waiting on the requester, on a vendor, or simply not started? Record the reason before moving it. |
| 2 | **TI-32** | 'Classify the request' | 2026-09-16 (Wed) | 5 cd / 3 wd | **Waiting at intake.** Classification is a triage gate; five days in it means nobody has yet taken the request. | Whoever holds 'Classify the request' (D3) | Classify today; if the group is unassigned or the assignee is absent, reassign. |
| — | TI-29 | Closed | Closed 2026-09-12 (Sat) | Cycle 6 days (as reported) | Reference case, no action needed | — | Use as the baseline for cycle time (section 3). |
| — | **TI-30** | Not in export | — | — | **Missing record.** The sequence TI-29, TI-31, TI-32 skips TI-30. | Person who produced the export (D4) | Confirm whether TI-30 was cancelled, filtered out, or sits in a state the export omits. |

Distinguishing overdue / blocked / waiting: with the supplied fields none of the three can be *proven* overdue or blocked. TI-31 is *stalled* (long age, cause unknown); TI-32 is *waiting* at intake. If the workflow has due offsets on these actions, the export must carry them for the next run.

Data-quality observations (facts from the export, not interpretations):

- TI-29 closed on a Saturday. If "6 days" is calendar days, it opened on Sunday 2026-09-06. Either weekend work occurs, or the export dates are in another timezone (e.g. UTC) or truncated (D6).
- "6 days" is not defined (calendar or workdays; open→close or first action→last action). Between 2026-09-06 and 2026-09-12 there are 5 workdays.

## 3. Performance findings

### 3.1 What can be calculated

| Measure | Formula | Value | Denominator / exclusions |
| --- | --- | --- | --- |
| Work in progress at observation | count(open cases) | 2 (TI-31, TI-32) | 3 rows; TI-30 unknown |
| Closed in window | count(closed cases, 2026-09-06..2026-09-21) | 1 (TI-29) | — |
| Cycle time, closed cases | close date − open date, as reported | 6 days (n = 1; unit not defined) | Only TI-29 |
| Age of open cases in current state | observation date − 'since' date | TI-31: 11 cd (7 wd); TI-32: 5 cd (3 wd) | Assumes observation on 2026-09-21 |
| Age in state vs. baseline cycle | age ÷ 6 days | TI-31: 1.8×; TI-32: 0.8× | Same units assumed |

Workday counts exclude Saturday and Sunday only, matching how Provia workday offsets behave; Angolan public holidays are not subtracted (none fall in the window anyway).

### 3.2 What cannot be calculated yet

- **Cycle time vs. waiting vs. active work**: needs action activation and completion timestamps per case. Not available.
- **Period comparison**: only one period (and one closed case) exists. The comparison is *not possible yet*; the export the customer must produce is listed in section 5.
- **Individual performance**: not inferable from case duration, and no assignee is present in any case.
- **Throughput trend, volume confounders**: three rows are not a sample.

### 3.3 Hypotheses (not supported yet)

- H1: The delay concentrates in early states. TI-32 has sat at 'Classify the request' for 3 workdays and TI-31 has been in 'Diagnose the problem' for 7 workdays; both are the first steps named in the export. Test: per-state time in the October export.
- H2: Without due dates on these actions, nothing in Provia signals age to the assignee or to a reviewer, so a request that is not picked up stays invisible until someone asks. Test: does the current workflow version carry `due` on these actions? (needs the design, D2).
- H3: TI-31 is waiting on the requester or a third party rather than on IT. Test: read the case comments and activity log.

## 4. The one change to measure next month

**Change**: time-bound the two intake actions and review what goes past the bound.

- Set a due offset of **1 workday from activation** on 'Classify the request' and **3 workdays from activation** on 'Diagnose the problem'. The offsets are proposals for the owner to adjust (D2); they are not a service-level rule from any source.
- The process owner (D1) reviews the overdue-action list **twice a week** (proposed Monday and Thursday) and records in the case why each overdue action is waiting.

**Mechanism**: the due date makes age visible to the assignee in their action list and to the owner in the overdue list; the twice-weekly review turns "stalled with unknown cause" (today's TI-31) into "waiting on X since Y", which is what next month's triage needs. It also forces the export to carry due dates, which removes the main gap in this diagnosis.

**Owner**: IT process owner — to be confirmed (D1).

**Measurement plan (October 2026 export, observation 2026-10-31, Africa/Luanda)**:

| Measure | Formula | Baseline from this export |
| --- | --- | --- |
| Median time in 'Classify the request' | median(completion − activation) over cases that left the state in October, in workdays | ≥ 3 wd (TI-32, still open; n = 1) |
| Median time in 'Diagnose the problem' | same | ≥ 7 wd (TI-31, still open; n = 1) |
| Share completed within due | count(completed ≤ due) ÷ count(completed), per action | Not measurable (no due dates) |
| Open cases older than due at observation | count(open actions with due < observation) | Not measurable |
| Cycle time of closed cases | median(close − open), workdays, with n | 6 days (n = 1, unit undefined) |

**Confounders to record alongside the numbers**: number of requests opened in October, request categories (once classified), staff absences in the IT team, and whether the workflow version changed mid-month (cases opened on the old version keep the old design; mixing versions in one median hides the effect).

**Why this change and not another**: it is the smallest change that (a) addresses both open items, (b) needs no new group, form or integration, and (c) produces its own measurement. A capacity change or a re-ordering of steps cannot be justified from three rows.

## 5. Connecting the parts

| Attention item | Symptom of the proposed change? | Needs another skill? |
| --- | --- | --- |
| TI-31 stalled 7 wd in 'Diagnose the problem' | Yes: an age bound plus a reviewed reason is exactly what is missing | `provia-workflow-change` to add the due offset to the live version, checking the two open cases first |
| TI-32 waiting 3 wd in 'Classify the request' | Yes | Same change |
| TI-30 missing | No: an export question | None; D4 |
| Weekend dates on TI-29 | No: a data question | None; D6 |
| Unknown assignees / groups | No: an ownership question | `provia-organization-rollout` if groups are undefined in Provia; otherwise D3 is answered from the tenant |

Adding `due` to actions changes the workflow design, so it goes through `provia-workflow-change` (new version; open cases TI-31 and TI-32 keep the current version's actions). No procedure text was supplied, so there is nothing for `provia-process-knowledge` to update yet.

## 6. Decisions recorded in `provia-project.json`

| Id | Question | Owner | Status |
| --- | --- | --- | --- |
| D1 | Who owns the IT request process | IT manager (to be confirmed) | open |
| D2 | Accept, adjust or reject the due offsets (1 wd classify, 3 wd diagnose) and the twice-weekly review | IT manager (to be confirmed) | open |
| D3 | Which groups hold 'Classify the request' and 'Diagnose the problem' | IT manager (to be confirmed) | open |
| D4 | What happened to TI-30 | Person who produced the export | open |
| D5 | Fields and date of next month's export | Person who produced the export | open |
| D6 | Timezone of the export dates | Person who produced the export | open |

## 7. Limits of the data and of this report

- Three rows, one closed case, one period. Every number above is descriptive; none is a trend.
- Ages assume the export was taken on 2026-09-21. If it is older, the ages are smaller.
- The workflow design was not supplied and could not be read from Provia in this session; the sequence Classify → Diagnose → … is inferred from the state names and is not confirmed.
- No due dates: nothing is reported as overdue.
- Angolan public holidays are not subtracted from workday counts (Provia's workday offsets skip weekends only).
- No case was opened, moved, commented or reassigned by this report.

## 8. Export to produce for the October run (D5)

One row per action instance, plus one per case, observed on 2026-10-31 with the observation date-time and timezone printed in the file:

- Case: id, workflow version, opened at, closed at (if closed), current action, requester group.
- Action: case id, action name, assignee group, activated at, completed at, due at, outcome, last comment date.

With that file the per-state medians, the share within due and the waiting/active split become reproducible.

## Checks run

- `node scripts/build-project-map.mjs provia-project.json --check`: 0 errors, 0 warnings, 6 pending items (the six open decisions). This validates the manifest, not this Markdown report.
- `--output project.html` and `--setup setup.md` regenerated from the same manifest.
