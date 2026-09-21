Done. The working directory now holds four artefacts; here is what they contain and what they cannot yet contain.

## What was supplied vs. what I assumed

The only evidence is the one-sentence request. No org chart, departments, administrators, process owner, procedure, workflows, pilot results or permissions were available, and the Provia connector was present but the `org_get_context` call was not permitted in this session, so I worked disconnected and read nothing from a tenant. Assumptions, each recorded as a decision: Angola/Africa/Luanda/AOA as provisional context (D6), English group names because the request was English (D6), two departments "A" (pilot) and "B" (second wave) as the minimum "cross-department" implies (D2).

## Artefacts (in the working directory)

- `provia-project.json` — the design as data: 1 source, 7 placeholder groups, 9 open decisions, empty `workflows[]`.
- `rollout-plan.md` — authority separation, groups table, access policy, coverage check, assignment approaches, role exercises, milestones M0–M7, adoption measures, support.
- `project.html` and `setup.md` — rendered from the manifest with `build-project-map.mjs`.

## Groups design

| Key | Kind | Flags |
|---|---|---|
| `administradores_provia` | role | unnamed, single_person |
| `dono_processo_piloto` | role | unnamed, single_person |
| `departamento_a` → `equipa_a` | container → team | unnamed; `equipa_a` also `segregation` |
| `departamento_b` → `equipa_b` | container → team | unnamed |
| `apoio_rollout` (champions) | team | unnamed — my recommendation, not a source actor |

No emails or IDs were invented; every member is a role with `verified: false`. Segregation is a flag plus D5 rather than an invented approver group, because the source doesn't say whether one team both requests and approves.

## Checks run

`node scripts/build-project-map.mjs provia-project.json --check`: 0 errors, 0 readiness blocks, 5 warnings — every non-container group "owns no action". Those warnings are correct: there is no workflow, so **ownership coverage cannot be computed** and the access matrix has no rows. The plan states the grant policy the pilot workflow must follow (openers `create_incident`, process owner `edit`, administrators `admin`, executing teams no grant) so the workflow designer can fill it in without redesign. The check validates the manifest, not the Markdown.

## Not ready — what gates it

D1 (name the process owner) and D3 (name the pilot process and supply its procedure) block everything else; D2, D4, D5, D7 name people; D8 confirms plan capabilities for reports/AI; D9 asks whether to grant the tenant read.

Recommended next step: `provia-process-discovery` if the pilot process is still undecided, otherwise `provia-workflow-designer` with the procedure — the groups design is waiting on a workflow to own.

```text
Use provia-workflow-designer with provia-project.json in this directory. Turn the attached pilot procedure into the pilot workflow, assign every human action to the group keys already in groups[] (equipa_a, dono_processo_piloto, creator for the requester), declare workflows[].access following section 4 of rollout-plan.md, and keep decisions D1–D9 open unless the procedure answers them. Country and language remain provisional (Angola, en) until D6 is resolved.
```