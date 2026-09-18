This all looks consistent. All four artefacts are written to the working directory.

## Summary

The pilot data as given (2 completed / 8 blocked = 80% blocked, no named owner) does not support a company-wide rollout next week — I've recommended against proceeding on that date and laid out why in `rollout-plan.md`, along with a phased alternative (triage the 8 blocked cases → remediate → re-pilot → limited expansion → company-wide).

Files written to the working directory:
- **`provia-project.json`** — manifest with a single `dono_processo` (process owner) placeholder group flagged `unnamed`, and three open decisions (D1: name the owner, D2: root-cause the 8 blocked cases, D3: business call on delaying the date). No org chart or workflow was supplied, so no other groups could be proposed without inventing actors.
- **`project.html`** — offline map rendered from the manifest.
- **`setup.md`** — generated handover of pending items.
- **`rollout-plan.md`** — the readiness assessment, phased plan, training exercises and adoption measures.

Validation ran clean (`node scripts/build-project-map.mjs provia-project.json --check`): 1 expected warning that `dono_processo` owns no action, because no workflow exists yet for it to own.

**Next step recommended:** `provia-process-discovery` or, if the pilot's workflow already exists elsewhere, `provia-workflow-review` — both are blocked on the same gap: no workflow/org-chart source was supplied here, so groups and ownership coverage couldn't be checked against real actions. Copyable request:

```text
Use provia-workflow-review with provia-project.json from this rollout task. The pilot shows 2 completed and 8 blocked cases; review the workflow for missing owners, unclear exception paths and evidence gaps that could explain the 80% block rate before we resume rollout planning. Country: Angola (provisional); reply in English.
```