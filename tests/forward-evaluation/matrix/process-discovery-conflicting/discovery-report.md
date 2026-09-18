# Process discovery: pilot selection

Country of operation was not stated. Angola (Africa/Luanda, AOA) is used as a provisional default per the plugin's shared conventions — confirm or correct (decision D4).

## What was supplied

Two statements, given in chat, not as documents:

| Candidate | Stated cycle time | Stated owner |
| --- | --- | --- |
| Purchasing | 2 days | None named |
| IT support | 5 days | Ana |

No volumes, frequency, impact, evidence gaps or implementation effort were supplied for either process. The comparison below is therefore provisional and limited to the two dimensions given.

## Ranked shortlist

1. **IT support** — recommended pilot.
2. **Purchasing** — faster today, but not pilot-ready until an owner is named.

## Why speed alone does not decide this

Purchasing's 2-day cycle time is faster, but a pilot without a named owner has no one to configure the workflow with, assign exceptions to, review early cases with, or hold accountable for the measures below. Piloting an unowned process risks the workflow stalling on the first exception or approval question, with no one positioned to resolve it. IT support is slower, but Ana's ownership means there is a real counterpart to design with, run the pilot with and learn from.

This is a trade-off, not a default: if Purchasing's ownership gap is closed (decision D1) before the pilot starts, it should be reconsidered — its shorter cycle gives faster feedback per iteration once someone owns it.

## Chosen pilot: IT support

- **Owner:** Ana.
- **Observed baseline:** 5 days cycle time (as stated; period and statistic — average/median/worst case — not confirmed, see D3).
- **Scope (smallest useful slice):** start with a single, well-defined IT support request type rather than all support work at once. The specific type is Ana's call (decision D2) — pick the one with the clearest start/end and the most repetition, not the most varied or highest-severity one.
- **Start event:** a support request is logged/received.
- **End condition:** the request is resolved and confirmed closed with the requester.
- **Review point:** after roughly 15–20 completed cases, or four weeks, whichever comes first — enough to see repeat patterns without over-committing before the design is tested.

### Success measures

- Cycle time from log to confirmed resolution, compared against the 5-day baseline (once that baseline is confirmed per D3).
- Share of cases resolved without reassignment or missing information (a proxy for whether the intake captures what's needed).
- Number of cases still open past the review point, to catch exceptions the initial design didn't anticipate.

No monetary or headcount savings are estimated — none were supplied, and none should be invented.

## Open questions (recorded in `provia-project.json` → `decisions[]`)

- **D1** — Who owns Purchasing end to end? Until answered, Purchasing cannot be piloted regardless of its speed.
- **D2** — IT support volume/mix, and which request type the pilot should cover first. Owner: Ana.
- **D3** — Whether the 5-day figure is an average, median or worst case, and its observation period. Owner: Ana.
- **D4** — Organization name, sector and country were not supplied; Angola/AOA/Africa-Luanda used provisionally.

## Artefacts produced

- `provia-project.json` — manifest with `sources[]` (the two chat statements), `decisions[]` (D1–D4) and `project.title` set to the chosen pilot.
- `project.html` — offline project map (0 workflows/groups/entities so far; 4 pending items, all open decisions).
- `setup.md` — handover listing the same open decisions for whoever picks this up next.
