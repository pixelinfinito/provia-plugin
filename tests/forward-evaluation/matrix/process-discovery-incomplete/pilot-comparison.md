# Choosing a four-week Provia pilot

Provisional comparison, 23 September 2026. Plugin artefact only; nothing was created, changed or published in Provia.

## What this is based on

**Supplied evidence: none.** No process inventory, procedure, SOP, checklist, case export, volume figure, owner list or baseline measure was provided, and the working directory was empty. The host offers a `provia-implementer` MCP server, but the `org_get_context` call was not granted permission in this non-interactive session, so the destination organization was not read either. Existing workflows, groups and entity types in your tenant are therefore not reflected here.

**What that means for the ranking below.** The candidate list is a standard back-office set used as a placeholder so the comparison method is concrete and reviewable. It is not an observation of your organization and the names may not match anything you run. Replace it with your real inventory (decision D1) and the ranking may change.

**What is genuinely decided here** is the rule for choosing, not the winner. The gates and the flip conditions hold whatever your inventory turns out to be. The named winner is conditional and states the evidence that would overturn it.

Country context is provisional: no country was supplied, so Angola / AOA / Africa/Luanda is recorded as a provisional starting context and the reply is in English because the request was in English (decision D8). No legal provision, approval threshold, statutory deadline or retention period is asserted anywhere in this document.

## What a four-week window actually constrains

Four weeks is short enough that it decides the choice on its own. A pilot only teaches you something if complete cases finish inside it, are looked at, and the design is corrected. That gives five gates. A candidate that fails one is not a four-week pilot, however valuable it is.

| Gate | Test | Why it is a gate, not a preference |
| --- | --- | --- |
| G1 Cycle fits | A typical case goes from start event to end condition in about a week or less | At four weeks you need several full cycles plus time to review and fix. A three-week process yields one case and no second attempt. |
| G2 Arrivals are enough | Enough cases start in four weeks to exercise the design, including its exceptions | A correct design that runs twice proves nothing. Rare processes hide their exception paths. |
| G3 One named owner | A person, not a mailbox or an alias, with authority to change how the work is done | Every pilot surfaces a design question in week one. Without someone who can answer it, the pilot stalls and the calendar runs out. |
| G4 Self-contained | A case can be completed without an ERP, payroll, bank or ticketing integration working first | Integration work does not fit in four weeks alongside the process design, and it moves the failure out of your control. |
| G5 Recoverable | A mistake costs rework, not a missed statutory deadline, a wrong payment or a bad employment record | A first pilot will have design errors. Choose where that is affordable. |

Tiebreakers after the gates, in order: a written procedure already exists (less of the four weeks spent on discovery), the evidence gap is worth closing (approvals currently untraceable), and the number of visible handoffs where work waits today.

Impact and monetary saving are deliberately not tiebreakers here. The highest-impact process is usually the one that fails G1 and G4, and picking it is the common way a pilot runs out of calendar with nothing completed.

## Provisional comparison

Placeholder candidate set. Every cell marked *unknown* is a real gap, not a low score.

| Candidate | Start event | End condition | G1 Cycle | G2 Arrivals | G3 Owner | G4 Self-contained | G5 Recoverable |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Internal IT / service requests | An employee asks for access, equipment or a fix | The requester confirms the request is resolved, or it is rejected with a reason | Typically days. unknown — D3 | Typically the highest arrival rate of the three. unknown — D2 | unknown — D4 | Usually yes, if the pilot stops at the request record and does not provision systems | Yes. Rework only |
| Purchase requests | A department states a need to buy | The order is placed, or the request is rejected | Often crosses supplier response time and runs to weeks. unknown — D3 | Moderate. unknown — D2 | unknown — D4, though this process usually does have a clear finance owner | Often no. Usually ends in an ERP or accounting system — D5 | Mixed. Approval thresholds unconfirmed — D7 |
| Employee onboarding | A signed acceptance, or a confirmed start date | The new employee is working with access, equipment and records complete | Spans the start date and past it. Weeks by definition. unknown — D3 | The lowest arrival rate of the three. unknown — D2 | unknown — D4. Usually split between HR and the hiring department | No. Payroll and access systems | No. Employment records and statutory obligations — D7 |

