There was nothing to repair: the working directory was empty (no YAML, ZIP or manifest), and the Provia connector call (`org_get_context`) was not permitted in this session, so the export could not be fetched from the tenant either. I did not write a `workflow.yaml`, because reconstructing an unknown approval process would be inventing it.

**What was done (disconnected mode, Angola/English used provisionally)**

- `provia-project.json` — minimal manifest with five open decisions (D1 supply the export, D2 confirm the approval chain, D3 group receipts, D4 authorize the connector or attach the file, D5 confirm country/language).
- `setup.md` and `project.html` — generated with `build-project-map.mjs`; `--check` reports 0 workflows, 5 pending items, 0 warnings.
- `repair-report.md` — what was received, what ran, and the repair boundary: §4.1 lists the semantics-preserving fixes an export typically needs (`provia.io` → `provia.ao`, `permissions:` → `access:`, string booleans, header maps, tenant-foreign ids → omitted assignee + handover, non-portable forms/tags/allowlists → `setup.md`); §4.2 lists what counts as changing the process (branch outcomes, targets, approver type, step order) and stays blocked until D2 is answered. §6 has the exact resume commands.
- `editorial-review.md` — records that the review gate was not run.

**Not delivered, and why:** `validation.json` and the `review-actions` report. The validator was invoked only with no file (usage message, exit 2); no report was simulated.

**Needs authorization:** the Provia connector (claude.ai connector settings) if you want the export pulled directly; otherwise drop the exported file into this directory as `workflow.yaml`.

Next step: rerun this same skill once the file is present — the repair itself is what remains.

```text
Use provia-workflow-package with provia-project.json and the attached workflow.yaml (the Provia export). Repair it without changing the approval process, following repair-report.md §4; resolve decisions D1–D5 from the attached notes. Country: Angola; reply in English.
```