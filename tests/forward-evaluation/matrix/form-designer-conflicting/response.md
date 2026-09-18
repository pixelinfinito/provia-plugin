This correctly excludes D2 (resolved) from open decisions and lists everything else accurately. All artefacts are in place.

## Summary

The request as stated can't be built: Provia forbids mapping *any* value from a multi-response Form Fill into incident metadata, and even if three single-response actions all wrote to one shared amount field, each submission would silently overwrite the previous one — two of the three quotations would be lost, with the "winner" decided by submission order rather than by comparison.

**Resolution applied** (documented in detail, with the conflict explanation and a stated alternative, in `forms.md`):
- Three single-response Form Fill actions (`cotacao_1/2/3`), one per supplier, each mapping only its own response into its own case field (`quote_1_amount`, `quote_2_amount`, `quote_3_amount`) — never into the shared field.
- A new Standard action, `selecionar_proposta`, where a person compares the three recorded quotations and manually sets `purchase_amount` (the incident amount field) and `selected_supplier`, with a mandatory comment naming the reason. This is the "review step" that gives the incident amount field exactly one deliberate, evidenced write.

Since the working directory was empty, I built a minimal "Purchase request" workflow to host this design (`workflow.yaml`, validated: `valid: true`, action-wording review: 8/8 complete), plus `provia-project.json`, `forms.md` (full field/access/validation/testing spec for the three quotation forms), `setup.md`, and `project.html`. Assumptions stated: no source SOP was supplied (D1, open), Angola/AOA/English are provisional defaults, and two purchasing-policy questions are left open (D3: should suppliers submit directly via an external link; D4: what happens if a supplier misses the 3-workday deadline).

Recommended next step: `provia-organization-rollout`, to design the Purchasing/Finance/managers groups referenced in `setupNotes` (every action currently uses the `creator` placeholder) — that's the main thing standing between this draft and a publishable workflow.

```text
Use provia-organization-rollout with provia-project.json in this directory. Design the groups for workflow "purchase-request": Purchasing (cotacao_1/2/3, selecionar_proposta, encomendar), department managers (decidir), and Finance (confirmar_cabimento), replacing the creator placeholder.
```