# Change plan: revert required fields on a live workflow with six open cases

Prepared 2026-09-21 by `provia-workflow-change` (provia-skills 1.2.0, contract revision `fed8efaf…`).
Country context: **Angola, provisional** (no country was stated). Response language: English, as requested.

## 0. What was received and what was not

| Input the skill needs | Received | Effect on this plan |
| --- | --- | --- |
| Change reason | Yes, verbatim: "Import the previous YAML to restore version history and revert required fields. Six incidents remain open and their records are unavailable." | Drives sections 1–5 |
| Workflow name / id | No | Manifest carries a placeholder key `target-workflow` (decision D1) |
| Previous YAML | No | Comparison is pending (D3); the plan states *what* will be compared |
| Current (live) YAML | No; the connected read (`org_get_context` → `workflow_export_yaml`) was offered by the host but **not authorized** in this session | Must be exported from the UI or supplied (D3, D6) |
| Records of the six open incidents | No ("unavailable") | Impact check on open cases is **pending** (D4, D5) |
| Existing `provia-project.json` | No | A new manifest was created in this directory |

Because the two YAML files are absent, nothing in this document is a line diff. Every field-level statement is either a product rule (cited) or a check to run once the files exist.

## 1. The request corrected against the product

**Confirmed facts (product references, not opinion):**

1. **Re-importing YAML does not restore history.** An import creates a *new draft lineage*: a new workflow at version 1. "Source IDs, history, timestamps and version lineage are not a backup" (`workflow-yaml.md`, Portability exclusions; `provia-capabilities.md`: "Re-importing YAML creates a new draft lineage, not restored history").
2. **There is no one-click rollback and no side-by-side version comparison** (`provia-capabilities.md`). Recovery is always *roll-forward*: a new draft version that reapplies an earlier design.
3. **Publication creates a new active version; new cases use it. Existing actions are instantiated, but metadata validation can still consult workflow-level configuration** (`provia-capabilities.md`). This is why required-flag changes are a risk for the six open cases even though their actions already exist.
4. **Form Fill definitions are frozen with the workflow publication; the trigger (intake) form publishes independently** (skill procedure step 3; `provia-capabilities.md`). Forms, Form Fill links, tags, page templates, memory documents and `assignmentStrategy` are **not carried by YAML** (`workflow-yaml.md`).
5. **Auto-number counters** are scoped to the workflow *family*. "Publication of a new workflow version continues that family's counter… importing creates a new draft lineage" (`metadata-fields.md`). A fresh import therefore restarts numbering; a new version does not.
6. An imported workflow **without an `access` section is creator-only** (`provia-capabilities.md`); a live workflow's grants are not in the exported YAML unless the export includes them.

**What this means for the two halves of the request:**

| Requested | Achievable? | What to do instead |
| --- | --- | --- |
| "Import the previous YAML to restore version history" | **No.** It would create a *second* workflow (v1, new lineage, new counter, no forms, no Form Fill links, creator-only access) with no relation to the six open cases. | Create a **new draft version of the live workflow** and reapply the previous field requirements to it. Lineage continues (v N → v N+1), the counter continues, the open cases stay in the same family. The previous YAML is the *source document* for the revert, not something to import. |
| "Revert required fields" | **Yes**, as a new version. | Change only the `required` flags on the draft version; keep every other definition identical to the live version. |

**Assumption stated:** "revert" means *the required flags of the previous version are restored on the live workflow*. If the owner actually wants a copy of the previous workflow for comparison or a sandbox, a re-import into a **separately named** draft is acceptable for that purpose only, and must never be published as the replacement (see §5, option C).

## 2. Semantic comparison (procedure once both YAML files exist)

Place `workflow.previous.yaml` and `workflow.current.yaml` next to `provia-project.json`, then compare these dimensions in this order. Only the first row is in scope of this change; every other difference is recorded and **excluded** unless the owner confirms it separately (editorial vs. behavioural changes are kept apart, per the skill procedure).

| Dimension | Compare | Classify as |
| --- | --- | --- |
| `fields[].required` | Per field name: previous vs current flag. Direction matters (see §3). | **In scope** (behaviour: intake validation, action completion) |
| `fields[]` presence, `type`, `config.options`, `parentField`, `defaultValue`, `auto_number` config | Any field added, removed, retyped or with changed options between versions | Out of scope; if the previous YAML lacks a field that the current one has, **do not remove it** (removing a field can delete stored values; removing an `auto_number` field deletes its counter, `metadata-fields.md`) |
| `actions[]` `assignee`, `due`, `executionMode`, `required`, `priority` | Owner/timing changes | Out of scope — routing/assignment |
| `actions[].config.branches` (decisions) | Outcome, target, `requiresComment` | Out of scope — routing |
| `actions[].name` / `description` | Wording | Editorial; may be carried if the owner wants, no business effect (`action-writing.md` applies if rewritten) |
| `triggers[]` | Type, enabled, schedule, manual allowlist | Out of scope — who may start |
| `entities` | Mode, entity type, mappings | Out of scope — data |
| `access` | Grants and default | Out of scope — permissions; the new version must keep the live grants (D6) |
| `metadata.name/prefix` | Must be identical | A different prefix or name means the file is not the same workflow family |

