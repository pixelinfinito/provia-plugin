All artefacts are in place and consistent with each other (manifest ↔ YAML ↔ validation ↔ setup handover ↔ map).

## Summary

Bootstrapped the Provia project for a single-workflow scope — **Expense reimbursement** — from the three-line checklist you gave me (Angola, English, disconnected mode since no `provia-implementer` server is present).

**Design decisions from the checklist:**
- **(a) Employee submits receipts** → modelled as the workflow's intake form (`expense-claim-intake`: amount, description, receipt files), not a workflow action, since it's data collected before the case exists.
- **(b) Manager approves** → a Decision action (`decide`), owned by a new `managers` group, with Approve/Reject outcomes (Reject added as the structurally necessary complement of a Decision gate, disclosed as an editorial completion, not sourced from the checklist).
- **(c) Finance pays within the month** → a Standard action (`pay`), owned by a new `finance` group, with proof-of-payment + a `payment_reference` field as evidence.

**What I did not invent**, per the honesty rules, and instead recorded as open decisions in the manifest:
- **D1** — no org chart, so which manager owns which employee's claim is unresolved.
- **D2** — no policy on limits (maximum amount, excluded categories, extra approver above a threshold).
- **D3** — no service level for manager approval turnaround.
- **D4** — "pays within the month" can't be expressed as Provia's fixed day/workday `due` offset; both actions ship with `due` unset.
- **D5** — a segregation-of-duties question: can Finance pay its own members' claims?
- **D6** — no correction/return path exists in the checklist; flagged how to add one if wanted.

**Files delivered** in this directory: `provia-project.json` (manifest with sources, groups, workflow, form and all six decisions), `project.html` (offline map — 0 structural warnings, 16 pending config items all traced to the gaps above), and `expense-reimbursement/` containing `workflow.yaml`, `validation.json` (structurally valid, `readyToPublish: false`), `editorial-review.md`, and `setup.md`.

Next useful step is **`provia-organization-rollout`**, since D1 (no org chart) and D5 (segregation) block finishing the groups design — everything else in the pilot is packaged and reviewable now. Copyable request:

```text
Use provia-organization-rollout with provia-project.json in this directory (workflow "expense-reimbursement"). Resolve the `managers` and `finance` groups: propose how to identify each employee's manager without an org chart (decision D1), and confirm the segregation question for Finance paying its own members' claims (decision D5). Country: Angola; reply in English.
```