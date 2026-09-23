---
name: provia-form-designer
description: "Design intake forms and Form Fill responses with appropriate access and mappings, traced to the workflow action they serve. Use when the user asks for \"design the request form\", \"collect supplier quotations in the case\", \"self-service form for IT requests\", \"what should the intake form ask\", or says «cria o formulário de pedido», «recolher três propostas durante o pedido», «formulário de auto-serviço», «que perguntas deve ter o formulário»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Intake and evidence forms

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Respondents, desired answers, process stage, access constraints, uploads and response policy; the workflow action the form serves.

## References

- [metadata field rules](../../references/metadata-fields.md): when defining form fields, limits or mappings.
- [action writing](../../references/action-writing.md): for the Form Fill action name and description.

## Procedure

1. Decide whether submission creates an incident or supplies evidence to an existing one. Use an intake Form versus Form Fill accordingly.
2. Define internal/external respondents and the intended access path. Do not promise anonymous access or an external link without checking the configured form behaviour.
3. Map only compatible fields needed by the incident. A single Form Fill response can map values and complete the action; multiple responses are a review collection and cannot map competing values.
4. Specify file types/sizes and the reason each document is needed. Write a confirmation that states what happens next without promising an unconfigured deadline.
5. When there is a Form Fill task, specify both the form title and the action: a verb-led name and a five-part description whose evidence part names the submitted response. Keep bindings, mappings and response policy when improving wording. Use Markdown in action descriptions for readable paragraphs, numbered steps, evidence lists, selective emphasis, field keys and supplied procedure links, following `references/action-writing.md`. Preserve the literal section labels and Markdown source through YAML/JSON; do not emit HTML or editor JSON.
6. Deliver the form specification separately from YAML and add it to `forms[]` of the manifest with `workflowRef` and `actionRef`; set `formRef` on the action. Forms are not packaged in the portable contract; creation, linking and preview happen in Provia or through connected mode.

## Deliverable

A form specification with fields, validation, access, mappings, uploads, confirmation and testing steps, plus the manifest `forms[]` entry linked to its workflow action. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: workflows. Appends: `forms[]` with `workflowRef` and `actionRef`; `formRef` on the action. See [project manifest](../../references/project-manifest.md).

## Examples

- Precisamos de recolher três propostas de fornecedores durante um pedido de compra.
- Design a self-service IT request form with a clear confirmation.

## Incomplete or conflicting input

If the respondent access model is unknown, present the available design decision and mark access testing as pending.

If multiple quotations are requested but each should overwrite the incident amount, explain the conflict and propose a review step.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
