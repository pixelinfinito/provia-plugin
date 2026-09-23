---
name: provia-process-knowledge
description: "Create or reconcile SOPs, action instructions, runbooks and proposed Agent Memory from supplied Provia designs. Use when the user asks for \"update the procedure from the approved workflow\", \"write a runbook\", \"turn lessons from the pilot into instructions\", \"propose memory for the agent\", or says «actualiza o procedimento com o workflow aprovado», «escreve um guia operacional», «incorpora as lições do piloto», «glossário para a memória do agente»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Procedure and knowledge maintenance

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Current workflow version or manifest, approved policies, existing guidance and incident lessons.

## References

- [action writing](../../references/action-writing.md): for action instructions in the five-part form.

## Procedure

1. Identify the source workflow version and distinguish published procedure from proposed changes.
2. Write each action instruction in the five-part form (task, method, evidence, done-when, exceptions) so it can be pasted into the action description. Preserve real approval authority and keep the brief name separate. Use Markdown in action descriptions for readable paragraphs, numbered steps, evidence lists, selective emphasis, field keys and supplied procedure links, following `references/action-writing.md`. Preserve the literal section labels and Markdown source through YAML/JSON; do not emit HTML or editor JSON.
3. Reconcile conflicts between workflow and policy explicitly. Do not silently promote incident workarounds to organization-wide policy.
4. Keep stable approved guidance in proposed Agent Memory; keep temporary case facts in the incident. Memory proposals need administrator review.
5. Provide concise standalone artefacts with source references and an update owner. Pages and memory documents require separate setup after YAML import.

## Deliverable

A sourced procedure or knowledge artefact with owner, scope, version, conflicts and review needs. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: workflows, sources, decisions. Appends: updated action descriptions; `decisions[]` for policy conflicts. See [project manifest](../../references/project-manifest.md).

## Examples

- Actualize as instruções deste procedimento com base no workflow aprovado e nestas lições do piloto.
- Turn this approved procedure into a concise runbook and a proposed memory glossary.

## Incomplete or conflicting input

If the current approved version is unknown, label the document as a draft.

If a case workaround contradicts policy, record it as an exception to review rather than rewriting the policy.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
