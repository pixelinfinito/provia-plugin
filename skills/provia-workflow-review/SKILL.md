---
name: provia-workflow-review
description: "Review a Provia workflow for ownership, sequencing, evidence, exceptions, executable action briefs and publication readiness. Use when the user asks for \"review this workflow before we publish\", \"find steps without an owner\", \"can these actions run in parallel\", \"check the action instructions\", or says «revê este workflow antes de publicar», «há passos sem responsável», «faltam caminhos de rejeição», «as instruções das acções estão completas»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Workflow design review

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Workflow design or export, the project manifest, intended business outcome, procedure and known dependencies.

## References

- [action writing](../../references/action-writing.md): for names, descriptions and the review gate.
- [project manifest](../../references/project-manifest.md): to check owners, forms and sources against the design.
- [workflow access](../../references/workflow-access.md): for grants, sensitivity, allowlists and the --check rules.

## Procedure

1. Trace each required outcome to an action and its completion evidence. Check that decisions include rejection/rework where the procedure requires them, and that every classified source step is either an action or folded into one.
2. Run `node scripts/review-actions.mjs workflow.yaml` when a shell is available and report, per action, the missing description parts, leaked implementer notes, over-long descriptions and unset `due`. Then review every name and description semantically: verb, object, agreement with type, source and evidence. Record editorial findings separately from contract errors. Use Markdown in action descriptions for readable paragraphs, numbered steps, evidence lists, selective emphasis, field keys and supplied procedure links, following `references/action-writing.md`. Preserve the literal section labels and Markdown source through YAML/JSON; do not emit HTML or editor JSON.
3. Check predecessor dependencies, parallel actions, owners by group key (every action has one; every group owns something; segregation flags raised), unavailable groups, due bases and cancellation behaviour.
4. Review access with `node scripts/build-project-map.mjs provia-project.json --check`: publication readiness fails on rules 1, 3 and 5, the error branches of rules 4 and 8, an unresolved `field:` assignee without fallback, an unresolved allowlist key in connected mode, and any retained tenant grant that violates rule 5, holds `admin` outside the approved set or fails rule 4 on a restricted workflow. Report rules 6 and 7, the info and warning branches of 4 and 8, every other retained grant, and the "starters see all cases" limitation of a restricted workflow. A blocked retained grant clears only with a source-backed manifest entry (never for an organization grant on a restricted workflow) or a removal confirmed by a fresh `workflow_get.access` read.
5. Review data collection, form mappings (every Form Fill action has a `formRef`), entity references and secret dependencies. Use `provia-workflow-package` for executable YAML checks; do not replace those checks with visual inspection.
6. Distinguish a product contract error, a business-policy gap and an optional improvement. Record policy gaps as `decisions[]` with an owner. Do not claim organizational or legal compliance from a structurally valid file.
7. Return normal, rejected, incomplete and failed-integration scenarios with expected visible results. Leave destination validation and publication clearly pending.

## Deliverable

A prioritized findings list with evidence, the per-action review gate result, the access readiness result, proposed corrections, new `decisions[]` and representative test scenarios. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: everything. Appends: `decisions[]` for policy gaps; never changes the design silently. See [project manifest](../../references/project-manifest.md).

## Examples

- Reveja este workflow antes de publicarmos. Procure etapas sem responsável e caminhos de rejeição em falta.
- Can these parallel actions start before budget approval?

## Incomplete or conflicting input

If the SOP is absent, review structural issues and the action briefs, and identify which policy questions cannot be adjudicated.

If the YAML validates but the process bypasses approval, report the business defect separately from file validity.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
