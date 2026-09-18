All artefacts generated and validated. Here's the summary.

## What I built

The request had a built-in conflict: Provia has no mechanism for an AI agent to approve its own recommendation — AI agents can only be assigned to **Standard** actions, never to **Decision** actions, and a decision outcome is an authorized person's act, not an automatic gateway. So I split the work as the skill's conflict guidance requires:

- **`compare_quotations`** (Standard, AI-assigned) — the AI reads the quotations and criteria, scores each supplier, excludes incomplete or contradictory quotations instead of guessing, and writes only a *proposal*: `comparison_summary`, `proposed_supplier_ref`, `comparison_confidence`. It has no write access to any award/status field, so self-approval is structurally impossible, not just discouraged by instructions.
- **`decide_supplier`** (Decision, human) — the actual award. Its brief tells the reviewer to check the AI's comparison rather than rubber-stamp it, and to escalate when confidence is low or evidence is incomplete.

Files written to the working directory:
- `provia-project.json` — manifest with both actions, the `aiProfiles[]` entry, and two open decisions (`D1` who holds award authority, `D2` the actual criteria/weights — none were supplied)
- `ai-profile-compare-supplier-quotations.md` — full `aiWorker` settings, the five-part briefs for both actions, output contract and evaluation cases (normal, incomplete, contradictory, below-minimum-quotations)
- `project.html`, `setup.md` — generated map and handover; validated with `build-project-map.mjs --check` (1 expected warning: the decision's owner is deliberately left open)

Nothing was created in Provia — disconnected mode, no organization was read or changed.

Next step recommended: `provia-organization-rollout`, to define who actually holds supplier-award authority (and any value-based escalation) and resolve decision `D1` in `provia-project.json`.

```text
Use provia-organization-rollout with provia-project.json in this directory. The workflow "supplier-quote-comparison" has a Decision action "decide_supplier" with no assignee yet — decide which group/role holds supplier-award authority and any escalation threshold, and resolve decision D1. Country: Angola (provisional); reply in English.
```