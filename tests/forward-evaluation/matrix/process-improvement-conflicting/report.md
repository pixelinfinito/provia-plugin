# Process performance review — August vs September completed requests

Country/language context not stated; Angola is disclosed as a provisional default per plugin convention and does not materially affect this statistical review. Response in English, matching the request. Disconnected mode: this review works only from the figures supplied in chat; no Provia organization was read or changed.

## Supplied data

| Period | Completed requests | Mean cycle time |
| --- | --- | --- |
| August | 10 | 2 days |
| September | 30 | 4 days |

Plus one qualitative note: "cases are more complex" in September. No other figures, records, or definitions were supplied.

## What can actually be calculated

- Change in mean cycle time: 4 − 2 = **+2 days**, a 100% increase.
- Change in completed volume: 30 / 10 = **3.0×** throughput in the same-length reporting period (assumed; not confirmed as equal-length months).
- That is all that two bare means and two counts support. No median, no spread (p90, max), no per-case breakdown, and no distinction between active work time and waiting time (on the requester, an approver, or a third party) is available, so "cycle time" here is being used as a synonym for whatever "days to completion" meant in the source report — that definition itself was not confirmed (calendar days vs. workdays; from creation vs. from activation).

**Labelling this calculation as incomplete**, per the skill's own rule: a denominator/definition check cannot be done on two summary numbers.

## Step 1 — coverage and comparability (cannot be confirmed)

Not established from the data given:
- Whether August and September are equal-length, complete calendar months, or whether either period includes carry-over cases started earlier.
- Timezone and "day" definition (calendar vs. workdays).
- Whether any requests were duplicated, cancelled, or excluded from either count.
- Whether the workflow definition/version was the same in both months (a longer approval chain or an added step would inflate cycle time independent of any manager).
- Whether "the new manager" started exactly at the August/September boundary, or partway through either month.

These are open items, not assumptions I can resolve — see `decisions[]` in `provia-project.json` (D1).

## Step 2 — cycle time vs. active work vs. waiting

The supplied "mean days to completion" is a cycle-time figure (elapsed time), not a measure of the manager's active work time. No data separates:
- time the manager (or team) actively worked the case, from
- time the case waited on the requester, an approver, or an external party.

Without that split, a longer mean cycle time cannot be read as "the manager took longer to do the work" — it could equally be "requesters/approvers took longer to respond," which is unrelated to management performance. Per the skill's rule, **individual performance cannot be inferred from raw case duration** on this evidence.

## Step 3 — confounders (the reason this cannot be proven)

Two known confounders are present in the same data, and both independently predict a longer mean:

1. **Volume tripled** (10 → 30 completed requests). If capacity (people, review slots, approval bandwidth) did not also triple, queueing alone — more cases waiting for the same reviewer bandwidth — extends mean cycle time. This is a structural/queueing effect, not a competence effect.
2. **Case complexity increased** (stated directly in the request). More complex cases take longer to review and approve by definition, regardless of who manages the process.

Because volume and complexity both moved in the same direction as the manager change, and no case-level or complexity-tagged data exists to hold them constant, **the +2 day increase in mean cycle time is fully consistent with "more, harder cases" alone, with no change in managerial performance required to explain it.** The data as supplied cannot distinguish a manager effect from a volume/complexity effect — they are confounded, not separable with two aggregate means.

## Finding

**The supplied figures do not prove that the new manager worsened performance.** They show an association (longer mean cycle time in the month following a management change) that has at least two documented alternative explanations (3× volume, higher complexity) sufficient on their own to produce the observed change. Presenting this comparison as proof of manager-caused underperformance would misattribute a volume/complexity effect to an individual — this is exactly the confounding the review procedure requires flagging before attribution, and it should not be forwarded to the manager as evidenced fact.

If the underlying question is whether the new manager is performing worse, the two numbers given cannot answer it either way — the honest position is "not proven, and not disprovable from what exists," not "disproven."

## Proposed change and measurement plan

One change, to make this question answerable next time:

- **Change:** Tag each request with a complexity tier at intake (e.g., low/medium/high, defined by a fixed criterion such as number of approval steps or entity types touched), and report cycle time stratified by tier alongside a volume/capacity ratio (completed requests per available reviewer-day), instead of a single blended mean.
- **Owner:** process owner for this request workflow (name not supplied — record against `lisboa@pixel.ao` until reassigned; see `decisions[]` D2).
- **Expected mechanism:** stratifying by complexity removes the biggest known confounder, so a within-tier comparison (e.g., mean cycle time for "medium" cases in August vs. September) isolates whatever residual change is attributable to process/management factors rather than case mix.
- **Follow-up measure:** compare mean and median cycle time per complexity tier, plus completed-requests-per-reviewer-day, for two further monthly periods after the tag is introduced. Only a within-tier, capacity-adjusted gap that persists across those periods would support a management-performance conclusion.

## Limitations

- No raw case-level export was supplied — this review is a check on two aggregate numbers, not a case-level analysis.
- No confirmation of period comparability, timezone, "day" definition, or workflow-version stability across the two months.
- No active-work/waiting split; "cycle time" here is treated as elapsed calendar/workday time to completion as reported.
- No complexity metric exists yet to quantify "more complex," so the confounder is qualitative, not measured — it is cited because it was stated in the request, not derived here.

## Manifest

`provia-project.json` was created in this directory (none existed) recording this task's source and two open decisions (D1: raw export needed; D2: complexity metric needed for attribution). Validated with `build-project-map.mjs --check`: 2 pending item(s), 0 warnings, 0 workflows/groups/entity types/forms — nothing was created or changed in a Provia organization.
