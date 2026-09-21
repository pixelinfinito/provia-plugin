# Project manifest (`provia-project/v1.1`)

One implementation project has one manifest, `provia-project.json`. Every skill reads it before starting and appends its result to it, so entity types, groups, workflow actions, forms and decisions are one graph rather than a folder of unrelated files. The map renderer draws that graph; `setup.md` is generated from what the manifest still leaves unresolved; the connected-mode `apply` steps consume it in dependency order.

This file is a plugin artefact. It is not a Provia import format and it never carries credentials or secret values. Its JSON Schema is [project-manifest.schema.json](project-manifest.schema.json); `--check` remains authoritative for cross-references and the access rules. Manifests still marked `provia-project/v1` are accepted with a warning; `scripts/reconcile-access.mjs` proposes the `access` sections that 1.1 requires.

## Shape

```json
{
  "schemaVersion": "provia-project/v1.1",
  "project": { "key": "compras", "title": "Pedido de compra", "language": "pt-AO", "country": "Angola",
               "timezone": "Africa/Luanda", "currency": "AOA", "generator": "provia-skills/1.2.0",
               "contractRevision": "fed8efaf019abc901cb2b229f3676dc4031126fa", "updatedAt": "2026-09-21" },
  "organization": { "name": "Empresa exemplo", "sector": "Serviços", "mode": "disconnected",
                    "tenantId": null, "productRevision": null },
  "sources": [ { "id": "sop-compras", "title": "Procedimento de compras", "kind": "sop", "version": "3",
                 "effectiveDate": "2026-01-01", "sections": [ { "anchor": "4.2", "title": "Aprovação do pedido" } ],
                 "emails": [ "daf@empresa.ao" ] } ],
  "entityTypes": [ /* provia-entity-catalogue/v1 type objects, unchanged */ ],
  "groups": [ { "key": "chefias", "name": "Chefias de departamento", "kind": "team", "area": "operacoes", "parentKey": null, "purpose": "…",
                "members": [ { "role": "Chefe de departamento", "email": "chefe@empresa.ao", "verified": true, "source": "users_search" } ],
                "sourceRefs": [ { "source": "sop-compras", "section": "4.2" } ],
                "flags": [ { "code": "segregation", "detail": "…" } ] } ],
  "workflows": [ { "key": "compras", "name": "Pedido de compra", "prefix": "COMP", "file": "workflow.yaml",
                   "status": "packaged", "ownerArea": "gestao_corporativa", "sourceRefs": [ { "source": "sop-compras" } ],
                   "access": { "grants": [ { "grantee": "organization", "level": "create_incident",
                                             "reason": "Qualquer colaborador abre um pedido", "sourceRefs": [ { "source": "sop-compras", "section": "4.2" } ] } ],
                               "sensitivity": "internal" },
                   "triggers": [ { "type": "manual", "label": "Iniciar pedido", "enabled": true, "manual": { "allowedGroups": [] } } ],
                   "templates": [ { "code": "EMP-GC-MOD-003", "title": "Requisição interna", "url": null, "scope": "action" } ],
                   "unresolvedActors": [], "unresolvedEntityTypes": [],
                   "actions": [ { "localId": "decidir", "name": "Decidir sobre o pedido", "type": "decision",
                                  "sourceRefs": [ { "source": "sop-compras", "section": "4.2" } ],
                                  "assigneeRef": "chefias", "formRef": null, "entityRefs": [ "fornecedor" ],
                                  "evidence": [ "Comentário obrigatório na rejeição" ],
                                  "due": { "offsetDays": 2, "offsetType": "workdays", "basis": "activation" },
                                  "dueInSource": null,
                                  "folded": [ { "section": "4.3", "summary": "Informar o requerente" } ] } ],
                   "subWorkflowRefs": [], "setupNotes": [ "…" ] } ],
  "forms": [ { "key": "registo-decisao", "title": "Registo da decisão", "kind": "action",
               "workflowRef": "compras", "actionRef": "decidir", "status": "designed", "fields": [ /* free shape */ ] } ],
  "aiProfiles": [ { "key": "resumo-propostas", "name": "Resumo de propostas", "workflowRef": "compras", "actionRef": "resumir" } ],
  "decisions": [ { "id": "D1", "question": "Quem aprova acima de 5.000.000 Kz?", "owner": "Director financeiro",
                   "status": "open", "raisedBy": "provia-workflow-designer", "sourceRefs": [ { "source": "sop-compras", "section": "4.2" } ] } ],
  "receipts": [ /* connected-mode receipts, see below */ ]
}
```

Rules the checker enforces:

