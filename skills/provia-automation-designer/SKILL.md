---
name: provia-automation-designer
description: "Specify Provia notifications, waits, triggers, HTTP calls and reusable sub-workflows from actual API documentation. Use when the user asks for \"send the approved request to the ERP\", \"notify finance when approved\", \"schedule a monthly review\", \"call this API from the workflow\", or says «enviar o pedido aprovado para o ERP», «avisar as Finanças quando for aprovado», «agendar uma revisão mensal», «integrar com o sistema de facturação»."
---

<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not this file. -->

# Automation and integrations

Read [shared conventions](../../references/skill-conventions.md) first. Country and language, disconnected or connected mode, the project manifest, the honesty rules, action wording and the final recommendation apply to this skill without being repeated here.

## Inputs

Target event, system API contract, payload examples, timing, access restrictions and failure handling; the manifest workflow the automation belongs to.

## References

- [action configuration details](../../references/action-configs.md): for HTTP bodies, retries, waits, notifications and child workflows.
- [action writing](../../references/action-writing.md): to name the actual operation.

## Procedure

1. Choose manual, email, webhook or schedule for an event; choose Form for structured human intake. Choose Notification for informing people and Wait for elapsed time or a supported condition.
2. For HTTP calls use the actual external API documentation or user-supplied contract. Never invent endpoints. Use organization secret references and identify destination allowlist requirements.
3. Specify idempotency where the external API supports it, expected responses, response mappings and what happens after retries fail.
4. For schedules use a numeric five-field cron and an explicit timezone. Workdays skip weekends; they do not implement statutory holiday calendars.
5. Name the actual operation (a status lookup is not payment execution) and describe it so a case reader understands what ran. Keep AI judgment separate from deterministic calls and human decisions.
6. Add the automated actions to the manifest workflow with `sourceRefs`, `subWorkflowRefs` for child workflows, and `setupNotes` for secret names and allowlists. Provide setup instructions instead of implying that the plugin has connected systems.

## Deliverable

An integration specification with mappings, dependencies, retries, timeouts and exception paths, and the manifest actions and setup notes it needs. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Project manifest

Reads: workflows. Appends: automated actions, `subWorkflowRefs`, `setupNotes` for secrets and allowlists. See [project manifest](../../references/project-manifest.md).

## Examples

- Quando o pedido for aprovado, precisamos de o enviar para o ERP. Temos esta documentação da API.
- Design a monthly review trigger in Africa/Luanda with a clear missed-run policy.

## Incomplete or conflicting input

If the external API is unknown, produce an integration requirements list, not a guessed endpoint.

If retries can create duplicate purchases, identify the duplicate risk and require a supported idempotency or reconciliation design.

## Final chat recommendation

End the final chat response with the most useful next skill, a brief reason and a copyable request carrying this task's artefacts and the manifest forward, following [next-step guidance](../../references/next-step.md). It is a recommendation, not an automatic invocation.
