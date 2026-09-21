## Design delivered — with the approver deliberately left unresolved

**Assumptions stated up front:** no country was supplied, so Angola (AOA, Africa/Luanda) is the provisional context; the reply follows the request's language (English). Both are recorded as decision D8.

### The central finding
Section 2 (department manager approves) and section 7 (*only* the finance director approves) name different, mutually exclusive approvers for what reads as the same step. Per the skill's rule for conflicting sections, I classified both as `conflict`, left the decision action **without an assignee**, and recorded the choice as **D1** for the SOP owner. I did not pick either section. Everything else in the workflow is the minimum scaffolding a runnable approval needs, and each piece is flagged as a recommendation rather than a source requirement.

### What was built
- **`decide` — Decide on the request** (Decision, no assignee): Approve → continue; Return for rework → back to `prepare` (comment required); Reject → cancel (comment required). Sources: §2, §7.
- **`prepare` — Prepare the request for approval** (Standard, `creator`): placeholder intake with fields `request_summary` and `justification`; gives the rework branch a return target. Not in the source (D2).
- **Proposed groups:** `department_managers` (flag `unnamed`, §2) and `finance_director` (flag `single_person`, §7). Neither is assigned until D1 is answered.
- **Access:** `default: creator_only`, `sensitivity: internal` — both placeholders, since the source says nothing about who opens cases (D3).
- The report also tabulates how each of D1's four possible resolutions (§7 wins / §2 wins / both in sequence / different scopes) changes the design.

### Files in the working directory
`workflow-design.md` (classification, action table, Mermaid flow, open decisions), `workflow.yaml` (skeleton, not validated), `provia-project.json`, `project.html`, `setup.md`.

### Checks actually run
- `build-project-map.mjs --check`: **0 errors, 3 warnings** — `decide` has no owner, and the two groups own no action. All three are the direct consequence of D1 being open, not defects to fix now.
- `review-actions.mjs workflow.yaml`: 2/2 actions carry all five brief parts, no implementer-note leaks; `due` missing on both because no service level was supplied (D6).
- Not run: `validate-workflow.mjs` (belongs to `provia-workflow-package`).

### Open decisions (8)
D1 approver conflict · D2 what the request is and how a case starts/ends · D3 who opens cases / owns the design · D4 how "the department manager" is identified per case · D5 delegate for the finance director (§7 says "only") · D6 service levels · D7 whether Reject/Return are allowed · D8 country and language.

**Next step:** D1 can only be answered by the SOP's owner — no skill resolves it. Once they answer, if the resolution is a single approver (§2 or §7 alone), `provia-organization-rollout` is the most useful next skill, to complete the two groups and the access matrix. If the resolution is a two-step approval or a scoped rule, re-run the designer first.

```text
Use provia-organization-rollout with provia-project.json in this directory. Decision D1 is resolved as: <state the resolution>. Complete the groups department_managers and finance_director (members, area, delegate per D5), answer D3 and D4, and propose the access matrix for workflow request-approval. Country: Angola (provisional); reply in English.
```