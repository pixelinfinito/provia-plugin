# Workflow review — publication readiness

## What was supplied

No `workflow.yaml`, no policy document, and no `provia-project.json` were found in the working
directory or attached to the request. The review below is based only on the prose description
given: "request and ordering run in parallel," the file "passes file checks," and a supplied
policy that "the manager must approve before ordering." No YAML was read, so `node
scripts/review-actions.mjs workflow.yaml` was **not run** — there is no file to run it against —
and no action names, IDs, groups or descriptions could be checked. This report cannot certify
the five-part action briefs, `due` settings, form mappings or entity references; those need the
actual export.

**Assumption stated and carried forward:** the process has at least three elements — a request
step, a manager-approval decision, and an ordering step — and the current design places "request"
and "ordering" as parallel branches with no dependency between the approval decision and
ordering. If the real design differs (for example, if "ordering" only *prepares* an order without
committing it), the finding below still applies to whatever step actually places the order,
sends it to a supplier, or triggers an external system.

## Core finding: structural validity ≠ policy compliance

"Passes file checks" means the YAML is structurally well-formed (required fields present, no
schema violations). It says nothing about whether the process implements the supplied policy.
These are two different questions, and the second one fails here:

- **Policy:** the manager must approve *before* ordering.
- **Design:** request and ordering run in parallel — i.e., ordering can start (or complete)
  without waiting on the manager's decision, since parallel branches by definition have no
  predecessor relationship between them.

This is a **business-policy defect, not a file-validity defect**. A structurally valid workflow
can still let an incident reach "ordering" while approval is pending, rejected, or never
requested. Per product capability, "sequential execution enforces predecessors; parallel work is
appropriate only for independent tasks" — ordering is not independent of the approval decision
under the supplied policy, so parallel placement is also a design misuse of that primitive, not
just a missing business rule.

## Required correction (design question, not a wording fix)

Ordering needs a `predecessor` (or equivalent sequencing) on the manager-approval decision's
"approve" outcome, and must not be reachable from the "reject" outcome. Whether that means:

- moving ordering out of the parallel group entirely, or
- keeping request and some other independent branch in parallel while gating only ordering on
  the decision,

is a design decision the workflow author must make from the actual SOP, not an editorial
correction this review can apply silently. Recorded as an open decision below.

## What this review could not adjudicate

- Whether "request" and "ordering" are the literal action names/IDs in the real file, or a
  paraphrase.
- Whether a rejection or return path exists at all, and what it does to an order already placed
  in parallel.
- Owner/group assignment for the approval decision, and whether that owner matches "manager" in
  the supplied policy (title vs. `assigneeRef` mismatch is common).
- Evidence, `due`, form mappings, and entity references on any of the three steps — no action
  briefs were available to check the five parts (task, method, evidence, done-when, exceptions)
  or scan for leaked implementer notes.
- Any compliance, legal or audit claim. This report only compares a described design against a
  supplied policy statement; it does not establish organizational or legal compliance, and
  publication readiness is decided in Provia by an authorized person.

## Representative test scenarios (for whoever owns the actual file)

| Scenario | Expected visible result |
| --- | --- |
| Normal: manager approves before the ordering branch would otherwise start | Ordering proceeds only after approval is recorded; no observable difference from today if approval is always fast — this is exactly why the gap is easy to miss in happy-path testing. |
| Rejected: manager rejects | Ordering must not start or must be cancelled if already running; today's parallel design gives no mechanism to stop it. |
| Incomplete: request submitted, approval decision not yet made | Ordering should be blocked pending the decision; today it is not blocked. |
| Failed integration: ordering triggers an external call (ERP/supplier) before the decision resolves | An order may be sent to a supplier that is later rejected internally — a real-world action with no compensating step defined. |

## Decision recorded

Added to `provia-project.json` as `D1` (open, no owner named in the request) — see next section.

## Next step

`provia-workflow-designer` (if the design is still a draft) or `provia-workflow-package` (if this
export is already meant to be authoritative and only needs the predecessor added and
re-validated) should apply the sequencing fix and hand back an updated file for a repeat
structural + policy check. Publication should wait until that fix is verified.
