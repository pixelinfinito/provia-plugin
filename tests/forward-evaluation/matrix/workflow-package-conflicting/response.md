Two parts of the request conflict with the `provia.ao/v1` contract, so I adapted rather than forcing them:

- **Portuguese property names**: the YAML's top-level keys (`metadata`, `triggers`, `fields`, `actions`) and their sub-keys (`name`, `label`, `type`, `assignee`, `config`...) are fixed by the product schema — unknown/translated keys aren't extensions and would be rejected or silently dropped on import. I kept the keys in English and put all Portuguese where it actually belongs: workflow name, action names/descriptions, field labels.
- **Embedded intake form**: forms, form triggers and Form Fill links are explicitly excluded from portable workflow YAML. I modelled the request step as a `form_fill` action (`submeter_pedido`) and delivered the actual field spec separately in `intake-form-pedido-compra.md`, to be built and linked in Provia after import.

Delivered in the working directory:
- `workflow.yaml` — 3 actions (Submeter o pedido de compra → form_fill, Decidir sobre o pedido de compra → decision with Aprovar/Rejeitar, Confirmar a disponibilidade orçamental → standard), each with a complete five-part description
- `review-actions.json` — all 3 actions complete, no implementer-note leaks
- `validation.json` — `valid: true`, `readyToPublish: false` (form-link + 3 assignees still need resolving in Provia)
- `intake-form-pedido-compra.md` — the form specification kept out of the YAML
- `editorial-review.md`, `setup.md` — findings and unresolved owner/due/branch decisions (no manifest was supplied, so `setup.md` was written by hand)

Next step: **provia-form-designer** to turn `intake-form-pedido-compra.md` into a full Provia form design (access, mappings) bound to `submeter_pedido` — e.g. *"Desenha o formulário de admissão para submeter_pedido em workflow.yaml, usando os campos de intake-form-pedido-compra.md."*