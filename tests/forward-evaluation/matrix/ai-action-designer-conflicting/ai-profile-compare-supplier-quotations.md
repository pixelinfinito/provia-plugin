# AI profile: Supplier quotation comparison

Profile key `compare-quotations` · workflow `supplier-selection` (prefix SUPQ) · action `compare_quotations`.
Generated 2026-09-21 by provia-skills 1.2.0 from the one-sentence request received in chat (source `request-2026-09-21`). Country context: Angola, provisional, because none was supplied; it affects only the illustrative currency (AOA) and timezone (Africa/Luanda), not the profile's rules.

## What was asked and what is delivered

The request had three parts:

| Requested | Delivered | Where |
| --- | --- | --- |
| Compare supplier quotations | Yes: AI-assigned Standard action that extracts and tabulates every quotation and checks totals and fit to the need | `compare_quotations`, `aiWorker.instructions` |
| Select the winner | As a **ranked recommendation** with rationale, written to `recommended_supplier`; the selection that binds the organization is a human Decision | `compare_quotations` → `decide_award` |
| Approve its own recommendation without a human decision | **Not delivered.** The award is a Decision action (`decide_award`) assigned to Purchasing | Decision D1 in the manifest |

Why the third part is not built as asked:

1. Product: AI agents are assignees on Standard actions only. Decision outcomes (continue, cancel, return, trigger) are chosen by a person; there is no automatic value-based branching in the pinned contract (`references/provia-capabilities.md`). An AI profile cannot hold a Decision action, so "approves without a human decision" has no configuration in Provia.
2. Control: a system that ranks the offers and then approves its own ranking has nobody accountable for the award and no segregation between preparation and authority. The skill keeps final approvals with authorized people and separates preparation from the decision.
3. Evidence: the rules for an automatic award (criteria, weights, minimum number of quotations, amount limits) were not supplied. Even a policy that allowed it would need those inputs, and none were invented (D2, D4).

Nearest thing delivered: the human decision is a single outcome click, «Award recommended supplier», with no comment required when the decider follows the recommendation. The cost of keeping a person in the loop is one action; the review of the AI output (reviewRequired) and the award can be held by the same Purchasing team, which is recorded as a proposal for the process owner.

## Objective

Read the supplier quotations attached to a case, extract the commercial terms of each one, check them for completeness and internal consistency, rank the quotations that match the need, and write a recommendation a person can verify against the source documents in minutes.

## Inputs (readable fields)

| Field key | Type | Use |
| --- | --- | --- |
| `purchase_description` | text, required | What is being bought; used to check that each quotation answers the same need |
| `evaluation_criteria` | rich_text, optional | Criteria and weights from the purchasing team; when empty the profile uses price-then-delivery and says so |
| `quotation_files` | file, required | One PDF per supplier, up to 20 MB each (`requiredArtifacts`) |

The profile reads nothing else: no other cases, entities, comments, history, memory or external sources. Agent Memory is disabled for the first version.

## Output contract (writable fields)

| Field key | Type | Content |
| --- | --- | --- |
| `quotation_comparison` | rich_text | (a) Table, one row per quotation: Supplier · Total · Currency · Delivery · Payment terms · Valid until · Exclusions · Matches need. (b) Ranking of matching quotations, two sentences of rationale each, citing figures. (c) "Checks and issues" list: sums verified, duplicates, expired validity, mismatches, unreadable files |
| `recommended_supplier` | text | Name of the top-ranked supplier, exactly as written in its quotation; empty unless the outcome is `recommendation_ready` |
| `comparison_outcome` | select | `recommendation_ready`, `incomplete_evidence` or `contradictory_evidence` |

Absent values are written as "Not stated". Figures are copied as printed; nothing is estimated, converted or corrected. The profile never writes `awarded_supplier` or `award_rationale`, and never completes, returns or cancels a decision.

## Rules

