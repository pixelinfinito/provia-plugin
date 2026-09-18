---
name: provia-information-model
description: "Design complete, usable Provia entity types and field dictionaries, delivered as JSON and a copy-ready HTML catalogue for manual setup. Use when the user asks for \"which fields belong to the supplier\", \"design our entity types\", \"what data should we keep in Provia\", \"build the entity catalogue\", or says «que campos deve ter o fornecedor», «como organizar os dados dos clientes», «define os tipos de entidade», «catálogo de entidades»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Business information model

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Business processes across the requested scope, business objects, sample records, reporting questions, forms, existing catalogues and systems of record. Distinguish a deliberately limited pilot from a complete organizational catalogue; do not silently narrow the latter. Establish who enters and maintains the data and what is known at creation.

## References

- [practical entity design](../../references/entity-design.md): before proposing any type.
- [metadata field rules](../../references/metadata-fields.md): when defining fields, automatic numbers or dependent selections.
- [catalogue deliverables](../../references/entity-catalogue-format.md): for the JSON shape and the HTML build.

## Procedure

1. Design for functional completeness across the requested lifecycle, not the fewest fields. Review identity, classification, contacts/location, ownership/structure, status/lifecycle, dates, operational/commercial terms, relationships and evidence as applicable. Record coverage and explain exclusions; a Name plus external URL is sufficient only when it supports all stated uses. Justify each entity type by its identity, lifecycle and reuse in named processes. A conceptual business object does not automatically need a Provia entity; prefer case metadata, form answers, documents, tags or the source system when these meet the need.
2. Map native record Name, UUID and system timestamps before adding custom fields. Do not generate universal identifier, provenance, URL, version or verification fields. Retain real business codes and source references only for a concrete use; explain who maintains them.
3. For every proposed type, provide a localized display name, a concise description ready to paste into Provia, a record Name pattern and an exact icon from `references/entity-icons.json`. Cite the snapshot revision and flag unverified destination differences. Do not invent icon identifiers or promise automatic controls in descriptions.
4. Deliver the complete recommended field set, grouped for manual configuration. Classify retained fields as core, conditional or optional; distinguish these from deferred and externally held data. Core means needed by the model, not necessarily required at creation. For each retained field specify purpose and consuming process, supported type, stable ASCII snake_case key, localized label/help text, creation-time required boolean, options, example, default only when justified, maintainer and sensitivity. Validate examples against their types and select values; never invent destination IDs.
5. Keep collection-only form answers on submissions unless routing, reporting or integration requires incident metadata. Separate controlled select values from flexible tags. Specify useful mappings and their direction; copied entity values are not continuous synchronization. Do not claim uniqueness, history, permissions or status-based blocking merely from custom fields.
6. Walk through creating one synthetic record per proposed type using what a user actually knows. Check both missing operational information and duplicate entry; report unresolved maintenance effort. For an existing catalogue, give a before/after field disposition and assess dependent records, forms, mappings and workflows before proposing removal.
7. Inside a project, the types go to `entityTypes[]` of the manifest in the catalogue shape and `project.html` renders them in its catalogue tab; add `entityRefs` to the actions that use each type. Without a project, deliver `catalogue.json` and a standalone `catalogue.html` generated with the bundled script. Validate the editorial format, inspect the rendered result and test copy controls. Do not substitute a Markdown summary for the files when file creation is available. A focused question may be answered directly without regenerating an entire catalogue.

## Deliverable

Matching JSON and offline HTML (or the manifest `entityTypes[]` and the map's catalogue tab), with a justification, paste-ready description, verified icon and record Name pattern for each proposed type; a complete, grouped field dictionary and functional coverage review; useful mappings/tags; a disposition of removed or deferred proposals; and a manual-entry review with unresolved setup. Keep operational setup notes separate from descriptions. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: sources, workflows. Appends: `entityTypes[]` in catalogue shape, `entityRefs` on the actions that use them. See [project manifest](../../references/project-manifest.md).

## Examples

- Como organizar fornecedores e pedidos de compra sem repetir os dados do fornecedor em cada pedido?
- Which fields belong to the supplier and which belong to a purchase request?

## Incomplete or conflicting input

If reporting or lifecycle needs are unknown, propose a complete reasoned baseline, label assumptions and identify what requires confirmation. Do not replace operational attributes with a generic source link or omit an entire dimension merely because the source is incomplete.

If a form collects personal information without a use, flag it and explain which fields can remain on the submission or be removed. If a source catalogue has descriptions or icons, assess them rather than claiming they are missing; treat organizational rules in a supplied catalogue as source claims until confirmed. If an integration or multi-company context is unclear, make the dependency explicit instead of requiring its fields for every record.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
