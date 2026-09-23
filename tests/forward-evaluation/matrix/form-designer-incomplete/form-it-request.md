# IT request — intake form specification

Form key `pedido-ti` · title **IT request** · kind: intake (trigger) · workflow `pedidos-ti` · status: designed, not created
Manifest: `provia-project.json` · handover: `setup.md` · map: `project.html`

## What was supplied and what was not

The request was one sentence: design a self-service IT request form with a clear confirmation. No procedure, service catalogue, ticket export, group list or form-behaviour screenshot was supplied, and no Provia organization is connected in this session, so nothing was read from a tenant.

Everything below is therefore of one of three kinds, marked throughout:

- **Confirmed** — product behaviour taken from the bundled references (`references/provia-capabilities.md`, `references/metadata-fields.md`, `references/workflow-access.md`) and the pinned contract revision `fed8efaf019abc901cb2b229f3676dc4031126fa`. It is implementation evidence, not proof of the version deployed in your environment.
- **Recommended** — a design choice made so the form is usable now. Replace it when the real context arrives.
- **Open decision** — recorded as `decisions[]` D1–D9 in the manifest, each with an owner.

Country and language were not stated. Angola is used as a provisional context (Africa/Luanda, AOA); the form is drafted in English because the request was in English. A pt-AO version translates labels and help text over the same field keys (D8).

## Design decision: intake form, not Form Fill

**Confirmed.** Submission creates the incident, so this is an intake Form attached to the workflow's form trigger — not a Form Fill, which collects answers inside a case that already exists. There is consequently no Form Fill action and no `formRef` on an action; `forms[].actionRef` is null, which is what the manifest checker expects for a trigger form.

If what you actually want is the *requester confirming that the resolution worked* before the case closes, that is a second, different artefact: a Form Fill action on the closure step. Say so and it can be specified; it is not included here because it would be process that nobody described.

## Respondents and access path — the unresolved part (D1)

The respondent access model is unknown, and this is the one decision that changes the form's shape. The available options:

| Option | Who can submit | What the form needs | Access consequence |
| --- | --- | --- | --- |
| A — authenticated employees (assumed) | Anyone with a Provia account | No name/email fields: the case creator carries the identity | `organization` at `create_incident`, as written in the manifest |
| B — a named subset | Only some departments or sites | Same as A | Replace the organization grant with group grants; the form trigger is *not* narrowed by manual-trigger allowlists |
| C — people without an account | Contractors, new joiners locked out of their account | Add required `requester_name` (text) and `requester_email` (email); `contact_phone` becomes required | Needs a form behaviour this session could not verify |

**No external or anonymous link is promised.** Whether this environment exposes one, and under what conditions, was not checked — the plugin has no connection to your Provia organization. Until an implementer confirms it in the destination, design on option A, which is what the manifest currently declares.

Note that option A has a real edge case: someone who cannot sign in cannot report that they cannot sign in. The usual answer is a phone or walk-up path alongside the form, not an anonymous link — but that is a policy choice, not a design this task can make for you.

**Access testing is pending.** Nothing about visibility, submission or the Start path has been tested; `setup.md` carries the verification steps.

## Fields

Field keys are the contract between the form and the case; they must match the workflow's metadata field keys exactly for the mapping to be configurable. `*` marks required.

| # | Field key | Label shown | Type | Req. | Validation / configuration | Maps to case field | Kind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `summary` | What do you need, in one line? | `text` | * | max 120 chars; placeholder "Laptop does not start after the update" | `summary` (case title) | Recommended |
| 2 | `description` | Describe the problem or the request | `rich_text` | * | help text: what happens, when it started, what you already tried, any error message | `description` | Recommended |
| 3 | `request_type` | What kind of request is this? | `select` | * | six options (below) | `request_type` | Placeholder (D2) |
| 4 | `impact` | How much is this affecting your work? | `select` | * | three options (below) | `impact` | Recommended |
| 5 | `affected_service` | Which system, application or device is affected? | `text` | | max 120 chars | `affected_service` | Recommended |
| 6 | `location` | Where are you? | `text` | | max 80 chars; help text "Office, floor or site — or 'remote'" | `location` | Placeholder (D7) |
| 7 | `contact_phone` | Phone or extension for a quick call | `phone` | | — | `contact_phone` | Recommended |
| 8 | `attachments` | Screenshot or file (optional) | `file` | | png, jpg, pdf, txt, log; up to 3 files | not mapped — see uploads | Recommended |

`request_type` options: `hardware` (Equipment or device problem) · `software` (Application or software problem) · `access` (Access, account or password) · `network` (Network, internet or telephone) · `new_equipment` (Request for new equipment or software) · `other` (Something else).

`impact` options: `blocked` (I cannot work at all) · `degraded` (I can work, but with difficulty) · `minor` (It can wait / it is a question).

Eight fields is the point, not an accident: a self-service form that is longer than the phone call it replaces does not get used. Three of the eight are required.

### Why these and not others