Deliverable of this step: a table `field · type · required(previous) · required(current) · required(new draft) · direction · used by intake form? · mapped by a Form Fill? · empty in any open case?`. That table is the change record the owner signs off.

## 3. Impact assessment

### 3.1 Required-flag direction

| Direction on the new version | Effect on **new** cases | Effect on the **six open** cases (current version) | Risk |
| --- | --- | --- | --- |
| required → **optional** (the usual meaning of "revert" after fields were tightened) | Intake and actions stop demanding the value | Stored values stay valid; nothing becomes invalid | Low |
| optional → **required** (if the previous version was the stricter one) | Intake and actions demand the value | A case whose field is **empty** may fail metadata validation at the next save or action completion, because validation can consult workflow-level configuration even for instantiated actions | **High** — this is the check that needs the incident records |
| Field present in current, absent in previous | — | Do **not** remove; treat as out of scope | — |

Until the two YAML files are compared, the direction is unknown, so both rows stay in the plan.

### 3.2 The six open incidents — impact check **pending**

Their records were unavailable. This check cannot be marked done. What is needed per incident (decision D4):

- incident id and the workflow **version id** it runs on;
- current action (name, type, assignee, status) and whether a Form Fill is pending;
- the value of every field whose required flag changes (empty / filled);
- any intake-form or Form Fill mapping that writes to those fields.

With that export, each case is classified into one of D5's options:
(a) can finish on its current version (no changed field is both required-on-new-version and empty, and test T2/T3 passed);
(b) needs the assignee to fill missing values before publication;
(c) cannot complete and must be cancelled and recreated — last resort, because history and evidence in the case are lost and a recreated case gets a new number.

**Recommendation:** do not publish the new version until the export exists and every one of the six cases is in (a) or (b).

### 3.3 Dependencies that YAML does not carry

| Dependency | Why it matters here | Action |
| --- | --- | --- |
| Intake (trigger) form | Publishes independently of the workflow; its own required flags may still demand a field the workflow no longer requires (or vice versa) | Re-check and republish the form so its required flags agree with the new version |
| Form Fill definitions | Frozen at workflow publication | After publishing the new version, confirm each Form Fill action still links to its form and that mappings to the reverted fields still resolve |
| Auto-number fields | Counter continues on a new version; restarts on a re-import | One more reason not to re-import |
| Access grants and manual-trigger allowlist | Not restored by an import; a new version keeps them | Read them from the live workflow (D6) and verify after publication (test T8) |
| Sub-workflows, HTTP allowlists, secrets, AI profiles, tags, page templates, memory | Excluded from YAML | Unaffected by a new version; would all need re-setup after a re-import |

## 4. Draft-version plan

Nothing below is executed by the plugin. Steps marked **[UI]** are done by an authorized person in Provia; **[connected]** steps are draft-only MCP tools that were *not* authorized in this session.

1. **Pin the live version.** [UI] Note workflow name, id and active version number. [connected alternative] `org_get_context`, `workflows_list`, `workflow_get` with `includeVersions` and `includeAccess`, then `workflow_export_yaml` of the active version → `workflow.current.yaml`. Record ids in `organization` and the workflow entry of the manifest.
2. **Obtain the previous YAML** → `workflow.previous.yaml`. Confirm `metadata.name` and `prefix` match the live workflow (same family).
3. **Run the comparison of §2** and fill the field table. Sign-off by the process owner on the exact list of `required` changes (D3).
4. **Create the new draft version from the live workflow**, not from the file. [UI] "new version" on the live workflow. [connected] `workflow_create_draft_version` on the live workflow id. Apply **only** the `required` flag changes from the signed-off table. Leave actions, triggers, entities and access untouched. If a packaged YAML is produced for review, validate it: terminal command from the plugin root, `node scripts/validate-workflow.mjs workflow.yaml` — not run in this session because no file exists.
5. **Open-incident gate.** Complete §3.2 with the incident export (D4) and decide D5 for each of the six cases. Cases in option (b) are completed by their assignees *before* step 7.
6. **Test** on a non-production case or the tenant's test workflow: run the test cases of §6 and record results (pass/fail with the observed message).
7. **Publish** [UI] by an authorized person. Note the effective date and time (D7).
8. **Re-link excluded dependencies:** intake form required flags; Form Fill links and mappings; confirm access and allowlist unchanged (T8).
9. **Communicate:** effective date, which fields are no longer (or again) required, and what each assignee of the six open cases must do.
10. **Record** the outcome in `provia-project.json` (`receipts[]` for any connected step; resolve D1–D7) and regenerate `project.html` and `setup.md`.

