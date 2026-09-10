---
name: provia-workflow-review
description: Review a Provia workflow for ownership, sequencing, evidence, exceptions and publication readiness.
---

# Workflow design review

Read [country context](../../references/country-context.md) and [Provia capabilities](../../references/provia-capabilities.md) before making recommendations. Read the [Angola reference](../../references/countries/angola.md) when Angola applies. Country and response language are separate; respect an explicit user choice.

## Inputs

Workflow design or export, intended business outcome, procedure and known dependencies. Use supplied documents and exports. This plugin has no Provia connection. Ask only for information that materially affects the task; identify assumptions and continue independent work.

## Procedure

1. Trace each required outcome to an action and its completion evidence. Check that decisions include rejection/rework where the procedure requires them.
2. Check predecessor dependencies, parallel actions, missing owners, unavailable groups, due bases and cancellation behavior.
3. Review data collection, form mappings and secret dependencies. Use workflow-package for executable YAML checks; do not replace those checks with visual inspection.
4. Distinguish a product contract error, a business-policy gap and an optional improvement. Do not claim organizational or legal compliance from a structurally valid file.
5. Return normal, rejected, incomplete and failed-integration scenarios with expected visible results. Leave destination validation and publication clearly pending.

## Deliverable

A prioritized findings list with evidence, proposed corrections and representative test scenarios. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Examples

- Reveja este workflow antes de publicarmos. Procure etapas sem responsável e caminhos de rejeição em falta.
- Can these parallel actions start before budget approval?

## Incomplete or conflicting input

If the SOP is absent, review structural issues and identify which policy questions cannot be adjudicated.

If the YAML validates but the process bypasses approval, report the business defect separately from file validity.
