# Workflow access (`workflows[].access`)

Who may see and open a workflow is design data, declared in the manifest, reviewed with the customer in the Acesso tab of `project.html`, checked by `--check` and applied either through the `access` section of the portable YAML (browser import) or through `workflow_access_apply` (connected mode). Silence is never an accident: a workflow without an `access` section fails `--check`.

## What the product does

- Levels are `view` < `create_incident` < `edit` < `admin`, cumulative, one level per grant; the list is published at `GET /api/v1/permissions/levels` and bundled in the engine (`LEVELS` in `scripts/lib/workflow-access.mjs`). `view` on a workflow means **view every incident of it**. "My own cases" needs no grant: creator, assignee and mentioned users see the cases that carry them. `edit` includes publishing a version; `admin` adds grant, revoke, archive and delete. No level separates "see the definition" from "see all cases".
- An imported workflow without `access` has one principal with access, the importer (plus organization Owners and Admins, who see everything by role). The product warns `access_not_declared`.
- Grantees are `group:<name>` (resolved by group **name**, case-insensitive, or through a `granteeId`/`groupRefs` map), `user:<email>` (active member) and `organization` (every active member of the organization, one entry, never expanded). `creator` is accepted in the document, warned when its level is not `admin`, and dropped by the importer. Ambiguous names and unknown references are dropped and reported, never widened. Any UUID in a grantee is rejected.
- Grants belong to the workflow id: they survive new versions and publication; duplication does not copy them.
- Manual-trigger `allowedUsers`/`allowedGroups` are **start restrictions**, enforced with `403 TRIGGER_NOT_ALLOWED`: they narrow `create_incident`, never widen it, and an organization Owner outside the list is refused too. Exempt: `trigger_workflow` decisions, sub-workflow children, schedule/webhook/email/form triggers and API-client service accounts. `GET /workflows/:id` reports `capabilities.canStart` for the authenticated caller only.
- A `permissions:` key in the YAML is `schema.unknown_key`, an error. Never emit it.

## The manifest section

```json
"access": {
  "default": "creator_only",
  "grants": [
    { "grantee": "organization", "level": "create_incident", "reason": "Qualquer colaborador abre um pedido", "sourceRefs": [{ "source": "sop-compras", "section": "1" }] },
    { "grantee": "group:compras", "level": "view", "reason": "A área acompanha todos os pedidos em curso", "sourceRefs": [{ "source": "sop-compras", "section": "4" }] }
  ],
  "sensitivity": "internal",
  "note": "…",
  "applied": [ /* workflow_get.access read back after an apply */ ],
  "operations": [ /* workflow_access_apply revisions, see connected-mode.md */ ]
}
```

- `grantee`: `group:<groups[].key>`, `user:<email>`, `organization`, `creator`. The **key** is the plugin's identifier; the tenant knows the group by name or id. A browser package writes `group:<groups[].name>` (`scripts/emit-workflow-access.mjs`); a connected apply keeps the key and passes `groupRefs` from the group receipts (`scripts/resolve-workflow-refs.mjs`, `scripts/plan-workflow-access.mjs`). Every group therefore needs a `name` unique in the tenant.
- `level`: one of the four. `reason` and `sourceRefs` make a grant reviewable; `--check` warns without a reason.
- `sensitivity`: `open | internal | restricted`. Set it from the source's own words («confidencial», «restrito», disciplinary, payroll, whistleblowing).
- `default: creator_only` declares that nobody beyond the creator and the administrators needs access.
- `note` records a known limitation (typically "starters see all cases" on a restricted workflow); `decisions[]` carries the question to the process owner.

## Who gets a grant

Propose from the actors of the source: who **opens** the case (`create_incident`; `organization` when any employee may), who **owns the design** (`edit`). Executing and validating teams get **no** grant by default: assignees and deciders see the cases that carry their actions. A `view` grant to such a team is proposed only when the source says the team sees every case (a shared queue, «a área acompanha todos os pedidos»), and it carries the `reason` and `sourceRefs` that rule 4 requires. Emit a manual-trigger allowlist only when the source restricts starts *below* the `create_incident` holders (everyone may view, HR alone may open) and say so in the trigger's reason.

