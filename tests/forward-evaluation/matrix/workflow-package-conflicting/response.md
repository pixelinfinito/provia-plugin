Package built in the working directory. Two parts of the request conflict with the `provia.ao/v1` contract, so I kept the contract shape and preserved what you asked for where the contract allows it:

**Contract boundary (not silently dropped)**
- **Portuguese property names**: the YAML keys (`metadata`, `fields`, `actions`, `assignee`, …) are fixed by the contract; a translated key fails import with `schema.unknown_key`. Everything the contract leaves free is Portuguese: workflow name, field labels, action names/descriptions, decision labels, and the local identifiers (`montante`, `centro_custo`, `registar_pedido`, `decidir_chefia`, `confirmar_financas`).
- **Embedded intake form**: forms and form triggers are not portable in YAML. The form definition lives in `form-pedido.json` and in `provia-project.json → forms[formulario-pedido]` (6 fields with mappings to the workflow fields); `setup.md` carries the create-and-link step. The YAML keeps a manual trigger so the workflow is usable before the form exists.

**Files**
- `workflow.yaml` — 3 actions: register (creator) → decision Aprovar/Devolver/Rejeitar (explicit outcomes, comment required on return/reject) → finance confirmation; `access: organization → create_incident`.
- `validation.json` — exact validator output: `valid: true`, backend schema passed, 0 errors/warnings, 2 `assignment_missing` setup items (manager and finance actions have no `assignee` because the groups don't exist yet — I did not substitute the creator as approver).
- `review-actions.json` / `.md` — 3/3 actions have all five brief parts, no leaked implementer notes, `due` unset on all three (intentional: no SLA was supplied).
- `provia-project.json`, `setup.md`, `project.html` — manifest check: 0 errors, 0 warnings, 2 infos (assigned groups get no `view`), 15 pending items.
- `editorial-review.md` — names, briefs, branches, and the contract-boundary table.

**Assumptions stated**: Angola / pt-AO / AOA as provisional context; "request" modelled as an expense request (`Pedido de despesa`, prefix `PED`); any employee may open a case. Open decisions D1–D4 (deadlines, self-approval/thresholds, route when finance finds no budget, whether the manual trigger stays after the form is linked) are in the manifest with owners.

Not done: Provia import preview, group creation, form creation, publication review — those remain destination steps.

Next step recommended: `provia-form-designer`, to turn the preserved form spec into a reviewed intake form with access and mapping rules before the groups and form are created in Provia.

```text
Use provia-form-designer with provia-project.json and form-pedido.json in this directory. Finalize the intake form «Formulário de pedido de despesa» for workflow pedido-despesa: confirm fields, required flags, access (who may submit) and mappings to montante, centro_custo, justificacao and data_necessidade. Resolve decision D4 on the manual trigger. Country: Angola (provisional); reply in pt-AO.
```