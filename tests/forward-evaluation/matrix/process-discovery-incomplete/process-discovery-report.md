# Process discovery: which process fits a four-week Provia pilot

Date: 2026-09-21 · Skill: provia-process-discovery (provia-skills 1.2.0) · Manifest: `provia-project.json`

## 1. What this report is based on

**Confirmed facts**

- The only supplied evidence is the request itself: "Compare our processes and explain which one fits a four-week pilot. Some required context is unavailable." (source `discovery-request-2026-09-21`).
- The working directory contained no process inventory, SOP, case export, volume figure, owner list, baseline measure or constraint.
- The host offers the Provia implementer tool `org_get_context`, but the read was not granted in this session, so nothing about the organization's existing workflows or groups was read. Mode: disconnected.
- No country was supplied. Angola (AOA, Africa/Luanda) is used as a provisional context, as the plugin conventions require when none is given. No legal or tax conclusion in this report depends on it.

**Assumptions stated so work could continue**

- The candidate set below (purchase request, employee onboarding, IT request) is *assumed*. It is the set of email-driven processes most organizations put forward for a first Provia workflow and the one used in this skill's own examples. It must be replaced by the real inventory (decision D1). The structural comparison holds for these three process shapes; the ranking must be re-checked once volumes and owners are known.
- All numbers that would normally drive the ranking (cases per month, days per case, backlog) are marked **unknown**. Nothing was estimated in their place.

## 2. Candidates: start event, end condition, repeatability

| Candidate | Starts when | Ends when (observable) | Repeatable? |
| --- | --- | --- | --- |
| Purchase request | A requester asks for goods or a service (email or paper form) | The request is approved and an order/payment is released, or the request is rejected with a reason | Yes, same steps every time |
| Employee onboarding | A hire is confirmed with a start date | The new employee has contract, accounts, equipment and induction complete | Yes, but each case touches several departments |
| IT request | A user reports a need or a fault | The request is fulfilled or declined and the user is informed | Yes, but the scope per case varies widely (password reset to laptop purchase) |

## 3. Provisional comparison

Values marked "unknown" are exactly what decisions D1–D5 ask for. The qualitative columns describe the *shape* of each process, not measured performance.

| Criterion | Purchase request | Employee onboarding | IT request |
| --- | --- | --- | --- |
| Impact of delay | Blocks operations and spend control; approvals are audited | Poor first week for a hire; account and access gaps | Lost productivity per user |
| Frequency (cases/month) | **unknown** | **unknown** (typically low in a small organization) | **unknown** (typically the highest of the three) |
| Handoff delay today | **unknown** — typically requester → manager → finance by email | **unknown** — HR → IT → facilities in parallel | **unknown** — often no queue at all |
| Evidence gaps | Approval and quotation often live in email threads | Checklists exist but completion is rarely recorded | Requests and resolutions often unrecorded |
| Ownership | Usually one accountable area (finance/administration) — **to confirm, D3** | Split between HR, IT, facilities; no single owner is common | Often nobody is accountable end to end — **to confirm, D4** |
| Fit with Provia action types | Sequential Standard actions + one Decision with named outcomes (continue / cancel); evidence as files and mandatory comment on rejection | Mostly parallel Standard actions owned by different groups; Provia sequences predecessors and parallel work suits independent tasks, so this works but needs more groups | Standard action + Decision; a Form Fill or intake form is needed to classify the request; category branching is manual (no automatic value-based branching) |
| Build effort in a four-week window | Low: 4–6 actions, 2–3 groups, one intake form | Medium: 8–12 actions, 3–4 groups, checklist evidence | Low to medium: few actions, but the category set and the intake form need agreement |
| Enough completed cases to learn from in four weeks | **depends on D2** | Unlikely unless hiring is frequent | Likely, if the volume is what it usually is |

## 4. Ranked shortlist (provisional)

