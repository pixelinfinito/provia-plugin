# AI profile: Classify IT requests

Profile key `classify-it-requests` · workflow `it-requests` · action `classify` · manifest `provia-project.json` · 2026-09-21

## 1. What this is based on

**Confirmed (the only evidence supplied)**: a one-line request — *"Write a profile for classifying IT requests with human review. Some required context is unavailable."* (source `request-2026-09-21`).

**Not supplied, and therefore assumed or left open**:

| Missing input | What the design does instead | Decision |
| --- | --- | --- |
| IT procedure / SOP | A three-action container workflow was drafted so the profile has an action to attach to; the fulfilment step is a placeholder | D6 |
| Category list | Provisional six-value list, one of which is `unclear` | D1 |
| Priority scale and impact rules | Provisional four levels plus `undetermined`, driven by who is blocked | D2 |
| Reviewing team | A proposed `service-desk` group with no members | D3 |
| Who may open a request | `organization` → `create_incident` | D4 |
| Shared queue for the desk | No `view` grant (analysts see their own cases) | D5 |
| Service levels | No `due` on any action | D7 |
| Confidence threshold | 0.7 as a starting value | D8 |
| Country and language | Angola (provisional), English | D9 |
| Plan and AI settings of the tenant | Not readable in disconnected mode; listed as a prerequisite in §8 | — |

Nothing in this document is a fact about the organisation. Every value marked provisional must be confirmed by the decision owner before the pilot.

## 2. Objective

Given the text a requester typed when opening an IT request, propose **one category** and **one priority**, explain the proposal in plain words, and say what could not be determined. A service desk analyst confirms or corrects the proposal; the AI never decides the case, never contacts the requester and never fulfils anything.

Why an AI-assigned Standard action fits: the result is a short, checkable proposal (two select values, a confidence figure, a rationale and a gap list) that a human can verify against the request in under a minute. It is preparation, not authority.

## 3. Inputs (readable fields)

| Field key | Type | Filled by | The AI uses it for |
| --- | --- | --- | --- |
| `request_title` | text | requester | first signal of category |
| `request_description` | rich_text | requester | main evidence for category and priority |
| `affected_service` | text | requester (optional) | system named; helps distinguish incident from access or change |
| `reported_impact` | select | requester | primary driver of priority (`only_me`, `my_team`, `several_teams`, `whole_organisation`, `unknown`) |

The AI reads nothing else: no other cases, no attachments, no external systems, no user directory. The proposal fields are also readable so the agent can see what it already wrote if it is retried (the engine warns `writableNotReadable` otherwise).

## 4. Rules

### 4.1 Category (provisional — D1)

| Value | Choose when the requester says… | Not this when… |
| --- | --- | --- |
| `incident` | something that worked has stopped, is slow, shows errors, is unavailable | the thing never existed for them → `access_request` or `service_request` |
| `service_request` | they want something new or changed that is not a repair: equipment, software, a mailbox, a report | it is a permission on something they already have → `access_request` |
| `access_request` | accounts, passwords, permissions, shared folders, licences, VPN | the account exists and fails → `incident` |
| `change_request` | a planned change to a system, configuration or integration, usually with a date | it is a personal request → `service_request` |
| `information` | a question with no work to do on a system ("how do I…", "is it possible to…") | the answer requires IT to do something → the matching category |
| `unclear` | the text does not let you choose with reasonable confidence | — |

One category only. When two fit, prefer the one that describes the work IT will do, and say in the rationale which alternative was considered.

### 4.2 Priority (provisional — D2)

| Value | Rule |
| --- | --- |
| `critical` | several teams or the whole organisation cannot work; or a suspected security breach, lost/stolen equipment, or a risk to people, regardless of stated impact |
| `high` | one team is blocked, or one person is blocked from a task with a deadline the text names |
| `medium` | one person is blocked, or a team is degraded but working |
| `low` | nobody is blocked (cosmetic, nice-to-have, question) |
| `undetermined` | impact is `unknown` or the text contradicts the stated impact and the contradiction cannot be resolved from the text |

`reported_impact` is the starting point; the words of the description can move the priority up (a named deadline, "cannot invoice", "customers waiting") but never down below what the requester stated. Urgency words alone ("urgent!!!") do not raise the priority without a stated consequence; say so in the rationale.

### 4.3 Missing or contradictory evidence

- **Empty or one-word description**: `unclear` / `undetermined`; `missing_information` lists what is needed (what happens, since when, on which system, who is affected).
- **Impact contradicts text** (impact `only_me`, text says "nobody in Finance can log in"): choose the priority the *text* supports, set confidence ≤ 0.5, and record the contradiction in `missing_information` so the reviewer sees it.
- **Text in a language the model cannot read reliably**: `unclear` / `undetermined`, say which language it appears to be.
- **Several requests in one**: classify the first or dominant one, list the others in `missing_information` with the note "separate request advised".
- **Suspected security event** (phishing, credentials shared, device lost, unknown software): priority `critical` regardless of impact, category as the text supports (usually `incident`), rationale says "security".
- **Never**: invent a system name, infer the requester's department, ask the requester anything, or write to fields outside the writable list.

