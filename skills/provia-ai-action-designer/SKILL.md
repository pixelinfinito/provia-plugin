---
name: provia-ai-action-designer
description: "Design reviewable AI-assigned Standard actions and narrowly scoped Provia agent profiles. Use when the user asks for \"let AI summarize the proposals\", \"classify IT requests automatically\", \"write an agent profile\", \"which steps can AI prepare\", or says «a IA resume as propostas», «classificar os pedidos automaticamente», «perfil de agente para», «que passos a IA pode preparar»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# AI actions and profiles

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Task, supplied evidence, expected artefact, available fields, review policy and plan availability; the manifest action the AI will prepare.

## References

- [action writing](../../references/action-writing.md): to name the expected work without making AI the subject.
- [action configuration details](../../references/action-configs.md): for `aiWorker` settings and artifacts.

## Procedure

1. Assign AI to a Standard action. Confirm the task has a reviewable result such as a summary, classification or proposed document.
2. Define objective, inputs, rules and output. Restrict readable/writable fields and skills to the work; avoid granting broad access for convenience.
3. Use human review for new or judgment-heavy tasks and keep final approvals with authorized people. State behaviour for missing and contradictory evidence.
4. Distinguish profile instructions from approved workflow Agent Memory. Memory documents are not carried by YAML.
5. Write the action's five-part description for the human reviewer of the AI output, and record the profile in `aiProfiles[]` with `assigneeRef: ai:<key>` on the action.
6. Test normal, incomplete and contradictory examples. Explain plan/settings prerequisites and never imply that this external plugin installs profiles in Provia.

## Deliverable

Profile instructions, required skills, output contract, review behaviour, evaluation cases and the manifest `aiProfiles[]` entry. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: workflows. Appends: `aiProfiles[]`; `assigneeRef: ai:<key>` on the action. See [project manifest](../../references/project-manifest.md).

## Examples

- Queremos que a IA resuma propostas, mas que a escolha do fornecedor continue a ser feita pela equipa.
- Write a profile for classifying IT requests with human review.

## Incomplete or conflicting input

If expected artefacts are not defined, propose a reviewable output and identify the missing acceptance criteria.

If the user asks AI to approve its own analysis, separate preparation from the authorized decision.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
