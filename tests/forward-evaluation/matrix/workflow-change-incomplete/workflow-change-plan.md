# Change plan: add an approval to a live workflow without losing evidence from open cases

Prepared by `provia-workflow-change` (provia-skills 1.2.0, contract revision `fed8efaf`), 2026-09-21.
Country: Angola, provisional (not stated in the request). Language: English (language of the request).

## 1. What this plan is based on

| Input the skill needs | Supplied? | Consequence |
| --- | --- | --- |
| Change request | Partly: one sentence in chat (source `cr-extra-approval`) | Position, approver, outcomes and effective date are open decisions D2, D3, D7 |
| Current design (live YAML export, or `workflow.yaml` + manifest) | No | No semantic before/after on real actions; §3 gives the comparison frame and the fragment to insert |
| Proposed design | No | Derived from the request only |
| Manifest and receipts | No manifest in the working directory; one was created | `workflows[]` is empty: the `status: change_planned` entry cannot be written against an unknown workflow (§8) |
| Active-incident evidence (export or tenant read) | No. The Provia connector call (`org_get_context`) was declined in this session, so nothing was read from a tenant | **Active-incident impact check: pending** (D6) |
| Affected fields, forms, integrations | No | Field-migration and dependency checks pending (D5) |

Everything below separates **confirmed product behaviour** (from the plugin's capability baseline and contract lock), **recommendations** and **decisions the owner must take**. No check against a tenant, no validation of a YAML file and no publication was performed.

## 2. Confirmed product behaviour that the plan relies on

Source: `references/provia-capabilities.md`, `references/workflow-yaml.md`, `references/workflow-access.md`, `references/metadata-fields.md` of the plugin, pinned to Provia revision `fed8efaf…`. Verify against the customer's actual environment before relying on any line for a legal or contractual statement.

1. Publication creates an active workflow **version**. New incidents use the active design. Existing incidents keep the actions that were instantiated for them; they do not gain, lose or reorder actions when a new version is published.
2. Evidence (comments, files, pages, metadata values, decision records) lives on the **incident**, not on the version. Publishing a new version deletes none of it.
3. Metadata validation on an existing incident can still consult **workflow-level** field configuration. Removing, renaming, re-typing or making a field required is therefore a risk for open incidents: their next metadata edit may fail validation or lose a value.
4. There is **no** side-by-side version comparison and **no** one-click rollback. Re-importing YAML (`workflow_import_draft` or browser import) creates a **new draft lineage**: a new workflow, without history, receipts, grants or open cases.
5. Access grants belong to the workflow **id** and survive new versions. Duplication or re-import does not copy them.
6. Trigger (intake) forms are published independently of the workflow; Form Fill definitions are frozen with the workflow publication.
7. Automatic numbering continues across versions of the same workflow family; a re-import starts a new counter.
8. Decision outcomes are `continue`, `cancel_incident`, `trigger_workflow` and `return_to_action`, each with `requiresComment`. No value-based automatic branching.
9. Workday offsets skip weekends only, not Angolan public holidays.

## 3. Semantic comparison (frame, to be filled from the live export)

Because the current design was not supplied, the table below is the comparison the owner must confirm once the live YAML is available. The only intended change is **one inserted Decision action**; every other row must read "unchanged" or the change is out of scope for this plan and needs its own assessment.

| Aspect | Current version (to read from export) | Proposed version | Kind of change |
| --- | --- | --- | --- |
| Intended behaviour | … | The case cannot proceed past the insertion point until the new approver decides | Routing |
| Owners | … | One new assignee group for the new action (D3); other assignments unchanged | Assignment |
| Decisions | … | New decision with named outcomes (D3); existing decisions and their targets unchanged | Routing |
| Fields | … | **Recommendation: none** added as required, none removed or renamed. If approval evidence needs a field, add it `required: false` (D5) | Data |
| Forms | … | Unchanged. Any Form Fill change is frozen at publication and must be listed (D5) | Forms |
| Integrations (HTTP, sub-workflows, notifications, waits) | … | Unchanged, but any action that follows the insertion point now starts later; check timeouts and waits on the following actions | External operations |
| Permissions / access | … | Unchanged. The approver group needs **no** grant: assignees see their own cases. A `view` grant to the approver group only if the source says they follow every case | Permissions |
| Triggers | … | Unchanged | — |
| Names and descriptions | … | Only the new action's five-part brief. No editorial rewrite of existing actions in this version | Editorial (keep separate) |
| Due dates | … | New action: `due` only if the process owner states a service level (D3); never invented | — |

Keep editorial corrections to existing actions **out** of this version. Mixing wording fixes with a routing change makes the test evidence and the recovery path harder to read.

### Fragment to insert (portable YAML, `provia.ao/v1`)

Placeholders in angle brackets are the owner's decisions, not values. The description uses the five-part brief required by `references/action-writing.md`; `review-actions.mjs` will report any missing part when the file exists.

```yaml
  - id: approve_<subject>
    type: decision
    name: Decide on the <subject> approval
    description: |
      Task: Decide whether the <subject> may proceed, based on <criterion stated by the process owner>.
      How: 1. Open the case and read <the fields/attachments the approver must check>. 2. Confirm <criterion>. 3. Choose «Approve», «Reject» or «Return».
      Evidence: A comment with the reason is mandatory on «Reject» and «Return». Attach <the approval document, if the procedure names one>.
      Done when: The decision is recorded with the required comment.
      Exceptions: If the matter exceeds your authority, do not decide: comment and choose «Return» so the requester can route it to the competent authority.
    executionMode: sequential
    required: true
    priority: normal
    assignee: { type: group, id: "<destination group id, resolved from receipts or setup.md>" }
    config:
      branches:
        - { label: Approve, outcome: continue, requiresComment: false }
        - { label: Reject, outcome: <cancel_incident | return_to_action>, requiresComment: true, target: <local id of the action to return to> }
        - { label: Return, outcome: return_to_action, requiresComment: true, target: <local id of the preceding action> }
```

Manifest counterpart for the same action (goes into `workflows[].actions[]` once the workflow entry exists):

```json
{ "localId": "approve_<subject>", "name": "Decide on the <subject> approval", "type": "decision",
  "sourceRefs": [ { "source": "cr-extra-approval", "section": "request" } ],
  "assigneeRef": "<group key>", "formRef": null, "entityRefs": [],
  "evidence": [ "Mandatory comment on Reject and Return" ], "due": null, "dueInSource": null, "folded": [] }
```

## 4. Impact assessment

### 4.1 Open cases (the evidence question)

**Confirmed:** open incidents keep their instantiated actions and all their evidence when the new version is published. They will complete **without** the extra approval. Nothing is lost by publishing.

**Where evidence is actually at risk** (all avoidable):

| Action someone might take | Effect on evidence | Plan |
| --- | --- | --- |
| Cancel open cases and re-open them on the new version so they pass the approval | Comments, files and decision history stay on the cancelled case; the new case starts empty and the audit trail is split | **Do not do this.** If open cases must be approved (D4), the approver records the decision on the existing case: a comment naming the decision and reason plus the attached approval; the process owner lists which cases this applies to |
| Delete the workflow and re-import the edited YAML | New lineage: history, grants, numbering and open cases are not carried; open cases are orphaned or lost with the deletion | **Do not re-import.** Create a new draft version of the same workflow (§5) |
| Remove or rename a field open cases hold values in | Values become invisible or fail validation on the next edit | No field removal or rename in this version (D5) |
| Make an existing field required | Open cases with the field empty fail validation on the next metadata edit | No new required fields; a new field, if any, is `required: false` |
| Change a Form Fill definition | Frozen per version; open cases keep the old definition, new ones get the new one | List any such change; test both |

**Pending:** the number of open cases, which action they are at and which fields they hold values in could not be inspected (no export, connector declined). This check stays open under D6 and must close before publication.

### 4.2 Dependencies

- Actions after the insertion point start later. Any `wait` with a time condition, HTTP call with an execution timing, or sub-workflow with a parent timeout that follows the insertion needs its timing reviewed (list pending, D5).
- If the workflow is a **child** of another workflow, the parent's timeout and output mapping now waits for one more step.
- Access grants are unaffected (they belong to the workflow id). Manual-trigger allowlists unaffected.
- Notifications that announce "approved" or "next step" must not fire before the new approval; check their position in the sequence.

### 4.3 People

- The new approver group gets work it did not have: it needs the five-part brief, and someone must confirm its membership in the tenant (manifest `groups[]` entry with `sourceRefs`, or `users_search` in connected mode).
- Requesters and current assignees must be told the effective date and that cases opened before it follow the old path (D7).

## 5. Draft-version plan

Ordered; each step names the mode. Nothing in this list publishes anything: publication is a UI action by an authorized person.

| # | Step | Connected mode (after the connector is authorized) | Disconnected mode |
| --- | --- | --- | --- |
| 1 | Obtain the live design | `org_get_context` once; `workflows_list` to find the workflow; `workflow_get` with `includeVersions`, `includeActionTemplates`, `includeTriggers`; `workflow_export_yaml` of the active version. Save as `workflow.current.yaml` | Export the YAML from the Provia UI, or supply the original `workflow.yaml` + `provia-project.json`. Save as `workflow.current.yaml` |
| 2 | Read the open cases | Incident inspection is not a connector tool: export the incident list from the Provia UI (filter: this workflow, not closed) | Same export |
| 3 | Fill §3 | Compare `workflow.current.yaml` with the proposed insertion; owner confirms every "unchanged" row | Same |
| 4 | Write the proposed file | Copy to `workflow.proposed.yaml`; insert the §3 fragment; do not touch other actions | Same |
| 5 | Validate offline | From the plugin root: `node scripts/validate-workflow.mjs workflow.proposed.yaml` → `validation.json`; `node scripts/review-actions.mjs workflow.proposed.yaml`; `node scripts/build-project-map.mjs provia-project.json --check` after §8 is applied | Same |
| 6 | Create the draft **on the same workflow id** | `workflow_create_draft_version` on the existing workflow (keeps lineage, grants, counter, open cases), then `workflow_update_draft_actions` to add the action, its group as `defaultResponsible`, and the description. Do **not** use `workflow_import_draft` for this change | In the Provia UI open the workflow, create a new draft version, add the Decision action by hand from §3. Do not import the YAML as a new workflow |
| 7 | Re-link what the draft does not carry | Form Fill links, page templates, tags, AI profile, memory documents, HTTP secrets and allowlists: confirm each is still attached to the new draft | Same |
| 8 | Test in the draft / test tenant | §6 test cases; record results with case ids and dates | Same |
| 9 | Communicate | Effective date, old-path rule for open cases, the approver group's brief (D7) | Same |
| 10 | Publish | UI, by an authorized person, on the effective date | Same |
| 11 | Verify after publication | One new case reaches the new approval; one pre-existing open case is unchanged and its evidence intact; grants read back unchanged (`workflow_get` with `includeAccess` where the server offers it; the tool schema exposed in this session lists only `includeVersions`, `includeActionTemplates`, `includeTriggers`, so the UI access tab is the fallback) | Same, via the UI |

## 6. Test cases

| Id | Path | Steps | Expected | Evidence to keep |
| --- | --- | --- | --- | --- |
| T1 | Changed: approve | Open a new case after publication; complete the actions before the insertion; approver chooses Approve | The next existing action activates; no other action changed | Case id, action timeline |
| T2 | Changed: reject | As T1; approver chooses Reject without a comment, then with one | Refused without comment; with comment the configured outcome applies (cancel or return per D3) | Screenshot of the refusal, timeline |
| T3 | Changed: return | Approver chooses Return with a comment | Case returns to the target action; prior comments and files remain on the case | Timeline, attachment list before/after |
| T4 | Unchanged: open case | Take a case opened **before** publication that is before the insertion point; complete it | It finishes on the old path, no extra approval appears; all comments, files and field values intact | Case id, export of the case before and after |
| T5 | Unchanged: open case metadata | On a pre-existing open case, edit a metadata field | Validation passes as before publication | Screenshot |
| T6 | Access | Sign in as a member of the approver group | Sees the assigned case in "my cases" without a new grant; cannot see other cases unless previously granted | Access tab (or `workflow_get` access read-back, where offered) before/after |
| T7 | Forms | If a Form Fill exists: complete it on a pre-existing case and on a new case | Both work with their respective frozen definitions | Responses |
| T8 | Numbering | If an `auto_number` field exists: open a new case | Continues the family's sequence, does not restart | The two consecutive numbers |
| T9 | Dependencies | Any wait, HTTP call, sub-workflow or notification after the insertion | Fires after the approval, not before; timeouts still adequate | Logs / timeline |
| T10 | Diff | Compare `workflow.current.yaml` with the export of the new version | Only the inserted action and its sequencing differ | Saved diff |

## 7. Recovery

There is no rollback control. Two separate questions:

**A. Returning the design to the previous behaviour.** Create **another** draft version of the same workflow that reapplies the previous design: in connected mode `workflow_export_yaml` with the previous `versionId` gives the reference, then `workflow_create_draft_version` + `workflow_update_draft_actions` to remove the inserted action (or in the UI: new draft, delete the action). Validate, test T4/T5/T10 against it, publish. Lineage, grants, numbering and cases are preserved because it is the same workflow id. **Do not** re-import the old YAML: that creates a new workflow without history.

**B. Cases opened while the new version was active.** They keep the extra approval action; a later version does not remove it. Options, to be chosen per case by the process owner: let the approver decide (fastest, keeps evidence), or, if the approval must not happen, the approver records "Approve" with a comment explaining the reversal. Cancelling and re-opening loses the trail, as in §4.1.

Record both in the manifest as a resolved decision when they happen, with the version ids.

## 8. Manifest update

Written to `provia-project.json` in this directory (created; none existed):

- `sources[]`: `cr-extra-approval`, the request as received, with the missing context listed.
- `decisions[]`: D1–D8, each with an owner.
- `organization.mode: disconnected` (the connector was not authorized; nothing was read from a tenant), `receipts: []`.
- `workflows[]`: **empty.** The `status: change_planned` entry, the changed action with `sourceRefs` to `cr-extra-approval` and the `access` section can only be written once D1 supplies the workflow key, prefix, existing actions and access. Appending an invented workflow would fail the honesty rules and mislead `--check`. When the live export arrives, append the workflow entry from it, add the §3 manifest fragment to its `actions[]`, set `"status": "change_planned"`, and regenerate.

Checks run: `node scripts/build-project-map.mjs provia-project.json --check` → 0 workflows, 0 readiness blocks, 8 pending items (the decisions), 0 warnings. `--setup setup.md` and `--output project.html` were generated from the same manifest. These checks validate the manifest shape only; they say nothing about the workflow, which was not available.

Not run, because the input does not exist: `validate-workflow.mjs`, `review-actions.mjs`, `emit-workflow-access.mjs`, `resolve-workflow-refs.mjs`.

## 9. Summary of state

- **Verified:** manifest shape and references (`--check`), the product behaviour cited in §2 against the plugin references.
- **Pending:** active-incident impact check (D6), field/form/integration list (D5), semantic before/after on the real actions (D1), tenant read (connector authorization).
- **Owner must decide:** D2 (position), D3 (approver, outcomes, comment rule), D4 (open cases: old path or out-of-band approval), D7 (effective date, communication), D8 (country/language).
