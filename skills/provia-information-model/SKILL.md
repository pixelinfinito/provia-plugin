---
name: provia-information-model
description: Design practical Provia entity catalogues with minimal business fields, usable descriptions, supported icons and clear placement of case data.
---

# Business information model

Read [country context](../../references/country-context.md) and [Provia capabilities](../../references/provia-capabilities.md) before making recommendations. Read the [Angola reference](../../references/countries/angola.md) when Angola applies. Country and response language are separate; respect an explicit user choice.

## Inputs

Pilot workflows, business objects, sample records, reporting questions, forms, existing catalogues and systems of record. Establish who enters and maintains the data and what is known at creation. Use supplied documents and exports. This plugin has no Provia connection. Ask only for information that materially affects the task; identify assumptions and continue independent work.

## Procedure

1. Read [practical entity design](../../references/entity-design.md). Justify each entity type by its identity, lifecycle and reuse in named processes. A conceptual business object does not automatically need a Provia entity. Prefer case metadata, form answers, documents, tags or the source system when these meet the need.
2. Map native record Name, UUID and system timestamps before adding custom fields. Do not generate universal identifier, provenance, URL, version or verification fields. Retain real business codes and source references only for a concrete use; explain who maintains them.
3. For every proposed type, provide a localized display name, a concise description ready to paste into Provia, a record Name pattern and an exact icon from [verified entity icons](../../references/entity-icons.json). Cite the snapshot revision and flag unverified destination differences. Do not invent icon identifiers or promise automatic controls in descriptions.
4. Classify fields as minimum, justified optional, deferred or kept elsewhere. For each retained field specify purpose and consuming process, supported type, stable ASCII snake_case key, localized label/help text, creation-time required boolean, options, example, default only when justified, maintainer and sensitivity. Separate creation requirements from later process readiness checks. Validate examples against their types and select values; never invent destination IDs.
5. Keep collection-only form answers on submissions unless routing, reporting or integration requires incident metadata. Separate controlled select values from flexible tags. Specify useful mappings and their direction; copied entity values are not continuous synchronization. Do not claim uniqueness, history, permissions or status-based blocking merely from custom fields.
6. Walk through creating one synthetic record per proposed type using what a user actually knows. Remove duplicate entry and unjustified lookups; report unresolved maintenance effort. For an existing catalogue, give a before/after field disposition and assess dependent records, forms, mappings and workflows before proposing removal. Entity definitions and tags require setup outside workflow YAML.

## Deliverable

A catalogue with a justification, paste-ready description, verified icon and record Name pattern for each proposed type; a prioritized field dictionary; useful mappings/tags; a disposition of removed or deferred proposals; and a manual-entry review with unresolved setup. Keep operational setup notes separate from descriptions. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Examples

- Como organizar fornecedores e pedidos de compra sem repetir os dados do fornecedor em cada pedido?
- Which fields belong to the supplier and which belong to a purchase request?

## Incomplete or conflicting input

If reporting needs are unknown, keep optional collection small and identify the unanswered reporting questions.

If a form collects personal information without a use, flag it and explain which fields can remain on the submission or be removed.

If a source catalogue has descriptions or icons, assess them rather than claiming they are missing. Treat organizational rules in the supplied catalogue as source claims until confirmed. If an integration or multi-company context is unclear, make the dependency explicit instead of requiring its fields for every record.

## Final chat recommendation

Read [next-step guidance](../../references/next-step.md). End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task’s artifacts forward. Make it a recommendation, not an automatic invocation. If no further skill is needed, recommend the concrete next action instead.
