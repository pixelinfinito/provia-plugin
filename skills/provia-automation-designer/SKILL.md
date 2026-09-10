---
name: provia-automation-designer
description: Specify Provia notifications, waits, triggers, HTTP calls and reusable sub-workflows.
---

# Automation and integrations

Read [country context](../../references/country-context.md) and [Provia capabilities](../../references/provia-capabilities.md) before making recommendations. Read the [Angola reference](../../references/countries/angola.md) when Angola applies. Country and response language are separate; respect an explicit user choice.

## Inputs

Target event, system API contract, payload examples, timing, access restrictions and failure handling. Use supplied documents and exports. This plugin has no Provia connection. Ask only for information that materially affects the task; identify assumptions and continue independent work.

## Procedure

1. Choose manual, email, webhook or schedule for an event; choose Form for structured human intake. Choose Notification for informing people and Wait for elapsed time or a supported condition.
2. For HTTP calls use the actual external API documentation or user-supplied contract. Never invent endpoints. Use organization secret references and identify destination allowlist requirements.
3. Specify idempotency where the external API supports it, expected responses, response mappings and what happens after retries fail.
4. For schedules use a numeric five-field cron and an explicit timezone. Workdays skip weekends; they do not implement statutory holiday calendars.
5. Keep AI judgment separate from deterministic calls and human decisions. Provide setup instructions instead of implying that the plugin has connected systems.

## Deliverable

An integration specification with mappings, dependencies, retries, timeouts and exception paths. Cite supplied evidence and product references. Separate confirmed facts, recommendations and unresolved decisions. Do not invent completed checks or platform actions.

## Examples

- Quando o pedido for aprovado, precisamos de o enviar para o ERP. Temos esta documentação da API.
- Design a monthly review trigger in Africa/Luanda with a clear missed-run policy.

## Incomplete or conflicting input

If the external API is unknown, produce an integration requirements list, not a guessed endpoint.

If retries can create duplicate purchases, identify the duplicate risk and require a supported idempotency or reconciliation design.
