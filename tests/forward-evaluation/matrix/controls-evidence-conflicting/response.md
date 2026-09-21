## Review of the evidence

**Context:** Angola, AOA. Nothing was supplied beyond three statements — no policy document, workflow, manifest, template or P1 export — and the working directory was empty. The tenant read (`org_get_context`) and web verification of Angolan legislation were both denied in this session, so the review is limited to the supplied policy statement, and the manifest is in disconnected mode.

**Requirement sources, separated**

| Type | Content |
| --- | --- |
| Legislation | None verified. No legal provision is mapped. |
| Company policy | Two quotations above 500 000 AOA — the only requirement mapped. |
| Recommendation / template | Consultant template. Its Brazilian LGPD citation is a **jurisdiction mismatch** and is not adopted. |

**Findings**

1. **P1 gap (confirmed):** 600 000 AOA with one quotation where policy requires two. This is a missing-evidence finding, not proof the second quotation was never obtained — it may exist outside the case, or an exception may have been approved and not recorded. Owner: purchasing manager (D1).
2. **Policy text incomplete:** no version, effective date, above/from semantics, tax basis, or exception rule. 600 000 exceeds the threshold under any reading, so F1 stands regardless; the ambiguity matters for cases near the line. Owner: finance director (D2).
3. **Template cites Brazilian LGPD for an Angolan organization.** Language does not determine jurisdiction. What replaces it is not asserted: I could not verify the Angolan instrument against apd.ao, so the decision carries the source-record fields to fill in. Owner: legal/compliance (D3).
4. **No designed control yet:** without a workflow, the two-quotation rule has no named action, assignee or evidence definition. The matrix proposes `recolher-cotacoes`, `verificar-cotacoes` and (if D2 confirms an exception path) `decidir-excepcao-fonte-unica`, clearly marked as proposals — not written into `workflows[]`. Owner: purchasing manager (D4).

**Artefacts written to the working directory**

- `controls-evidence-review.md` — requirement/action/evidence matrix, findings, remediation with owners, source references
- `provia-project.json` — new manifest: 3 sources (policy, template, P1 record), 4 open decisions, no workflows
- `project.html`, `setup.md` — generated from the manifest

**Verified:** `build-project-map.mjs --check` → 0 errors, 0 warnings, 4 pending items (the decisions). That validates manifest shape only; it does not validate the report and is not a compliance statement. **Pending:** D1–D4; the policy document, template and P1 export are still needed to move from statements to cited sections.

Next recommended step: `provia-workflow-designer`, because the control has nowhere to live until the purchasing workflow exists as named actions with evidence — once D2 confirms the threshold semantics and exception rule.

```text
Use provia-workflow-designer with provia-project.json in this directory. Design the purchasing workflow so the two-quotation rule above 500000 AOA (source politica-compras#cotacoes) becomes named actions: recolher-cotacoes (Form Fill, multiple responses), verificar-cotacoes (Standard, brief explains the threshold to the assignee) and, if decision D2 confirms an exception path, decidir-excepcao-fonte-unica (Decision). Declare access and assignees by group key. Do not cite Brazilian LGPD (decision D3). Country: Angola; reply in English.
```