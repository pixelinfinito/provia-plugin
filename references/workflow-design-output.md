# Workflow design deliverable

`provia-workflow-designer` returns a design the customer can sign off in one reading and the package skill can turn into YAML without a second interpretation. Five parts, in this order.

## 1. Source step classification

Every numbered step, sentence or checklist item in the sources receives one classification, with the reason and the action that owns it. Nothing from the source is dropped without a row.

| Classification | Meaning | Where it lands |
| --- | --- | --- |
| `action` | An observable unit of work by one owner with evidence | Its own action |
| `decision` | An authorized person chooses between outcomes | A Decision action with named branches |
| `folded` | A hand-off, an "is informed", or a sub-step of one person's task | A numbered step in `Como` of the owning action and `actions[].folded[]` in the manifest |
| `automation` | A notification, wait, HTTP call or sub-workflow | An automated action, detailed later by `provia-automation-designer` |
| `intake` | Data collected before the case exists | The trigger form, detailed by `provia-form-designer` |
| `out_of_scope` | Outside the requested process or not repeatable work | Recorded with the reason; may raise a decision |
| `conflict` | Two sections disagree | Kept unresolved; a `decisions[]` entry names the owner |

Format: a table with source id and section, the source text (short quote), classification, reason and target action id.

## 2. Action table

One row per action: `localId`, name (verb-led), type, `assigneeRef` (group key from `groups[]`, `creator`, `previous`, `ai:<profile>`, or `field:<field key>` with an `assigneeFallback` when the source names "the person in field X" — a design requirement the product cannot execute yet), the five-part description summarized as task + evidence, `due` proposal with its basis in the source or "open decision" (`dueInSource` when the source fixes a deadline `due` cannot express), and the `sourceRefs`. Document templates cited in descriptions go to `workflows[].templates[]`; an actor or entity type the canonical registry lacks goes to `unresolvedActors[]` / `unresolvedEntityTypes[]`, never invented as a new key. Decisions list their branches and outcomes (`continue`, `cancel_incident`, `return_to_action` with target, `trigger_workflow`). The full five-part descriptions go into the YAML skeleton and the manifest, not into the table. Write them as Markdown following [action writing](action-writing.md), preserving paragraphs and lists with a literal YAML block and the same string in the manifest.

Actors that have no group yet become proposed `groups[]` entries following [groups design](groups-design.md), flagged for `provia-organization-rollout` to complete.

## 3. Flow diagram

A Mermaid `flowchart TD` of the actions in execution order: sequential actions as a chain, parallel actions as a fork and join, decisions as diamonds with one labelled edge per branch, returns as edges back to the target, cancellations to an end node. Node text is `localId: name`. The diagram is for sign-off; it does not replace the table.

## 4. YAML skeleton

A `provia.ao/v1` `Workflow` document with metadata, the trigger, the fields the design needs, and every action with `id`, `name`, `type`, `executionMode`, `required`, the full five-part `description`, `due` when proposed and `config.branches` for decisions. Omit `assignee` where the owner is a group not yet resolved; the manifest's `assigneeRef` carries the intent. Never add keys the contract does not know, such as `assigneeRef` in YAML. State that this is a skeleton for `provia-workflow-package`, which runs the validator; do not claim it was validated.

## 5. Manifest entry

The `workflows[]` object for the manifest with the actions, `sourceRefs`, `assigneeRef`, `entityRefs`, `formRef`, `evidence`, `due` and `folded`, the `access` section (who opens → `create_incident`, who owns the design → `edit`, `sensitivity` from the source's words, no grant to executing teams unless the source says they see every case; see [workflow access](workflow-access.md)), `ownerArea`, `triggers[]` with a manual allowlist only when the source restricts starts below the `create_incident` holders, plus any new `groups[]` and `decisions[]` (including the "starters see all cases" limitation of a restricted workflow). Write it to `provia-project.json` when file creation is available; otherwise include it in the response as a JSON block. Run `node scripts/build-project-map.mjs provia-project.json --check` when a shell is available and report the result.

## Then

End with the open decisions the owner must answer before packaging, and the next-skill recommendation: usually `provia-organization-rollout` to complete the groups, `provia-information-model` when actions reference entity types that do not exist, `provia-form-designer` when an action is Form Fill, or `provia-workflow-package` when everything is resolved.
