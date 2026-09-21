# Two-approval procedure — exception record and change proposal (DRAFT)

| | |
| --- | --- |
| Document status | Draft. The current approved procedure was not supplied, so its version, title and owner are unknown. |
| Scope | The procedure that requires two approvals before a case proceeds, and the one urgent case that skipped both. |
| Update owner | Process owner of the two-approval procedure (name not supplied — see D0). |
| Country / language context | No country supplied. Angola is disclosed as a provisional starting context; this note is in English because the request was. Nothing here derives a legal conclusion from that context. |
| Prepared by | `provia-process-knowledge`, 2026-09-21 |
| Related | `provia-project.json` (decisions D0–D4), `setup.md` |

## 1. What was asked, and what this document does instead

The request was to rewrite the official procedure so that skipping both approvals — the workaround used in one urgent case — becomes the normal process.

This document does not do that. It keeps the two-approval procedure as the published version, records the urgent case as an exception under review, and turns the request into a change proposal with a named decision owner. Reasons:

1. **One case is not a policy.** A workaround in a single urgent case is evidence that the procedure has no urgent path, not evidence that approvals are unnecessary. Promoting it to the rule for every case would remove the control from routine, non-urgent cases that never had a problem with it.
2. **Approval authority is not the process writer's to remove.** The two approvals were approved by someone with authority over the procedure. Only that authority (or the policy it implements) can remove or reduce them. A procedure document that says "no approvals" while the policy says "two approvals" creates a conflict that an auditor resolves against the document, not the policy.
3. **The workaround itself is unreviewed.** It is not yet established that the skip was authorised, that it was ratified afterwards, or that the outcome was acceptable. Writing it into the procedure would legitimise it before anyone has looked at it.

The plugin conventions this follows: reconcile workflow-versus-policy conflicts explicitly; do not silently promote incident workarounds to organisation-wide policy; record a case workaround that contradicts policy as an exception to review, not as a rewrite.

If the policy authority decides, after review, that the approvals should be removed or made conditional, section 5 gives the shape that change would take. That is a decision for them to make, not a conclusion of this document.

## 2. Confirmed facts (from the request only)

- The approved procedure requires two approvals. (Request.)
- One urgent case proceeded without either approval. (Request.)

Nothing else about the procedure, the case or the organisation was supplied. Everything in sections 4–6 is either a recommendation or an open question and is labelled as such.

## 3. What was NOT supplied and is needed before the procedure can be updated

| Missing item | Why it matters | Where recorded |
| --- | --- | --- |
| The approved procedure (title, version, effective date, approving authority) | Cannot cite or amend a document that was not seen; cannot tell whether the two approvals are the procedure's own rule or implement a higher policy | D0 |
| The Provia workflow version that implements it (workflow key, the two Decision action ids, their assignees) | Action descriptions must be written against real action ids and real approval authorities | D0 |
| The urgent case record (case id, who decided to skip, when, why, what happened afterwards) | The exception record in section 4 has blanks that only the case can fill | D1 |
| Whether any ratification or post-hoc approval occurred | Distinguishes "unauthorised deviation" from "emergency authorised outside the tool" | D1 |
| The organisation's definition of "urgent" (if one exists) | An urgent path needs an objective trigger, or every case becomes urgent | D2 |

## 4. Exception record — urgent case that skipped both approvals

This is the artefact the incident produces. It belongs with the case, not in the procedure.

| Field | Value |
| --- | --- |
| Case reference | Not supplied |
| Procedure and version deviated from | Not supplied (see D0) |
| Control skipped | Approval 1 and Approval 2 (both) |
| Reason given for urgency | Not supplied |
| Who decided to proceed without approval | Not supplied |
| Was the decision to skip authorised by anyone with approval authority, before or after? | Unknown (see D1) |
| Outcome of the case | Not supplied |
| Harm or exposure resulting from the missing approvals | Not assessed — needs the case record |
| Status | **Open — under review** |
| Reviewer | Policy authority for the procedure (D1 owner) |

Recommended handling, in order:

1. The two approvers review the case now, after the fact, and record either ratification or objection as a comment on the case. This closes the evidence gap for this one case regardless of what happens to the procedure.
2. The reviewer decides whether the deviation was justified (D1). A justified deviation is the input to D2; an unjustified one is a conduct matter outside this document.
3. Only then does the procedure change question (D2) get decided.

## 5. Change proposal for the procedure — for decision, not applied

If the review concludes that genuinely urgent cases need a faster path, the proportionate change is **an urgent path with defined conditions**, not the removal of approvals for all cases. Two options for the decision owner (D2):

**Option A — Keep two approvals, add an urgent path with a single pre-approval and mandatory ratification.**
An urgent case (objective trigger to be defined, D3) may proceed on one approval from a named authority, with the second approval recorded within a fixed period afterwards. If ratification is refused, the case is escalated. The procedure keeps its controls; the tool records the exception on the case rather than losing it.

