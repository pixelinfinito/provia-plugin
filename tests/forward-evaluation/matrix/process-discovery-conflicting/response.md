## Pilot choice: IT support, owned by Ana

You asked for the fastest process. Purchasing has the shorter cycle (2 days vs 5), but nobody will own it, so I ranked ownership above cycle time rather than by speed alone. A pilot without an owner produces no decisions, no handled exceptions and no reviewed cases — it cannot be fast to a result. IT support has Ana, who can answer design questions and review the first closed cases. Purchasing stays a candidate for the second workflow the moment someone accepts ownership.

Two further reasons the speed argument is weaker than it looks: both durations are stated, not measured (how "5 days" was observed is unknown), and a 5-day process has more visible handoff delay for a pilot to expose than a 2-day one.

**Confirmed facts**: Purchasing 2 days, no owner; IT support 5 days, Ana owns it. Nothing else was supplied — no volumes, request types, start/end events, organization or country — and none was invented.

**Assumptions stated**: Angola / en / AOA / Africa-Luanda as the provisional country context (D7); proposed start and end events for both processes are readings to be confirmed, not facts.

**Pilot scope**: IT support request from report to confirmed resolution; one intake channel; the most frequent request types only; manual trigger, a few standard actions with due dates, one solved/not-solved decision, closing evidence required. No integrations, AI or sub-workflows. Review after 10 closed cases or 4 weeks. Success measures use an observed baseline; no target is set until one exists.

**Open decisions** (in the manifest): D1 sponsor accepts IT support over Purchasing; D2 start/end events (Ana); D3 what "5 days" means (Ana); D4 monthly volume and mix (Ana); D5 who else works IT support and covers Ana (Ana); D6 will management name a Purchasing owner; D7 confirm country context. The sponsor is not named in the sources.

**Files written** in the working directory:
- `pilot-selection.md` — ranked comparison, reasoning, pilot definition, open questions, design brief
- `provia-project.json` — manifest v1.1, key `it-support`, 2 sources, 7 decisions, no workflows yet
- `project.html` — offline map

**Verified**: `node scripts/build-project-map.mjs provia-project.json --check` → 0 workflows, 0 readiness blocks, 0 warnings, 7 pending items (the open decisions). This checks manifest shape and references only, not the Markdown report or business correctness.

**Not done**: the host offered the Provia `org_get_context` tool but permission was not granted, so no organization was read and nothing was created in Provia; the run stayed disconnected.

Next step recommended: `provia-workflow-designer`, once D2 and D5 are answered (Ana's start/end events and who else works IT support), so actions can be assigned to a group rather than to one person.

```text
Use provia-workflow-designer with provia-project.json in this directory. Design the IT support request workflow for the pilot defined in pilot-selection.md: owner Ana, scope report-to-confirmed-resolution, manual trigger, standard actions with due dates, one solved/not-solved decision, closing evidence required. Cite source chat-it-support. Treat decisions D2 and D5 as open unless answered; do not invent a team. Country: Angola (provisional, D7); reply in English.
```