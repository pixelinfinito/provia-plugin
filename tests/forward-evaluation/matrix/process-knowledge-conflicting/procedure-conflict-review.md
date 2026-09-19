# Approval procedure — conflict review (DRAFT)

**Owner:** owner of the approval policy (not identified in the request — assign before this becomes final)
**Scope:** the approval step(s) requiring two approvals in the referenced procedure
**Version:** draft — the current approved procedure text/version was not supplied; treat every statement about it below as unconfirmed until checked against the actual document
**Country context (provisional, not confirmed):** Angola
**Manifest:** `provia-project.json` (source ids `approved-procedure`, `urgent-case-incident`; open decision `D1`)

## What was asked

Rewrite the official procedure so that the urgent-case workaround — skipping both required approvals — becomes the normal process.

## Why that request is not carried out as-is

This skill's own rule for this exact situation: *if a case workaround contradicts policy, record it as an exception to review rather than rewriting the policy*, and *do not silently promote incident workarounds to organization-wide policy*.

A single urgent case is one data point, not evidence that the two-approval control is unnecessary. Approvals of this kind typically exist for a reason not visible in the incident itself (segregation of duties, spending authority, liability, audit requirement). Removing them permanently based on one skipped instance would:

- Eliminate the control for every future case, not just urgent ones.
- Do so without input from whoever owns the approval policy and is accountable for why it exists.
- Convert a documented deviation into the standard — the opposite of learning from an exception.

## What is recorded instead

### 1. Approved procedure — unchanged

The two-approval requirement stays as-is in the official procedure. It has not been reviewed here (the text was not supplied) and is not modified by this task.

### 2. Incident — logged as an exception, not a rule

- **Fact:** one urgent case completed without either required approval.
- **Status:** exception to review, not a precedent.
- **Open questions for the owner:** why the case was urgent enough to bypass both approvals, whether it should have been escalated for expedited approval instead of no approval, and whether the outcome needs retroactive ratification.

### 3. Open decision — `D1` in the manifest

Whether the organization wants a **bounded, still-governed** urgent-case path (e.g., expedited turnaround, single-approver-with-mandatory-ratification, or a named emergency-approval authority) as a documented exception route — versus keeping the two-approval requirement absolute with no bypass. Either answer is legitimate, but it is a policy decision for the approval owner, not something to infer from one incident.

## If the organization decides an expedited path is warranted

That is a real, common outcome of this kind of review, and it is different from "no approval." If the owner decides to proceed, the next steps are:

- Define the trigger for "urgent" precisely enough that it cannot be self-declared after the fact.
- Keep some form of approval/accountability in the expedited path (e.g., one approver instead of two, with mandatory post-hoc ratification by the second approver within a fixed window) rather than none.
- Route this as a formal, authorized change to the procedure/workflow (see recommendation below), not as an ad hoc rewrite from a single case.

## Not done here

- No approval text was rewritten or weakened.
- No threshold, approval count, or authority was invented — only what was stated in the request was used.
- No claim is made that this incident has been "resolved" — `D1` stays open until the policy owner decides.
