# Self-service IT request — form specification

Skill: `provia-form-designer` (provia-skills 1.2.0) · Date: 2026-09-21 · Mode: disconnected · Manifest: `provia-project.json` (created by this task)

## 1. What was and was not available

| Item | Status |
| --- | --- |
| Request text ("design a self-service IT request form with a clear confirmation") | Supplied — the only source (`sources[].id = chat-request-2026-09-21`) |
| IT support procedure, SLA, request categories, team names | **Not supplied** |
| Existing Provia workflow the form should feed | **None** in the working directory; no manifest existed |
| Tenant read (`org_get_context`, `forms_list`, `groups_list`) | **Not granted** in this session — nothing was read from a Provia organization |
| Country, language, timezone, currency | **Not stated** — Angola is disclosed as the provisional starting context (`country-context.md`); response language follows the request (English), labels are given in English with a pt-AO column |

Everything under "Recommendation" or "Assumption" below is the designer's proposal, not a confirmed fact about the organization. Nothing was created, linked, previewed or tested in Provia.

## 2. Design decision: intake form, not Form Fill

**Confirmed from the request:** the form is self-service and starts a request. Submission must therefore **create an incident** (a Provia "case"), so this is an **intake (trigger) form** on the workflow, not a Form Fill inside an existing case (`provia-capabilities.md`: "Form intake creates an incident through a separately configured form").

Because no workflow existed, the manifest carries a **placeholder workflow** `it-request` ("IT request", prefix `ITR`) with the minimum actions the form's answers serve. It exists so the form has a `workflowRef` and the answers have a destination; it is **not** a finished workflow design (see §9, next step).

A second, optional form — a Form Fill that lets the requester **confirm the resolution** at the end of the case — is specified in §7 because the request asked for clear confirmation and a closing confirmation from the requester is the cheapest evidence that the request was actually solved. It can be dropped without affecting the intake form.

## 3. Respondents and access

| Question | Design | Status |
| --- | --- | --- |
| Who submits? | Any employee of the organization, for themselves (self-service) | **Assumption** — the request says "self-service"; no source names exceptions (contractors, shared mailboxes) |
| How do they reach the form? | Signed-in employees, from the workflow's Start / form entry in Provia | **Assumption** — the alternative (a public/external link) changes the field list (§4, requester block) and the access grant |
| Does the requester see their own case afterwards? | Yes without any grant: creators see cases that carry them (`workflow-access.md`) | Confirmed product behaviour |
| Workflow access grant | `organization` → `create_incident` on `it-request` (any employee opens a request); IT Support gets **no** `view` grant by default — assignees see the cases that carry their actions | Recommendation, recorded in `workflows[].access` with reason; the "IT sees every case as a queue" question is `D2` |
| Anonymous submission | **Not offered.** Not promised until the configured form behaviour is checked in the destination | Pending (`D1`) |

Access testing is **pending** (`D1`): the intended access path cannot be confirmed without the tenant.

## 4. Fields

Field keys are the incident metadata keys the answers map to. Types come from the 19 supported metadata types; the form schema excludes `auto_number` and does not preserve dependent-option bindings (`metadata-fields.md`), so the category list is a single flat `select` rather than a category → sub-type pair.

