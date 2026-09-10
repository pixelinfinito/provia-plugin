# Portable workflow YAML

Emit `apiVersion: provia.ao/v1` and `kind: Workflow`. The legacy `provia.io/v1` alias is readable but should not be generated. Allowed top-level sections are metadata, triggers, entities, fields and actions. Unknown keys are not extensions. The full contract version and source fingerprints are in ../../contracts/workflow-v1/contract-lock.json relative to a skill, or ../contracts/workflow-v1/contract-lock.json from this reference.

## Shapes

- metadata: name, prefix, description, optional source version, icon, cosmetic color, targetDurationDays, targetDurationType and agentMemoryEnabled. Prefix is 2–10 uppercase alphanumeric characters. New imports start at version 1; source version is provenance.
- triggers: list of type, label, enabled and config. Portable types are manual, email, webhook and schedule. A schedule config has cronExpression, timezone and missedBehavior. Use numeric five-field cron. A form trigger cannot be authored here.
- entities: mode `none`, `entity_type` or `specific_entity`, entityType name, requirement `optional` or `required` where supported, specificEntityId, and fieldMapping entries with from/to. Destination types and records must already be resolved. Specific-entity exports are downgraded with a warning.
- fields: name, label, type, required, defaultValue, labelKey, isFixed, group, width and config. Select options belong in config.options as value/label objects. Valid widths are third, half and full. Field types include text, number, currency, date, datetime, boolean, select, multi_select, email, phone, url, user, entity, file, rich_text, color, rating and percentage.
- actions: id, type, name, description, executionMode, required, priority, due, assignee, aiWorker and config. Types are standard, decision, sub_workflow, notification, wait, http_request and form_fill. Priorities are time_sensitive, urgent and normal. Assignee types are user, group, creator, previous and ai_agent. Non-creator/previous references require actual destination IDs.
- due: integer offsetDays/offsetHours, offsetType calendar/workdays and basis activation/creation. Quote date strings as needed; do not quote booleans or use localized decimal strings as numbers.
- decision config.branches: objects with label, outcome, requiresComment and optional target/workflow. Outcomes are continue, cancel_incident, trigger_workflow and return_to_action. A return target is a local action ID. State outcomes explicitly; a bare label “Reject” otherwise defaults to continue.
- HTTP config: endpoint, method, headers as a list of key/value/enabled objects, body, executionTiming and supported response mappings. Use actual API documentation. Never use an object map for headers. Keep secret placeholders or organization secret references, not values.

The engine bundles the real parser, preview rules, conversion functions, import request schema, action configuration schemas, metadata checks and trigger validation from the recorded Provia revision. It excludes application UI and runtime service access. It has no package-install or network requirement at runtime beyond Node 20.11+.

For full type-specific generation details, read [Action configuration details](action-configs.md), including HTTP bodies/retries, waits, notifications, child workflows and AI settings.

## Validation and handover

Run `node scripts/validate-workflow.mjs path/to/workflow.yaml` from the plugin root. A compatible workflow ZIP can be checked with the same command. Exit 0 means the checks performed found no errors; exit 1 means validation errors; exit 2 means the input could not be read. The JSON report states whether backend schema checks ran. Unresolved placeholders can prevent those checks. Organization references and imported child workflows still require destination validation.

The YAML input limit is 1 MiB in UTF-8. The backend plan has its own 1 MiB cap. There are at most 20 triggers, 100 actions, 10 options per decision and 50 created secrets. Archive extraction is separately bounded by the product engine. These are file/import limits, not permission or subscription guarantees.

Deliver workflow.yaml, the actual validation.json output and setup.md. Do not edit a result to claim success. If a validator cannot run, state “not run”. Always preserve pending destination validation and human publication review.

Setup must cover actual users/groups/AI profiles, referenced workflows/entities, secret names, HTTP allowlists, generated inbound email, and excluded resources. Never fabricate IDs or substitute the creator for an intended approver without disclosing the draft simplification. Restrictive imported trigger allowlists can be narrowed to the importer when source principals do not exist; review the server warning before use.

## Portability exclusions

Forms, intake form triggers, Form Fill links, workflow page templates, attachments, tags, memory documents and assignmentStrategy are not carried. The memory-enabled flag is not the memory content. UI hints such as color are not all persisted. Source IDs, history, timestamps and version lineage are not a backup. Recreate supported excluded configuration in Provia and disclose configuration the product itself cannot currently express.

A plugin installation ZIP contains skills and tools. A Provia workflow import ZIP contains manifest.yaml and workflows/*.yaml. They are different artifacts. Never instruct users to import the plugin ZIP as a workflow.
