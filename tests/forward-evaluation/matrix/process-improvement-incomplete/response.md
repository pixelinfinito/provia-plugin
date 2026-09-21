The comparison could not be run: the working directory was empty — no exports, no period dates, no workflow scope, no manifest. I did not invent figures. What I delivered instead is the method, the reproducible calculation and the record of what is missing.

## What was verified

- `provia-project.json` (new, decisions D1–D5 only) passes `build-project-map.mjs --check`: 0 errors, 0 warnings, 5 pending items.
- `compare-periods.mjs` runs on Node 26 with no dependencies. Smoke-tested on a synthetic fixture that I then deleted; its output is not evidence about any process.
- `setup.md` and `project.html` were regenerated from the manifest.

## Not verified / not done

- No cycle-time, waiting or active-work figure was calculated for either period.
- No Provia report was opened. The host does expose the `provia-implementer` MCP server, but its tools read configuration, not incident execution records, so it could not fill the gap; I left it unqueried rather than pin an unconfirmed tenant into the manifest.

## Artefacts (all in the working directory)

| File | Content |
| --- | --- |
| `process-improvement-report.md` | Availability table, pre-comparison checks (coverage, timezone, duplicates, missing close dates, version comparability), metric definitions with formulas/denominators/exclusions, empty results table labelled incomplete, limitations, decisions |
| `compare-periods.mjs` | Reproducible calculation: close-date cohort per period; waiting = `started − activated`, active = `completed − started`, Wait-type actions always counted as waiting, `unclassified` when no start mark; median/p85 in calendar and Mon–Fri workday hours; prints the data checks first and refuses to call time "active" when `started_at` is absent |
| `records-template.csv` | The nine columns needed, one row per action instance; `--map` handles other column names |
| `provia-project.json`, `setup.md`, `project.html` | Manifest and generated handover/map |

## Assumptions stated

Angola / Africa/Luanda / Mon–Fri workdays as provisional context (D5); English reply as requested; the event that marks the start of active work in Provia is left as decision D3 because the plugin references do not define it and it is the single field that determines whether waiting and work can be separated at all.

## Proposed change

None to the process — with no cases, decisions or comments there is nothing to connect a bottleneck to, and attributing a duration change before controlling for volume and mix would be exactly what the skill prohibits. The one justified measurable step is to produce the two action-grain exports and agree the `started_at` event, owner to be named (D2), success = section 4 tables filled with clean data checks.

Recommended next step: rerun `provia-process-improvement` once the two exports exist. It is the same task, unblocked, and the manifest now carries the decisions and definitions so the rerun starts from them rather than from prose.

```text
Use provia-process-improvement with provia-project.json in this directory. Records for periods A (<dates>) and B (<dates>) of workflow <name>, version <v>, are in records.csv (columns per records-template.csv; started_at = <agreed event, decision D3>). Run compare-periods.mjs, resolve D1–D5, separate waiting from active work, and propose one change with an owner and a follow-up measure. Country: <confirm>; reply in English.
```

If the exports exist but the question is broader ("what is wrong with this process now?"), `provia-diagnose` combines this comparison with an attention list of current incidents.