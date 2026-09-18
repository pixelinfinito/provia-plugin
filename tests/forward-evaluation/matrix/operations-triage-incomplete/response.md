## Summary

I can't answer which blocked actions are delaying incidents because no incident/action export, observation time, or `provia-project.json` manifest was supplied — the working directory is empty. Rather than invent records or owners, I wrote `triage-report.md` documenting exactly what's missing, why I'm not guessing (per the skill's honesty and incomplete-input rules), and one open decision (`D1`, owner: you) asking for the export and its observation time.

Next step: once you have the export, re-run `provia-operations-triage` with it (and the export's timestamp/timezone). Copyable request:

```text
Use provia-operations-triage with the attached incident/action export (statuses, ownership, due dates) and observation time [date/time, timezone]. Country: Angola; treat as disconnected mode. If a provia-project.json exists for this organization, include it too.
```