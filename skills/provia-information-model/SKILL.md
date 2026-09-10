---
name: provia-information-model
description: Design Provia entities, incident metadata, mappings and tags for a business process.
---

# Business information model

Read [country context](../../references/country-context.md) and [Provia capabilities](../../references/provia-capabilities.md) before making recommendations. Read the [Angola reference](../../references/countries/angola.md) when Angola applies. Country and response language are separate; respect an explicit user choice.

## Inputs

Business objects, sample records, reporting questions, forms and existing conventions. Use supplied documents and exports. This plugin has no Provia connection. Ask only for information that materially affects the task; identify assumptions and continue independent work.

## Procedure

1. Use entities for reusable records such as suppliers, assets or employees. Use incident metadata for facts about one execution.
2. Keep collection-only form answers on submissions unless routing, reporting or integration requires incident metadata.
3. Choose supported metadata types and stable ASCII snake_case field names. Localize labels and descriptions, never YAML keys or enums.
4. Specify field purpose, type, requirement, options, default, owner and sensitivity. Do not collect identity or financial details without a process need.
5. Separate controlled select values from flexible tags. Entity records/types and tags are setup dependencies, not definitions automatically created by workflow YAML.

## Deliverable

An entity model, field dictionary, mappings, tag taxonomy and data-minimization rationale. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Examples

- Como organizar fornecedores e pedidos de compra sem repetir os dados do fornecedor em cada pedido?
- Which fields belong to the supplier and which belong to a purchase request?

## Incomplete or conflicting input

If reporting needs are unknown, keep optional collection small and identify the unanswered reporting questions.

If a form collects personal information without a use, flag it and explain which fields can remain on the submission or be removed.
