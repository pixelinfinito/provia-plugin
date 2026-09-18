---
name: provia-diagnose
description: "Run triage and performance improvement together on supplied Provia exports: what needs attention now, where time is lost, and one measurable change with an owner. Use when the user asks for \"diagnose this process\", \"what is wrong with purchasing\", \"review these exports and tell me what to fix\", \"health check of the workflow\", or says «diagnostica este processo», «o que está mal nas compras», «analisa estas exportações e diz-me o que corrigir», «estado de saúde do workflow»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Diagnose a running process

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Authorized incident/action exports with observation time and timezone, comparable periods when available, the manifest or workflow design, and the business question.

## References

- [project manifest](../../references/project-manifest.md): for owner keys and action ids.

## Procedure

1. State what was supplied: export period, observation time, timezone, workflow versions. Refuse to claim live monitoring.
2. Apply `provia-operations-triage`: the attention list with record references, distinguishing overdue, blocked and waiting, with the owner who can act.
3. Apply `provia-process-improvement` on the same records: cycle time versus waiting, reproducible calculations, confounders, and one change with a mechanism and a measure.
4. Connect the two: which attention items are symptoms of the proposed change, and which need a workflow change (`provia-workflow-change`) or a knowledge update (`provia-process-knowledge`).
5. Record the proposed change and unresolved ownership as `decisions[]`. Deliver one report with both parts and the limits of the data.

## Deliverable

One diagnosis report: attention list, performance findings with calculations, a proposed measurable change with owner, decisions and data limitations. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: workflows, groups, decisions. Appends: `decisions[]`. See [project manifest](../../references/project-manifest.md).

## Examples

- Diagnostique o processo de compras com estas duas exportações (Junho e Agosto). País: Angola; responda em pt-AO.
- Diagnose the IT request process from this export and propose one change we can measure next month.

## Incomplete or conflicting input

If only one period exists, deliver the triage and label the performance comparison as not possible yet, with the export the customer must produce.

If the export contradicts the design (an owner the workflow does not have, a state the version cannot produce), report the mismatch before interpreting the numbers.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