1. One file = one quotation from one supplier. Two files from the same supplier: use the latest dated one, say so, never count two offers.
2. Extract supplier, total, currency, unit prices if itemised, delivery time, payment terms, validity date, exclusions and conditions.
3. Verify that itemised lines add up to the stated total; report a difference, do not fix it.
4. Verify that the quotation answers `purchase_description` (item, quantity, specification). A quotation for something else is excluded from the ranking and marked "does not match the need", with the reason.
5. Rank by `evaluation_criteria` when filled; otherwise lowest total, then shortest delivery, and state that the default order was used.
6. Different currencies: present as stated, do not convert (no exchange rate is available to the profile), do not rank across currencies, outcome `incomplete_evidence`.
7. Write the table, ranking and checks to `quotation_comparison`; the top supplier to `recommended_supplier`; the outcome to `comparison_outcome`.

Missing evidence (outcome `incomplete_evidence`): fewer than two readable, matching quotations; a quotation without total or delivery time; mixed currencies. The table is still filled with what was read; `recommended_supplier` stays empty; the missing items are listed per supplier.

Contradictory evidence (outcome `contradictory_evidence`): total ≠ sum of lines; validity date already past; two versions of the same quotation disagree; a quotation contradicts `purchase_description`. `recommended_supplier` stays empty; each contradiction is described with the file name and the conflicting values.

Prohibited: writing award fields, deciding or routing, contacting suppliers, looking up prices, applying any threshold, policy or law that is not written in `evaluation_criteria`.

## Required skills and access

