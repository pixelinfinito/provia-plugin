All four artefacts are written to the working directory: `provia-project.json`, `project.html`, `setup.md`, and `rollout-plan.md`.

**Summary:** No org chart, named actors, workflows or country were supplied, so I couldn't derive a real group design — only propose the ownership scaffold every Provia rollout needs (`org_admin`, `group_admin`, `rollout_steering`, and a placeholder `process_owner_unassigned`), each flagged `unnamed`, plus 7 open decisions (D1–D7) covering department scope, admin/owner names, the missing workflow, an unresolvable segregation check, and the provisional Angola/en/AOA default. `--check` passes with 4 expected warnings (no group owns an action yet, since no workflow exists). The rollout plan, training exercises and milestones are written generically so they can be filled in once the decisions resolve.

Next recommended skill: **`provia-process-discovery`**, since the process/pilot scope (decision D1) is the actual blocker here — without a named department and workflow, ownership can't move past placeholders.

```text
Use provia-process-discovery with provia-project.json in this folder. Help choose the pilot department/process for the cross-department rollout described in rollout-plan.md, so provia-organization-rollout can replace process_owner_unassigned with a real owner. Country: Angola (provisional, unconfirmed — see decision D7); reply in English.
```