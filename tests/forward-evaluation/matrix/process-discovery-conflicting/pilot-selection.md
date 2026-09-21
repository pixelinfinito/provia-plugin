# Pilot selection: Purchasing vs IT support

Date: 2026-09-21 · Skill: `provia-process-discovery` · Mode: disconnected (no Provia organization was read; the `org_get_context` tool was offered by the host but permission was not granted, so nothing was read or changed in Provia).

## Answer

Start the pilot with **IT support, owned by Ana**. Purchasing has the shorter cycle (2 days vs 5), but nobody will own it, and a pilot without an owner produces no decisions, no exceptions handled and nothing to learn from. "Fastest" for a pilot means fastest to a reviewable result, not the shortest cycle time of the process itself; on that measure IT support wins.

Purchasing is not rejected. It becomes the second workflow the day someone accepts ownership (decision D6).

## What was supplied (confirmed facts)

Two statements in chat, recorded in the manifest as sources `chat-purchasing` and `chat-it-support`:

| Process | Stated duration | Owner | Source |
| --- | --- | --- | --- |
| Purchasing | 2 days | none — "nobody will own it" | `chat-purchasing` |
| IT support | 5 days | Ana | `chat-it-support` |

Not supplied, and not assumed: case volumes, request types, who else works on each process, how the durations were measured, the start and end events, organization name, sector and country. Country context defaults provisionally to Angola (en, AOA, Africa/Luanda) per the plugin conventions; decision D7 asks the sponsor to confirm.

## Start and end of each process (to confirm)

The skill requires a start event and an observable end condition for each candidate. Neither statement gives them, so these are proposed readings for Ana and the sponsor to correct (D2):

- **IT support**: starts when a colleague reports a problem or asks for something from IT (channel unknown); ends when the requester confirms the problem is solved or the request delivered, or when Ana closes it after no reply.
- **Purchasing**: starts when someone requests goods or a service; ends when the order is placed with the supplier or the goods are received (which of the two counts as "done" is unknown).

Both are repeatable organizational work rather than one-off tasks, so both qualify as Provia workflow candidates.

## Comparison

| Criterion | Purchasing | IT support | Source / status |
| --- | --- | --- | --- |
| Named owner | No | Yes (Ana) | Confirmed in both statements |
| Stated cycle time | 2 days | 5 days | Stated, not measured; measure and period unknown (D3) |
| Room for visible improvement | Small: a 2-day cycle leaves little handoff delay to remove | Larger: 5 days suggests waiting between steps that Provia's action sequencing and due dates would expose | Recommendation, not evidence |
| Frequency / volume | Unknown | Unknown | Not supplied (D4) |
| Evidence gaps | Unknown | Unknown | Not supplied |
| Implementation effort | Typically involves approvals and suppliers; who approves what is unknown and nobody is available to answer | One team, one owner who can answer design questions | Recommendation |
| Who reviews results after the pilot | Nobody | Ana | Follows from ownership |

## Why ownership outranks speed here

1. **A pilot is a learning exercise.** Someone must define the actions, decide exceptions, answer the designer's questions and review the first completed cases. Purchasing has no one to do any of that, so its 2-day cycle cannot even be confirmed, let alone improved.
2. **Provia assigns actions to groups and people.** A workflow whose actions have no assignee does not run; every case would sit unassigned from the first day. The workflow reviewer would fail it on ownership before publication.
3. **The shorter process has less to show.** A pilot should make a visible difference within a few weeks. Taking a 5-day process to, say, 3 days is observable; shaving hours off a 2-day process without a baseline is not.
4. **The speed argument is weaker than it looks.** "2 days" and "5 days" are stated, not measured (D3). Until Ana confirms how the 5 days were observed, the comparison is between two unverified numbers, and the one thing that is verified is who will show up.

If management names a Purchasing owner before the pilot starts, the comparison should be redone with that person present; until then the recommendation stands.

## Pilot definition

**Process**: IT support request, from report to confirmed resolution.

**Owner**: Ana (process owner and reviewer of the first cases). Whether Ana also executes every action, or a team does, is open (D5); the designer should not assign actions to a single named user without that answer.

**Smallest useful scope**:
- One intake path (the channel Ana names in D2).
- The request types that make up most of the volume (D4); rare or specialised requests stay outside the pilot.
- No integrations, no AI assignees, no sub-workflows in the first version. A manual trigger, a short sequence of standard actions with due dates, one decision (solved / not solved), and evidence of resolution on the closing action.

**Out of scope for the pilot**: purchasing of IT equipment (that is the Purchasing process), external supplier tickets, anything requiring an approval chain that has not been described.

**Success measures** (baseline is to be observed, not assumed):
- Cycle time from report to confirmed resolution, measured in Provia workdays on the pilot cases, compared with the 5-day figure once D3 says what that figure means. No target is set until a baseline exists.
- Share of cases with the closing evidence attached (target: every closed case).
- Share of cases that stay unassigned or overdue at any point (the earliest signal that the design or the ownership is wrong).

**Review point**: after several completed cases — proposed after the first 10 closed cases or 4 weeks, whichever comes first — Ana and the sponsor review the cases together and decide whether to widen scope, change the design (`provia-workflow-change`) or stop.

## Open questions (recorded as manifest decisions)

| Id | Question | Owner |
| --- | --- | --- |
| D1 | Accept IT support over the shorter Purchasing process | Pilot sponsor |
| D2 | Start event and end condition for an IT support request | Ana |
| D3 | What "5 days" is (average/median/worst; calendar/workdays; period) | Ana |
| D4 | Monthly volume and request-type mix | Ana |
| D5 | Who works IT support besides Ana; who covers absences | Ana |
| D6 | Will management name a Purchasing owner | Pilot sponsor |
| D7 | Organization, country, language, currency, timezone | Pilot sponsor |

The sponsor is not named in the sources; decisions D1, D6 and D7 carry "Pilot sponsor (not named in the sources)" as owner until a person is identified.

## Artefacts and checks

- `provia-project.json` — manifest `provia-project/v1.1`, project key `it-support`, title "IT support request pilot", two `sources[]`, seven `decisions[]`, no workflows, groups, entity types or forms yet.
- `project.html` — offline map rendered from the manifest.
- Check run: `node scripts/build-project-map.mjs provia-project.json --check` → 0 workflows, 0 readiness blocks, 0 warnings, 7 pending items (the open decisions). The check validates the manifest shape and references; it does not validate this Markdown report and it says nothing about business correctness.
- Not done: no Provia organization was read, no group, workflow or form was created, no volumes or baselines were measured.

References used: `references/skill-conventions.md`, `references/project-manifest.md`, `references/country-context.md`, `references/provia-capabilities.md` (ownership and assignment, workdays skip weekends only), `references/connected-mode.md`.

## Hand-off to the designer

Design brief for `provia-workflow-designer`: IT support request workflow, owner Ana, scope as above, sources `chat-it-support` (anchors `cycle-time`, `ownership`). The designer must resolve D2 and D5 before assigning actions and should cite them as open decisions rather than inventing a team.
