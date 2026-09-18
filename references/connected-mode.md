# Connected mode (`provia-implementer` MCP)

Provia's API Gateway is gaining an MCP server, `provia-implementer`, specified in Provia feature 026 and pinned to the same product revision as this plugin's contract engine. When an implementer signs in through it, the skills can read the destination organization and create **draft** configuration on the implementer's behalf. This reference is the plugin side of that contract. Until the server is released in the implementer's environment, every skill behaves exactly as in disconnected mode; do not describe connected features as available when `org_get_context` is not offered by the host.

## Detect and pin

1. The host lists a tool named `org_get_context`. Call it once per session; record `tenantId`, `productRevision`, language and timezone in `organization` of the manifest and set `organization.mode: "connected"`.
2. Compare `productRevision` with `contractRevision` in `contracts/workflow-v1/contract-lock.json`. If they differ, say so and treat the destination as authoritative for icons (`provia://reference/entity-icons.json`) and validation (`workflow_import_draft` with `dryRun: true`).
3. Read before designing: `entity_types_list`, `groups_list`, `workflows_list`, `forms_list`, `setup_references_list`. Reuse existing types and groups instead of proposing duplicates; record what exists as `sources[]` of kind `catalogue`.

## Tools the skills may call

| Purpose | Tool | Scope |
| --- | --- | --- |
| Tenant context, existing configuration, users by email, YAML export of a live workflow | `org_get_context`, `entity_types_list`, `entity_type_get`, `groups_list`, `users_search`, `workflows_list`, `workflow_get`, `workflow_export_yaml`, `forms_list`, `form_get`, `tags_list`, `setup_references_list` | `implement:read` |
| Entity types from the catalogue shape | `entity_type_upsert`, `entity_types_apply_catalogue` | `implement:entity-types` |
| Groups from `groups[]` | `group_upsert`, `groups_apply_plan` | `implement:groups` |
| Workflow draft from the validated plan | `workflow_import_draft`, `workflow_create_draft_version`, `workflow_update_draft_actions` | `implement:workflows` |
| Forms and Form Fill links from `forms[]` | `form_upsert` | `implement:forms` |
| Tags | `tag_upsert` | `implement:tags` |

Nothing is published, deleted, completed, paid or notified through these tools. Publication, deletion and execution stay in the Provia UI.

## Apply, in dependency order

Offer `apply` only after the user has reviewed `project.html` and asked for it. Run each step as a dry run first, show the plan, then commit on confirmation:

1. **Entity types**: `entity_types_apply_catalogue` with `entityTypes[]` unchanged. Use `idempotencyKey: "<project.key>/entity-types/<type key>"`.
2. **Groups**: `groups_apply_plan`, parents first, members by email from `groups[].members`. Unknown emails come back as `unresolved_members`; record them as decisions, do not guess.
3. **Workflow draft**: run the bundled validator, then `workflow_import_draft` with the plan from `engine.planToImportRequest()` and `dryRun: true`; on a clean dry run, commit. Then `workflow_update_draft_actions` to set `defaultResponsibleType/Id` from the group receipts and to write the five-part descriptions.
4. **Forms**: `form_upsert` per `forms[]`, linking `actionRef` to the imported Form Fill template.
5. **Owners**: confirm every action's owner with `workflow_get`; anything still empty stays in `setup.md`.

Store every receipt in `receipts[]` with `ref` set to the manifest key it resolves. Regenerate `project.html` and `setup.md` after each step. `idempotencyKey` values are deterministic from the project key so a repeated apply is a no-op, not a duplicate.

## What stays manual

Publishing the workflow and forms, secrets values, HTTP allowlists, AI profile configuration, memory documents, page templates, tags on records, permissions beyond group membership, and any deletion. Say this in the handover; connected mode shortens `setup.md`, it does not empty it.
