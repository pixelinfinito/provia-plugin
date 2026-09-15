# Information model acceptance cases

Evaluate semantics using the actual generated catalogue. Give the assistant the raw scenario and skill, not the expected results. These are reusable acceptance cases, not an automated grammar or schema certification.

| Scenario | Acceptance criteria |
| --- | --- |
| Supplier catalogue with native name plus display_name, record_key and vendor_number | Uses native Name; retains a real vendor code only when useful; does not require a second generic key |
| All types carry source_system, source_record_id, source_url and verified_at | Explains field-level need and maintenance; does not retain or remove all of them blindly |
| CRM account with generic source ID, CRM ID and two equivalent URLs | Avoids duplicate entry; preserves identifiers required by a real integration |
| Type has IconTruckDelivery | Suggests an exact identifier in the bundled Provia list; marks destination drift honestly |
| Type has a description promising automatic blocking from a select | Produces usable factual description and separately identifies the missing enforcement mechanism |
| Select options indefinite/fixed_term with example permanent | Corrects or flags the incompatible example by meaning |
| One vacation request with no reuse outside its execution | Considers case/form/CH source rather than automatically creating another entity |
| Recurring asset maintenance for the same equipment | Retains a reusable entity, actual asset code and necessary operational fields |
| Stable indicator described with a period-specific unique key | Resolves or flags the grain conflict before defining fields |
| Financial balance with no source update path | Avoids claiming a maintained balance; proposes source lookup or justified dated snapshot |
| Existing data and workflow mappings depend on removed fields | Provides disposition and migration questions; does not silently delete or rename |
| Two legal companies in one Provia tenant | Keeps the legal distinction where needed; does not equate company with tenant |

Every proposed type includes a localized display name, paste-ready description, supported icon, native Name convention and a manual-entry walkthrough. Core, conditional and optional model fields are distinguished from creation-time requirements and deferred collection, and creation requirements from later readiness checks. Report actual validation and observed trial scope separately from unexecuted cases.


## Completeness and manual configuration

- Given customers used in contracting, billing, delivery and renewal, and job functions used in recruitment and development, assess identity, contacts, ownership, classification, responsibilities, requirements and lifecycle. Do not reduce both types to an external URL merely because a CRM or approved document exists.
- Keep fields required by later processes in the complete type, with a maintainer and collection/readiness point; do not mark all fields required on day one or impose a field-count quota.
- Deliver matching JSON and HTML. Verify the HTML exposes names, descriptions, valid icons, keys, labels, types, help text, required flags, option values/labels, examples, dependencies and coverage.
- Test copy controls including clipboard-denied fallback, search/navigation and JSON download. Treat external text as data, including HTML-like descriptions, and preserve it safely in the downloadable JSON.
