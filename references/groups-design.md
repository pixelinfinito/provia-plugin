# Groups derived from the sources

Provia assigns work to users or groups, and groups may have one level of sub-groups. `provia-organization-rollout` turns every actor named in the sources into a proposed group **as data** in `groups[]` of the project manifest, so that `workflow-designer` and `workflow-package` can reference owners by key and connected mode can create them with `groups_apply_plan`.

## For every actor in the sources

Scan the SOPs, policies, checklists and org charts for who acts: «chefia», «Finanças», «DG», «Compras», «o requerente», «RH». For each one produce:

| Field | Content |
| --- | --- |
| `key` | Stable ASCII identifier, for example `chefias`, `financas`, `direccao_geral` |
| `name` | Localized display name as it should appear in Provia. **Unique in the tenant**: the importer resolves `group:<name>` grantees by name and drops an ambiguous one; `--check` warns when two groups share a name |
| `kind` | `team` (executes actions), `container` (a parent with no actions of its own; no «owns no action» warning) or `role` (a one-person-per-record placeholder used as the fallback of a `field:` assignee) |
| `area` | Short key of the organizational area (`gestao_corporativa`, `tecnologia`) so a cross-area start or sub-workflow call is a datum `--check` can report |
| `parentKey` | The parent group when the actor is a team inside a department; one level only |
| `purpose` | One sentence: what this group owns across the project |
| `members` | Proposed members by role, and by email only when the user supplied it; never a UUID. An email is `verified: true` only when it came from a declared source (`source: <source id>`) or from `users_search` (`source: "users_search"`); otherwise `--check` marks it unverified and `setup.md` lists it. `membersComplete: true` says the list is the tenant group's complete membership (read from the tenant, not proposed); only then does an empty list prove the group is empty |
| `sourceRefs` | The sections that justify the group |
| `flags` | Any of the situations below |

The actions the group owns are derived from `workflows[].actions[].assigneeRef`, not stored twice; the map shows them and `--check` reports a group that owns nothing.

## Flag, do not resolve silently

| Flag code | When | What to do |
| --- | --- | --- |
| `single_person` | The actor is one named person (the DG, the only accountant) | Propose a group anyway so ownership survives absences; record the delegate as a decision |
| `alias` | The same actor appears under two names («Finanças», «Direcção Financeira», «DAF») | Propose one key, list the aliases in `purpose`, ask which name the organization uses |
| `segregation` | One group would both request and approve, prepare and validate, or pay and confirm | Keep two groups, mark the pair, and raise a decision for the process owner |
| `requester` | The actor is whoever starts the case | Use `assigneeRef: creator` on the action; do not create a group |
| `external` | The actor is outside the organization (a supplier, an auditor) | Do not create a group; model the interaction as a form or evidence |
| `unnamed` | The source says «the responsible person» without saying who | Create a placeholder key with a decision naming the owner who must answer |

## Approval authorities

An approval authority is a group plus a rule (amount, category, risk). The group goes to `groups[]`; the rule goes to the Decision action's description and, if unconfirmed, to `decisions[]`. Never encode a threshold the sources do not state. Provia does not route automatically on amounts; a human Decision applies the rule.

## The access matrix

`provia-organization-rollout` owns the access matrix across the project: `groups[].kind`, `groups[].area`, `workflows[].ownerArea`, unique names, the organization-wide grants and the segregation review (a group holding `admin` must not also decide in the same workflow). The matrix is data in `workflows[].access` (see [workflow access](workflow-access.md)) and is rendered as the Acesso tab of `project.html` (workflow × grantee × level).

## Deliverable

`groups[]` in the manifest, the flags and decisions they raise, the access matrix, and the prose rollout plan (training exercises, pilot, adoption measures) as before. In connected mode, offer `groups_apply_plan` after review; members whose emails do not resolve stay open. The group key is the contract with the other skills: once set, change it only with a change plan.