## `--check` rules

| # | Rule | Severity |
| --- | --- | --- |
| 1 | Every `group:` grantee is a `groups[]` key; every `user:` grantee is `verified: true` in some `groups[].members` or listed in a `sources[].emails` entry; never a UUID | error |
| 2 | Every `level` is one of the four (connected: `setup_references_list.permissionLevels`; offline: the bundled engine) | error |
| 3 | Every workflow declares access: at least one grant or `default: creator_only` | error |
| 4 | Ownership does not imply visibility. An assigned group without a grant is reported (info). A `view`-or-above grant to an assigned group needs a `reason` **and** `sourceRefs`; without them it is an error on a `restricted` workflow and a warning elsewhere. Never propose `view` from `assigneeRef` alone | info / warning / error |
| 5 | A `restricted` workflow never grants `view`-or-above to `organization` (error, no justification branch). Any `create_incident` grant on it means starters see every case: warning until `access.note` records the limitation, then info | error / warning |
| 6 | A group holding `admin` that also decides in the same workflow | warning |
| 7 | Every `ownerArea` boundary crossed by a start grant or a sub-workflow edge; unaffected by grants, the platform creates the child for the decider | info |
| 8 | Allowlists: every `allowedGroups` key resolves (error; in connected mode it also needs a receipt); duplicate group names (warning); an allowlist below an organization-wide grant is deliberate narrowing (info, Owners are not exempt). "Nobody can start" is membership-aware: members of the granted groups and their child groups, direct `user:` grants and `allowedUsers`, only enabled manual triggers (one open trigger admits everyone with the permission); the creator's implicit admin does not bypass the list. An allowlist that admits nobody (empty verified groups, no users): error; an empty intersection with the explicit starters, an unverified or role-only member, or an `organization` grant: warning "cannot determine who can start" with the missing evidence | info / warning / error |

Also: `creator` at a level other than `admin` (warning), a duplicate grantee (error), a grant without a reason (warning), a `permissions:` key in the workflow file (error), and a workflow file without an `access` section while the manifest declares grants (warning; run the emit script).

The implicit creator and organization administrators are never named in the manifest, so an empty intersection between the admitted set and the explicit starters is always "cannot determine" (any admitted principal may be one of them); the only definitive error is an allowlist that admits nobody at all: no users, and groups whose member list is empty **and** marked `membersComplete: true` (the manifest's proposed list is not the tenant's; an absent or proposed list is unknown membership, a warning).

`capabilities.canStart` cannot be asked for another member, so connected mode never claims a definitive answer to rule 8. `setup.md` carries a named verification step: an identified member of the starter group signs in and confirms the Start button; until then the item is "pending verification" (`access.startVerification` records the result).

## Allowlist states and what counts as applied

A manual-trigger allowlist has three states in the analysis: **unresolved** (a listed group or user has no receipt; the YAML cannot carry the restriction), **resolved** (every principal has a receipt — groups from group receipts, users from `users_search` receipts of kind `user` keyed by the lower-case email — so `resolve-workflow-refs` can write the ids) and **applied** (`triggers[].manual.applied: { at, hash }` was recorded after the import commit or the UI step **and** a receipt resolves the workflow; `hash` is the fingerprint of the allowlist contents, the destination ids they resolved to and the workflow id, printed by the `apply_manual_start` item, so a changed list, a repointed receipt or another workflow invalidates the attestation). The named start verification (`access.startVerification`, one object or a list of `{ member, at, result: canStart | cannot_start, hash }`) clears `verify_can_start` only when some member's **latest** entry (by the instant `at` denotes, an ISO 8601 date-time compared after parsing so offsets and fractions of a second order correctly, the later list entry winning a tie; per member and fingerprint) is `canStart` against the fingerprint of the restriction as applied; a later `cannot_start` from the same member supersedes an earlier success, and a changed list reopens it. Receipts for the principals prove they resolve, never that the workflow restriction exists in the tenant; readiness stays blocked until the state is `applied`, and the named `canStart` verification stays pending after that. A browser package never carries the allowlist, so it can only reach `applied` through a manual receipt after the UI step.

