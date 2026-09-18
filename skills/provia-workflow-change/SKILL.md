---
name: provia-workflow-change
description: "Plan changes to a Provia workflow with attention to active incidents, data and dependencies, and record the change in the manifest. Use when the user asks for \"change the required fields while cases are open\", \"add an approval to the live workflow\", \"plan a new version\", \"can we roll back\", or says «alterar os campos obrigatórios com pedidos em curso», «acrescentar uma aprovação ao workflow», «planear uma nova versão», «podemos voltar atrás»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Workflow change planning

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Current and proposed designs, the manifest and receipts, active-incident evidence, affected fields/integrations and the change reason.

## References

- [metadata field rules](../../references/metadata-fields.md): when changing fields and assessing migration effects.
- [action writing](../../references/action-writing.md): for wording changes compared before and after.

## Procedure

1. Compare intended behaviour, owners, decisions, fields, forms and integrations. Explain business effects instead of only listing YAML line changes. Keep editorial corrections separate from changes to routing, assignments, forms, external operations or permissions.
2. Identify active incidents that depend on changed fields. Runtime actions are instantiated, but some validation still consults workflow-level metadata.
3. Plan a new draft and publication. Trigger forms publish independently; Form Fill definitions are frozen with workflow publication. In connected mode, start from `workflow_export_yaml` of the live version.
4. There is no general one-click rollback control. Describe how to create a new draft that reapplies a previous design and separately address active cases.
5. Test the changed and unchanged paths, re-link excluded dependencies and communicate effective dates. Do not claim a YAML re-import preserves version lineage.
6. Record the plan in the manifest: `status: change_planned` on the affected workflow, changed actions with `sourceRefs` to the change request, and `decisions[]` for what the owner must confirm.

## Deliverable

A semantic comparison, impact assessment, draft-version plan, test cases, recovery instructions and the manifest update. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: workflows, receipts. Appends: `status: change_planned`, changed actions, `decisions[]`. See [project manifest](../../references/project-manifest.md).

## Examples

- Queremos alterar os campos obrigatórios deste workflow, mas ainda existem pedidos em curso.
- Plan a new version with an extra approval without losing evidence from open cases.

## Incomplete or conflicting input

If active incidents cannot be inspected, identify that impact check as pending.

If the user expects re-import to restore history, explain that it creates a new draft lineage and propose a versioned recovery plan.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
