I diagnosed the IT request process from the three records supplied and wrote the artefacts to the working directory: `diagnosis-report.md`, `provia-project.json`, `project.html`, and `setup.md`.

**Summary of the diagnosis:**

- **Attention now:** TI-31 has been sitting in "Diagnose the problem" since 2026-09-10 — roughly as long as TI-29's *entire* closed cycle (6 days) — with no assignee named in the export. That's the record to check first. TI-32 (2 days in "Classify the request") isn't unusual yet on this sample.
- **Important limitation:** the export states no timezone or observation time, so all elapsed-day figures are estimates, not confirmed facts — I flagged this rather than silently assuming "today" applied.
- **Performance comparison:** not possible yet — one closed record (TI-29, 6-day total cycle, no per-step breakdown) can't establish a baseline or separate active work from waiting time.
- **Proposed measurable change:** start recording entry time for the "Diagnose the problem" step for every request this month, and have the IT service desk supervisor review anything still in that step past a set threshold. Next month, compare average/maximum time-in-step against this baseline once it exists. Owner is assumed (IT service desk supervisor) since the export names no one — recorded as an open decision.
- Four open decisions (missing observation time/timezone, missing ownership, missing SLA, and the change's owner/baseline) were recorded in the new `provia-project.json` rather than guessed.

**Next step:** the biggest gap blocking a real performance comparison is a fuller export — all IT requests opened/closed in a defined period, with per-step timestamps and timezone. Once you have that, run:

```text
Use provia-process-improvement with this month's full IT request export (with per-step timestamps and timezone) as the "after" period against the baseline questions raised in provia-project.json (decisions D1–D4). Country: Angola; reply in English.
```