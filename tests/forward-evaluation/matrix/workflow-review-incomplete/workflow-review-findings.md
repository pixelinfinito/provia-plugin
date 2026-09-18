# Workflow review — parallel actions vs. budget approval

## Status: incomplete input

No `workflow.yaml`, `provia-project.json` or source procedure was supplied and none exists in
the working directory (confirmed by listing it before writing this report). No design was
described in the conversation either. Without the action graph, I cannot identify which
specific actions are "parallel," which one is "budget approval," or how they are wired — so
the specific question cannot be adjudicated, only the general criterion below.

`node scripts/review-actions.mjs workflow.yaml` (the per-action editorial gate) was not run: there
is no file to point it at. Running it now would not produce a real result, so none is reported.

## What can be answered without the file: the general rule

In a Provia workflow, whether parallel actions may start before a budget-approval decision is
resolved by the **predecessor wiring**, not by their visual placement in a parallel branch:

- If the parallel actions have the approval decision (or, more precisely, its *approved*
  outcome) as a predecessor, they cannot start until that outcome is reached — this is the safe
  default for anything that commits money, contracts, or an external party.
- If the parallel actions instead only share a common predecessor *with* the approval decision
  (i.e. they branch off in parallel with it rather than after it), they will start regardless of
  whether approval is later granted or rejected. That is a legitimate design **only** when the
  procedure explicitly intends preparatory work to run concurrently with approval (e.g.
  collecting quotations, drafting a PO, confirming supplier availability) and the actions
  themselves make no commitment. It is a defect when the parallel actions do commit spend,
  signal an external party, or would need to be undone if approval is rejected.

A design that allows commitment-bearing actions to start in parallel with budget approval and
has no defined rollback/cancellation for the case where approval is rejected is a business
defect, not a file-validity issue: a structurally valid YAML can still bypass approval this way.

## Findings

| # | Finding | Type | Evidence |
|---|---|---|---|
| 1 | No workflow design, export, or SOP was supplied, so predecessor wiring, owners, and rejection paths cannot be traced for this workflow. | Missing input | Empty working directory (`ls` before writing this report); no design in conversation. |
| 2 | The business question ("can these parallel actions start before budget approval") cannot be adjudicated from currently available material; it depends on (a) whether those actions carry a commitment and (b) whether the procedure intends them to run concurrently with approval. | Policy gap, unresolved | See general rule above. |
| 3 | No cancellation/rollback behaviour for parallel actions in the case budget approval is rejected has been described, so it cannot be confirmed either way. | Policy gap, unresolved | N/A — no source. |

## Recorded as open decisions (see `provia-project.json`)

- D1: Which specific actions run in parallel with budget approval, and do any of them commit
  spend, notify an external party, or otherwise create an obligation?
- D2: If budget approval is rejected after those parallel actions have started, what happens to
  them — automatic cancellation, manual rollback, or are they allowed to complete regardless?

## What is needed to complete this review

- The workflow export or `workflow.yaml` (or a description of the action graph: actions, types,
  predecessors, `assigneeRef`s).
- The source procedure/SOP section describing budget approval and what may run alongside it.
- Confirmation of which actions are the "parallel" ones referred to in the question.

## Scope not covered

Publication readiness, destination validation, and legal/compliance conformity are not assessed
here per the shared conventions — they were not assessable even in principle without a design,
and are always left to an authorized person in Provia regardless.
