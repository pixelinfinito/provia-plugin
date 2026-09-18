# IT request process — diagnosis report

Country: Angola. Timezone assumed for narrative only: Africa/Luanda (not confirmed by the export). Language: English.

## 0. What was supplied

- Three records, pasted in chat, no file, no workflow design or version attached:
  - **TI-31** — open, current step "Diagnose the problem", in that step since **2026-09-10**.
  - **TI-32** — open, current step "Classify the request", in that step since **2026-09-16**.
  - **TI-29** — closed **2026-09-12**, total cycle time **6 days** (start date not given directly; implied ~2026-09-06).
- No timezone and no observation time/date for the export are stated. No due dates, no SLA/target, no assignee, no priority, no request type, and no prior-period baseline are supplied.
- No `provia-project.json` existed in the working directory before this task; a minimal one was created (below) to record the open questions this diagnosis raises.
- This is a snapshot of three records, not a live read of Provia. Nothing here should be treated as monitoring.

## 1. Attention list (operations triage)

| Record | State | Since | Elapsed as of today (2026-09-18)* | Overdue? |
| --- | --- | --- | --- | --- |
| TI-31 | Diagnose the problem | 2026-09-10 | ~8 calendar days | Cannot be determined — no due date or SLA supplied |
| TI-32 | Classify the request | 2026-09-16 | ~2 calendar days | Cannot be determined — no due date or SLA supplied |
| TI-29 | Closed | — | closed 2026-09-12, 6-day cycle | n/a, closed |

\* The "today" used for elapsed-day arithmetic is this session's calendar date, **not** an observation time stated in the export. The export itself gives no timezone or observation timestamp, so treat the elapsed-day column as an illustrative estimate pending confirmation, not a confirmed fact.

Findings, in order of what needs a human look first:

1. **TI-31 has spent longer in a single step ("Diagnose the problem") than TI-29's entire closed cycle.** TI-29 went from open to closed in 6 days; TI-31 has been sitting in just its second step for roughly 8 days (on the unconfirmed "today" assumption above) with no indication it has moved. This is a *waiting/stalled* signal, not a confirmed breach — there is no SLA in the export to call it "overdue." It is the strongest candidate for someone to open and check today.
2. **TI-32 is early in "Classify the request"** (~2 days). On the same three-record sample this is not yet unusual — nothing to escalate today, but worth revisiting if it is still in that step next week.
3. **No assignee is stated for either open record.** The export names no owner for TI-31 or TI-32, so it is not possible to say who is responsible for the stall in finding #1, only that someone with visibility into the IT queue should check TI-31 directly.

No duplicate or conflicting records were found in the three rows supplied.

## 2. Performance findings (process improvement)

**What can be measured:** Only one closed record (TI-29, 6-day cycle) exists in this export. A single closed case is not a distribution — it cannot establish a baseline, a median, or a trend, and it is not a "comparable period" in the sense `provia-process-improvement` requires.

**What cannot be measured yet, and why:**
- **Cycle time vs. active work vs. waiting time** cannot be separated for TI-29: the export gives only a total (6 days), not a per-step breakdown, so it is unknown whether that time was spent working the request or waiting on someone.
- **Whether "Diagnose the problem" is a systemic bottleneck** is a hypothesis, not a finding. It rests on comparing one in-progress record (TI-31) against one closed record's *total* time (TI-29), across possibly different request types and complexity — a confounder that cannot be ruled out with three rows.
- **Month-over-month comparison** ("propose one change we can measure next month") requires a defined "this month" baseline. With one closed record, there is no reliable baseline rate (e.g., average cycle time, average time-in-step) to compare against next month's numbers — the comparison would be one new closed case against one old closed case, which is not statistically meaningful.

**Labeling per the incomplete-input rule:** the performance comparison is **not possible yet** on this data. What would make it possible: an export of all IT requests opened and/or closed in a defined period (e.g., all of August, or the last 30 days), with consistent timestamps, timezone, and — ideally — the time each request entered and left each step, not just the final total.

## 3. Proposed change to measure next month

Given the single strongest signal in the data (finding #1), the proposed change is:

> **Start measuring and capping time-in-step for "Diagnose the problem."**
> Mechanism: today, the export shows no visibility into how long a request has sat in this specific step until someone asks — which is how TI-31 could reach ~8 days unnoticed. Recording the entry timestamp of "Diagnose the problem" for every IT request this month, and having the IT service desk supervisor review any request still in that step after a set number of days, is expected to reduce the tail of long-running diagnoses.
> **Owner:** IT service desk supervisor (role assumed from context; the export names no one — see decision D2/D4 below).
> **Measure next month:** average and maximum time-in-step for "Diagnose the problem," computed from a full month's export with entry/exit timestamps per step, compared against this month once that same breakdown is available for September. Today's export cannot yet supply this month's baseline number because it only gives a *total* cycle time for the one closed case, not a per-step time.

This is a proposed change with an assumed owner, not a confirmed one — the manifest below records the decision as open.

## 4. Data limitations (explicit)

- No timezone or observation time for the export — elapsed-day figures above are estimates, not confirmed facts.
- No due dates or SLA — nothing in this report claims a record is "overdue," only "waiting" or "stalled" relative to the other two records.
- No per-step timestamps for TI-29 — only a total 6-day cycle time is known.
- Sample size of three records, one closed — insufficient to establish a baseline or detect a trend; any month-over-month comparison next month will need a fuller export of this month for a real "before."
- No assignee, request type, priority, or workflow/version reference — ownership and complexity confounders cannot be ruled out.

## 5. Manifest

A minimal `provia-project.json` was created in this directory (none existed) to carry the four open questions from this diagnosis forward: observation time/timezone (D1), ownership of TI-31/TI-32 (D2), missing SLA/target for time-in-step (D3), and the proposed change's owner and baseline (D4). `project.html` (map) and `setup.md` (handover) were generated from it with the plugin's bundled scripts; both are in this directory alongside this report.