| # | Key | Label (en) | Label (pt-AO) | Type | Required | Validation / options | Help text shown to the requester | Maps to |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `request_type` | What do you need? | O que precisa? | `select` | yes | Options (value → label): `access` → Access to a system or folder · `hardware` → Equipment (laptop, monitor, phone, peripherals) · `software` → Software installation or licence · `incident` → Something is not working · `other` → Other | Choose the closest option. IT will reclassify it if needed. | `request_type` |
| 2 | `summary` | Short title | Título curto | `text` | yes | 5–120 characters | One line IT can read in a list, e.g. "VPN fails on Windows laptop". | `summary` |
| 3 | `details` | Describe the request | Descreva o pedido | `rich_text` | yes | Minimum 20 characters | What you are trying to do, what happens instead, and any error message. For access requests, name the system and the access level. | `details` |
| 4 | `urgency` | How urgent is this? | Qual é a urgência? | `select` | yes | `low` → I can wait a few days · `normal` → It slows my work · `high` → I cannot work until it is solved | This is your view of the impact. IT sets the final priority during triage. | `urgency` |
| 5 | `affected_asset` | Asset tag or device | Etiqueta do equipamento | `text` | no | Max 40 characters | The sticker on the device, if it has one. | `affected_asset` |
| 6 | `department` | Your department | O seu departamento | `text` | no | Max 80 characters | — | `department` |
| 7 | `needed_by` | Needed by | Necessário até | `date` | no | Not before today | Only if there is a real date (a start date, a trip, a deadline). Leaving it empty does not slow the request. | `needed_by` |
| 8 | `attachment` | Screenshot or document | Captura de ecrã ou documento | `file` | no | See §5 | A screenshot of the error, or the approval email for an access request. | `attachment` |
| 9 | `contact_phone` | Phone for IT to reach you | Telefone de contacto | `phone` | no | Phone format | Only if IT should call rather than write. | `contact_phone` |

Field notes:

- **Requester identity is not a field.** For signed-in employees, Provia records the creator; IT reads name and email from the case. If `D1` resolves to an external/public link, add `requester_name` (`text`, required) and `requester_email` (`email`, required) and revisit the `organization` grant.
- **`department` is free text on purpose**: no department list was supplied. Replace with a `select` once the list exists (`D3`); a free-text value cannot be filtered reliably in reports.
- **`urgency` is the requester's view; `priority` belongs to IT** and is set in the triage action, not in the form. Keeping them apart avoids every request arriving as "high".
- **No SLA or response-time field**: nothing was supplied to promise one (`D4`).
- Each field maps to the incident metadata key of the same name. The placeholder workflow declares these keys; the mapping must be verified in the form configuration in Provia after the workflow draft exists.

## 5. Uploads

| Setting | Design | Status |
| --- | --- | --- |
| Field | `attachment`, single file, optional | Recommendation |
| Accepted types | PNG, JPG, PDF (screenshots and forwarded approvals); DOCX only if IT asks for it | Recommendation |
| Why it is asked | A screenshot shortens diagnosis of "something is not working"; an approval email/PDF is the evidence an access request needs before IT grants anything | Reason stated per document, as the procedure requires |
| Size limit | **Not invented.** The product limit lives in `backend/src/lib/file-constants.ts` of the pinned revision; the exact number was not read in this session. The form text should say "Large files: describe the problem and IT will ask for the file in the case" rather than quote a number | Pending — verify the limit in the destination before writing it into the help text |
| Sensitive content | Ask requesters not to paste passwords into the description or upload documents with credentials; IT never needs a password to act | Recommendation |

## 6. Confirmation shown after submission

The confirmation states what was recorded and what happens next, without promising a deadline that no source supports.

Text (en):

> **Your IT request was received.**
> IT Support will review it and assign it to a technician. You will be notified in Provia when the request is assigned, when IT needs more information from you, and when it is resolved.
> You can follow it at any time under **My cases**, where you can add comments or files.
> If you cannot work at all, contact IT directly as well — the request is still needed so the work is tracked.

Text (pt-AO):

> **O seu pedido de TI foi recebido.**
> O Suporte de TI vai analisá-lo e atribuí-lo a um técnico. Será notificado no Provia quando o pedido for atribuído, quando as TI precisarem de mais informação e quando for resolvido.
> Pode acompanhá-lo em **Os meus casos**, onde pode acrescentar comentários ou ficheiros.
> Se não conseguir trabalhar de todo, contacte as TI directamente — o pedido continua a ser necessário para que o trabalho fique registado.

Rules applied and what is still open:

- No response time, SLA or working-hours promise appears, because none was supplied (`D4`). Add one only after the process owner confirms it and the workflow's `due` settings carry it.
- The case reference (Provia's native reference, e.g. `ITR-…`) is useful in the confirmation, but **whether the configured confirmation screen can display it, show custom text, or redirect was not verified**. Treat the text above as the content; where it is shown (confirmation screen, notification, both) is confirmed during setup (`D5`).
- "IT Support" is the placeholder group name; replace with the real team name once known (`D2`).
- The last line (contact IT directly) needs the real channel — phone, chat, walk-in — which was not supplied; leave it out rather than invent one.

## 7. Optional closing confirmation (Form Fill)

Purpose: at the end of the case the requester confirms the request was actually solved. One response per case; the response maps values and completes the action.

| Item | Specification |
| --- | --- |
| Form title | Resolution confirmation (`Confirmação da resolução`) |
| Workflow / action | `it-request` / `confirm-resolution` (type `form_fill`, assignee `creator`) |
| Action name | **Confirm the resolution** |
| Response policy | Single response; maps `resolution_accepted` and `resolution_feedback`; completing the response completes the action |
| Fields | `resolution_accepted` — "Is your request solved?" (`boolean`, required) · `resolution_feedback` — "Anything IT should know?" (`text`, optional, max 500) |
| Action description (five-part brief) | **Task:** Confirm whether the IT request was solved. **How:** 1. Open the case and read the resolution comment left by IT Support. 2. Check that you can now do what you asked for. 3. Answer the "Resolution confirmation" form. **Evidence:** The submitted "Resolution confirmation" response with `resolution_accepted` filled. **Done when:** The response is submitted. **Exceptions:** If the request is not solved, answer "No" and describe what still fails in `resolution_feedback`; IT Support reopens the work from your answer. |

What is not designed here: what the workflow does with `resolution_accepted = false` (a return to `resolve` needs a Decision action or IT judgement) — that belongs to the workflow design (`D6`). The `due` for this action is unset: no source gives a deadline.

## 8. Testing steps (to run in the destination; none were run)

1. Open the form as a member of the intended starter population (not as the implementer/Owner). Confirm the form is reachable the way `D1` decided and not by any other path.
2. Submit with only the required fields (1–4). Confirm a case is created on `it-request` and that `request_type`, `summary`, `details`, `urgency` show the submitted values in the case metadata.
3. Submit with every field, including a PNG under the destination's size limit. Confirm `attachment` appears as a file on the case and `needed_by` rejects a past date.
4. After each submission, confirm the confirmation text in §6 is shown and that no deadline or reference is promised that the case does not show.
5. Confirm the first action (`triage`) is assigned to the IT Support group and the requester sees the case under My cases without any extra grant.
6. Record in `setup.md` who tested, when, and the case references used.

## 9. Recorded in the manifest

- `forms[]`: `it-request-intake` (kind `trigger`, `workflowRef: it-request`) and `resolution-confirmation` (kind `action`, `actionRef: confirm-resolution`); `formRef` set on the `confirm-resolution` action.
- `workflows[]`: placeholder `it-request` with actions `triage`, `resolve`, `confirm-resolution`, `access` (organization → `create_incident`, sensitivity `internal`) and a manual trigger. Status `design`; no YAML file was produced by this task.
- `groups[]`: proposed `it-support` ("IT Support"), no members, flagged `unnamed`.
- `decisions[]`: D1–D7 (§10).

## 10. Open decisions (owners are functional roles until named)

| Id | Question | Owner |
| --- | --- | --- |
| D1 | Access model: signed-in employees only, or an external link? Anonymous submission is not offered until the configured form behaviour is checked. | IT process owner |
| D2 | Which team handles requests, its real name and members; does it need to see every IT case (a `view` grant) or only its assigned ones? | IT manager |
| D3 | Department list (to turn `department` into a select) and the final `request_type` options. | IT manager / HR |
| D4 | Response and resolution targets, if any, to state in the confirmation and set as `due` on the actions. | IT process owner |
| D5 | Confirmation screen capabilities in the destination (custom text, case reference, redirect). | Implementer, in Provia |
| D6 | Route when the requester answers "not solved": return to `resolve`, or IT decides. | IT process owner |
| D7 | Country, language, timezone and currency of the organization (Angola / pt-AO are provisional). | Customer sponsor |

## References used

`skills/provia-form-designer/SKILL.md`, `references/skill-conventions.md`, `references/metadata-fields.md`, `references/action-writing.md`, `references/project-manifest.md`, `references/workflow-access.md`, `references/provia-capabilities.md`, `references/country-context.md`, `references/connected-mode.md`.