- **No priority field.** `impact` asks the requester about their own work, which they can answer, instead of asking them to pick a severity level, which they cannot. Triage sets the real priority.
- **No requester name or email on option A.** Provia records the creator. Duplicating identity fields invites mismatches between who submitted and who is named.
- **No case reference field.** **Confirmed:** the form field enum in the inspected revision excludes `auto_number` (`references/metadata-fields.md`), so a reference cannot be asked on, or generated by, the form. It belongs to the workflow's metadata schema.
- **No dependent sub-category.** **Confirmed:** form option definitions do not preserve dependent-option bindings in the inspected revision. A `request_type` → `request_subtype` cascade that works on entity metadata will not survive as a form. If sub-categories are needed, either flatten them into one list or set them during triage.

## Mappings

**Confirmed:** an intake form creates the incident and its answers populate case metadata; the workflow must declare those fields first. Before the form is created, the `pedidos-ti` metadata schema needs: `summary` (text), `description` (rich_text), `request_type` (select, same option values), `impact` (select, same option values), `affected_service` (text), `location` (text), `contact_phone` (phone). Option **values** must match, not just the labels.

This is a single-response intake, so every mapping is a straight one-to-one write with no competing values — the collision problem that affects multi-response Form Fill collections does not arise here.

## Uploads

`attachments` accepts png, jpg, pdf, txt and log, up to three files. **Recommended policy, not a product limit.** Two things need verification in the destination (D5):

1. The maximum file size the environment enforces. Do not state a number to respondents until it is read from the destination — a rejected 12 MB screenshot with no explanation is worse than no upload field.
2. Whether a form attachment also lands in the case files or stays inside the response record. Triage instructions assume the former; confirm it before telling technicians where to look.

Each accepted type earns its place: screenshots (png, jpg) for error dialogs, pdf for vendor or licence documents on `new_equipment`, txt and log for application logs. Nothing executable is accepted.

A screenshot of a shared screen can contain a colleague's personal data. The workflow is marked `sensitivity: internal` for this reason; whether that is sufficient under your own data policy is part of D5.

## Confirmation

Shown on screen immediately after submission:

> **Your IT request has been registered.**
>
> IT Support has received it and will review it. We will contact you using your Provia account, or by phone if you gave us a number.
>
> If you cannot work at all and have not heard anything, contact IT Support directly through the usual channel — do not submit the form a second time, as duplicates slow the queue down.
>
> You can close this page.

What it deliberately does not say:

- **No deadline.** "Within 4 hours", "by the next working day" and "same day" are all invented until D3 is answered. A response target printed on a confirmation is a promise the organization has not made.
- **No case reference**, until it is verified that the form confirmation in this environment can display one (D6). The sentence "Your reference is TI-0042" is easy to add later and impossible to retract once respondents have read it and it turns out to be blank.
- **No named contact or phone number.** None was supplied; "the usual channel" is a placeholder that the implementer replaces with the real IT desk contact before the form goes live.
- **No email promise.** Whether the requester gets a notification is D6, and a notification is designed with `provia-automation-designer`, not configured on the form.

The duplicate-submission line is there because it is the single most common failure of self-service intake: a requester who gets no acknowledgement submits again, and the queue fills with the same problem three times.

## Setup sequence

Forms are not carried by the portable YAML contract (**confirmed**), so this is manual configuration in Provia, or connected mode — not an import.

1. Design the rest of the workflow (D9) and declare the seven metadata fields above in its schema.
2. Create the form `IT request` with the eight fields and the exact keys in the table.
3. Attach it to the workflow's form trigger so submission creates an incident.
4. Configure the field mappings, one to one.
5. Enter the confirmation text, with the real IT desk contact substituted.
6. Set the access path decided in D1 and publish the form's link where respondents will actually look for it.
7. Run the test plan below.

## Test plan — pending, not run

No submission, mapping, access or confirmation test has been performed; this plugin does not touch a Provia organization. Each step is for the implementer, in a test environment first.

1. **Submit as a respondent, not as the implementer.** Sign in as a member of the intended audience and submit with only the required fields filled. An implementer with admin rights proves nothing about what an ordinary employee can reach.
2. **Check the case.** Confirm an incident was created, the title reads from `summary`, and all seven mapped values arrived with the right option values — not blank, not the label instead of the value.
3. **Submit with an attachment** and confirm where the file ended up, and what happens to an oversized file and a rejected type.
4. **Read the confirmation as a respondent would.** It must not promise anything you cannot keep.
5. **Test the negative access case.** Someone outside the intended audience must not be able to submit. On option C, test from a session with no Provia account at all.
6. **Check the triage view.** With no `view` grant to IT Support (D4), a member sees the case only once it carries their action. Confirm the queue is workable that way, or answer D4.
7. **Record the results** in `setup.md` and, if you configure by hand, add a manual receipt to the manifest so the map reflects reality.

## Status

Designed, not created. Nothing was created, linked, published or tested in Provia. The manifest check (`node scripts/build-project-map.mjs provia-project.json --check`) passed with 0 errors, 0 warnings and 1 info — that IT Support holds no workflow grant, which is D4 — and reports 16 pending setup items. That check validates the manifest's shape and references; it says nothing about whether this form asks the right questions for your organization. Nine decisions are open.