1. **Purchase request** — clearest ownership pattern, the Provia design is a short sequential flow with one Decision, and the evidence the process needs (approval, quotation, rejection reason) maps directly to files, comments and metadata. Risk: if volume is low, four weeks may not produce enough completed cases (D2).
2. **IT request** — probably the fastest to build and the most frequent, so it produces the most cases in four weeks. Risk: without a single named owner nobody approves the design, reassigns stalled work, or reviews results. Speed is not enough if that person does not exist (D4).
3. **Employee onboarding** — most cross-functional; valuable later, but it needs several groups, probably has few cases in four weeks, and the pilot would spend its time on organization design instead of learning how Provia runs a case.

**The trade-off between 1 and 2.** IT requests are likely the fastest and busiest; purchasing is likely the one with an owner. The skill's rule applies: do not rank by speed alone. If D4 shows that IT has a named owner and D2 shows IT volume clearly above purchasing, IT requests become the recommended pilot and this report should be regenerated with that choice. If both have owners, choose the one with more cases in the last three months.

## 5. Pilot choice (provisional): purchase request

Recorded as `project.title` in the manifest. It stands only until D1–D4 are answered.

**Boundaries (smallest useful scope)**

- In scope: a request from any employee, one manager decision, one finance/administration check, release or rejection, requester informed. Cases that need a second approval level stay in scope only if the limit is already written in a document the owner supplies (D6); no threshold is invented here.
- Out of scope for the pilot: supplier registration and evaluation, contract negotiation, payment execution in the accounting system, integrations (ERP, email notifications beyond Provia's own), AI-assigned actions.
- Trigger: manual start or a form intake by the requester (form definitions are configured outside YAML).

**Owner**: the head of the area that already approves purchases (finance or administration) — to be named under D3. Without a named owner, the pilot does not start.

**Groups the designer will need** (to be confirmed by the organization-rollout skill later): requesters (organization-wide `create_incident`), approving managers, finance/administration.

**Success measures**

| Measure | Baseline | How measured in the pilot |
| --- | --- | --- |
| Days from request creation to decision (median) | **observed value needed — D5** | Incident creation to Decision completion in Provia |
| Share of cases with the approval recorded (comment or file) | **observed value needed — D5** | Decision outcome plus mandatory comment on rejection |
| Completed incidents during the pilot | not applicable | Count of incidents that reach the end condition |
| Actions overdue at the pilot review | not applicable | Overdue actions in the Provia case list |

No target values are set here; the owner sets them once the baseline is observed. Improvement claims without a baseline are estimates and should be labelled as such.

**Four-week shape**

- Week 1: answer D1–D6, name the owner, collect the baseline, agree the design brief (`provia-workflow-designer`).
- Week 2: draft workflow, form and groups; review with the owner (`provia-workflow-review`); publish in Provia by an authorized person.
- Weeks 3–4: run real requests only in Provia (no parallel email path for those cases).
- Review: after five completed incidents or at the end of week 4, whichever comes first — cycle time, evidence completeness, overdue actions, what the assignees found unclear.

## 6. Information needed to decide (open decisions)

| Id | Question | Owner |
| --- | --- | --- |
| D1 | Real process inventory: name, start event, end condition, owner | Project sponsor |
| D2 | Cases per month per candidate, last three months, from an actual register | Each process owner |
| D3 | Named end-to-end owner for purchase requests | Project sponsor |
| D4 | Does IT request have a single named owner? (ranking flips if yes and volume is higher) | IT lead |
| D5 | Baseline for the chosen pilot: median days to decision, share with written approval | Pilot process owner |
| D6 | Governing documents for the pilot (procedure, approval limits, templates) | Pilot process owner |
| D7 | Confirm country and response language (Angola provisional) | Project sponsor |
| D8 | Grant the tenant read (`org_get_context`) so existing configuration is recorded as sources | Implementer |

## 7. What was and was not verified

- Written: `provia-project.json` (sources[], decisions[], project.title), this report, `project.html`, `setup.md`.
- Checked: `node scripts/build-project-map.mjs provia-project.json --check` on the manifest (shape and references). This check does not validate the content of this Markdown report.
- Not done: no Provia organization was read or changed; no workflow, form, group or entity type was designed; no volumes or savings were estimated; no completed platform action is claimed.

Product references used: `references/provia-capabilities.md` (action types, Decision outcomes, sequential vs parallel work, access levels, workdays skip weekends only), `references/project-manifest.md`, `references/country-context.md`.
