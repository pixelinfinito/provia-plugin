---
name: provia-operations-triage
description: "Analyze supplied incident/action records for overdue, blocked, unassigned or stalled work and name who can act. Use when the user asks for \"which requests need attention today\", \"what is blocked\", \"who is late\", \"triage this export\", or says «que pedidos precisam de atenção hoje», «o que está bloqueado», «quem está atrasado», «analisa esta exportação de casos»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Operational triage

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Authorized record export, observation time, timezone, statuses, ownership and due dates; the manifest for owner keys.

## References

No task-specific reference beyond the shared conventions.

## Procedure

1. State the export period and observation time. Treat snapshots as snapshots; do not claim to be monitoring live Provia.
2. Check missing/duplicate records and interpret states with the current product reference. Prioritize time-sensitive impact, overdue dependencies and unclear ownership.
3. Use action and incident references to substantiate each finding. Distinguish overdue, blocked and merely waiting.
4. Propose actions and handoffs without completing records or sending messages. Identify the authorized person or group (by manifest key when known) who can act.
5. If history is insufficient to infer a cause, describe the symptom and the next record to inspect. Record recurring ownership gaps as `decisions[]`.

## Deliverable

An evidence-backed attention list with reasons, record references, suggested owners and next steps. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: workflows, groups. Appends: `decisions[]` for recurring ownership gaps. See [project manifest](../../references/project-manifest.md).

## Examples

- Com base nesta exportação, quais são os pedidos que precisam de atenção hoje em Luanda?
- Explain which blocked actions are delaying these incidents.

## Incomplete or conflicting input

If due dates or the export time are missing, avoid claiming which work is overdue.

If two rows disagree about status, flag the conflict and avoid choosing the more convenient record.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
