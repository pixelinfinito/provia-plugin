# Changelog

## 1.1.0

Release 1.1 of the business improvement plan: the plugin becomes an implementer toolkit with one project spine, executable action briefs and a measured evaluation loop. The YAML contract engine, fingerprints and validator are unchanged.

- **Project manifest and map (B2).** `provia-project.json` (`provia-project/v1`) holds sources with section anchors, entity types in catalogue shape, groups, workflows whose actions carry `sourceRefs`, `assigneeRef` by group key, `formRef`, `entityRefs`, `evidence`, `due` and folded steps, forms, AI profiles, decisions and receipts. `scripts/build-project-map.mjs` checks every reference, renders an offline `project.html` (rail, SVG graph, detail panel with the action brief, catalogue and pending tabs; red for unresolved, green for receipts) and generates `setup.md` from unresolved items. Every skill reads and appends the manifest.
- **Action description standard and review gate (B3).** `references/action-writing.md` defines the five-part brief to the assignee (Tarefa, Como, Evidência, Concluído quando, Excepções), folding rules, no implementer notes in descriptions and `due` from the stated service level or an open decision. `scripts/review-actions.mjs` reports missing parts, leaked notes, length and `due` per action. The five examples are rewritten to the standard with proposed deadlines; the 1.0.2 fixture has a rewritten sibling with before/after gate reports; acceptance cases added.
- **Groups as data (B4).** `provia-organization-rollout` produces `groups[]` with key, name, parent, purpose, members, source references and flags (`single_person`, `alias`, `segregation`, `requester`, `external`, `unnamed`); designer and package reference owners by key; the checker warns about owner-less actions and orphan groups.
- **Designer output (B5).** `provia-workflow-designer` classifies every source step (action, decision, folded, automation, intake, out of scope, conflict) and delivers the action table, a Mermaid flow, a YAML skeleton with full briefs and the manifest entry (`references/workflow-design-output.md`).
- Quote generated skill descriptions as YAML strings so colons and trigger punctuation remain installable; regression-test parsed frontmatter.
- **Single-source skills (B7).** `catalog.json` v2 generates the 16 `SKILL.md` files, the README tables and the English and Portuguese docs pages through `scripts/build-skills.mjs`; the shared preamble moved to `references/skill-conventions.md`, so a skill front-loads one reference instead of three.
- **Evaluation harness and release gate (B9).** `scripts/run-skill-evaluations.mjs` runs the matrix (now 48 cases, three per skill) through the Claude Code CLI with the repository as the plugin, preserves outputs, grades runs with `--judge` and records statuses; `build-release.py` refuses to package stale or untriaged evaluations unless bypassed, and records the gate result in `release.json`.
- **Entry points and triggers (B10).** New skills `provia-bootstrap` (documents → manifest → catalogue → groups → workflows → forms → validated packages → map, in one authorized run) and `provia-diagnose` (triage and improvement on supplied exports). Every skill description carries pt-AO and English trigger phrases.
- **Connected-mode contract (B1, plugin side).** `references/connected-mode.md` specifies detection of the `provia-implementer` MCP server, read-before-design, apply order with dry-run and the receipt shape with a `ref` back to the manifest; `scripts/resolve-workflow-refs.mjs` substitutes ids from receipts into a copy of the YAML. Nothing connects to Provia yet; disconnected mode is unchanged.
- Attribution header `# provia-skills <version>` on generated YAML (the product-side recording of B6 and the hosted validator of B8 are outside this repository).

## 1.0.6

- Refresh the YAML contract engine and source fingerprints to Provia `2641364d9c1aa0aa2b76aa788ef521bcb6218118`.
- Support all 19 entity/workflow metadata types, including `auto_number`, and dependent `select`/`multi_select` configuration.
- Reject forbidden generated/dependent defaults inside `config.defaultValue` as well as at field level.
- Validate generated-number settings, parent chains, option bindings and catalogue example consistency using bundled product rules. Expose configuration and parent bindings in copy-ready HTML.
- Document counter lifecycle, import limits, form-specific restrictions and schema-change effects. Add matching synthetic catalogue and workflow examples.

## 1.0.5

The information-model skill now requires functional completeness across the requested lifecycle, with core, conditional and optional fields separate from creation-time requirements. Existing systems remain authoritative without reducing Provia types to source links. Catalogue deliveries include matching JSON and standalone HTML with search, navigation, copy controls and JSON download. Adds the offline `build-entity-catalogue.mjs` renderer and editorial checks, a synthetic complete-catalogue example and regression tests. The workflow YAML contract and its validators are unchanged.

## 1.0.4

The information-model skill now designs entities around actual process use and manual entry. It distinguishes native fields from custom metadata, requires usable type descriptions and verified icons, and separates minimum, optional, deferred and externally held data. Includes a 220-icon snapshot with source provenance and semantic acceptance cases. Descriptions must not promise unsupported synchronization, uniqueness or controls. The YAML contract and validators are unchanged.

## 1.0.3

All 14 skills now end the final chat response with a contextual next-step recommendation, explaining the next skill and providing a copyable request. Shared guidance covers conditional routing, artifact handover, host-specific invocation and cases where no further skill is needed. Recommendations do not automatically invoke skills or interrupt already authorized end-to-end work. The YAML contract and validators are unchanged.

## 1.0.2

- Shared action-writing guidance for all action types, with Portuguese and English examples and explicit preservation of business meaning, assignments and routing.
- Eight skills apply the convention during design, generation, review, forms, automation, AI, knowledge maintenance and workflow changes.
- Package handover separates semantic editorial review from actual structural validation. Includes semantic acceptance cases.
- Includes the repository marketplace added after 1.0.1. The YAML contract engine, fingerprints and validator are unchanged.

## 1.0.1

Reject release output locations that overlap bundled source directories or their ancestors, preventing previous build artifacts from entering subsequent archives. Added a regression test. Skills and the pinned Provia contract are unchanged.


## 1.0.0

- Fourteen skills for workflow creation, organizational use and process improvement.
- Angola-aware country guidance and Portuguese business examples.
- Offline YAML validation using the pinned Provia contract engine.
- Versioned documentation download with checksums and explicit installation limitations.
- No live Provia connector or application integration.
