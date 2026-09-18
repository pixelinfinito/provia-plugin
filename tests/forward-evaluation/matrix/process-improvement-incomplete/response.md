Manifest validates cleanly. Both files are in place in the working directory.

## Summary

No records, period dates, workflow scope, or metric definitions were supplied — the directory was empty. Rather than invent numbers, I labelled the comparison as incomplete (per the skill's own rule) and produced:

- **`provia-project.json`** — a manifest recording three open decisions: workflow/period scope (D1), raw case records and exclusion rules (D2), and the waiting-vs-active-work definition (D3). Validated with `build-project-map.mjs --check`.
- **`report.md`** — states the assumptions made (Angola as provisional context, disconnected mode, English response), the exact inputs still missing, the formulas that will be used once data arrives (cycle time, waiting time, active work time — kept separate, never blended), confounders to check, and the one recommendation that can be made now: instrument the waiting-vs-active split so the comparison becomes possible later.

**Next step:** once the two periods' raw case records and status-transition data are available, re-run `provia-process-improvement` pointing at this `provia-project.json` — it will read the D1–D3 decisions instead of starting from prose. Example copyable request:

```text
Use provia-process-improvement with the provia-project.json in this directory. Records for [workflow] are now available for [Period A dates] and [Period B dates], including case activation/completion timestamps and status transitions. Resolve D1–D3 and compare cycle time, waiting time and active work time separately. Country: Angola; reply in English.
```