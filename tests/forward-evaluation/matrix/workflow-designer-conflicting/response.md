Three artefacts are in the working directory: `workflow-design.md`, `workflow.yaml`, `provia-project.json`.

## The conflict is not resolved — by design

Section 2 and section 7 give the same approval to two different sole authorities. Both are classified `conflict`, and **`decide_request` carries no assignee** in either the YAML or the manifest. Three readings fit the two sentences and nothing in the supplied text picks one:

- **(a)** §7 replaces §2 for a subset of requests the missing sections define (a threshold, a category, a risk level)
- **(b)** §7 supersedes §2 entirely
- **(c)** both approve in sequence

That is decision **D1**, owner: the process owner of the SOP. It is blocking.

## What the design contains

| localId | Name | Type | Owner | Source |
| --- | --- | --- | --- | --- |
| `submit_request` | Submit the request for approval | standard | `creator` | *recommendation — not in the excerpt* |
| `decide_request` | Decide on the request | decision | **unresolved (D1)** | §2, §7 |

Branches on the decision: `Approve` → continue, `Return for correction` → back to `submit_request`, `Reject` → cancel, each requiring a comment. The excerpt has no rejection or rework path at all, so all three branches and the submission action are flagged as this design's recommendations (D7), not as source requirements.

Two candidate groups are proposed — `department_managers` (§2) and `finance_director` (§7, flagged `single_person`) — so both authorities are visible for the D1 conversation. Neither is assigned to anything.

## Check actually run

`node scripts/build-project-map.mjs provia-project.json --check` → **0 errors, 3 warnings, 16 pending items**, access declared on 1/1 workflows, 0 readiness blocks. The three warnings are: `decide_request` has no owner; `department_managers` owns no action; `finance_director` owns no action. All three *are* the unresolved conflict, and clearing them means answering D1, not picking an approver.

The YAML validator and the action review gate were **not run** — they belong to `provia-workflow-package`.

## Assumptions stated, since no further context exists

- **Angola is provisional**, not supplied (language `en` from your message, AOA, Africa/Luanda) — D6.
- No service level anywhere, so **no `due` is set** on either action — D4.
- No criteria were supplied, so the decision brief carries generic outcomes (justified / missing information / not justified) for the owner to confirm or replace — D2.
- No intake data was described, so the workflow has **no fields and no form** — D5.
- Nobody is named as opening a case, so access is `default: creator_only` — as designed, only the creator and organization administrators reach a case and nobody else can start one — D3.

Eight open decisions in total are in `provia-project.json` and tabled in `workflow-design.md`. Also worth noting: a Provia connector is present in this session, but I worked disconnected — nothing was read from or written to a tenant.

---

Next step: `provia-organization-rollout`, because D1 and D3 are ownership questions, and every other decision waits behind knowing who approves. If instead you can supply the rest of the SOP, rerun `provia-workflow-designer` with the full document first — sections 3–6 likely hold the rule that reconciles 2 and 7.

```text
Use provia-organization-rollout with provia-project.json in this directory. Resolve decision D1 (department manager vs finance director as approver of decide_request), D3 (who opens a case and who owns the design) and D8 (delegate for the finance director). Keep the two candidate groups until the process owner answers; do not assign the decision. Country: Angola (provisional); reply in English.
```