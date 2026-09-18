# JSON and HTML catalogue delivery

Deliver both files for entity catalogue creation or revision. JSON is the source of truth for this deliverable; generate the HTML from the same JSON after every change. This is an **editorial specification for manual configuration**, not a Provia API payload, entity import format or workflow YAML extension. Its version is independent of the workflow contract.

## Format

Use `examples/entity-catalogue.json` as a complete synthetic example. Adapt its fields to the user's actual processes rather than copying the example indiscriminately.

| Object | Required properties |
| --- | --- |
| Catalogue | `schemaVersion: "provia-entity-catalogue/v1"`, `title`, `language` (for example `pt-AO` or `en`), `country`, `notes` (text array), `types` (nonempty array) |
| Type | `key`, `name`, `description`, `icon`, `namePattern`, `purpose`, `owner`, `coverage`, `setup`, `readiness`, `fields` |
| Coverage entry | `dimension`, `decision` (`included`, `external`, `case`, `not_applicable` or `pending`), `reason` |
| Field | `key`, `label`, `type`, `required` (boolean), `group`, `helpText`, `purpose`, `priority` (`core`, `conditional`, `optional`), `source`, `maintainer`, `sensitivity`, `example` |
| Select / multi-select | Also `options`, an array of distinct `{ "value": "stable_value", "label": "Localized label" }` objects; dependent options also require `parentValue` |
| Entity field | Also `targetType`, the key of a type in this catalogue; this is not a destination UUID |

`setup` and `readiness` are text arrays. Record sources, assumptions, field dispositions, permissions, dependencies and manual-entry walkthroughs there or in catalogue `notes`, so they remain visible in the HTML. `coverage` explains business completeness; nonempty coverage alone does not prove it. Record the inspected icon snapshot revision in `notes` and mark destination verification pending when applicable.

Keys and option values use lowercase ASCII snake_case. Display names, help text, descriptions and other user-facing text use the requested language. `group` organizes the fields. `defaultValue` is optional and must be justified. For numeric and boolean examples/defaults, use JSON numbers and booleans. Select examples must use actual option values; multi-select examples are arrays. Keep dates, URLs, currencies and other values consistent with the actual Provia field configuration. For entity/user/file examples, use a clearly symbolic object such as `{ "lookupName": "Demonstration supplier" }`; do not pass it off as an importable value or a real destination ID. Avoid selector defaults without verified destination identifiers.

If an entity target already exists, include its type in the catalogue with a setup note stating that it must be reused and its existing schema verified, not recreated. Create or resolve types first, then configure relations and record entry. This also handles cyclic references without inventing an impossible creation order.

Use optional field `config` for Provia settings, including automatic-number `prefix`, `suffix`, `padding`, `startAt`, or a dependent select's `parentField`. Keep editorial `options` and `defaultValue` at field level, never duplicate them inside `config`. Read [metadata fields](metadata-fields.md) for all 19 types and the new rules. The renderer exposes every config entry and option `parentValue` as copyable values, and preserves the full JSON for download. Explain configuration choices in `helpText` or type `setup`.

## Commands

From the plugin directory, with Node.js 20.11 or newer:

```bash
node scripts/build-entity-catalogue.mjs catalogue.json --check
node scripts/build-entity-catalogue.mjs catalogue.json --output catalogue.html
```

The output directory must already exist. Validation checks the editorial shape, unique type/field keys, supported icon and field identifiers, related catalogue types, select examples/defaults, basic number/boolean/string shapes, config schema, automatic-number restrictions, dependent parent chains and matching parent/child examples. It does not certify business completeness, every Provia field configuration, date/URL syntax, permissions, destination IDs or legal compliance. Run the workflow validator separately if producing workflow YAML.

The generated HTML runs offline with no external libraries. It includes navigation, search, complete field cards, copy controls for names/descriptions/icons/keys/labels/help/options, coverage and setup notes, type JSON and a full JSON download. Copy first uses the clipboard API; when unavailable, it selects the text and attempts the browser copy fallback. A visible message says when keyboard copying is required. It never connects to or creates data in Provia.

Inspect the actual HTML and exercise a description copy, an option value/label copy, search, navigation and JSON download where browser tools are available. Confirm JSON and HTML agree. Report checks actually performed. If file or browser tools are unavailable, disclose the limit and provide the full file contents or the generation command as appropriate; never claim a file was generated or a button tested when it was not.

In the final response, link both files and recommend the next useful skill with a copyable request carrying the catalogue forward. Do not publish private organization catalogues in the plugin repository; keep bundled examples synthetic.
