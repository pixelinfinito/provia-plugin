## Result

The supplied figures cannot prove that the new manager worsened performance, and the report says so rather than manufacturing the conclusion. The request itself names two confounders — volume tripled (10 → 30) and cases got more complex — that fit the doubled mean at least as well as a management effect.

What the four numbers do establish:

| | August | September | Ratio |
|---|---|---|---|
| Completed cases | 10 | 30 | ×3 |
| Mean cycle time | 2 d | 4 d | ×2 |
| Case-days delivered | 20 | 120 | ×6 |
| Implied average WIP (Little's law) | ≈0.7 | ≈4 | ×6 |

Throughput tripled and the blended mean doubled. Nothing here separates waiting from active work, tiers by complexity, or marks the manager's start date, and the mean of 10 cases is fragile. Additional coverage problem: today is 2026-09-21, so "September" is either a partial month or an unstated year.

The report lays out four competing hypotheses (queueing from volume, complexity mix, management change, measurement artefact) with the evidence that would support or weaken each, and proposes one change: tier requests by complexity at intake and report per-action waiting vs active time, so October can be compared like for like. The manager hypothesis stays open — not disproved, not proved.

## Artefacts (working directory)

- `process-improvement-report.md` — findings, formulas, hypotheses, the proposed change, reproducible calculation steps for when records arrive, limitations.
- `provia-project.json` — new manifest (none existed) with the verbal summary as source and decisions D1–D3 (process owner, case-level exports + manager start date + list of changes, tier criteria).
- `project.html`, `setup.md` — rendered from the manifest.

Verified: `build-project-map.mjs --check` on the manifest passed with 0 errors/warnings and 3 pending items (the open decisions). Not verified and not claimable: anything about the underlying cases — no records were supplied. Assumptions: Angola as provisional country context; duration = created → completed in calendar days.

Recommended next step: `provia-process-improvement` again, once the case-level exports, the manager's start date and the list of changes exist — that is what the attribution question depends on.

```text
Use provia-process-improvement with provia-project.json and the attached case and action-history exports for full August and September 2026. Manager start date: <date>; changes introduced: <list>. Recompute cycle time by complexity tier and workflow version, split waiting from active time per action, include open cases as censored, and test hypotheses H1–H4 from process-improvement-report.md. Country: Angola; reply in English.
```