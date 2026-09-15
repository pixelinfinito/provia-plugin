# Information model 1.0.5: observed evaluation

An independent assistant received the revised skill and a synthetic pt-AO request for a services organization in Angola. Customers are used in contracting, billing, delivery and renewal; job functions in recruitment, onboarding, evaluation and development. CRM and the approved role document remain authoritative, no integration or records exist, and the earlier proposal contains only native Name plus official-record URL for each type. The request asks for a complete manual-setup specification and the necessary files. No expected answer, acceptance rubric or previous trial was supplied.

## Observed output

The assistant delivered [catalogue.json](catalogue.json), [catalogue.html](catalogue.html), [LEIA-ME.md](LEIA-ME.md) and [checks.json](checks.json). These original synthetic outputs are preserved unchanged, including their recorded temporary paths and hashes. They are evidence of one run, not the recommended starting template; use examples/entity-catalogue.json for the maintained example.

- Customer: 24 fields spanning identity, classification, commercial/delivery ownership, separate operational and billing contacts, location, terms, lifecycle and CRM reference.
- Job function: 23 fields spanning structure, mission, responsibility, autonomy, competencies, qualifications, evaluation/development, lifecycle and approved-document reference.
- All custom fields may be completed after creation; per-process readiness notes explain when the information is needed. Native Name remains required. Field count is an observation, not an acceptance threshold.
- Coverage explains included, external, case-held and inapplicable dimensions. Multiple contracts are not flattened into one customer renewal date. Personal evaluation results do not become job-function fields.
- Sources and maintenance are explicit; proposed policies, vocabulary, financial sources and destination checks remain unresolved rather than invented facts.
- Both files are generated from the same JSON. The evaluator performed editorial validation, static copy-target checks and supplemental example syntax checks. Its browser blocked local file navigation, so its own interactive checks are explicitly NOT RUN.

The observed response addresses the demonstrated failure: the two types contain operational information for all stated consuming processes instead of only external URLs. It does not prove organization-wide completeness or repeatability across other domains.

## Maintainer verification of the renderer

The maintained synthetic example was opened through a loopback HTTP preview in the in-app browser. Description copying, option value/label copying, field search and navigation were exercised. The downloaded JSON was compared with the source and matched exactly. Readonly configuration text was checked for vertical clipping after the content-height fix. No live Provia data or external service was used. Clipboard denial and both successful/failed legacy fallback paths are exercised by automated tests of the emitted script; a live browser permission denial was not forced.

Automated tests also cover escaped HTML/script-like catalogue text, duplicate keys, invalid icons/types, invalid select values/defaults, incompatible field properties, missing relationships, format-only checking, English controls and extraction from the documentation ZIP. The existing workflow tests continue to check the unchanged YAML contract. These checks are distinct from semantic completeness and destination validation.
