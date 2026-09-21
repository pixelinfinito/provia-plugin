# Process performance comparison — August vs September

Skill: `provia-process-improvement` (provia-skills 1.2.0) · Mode: disconnected · Date: 2026-09-21
Country context: not supplied; Angola used as provisional context (timezone Africa/Luanda, workdays Monday–Friday). Nothing in this report depends on jurisdiction.

## 1. The question and the short answer

**Question asked:** prove that the new manager worsened performance.

**Answer:** the supplied figures cannot prove that, and I will not present them as if they do. Two period means with no case-level records, a threefold volume change and a stated rise in case complexity are consistent with at least four explanations, of which "the manager" is only one. Section 4 lists what would actually distinguish them. What the figures *do* show is in section 3.

## 2. Supplied evidence and coverage checks

| Item | August | September | Source |
| --- | --- | --- | --- |
| Completed requests | 10 | 30 | request text |
| Mean duration, completed cases | 2 days | 4 days | request text |
| Qualitative note | — | "cases are more complex" | request text |

Coverage checks the procedure requires, and their status:

| Check | Status |
| --- | --- |
| Full-month coverage | **Not confirmed.** Today is 2026-09-21. If the September figure is from the current month it covers at most 21 of 30 days; if it is from a previous year, the year was not stated. |
| Timezone / day boundary | Unknown. "Days" not stated as calendar or workdays. August 2026 has 21 workdays, September 22. |
| Duplicates | Cannot check without records. |
| Missing completion dates | Cannot check; the sample is "completed" cases only, so cases still open are excluded (see censoring, section 3). |
| Same workflow and version in both months | Unknown. If a workflow version changed with the manager, the periods are not comparable by design. |
| Manager start date | **Not supplied.** Without it no case can be attributed to "before" or "after". |
| Metric definition | Assumed: duration = case created → case completed, calendar days, mean over cases completed in the month. |

## 3. What the figures show (confirmed) and what they do not

Formulas: `total case-days = n × mean`; `throughput = n / period`; average WIP ≈ throughput × cycle time (Little's law, valid only for a stable period).

| Measure | August | September | Ratio |
| --- | --- | --- | --- |
| Completed cases (throughput) | 10 | 30 | ×3.0 |
| Mean cycle time | 2 d | 4 d | ×2.0 |
| Total case-days delivered | 20 | 120 | ×6.0 |
| Implied average WIP (Little's law) | ≈ 0.6–0.7 cases | ≈ 4 cases | ×6 |

Confirmed facts:

1. Throughput tripled. The process completed three times more requests in September.
2. Mean cycle time of completed cases doubled.
3. The user reports higher complexity in September; this is a stated observation, not a measured one.

What the figures do not show:

- **Individual performance.** Raw case duration is a property of the whole flow (requester, approvers, waiting, rework), not of one person. The procedure forbids inferring individual performance from it.
- **Active work vs waiting.** A mean of 4 days could be 4 hours of work and 3.8 days of queueing. With no action-level timestamps the split is unknown.
- **Distribution.** A mean over n = 10 is fragile: one 12-day case in August moves the mean from 2 to 3. Medians and the spread are needed.
- **Censoring.** "Completed in the month" excludes cases opened but not yet closed. If September's long cases are still open, the true September mean is *higher*; if August's slow cases closed in September, they inflate September and deflate August. The direction of the bias is unknown.
- **Statistical significance.** Without variances no test can be run; the difference may or may not exceed normal month-to-month variation.

## 4. Competing hypotheses

All four fit the supplied data equally well. None is supported or rejected yet.

| # | Hypothesis | Mechanism | Evidence that would support it | Evidence that would weaken it |
| --- | --- | --- | --- | --- |
| H1 | Volume → queueing | Demand tripled with unchanged capacity; cases wait longer at the same step | Waiting time per action rose while active time stayed flat; WIP rose from early September | Active time rose too; waiting concentrated at a step the manager changed |
| H2 | Complexity mix | September had more multi-step or multi-approver cases | Cycle time within each complexity tier is unchanged; only the mix shifted | Same-tier cases also slowed |
| H3 | Management change | New rules, approvals, reassignment or slower decisions after the manager started | A step change in duration at the manager's start date, at steps the manager owns or changed, controlling for tier and volume | No step change at that date; slowdown started earlier or at steps outside the manager's scope |
| H4 | Measurement artefact | Partial month, censoring, workflow version change, calendar vs workdays | Figures change materially when recomputed on full months with open cases included | Recomputed figures match |

H1 and H2 are the confounders the procedure requires discussing before attributing anything to a person; the request itself states both. H3 remains open, not disproved.

## 5. Proposed change: make the comparison possible

Only one change is proposed, and it is a measurement change, because no design change can be justified from the supplied data.

- **Change:** classify every request at intake into a complexity tier (proposed: simple / standard / complex, criteria to be agreed by the process owner) and report per-action *waiting* and *active* time separately, from the Provia case and action timestamps.
- **Process owner:** not named in the supplied material → open decision D1.
- **Expected mechanism:** it turns one blended mean into like-for-like comparisons (same tier, same workflow version, per step), which is the minimum to test H1–H3.
- **Follow-up measure:** for October, median and 85th-percentile cycle time by tier; waiting time by action; WIP at week end; the count of open cases carried over. Compare against August and September recomputed on the same definitions (section 6).
- **Confounders to hold constant:** volume per week, tier mix, workflow version, staffing changes other than the manager.
- **If the tiering requires a new intake field or a changed action:** that is a workflow design change and belongs to `provia-workflow-change`, with attention to cases already open.

## 6. Reproducible calculations to run once records are supplied

Needed: a case export with case id, workflow version, created at, completed at, complexity indicator (or fields that allow it), and the action history (action id, assignee group, activated at, completed at). Also the manager's start date and the list of steps or rules the manager changed.

1. Period: 2026-08-01 to 2026-09-30 inclusive, Africa/Luanda, both full months only.
2. Deduplicate by case id; report duplicates removed.
3. Cycle time per case = completed − created, in calendar days and in workdays (Provia workdays skip Saturday and Sunday, not public holidays).
4. Include open cases with age = today − created as a separate, censored group; report their count per month of creation.
5. Per action: waiting = activated − previous completion; active = completed − activated. Sum per case. Report both.
6. Stratify every figure by complexity tier and by workflow version; report n, median, mean, P85.
7. Split on the manager's start date and compare within tier and within step.
8. Report month-to-month variation for the preceding months if available, to judge whether ×2 is unusual.

## 7. Limitations

- No records were supplied; every number above is derived from two means and two counts.
- September coverage is unconfirmed (partial month or unstated year).
- The complexity increase is reported, not measured.
- The manager's start date, scope of authority and what changed are unknown.
- No check on duplicates, timezone or workflow versions could be performed.
- Provia report availability depends on role and plan; scheduled report delivery is not available in the pinned baseline, so the October measurement is a manual export.

## 8. Open decisions (recorded in `provia-project.json`)

- **D1** — Who is the process owner for this request workflow and for the October measurement? Owner: to be named by the requester.
- **D2** — Supply the case-level exports, the manager's start date and the list of changes introduced. Owner: requester.
- **D3** — Agree the complexity tier criteria before October intake. Owner: process owner (D1).

## 9. Verification statement

Verified: the arithmetic in section 3 (from the four supplied figures) and the calendar counts of workdays for August and September 2026. Run: `node scripts/build-project-map.mjs provia-project.json --check` on the manifest in this directory (see chat summary for its result). Not run and not claimable: any check on case records, duplicates, timezone, versions or significance — no records exist in this task.
