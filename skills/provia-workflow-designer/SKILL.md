---
name: provia-workflow-designer
description: Turn supplied procedures, SOPs and checklists into a Provia workflow design.
---

# Procedure-to-workflow designer

Read [country context](../../references/country-context.md) and [Provia capabilities](../../references/provia-capabilities.md) before making recommendations. Read the [Angola reference](../../references/countries/angola.md) when Angola applies. Country and response language are separate; respect an explicit user choice.

## Inputs

Procedure, start/end conditions, roles, approval rules, required evidence and exceptions. Use supplied documents and exports. This plugin has no Provia connection. Ask only for information that materially affects the task; identify assumptions and continue independent work.

## Procedure

1. Extract explicit requirements with references to sections of the supplied procedure. Mark recommendations separately.
2. Choose Standard, Decision, Notification, Wait, HTTP Request, Sub-workflow or Form Fill by the required outcome. AI is an assignee on Standard actions.
3. Use sequential ordering for actual dependencies and parallel execution only for independent work. Model rework and rejection explicitly with supported decision outcomes.
4. Use a Form trigger for intake and Form Fill for an existing incident. Do not represent a human approval as an automatic threshold engine.
5. Use a reusable sub-workflow only when it has its own meaningful start, completion and owner. Identify mappings and cancellation behavior.
6. Return a reviewable design first. When the user requests YAML, use the workflow-package skill and its actual validator.

## Deliverable

An action table, execution sequence, decision outcomes, assignments, due-date rationale and a source-to-design mapping. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Examples

- Transforme o nosso procedimento de compras num workflow. A chefia aprova o pedido e as Finanças confirmam a disponibilidade orçamental.
- Turn this onboarding SOP into actions, approvals and exception paths.

## Incomplete or conflicting input

If the procedure lacks a rejection path, identify the gap and propose one as a recommendation.

If two procedure sections give different approvers, expose the conflict and keep it unresolved rather than silently choosing.
