# Project manifest (`provia-project/v1`)

One implementation project has one manifest, `provia-project.json`. Every skill reads it before starting and appends its result to it, so entity types, groups, workflow actions, forms and decisions are one graph rather than a folder of unrelated files. The map renderer draws that graph; `setup.md` is generated from what the manifest still leaves unresolved; the connected-mode `apply` steps consume it in dependency order.

This file is a plugin artefact. It is not a Provia import format and it never carries credentials or secret values.

## Shape

```json
{
  "schemaVersion": "provia-project/v1",
  "project": { "key": "compras", "title": "Pedido de compra", "language": "pt-AO", "country": "Angola",
               "timezone": "Africa/Luanda", "currency": "AOA", "generator": "provia-skills/1.1.0",
               "contractRevision": "2641364d9c1aa0aa2b76aa788ef521bcb6218118", "updatedAt": "2026-09-18" },
  "organization": { "name": "Empresa exemplo", "sector": "Serviços", "mode": "disconnected",
                    "tenantId": null, "productRevision": null },
  "sources": [ { "id": "sop-compras", "title": "Procedimento de compras", "kind": "sop", "version": "3",
                 "effectiveDate": "2026-01-01", "sections": [ { "anchor": "4.2", "title": "Aprovação do pedido" } ] } ],
  "entityTypes": [ /* provia-entity-catalogue/v1 type objects, unchanged */ ],
  "groups": [ { "key": "chefias", "name": "Chefias de departamento", "parentKey": null, "purpose": "…",
                "members": [ { "role": "Chefe de departamento", "email": null } ],
                "sourceRefs": [ { "source": "sop-compras", "section": "4.2" } ],
                "flags": [ { "code": "segregation", "detail": "…" } ] } ],
  "workflows": [ { "key": "compras", "name": "Pedido de compra", "prefix": "COMP", "file": "workflow.yaml",
                   "status": "packaged", "sourceRefs": [ { "source": "sop-compras" } ],
                   "actions": [ { "localId": "decidir", "name": "Decidir sobre o pedido", "type": "decision",
                                  "sourceRefs": [ { "source": "sop-compras", "section": "4.2" } ],
                                  "assigneeRef": "chefias", "formRef": null, "entityRefs": [ "fornecedor" ],
                                  "evidence": [ "Comentário obrigatório na rejeição" ],
                                  "due": { "offsetDays": 2, "offsetType": "workdays", "basis": "activation" },
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

- `schemaVersion` is `provia-project/v1`. `project.key`, every `key`, `id`, `localId` and `anchor` is a stable ASCII identifier (`[A-Za-z0-9][A-Za-z0-9_.-]*`), unique within its list.
- `organization.mode` is `disconnected` or `connected`; in connected mode `tenantId` and `productRevision` are filled from `org_get_context`.
- `sources[].kind` is `sop`, `policy`, `checklist`, `export`, `interview`, `catalogue` or `other`.
- `entityTypes[]` use the catalogue type shape from [entity catalogue format](entity-catalogue-format.md) and pass the same editorial checks.
- `groups[].parentKey` names another group; Provia allows one level of sub-groups, so a parent cannot itself have a parent. Member `email` is either null or an address; never a UUID.
- `workflows[].actions[].type` is a supported action type. `assigneeRef` is a group key, `creator`, `previous` or `ai:<profile key>`; `formRef` a form key; `entityRefs[]` entity type keys; `subWorkflowRefs[]` workflow keys. `sourceRefs[].source` is a source id and `section` one of its anchors when the source lists sections.
- `forms[].workflowRef` and `actionRef` resolve; a `trigger` form has no `actionRef`; an `action` form points at a `form_fill` action.
- `decisions[].status` is `open` or `resolved`; a resolved decision carries `resolution`.
- When `workflows[].file` exists next to the manifest, its action ids must equal the manifest `localId`s and its prefix the manifest prefix.

## What each skill reads and appends

| Skill | Reads | Appends or updates |
| --- | --- | --- |
| process-discovery | organization, sources | `sources[]`, `decisions[]`, the chosen pilot in `project.title` |
| workflow-designer | sources, groups, entityTypes, decisions | `workflows[]` with actions, `assigneeRef` by group key, proposed `groups[]` for new actors, `decisions[]` |
| information-model | sources, workflows | `entityTypes[]` (catalogue shape), `entityRefs` on actions that use them |
| form-designer | workflows | `forms[]` with `workflowRef` + `actionRef`, `formRef` on the action |
| organization-rollout | sources, workflows | `groups[]` with members, flags and `sourceRefs`; `decisions[]` for segregation questions |
| automation-designer | workflows | actions of type `notification`, `wait`, `http_request`, `sub_workflow`; `subWorkflowRefs`; `setupNotes` for secrets and allowlists |
| ai-action-designer | workflows | `aiProfiles[]`, `assigneeRef: ai:<key>` on the action |
| workflow-package | everything | `workflows[].file`, `status: packaged` or `validated`, `setupNotes` |
| workflow-review | everything | `decisions[]` for policy gaps; never changes the design silently |
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

`ref.kind` is `entity_type`, `group`, `workflow`, `form` or `tag`; `ref.key` is the manifest key. Outcomes `created`, `updated` and `no_op` resolve the reference; `dry_run` and `failed` do not. Until connected mode exists, receipts stay empty and every organization reference is an unresolved item in `setup.md`; implementers who configure by hand may record a manual receipt (`"tool": "manual"`, `outcome: "created"`, the real id) so the map turns green and `resolve-workflow-refs` can substitute the id.

Apply order in connected mode: entity types → groups → workflow drafts → forms and Form Fill links → owner assignment. The manifest is the source for every step; `setup.md` shrinks as receipts arrive.

## Commands

From the plugin root, Node.js 20.11 or newer, no network:

```bash
node scripts/build-project-map.mjs provia-project.json --check
node scripts/build-project-map.mjs provia-project.json --output project.html
node scripts/build-project-map.mjs provia-project.json --setup setup.md
node scripts/resolve-workflow-refs.mjs provia-project.json compras workflow.yaml --output workflow.resolved.yaml
```

`--check` validates the shape and every reference, and compares each `workflows[].file` next to the manifest with its actions. `--output` renders the offline map: a left rail (sources, entity types, groups, workflows, forms), the centre graph (SOP section → action → group / form / entity type, workflow → sub-workflow), a right panel for the selected node, an entity catalogue tab and an unresolved-items tab. Unresolved references are red; receipts are green. `--setup` writes the handover from unresolved items, open decisions, receipts and `setupNotes`, in the project language. `resolve-workflow-refs` substitutes group and workflow ids from receipts into a copy of the YAML; it never edits the source file and never invents an id.

Deliver `provia-project.json` and `project.html` together; regenerate the map after every change. Keep the manifest out of the plugin repository when it contains a real organization's data.
