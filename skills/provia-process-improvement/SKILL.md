---
name: provia-process-improvement
description: "Analyze supplied Provia reports and exports to propose one measurable process improvement with its measurement plan. Use when the user asks for \"why do purchases take longer\", \"compare these two periods\", \"where do we lose time\", \"propose an improvement we can measure\", or says «porque é que as compras demoram mais», «compara estes dois períodos», «onde se perde tempo», «propõe uma melhoria mensurável»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Process performance improvement

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Comparable reporting periods, workflow/version scope, raw records, metric definitions and the business question.

## References

No task-specific reference beyond the shared conventions.

## Procedure

1. Check time coverage, timezone, duplicates, missing completion dates and comparable workflow versions before comparing periods.
2. Distinguish cycle time, active work and waiting. State formulas, denominators and exclusions. Do not infer individual performance from raw case duration.
3. Connect bottlenecks to underlying cases, decisions and comments. Present possible causes as hypotheses until supported.
4. Choose one change with a process owner, expected mechanism and follow-up measure. Identify confounders such as volume or complexity changes. When the change alters the design, hand it to `provia-workflow-change`.
5. Provia report availability is role/plan dependent. Scheduled report delivery is not implemented in the pinned baseline; do not promise it.

## Deliverable

Findings, reproducible calculations, limitations and a proposed change with a measurement plan. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: workflows, decisions. Appends: `decisions[]` for the proposed change and its owner. See [project manifest](../../references/project-manifest.md).

## Examples

- Este relatório mostra que as compras demoram mais. Identifique onde se perde tempo e como testar uma melhoria.
- Compare these two periods without mixing waiting time and active work.

## Incomplete or conflicting input

If the denominator or sample period is absent, request it or label the calculation as incomplete.

If workload rose alongside cycle time, discuss the confounder before attributing the change to an employee.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