## 5. Recovery instructions ("can we go back?")

There is no rollback control. Three roll-forward paths, in order of preference:

**A. Roll forward on the same workflow (recommended, this plan).** New draft version of the live workflow → reapply the desired field definitions → publish. The design that results equals the earlier version, but it is version N+1, not a restored version N-1. Open cases keep running on the version they started on; they are handled separately (§3.2).

**B. Undo this change later.** Same mechanism: from the then-live version create another draft, reapply the current (pre-change) required flags, publish as N+2. Test T9 rehearses this so the team knows the path works before it is needed.

**C. Re-import the previous YAML as a *separate* draft — only as a reference copy.** Give it a different name, do not publish it as the replacement, do not start cases on it. Use it to read the previous field definitions if the file is hard to read by hand. It has no forms, links, grants or counter continuity, and it does not touch the six open cases. Delete it afterwards [UI].

What recovery **cannot** do: restore version numbering, timestamps or the audit trail of a version; move an open case from one version to another; recover a cancelled case's history.

## 6. Test cases

Run on a test case or in a test tenant before publication where possible; T2/T3 need a copy of the real situation (a case on the current version with the changed field empty).

| # | Path | Steps | Expected | Result |
| --- | --- | --- | --- | --- |
| T1 | Changed — new case | Start a case on the new version; submit intake with each reverted field empty / filled | Required set equals the previous version's; no other field behaves differently | not run |
| T2 | Changed — open case, action completion | On a case on the current version with a changed field empty, complete the active action | Completes (option a) or blocks with a validation message (→ option b) | not run — needs incident records |
| T3 | Changed — open case, metadata edit | Same case: edit and save unrelated metadata | Save succeeds; if it fails on the changed field, the case is option (b) | not run — needs incident records |
| T4 | Intake form | Submit the trigger form without a reverted field | Form and workflow agree (both accept or both reject) | not run |
| T5 | Form Fill | Complete a Form Fill that maps to a reverted field on the new version | Mapping writes the value; link intact after publication | not run |
| T6 | Unchanged — routing | Take a decision branch and trigger one notification/wait/HTTP action on the new version | Identical behaviour to the current version | not run |
| T7 | Unchanged — numbering | Start two cases after publication (if an `auto_number` field exists) | Sequence continues from the current family's last number | not run |
| T8 | Unchanged — access | A member of the starter group (not the implementer) opens the workflow and sees the Start button; a `view`-only member sees cases but cannot start | Same as before publication | not run — needs a named member |
| T9 | Recovery rehearsal | From the new version create a draft that reapplies the current design; do not publish | Draft is created without errors; path B confirmed | not run |

## 7. Manifest update

`provia-project.json` was created in this directory (no manifest existed) and passes `node scripts/build-project-map.mjs provia-project.json --check`: 1 workflow, access declared 1/1, 0 readiness blocks, 0 warnings, 8 pending items. It records:

- `workflows[target-workflow].status: change_planned` with `sourceRefs` to the change request and the two YAML sources;
- `actions: []` — no action is changed by this plan; the actions of the live workflow are unknown and were not invented. When the live export exists, its actions are copied in with `localId`s equal to the YAML ids;
- `access.default: creator_only` as an explicit **placeholder** with a note; the live grants replace it (D6);
- seven `decisions[]` (D1–D7) with owners;
- `setupNotes` carrying the "do not re-import" rule, the pending checks and the not-authorized connected read.

`setup.md` and `project.html` were generated from it. Note: the generated handover lists a generic pending item "Import the YAML as a draft and review the preview" for the workflow; for this change read it as "create the new draft **version** of the live workflow", per §4 step 4.

## 8. Verified, pending, to decide

**Verified in this session:** the product rules cited in §1 (plugin references at contract revision `fed8efaf…`); the manifest shape (`--check`, 0 errors, 0 warnings).

**Pending (not done, not claimable):** semantic comparison (no YAML files); impact check on the six open incidents (records unavailable); validator run (no workflow file); every test case in §6; connected reads (not authorized).

**Owner decisions:** D1–D7 in the manifest. The blocking ones for publication are D2 (accept roll-forward instead of "restore history"), D3 (the two YAML files) and D4/D5 (the six cases).

Publication readiness is decided in Provia by an authorized person; this plan does not assert it.