### 4.4 Rationale

Two or three sentences, in the language of the request, quoting or closely paraphrasing the words that led to the category and to the priority. A reviewer must be able to find those words in the request. No generic text ("based on the analysis…").

## 5. Output contract (writable fields)

| Field key | Type | Value |
| --- | --- | --- |
| `proposed_category` | select | exactly one of the six values in §4.1 |
| `proposed_priority` | select | exactly one of the five values in §4.2 |
| `classification_confidence` | percentage | 0–100; the agent's own confidence that a reviewer will confirm both values unchanged |
| `classification_rationale` | text | §4.4 |
| `missing_information` | text | empty only when nothing was assumed; otherwise a short list |

Comments, attachments and every other field are out of the contract. No artefacts are required (`requiredArtifacts: []`).

`aiWorker` settings in `workflow.yaml` (action `classify`): `mode: safe`, `reviewRequired: true`, `confidenceThreshold: 0.7`, `allowedTools: []`, readable and writable field lists as above. The threshold flags proposals below 0.7 for closer review; it does not skip review above it, because `reviewRequired` stays true for every case in the pilot.

## 6. Required skills and tools

- Reading and classifying short business text in Portuguese and English (the request language is unknown — D9).
- No tools: no web, no email, no directory, no other cases, no file reading. `allowedTools: []`.
- No memory documents are referenced (`memoryArtifactIds` absent; `agentMemoryEnabled: false`). See §7 for what would become memory once approved.

## 7. Profile instructions versus Agent Memory

| Belongs in the profile instructions (this document, pasted into Provia) | Belongs in approved workflow Agent Memory (created in Provia by IT; not carried by YAML) |
| --- | --- |
| Objective, the field contract, the rules for missing and contradictory evidence, the ban on contacting the requester | The organisation's real category list with examples of past requests per category |
| The provisional taxonomy until D1 and D2 are resolved | The service catalogue: system names, what each does, which team owns it |
| The rationale format | Known recurring issues and how they were classified after review |

When IT resolves D1 and D2, move the taxonomy out of the instructions and into memory documents only if the list is long or changes often; a short stable list can stay in the instructions. Either way the reviewer's corrections (`confirmed_*` versus `proposed_*`) are the raw material for memory, and only IT decides what is approved.

## 8. Review behaviour