A grant counts as applied only when the tenant read-back (`access.applied[]`, from `workflow_get` with `includeAccess`) shows it at its level or above. A read-back group grant is matched to the manifest group by identity first: when it carries a `granteeId` and the group has a receipt, the two ids must be equal, and a matching name never overrides conflicting ids; the name (or the key) is only the fallback while one of the identities is unknown. The access receipt is complete only when its `unresolved[]` is empty and it belongs to the operation the manifest would send now (its `idempotencyKey` equals the latest recorded operation and the approved grants still hash to it; a receipt without a key cannot be tied to an operation, and the operation must name the current workflow receipt's id); a partial or stale receipt keeps `apply_access` pending and says why. When the manifest records `access.appliedWorkflowId` (the workflow the read-back came from; `reconcile-access` fills it from a snapshot's `workflowId`), a read-back from another workflow proves nothing for the current destination in either direction: no grant counts as applied, no retained grant is computed from it and no revocation is instructed; the analysis, `--check` and `reconcile-access` (`staleReadBacks[]`) ask for a fresh `workflow_get` of the destination instead.

`resolve-workflow-refs` rewrites **both** allowlist arrays and the `enabled` flag of a matched manual trigger from the manifest, so a principal the manifest no longer lists loses the permission (the product admits through either list) and a trigger the manifest disables cannot stay open. A labelled manifest trigger matches only the YAML trigger with the same label, an unlabelled one matches by position, and when a restriction is declared every enabled YAML manual trigger the manifest does not describe is a blocking item (`--check` reports the same as an error on the workflow file): an open trigger admits everyone with the start permission and bypasses the restriction.

## Retained grants and readiness

Merge is the default because it is safe, but it keeps every grant the tenant already holds. After every apply, and in the reconciliation dry run, read `workflow_get` with `includeAccess: true` into `access.applied[]`. `--check` and the map compute `retainedExcess[]`: grants the tenant holds that the manifest does not, or above the approved level. Each is judged as if the manifest proposed it. Readiness is **blocked** when a retained grant violates rule 5 (`organization` at `view`-or-above on a `restricted` workflow), holds `admin` outside the approved set, or fails rule 4 (an assigned group at `view`-or-above on a `restricted` workflow with no source-backed grant). Two ways out, neither a paper exercise: add it to the manifest with `reason` and `sourceRefs` (reruns every rule; nothing satisfies rule 5), or remove it (UI revocation or a reviewed `replace` whose dry-run `revoked[]` the reviewer accepted). The block clears only when a fresh `applied[]` read no longer shows the grant; a scheduled removal changes nothing.

## Reconciliation of existing manifests

`node scripts/reconcile-access.mjs provia-project.json --output provia-project.reconciled.json [--tenant-access snapshot.json]` proposes `access` for every workflow that lacks it, under rule 4: the first action's group (or `organization` when the first action is `creator` and the source says any employee opens) → `create_incident`; `setupNotes` matching «restrito|confidencial|disciplinar|denúncia|salarial» → `sensitivity: restricted`; assigned groups get no `view`, only an `accessReview[]` question ("does this team need every case?"). Everything proposed carries `reason: "proposto por reconciliação"` and waits for human review; restricted workflows are listed first. The snapshot is `{ "<workflow key>": { "grants": [...] } }` from `workflow_get`, so the diff and `retainedExcess[]` are real. The script never writes the source manifest and never applies anything.

## Commands

```bash
node scripts/build-project-map.mjs provia-project.json --check                                   # rules 1–8, retained excess, readiness
node scripts/emit-workflow-access.mjs provia-project.json compras workflow.yaml --output workflow.access.yaml   # browser import: names
node scripts/resolve-workflow-refs.mjs provia-project.json compras workflow.yaml --output resolved.yaml         # connected: keys + groupRefs, allowlist ids
node scripts/plan-workflow-access.mjs provia-project.json compras [--workflow-id <uuid>] [--mode merge|replace] [--retry]
node scripts/reconcile-access.mjs provia-project.json --output provia-project.reconciled.json
```

Against an engine that predates access in the document (1.1.1 lock), `emit-workflow-access` writes `access.yaml` beside the YAML and `setup.md` says so; it never emits `permissions:`.
