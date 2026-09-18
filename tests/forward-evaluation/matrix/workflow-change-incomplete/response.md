I've planned the change and written it to the working directory. Summary:

**Missing context**: no current workflow design, manifest, receipts, or open-incident evidence were supplied or found — that gap is exactly what the request flagged. Nothing here was invented to fill it; everything unresolved is recorded as an open decision instead.

**Deliverables written**:
- `provia-project.json` — a placeholder `target-workflow` (`status: change_planned`) with a proposed `extra-approval` Decision action and five open decisions (`D1`–`D5`: which live workflow, whether open-incident evidence can be inspected, who approves and where in the sequence, whether a new field is needed and must stay optional, effective date)
- `workflow-change-plan.md` — the semantic-comparison framework, the explicitly **pending** open-incident impact check, the draft/publish plan, test cases, recovery instructions (no one-click rollback; re-import creates new lineage, not restored history), and the effective-date note
- `project.html`, `setup.md` — generated and validated (`build-project-map.mjs --check`: 0 errors, 1 expected warning for the ownerless placeholder action)

Key point worth flagging: publishing a new version doesn't delete evidence on open incidents by itself — they keep running on their original version. The real way to lose evidence is procedural (force-restarting an open incident, or removing/renaming a field it depends on), which this plan explicitly warns against.

Next recommended skill: `provia-workflow-designer`, once `D1` is resolved (the real workflow export/YAML) and `D3` has an answer (approver group and insertion point) — it can turn this placeholder into an actual action design against the real sequence.

```text
Use provia-workflow-designer with provia-project.json in this directory. The workflow "target-workflow" (status: change_planned) has a placeholder Decision action "extra-approval" and open decisions D1–D5. Once the real live workflow export and the approver/position answers are available, replace the placeholder with the actual design and resolve D1 and D3. Country: Angola (provisional); reply in English.
```