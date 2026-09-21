# Exported YAML repair — status report

Skill: `provia-workflow-package` (provia-skills 1.2.0, contract `provia.ao/v1`, source revision `fed8efaf…`). Date: 2026-09-21. Country/language: Angola / English, provisional — none was supplied (decision D5).

## 1. What was received

| Input the skill needs | Found |
| --- | --- |
| Exported workflow YAML (or import ZIP) | **No.** The working directory was empty: no `.yaml`, `.yml` or `.zip`. |
| `provia-project.json` manifest | No. Created in this run (see §3) to hold the open decisions only. |
| Agreed design / description of the intended approval process | No. |
| Group receipts / destination ids for approvers | No. |
| Provia connector (`org_get_context`, `workflow_export_yaml`) | Offered by the host, but the call to `org_get_context` was **not permitted** in this session. The export could not be pulled from the tenant either. |

Because the file to repair does not exist here, no parsing, repair, validation or editorial review of a workflow took place. Nothing below claims otherwise.

## 2. Confirmed facts

- `node scripts/validate-workflow.mjs` was invoked from the plugin root with no file; it answered `Usage: node scripts/validate-workflow.mjs workflow.yaml` and exit code 2 ("input could not be read"). That is the only validator run in this session. **No `validation.json` was written**, because there was no workflow to validate and the skill forbids simulating a report.
- `node scripts/review-actions.mjs` was not run on a workflow (same reason). No review-actions report exists.
- `node scripts/build-project-map.mjs provia-project.json --check` ran on the manifest created here: `0 workflows, 0 groups, 0 entity types, 0 forms; 5 pending item(s), 0 warning(s)`. This checks the manifest, not any workflow.
- Node v26.7.0 satisfies the 20.11+ requirement; the bundled scripts run offline.
- No workflow was read, created or changed in any Provia organization.

## 3. Files in this directory

| File | Origin | What it is |
| --- | --- | --- |
| `provia-project.json` | written by hand | Minimal manifest, `mode: disconnected`, empty `workflows[]`, five open decisions (D1–D5). |
| `setup.md` | generated, `build-project-map.mjs --setup` | Handover with the open decisions. "Nothing pending" under *Pending configuration* means no workflow entry exists yet, not that setup is complete. |
| `project.html` | generated, `build-project-map.mjs --output` | Project map of the same manifest. |
| `repair-report.md` | written by hand | This file. |
| `editorial-review.md` | written by hand | Records that the editorial review of action descriptions could not be performed. |

Not delivered: `workflow.yaml`, `validation.json`, review-actions report. The intended approval process is unknown, so writing a workflow would mean inventing it — the one thing the request rules out.

## 4. What "repair without changing the approval process" will mean once the export arrives

The repairs below are the ones an export typically needs and that leave the approval semantics intact. Anything in the second list changes who approves, what happens on rejection or where a case returns to, and needs the process owner (D2) before it is touched.

### 4.1 Semantics-preserving repairs (applied without asking)

| Symptom in the export | Repair |
| --- | --- |
| `apiVersion: provia.io/v1` (validator warning `legacy_version`) | `provia.ao/v1`; add first line `# provia-skills 1.2.0`. |
| Unknown top-level key, e.g. `permissions:` (`schema.unknown_key`) | Move grants to `access:` with `default` and `grants: [{ grantee, level }]`; grantees `group:<name>`, `user:<email>`, `organization`. Never keep `permissions:`. |
| Missing `access:` section (`workflow.access.not_declared`) | Declare it from the manifest with `emit-workflow-access.mjs`. An export carrying `access_omitted_no_admin` is not creator-only and is reported as such. |
| Booleans as strings (`"true"`), offsets as `"3"` or `3,5` | Native `true`/`false`, integer `offsetDays`/`offsetHours`. |
| `metadata.prefix` outside 2–10 uppercase alphanumerics | Normalise the prefix; the name and description stay. |
| Exported `metadata.version` > 1 | Keep it as source provenance; the import starts at version 1. |
| Manual trigger `allowedGroups`/`allowedUsers` with names or keys instead of UUIDs | Substitute ids from receipts via `resolve-workflow-refs.mjs`; if no receipt exists, remove the list from the YAML **and** keep a blocking "restrict manual start" step in `setup.md`. Never drop the restriction silently. |
| Assignee `user`/`group`/`ai_agent` with a source-tenant id that is not the destination's | Omit `assignee`; the action appears in `setup.md` as `assignment_missing`. Never substitute the creator without saying so; never invent a UUID. |
| HTTP headers as an object map | List of `{ key, value, enabled }`. |
| Secret values in the file | Replace with `{{secret:NAME}}` / `$PLACEHOLDER`; name the dependency in `setup.md`. |
| `entities.mode: specific_entity` | Downgrade to `entity_type` with a warning; the record is resolved in Provia. |
| Select options inline instead of `config.options`; dependent options without `config.parentField` | Move to `config`; generated fields never `required` or defaulted. |
| Form triggers, page templates, tags, memory documents, assignmentStrategy | Not portable: removed from the YAML, listed in `setup.md` for manual recreation. |
| Action description not in five parts (task, method, evidence, done-when, exceptions) or containing implementer notes | Rewrite per `action-writing.md`; move implementer notes to the manifest `setupNotes`. Wording only — owner, sequence and outcomes unchanged. |

### 4.2 Changes that alter the process (blocked until D2 is answered)

- Adding, removing or reordering approval steps, or changing an action's `type`.
- Changing a decision branch `outcome` (`continue`, `cancel_incident`, `return_to_action`, `trigger_workflow`) or its `target`. A branch labelled "Reject" with no explicit outcome defaults to `continue`; that is flagged, not silently fixed, because the intended rejection path is unknown.
- Setting `requiresComment` on a branch that did not have it, or removing it.
- Replacing a group approver with a user, the creator or `previous`.
- Changing `required`, `priority` or `due` on an approval action.

## 5. Recommendations

1. Attach the export as `workflow.yaml` in this directory (or authorize the Provia connector so `workflow_export_yaml` can fetch it, with the workflow id).
2. Name the process owner and confirm the approval chain in one paragraph — enough to check the branches against.
3. Supply group receipts or accept a draft with omitted assignees and a handover.

## 6. Resume procedure (terminal commands, from the plugin root, paths relative to this directory)

```sh
node scripts/validate-workflow.mjs <this dir>/workflow.yaml > <this dir>/validation.json
node scripts/review-actions.mjs <this dir>/workflow.yaml --markdown
node scripts/emit-workflow-access.mjs <this dir>/provia-project.json <workflow key> <this dir>/workflow.yaml --output <this dir>/workflow.yaml
node scripts/resolve-workflow-refs.mjs <this dir>/provia-project.json <workflow key> <this dir>/workflow.yaml --output <this dir>/workflow.resolved.yaml
node scripts/build-project-map.mjs <this dir>/provia-project.json --check
node scripts/build-project-map.mjs <this dir>/provia-project.json --setup <this dir>/setup.md
node scripts/build-project-map.mjs <this dir>/provia-project.json --output <this dir>/project.html
```

After a green validator run, the Provia import preview (server dry run) and a human publish review still follow. An export is not a backup: history, versions, forms, tags and attachments do not travel with it.

## 7. Unresolved decisions

D1–D5 in `provia-project.json` and `setup.md`. All five are open; D1 (the file itself) blocks everything else.
