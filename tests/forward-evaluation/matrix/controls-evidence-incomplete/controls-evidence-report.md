# Controls and evidence review — approved policy vs. workflow actions and three incidents

Prepared 2026-09-21 with `provia-skills` 1.2.0 (`provia-controls-evidence`), disconnected mode.
Country: not supplied — **Angola is used as a provisional context only** (language, currency and timezone assumptions; no legal conclusion is drawn from it). Response language: English, matching the request.

## 1. What was supplied and what was not

| Input the skill needs | Status | Where it was looked for |
| --- | --- | --- |
| Approved policy (text, version, approval date, effective date) | **Not supplied** | Working directory (empty) |
| Verified legal sources, jurisdiction, effective dates | **Not supplied** | Working directory; no country stated in the request |
| Workflow design or `provia-project.json` (actions by `localId`, assignees, evidence) | **Not supplied** | Working directory; Provia connector call `org_get_context` was not permitted in this session |
| Incident records for three incidents (exports, action history, attachments, comments) | **Not supplied** | Working directory |

Consequence: the mapping requested ("policy → workflow actions → evidence from three incidents") cannot be performed on facts. Nothing below is a finding about the organization's controls. It is a record of the review's boundary, the matrix the next run fills, and the decisions that unblock it.

## 2. Requirement source separation

Procedure step 1 requires separating legislation, company policy and recommendation before mapping. With no source in hand:

| Source class | Established? | Note |
| --- | --- | --- |
| Legislation | No | No jurisdiction stated; no instrument supplied. Per the skill, when legal sources or dates are missing the review is limited to the supplied organizational policy — which is also absent. No legal provision is cited or assumed. |
| Company policy | No | The request calls it "approved", but the document, its version and its approval/effective dates were not provided. The word "approved" is taken as the requester's statement, not verified. |
| Recommendation | No | Nothing to derive one from. |

## 3. Requirement / action / evidence matrix

The matrix is delivered empty in the shape the next run populates. One row per policy requirement; the three evidence columns are per incident.

| # | Requirement (quoted from policy, section) | Class (law / policy / recommendation) | Responsible action (`localId`) | Decision outcome, if any | Required data / document | Designed evidence of execution | Evidence — incident 1 | Evidence — incident 2 | Evidence — incident 3 | Finding |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | *no policy supplied* | — | *no workflow supplied* | — | — | — | *no records supplied* | *no records supplied* | *no records supplied* | See F1–F3 |

Rules the populated matrix will follow (procedure step 3): a designed control (the action exists, has an owner and names its evidence) is recorded separately from proof it operated in a given incident (a completed action with the named attachment, comment or field value in that incident's history). A missing attachment in an incident is recorded as "evidence not found in the supplied export", not as "the activity did not happen".

## 4. Findings

Confirmed facts only; nothing was inferred about the process.

- **F1 — No requirement source.** Neither a policy text nor a legal instrument was supplied. No requirement can be quoted, so no row can be opened. Owner: requester. Remediation: supply the approved policy (file, version, who approved it, approval date, effective date, and the sections that impose controls). If any requirement is legal, state the country and the instrument so the jurisdiction and status can be recorded; if no verification source is available the review will proceed on the policy alone and mark legal validity unverified.
- **F2 — No workflow to map against.** There is no `provia-project.json`, `workflow.yaml` or exported YAML, and the connector read was not permitted. No `localId`, assignee or designed evidence exists to cite. Owner: requester (or the implementer who holds the design). Remediation: place the manifest and workflow file in the working directory, or run this again in a session where the Provia connector is authorized so the live workflow can be exported with `workflow_export_yaml`.
- **F3 — No incident evidence.** The three incidents were named in the request but no export, action history, comments or attachments were supplied. Owner: requester. Remediation: supply, per incident, the case export (ids, created/closed dates, actions with status, assignee, completion timestamps), comments, attachment lists and any decision outcomes. Redact personal data not needed for the control check.
- **F4 — Country and language unconfirmed.** Angola is provisional. If the organization operates elsewhere, the legal-source step changes. Owner: requester. Remediation: confirm country of operation and response language.

## 5. Recommendations (not findings)

- Keep evidence expectations inside each action's brief ("evidence" line: which file, field or comment proves completion) so that the incident export alone answers most rows of the matrix.
- When supplying incident records, include the workflow version each incident ran on; a control added after an incident opened is a design fact, not a gap in that incident.
- Do not treat an audit trail alone as satisfying every policy requirement; requirements that demand a document or a named approver need that document or approver visible in the case.

## 6. Unresolved decisions (recorded in `provia-project.json`)

| Id | Question | Owner | Status |
| --- | --- | --- | --- |
| D1 | Which document is the approved policy, and what are its version, approval date and effective date? | Requester | open |
| D2 | Which country/jurisdiction applies, and are any requirements statutory (instrument, article, status)? | Requester | open |
| D3 | Which workflow design (manifest + YAML, or live workflow id) is the target of the mapping? | Requester / implementer | open |
| D4 | Which three incidents, and what records (export, history, attachments, comments) will be supplied for each? | Requester | open |
| D5 | Confirm country of operation and response language (Angola / English used provisionally). | Requester | open |

## 7. What was and was not done

- Read: skill conventions, country context, Angola reference, connected-mode reference, capability baseline, manifest reference and schema.
- Attempted: Provia `org_get_context` — permission not granted; no tenant data was read.
- Written: this report, `provia-project.json` (new manifest carrying the placeholders and decisions D1–D5), `setup.md` and `project.html` generated by `scripts/build-project-map.mjs` (the check covers the manifest only; it does not validate this Markdown).
- Not done: no requirement mapped, no evidence examined, no compliance statement made, no platform action taken. This review certifies nothing.
