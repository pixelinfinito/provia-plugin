---
name: provia-workflow-change
description: Plan changes to a Provia workflow with attention to active incidents, data and dependencies.
---

# Workflow change planning

Read [country context](../../references/country-context.md) and [Provia capabilities](../../references/provia-capabilities.md) before making recommendations. Read the [Angola reference](../../references/countries/angola.md) when Angola applies. Country and response language are separate; respect an explicit user choice.

## Inputs

Current and proposed designs, active-incident evidence, affected fields/integrations and change reason. Use supplied documents and exports. This plugin has no Provia connection. Ask only for information that materially affects the task; identify assumptions and continue independent work.

## Procedure

1. Compare intended behavior, owners, decisions, fields, forms and integrations. Explain business effects instead of only listing YAML line changes.
2. Identify active incidents that depend on changed fields. Runtime actions are instantiated, but some validation still consults workflow-level metadata.
3. Plan a new draft and publication. Trigger forms publish independently; Form Fill definitions are frozen with workflow publication.
4. There is no general one-click rollback control. Describe how to create a new draft that reapplies a previous design and separately address active cases.
5. Test the changed and unchanged paths, re-link excluded dependencies and communicate effective dates. Do not claim a YAML re-import preserves version lineage.

## Deliverable

A semantic comparison, impact assessment, draft-version plan, test cases and recovery instructions. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Examples

- Queremos alterar os campos obrigatórios deste workflow, mas ainda existem pedidos em curso.
- Plan a new version with an extra approval without losing evidence from open cases.

## Incomplete or conflicting input

If active incidents cannot be inspected, identify that impact check as pending.

If the user expects re-import to restore history, explain that it creates a new draft lineage and propose a versioned recovery plan.