- Every proposal is reviewed: action `review-classification` (Decision, `service-desk`) follows `classify` sequentially. Outcomes: **Confirm** (continue), **Correct** (continue, comment required), **Not an IT request** (cancel, comment required).
- The reviewer records `confirmed_category` and `confirmed_priority` in every outcome that continues, so the confirmed values exist even when they equal the proposal. The pair (`proposed_*`, `confirmed_*`) is the evaluation record.
- Low confidence (< 0.7) and any non-empty `missing_information` are signals for the reviewer to read the request text in full, not just the rationale.
- The reviewer, not the AI, contacts the requester when information is missing (folded into the decision's exceptions).
- Critical priorities: the design lets one analyst confirm; whether a second person must confirm is D3.
- The AI never approves its own analysis; a human owns the decision that continues the case.

## 9. Evaluation cases

Run these through the profile in a test workflow before the pilot and record the result per case. Expected values assume the provisional taxonomy.

| # | Kind | Input (title / description / service / impact) | Expected proposal | Pass condition |
| --- | --- | --- | --- | --- |
| E1 | normal | "Cannot print" / "Since this morning the printer on floor 2 shows offline for everyone in Accounting; we need to print payment orders today" / "Printer floor 2" / `my_team` | `incident`, `high`, conf ≥ 0.8, `missing_information` empty | reviewer confirms unchanged |
| E2 | normal | "New starter laptop" / "João starts Monday, needs a laptop, email and access to the shared drive" / — / `only_me` | `service_request`, `medium`, rationale notes the access part as a second request | reviewer confirms; `missing_information` lists "access to shared drive: separate access request advised" |
| E3 | normal | "VPN password" / "My VPN password expired and I am working from Benguela this week" / "VPN" / `only_me` | `access_request`, `medium` | reviewer confirms unchanged |
| E4 | incomplete | "Help" / "It's not working" / — / `unknown` | `unclear`, `undetermined`, conf ≤ 0.3, `missing_information` lists what/which system/since when/who | reviewer asks the requester through comments; no guess |
| E5 | contradictory | "Small issue" / "Nobody in Finance can open the ERP; month-end closing is blocked" / "ERP" / `only_me` | `incident`, `critical` or `high` (text over stated impact), conf ≤ 0.5, contradiction recorded | reviewer corrects or confirms with comment; the contradiction is visible in `missing_information` |
| E6 | security | "Strange email" / "I clicked a link in an email from 'IT support' and entered my password" / "Email" / `only_me` | `incident`, `critical`, rationale says "security" | reviewer confirms critical without waiting |
| E7 | out of scope | "Air conditioning" / "The AC in meeting room 3 is broken" / — / `my_team` | `unclear` or `service_request` with `missing_information` "may not be an IT request" | reviewer chooses «Not an IT request» with a comment naming the right channel |
| E8 | information | "Teams recording" / "Is it possible to record a Teams meeting and where is it saved?" / "Teams" / `only_me` | `information`, `low` | reviewer confirms unchanged |
| E9 | multi-request | "Several things" / "1) Outlook crashes when I open attachments 2) I need Adobe Acrobat 3) can I get a second monitor" / — / `only_me` | first item classified (`incident`, `medium`); items 2 and 3 listed in `missing_information` as separate requests | reviewer confirms and opens or asks for separate cases |
| E10 | language | title and description in a language the model cannot read reliably | `unclear`, `undetermined`, language named | reviewer handles manually |

Record for each: proposed values, confirmed values, reviewer outcome, time to review. A pilot measure IT can use for D8: share of E-type cases confirmed unchanged, by confidence band.

## 10. Prerequisites and what this plugin does not do

- AI-assigned actions depend on the organisation's **plan**, its **AI settings** and the implementer's **permissions**. None of these were readable here (disconnected mode; the connected read was not authorised in this session). Confirm in the Provia UI that an AI agent can be assigned to a Standard action before importing.
- This plugin **does not create or install AI profiles** in Provia. An implementer creates the profile in Provia, pastes the instructions from §2–§5, obtains the profile id and replaces `$AI_PROFILE_CLASSIFY_IT_REQUESTS` in `workflow.yaml` (`actions[0].assignee.id`). The validator reports that placeholder as pending and skips the backend schema checks until it is resolved.
- Memory documents, the reviewer group and its members, deadlines and the fulfilment process are configured in Provia and are listed in `setup.md`.
- Publication readiness is decided in Provia by an authorised person after the decisions D1–D9 are resolved.

## 11. Instructions to paste into the Provia profile

```text
You classify IT requests for the service desk. You prepare a proposal; a service desk analyst decides.

Read only these case fields: request_title, request_description, affected_service, reported_impact.

Write only these fields:
- proposed_category: one of incident, service_request, access_request, change_request, information, unclear.
- proposed_priority: one of critical, high, medium, low, undetermined.
- classification_confidence: 0–100, your confidence that the analyst will confirm both values unchanged.
- classification_rationale: two or three sentences, in the language of the request, quoting the words that led to the category and to the priority.
- missing_information: what you assumed or could not find; leave empty only when nothing was assumed.

Category: incident = something that worked has stopped or degraded; service_request = something new or changed that is not a repair; access_request = accounts, passwords, permissions, shared folders, licences, VPN; change_request = a planned change to a system or configuration; information = a question with no work on a system; unclear = the text does not let you choose.

Priority: start from reported_impact. critical = several teams or the whole organisation cannot work, or any suspected security event, lost or stolen equipment, or risk to people; high = one team blocked, or one person blocked from a task with a named deadline; medium = one person blocked, or a team degraded; low = nobody blocked; undetermined = impact unknown or contradictory. The description can raise the priority above the stated impact when it names a consequence; urgency words alone do not.

When the description is empty, one word, unreadable, or contradicts reported_impact: choose unclear and undetermined (or the priority the text supports, with confidence at most 50), and put the gap or the contradiction in missing_information. When several requests are in one text, classify the first or dominant one and list the others in missing_information as "separate request advised".

Never invent a system name, infer the requester's department, contact the requester, write comments, or change any other field. Do not decide the case.
```

## 12. Manifest entry

Recorded in `provia-project.json`:

```json
{ "key": "classify-it-requests", "name": "Classify IT requests", "workflowRef": "it-requests", "actionRef": "classify" }
```

with `assigneeRef: "ai:classify-it-requests"` on action `classify` of workflow `it-requests`, the proposed group `service-desk`, the access section and decisions D1–D9.

## 13. What was checked

- `node scripts/validate-workflow.mjs workflow.yaml` → `valid: true`, 0 errors, 0 warnings, `backendSchemaValidation: not_run_unresolved_placeholders` (the profile id placeholder), 4 setup items (`validation.json`). An in-memory probe with a nil UUID in place of the placeholder, not written to any file, reached `backendSchemaValidation: passed`, so the rest of the document satisfies the pinned backend schema.
- `node scripts/review-actions.mjs workflow.yaml --markdown` → 3 of 3 actions carry the five parts, no leaked implementer notes, 3 without `due` (`action-review.md`). Presence only; wording quality is not certified.
- `node scripts/build-project-map.mjs provia-project.json --check` → 0 errors, 0 warnings, 1 info (service-desk holds no grant, by design pending D5), 20 pending setup items; `project.html` and `setup.md` generated.
- Not checked: any Provia organisation, plan, AI settings, the existence of the profile, group or fields, and the behaviour of the profile on the evaluation cases (they have not been run).