- `schemaVersion` is `provia-project/v1.1` (`v1` accepted with a warning). `project.key`, every `key`, `id`, `localId` and `anchor` is a stable ASCII identifier (`[A-Za-z0-9][A-Za-z0-9_.-]*`), unique within its list.
- Alternate shapes converge with a normalisation warning instead of an error: `sections` as strings, `sourceRefs` as `"source#anchor"`, `folded` as strings and `forms[].name` for `title`.
- `organization.mode` is `disconnected` or `connected`; in connected mode `tenantId` and `productRevision` are filled from `org_get_context`.
- `sources[].kind` is `sop`, `policy`, `checklist`, `export`, `interview`, `catalogue` or `other`.
- `entityTypes[]` use the catalogue type shape from [entity catalogue format](entity-catalogue-format.md) and pass the same editorial checks.
- `groups[].parentKey` names another group; Provia allows one level of sub-groups, so a parent cannot itself have a parent. `kind` is `team`, `container` or `role`; `area` a short key. Member `email` is either null or an address, never a UUID; it is `verified: true` only with a `source` (a source id or `users_search`), otherwise it is reported as unverified. Two groups with the same `name` are a warning (the importer would report the grant ambiguous).
- `workflows[].actions[].type` is a supported action type. `assigneeRef` is a group key, `creator`, `previous`, `ai:<profile key>` or `field:<field key>`; `formRef` a form key; `entityRefs[]` entity type keys; `subWorkflowRefs[]` workflow keys. `sourceRefs[].source` is a source id and `section` one of its anchors when the source lists sections.
- `field:<key>` is a design requirement, not an executable assignee: the contract and the backend cannot assign from a case field. It needs `assigneeFallback` (a `role` group key or `creator`) that the YAML carries; `--check` verifies the field exists in the workflow file and is of type `user` (error otherwise) and warns when no earlier action (`setsFields`) or intake form fills it. `setup.md` lists the action as "owner set manually per case".
- `actions[].dueInSource` `{ text, kind: calendar_day | countdown | event_relative | legal }` keeps the source deadline when `due` cannot express it; `setup.md` lists it as manual configuration.
- `workflows[].templates[]` `{ code, title, url, scope }` lists the document templates cited in descriptions; `--check` warns when a code such as `EMP-GC-MOD-003` appears in a description without an entry.
- `workflows[].unresolvedActors[]` and `unresolvedEntityTypes[]` record a key the canonical registry lacks instead of inventing one; `--check` sums them and `setup.md` lists them.
- `workflows[].access` follows [workflow access](workflow-access.md): every workflow declares at least one grant or `default: creator_only` (error otherwise), grantees resolve, levels are the four product levels, `restricted` never grants the organization `view`-or-above, an assigned group's `view` needs a source-backed reason. `workflows[].triggers[]` carry manual allowlists as group keys; rule 8 keeps them coherent with the grants. `ownerArea` makes cross-area starts and sub-workflow calls visible.
- `forms[].workflowRef` and `actionRef` resolve; a `trigger` form has no `actionRef`; an `action` form points at a `form_fill` action.
- `decisions[].status` is `open` or `resolved`; a resolved decision carries `resolution`.
- When `workflows[].file` exists next to the manifest, its action ids must equal the manifest `localId`s and its prefix the manifest prefix.

## What each skill reads and appends

| Skill | Reads | Appends or updates |
| --- | --- | --- |
| process-discovery | organization, sources | `sources[]`, `decisions[]`, the chosen pilot in `project.title` |
| workflow-designer | sources, groups, entityTypes, decisions | `workflows[]` with actions, `assigneeRef` by group key, `access` (who opens, who owns the design, sensitivity), `ownerArea`, `triggers[]`, `templates[]`, `unresolvedActors[]`/`unresolvedEntityTypes[]`, proposed `groups[]` for new actors, `decisions[]` |
| information-model | sources, workflows | `entityTypes[]` (catalogue shape), `entityRefs` on actions that use them |
| form-designer | workflows | `forms[]` with `workflowRef` + `actionRef`, `formRef` on the action |
| organization-rollout | sources, workflows | `groups[]` with `kind`, `area`, members (`verified`, `source`), flags and `sourceRefs`; the access matrix across workflows (`workflows[].access`, `ownerArea`, unique names, organization-wide grants); `decisions[]` for segregation questions |
| automation-designer | workflows | actions of type `notification`, `wait`, `http_request`, `sub_workflow`; `subWorkflowRefs`; `setupNotes` for secrets and allowlists |
| ai-action-designer | workflows | `aiProfiles[]`, `assigneeRef: ai:<key>` on the action |
| workflow-package | everything | `workflows[].file`, `status: packaged` or `validated`, `setupNotes`; the `access` section in the YAML (`emit-workflow-access.mjs`), `access.operations[]` and `access.applied[]` in connected mode |
| workflow-review | everything | `decisions[]` for policy gaps; never changes the design silently; fails readiness on access rules 1, 3, 5, the error branches of 4 and 8, unresolved `field:` fallbacks and blocking retained grants |
| workflow-change | workflows, receipts | a new `workflows[]` entry or a new `status: change_planned` on the affected one, `decisions[]` |
| controls-evidence, operations-triage, process-improvement, process-knowledge | workflows, groups, decisions | `decisions[]` and `setupNotes`; findings stay in their own reports |

