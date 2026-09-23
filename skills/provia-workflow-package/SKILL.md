---
name: provia-workflow-package
description: "Generate, explain or repair portable Provia workflow YAML, run the bundled validator and the action review gate, and generate the setup handover from the project manifest. Use when the user asks for \"generate the workflow YAML\", \"validate this workflow file\", \"repair this exported YAML\", \"package the approved design\", or says «gera o YAML do workflow», «valida este ficheiro», «corrige este YAML exportado», «prepara o pacote para importar»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Workflow package builder

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

An agreed design or YAML export, the project manifest, source contract version, known destination references or receipts, and setup constraints.

## References

- [portable workflow YAML](../../references/workflow-yaml.md): before emitting YAML, with `contracts/workflow-v1/contract-lock.json`.
- [action configuration details](../../references/action-configs.md): for HTTP, wait, notification, sub-workflow and AI settings.
- [action writing](../../references/action-writing.md): before the editorial review.
- [project manifest](../../references/project-manifest.md): for `assigneeRef` resolution and the generated `setup.md`.
- [workflow access](../../references/workflow-access.md): for grants, sensitivity, allowlists and the --check rules.

## Procedure

1. Read the YAML reference and the contract lock, then the manifest `workflows[]` entry or the agreed design. Start from a relevant bundled example rather than inventing property names.
2. Emit `provia.ao/v1` and `Workflow` with the first line `# provia-skills <version>` for attribution. Preserve exact enum values, native booleans, integer offsets and stable local action IDs equal to the manifest `localId`s. Use only supported top-level sections; never add manifest keys such as `assigneeRef` to YAML.
3. Resolve owners from the manifest: where a receipt resolves the `assigneeRef` group key, run `node scripts/resolve-workflow-refs.mjs` to substitute the real id (it also writes manual-trigger allowlists as group ids and carries the `access` grants with the `groupRefs` map); otherwise omit `assignee` and let the generated handover list it. A `field:` assignee emits its declared fallback; an allowlist whose group has no receipt is left out of the YAML and stays a blocking step in `setup.md`, never dropped silently. Never invent organization UUIDs and never silently replace the intended owner with the creator.
4. Emit the `access` section from the manifest with `node scripts/emit-workflow-access.mjs provia-project.json <workflow key> workflow.yaml --output …`: `group:<groups[].name>` (the importer matches names, not keys), `user:<email>`, `organization`. Against the bundled engine the section goes inside `workflow.yaml` and the validator is green without `workflow.access.not_declared`; against an engine that predates access it goes to `access.yaml` beside the YAML and `setup.md` lists it. Never emit a `permissions:` key: the engine rejects it as `schema.unknown_key`. An export from `workflow_export_yaml` that carries `access_omitted_no_admin` is not creator-only; say so.
5. Carry every action's five-part description into the YAML and run `node scripts/review-actions.mjs workflow.yaml`. Fix missing parts and any implementer note that leaked into a description before handover. Use Markdown in action descriptions for readable paragraphs, numbered steps, evidence lists, selective emphasis, field keys and supplied procedure links, following `references/action-writing.md`. Preserve the literal section labels and Markdown source through YAML/JSON; do not emit HTML or editor JSON.
6. Keep credentials out of files. Use supported placeholders and secret references with named dependencies. Keep forms, tags, files, page templates, memory documents and unsupported assignment strategies in the handover.
7. Run `node scripts/validate-workflow.mjs workflow.yaml` from the plugin root (Node 20.11+, no npm install or network). Fix errors and run again. Return the exact validator output as `validation.json`. If execution is unavailable, say validation was not run and provide the command; never simulate a report.
8. Update the manifest (`workflows[].file`, `status: validated` or `packaged`, `setupNotes`) and generate `setup.md` with `node scripts/build-project-map.mjs provia-project.json --setup setup.md`; regenerate `project.html`. In connected mode plan the apply with `node scripts/plan-workflow-access.mjs` (dry run first, one revision per distinct request), store the receipt with `ref.kind: access`, read `workflow_get.access` back into `access.applied[]`, and surface `access_disabled` or `unresolved` grants in `setup.md` instead of reporting success. Without a manifest, write `setup.md` by hand with the same sections.
9. Explain errors, warnings and pending destination checks separately and record the editorial review in `editorial-review.md`. Provia import preview/server dry run and a human publish review still follow. Do not call an export a full backup.

## Deliverable

`workflow.yaml` with its `access` section (or `access.yaml` beside it), the exact structural `validation.json`, the `review-actions` report, `editorial-review.md`, the generated `setup.md` and the updated manifest and map. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: everything. Appends: `workflows[].file`, `status`, `setupNotes`; `access.operations[]` and `access.applied[]` in connected mode; `setup.md` generated from unresolved items. See [project manifest](../../references/project-manifest.md).

## Examples

- Gere o YAML do pedido de compra aprovado e valide o ficheiro antes de o entregar.
- Repair this exported YAML without changing the intended approval process.

## Incomplete or conflicting input

If owner IDs are unavailable, deliver a draft with an explicit assignment handover instead of fabricated UUIDs.

If the user requests embedded form definitions or translated YAML keys, explain the contract boundary and preserve the form specification separately.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