### Reading the table

**Internal IT / service requests passes every gate it can be assessed on.** Short cycle, high arrival rate, contained inside one team, and a mistake means someone re-submits a request. Four weeks would produce enough completed cases to see the exception paths, not just the happy one.

**Purchase requests is the strongest second workflow and a weak first one.** It usually carries the most visible pain and the clearest evidence gap, which makes it tempting. But it commonly fails G1, because the clock includes a supplier's response time you do not control, and G4, because the case is not really finished until something is recorded in a system outside Provia. It also carries approval thresholds that nobody has confirmed (D7), and inventing one would put a wrong control into the design. Run it second, once the mechanics are proven and there is time to do the integration properly.

**Employee onboarding is the wrong shape for four weeks.** Its cycle is defined by a start date, so a four-week pilot sees few complete cases or none. It spans departments, so G3 needs two owners who agree. And it touches employment records, which is the opposite of G5.

## Recommendation, and what would change it

**Pilot internal IT / service requests**, subject to confirming an owner.

The reasoning is cycle time and arrival rate. It is the only candidate in this set where four weeks buys you several completed cases, a review, a correction and a second run. That is what a pilot is for. It is not the highest-value process of the three, and that is the intended trade: the first workflow is how the team learns Provia, and the expensive process is the second one, designed by people who have already done it once.

**The condition that overturns this.** If IT requests are handled by an outsourced provider, a shared mailbox or a rotating duty with no individual who can decide how the work is done, do not pilot it on speed alone. A fast process nobody can change produces a stalled pilot, which is worse than a slower one that moves. In that case, pick the fastest candidate that does have a named owner — in this placeholder set, that is usually purchase requests, accepting a longer cycle and a narrower scope to compensate (see the boundaries below). Answering D4 decides this, and it should be answered before design starts, not during.

**A second condition.** If the chosen candidate produces fewer than roughly ten cases in four weeks, G2 fails and the pilot cannot exercise its own exception paths. Move to the highest-arrival candidate that still has an owner. D2 decides this.

## Pilot boundaries

The smallest version that still teaches something. Everything outside these lines is deliberately deferred, not forgotten.

In scope:

- One request category, chosen because it is the most frequent, not the most complicated.
- One intake path, so every case enters the same way and the record is comparable.
- One approval or triage decision, with rejection carrying a required reason.
- Closure with evidence attached, so a finished case can be shown to someone who was not involved.

Out of scope for the four weeks: a catalogue covering every request type, any integration with another system, AI-assigned actions, reporting beyond what Provia records on its own, and any second process.

## Owner and success measures

**Owner: unresolved (D4).** The pilot needs one named person before design starts. This is the single most likely cause of a four-week pilot not finishing, and it is not something the design can work around.

**Proposed success measures.** These are recommendations, not agreed measures, and none of them has a baseline yet. Each needs its current value recorded before the pilot starts, otherwise the pilot ends with numbers nobody can interpret (D3, D9). All four are readable from Provia's own execution records without extra tooling:

- Share of completed cases where every step has a recorded owner.
- Elapsed time from start event to end condition, per case.
- Share of completed cases closed with the required evidence attached.
- Number of cases that still needed email outside Provia to progress. This is the honest one — it measures whether the workflow matched the real work or was routed around.

**Review point.** After ten completed cases, or at the end of week three, whichever comes first, with the named owner. Early enough that a correction can still run inside the pilot.

## Open questions

All ten are recorded as `decisions[]` in `provia-project.json`, each with an owner, all currently open. D1 (the actual inventory) and D4 (the named owner) block the design; the rest can be answered while it proceeds. D10 records that the connected read of your Provia organization was offered by the host but not authorized here.

## What was verified

`node scripts/build-project-map.mjs provia-project.json --check` ran against the manifest and reported: 0 workflows, 0 groups, 0 entity types, 0 forms, access declared on 0/0, 0 readiness blocks, 10 pending items, 0 warnings. That check covers the manifest's shape and cross-references only. It does not validate this document, and it says nothing about whether the pilot choice is right for your organization — that depends on evidence that has not been supplied.
