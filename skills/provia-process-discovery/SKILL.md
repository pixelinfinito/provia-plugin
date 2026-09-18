---
name: provia-process-discovery
description: "Choose a suitable first Provia process from an organization’s repeated work and constraints. Use when the user asks for \"choose a pilot process\", \"which process should we start with\", \"prioritize our processes for Provia\", \"compare processes for a first workflow\", or says «por onde começar com o Provia», «ajuda-nos a escolher um piloto», «que processo devemos automatizar primeiro», «priorizar os nossos processos»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Process discovery and pilot selection

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Process inventory, recent cases, pain points, volumes, owners, constraints and baseline measures.

## References

No task-specific reference beyond the shared conventions.

## Procedure

1. Identify the event that starts each process and the observable condition that ends it. Distinguish repeatable organizational work from one-off tasks.
2. Compare impact, frequency, handoff delay, evidence gaps, ownership and implementation effort. Do not invent volumes or monetary savings.
3. Choose a pilot with a named owner and enough real cases to learn from. Separate observed baseline values from estimates.
4. Define the smallest useful scope and a review after several completed incidents.
5. Record every candidate's documents as `sources[]` in the manifest with a stable id and, for the chosen pilot, the section anchors the designer will cite. Record unanswered questions as `decisions[]` with an owner. Hand the agreed design brief to `provia-workflow-designer`.

## Deliverable

A ranked shortlist, an explained pilot choice, boundaries, owner, success measures, open questions, and the manifest `sources[]` and `decisions[]` for the pilot. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: organization, existing sources. Appends: `sources[]`, `decisions[]`, `project.title` for the chosen pilot. See [project manifest](../../references/project-manifest.md).

## Examples

- Na nossa empresa em Luanda, compras, admissão de trabalhadores e pedidos de TI são tratados por correio electrónico. Ajude-nos a escolher um piloto.
- Compare our processes and explain which one fits a four-week pilot.

## Incomplete or conflicting input

When volume or ownership is missing, give a provisional comparison and the information needed to decide.

When the fastest process has no owner but another has clear ownership, explain the trade-off instead of ranking by speed alone.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
