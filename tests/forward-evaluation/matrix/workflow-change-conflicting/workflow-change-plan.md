# Workflow change plan: revert required fields, six open incidents

## What was actually supplied

The working directory for this task was empty. No previous YAML export, no current/live YAML export, no `provia-project.json`, and no incident records were provided in this session. The request itself — "import the previous YAML to restore version history and revert required fields" with "six incidents remain open and their records are unavailable" — is handled here as the **conflicting/incomplete input** case this skill is designed to flag, not as a design that can be executed sight unseen. Everything below states what is confirmed, what is recommended, and what remains an open decision (recorded in `provia-project.json`, `decisions[]` D1–D4). Nothing here should be read as a completed comparison, a performed impact check, or an executed platform action.

## 1. Re-import and version history — the conflict in the request

Provia has no general one-click rollback control, and importing a YAML export does not restore the original version lineage. Concretely:

- Importing a "previous" YAML creates a **new draft**, on top of whatever version is currently published. That draft gets its own new version number when published; it does not rewind the workflow to the earlier version or splice the old history back in.
- Anything about the workflow that lives outside YAML — forms, tags, memory documents, page templates, assignment strategies — is not carried by the export and is not restored by re-importing it. Trigger forms publish independently of the workflow; Form Fill form definitions are frozen at the moment the workflow that references them is published, so an old Form Fill binding cannot simply be "brought back" by YAML alone.
- Automatic-numbering counters are scoped to the workflow family and field, not to a version. Republishing a new draft under the same family continues the same counter; it does not reset it to what it was at the old version. Any gaps from failed creates in between stay.

**So "restore version history" is not achievable as literally stated.** The available, honest path is: build a new draft whose YAML reapplies the earlier field design (the required/optional flags, types, and any other settings the "previous YAML" carried), publish it as a new version, and treat that as a forward-moving correction rather than a rewind. This needs the actual previous YAML content to do — see D1.

## 2. Impact on the six open incidents — pending, not assessed

Runtime cases (incidents) that are already instantiated on the current published version keep running on the metadata of the version they started under for most purposes, but some validation — for example on Form Fill submissions, on resuming a case, or on any step that revalidates a `required` field — still consults the *current* workflow-level metadata rather than a frozen snapshot. That means a field flip from optional back to required (or a type/config change) can surface as a new validation failure on an open case even though the case itself was never touched.

This is exactly the check the skill asks for before any change is packaged, and it cannot be done here: the six incidents' records are stated as unavailable, so it is unknown

- which of the affected fields each open case actually touches,
- whether each case has already passed the step that reads that field, or is still ahead of it,
- what value (if any) each case currently holds for those fields.

**This impact check is marked pending**, not "clear" or "low-risk." Treat every one of the six as potentially blocked by the field revert until their records are inspected. See D2.

## 3. Draft and publication plan (structure, to run once inputs exist)

1. Obtain the currently published YAML export for the affected workflow (`workflow_export_yaml` if connected mode is available; otherwise the implementer's last known-good export) — this is the baseline, not the "previous" file being reimported.
2. Obtain the actual "previous" YAML the request refers to, and diff it against the current baseline field by field: which fields changed `required`, which changed type/config, which were added or removed. Do this as a semantic comparison of business effect (who can no longer skip a field, what breaks if a case doesn't have that value) — not a raw YAML line diff.
3. Build a new draft from the current baseline, reapplying only the confirmed field reversions from D3 — not a wholesale swap-in of the old file, since that could also silently revert unrelated changes made since.
4. Validate the draft structurally (`node scripts/validate-workflow.mjs <file>` from the plugin root) and run the action-wording gate (`node scripts/review-actions.mjs <file>`) before proposing publication.
5. Publish as a new version once the owner has confirmed D1–D4; this is a manual, authorized action in Provia, not something this plugin performs.

## 4. Recovery for the six open incidents (once records are available)

For each of the six, once its record is inspected:

- If the case has already passed every step that reads the reverted field, publishing the new version has no effect on it; it can be left to continue.
- If the case is at or ahead of a step that will now revalidate a newly-required field it doesn't have, the case will block at that step after publication. The recovery options, in order of preference, are: (a) let the assignee fill the now-required field manually when they reach/re-reach that step, since it is missing information rather than a system defect; (b) if the field value is recoverable from another record or system, have someone with edit rights backfill it before the new version goes live; (c) only as a last resort, exclude that step's dependency for the six pre-existing cases via whatever case-level override Provia's implementer tooling exposes, and re-link it once the field is filled — do not silently disable the requirement platform-wide as a workaround.
- Do not close or re-route any of the six cases automatically as part of this change; each needs its own confirmation that the field gap is resolved, not just that the workflow now validates cleanly for new cases.

## 5. Test cases before publication

- A new case created after publication with all fields present completes end to end (regression check that the unrelated parts of the workflow still behave).
- A new case attempting to skip a reverted-to-required field is blocked at the correct step with a clear message (confirms the revert actually took effect).
- One of the six open incidents (or a copy/staging equivalent, if available) reaches the affected step and is observed to either pass (field already present) or block as predicted in section 4 — do not assume the predicted behavior without observing at least one real case.
- Any Form Fill action bound to a changed field is checked manually, since form field bindings are not re-verified by workflow validation alone.

## 6. What is recorded and what remains open

`provia-project.json` in this directory now carries a `workflows[]` entry for the affected workflow with `status: change_planned` and four open decisions (D1–D4) covering: workflow/version identity and the actual previous YAML content, the six incidents' case IDs and field values, the exact fields and target values to revert, and confirmation that a new-draft recovery (not a literal history restore) is the accepted path. No entity types, groups, forms, or actions were invented to fill these gaps.

## Next action

This cannot proceed to a concrete diff, draft YAML, or recovery list without: the actual previous YAML export, the current published YAML export (or connected-mode access to fetch it), and the six incidents' case records. Once those are supplied, rerun this skill (or continue directly) with them attached and this manifest in place; the comparison, packaged draft, and per-case recovery plan can then be completed instead of scaffolded.
