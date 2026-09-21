# Runbook — DRAFT (approved procedure not supplied)

| | |
| --- | --- |
| Status | **Draft.** The approved procedure and its Provia workflow version were not supplied, so this file is a structure with placeholders, not a runbook anyone can execute. |
| Source | `approved-procedure` (referenced in the request; document, version and effective date unknown — decision D1) |
| Workflow version | Unknown (decision D2) |
| Scope | To be taken from the procedure's own scope statement |
| Update owner | Not supplied (decision D4) |
| Manifest | `provia-project.json`, project `unnamed-procedure` |
| Country / language | Angola / English, provisional (decision D5) |

Everything marked `[FROM PROCEDURE]` must be filled from the approved document. Nothing in those slots has been invented. The parts that are filled describe how Provia behaves, taken from the plugin's product references, and apply to any workflow.

## 1. Purpose and trigger

- **What this process delivers:** `[FROM PROCEDURE]`
- **Who may start a case:** `[FROM PROCEDURE]` — in Provia this is the workflow's access grant (`create_incident`) and, if used, the manual-trigger allowlist.
- **What is needed before starting:** `[FROM PROCEDURE]` — intake form fields or case metadata.

## 2. Roles

| Role in the procedure | Provia group (`assigneeRef`) | Authority |
| --- | --- | --- |
| `[FROM PROCEDURE]` | `[FROM WORKFLOW]` | `[FROM PROCEDURE]` — approval limits are never inferred |

Keep the real approval authority here. If the procedure names one person who prepares and another who decides, they stay separate roles and separate actions.

## 3. Steps

One block per Provia action, in execution order. Each block is the five-part brief that goes into the action's `description` (under 5000 characters, second person, no implementer notes). The action name starts with a verb naming the work.

### 3.n `[Verb + object — FROM WORKFLOW]`

```text
Task: [FROM PROCEDURE — one sentence: what to produce or decide]
How: 1. [FROM PROCEDURE — concrete system, document or person] 2. …
Evidence: [FROM PROCEDURE — file, field or comment to complete before closing; if the procedure names none, propose one and mark it as a recommendation]
Done when: [FROM PROCEDURE — the observable condition]
Exceptions: [FROM PROCEDURE — what to do when it cannot be completed as described, including which decision outcome to choose]
```

- Assignee: `[FROM WORKFLOW]` · Due: `[FROM PROCEDURE service level, or unset]` (Provia workday offsets skip Saturday and Sunday only; public holidays are not skipped)
- Decision actions: list each outcome label and what it means in `How`/`Exceptions`; the labels stay short.

## 4. Exceptions and returns

| Situation | Who acts | Outcome / route |
| --- | --- | --- |
| `[FROM PROCEDURE]` | `[FROM PROCEDURE]` | `[FROM WORKFLOW branches]` |

Case-specific workarounds seen during a pilot are recorded here as **exceptions to review**, not as new rules, until the process owner approves them.

## 5. Evidence and records

- Where each piece of evidence lives in Provia: case file, metadata field, comment, page or linked entity record — `[FROM WORKFLOW]`.
- Retention and archiving: `[FROM POLICY]` — no period is assumed.

## 6. Escalation

- Overdue or blocked case: `[FROM PROCEDURE]` — who is told, by which action or notification.
- Authority exceeded: the assignee does not decide; comments and returns the case to the requester or routes to the competent authority as the procedure states.

## 7. Maintenance

- **Update owner:** `[decision D4]`
- **Review trigger:** a new published workflow version, a policy change, or an incident lesson accepted by the process owner.
- **Rule:** the published workflow version is the reference. Proposed changes are listed in section 8 until published; they are not written into sections 1–6.
- Runbook pages and Agent Memory documents are configured in Provia separately after YAML import; the YAML does not carry them.

## 8. Proposed changes (not yet in the published version)

None recorded — no source to compare against.

## 9. What was not verified

- No procedure text was read; no action briefs, roles, thresholds, deadlines or evidence rules were written.
- No Provia workflow was read (connector access was not granted in this session).
- No script validates a Markdown runbook; `build-project-map.mjs --check` covered only `provia-project.json`.
