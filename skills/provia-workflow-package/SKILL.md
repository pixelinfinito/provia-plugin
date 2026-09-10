---
name: provia-workflow-package
description: Generate, explain or repair portable Provia workflow YAML and run the bundled validator.
---

# Workflow package builder

Read [country context](../../references/country-context.md) and [Provia capabilities](../../references/provia-capabilities.md) before making recommendations. Read the [Angola reference](../../references/countries/angola.md) when Angola applies. Country and response language are separate; respect an explicit user choice.

## Inputs

An agreed design or YAML export, source contract version, known destination references and setup constraints. Use supplied documents and exports. This plugin has no Provia connection. Ask only for information that materially affects the task; identify assumptions and continue independent work.

## Procedure

1. Read ../../references/workflow-yaml.md and ../../contracts/workflow-v1/contract-lock.json before emitting YAML. Start from a relevant bundled example rather than inventing property names.
2. Emit provia.ao/v1 and Workflow. Preserve exact enum values, native booleans, integer offsets and stable local action IDs. Use only supported top-level sections.
3. Never invent organization UUIDs. If an intended assignee/reference is unknown, keep it in setup.md and explain any deliberate omission in the importable draft. Never silently replace the actual owner with the creator.
4. Keep credentials out of files. Use supported placeholders and secret references with named dependencies. Keep forms, tags, files, page templates, memory documents and unsupported assignment strategies in the handover.
5. Run node ../../scripts/validate-workflow.mjs <workflow.yaml> from this skill directory, or resolve that script from the installed plugin root. Node 20.11+ is required; no npm installation or network is needed.
6. Fix errors and run again. Return the exact validator output. If execution is unavailable, say validation was not run and provide the command. Do not simulate a successful validation report.
7. Explain errors, warnings and pending destination checks separately. Provia import preview/server dry run and a human publish review still follow. Do not call an export a full backup.

## Deliverable

workflow.yaml, validation.json and a separate setup.md describing remaining configuration. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Examples

- Gere o YAML do pedido de compra aprovado e valide o ficheiro antes de o entregar.
- Repair this exported YAML without changing the intended approval process.

## Incomplete or conflicting input

If owner IDs are unavailable, deliver a draft with an explicit assignment handover instead of fabricated UUIDs.

If the user requests embedded form definitions or translated YAML keys, explain the contract boundary and preserve the form specification separately.