**Option B — Keep two approvals, add an emergency override that is logged and reviewed.**
An urgent case may proceed with no prior approval only when a named emergency authority records the override and the reason on the case before proceeding. Both approvals are still collected afterwards, and every override is reviewed monthly by the process owner. This is closest to what happened, but with the record that was missing.

**Not recommended — Remove both approvals for every case.**
This is what was requested. It removes a control from routine cases on the strength of one urgent case, and it would need the policy authority, not the procedure editor, to withdraw the requirement. It is listed here so the decision owner sees it was considered.

Whichever option is chosen, the change is a **new workflow version** (an added Decision branch or override step), not an edit of the running one; `provia-workflow-change` plans it with attention to open cases.

## 6. Proposed action instructions (five-part briefs) — DRAFT, Option A shape

These are drafts to paste into the two approval Decision actions **once D2 is resolved and the real action ids and assignees are known**. They preserve both approvals. The `Exceptions:` part is where the urgent path lives; that clause is the only text that depends on D2/D3 and is marked accordingly. Amounts, deadlines and the urgent trigger are not invented — they are left as bracketed decisions.

### Approval 1 — `Decide on the request (first approval)`

```text
Task: Decide whether the request proceeds to the second approval, based on the justification and the information recorded on the case.
How: 1. Read the request and the justification recorded by the requester. 2. Check the request against [criteria from the approved procedure — not supplied, D0]. 3. Choose «Approve», «Reject» or «Return».
Evidence: A comment stating the reason is mandatory on «Reject» and «Return». On «Approve», confirm in the comment which criteria were checked.
Done when: The decision is recorded with the required comment and the case has moved to the second approval or back to the requester.
Exceptions: If the request is outside your authority, do not decide: comment and return it to the requester to route to the competent authority. [Pending D2/D3 — Option A urgent path: if the case meets the urgent trigger defined in the procedure, record «Approve — urgent» with the urgency reason; the case proceeds and the second approval must be recorded within the period set by the procedure.]
```

### Approval 2 — `Decide on the request (second approval)`

```text
Task: Give or refuse the second, independent approval required by the procedure.
How: 1. Read the request, the first approver's decision and comment. 2. Confirm the first approval is present and was given by a person with authority for it. 3. Check [criteria from the approved procedure — not supplied, D0]. 4. Choose «Approve», «Reject» or «Return».
Evidence: A comment stating the reason is mandatory on «Reject» and «Return». Confirming that the first approval exists and is valid is a completion criterion, not optional.
Done when: Both approvals are recorded on the case, or the case has been rejected or returned with a reason.
Exceptions: If the first approval is missing, do not approve: comment and return the case. [Pending D2/D3 — Option A urgent path: when the case carries «Approve — urgent», this action is the ratification; if you refuse ratification, choose «Reject» and the case is escalated to the process owner.]
```

Not yet possible without the source workflow: `due` (no service level supplied — do not invent), assignees (`assigneeRef` needs the real group keys), branch labels (must match the running workflow's outcome labels).

## 7. Proposed Agent Memory (stable guidance) — needs administrator review

Only the rule that is already true belongs in memory now. The urgent path does not, until D2 is resolved.

- *Proposed entry:* "The [procedure name] requires two independent approvals before a case proceeds. A case with fewer than two recorded approvals is non-compliant and must be returned, not completed. Emergency deviations are recorded on the case as exceptions and reviewed by the process owner; they do not change the procedure."
- *Not proposed:* anything describing the urgent path, until the decision owner approves one.

Memory documents are configured separately in Provia; they are not carried by YAML.

## 8. Conflicts and review needs

| # | Conflict / need | Type | Owner | Status |
| --- | --- | --- | --- | --- |
| C1 | Request to rewrite the procedure conflicts with the approved two-approval requirement | Policy conflict | Policy authority (D2) | Open — not applied |
| C2 | Urgent case deviated from the procedure with no recorded authorisation | Exception | Process owner / policy authority (D1) | Open — under review |
| C3 | Procedure has no defined urgent path or urgency trigger | Gap | Process owner (D3) | Open |
| C4 | Source procedure, workflow and case record not supplied | Evidence gap | Requester (D0) | Open |

## 9. What was and was not done

- Written: this document, `provia-project.json` (decisions D0–D4, disconnected mode), `setup.md` and `project.html` generated from the manifest.
- Run: `node scripts/build-project-map.mjs provia-project.json --check` — result reported in chat. That check validates the manifest shape and references; it does not validate this Markdown document or any procedure content.
- Not done: no procedure was rewritten; no workflow YAML was produced (no source workflow); no Provia organisation was read or changed (connector permission not granted); no memory document was created.
