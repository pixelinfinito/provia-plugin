Done. Four artefacts in the working directory: `pilot-comparison.md`, `provia-project.json`, `project.html`, `setup.md`.

## The honest headline first

**No context was supplied at all.** The working directory was empty — no inventory, procedures, exports, volumes, owners or baselines. The host does offer the `provia-implementer` MCP server, so I tried `org_get_context` to read your tenant instead, but permission wasn't granted in this non-interactive session. So I could not compare *your* processes, and I did not invent them.

What I delivered instead: the comparison **method**, made concrete against a clearly-labelled placeholder candidate set (IT requests, purchase requests, onboarding). The gates and flip conditions hold whatever your real inventory is; the named winner is conditional.

## What four weeks actually decides

The window is short enough to decide the choice by itself. Five gates, each disqualifying:

- **Cycle fits** — a case completes in about a week, so you get several full cycles plus a correction
- **Arrivals are enough** — a design that runs twice proves nothing and hides its exception paths
- **One named owner** — a person, not a mailbox; every pilot raises a design question in week one
- **Self-contained** — no integration that has to work first
- **Recoverable** — mistakes cost rework, not a missed deadline or a bad employment record

Impact and monetary saving are deliberately *not* tiebreakers. The highest-value process is usually the one that fails the cycle and integration gates, and picking it is the standard way a pilot runs out of calendar with nothing finished.

## Provisional recommendation

**Pilot internal IT / service requests** — the only candidate where four weeks buys several completed cases, a review, a correction and a second run. It's not the most valuable of the three, and that's the intended trade: the first workflow is how the team learns Provia; the expensive process is the second one, designed by people who've done it once.

**What overturns it:** if IT requests are run by an outsourced provider or a shared mailbox with nobody who can change the procedure, don't pilot on speed alone — a fast process nobody can change produces a stalled pilot. Pick the fastest candidate that *does* have a named owner, accepting a longer cycle and narrower scope. A second flip: fewer than ~10 cases in four weeks fails the arrivals gate.

Ten open questions are recorded as `decisions[]`, each with an owner. **D1** (actual inventory) and **D4** (named owner) block design; the rest can run alongside. Success measures are proposed, not agreed — and none has a baseline, so the current values need recording before the pilot starts or it ends with numbers nobody can interpret.

**Verified:** `build-project-map.mjs --check` passed on the manifest — 10 pending items, 0 warnings. That covers manifest shape and cross-references only. It does not validate `pilot-comparison.md`, and it says nothing about whether the pilot choice suits your organization. Country context (Angola/AOA/Africa/Luanda) is a provisional default since none was supplied; reply language taken from your English request.

---

Recommended next step: `provia-process-discovery` again — not `provia-workflow-designer`. The choice isn't made yet, and designing against a placeholder candidate set would build the wrong workflow well.

```text
Use provia-process-discovery with provia-project.json in this directory. Our real processes are: <list each one, with the event that starts it and the observable condition that ends it>. Monthly case volume: <per process>. Current elapsed time start to finish: <per process>. Named owner: <person per process, or "none">. Answers D1–D4; keep the gates and flip conditions from pilot-comparison.md. Country: <country>; reply in <language>.
```

Once a pilot is chosen with a confirmed owner, move to `provia-workflow-designer` with any procedure documents attached so they land in `sources[]` with citable section anchors.