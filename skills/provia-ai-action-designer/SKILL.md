---
name: provia-ai-action-designer
description: Design reviewable AI-assigned Standard actions and narrowly scoped Provia agent profiles.
---

# AI actions and profiles

Read [country context](../../references/country-context.md) and [Provia capabilities](../../references/provia-capabilities.md) before making recommendations. Read the [Angola reference](../../references/countries/angola.md) when Angola applies. Country and response language are separate; respect an explicit user choice.

## Inputs

Task, supplied evidence, expected artifact, available fields, review policy and plan availability. Use supplied documents and exports. This plugin has no Provia connection. Ask only for information that materially affects the task; identify assumptions and continue independent work.

## Procedure

1. Assign AI to a Standard action. Confirm the task has a reviewable result such as a summary, classification or proposed document.
2. Define objective, inputs, rules and output. Restrict readable/writable fields and skills to the work; avoid granting broad access for convenience.
3. Use human review for new or judgment-heavy tasks and keep final approvals with authorized people. State behavior for missing and contradictory evidence.
4. Distinguish profile instructions from approved workflow Agent Memory. Memory documents are not carried by YAML.
5. Test normal, incomplete and contradictory examples. Explain plan/settings prerequisites and never imply this external plugin installs profiles in Provia.

## Deliverable

Profile instructions, required skills, output contract, review behavior and evaluation cases. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Examples

- Queremos que a IA resuma propostas, mas que a escolha do fornecedor continue a ser feita pela equipa.
- Write a profile for classifying IT requests with human review.

## Incomplete or conflicting input

If expected artifacts are not defined, propose a reviewable output and identify the missing acceptance criteria.

If the user asks AI to approve its own analysis, separate preparation from the authorized decision.
