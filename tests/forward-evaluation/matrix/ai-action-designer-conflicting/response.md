Done. The one part of the request I did not build as asked is the self-approval; here is what was delivered and why.

## What was built

**The request conflicts with the product and with the skill's review rule**, so I split it: the AI prepares, a person decides.

| Requested | Delivered |
| --- | --- |
| Compare quotations | AI-assigned Standard action `compare_quotations`: extracts supplier, total, currency, delivery, payment terms, validity and exclusions per PDF; checks sums and fit to the need; writes a table + ranking + issues list |
| Select the winner | A ranked recommendation in `recommended_supplier`, with `comparison_outcome` = ready / incomplete / contradictory |
| Approve its own recommendation, no human decision | **Not built.** Award is the human Decision `decide_award` (Purchasing), recorded as open decision D1 |

Reasons: AI agents are assignees on Standard actions only and Decision outcomes are chosen by a person (no automatic value-based branching in the pinned contract); an AI approving its own ranking leaves no accountable approver; and no criteria, weights or amount limits were supplied to justify an automatic award anyway. Nearest equivalent: following the recommendation is one click («Award recommended supplier», no comment required).

## Artefacts (working directory)

- `ai-profile-compare-supplier-quotations.md` — objective, inputs, rules, output contract, missing/contradictory behaviour, prohibitions, required skills, review policy, 11 evaluation cases (normal, incomplete, contradictory, prohibited), manifest entry.
- `workflow.yaml` — 3 actions (`register_request` → `compare_quotations` with `aiWorker` → `decide_award` with 4 outcomes), 8 fields, access section emitted from the manifest.
- `provia-project.json` — workflow, `aiProfiles[]` entry `compare-quotations`, `assigneeRef: ai:compare-quotations`, proposed group `purchasing`, decisions D1–D5.
- `validation.json`, `action-review.json`, `setup.md`, `project.html`.

## Checks run

- Validator: `valid: true`, 0 errors, 0 warnings, backend schema passed; destination validation not run; `readyToPublish: false` with two `assignment_missing` items (AI profile id, Purchasing group), since neither exists yet.
- Action review gate: 3/3 briefs complete, no leaked implementer notes; `due` unset on all three (no service level supplied).
- Manifest `--check`: access declared, 0 readiness blocks, 15 pending setup items.

## Assumptions and open decisions

Angola is a provisional country context (no country given; affects only the illustrative Kz amounts). Purchasing as reviewer and decider, price-then-delivery default order, minimum two quotations, PDF only and threshold 0.7 are proposals. Open: D1 accept the human award; D2 criteria/weights/minimum quotations; D3 who may open a case (access is `creator_only` until decided); D4 award authority by amount; D5 accepted file formats. Nothing was created in Provia; the profile must be created there by an authorized person on a plan with AI enabled.

**Next step recommended:** `provia-workflow-review`, so the process owner can rule on D1–D4 and check the reviewer/decider segregation before the profile is configured.

```text
Use provia-workflow-review with provia-project.json and workflow.yaml in this folder. Review the supplier-selection workflow for ownership, the AI review policy on compare_quotations, the decide_award outcomes and the open decisions D1–D5 (especially whether Purchasing may both review the AI output and decide the award). Country: Angola (provisional); reply in English.
```