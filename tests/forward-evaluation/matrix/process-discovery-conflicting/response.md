## Summary

I chose **IT support** as the pilot, not Purchasing, even though Purchasing is faster (2 days vs. 5 days). Reason: a pilot without a named owner has no one to design with, resolve exceptions with, or hold accountable — Purchasing's ownership gap makes it not pilot-ready regardless of speed, while Ana's ownership of IT support gives the pilot a real counterpart. If Purchasing's ownership gets resolved later, it's worth reconsidering, since its shorter cycle would give faster feedback per iteration.

Only two chat statements were supplied (no volumes, frequency, or documents), so the comparison is provisional — I recorded the resulting open questions (who owns Purchasing, IT support volume/mix, whether "5 days" is average/median/worst-case, and the unconfirmed Angola/AOA default) as decisions in the manifest rather than guessing.

**Files written** to the working directory:
- `provia-project.json` — manifest with `sources[]`, `decisions[]` (D1–D4), and `project.title` set to the IT support pilot
- `project.html` — offline project map (validated with `build-project-map.mjs --check`, 0 warnings)
- `setup.md` — handover of the 4 open decisions
- `discovery-report.md` — shortlist, reasoning, scope, owner, and success measures

**Next step recommended:** `provia-workflow-designer`, once Ana confirms the first request type in scope (decision D2) — it can turn that scope into classified action steps and a workflow skeleton using this manifest.

```text
Use provia-workflow-designer with the manifest at provia-project.json (pilot: IT support, owner Ana, baseline 5-day cycle time). Model the intake-to-resolution flow for the request type Ana names as highest priority. Preserve decisions D1–D4 as open. Country: Angola (provisional, unconfirmed); reply in English.
```