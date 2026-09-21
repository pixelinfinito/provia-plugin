# Monthly review trigger — specification

Project `monthly-review` · Angola (provisional context, no country was supplied) · English · Africa/Luanda · 2026-09-21 · provia-skills 1.2.0, contract revision `fed8efaf…`.

Companion files: `workflow.yaml`, `provia-project.json`, `setup.md`, `project.html`, `validation.json`, `review-actions.json`.

## 1. What was supplied and what was not

The request supplies three facts: a **monthly** cadence, the timezone **Africa/Luanda**, and the need for a **missed-run policy**. Nothing else was supplied: no procedure, no process name, no reviewing team, no day of the month, no service level, no system to read from. The design below is therefore a trigger skeleton with the missing pieces recorded as decisions D1–D7 in the manifest, not a finished workflow.

| Status | Item |
| --- | --- |
| Confirmed (request) | Runs monthly; timezone Africa/Luanda; a missed run must have a defined outcome |
| Confirmed (product, bundled contract) | Schedule config is `cronExpression` (numeric five-field), `timezone` (IANA), `missedBehavior` ∈ {`skip`, `catch-up-one`, `catch-up-all`}; a missing timezone defaults to UTC and a missing `missedBehavior` to `skip`, each with an import warning. `incidentDefaults` (title, priority) is accepted by the trigger schema. |
| Confirmed (timezone data) | Africa/Luanda is UTC+01:00 all year, no daylight saving. 08:00 Luanda = 07:00 UTC in every month. |
| Assumed | 1st of the month at 08:00 (D3); 5 workdays to complete (D5); Angola as country context; English output |
| Unresolved | Scope of the review (D1); reviewing team (D2); overdue escalation recipient (D6); entity or external-system dependency (D7) |

## 2. Trigger

```yaml
- type: schedule
  label: Monthly review (automatic)
  enabled: true
  config:
    cronExpression: "0 8 1 * *"      # minute hour day-of-month month day-of-week
    timezone: Africa/Luanda
    missedBehavior: catch-up-one
    incidentDefaults:
      title: Monthly review
      priority: normal
```

Next runs if published before October: Thu 2026-10-01, **Sun 2026-11-01**, Tue 2026-12-01, Fri 2027-01-01, Mon 2027-02-01, all at 08:00 Luanda (07:00 UTC).

Why the 1st at 08:00: the case is waiting when the team starts the first working day of the month, and the month under review has fully closed. The alternatives the process owner may prefer, and what the product can do with them:

| Wanted | Expressible? | Note |
| --- | --- | --- |
| A fixed day, e.g. the 5th at 09:00 | Yes: `0 9 5 * *` | Any day 1–28 is safe; 29–31 do not exist in every month and the engine does not clamp |
| Last day of the month | No | Numeric cron has no `L`; use the 1st of the next month instead |
| First working day | No | The schedule fires on weekends too; the `due` offset in workdays absorbs it (a case created Sunday 2026-11-01 with 5 workdays is due Friday 2026-11-06) |
| Skip public holidays | No | Workdays skip Saturday and Sunday only; Angolan holidays are not implemented |

## 3. Missed-run policy

Two different things can be "missed" and the policy covers both.

### 3a. The scheduler misses the slot (platform side)

This is what `missedBehavior` governs. The three product options, as named by the contract:

| Option | Effect after the scheduler is back | Fit for a monthly review |
| --- | --- | --- |
| `skip` | Nothing is created for the missed slot; next month runs normally | Not recommended: a month would silently have no review and nothing in Provia would show it |
| `catch-up-one` | One case is created on recovery, whatever the number of slots missed | **Proposed.** The review still happens; the reviewer covers every month since the last completed review |
| `catch-up-all` | One case per missed slot | Only if each month must exist as its own case (for example, audit evidence per month). After a long outage this opens several cases at once for the same team |

**Proposed policy: `catch-up-one`.** The action brief tells the reviewer to check which months have no completed review case and to cover them all, recording the months in `review_period` (for example `2026-08, 2026-09`). That keeps one case per recovery, no duplicates, and a written trace of what was covered.

What is not confirmed by the bundled contract and must be checked in the destination product before relying on it: how far back the catch-up window reaches (a slot missed months ago versus hours ago), and whether a slot that falls while the workflow is unpublished or the trigger is disabled counts as "missed" at all. The manifest carries this as a setup note; do not assume either answer.