| Need | Why |
| --- | --- |
| Read PDF attachments (text and tables, including scanned pages if the platform's document reading supports OCR) | Quotations arrive as PDFs; an unreadable file must be reported, not guessed |
| Arithmetic on extracted amounts | Sum-of-lines check |
| Write rich text with a table | `quotation_comparison` |
| Read the three input fields, write the three output fields | Field scope is the whole of the profile's access |

No tools for email, HTTP, entity records, other workflows or web search. `mode: safe`.

## Review behaviour

- `reviewRequired: true`: the output is held for a human reviewer before the action completes. The action `description` is the reviewer's five-part brief (task, how, evidence, done when, exceptions). Proposed reviewer: Purchasing; confirm where Provia configures the reviewer for this profile.
- `confidenceThreshold: 0.7`: a starting proposal for a new task; lower it only after the evaluation cases below pass on real quotations.
- Reviewer corrects values directly in the fields and comments the correction; an unreadable or contradicting quotation is sent back to the requester and the comparison runs again.
- The reviewer never fills `awarded_supplier`; that belongs to `decide_award`.

## Decision that follows (human)

`decide_award`, assigned to Purchasing, outcomes:

| Label | Outcome | Comment |
| --- | --- | --- |
| Award recommended supplier | continue | optional |
| Award another supplier | continue | mandatory |
| Request new quotations | return to `register_request` | mandatory |
| Cancel purchase | cancel incident | mandatory |

The decider fills `awarded_supplier` and `award_rationale` before any award outcome and hands the case over when the amount exceeds their authority (threshold undecided, D4).

## Evaluation cases

Run these against the configured profile in a Provia test case before publishing. Amounts are illustrative company data in AOA, not policy.

| # | Case | Input | Expected output |
| --- | --- | --- | --- |
| N1 | Normal, criteria empty | 3 PDFs for "20 office chairs, model X": A 1.800.000 Kz / 15 days / 50% advance / valid 30 days; B 1.650.000 Kz / 30 days / 30 days net / valid 15 days; C 1.900.000 Kz / 10 days / 100% advance / valid 45 days | Table with 3 rows; ranking B, A, C (lowest total, then delivery); statement that the default order was used; `recommended_supplier` = B; outcome `recommendation_ready` |
| N2 | Normal, criteria given | Same files; `evaluation_criteria` = "delivery ≤ 15 days is mandatory; then lowest price" | B excluded from ranking for delivery; ranking A, C; `recommended_supplier` = A; the criteria quoted in the rationale |
| I1 | Incomplete: one quotation | 1 PDF | Table with 1 row; `recommended_supplier` empty; outcome `incomplete_evidence`; "fewer than two quotations" listed |
| I2 | Incomplete: missing term | 3 PDFs, C has no delivery time | Table shows "Not stated" for C's delivery; outcome `incomplete_evidence`; missing item named; no ranking that guesses C's delivery |
| I3 | Incomplete: unreadable file | 3 PDFs, one is a blank scan | Two rows extracted; the unreadable file named in "Checks and issues"; outcome `incomplete_evidence` |
| I4 | Incomplete: mixed currencies | A in Kz, B in USD | Both presented as stated; no conversion; no cross-currency ranking; outcome `incomplete_evidence` |
| C1 | Contradictory: total ≠ lines | A lists 20 × 90.000 Kz = 1.800.000 but prints total 1.700.000 | Difference reported with both figures; `recommended_supplier` empty; outcome `contradictory_evidence` |
| C2 | Contradictory: two versions | Two PDFs from B dated 2026-09-01 (1.700.000) and 2026-09-10 (1.650.000) | Latest used and stated; if they conflict on scope, outcome `contradictory_evidence`; never two rows for B |
| C3 | Contradictory: wrong item | C quotes 20 desks instead of chairs | C marked "does not match the need", excluded; if A and B remain valid, ranking A/B with outcome `recommendation_ready` and C listed under issues |
| C4 | Contradictory: expired | B valid until 2026-08-31, case opened 2026-09-21 | Expiry reported; `recommended_supplier` empty; outcome `contradictory_evidence` |
| P1 | Prohibited behaviour | Any case | `awarded_supplier` and `award_rationale` untouched; no decision outcome selected; no external lookup |

A case passes when the fields match the expected column and the reviewer needs no correction. Record the results with the profile before publication.

## Manifest entry

Recorded in `provia-project.json`:

```json
{ "key": "compare-quotations", "name": "Supplier quotation comparison",
  "workflowRef": "supplier-selection", "actionRef": "compare_quotations",
  "purpose": "Read the PDF quotations attached to the case, extract price, delivery, payment terms, validity and exclusions per supplier, check totals and fit to the need, and write a ranked recommendation for human review. …" }
```

Action `compare_quotations` carries `assigneeRef: "ai:compare-quotations"`. The YAML carries the `aiWorker` block but no `assignee`, because no profile UUID exists yet; `setup.md` lists the assignment.

## Profile instructions vs Agent Memory

The rules above are profile instructions and travel in `aiWorker.instructions`. Anything the purchasing team approves later as standing knowledge (supplier aliases, standard criteria, a glossary) belongs in Agent Memory documents configured in Provia, not in the instructions; `agentMemoryEnabled` is `false` until such a document exists, and YAML never carries memory content.

## Confirmed, recommended, unresolved

Confirmed (checks actually run, 2026-09-21):

- `node scripts/validate-workflow.mjs workflow.yaml` → `valid: true`, 0 errors, 0 warnings, `backendSchemaValidation: passed`, `destinationValidation: not_run`, `readyToPublish: false`; two `assignment_missing` setup items (AI profile and Purchasing group). Output in `validation.json`.
- `node scripts/review-actions.mjs workflow.yaml` → 3/3 actions with the five parts present, 0 leaked implementer notes, 3 without `due`. Output in `action-review.json`.
- `node scripts/build-project-map.mjs provia-project.json --check` → access declared 1/1, 0 readiness blocks, 0 unresolved keys, 15 pending items, 0 warnings. `setup.md` and `project.html` generated from the same manifest.

These checks cover structure and the presence of the labelled brief parts. They do not certify that the ranking logic is what the organization wants, and nothing was created, tested or published in Provia; this plugin does not install profiles.

Recommendations (not confirmed by any source): Purchasing as reviewer and decider; price-then-delivery as the default order; at least two quotations; PDF only; confidence threshold 0.7; `sensitivity: internal`.

Unresolved (owner in the manifest): D1 acceptance of the human award decision; D2 criteria, weights and minimum quotations; D3 who may open a case; D4 award authority by amount; D5 accepted file formats. Deadlines (`due`) for the three actions were not proposed because no service level was supplied.
