# Cross-department Provia rollout (context incomplete): Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

Nothing pending.

## Groups to create

- `administradores_provia` Provia administrators [role]: Organization administration only: invite users, maintain groups and memberships, hold `admin` on workflows so grants can be reviewed and revoked. Does not own a process and does not decide inside workflows (segregation rule 6). Recommended: at least two named people so administration survives absences.. Proposed members: Organization administrator (primary), Organization administrator (backup)
- `dono_processo_piloto` Process owner – pilot process [role]: Process ownership of the pilot workflow: answers the open decisions, approves the design, holds `edit` on the pilot workflow (publishing a version), signs off pilot results before expansion. Separate from organization administration and from action execution.. Proposed members: Process owner (pilot)
- `departamento_a` Department A (pilot – to be named) [container]: Placeholder for the department that pilots Provia first. Parent of its executing team; owns no action directly.
- `equipa_a` Department A – executing team (to be named) [team] (↳ `departamento_a`): The team of the pilot department that executes Standard, Form Fill and Decision actions in the pilot workflow. Will own at least one action once the pilot workflow is designed; until then `--check` correctly reports it owns nothing.. Proposed members: Team member (executes actions), Team lead (decides, if the source confirms)
- `departamento_b` Department B (second wave – to be named) [container]: Placeholder for the second department in the rollout. Parent of its executing team; owns no action directly. Created now so the cross-department access matrix and the expansion milestone have a target.
- `equipa_b` Department B – executing team (to be named) [team] (↳ `departamento_b`): The team of the second department that will execute actions in the expanded or second workflow. Owns no action until that workflow is designed after the pilot review.. Proposed members: Team member (executes actions)
- `apoio_rollout` Provia rollout support (champions) [team]: First-line support during the pilot: one champion per participating department plus the implementer. Answers 'where do I click' questions, collects confusion and late-work evidence for the pilot review. Recommended by this skill, not named in the sources; owns no workflow action by design.. Proposed members: Champion – Department A, Champion – Department B, Implementer

## Group flags

- `administradores_provia`: Owner unnamed in the sources. No administrator list was supplied. Decision D4.
- `administradores_provia`: Single-person actor: name a delegate. Risk if the organization names only one administrator; a backup is requested in D4.
- `dono_processo_piloto`: Owner unnamed in the sources. No process owner named. Decision D1 blocks rollout readiness.
- `dono_processo_piloto`: Single-person actor: name a delegate. Ownership is usually one manager; a delegate must be named (D1).
- `departamento_a`: Owner unnamed in the sources. Department not named in the request. Decision D2.
- `equipa_a`: Owner unnamed in the sources. Members and team name unknown. Decision D2.
- `equipa_a`: Segregation of duties: confirm distinct owners. If the same team both requests and approves in the pilot process, keep a separate approver group. Decision D5.
- `departamento_b`: Owner unnamed in the sources. Department not named in the request. Decision D2.
- `equipa_b`: Owner unnamed in the sources. Members and team name unknown. Decision D2.
- `apoio_rollout`: Owner unnamed in the sources. Recommendation; nobody assigned. Decision D7.

## Open decisions

- **D1** Who is the process owner of the pilot process (and their delegate)? Without this person nobody can answer D2–D5 or sign off the pilot; the rollout is not ready. (Owner: Rollout sponsor (to be named))
- **D2** Which departments take part, which one pilots first, and in what order do the others follow? Replace `departamento_a`/`departamento_b` and their teams with the real names and members (emails from an org chart or directory export, or a users_search result). (Owner: Rollout sponsor (to be named))
- **D3** Which process is the pilot, and where is its procedure (SOP, checklist or interview notes)? No workflow exists in this manifest, so ownership coverage cannot be checked and the access matrix has no rows. (Owner: Process owner (D1))
- **D4** Who are the organization administrators (at least two named people)? Confirm they are not also deciders in the pilot workflow. (Owner: Rollout sponsor (to be named))
- **D5** Segregation: in the pilot process, does the same team both raise and approve requests (or prepare and validate)? If yes, a separate approver group is required and must be named. (Owner: Process owner (D1))
- **D6** Country, language and tenant display language. Angola / Africa/Luanda / AOA are provisional; group names are in English because the request was. Confirm before groups are created, since names must be unique in the tenant and are how the importer resolves grants. (Owner: Rollout sponsor (to be named))
- **D7** Who provides first-line support during the pilot (one champion per department plus the implementer)? Name the members of `apoio_rollout` or reject the group. (Owner: Rollout sponsor (to be named))
- **D8** Which plan and settings does the tenant have? Reports and AI depend on plan, permissions and settings; the 'review a report' training exercise and the report-based adoption measures are conditional on them. (Owner: Provia administrators (D4))
- **D9** Connected mode: the host lists the Provia implementer server, but permission to call org_get_context was not granted in this session. Should the tenant be read (existing groups, users, permission levels) before the placeholders are replaced? Until then the design stays disconnected and no email is verified. (Owner: Implementer)

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
