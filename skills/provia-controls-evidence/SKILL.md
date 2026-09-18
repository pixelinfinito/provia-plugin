---
name: provia-controls-evidence
description: "Map supplied organizational requirements to Provia actions and execution evidence, separating legislation, policy and recommendation. Use when the user asks for \"map this policy to the workflow\", \"which evidence is missing\", \"prepare for the audit\", \"are our controls in the workflow\", or says «compara o procedimento com estes registos», «que evidências faltam», «preparar a auditoria», «os controlos estão no workflow»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Controls and evidence review

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Applicable policy or verified legal sources, the workflow design or manifest, incident records and evidence.

## References

No task-specific reference beyond the shared conventions.

## Procedure

1. Establish jurisdiction, effective dates and the exact requirement sources. Separate legislation, company policy and recommendations.
2. Map each requirement to the responsible action (by manifest `localId`), decision, required data/document and evidence of execution.
3. Distinguish a designed control from proof it operated in a specific incident. Missing evidence does not by itself prove the activity never happened.
4. Quote or cite the relevant supplied provision. Verify current legal claims against authoritative sources; if verification is unavailable, record the limitation.
5. Return findings and remediation proposals with an owner. Do not certify compliance, invent legal retention periods or claim that an audit trail alone meets every requirement.

## Deliverable

A requirement/action/evidence matrix, gaps, source references and follow-up ownership. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: workflows, sources. Appends: `decisions[]` for gaps with an owner; a policy source in `sources[]`. See [project manifest](../../references/project-manifest.md).

## Examples

- Compare o nosso procedimento de compras com estes registos e indique as evidências em falta.
- Map this approved policy to workflow actions and the evidence from three incidents.

## Incomplete or conflicting input

If legal sources or dates are missing, limit the review to the supplied organizational policy.

If a template cites Brazilian legislation for Angola, identify the jurisdiction mismatch rather than adopting it.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
