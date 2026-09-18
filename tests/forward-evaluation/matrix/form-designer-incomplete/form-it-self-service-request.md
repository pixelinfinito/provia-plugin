# Self-Service IT Request — form specification

Manifest: `provia-project.json` (`project.key`: `it-self-service`). Form key `it-request-intake`, bound to placeholder workflow key `it-request`. Country context: Angola, disclosed as a provisional default (none was supplied); language: English (the language of the request). No source procedure, workflow, entity catalogue or group list was supplied for this task — every field, option list and piece of confirmation copy below is a recommendation drawn from generic self-service IT-request practice, not a fact taken from a customer document. Treat it as a draft for review, not an approved design.

## 1. What is missing, and what this document assumes

Four things a complete design normally needs were not available:

| Missing | Effect | Tracked as |
| --- | --- | --- |
| A workflow (`workflow.yaml` / manifest `workflows[]`) | There are no classification, diagnosis, resolution or confirmation actions to bind this form to, and no owning group. A placeholder `workflows[]` entry (`it-request`, `status: design`, no actions) was added only so the form has a valid `workflowRef`. | `D2` |
| An entity/field catalogue | No confirmed case field names exist yet, so field mappings below are proposed, not configured. | `D2` |
| A group/organization list | No owning support team is named; the form does not need one (see §2), but the eventual workflow will. | `D2` |
| A source SOP for IT requests | Category options, urgency wording and confirmation copy are drafted from common ITSM practice, not the customer's actual process. | `D4` |

Two further points are genuinely open, not assumable, and are recorded as decisions rather than guessed:

- **D1 — respondent access model.** Whether requesters reach this form as authenticated internal employees (so name/email can autofill) or via an unauthenticated/external link (e.g. for contractors) changes both the access configuration and whether `requester_name`/`requester_email` must stay editable. This form is designed to work either way, but access itself must be configured and tested in Provia before publishing — do not promise an anonymous external link, or a login-gated one, until that is confirmed.
- **D3 — attachment limits.** Accepted file types, maximum size and retention for the optional attachment are Provia form-builder settings not established here.

This is an intake **Form**, not a Form Fill: submitting it creates a new case, so `forms[].kind` is `trigger` and `actionRef` is null.

## 2. Respondents and access

- **Intended respondents:** any employee (and, pending D1, possibly contractors) who needs IT help and does not already have a way to reach the support team directly.
- **Access path:** not yet configured. Recommended default — an internal form reachable from the intranet/portal while signed in, so `requester_name` and `requester_email` can be pre-filled from the authenticated identity — but this is a recommendation, not a confirmed configuration; mark access testing as pending until D1 is resolved and the link/embed is verified in Provia.
- **Anonymous or public access is not promised.** If D1 is resolved in favour of an external link, re-check whether `requester_email` should become the primary way to send updates back, since there is then no account to notify.

## 3. Fields

| Key | Label | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| `requester_name` | Your full name | `text` | Yes | Auto-fill from the signed-in identity if the resolved access model supports it (D1); otherwise the requester types it. |
| `requester_email` | Your work email | `email` | Yes | Used to send updates about the request. |
| `department` | Department / team | `text` | No | Free text — no department list is invented, since no organization structure was supplied. |
| `contact_phone` | Phone (optional) | `phone` | No | Only needed if the requester prefers a call. |
| `request_type` | What do you need help with? | `select` | Yes | Options: Hardware & equipment, Software & applications, Account & access, Network & connectivity, Other. Kept as one flat list rather than a category/sub-type dependent pair — form option definitions do not preserve dependent-option bindings (see §5). |
| `urgency` | How urgent is this? | `select` | Yes | Options: Low – no immediate impact on my work; Medium – limited impact, I have a workaround; High – I cannot work until this is resolved. Describes impact only; no response-time commitment is attached. |
| `summary` | Short summary | `text` | Yes | One line, e.g. "Laptop won't turn on". |
| `description` | Details | `rich_text` | Yes | What happened or is needed, when it started, error messages, steps to reproduce. |
| `affected_system` | Affected device, application or system | `text` | No | Asset tag, application name or hostname, if known. |
| `attachment` | Attach a screenshot or file | `file` | No | Type/size limits pending D3. |
| `preferred_contact_method` | Preferred contact method | `select` | No | Options: Email, Phone, Either. |
| `needed_by` | Needed by (optional) | `date` | No | Informational only; explicitly not a service-level commitment. |
| `acknowledgement` | "I understand this request will be logged and I may be contacted for more information." | `boolean` | Yes | Sets expectations before submission. |

Thirteen fields, all from the 19 supported metadata types (`text`, `email`, `phone`, `select`, `rich_text`, `file`, `date`, `boolean`). No `auto_number` field is requested on the form: the case reference is server-generated once a workflow is configured, is read-only, and cannot be filled by a form answer.

