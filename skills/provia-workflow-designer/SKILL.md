---
name: provia-workflow-designer
description: "Turn supplied procedures, SOPs and checklists into a Provia workflow design with classified source steps, executable action briefs, a flow diagram, a YAML skeleton and the manifest entry. Use when the user asks for \"turn this SOP into a workflow\", \"design the approval flow\", \"convert this procedure into actions\", \"model this process in Provia\", or says «transforma este procedimento num workflow», «ajuda-me a organizar as compras», «desenha o fluxo de aprovação», «converte este manual em acções»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Procedure-to-workflow designer

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Procedure, start/end conditions, roles, approval rules, required evidence, service levels and exceptions; the manifest when one exists.

## References

- [design deliverable](../../references/workflow-design-output.md): for the five parts of the output and the step classification.
- [action writing](../../references/action-writing.md): for names and the five-part description.
- [groups design](../../references/groups-design.md): when an actor has no group key yet.
- [metadata field rules](../../references/metadata-fields.md): when defining workflow fields.

## Procedure

1. Extract explicit requirements with references to sections of the supplied procedure. Classify every source step as action, decision, folded, automation, intake, out_of_scope or conflict, with the reason and the owning action. Nothing is dropped without a row. Mark recommendations separately from requirements.
2. Choose Standard, Decision, Notification, Wait, HTTP Request, Sub-workflow or Form Fill by the required outcome. AI is an assignee on Standard actions. Do not represent a human approval as an automatic threshold engine.
3. For each action write a verb-led name and the five-part description to the assignee: task, method with numbered steps, evidence, done-when, exceptions. Fold hand-offs and sub-steps into the method of the owning action. Propose `due` from the stated service level or record an open decision; never invent a deadline.
4. Use sequential ordering for actual dependencies and parallel execution only for independent work. Model rework and rejection explicitly with supported decision outcomes and named return targets.
5. Assign owners by group key: reuse `groups[]` from the manifest, use `creator` for the requester, and propose new groups with flags for actors that have none. Never invent organization IDs.
6. Use a Form trigger for intake and Form Fill for an existing incident. Use a reusable sub-workflow only when it has its own meaningful start, completion and owner; identify mappings and cancellation behaviour.
7. Deliver the classification table, the action table, the Mermaid flow, the YAML skeleton and the manifest entry. Write `provia-project.json` when file creation is available and run `node scripts/build-project-map.mjs provia-project.json --check` when a shell is available; report the actual result. YAML validation belongs to `provia-workflow-package`.

## Deliverable

A source step classification, an action table with owners by group key and evidence, a Mermaid flow, a YAML skeleton with full descriptions, the manifest `workflows[]` entry with proposed `groups[]` and `decisions[]`, and the open decisions to answer before packaging. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: sources, groups, entityTypes, decisions. Appends: `workflows[]` with actions, `assigneeRef`, `sourceRefs`, `folded`; proposed `groups[]`; `decisions[]`. See [project manifest](../../references/project-manifest.md).

## Examples

- Transforme o nosso procedimento de compras num workflow. A chefia aprova o pedido e as Finanças confirmam a disponibilidade orçamental.
- Turn this onboarding SOP into actions, approvals and exception paths.

## Incomplete or conflicting input

If the procedure lacks a rejection path, identify the gap and propose one as a recommendation. If no service level is stated, leave `due` unset and record the decision.

If two procedure sections give different approvers, classify the step as conflict, keep it unresolved in `decisions[]` and do not silently choose.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
