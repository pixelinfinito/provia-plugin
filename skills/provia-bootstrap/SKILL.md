---
name: provia-bootstrap
description: "Take an implementer from the customer's documents to a reviewable Provia project in one authorized run: manifest, catalogue, groups, workflows, forms, validated packages and the project map. Use when the user asks for \"set up Provia for this customer from these documents\", \"bootstrap the project\", \"do the whole design end to end\", \"prepare everything for review\", or says «prepara o projecto Provia a partir destes documentos», «faz o desenho completo», «arranca a implementação», «prepara tudo para revisão com o cliente»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Bootstrap an implementation project

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

The customer's procedures, SOPs, checklists, org chart and exports; country, language, timezone and currency; the process or processes in scope; explicit authorization to run end to end.

## References

- [project manifest](../../references/project-manifest.md): before creating the manifest.
- [design deliverable](../../references/workflow-design-output.md): for each workflow.
- [groups design](../../references/groups-design.md): for the groups step.
- [connected mode](../../references/connected-mode.md): only if the `provia-implementer` server is present.

## Procedure

1. Confirm the authorization to work end to end, the country and language, and the sources. Create `provia-project.json` with `project`, `organization` and `sources[]` (one id per document, section anchors for the sections that will be cited). In connected mode, read the tenant first.
2. If the process is not chosen, apply `provia-process-discovery` and record the pilot. Otherwise record the scope as a decision already taken.
3. For each workflow in scope, apply `provia-workflow-designer`: classification table, action table with five-part descriptions and owners by group key, Mermaid flow, YAML skeleton and manifest entry.
4. Apply `provia-information-model` for the entity types the actions reference; write them to `entityTypes[]` and set `entityRefs`.
5. Apply `provia-organization-rollout` for the groups: one `groups[]` entry per actor with flags; check that every human action resolves to a group key or `creator`.
6. Apply `provia-form-designer` for the intake form and every Form Fill action; set `formRef`.
7. Apply `provia-workflow-package` per workflow: emit YAML, run `review-actions.mjs` and `validate-workflow.mjs`, keep the exact outputs, generate `setup.md`.
8. Run `node scripts/build-project-map.mjs provia-project.json --check` and `--output project.html`. Deliver the file list, the unresolved items and the open decisions. Do not stop between steps to ask permission; stop only when a decision would change the design materially, and record it in `decisions[]`.

## Deliverable

`provia-project.json`, `project.html`, one folder per workflow with `workflow.yaml`, `validation.json`, `editorial-review.md` and generated `setup.md`, the entity catalogue inside the manifest, and the list of open decisions for the customer review. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: creates it. Appends: every section. See [project manifest](../../references/project-manifest.md).

## Examples

- Prepare o projecto Provia da empresa a partir destes três procedimentos e do organigrama. País: Angola; responda em pt-AO. Pode trabalhar de fio a pavio.
- Bootstrap the Provia project for this customer from the attached SOPs. Run end to end and stop only for material decisions.

## Incomplete or conflicting input

If a source is missing for a step (no org chart, no service levels), complete every other step, leave the gap as an open decision with an owner and say what the customer must provide.

If two sources disagree about an owner or a rule, keep both in the classification, record the conflict as a decision and do not choose.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
