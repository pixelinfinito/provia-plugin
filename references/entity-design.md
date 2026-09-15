# Practical entity design

Design for people creating, finding and maintaining records in Provia. A business information model is not a request to reproduce a relational database or an ERP. This guidance concerns entities; it does not change the portable workflow YAML contract.

## Decide where the information belongs

| Need | Starting point |
| --- | --- |
| Stable object selected across cases, or with its own recurring lifecycle processes | Entity, with named consumers and a maintainer |
| Amount requested, approval, payment confirmation or other fact of one execution | Incident metadata and action evidence |
| Answers collected only for that submission | Form response; map only values that the case needs |
| Instructions, detailed narrative, evidence or document content | Page, file or authoritative document location |
| Flexible classification | Tag; use a controlled select for a governed vocabulary |
| Existing CRM, payroll, accounting or identity data | Minimal reference to the source; copy values only for a demonstrated use and explain maintenance |

Do not categorically ban financial items, access grants or bookings as entities. They can be useful when the same object genuinely supports several processes. Demonstrate that reuse and the update mechanism before recommending them. A single request is usually a case, not both a case and a duplicate entity.

Define the record's grain: one employee, one employment contract, one recurring indicator definition, or one target for one period. Do not describe an indicator as stable across periods while defining its identity by a period-specific target. Explain proposed merges or splits without silently changing an existing catalogue.

## Start with native features

The checked Provia implementation gives each entity a required native `name`, a generated UUID, creator and system timestamps. An entity type has a display name, description, icon, color and custom metadata schema. The native record Name is separate from metadata fields.

- Use the native Name as the readable record label. Do not add `display_name` or `professional_name` for the same value. A separate legal name is justified when it differs from the trading/display name and a process uses it.
- Retain meaningful existing business codes, such as employee number, asset number or contract number. The UUID does not replace those codes. Avoid adding a second generic `record_key` alongside them.
- Do not add `source_system`, `source_record_id`, `source_url`, `verified_at` or version fields to every type. A field needs an actual consumer, source and maintainer. A single documented source for the entire type may belong in setup notes instead.
- Prefer one useful external reference over duplicate generic and domain-specific IDs/URLs. Keep both an ID and URL when an actual integration and a human lookup need them; identify who populates each.
- `updatedAt` proves an edit, not an independent verification. Keep a verification date only with a defined verification process; evidence may belong to its case.
- Distinguish the Provia tenant from a legal entity. A legal-entity reference may be essential across several companies, but should not be added everywhere merely because the storage model is tenant-scoped.

Do not impose an arbitrary maximum field count. Start with the minimum that supports the pilot. A large catalogue is acceptable only when its additional fields have demonstrated uses and workable maintenance.

## Make the type usable in the interface

For each proposed type, return:

1. Localized display name, reuse rationale and scope of one record.
2. One or two sentences ready to paste into the type Description: what the records represent and why users select them. Keep source policy, setup instructions and unresolved assumptions outside this text. Do not put invented organization-specific rules or claims of automatic enforcement in it.
3. An exact icon identifier from `entity-icons.json`, with a brief semantic reason. The snapshot records the checked product revision and source hashes. If the destination differs, request its available choices or mark destination confirmation pending. Do not choose an icon from another library because its picture looks right.
4. A pattern for the native record Name and a clearly synthetic example. This is a convention, not an automatic name-generation feature.
5. Minimum and optional metadata, followed by deferred fields and values held elsewhere, with reasons.

Examples in pt-AO:

| Type | Paste-ready description | Verified icon | Native Name convention |
| --- | --- | --- | --- |
| Fornecedor | Fornecedores utilizados nos processos de compra, contratação e avaliação. Permite seleccionar a contraparte e consultar os dados necessários à relação. | `Truck01` | Trading or legal name; add a known vendor code only if needed to distinguish records |
| Colaborador | Colaboradores a que se associam os processos de gestão de pessoas. Reúne a identificação profissional necessária ao acompanhamento desses processos. | `User01` | Professional name; existing employee number if needed for disambiguation |
| Equipamento | Equipamentos associados a processos de atribuição, manutenção e devolução. Permite identificar o bem e consultar a sua situação corrente. | `Laptop01` | Existing asset number and short designation |

English example: Customer — "Customers linked to processes managed in Provia. Provides the account identity and a reference to the commercial system of record." Suggested icon: `Building02`. Do not use these sample descriptions where their stated process use does not apply.

These descriptions belong to entity types. Do not invent a native description property for individual entity records. A field's explanatory help text is also different from a type description.

## Keep fields and examples implementable

For each retained custom field, state its business use, source and maintainer. Decide whether the creator knows the value at registration. Set creation-time `required` accordingly, and separately describe any readiness check before approval or another dependent action. "Required once validated when applicable" is not an implementable substitute for these two decisions.

Use supported metadata types and ASCII snake_case keys with localized labels and help text. Choose options with stable values and readable labels. Every synthetic example/default must match its type and options. A select example `permanent` does not match options `indefinite` and `fixed_term`. A URL cannot masquerade as an external ID unless that is really the identifier format. Illustrative emails, names and business codes are not destination UUIDs for user/entity selectors.

Keep country, currency, timezone and language separate. Use Angola-aware wording when appropriate; do not invent fiscal obligations, identifier formats or retention periods. Financial/identity details need an actual process use and an appropriate access model. A sensitivity label is not field-level permission enforcement.

Entity references impose lookup, access and update work. Keep a relationship when a process consumes it, not just because two objects are related in theory. Avoid duplicate inverse relationships unless both directions are needed and maintained. Do not demand simultaneous customer, supplier and employee references for a record with only one applicable counterparty.

## Do not promise unimplemented behavior

The checked baseline does not provide arbitrary composite uniqueness constraints just because a catalogue declares `unique_key`. Treat that as a proposed reconciliation rule unless the destination's actual control is verified. Type-name uniqueness is a separate feature.

A custom status field does not itself block record selection, grant/revoke access or execute a payment. A user reference does not assign a workflow action automatically. A version field does not preserve previous values. A source reference does not create a connector. Copied values are not continuous synchronization. Document any mechanism actually required for these behaviors and leave unverified behavior pending.

For balances, renewal values or identity-system state, specify the source of truth, update owner and cadence. When no credible update path exists, prefer a source link or a case-time snapshot over a stale parallel register. Preserve the source and date of a snapshot when the decision requires that provenance.

## Review the proposed model

Walk through one synthetic record per type. Report the values known at creation, later dependencies and any avoidable repeated entry. This is a design walkthrough, not a claim that you tested the UI or created records.

For an existing model, classify every proposed field as retained, merged with a native field, optional, deferred or held elsewhere. Account for values, dependent forms, mappings, integrations and open cases before deleting or renaming a deployed field. Deliver a recommendation and migration questions; this plugin does not mutate the destination.

Evidence baseline: product source revision and hashes in `entity-icons.json`; `backend/src/lib/validation.ts`, `backend/src/db/schema.ts`, `backend/src/services/entity.service.ts`, `frontend/src/components/entity/EntityForm.tsx` and `docs/docs/core-concepts/entities.md`. This baseline describes the inspected source, not a certified deployment or the separately pinned YAML engine revision.
