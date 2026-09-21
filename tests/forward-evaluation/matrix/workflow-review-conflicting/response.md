## Verdict: not ready for publication

The file passes every file-level check; the process it encodes violates the supplied policy. Those are different questions, and only the first one was answered by "passes file checks".

**Assumptions** (the working directory was empty — no YAML, manifest or policy document was actually supplied): I reconstructed the workflow from the description as three actions — `request` and `order` both `executionMode: parallel` in positions 1–2, `approve` (manager decision) sequential in position 3. Intended owners: creator registers, a Department managers group decides, a Purchasing group orders. Angola is a provisional country context and affects nothing in the findings. All assumptions are recorded in `review-findings.md` §0 and the manifest.

**What I ran** (plugin scripts, on `workflow.yaml`):
- `validate-workflow.mjs` → `valid: true`, 0 errors/warnings, destination validation not run → `validation.json`
- `review-actions.mjs` → 3/3 briefs have all five parts, no leaks, all `due` set → `action-review.md`
- `build-project-map.mjs --check` → 0 errors, 0 warnings, 0 readiness blocks, 2 rule-4 infos (assigned groups see their own cases only); `--setup` and `--output` generated `setup.md` and `project.html`

**Findings, by priority**
- **F1 Blocker (policy):** consecutive parallel actions start together at case creation, so Purchasing can order before the manager decides. The control is present in the file but inoperative. The validator cannot detect this.
- **F2 Major:** "Reject"/"Return" fire after the irreversible step; nobody is instructed to cancel a placed order.
- **F3 Major:** every assignee is `creator`, so requester = approver = orderer as imported; groups must be created and assigned before publication.
- **F4 Major (editorial):** the ordering brief never tells Purchasing to verify approval or what to do if it's missing.
- **F5–F7 Minor:** decision exception names no threshold or authority; `view` for Purchasing unjustified by any source; deadlines unsourced.

**Proposed correction** (not applied to the reviewed file): `workflow.proposed.yaml` — all actions sequential, `request → approve → order`, ordering brief gated on "Approve" in the case history. It also validates and passes the gate. Adopt only after decision **D1** (confirm the sequence; any exception allowing earlier ordering?). Six decisions D1–D6 were appended to `provia-project.json` with owners.

**Still pending:** D1–D3 resolution, group creation and assignment, import preview, destination validation, and publication by an authorized person in Provia.

Next recommended step: `provia-workflow-change` — the design is already validated, so the re-sequencing should be planned as a change with impact on any open cases, rather than re-designed from scratch.

```text
Use provia-workflow-change with provia-project.json, workflow.yaml and workflow.proposed.yaml in this folder. Plan the change from the parallel request/order sequence to request -> approve -> order (finding F1), assess impact on open cases, record it in the manifest, and keep decisions D1–D6 open until the process owner answers. Reply in English.
```