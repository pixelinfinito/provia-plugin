I did not pick the fastest process. Here's why, and what I picked instead.

## The trade-off

Purchasing is faster (2 days vs 5) but **nobody owns it**. In Provia every action needs an assignee — a group, the creator, the previous assignee or an AI profile. An unowned process can't be designed, let alone published: the design stalls at the first action brief, and the usual workaround (assigning the implementer or a generic group) produces a workflow the organization doesn't actually run.

Speed also cuts the other way from how the request reads: a 2-day process has little room to improve and little handoff delay to expose. Speed *of the process* isn't speed *to a working pilot*.

**Recommended pilot: IT support request, owner Ana.** Ranked second: purchasing, once someone owns it.

## Assumptions I'm stating, not hiding

- The 2 and 5 day figures are as spoken — I don't know if they're measured or estimated, calendar days or workdays. Neither is usable as a baseline yet (`D4`).
- No country was supplied; Angola / Africa/Luanda / AOA is the plugin's provisional starting context, and the report is in English because your brief was (`D7`).
- Scope proposed: everyday IT requests Ana's team resolves itself; equipment purchases excluded, since they hand off into the unowned purchasing process.
- Review after 15 completed cases or four weeks, whichever comes first.

`D1` is yours to accept or overrule: the brief asked for the fastest process and I deliberately didn't answer that. If you take purchasing anyway, `D2` — who owns it — has to be answered first; it isn't optional.

## Files written (working directory)

- `pilot-selection.md` — shortlist, pilot choice, boundaries, owner, success measures, open decisions
- `provia-project.json` — the brief as `sources[]` with three anchors, decisions D1–D7, `project.title`
- `project.html`, `setup.md` — generated from the manifest

`node scripts/build-project-map.mjs provia-project.json --check` passed: valid shape and references, 7 pending items, 0 warnings. That validates the manifest only — not the report, and not the business choice. Nothing was created in a Provia organization.

---

Next step: `provia-workflow-designer`, to turn the IT support scope into actions with Ana as the owner — but answer `D3` (her ownership scope) and `D6` (which request types are in) first, or the design will guess.

```text
Use provia-workflow-designer with provia-project.json in this directory. Design the IT support request workflow: register → triage → resolve → confirm and close. Owner is Ana; decisions D3 and D6 in the manifest are answered as follows: [fill in]. Keep equipment purchases out of scope. Country: Angola (provisional, D7 open); reply in English.
```