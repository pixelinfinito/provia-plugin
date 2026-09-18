# Workflow change plan: add an extra approval

## What was supplied vs. what is missing

The working directory contained no files before this task, and the request did not attach a current workflow design, a `provia-project.json`, receipts, an active-incident export, or the affected fields/integrations. The request itself says "some required context is unavailable," which matches this gap. No `provia-implementer` MCP connection is available either, so this plan stays disconnected and cannot read a live tenant.

To keep this task moving without inventing facts, this deliverable is a **reusable change plan and manifest skeleton**, not a comparison against a real current design. Everywhere a concrete fact would be needed (workflow identity, current sequence, approver, threshold, open-incident state), it is recorded as an open decision (`D1`–`D5` in `provia-project.json`) instead of assumed. Country/currency/timezone are set to Angola/AOA/Africa-Luanda only as the provisional default this plugin uses when no country is supplied — confirm or replace before relying on them.

Country: Angola (provisional). Language: English (matches the request).

## 1. Semantic comparison — framework, not an actual diff

Without the current YAML or export, no line-level before/after is possible; that is itself the first pending item (`D1`). What can be stated is the business shape of "add an extra approval," so the process owner can confirm or correct it once the real design is available:

- **New actor in the loop.** A new Decision action is inserted, with its own owner (group), not yet identified (`D3`). Confirm whether this is a *second* independent approval (both must approve) or a *sequential* extra check (one approves, then the other) — the wording "extra approval" is compatible with either, and Provia's Decision outcomes (continue, cancel the incident, trigger another workflow, return to an action) support both patterns but need the actual routing chosen deliberately, not assumed.
- **New position in the sequence.** Provia enforces predecessors for sequential work, so the new approval sits at a specific point — before or after the existing approval — which changes who reviews what and in which order. This is `D3`, unresolved.
- **New evidence requirement.** Every Decision should state what proves the outcome (e.g., a comment on rejection/return). A placeholder is recorded on the new action; confirm the real requirement.
- **Possible new field.** If the new approval needs a threshold amount, justification or similar, that is a schema change, not just a routing change — see the open-incident risk in §2 and `D4`.
- **No change assumed to the existing approval, other actions, forms or integrations.** State explicitly in the real comparison, once available, that everything else is unchanged; do not silently fold or reroute other steps (per the wording-only vs. behavioral-change distinction — a genuinely new approval is a behavioral change, not editorial).

## 2. Impact on active incidents — pending, not cleared

**This impact check cannot be performed now: no active-incident evidence was supplied.** Per the skill's own rule for this gap, it is recorded as pending (`D2`), not as "no impact." Once an export or read access exists, check specifically for:

- **Incidents already past the insertion point.** Existing actions in a running incident are already instantiated on the version they started with; publishing a new draft version does not retroactively insert the new approval into them. Confirm this is acceptable, or plan a manual, case-by-case path for open incidents that still need the extra check (there is no automatic mid-flight upgrade).
- **Incidents currently sitting at the action right before the insertion point.** They will hit the new approval once they move forward, which is usually intended — confirm the approver group exists and is staffed before any of them reach it.
- **Any new required field.** Metadata validation can still consult workflow-level configuration for already-instantiated actions. If the change adds a field and marks it required on an action that open incidents already have instantiated, it can block them from completing that action. If a new field is needed for the new approval, keep it optional, or scope it so it only applies to the new action (which open incidents that never reach it are unaffected by), and re-check any open incident that would touch it.
- **Evidence already on open incidents (comments, attachments, prior decisions, field values).** Publishing a new workflow version does not delete or rewrite that history; it stays on the incident. The actual way evidence gets lost is procedural: cancelling or manually restarting an open incident to force it onto the new design, or removing/renaming a field or form an open incident's history depends on. Neither is part of "add an approval" unless the real design also touches existing fields — flag it separately if it does.

## 3. Draft-version and publication plan

1. Start the new draft from the live version's actual export (`workflow_export_yaml` in connected mode, or the last packaged/published YAML in disconnected mode) — never from scratch, so nothing already live is silently dropped. This depends on `D1`.
2. Add the new Decision action at the confirmed position (`D3`), with its owner, evidence and outcomes; add any new field as optional unless the open-incident check (§2) clears a required one.
3. Validate the draft: `node scripts/validate-workflow.mjs workflow.yaml` from the plugin root, path relative to the manifest folder. Run `node scripts/review-actions.mjs workflow.yaml` for the five-part brief on the new action.
4. Trigger forms publish independently of the workflow; if intake uses one, it does not need republishing for this change unless intake fields change. Form Fill definitions freeze at workflow publication, so any Form Fill tied to the new approval must be finalized before publishing this version.
5. Publish creates a new active version. New incidents use it immediately. Open incidents keep running on the version they were instantiated on; none are moved automatically (§2).
6. Record the change: this plan already sets `status: change_planned` on the placeholder workflow entry and lists the new action in `provia-project.json`; replace the placeholder key/name once `D1` is resolved and keep the `sourceRefs` pointing at this change request.

## 4. Test cases

- **New path.** Create a test incident that reaches the new approval: confirm it appears at the intended point, routes to the correct next action on each outcome (approve / reject / return), and enforces its evidence requirement.
- **Unchanged path.** Run a test incident through every action untouched by this change and confirm identical behavior, assignments, due dates and outputs to the pre-change version.
- **Open-incident continuity.** Once a real open-incident export exists, pick a sample already in progress and confirm, after publication, that its history (comments, attachments, prior decisions, field values) is intact and that it continues on its original version without being forced onto the new approval mid-flight.
- **Field compatibility.** If a new field was added, confirm no open incident is blocked from completing any action it has already reached because of a newly required field.

## 5. Recovery instructions

Provia has no general side-by-side version comparison and no one-click rollback. To "go back," create a further new draft that reapplies the previous design (the pre-change action sequence, owners and fields) and publish it as a new version; this is a forward change, not a restoration of history. Re-importing an old exported YAML creates a new draft lineage, not the original version's history — say this explicitly if anyone expects otherwise. Incidents that already went through the extra approval before a rollback keep that history; a rollback does not erase what already happened on open or completed incidents.

## 6. Effective date

Not set — this is `D5`. Communicate the publish date to the new approver group and any existing assignees before it goes live, since new incidents switch over the moment the draft is published.

## Manifest update

`provia-project.json` now has one workflow entry (`target-workflow`, `status: change_planned`) with a placeholder Decision action (`extra-approval`) carrying `sourceRefs` to a new `change-request` source, and five open `decisions[]` (`D1`–`D5`) covering the missing workflow identity, the pending open-incident impact check, the approver/position, the field-safety question and the effective date. Validated with `node scripts/build-project-map.mjs provia-project.json --check` (0 errors, 1 expected warning: the placeholder action has no owner yet). `project.html` and `setup.md` were regenerated from it.
