Done. The working directory had no procedure, manifest, workflow or policy, and the Provia connector call (`org_get_context`) was not permitted, so I worked in disconnected mode and labelled both deliverables **draft**, as the skill requires when the approved version is unknown.

## What I wrote (all in the working directory)

| File | What it is |
| --- | --- |
| `runbook.md` | Concise runbook structure — purpose/trigger, roles, five-part step blocks (Task/How/Evidence/Done when/Exceptions), exceptions, evidence, escalation, maintenance, proposed changes. Provia mechanics are filled in; every procedure-specific slot is marked `[FROM PROCEDURE]` / `[FROM WORKFLOW]` / `[FROM POLICY]`. Nothing was invented. |
| `memory-glossary.md` | Proposed Agent Memory glossary, pending administrator review. Part A: 18 Provia product terms confirmed from the plugin's references. Part B (organization terms): deliberately empty, with the categories to extract when the procedure arrives. Includes the memory-vs-incident boundary. |
| `provia-project.json` | New manifest (`provia-project/v1.1`, project `unnamed-procedure`), disconnected, one placeholder source, five open decisions with owners. |
| `setup.md`, `project.html` | Generated from the manifest. |
| `report.md` | What was supplied, assumptions, confirmed facts vs recommendations vs unresolved decisions, checks run. |

## Checks

- `build-project-map.mjs --check` on `provia-project.json`: 0 errors, 0 warnings, 5 pending items (the decisions). That validates structure only, and it does not cover the Markdown files.
- `review-actions.mjs` was not run — there is no workflow YAML to review.

## Assumptions and open decisions

- Angola / English / AOA / Africa/Luanda are provisional starting values (D5), not facts.
- D1 which document and version is the approved procedure · D2 which workflow version implements it · D3 organization-specific terms for the glossary · D4 update owner and memory reviewer.

Note on the environment: several MCP connectors in this session (Cloudflare, Figma, Notion, Slack, etc.) need authorization via your claude.ai connector settings before they can be used; none was needed for this task.

**Recommended next step:** rerun `provia-process-knowledge` once the procedure and its workflow reference are available — the drafts are ready to be filled, and no other skill adds value until the source exists.

```text
Use provia-process-knowledge with provia-project.json, runbook.md and memory-glossary.md in this directory. Here is the approved procedure (attached) and the workflow key/version that implements it. Fill the [FROM PROCEDURE] slots with five-part action briefs, write Part B of the glossary from the procedure's terms, resolve decisions D1–D5, and keep any pilot workarounds as exceptions to review. Country and language: confirm before relying on Angola / English.
```