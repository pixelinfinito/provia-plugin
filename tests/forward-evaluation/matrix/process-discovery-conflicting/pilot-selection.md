# Pilot selection: purchasing or IT support

Date: 23 September 2026 · Manifest: `provia-project.json` · Mode: disconnected (nothing was read from or written to a Provia organization)

## What was supplied

One verbal brief, three sentences (`brief-2026-09-23` in the manifest):

- Purchasing takes 2 days; nobody will own it.
- IT support takes 5 days; Ana owns it.
- "Choose the fastest process for our pilot."

No procedure, case export, volume figure, baseline record or organization name was supplied. Everything below marked *estimate* or *open* comes from the trade-off in those sentences, not from evidence.

## Why "fastest" cannot decide this

The brief asks for the fastest process, but the two candidates differ on a criterion that outranks duration for a first Provia workflow: **only one of them has an owner.**

A Provia workflow assigns every action to someone — a group, the case creator, the previous assignee or an AI profile. An action with no owner cannot be designed, published or executed. "Nobody will own it" is therefore not a minor gap in the purchasing candidate; it blocks the design itself. A purchasing pilot would stall at the first action brief, and the usual substitute — assigning the implementer or a generic "everyone" group — produces a workflow the organization does not actually run.

Duration works the other way round from how the brief reads. A 2-day process has little room to improve and little handoff delay to make visible; a 5-day process has more of both. Speed of the *process* is not speed *to a working pilot*.

Two further cautions on the numbers themselves: it is not stated whether 2 and 5 days are measured or estimated, nor whether they are calendar days or workdays (`D4`). Provia's workday offsets skip Saturday and Sunday but not public holidays, so the distinction changes how any deadline is configured.

## Ranked shortlist

| Rank | Process | Owner | Stated duration | Implementation effort | Verdict |
| --- | --- | --- | --- | --- | --- |
| 1 | IT support | Ana (confirmed in the brief; surname and scope open, `D3`) | 5 days — source unverified (`D4`) | Designable now: a named owner exists for intake, resolution and closure | **Recommended pilot** |
| 2 | Purchasing | None — "nobody will own it" | 2 days — source unverified (`D4`) | Blocked: no assignee for any action; an approval step almost certainly needs an authority that has not been named (`D2`) | Second workflow, once `D2` is answered |

Confirmed facts: Ana owns IT support; nobody owns purchasing; the two stated durations as spoken. Everything else in the table is a recommendation or an open question.

## Recommended pilot: IT support request

**Why.** It is the only candidate with a named owner, which is the binding constraint for a first workflow. Its longer cycle time gives the pilot something to measure and improve rather than a 2-day process that is already short. The work is repeatable and employee-initiated, so cases will arrive on their own during the pilot without anyone manufacturing them.

**Start event (proposed).** An employee reports a problem or asks for something from IT, by whatever channel is in use today (`D5`).

**End condition (proposed).** The requester's problem is resolved or the request is refused with a reason recorded, and the case is closed by IT.

**In scope.** Everyday IT requests that Ana's team resolves itself.

**Out of scope for the pilot.** Requests that require buying equipment (they hand off to the unowned purchasing process and would import its blocker), and incidents affecting a whole site or system, which follow a different escalation path. Confirm in `D6`.

**Owner.** Ana — process owner and pilot owner. Confirm surname, email and whether she owns intake, resolution and closure or only part of it (`D3`). If she is both the only approver and the only resolver, that is a single point of failure worth designing around before publication, not after.

**Smallest useful scope.** One linear workflow: register the request → triage and classify → resolve → confirm with the requester and close. No integrations, no AI actions, no sub-workflows in the first version.

## Success measures

Baseline first, then compare. None of these can be reported today because no record was supplied.

| Measure | Baseline | How the pilot measures it |
| --- | --- | --- |
| Time from request to closure | 5 days, as stated — unverified, and unit unknown (`D4`) | Provia case duration, first to last action |
| Requests with a recorded resolution | Unknown | Share of closed cases carrying resolution evidence |
| Requests where the requester was told the outcome | Unknown | Share of cases with the confirmation action completed |
| Requests arriving through the workflow rather than direct messages to Ana | 0 by definition at the start | Case count against the channel volume from `D5` |

Before publication, record the current position for the first three from the last 10–20 requests, however they are held today. Without that, an improvement claim after the pilot has nothing to stand on.

## Review point

Review after **15 completed cases or four weeks, whichever comes first** — not on a fixed date. If the volume from `D5` turns out to be lower than roughly 4 requests per week, the pilot will not produce enough cases to learn from in four weeks; in that case widen the scope of `D6` or reconsider purchasing once `D2` is answered.

At the review: the four measures above, the actions where cases actually waited, and any request type that had to be handled outside the workflow.

## Open decisions

Recorded as `decisions[]` in `provia-project.json`, all open:

| Id | Question | Owner |
| --- | --- | --- |
| D1 | Accept IT support over the faster purchasing process, given that purchasing has no owner? | Pilot sponsor (unnamed) |
| D2 | Who owns purchasing end to end, and who approves a purchase? | Pilot sponsor (unnamed) |
| D3 | Ana's full name, email and the scope of her ownership | Ana |
| D4 | Are 2 and 5 days measured or estimated, calendar days or workdays? | Pilot sponsor (unnamed) |
| D5 | IT request volume per month and current intake channel | Ana |
| D6 | Which IT request types are in and out of the pilot | Ana |
| D7 | Country, jurisdiction, language and currency | Pilot sponsor (unnamed) |

`D1` is the one that gates everything else: it is the requester's call, not the implementer's. The brief asked for the fastest process and this recommendation deliberately does not give that answer, so it needs to be accepted or overruled explicitly. If it is overruled and purchasing is chosen anyway, `D2` has to be answered before any design work can start — an owner is not optional.

**Provisional context, not confirmed.** No country was supplied. The plugin's provisional starting context is Angola (Africa/Luanda, AOA, pt-AO terminology); this deliverable is in English because the brief was. Nothing here depends on a legal provision, so the design can proceed while `D7` is open — but any deadline, threshold or retention rule added later must wait for it.

## What was and was not done

- Written: `provia-project.json` (`sources[]` with the brief and its three sections, `decisions[]` D1–D7, `project.title` set to the proposed pilot), `project.html`, `setup.md`, this report.
- Run: `node scripts/build-project-map.mjs provia-project.json --check` — manifest shape and references valid, 7 pending items, 0 warnings. This checks the manifest only; it does not validate this Markdown report and it is not a business review.
- Not done: nothing was created, read or published in a Provia organization. No volumes, costs, savings or durations were invented beyond the two figures as spoken.