## 4. Validation

- Required fields: `requester_name`, `requester_email`, `request_type`, `urgency`, `summary`, `description`, `acknowledgement`.
- `requester_email` uses the platform's built-in email format check.
- `select` fields use the option lists above verbatim; no dependent (parent/child) behaviour is configured on the form (§5).
- No numeric bounds, character limits or custom regex are specified beyond the platform defaults, since none were requested and inventing them would misstate a confirmed constraint.

## 5. Why there is no category → sub-type dependent select

A two-level "category, then sub-type" picker (e.g. Hardware → New equipment / Repair / Replacement) is common in ITSM intake forms and was considered. It is not used here because, per the metadata field rules for this Provia revision, **form option definitions do not preserve dependent-option bindings** — that behaviour exists for entity/workflow metadata fields, not form fields. Promising it on this form would misstate what the product supports. `request_type` is therefore a single flat list; if finer classification is needed, add it as a second, independent (non-dependent) select once the real category/sub-type list is confirmed, or let the classification action in the eventual workflow refine it after submission.

## 6. File upload

- One optional field, `attachment` (`file`), for a screenshot or supporting document.
- Accepted types, maximum size and any retention/scanning policy are Provia form-builder settings — see decision `D3`. Do not publish with an assumed limit (e.g. "10 MB") until that setting is confirmed in the target environment.

## 7. Proposed mappings (pending workflow design)

Because no workflow exists yet, there are no confirmed case fields to map into. The table below records the *intended* single-response mapping so the eventual workflow designer does not have to re-derive it; it is a recommendation, not a configured mapping.

| Form field | Proposed case field | Notes |
| --- | --- | --- |
| `summary` | case title / `request_summary` | Short label shown in lists. |
| `description` | `description` | Full narrative. |
| `request_type` | `category` | Same option values as this form. |
| `urgency` | `urgency` | Same option values as this form. |
| `affected_system` | `affected_system` | Optional. |
| `requester_name`, `requester_email`, `department`, `contact_phone`, `preferred_contact_method` | requester/contact fields | Exact case field names depend on the workflow design. |
| `needed_by` | not mapped to a due date | Informational only; do not let a requester-entered date silently become the case `due`. |
| `attachment` | case file attachment | Kept as a file attached to the case, not a mapped metadata value. |

This is a single Form Fill/trigger response, so mapping values into case metadata is technically possible once the workflow exists — it does not become a review collection, because only one response creates the case.

## 8. Confirmation message

Shown to the requester immediately after submission (exact placement — on-screen panel and/or automatic email — is a Provia form setting to verify, not assumed here):

> **Thank you — your IT request has been received.**
> A reference number is assigned automatically once your request is logged; look for it on this confirmation screen or in the confirmation email, depending on how this form is configured.
> Our IT team will review your request and follow up using the contact method you provided. This confirms your request was received — it is not yet a promise of when it will be resolved.
> If anything changes or you remember more details, reply to the confirmation email (once configured) or submit a new request referencing this one.

Deliberately avoided: a specific resolution deadline or SLA (none is confirmed — see `D2`/`D4`), and a claim that the reference number's exact format (e.g. `ITR-0001`) is guaranteed, since that depends on an `auto_number` configuration not yet set on the workflow.

## 9. What happens next (for the requester)

1. Submit the form; the confirmation above is shown.
2. A case is created in the (not yet designed) IT request workflow.
3. IT support classifies, diagnoses and resolves the request, then confirms with the requester — the concrete steps and owning group are open per `D2`.

## 10. Testing steps before publishing

1. Resolve `D1` (access model) and configure the form's access accordingly in Provia; then test both the sign-in state (if internal) and that an unauthenticated attempt behaves as intended.
2. Confirm `D3` (attachment type/size limits) in the target environment and adjust the help text on `attachment` if the platform enforces stricter limits than implied here.
3. Once a real workflow exists (`D2`), re-run this form against it: submit a test case, verify the proposed mappings in §7 land on the intended case fields, and update this document if field names differ.
4. Verify the actual confirmation screen/email content against §8 and adjust wording to match what Provia actually renders.
5. Re-validate the manifest after any change: `node scripts/build-project-map.mjs provia-project.json --check` (from the plugin root, with the manifest path adjusted to this project's location).

## 11. Manifest

Added to `provia-project.json`:
- `workflows[]`: placeholder entry `it-request` (`status: design`, no actions) so the form has somewhere to bind — not a workflow design.
- `forms[]`: `it-request-intake` (`kind: trigger`, `workflowRef: it-request`, `actionRef: null`, `status: designed`) with the fields in §3.
- `decisions[]`: `D1`–`D4` as described above.

Regenerated alongside this document: `project.html` (offline map) and `setup.md` (handover of pending items), both from `provia-project.json`.
