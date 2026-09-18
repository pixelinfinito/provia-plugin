# Two-period process performance comparison — incomplete input

## Status: cannot be calculated

No comparable execution records, period boundaries, workflow/version scope or metric definitions were supplied, and the working directory contains no reports, exports or `provia-project.json` to read them from. Per the process-improvement rule for incomplete input, this calculation is labelled incomplete rather than estimated. Nothing below is a measured result.

## Assumptions stated (continuing without asking)

- **Country/jurisdiction:** none was supplied, so Angola is disclosed as the provisional starting context (Africa/Luanda, AOA), following plugin convention. This does not imply any workflow or legal claim.
- **Language:** the request was in English, so this report is in English.
- **Mode:** disconnected — no Provia organization was read, and nothing was created, changed or published.
- A minimal `provia-project.json` was created in this directory (schema `provia-project/v1`) with three open `decisions[]` entries (D1–D3) recording exactly what is missing. No workflow, entity type, group or source was invented to fill it.

## What is required before a comparison can be run (skill step 1)

| Needed | Currently supplied |
| --- | --- |
| Workflow key and version(s) in scope for both periods | Not supplied |
| Exact start/end timestamps and timezone for Period A and Period B | Not supplied |
| Raw case-level records: case id, activation timestamp, completion timestamp, and every status/queue transition with its timestamp | Not supplied |
| Definition of which statuses/transitions count as **waiting** (queued, pending approval, unassigned, etc.) vs. **active work** | Not supplied |
| Rule for excluding drafts, cancellations and duplicates from the denominator | Not supplied |
| The business question driving the comparison (e.g. is cycle time longer, is a specific step the bottleneck) | Not supplied |

Until these arrive, any number offered here would be invented, which the skill's honesty rules prohibit.

## Methodology that will be applied once records arrive

This defines the formulas and denominators in advance so the comparison is reproducible as soon as data is supplied — it does not compute anything yet.

- **Cycle time** (per case) = `completion_timestamp − activation_timestamp`, in the stated timezone. Denominator: completed cases only, matched by workflow version and period.
- **Waiting time** (per case) = sum of the durations the case spent in states classified as waiting (per D3) — e.g. queued before assignment, pending a decision, blocked on an external step.
- **Active work time** (per case) = `cycle time − waiting time`, i.e. time during which the case was actually being worked, not merely time logged by an individual. This is a case/process metric, not a measure of any one person's productivity, and will not be used to infer individual performance.
- **Period aggregates**: report median and a spread measure (e.g. interquartile range) for cycle time, waiting time and active work time separately for Period A and Period B — never a single blended "duration" figure, so waiting and active work are never mixed.
- **Exclusions**: cases without both an activation and a completion timestamp inside the period, cancelled/draft cases, and identified duplicates, all documented explicitly rather than silently dropped.
- **Confounders to check before attributing any difference to the process itself**: case volume change between periods, case-mix/complexity change, a workflow version or staffing change that coincides with the period boundary, and holidays/seasonality.

## Proposed change

No case-level records exist yet, so no specific bottleneck or root cause can be named, and no measurable change to the process itself can be proposed at this time — doing so would mean inferring a cause from evidence that was not supplied.

The one recommendation that **can** be made now: instrument or export the waiting-vs-active split (per D3) so this comparison becomes possible. This is itself a measurable step:

- **Owner:** process owner (name to be assigned — see D1/D3 in `provia-project.json`).
- **Mechanism:** capture timestamped status transitions (queued, assigned, in-progress, blocked, completed) for the workflow in scope, for both periods under comparison.
- **Follow-up measure:** once captured, re-run this comparison; success is having reproducible cycle time, waiting time and active work time for both periods with the denominators and exclusions above stated explicitly.

## Confirmed facts / recommendations / open decisions

- **Confirmed facts:** none — no records were supplied.
- **Recommendations:** capture and supply the six inputs listed above before a comparison is attempted; do not attribute any observed duration difference to individual performance once data does arrive, per the skill's own rule.
- **Open decisions:** D1 (scope and period boundaries), D2 (raw records and exclusion rules), D3 (waiting vs. active work definition) — all recorded in `provia-project.json`, owner "Process owner (unassigned)".

## Files produced

- `provia-project.json` — manifest with the three open decisions above.
- `report.md` — this report.