### 3b. The people miss the review (process side)

`missedBehavior` does nothing here; the case exists and is not done.

| Situation | Mechanism | Status |
| --- | --- | --- |
| Case open past its due date | `due: 5 workdays from activation` on `conduct-review`; Provia shows the case as overdue to the assignee and to anyone with `view` | In the YAML; the 5 workdays are illustrative (D5) |
| Someone must be told it is overdue | A notification action or a Provia overdue rule to a named group | Not emitted: the recipient is unknown (D6) and a group notification needs a real group id |
| A review is needed outside the cycle, or the catch-up case was cancelled by mistake | Manual trigger «Open an out-of-cycle review» | In the YAML; its allowlist waits for the reviewing team (D2) |
| Two cases for the same month (manual start next to a scheduled one) | The brief's step 2 makes the reviewer check open cases; the duplicate is commented and cancelled by the workflow owner | In the action description |

## 4. Workflow skeleton carried by `workflow.yaml`

| Element | Value | Origin |
| --- | --- | --- |
| Prefix | `REVM` | Proposed |
| Trigger 1 | Schedule as in section 2 | Request + assumptions D3/D4 |
| Trigger 2 | Manual, no allowlist yet | Recommendation (fallback) |
| Field `review_period` (text, half) | Month(s) covered, filled by the reviewer | Recommendation: makes catch-up traceable |
| Field `review_outcome` (select: No findings / Findings recorded) | Result of the review | Recommendation |
| Action `conduct-review` (standard) | «Conduct the monthly review», five-part brief, no assignee, due 5 workdays from activation | Assignee pending D2; evidence proposed because the request names none |
| Access | `default: creator_only` | Placeholder until D2; see section 5 |

No notification, wait, HTTP or sub-workflow action is emitted: none can be specified without the recipient, the condition or the API contract.

## 5. Access

Under `creator_only` only the importer and organization administrators see the cases. That is deliberate for a draft whose team is unknown, and insufficient for operation: the reviewing group (D2) will need the action assignment (sees its own cases without a grant), and, if the group must see every review case as a shared queue, a `view` grant with a source-backed reason. The manual trigger should then be restricted to that group. Nothing here was widened by guess.

## 6. Checks run

| Check | Command (plugin root) | Result |
| --- | --- | --- |
| Portable YAML validation | `node scripts/validate-workflow.mjs workflow.yaml` | `valid: true`, backend schema checks passed, 0 errors, 0 warnings; 2 setup items: `trigger_setup` (verify in destination) and `assignment_missing` (`conduct-review` has no owner). `readyToPublish: false`. Output in `validation.json`. |
| Action review gate | `node scripts/review-actions.mjs workflow.yaml` | 1 action reviewed, five parts present, no implementer-note leak, 1199 characters, due set. Output in `review-actions.json`. Checks presence, not business correctness. |
| Manifest check | `node scripts/build-project-map.mjs provia-project.json --check` | 1 warning (`conduct-review` has no owner), 0 readiness blocks, 1 unresolved actor (`monthly-reviewer`), 10 pending items. |
| Handover and map | `--setup setup.md`, `--output project.html` | Written. |

Destination validation did not run (disconnected mode; no `org_get_context` server was available). Nothing was created, imported or published in Provia.

## 7. If the review must read an external system

Not designed: no API was supplied, and the skill does not guess endpoints. Before an HTTP Request action can be added, the following are required:

1. The system and the operation (a read of the month's records, not a write).
2. API documentation or contract: base URL (HTTPS), method, path, authentication scheme and the organization secret name that will hold the credential.
3. Request parameters for the period (how the month is passed) and an example response.
4. Which response values map to which case fields (`responseMappings`), and what happens when the call fails after retries (`block_action` is the safe default for a read).
5. Confirmation that the destination is on the organization's HTTP allowlist.

## 8. Left out and why

- Notification and escalation actions: recipients unknown (D6).
- Assignee, manual-trigger allowlist and access grants: reviewing team unknown (D2). No group or id was invented.
- Entity linkage: no entity type is known (D7).
- The exact catch-up window and the behaviour while unpublished: product behaviour not fixed by the bundled contract; verify in the destination.
