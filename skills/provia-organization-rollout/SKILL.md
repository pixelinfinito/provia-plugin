---
name: provia-organization-rollout
description: "Derive the groups design as data from the sources and plan Provia ownership, training and adoption for a team or organization. Use when the user asks for \"design the groups\", \"who should own each action\", \"plan the rollout\", \"adoption plan for the pilot\", \"training for the purchasing team\", or says «define os grupos», «quem fica responsável por cada acção», «plano de adopção», «vamos começar com Compras e depois alargar», «formação da equipa»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Organization setup and adoption

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Teams, org chart, administrators, process owners, the sources naming each actor, the manifest workflows, pilot results, existing permissions and rollout constraints.

## References

- [groups design](../../references/groups-design.md): for the group fields, flags and segregation rules.
- [project manifest](../../references/project-manifest.md): for `groups[]` and `assigneeRef` coverage.

## Procedure

1. Separate organization administration, group administration, process ownership and action responsibility. Explain proposed permissions without claiming to grant them.
2. For every actor named in the sources, produce a `groups[]` entry: key, localized name, parent (one level), purpose, proposed members by role or supplied email, the sections that justify it and flags: `single_person`, `alias`, `segregation`, `requester`, `external`, `unnamed`. Never invent emails or IDs.
3. Cross-check the workflows: every human action has an `assigneeRef` that resolves to a group key or `creator`; every group owns at least one action; segregation pairs and unnamed owners become `decisions[]` for the process owner.
4. Prefer durable team ownership when continuity matters. Explain available assignment approaches, but mark strategies absent from YAML as configuration outside the package.
5. Use a small pilot, gather evidence from completed incidents and expand after reviewing confusion, late work and missing evidence. Create role-specific exercises: start an incident, complete an action, make a decision and review a report. Define who provides support.
6. Measure completed useful work and ownership coverage, not only account creation or logins. Respect plan/role availability of reports and AI. In connected mode, offer `groups_apply_plan` after review.

## Deliverable

The `groups[]` design as data with flags and decisions, an ownership coverage check across the workflows, training exercises, rollout milestones and measurable adoption reviews. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: sources, workflows. Appends: `groups[]` with members, flags and `sourceRefs`; `decisions[]` for segregation and unnamed owners. See [project manifest](../../references/project-manifest.md).

## Examples

- Vamos começar com Compras e depois alargar à equipa de Recursos Humanos. Prepare um plano de adopção.
- Design group ownership and training for a cross-department rollout.

## Incomplete or conflicting input

If no process owner is named, create the `unnamed` placeholder group and the decision, and identify that dependency before treating the rollout as ready.

If everyone is proposed as administrator, explain the authority actually needed by each role. If the same team would request and approve, keep two groups and raise the segregation decision.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
