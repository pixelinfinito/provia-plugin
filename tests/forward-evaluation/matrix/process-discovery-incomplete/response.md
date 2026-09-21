## What I had to work with

The working directory was empty: no process inventory, SOP, case export, volumes, owners or baseline. The host offers Provia's `org_get_context`, but the read wasn't granted in this session, so I worked disconnected. No country was supplied, so Angola (AOA, Africa/Luanda) is the provisional context.

Since no inventory exists, I used the three email-driven processes this skill's own examples name — **purchase request, employee onboarding, IT request** — as an assumed candidate set. That assumption is recorded as decision D1 and must be replaced by your real list.

## Provisional comparison

| | Purchase request | Employee onboarding | IT request |
|---|---|---|---|
| Ownership | Usually one accountable area (finance/admin) — to confirm | Split across HR/IT/facilities | Often nobody end to end — to confirm |
| Provia shape | Short sequential flow + one Decision (continue/cancel), evidence as files and rejection comment | Many parallel actions, 3–4 groups | Few actions, but needs an agreed category set and intake form |
| Build effort in 4 weeks | Low | Medium | Low–medium |
| Cases/month | **unknown** | **unknown** (usually low) | **unknown** (usually highest) |

**Ranking (provisional):** 1. Purchase request, 2. IT request, 3. Employee onboarding.

**The trade-off that decides it:** IT requests are probably the fastest to build and the busiest, so they would give the most completed cases in four weeks — but if there's no single named owner, nobody approves the design or unblocks stalled cases. Purchasing usually has that owner. If your data shows IT *does* have a named owner and higher volume than purchasing, the ranking flips (D4). I did not rank by speed alone, and I invented no volumes or savings.

**Pilot scope:** request → manager decision → finance check → release or rejection with reason → requester informed. Out: supplier management, payment execution, ERP integration, AI actions. Success measures are defined (median days to decision, share with written approval, completed incidents, overdue actions) but **no baseline values** — those are observed values you must supply (D5), not estimates. Review after five completed incidents or end of week 4.

## Artefacts written

- `process-discovery-report.md` — full comparison, pilot choice, boundaries, four-week shape, open decisions
- `provia-project.json` — manifest with `sources[]` (the request as the only evidence), 8 `decisions[]` with owners, provisional `project.title`
- `project.html`, `setup.md` — generated from the manifest

Check run: `build-project-map.mjs --check` on the manifest passed (0 warnings, 8 pending items = the open decisions). It doesn't validate the Markdown report. Nothing was read from or created in Provia.

## Before this becomes a real decision

You need to answer D1–D5: the real inventory, cases per month from an actual register, a named owner for purchasing, whether IT has one, and the current baseline. If you grant the `org_get_context` read (D8), I can also record existing workflows and groups as sources.

**Next step:** stay in `provia-process-discovery` once the missing context arrives — the ranking may change, so the design brief shouldn't be handed to the workflow designer yet.

```text
Use provia-process-discovery with provia-project.json in this directory. Here is the real process inventory with owners and cases per month for the last three months: [paste]. Re-rank the candidates, resolve decisions D1–D5, confirm or replace the provisional purchase-request pilot, and update the manifest. Country: [confirm or correct Angola].
```

If purchasing is confirmed as the pilot with an owner and volume, go straight to `/provia-skills:provia-workflow-designer` with the manifest and the governing documents from D6.