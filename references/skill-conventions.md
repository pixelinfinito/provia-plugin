# Shared conventions for every Provia skill

Every `SKILL.md` in this plugin is generated from `catalog.json` and starts by pointing here. These rules apply to all skills; a skill file repeats only what is specific to its task.

## Country and language

Country, jurisdiction, response language, currency and timezone are separate choices. Read [country context](country-context.md) before relying on any of them, and the [Angola reference](countries/angola.md) when Angola applies. If no country is supplied, disclose Angola as a provisional starting context. Respect an explicit language choice; Portuguese output for Angola uses pt-AO terms (utilizador, ficheiro, equipa, registo, ecrã). Never derive law from language.

## What the product supports

Assert product behaviour only from [Provia capabilities](provia-capabilities.md) and the pinned contract in `contracts/workflow-v1/contract-lock.json`. Workdays skip weekends, not public holidays. Forms, tags, memory documents, page templates and assignment strategies are not carried by YAML.

## Disconnected and connected mode

By default the plugin works only with the procedures, exports and records the user supplies. It does not read or change a Provia organization, create records, publish workflows, send notifications or configure AI profiles. Ask only for information that materially affects the task; identify assumptions and continue with independent work.

If the host exposes a `provia-implementer` MCP server (a tool named `org_get_context` is the signal), read [connected mode](connected-mode.md) before designing: read the tenant first, then offer draft-only `apply` steps with dry-run. Without that server, nothing changes; do not pretend it is present.

## The project manifest

Work belongs to one project. Read [project manifest](project-manifest.md). When the user supplies or the working directory contains `provia-project.json`, read it before starting and treat its sources, entity types, groups, workflows, forms and open decisions as the current state. When the skill produces a design artefact, append or update the matching section and say so; when no manifest exists and the task produces a reusable artefact, create one. Reference owners by group key (`assigneeRef`), never by an invented UUID. Put implementer-only notes in the manifest and `setup.md`, never inside an action `description` that an assignee will read.

## Honesty rules

- Never invent organization IDs, approval thresholds, legal provisions, retention periods, tax rates, endpoints or validation results.
- Separate confirmed facts, recommendations and unresolved decisions. Record unresolved questions as `decisions[]` with an owner.
- Cite the supplied evidence and the product references used. Do not claim a check was run, a file was written or a button was tested when it was not. Name the check and the file it covered; a manifest check does not validate a Markdown deliverable.
- Never open or close with a blanket status («everything is in order», «all validated») while pending items or open decisions exist. State what was verified, what is pending and what the owner must decide.
- Structural validity is not business correctness, and neither is compliance. Publication readiness is decided in Provia by an authorized person.

## Action wording

When creating, rewriting or reviewing action names or descriptions, read [action writing](action-writing.md). Names start with a verb that names the work; descriptions are the five-part brief to the assignee (task, method, evidence, done-when, exceptions).

## Final chat recommendation

Read [next-step guidance](next-step.md). End the final chat response with the most useful next skill, a brief reason and a copyable request that carries this task's artefacts and manifest forward. It is a recommendation, not an automatic invocation. If no further skill is needed, recommend the concrete next action instead. When the user authorized an end-to-end task (for example through `provia-bootstrap`), continue the work and recommend only what remains at the end.