Append, do not overwrite: keep other skills' entries; update `project.updatedAt`; bump nothing else. When the user works without a manifest and does not want one, say so and continue; the deliverable does not depend on it.

## Resolution and receipts

A reference is *resolved* when a receipt names it. Receipts follow the `provia-implementer` server contract (Provia feature 026) and gain one plugin field, `ref`, that links the receipt back to the manifest:

```json
{ "tool": "group_upsert", "idempotencyKey": "compras/groups/chefias", "outcome": "created",
  "resource": { "kind": "group", "id": "8d3c…", "name": "Chefias de departamento" },
  "ref": { "kind": "group", "key": "chefias" }, "changes": [], "warnings": [], "unresolved": [],
  "auditId": "…", "at": "2026-09-18T15:04:05Z", "by": { "userId": "…", "name": "…" } }
```

`ref.kind` is `entity_type`, `group`, `workflow`, `form`, `tag`, `access` (a `workflow_access_apply` receipt, keyed by the workflow) or `user` (a `users_search` result, keyed by the lower-case email, used for allowlisted users); `ref.key` is the manifest key. A receipt whose `warnings` include `access_disabled` is surfaced in `setup.md` as zero grants written, never as success. Outcomes `created`, `updated` and `no_op` resolve the reference; `dry_run` and `failed` do not. Until connected mode exists, receipts stay empty and every organization reference is an unresolved item in `setup.md`; implementers who configure by hand may record a manual receipt (`"tool": "manual"`, `outcome: "created"`, the real id) so the map turns green and `resolve-workflow-refs` can substitute the id.

Apply order in connected mode: entity types → groups → workflow drafts → forms and Form Fill links → owner assignment → access. The manifest is the source for every step; `setup.md` shrinks as receipts arrive. Its mode line derives from `receipts.length`: no receipts is manual configuration (even when `organization.mode` is `connected`), receipts with pending items is a partial apply, receipts with nothing pending is applied.

## Commands

From the plugin root, Node.js 20.11 or newer, no network:

```bash
node scripts/build-project-map.mjs provia-project.json --check
node scripts/build-project-map.mjs provia-project.json --output project.html
node scripts/build-project-map.mjs provia-project.json --setup setup.md
node scripts/resolve-workflow-refs.mjs provia-project.json compras workflow.yaml --output workflow.resolved.yaml
node scripts/emit-workflow-access.mjs provia-project.json compras workflow.yaml --output workflow.access.yaml
node scripts/plan-workflow-access.mjs provia-project.json compras --mode merge
node scripts/reconcile-access.mjs provia-project.json --output provia-project.reconciled.json
```

`--check` validates the shape and every reference, applies the access rules (errors, warnings and infos), computes retained tenant grants and readiness, and compares each `workflows[].file` next to the manifest with its actions. Its summary line counts workflows with declared access, readiness blocks and unresolved actor/entity keys. `--output` renders the offline map, a single HTML file with no external assets: every object is embedded once as JSON and the selected view is rendered on demand from the URL fragment (`#workflow/compras/action/decidir`, `#entity/fornecedor`, `#review?cat=design`). It opens on a project overview (workflows grouped by area with owners and separate statuses for design, validation, customer approval and application evidence), has directories for entity types, forms, groups, sources, AI profiles and decisions, a page per object (workflow with its execution flow drawn from the YAML sequencing and decision branches, action with the five-part brief, entity type with field table and copy controls, form with a field preview, group with members and responsibilities, source with its sections and what cites them), review queues (design questions, validation findings from `--check`, setup still to apply, blockers) with browser-local review notes exportable by object id, an access table and an optional scoped dependency graph. Search covers names, keys, descriptions and fields with accents ignored. `--setup` writes the handover from unresolved items, the access table, unverified emails, open decisions, receipts and `setupNotes`, in the project language. `resolve-workflow-refs` substitutes group and workflow ids and manual-trigger allowlists from receipts into a copy of the YAML and prints the `groupRefs` and importer-shaped `access` for the plan; `emit-workflow-access` writes the `access` section by group name for a browser import; `plan-workflow-access` builds the `workflow_access_apply` request with its revision; `reconcile-access` proposes access for older manifests. None of them edits a source file or invents an id.

Deliver `provia-project.json` and `project.html` together; regenerate the map after every change. Keep the manifest out of the plugin repository when it contains a real organization's data.
