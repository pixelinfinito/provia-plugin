# AI profile: IT request classification (with human review)

Country/language context: no country or language was supplied with this request; Angola is disclosed here as the provisional default (Africa/Luanda, AOA), and the response follows the request's own language, English. No SOP, field list, entity catalogue, review policy or plan/settings confirmation was supplied either — every value below is either a stated assumption or an open item in `decisions[]`, not a confirmed fact.

## Where this sits

- Workflow: `it-request-classification` (`workflow.yaml`)
- Action: `classify_request` — "Classify the IT request", type `standard`, `assignee.type: ai_agent`
- Manifest: `aiProfiles[].key = classify_it_requests`, `actions[].assigneeRef = ai:classify_it_requests` (`provia-project.json`)

Only the classification step is designed. Triage routing, diagnosis and resolution were not requested and were not assumed; if a fuller IT-service SOP exists, `provia-workflow-designer` can extend this into a complete process.

## Objective

For one IT request, propose a `category` and `urgency`, with a confidence score and a short rationale, so a human reviewer can confirm or correct the classification before the case continues. The AI never finalizes its own proposal — that authority stays with the human reviewer, per `aiWorker.reviewRequired: true`.

## Inputs (readable fields)

- `request_summary` — short text
- `request_details` — full request text

The AI does not read requester identity, department or history; classification is drawn only from what the request states, to keep the rule set auditable and to avoid the AI inferring urgency from who is asking rather than what is asked.

## Output contract (writable fields)

| Field | Type | Written by AI |
| --- | --- | --- |
| `category` | select: Access, Equipment, Software, Network, Security, Other | Yes |
| `urgency` | select: Normal, High, Blocking | Yes |
| `classification_confidence` | percentage | Yes |
| `classification_rationale` | text | Yes |

Category and urgency options are drafted from this plugin's own `examples/it-service/workflow.yaml` training file (its `category`/`urgency` selects), not from a supplied SOP — see decision D2. Confirm them against the organization's real ticket taxonomy before publication.

## Rules given to the AI (`aiWorker.instructions`)

1. Category: pick exactly one option from what the request literally describes needing; if it names more than one, choose the one naming the requested action and record the secondary signal in the rationale.
2. Urgency: Blocking only when the text says the requester cannot work at all right now; High when it states a deadline or a multi-person impact; Normal otherwise.
3. Security override: any signal of a possible security incident (suspected compromise, phishing, malware, data exposure, unauthorized access, unrecognized login) is always `Security` / `Blocking`, even if the request opens with an unrelated ask — a missed security signal is worse than an over-classified one.
4. Confidence reflects only how directly the request states its category and impact, not how urgent it sounds.
5. Rationale quotes or closely paraphrases the words that drove the choice, in one to two sentences.
6. Missing or contradictory evidence: if `request_details` is empty, too short, or contradicts `request_summary`, set `category = Other`, `urgency = Normal` (unless a security signal is present), keep confidence low, and state in the rationale exactly what is missing or contradictory. The AI never guesses a specific category to fill the field.
7. The AI never marks the action complete and never overwrites a reviewer's correction.
8. The AI never invents a requester, ticket number, deadline or system not present in the two readable fields.

## Required skills

None. This is a bounded text-classification task over two fields; no tool calls, external lookups or file generation are required. `aiWorker.mode: safe`, no `requiredArtifacts`.

## Review behaviour

- `reviewRequired: true` — the action stays open until a human reviewer confirms or corrects `category`/`urgency` before the case moves on; the AI's proposal alone does not complete the action.
- `confidenceThreshold: 0.6` — proposed starting floor to flag low-confidence proposals for closer reviewer attention; untuned, since no historical classification data was supplied (decision D4). Confirm its exact effect in the live Provia UI before relying on it — this plugin cannot observe runtime behavior.
- Who performs the review (a specific group, role or the action's own reviewer setting) is not established here — it is a Provia-side configuration, not part of the portable YAML contract. Recorded as decision D1.
- Final approval of the classification stays with the human reviewer, not the AI: this profile prepares a proposal, it does not decide.

## Evaluation cases

**Normal** — "I can't log into my email, it says my password expired and the self-service reset page also isn't working. I have a client presentation in an hour."
Expected: `category = Access`, `urgency = Blocking` (cannot work at all and self-service is already broken), high confidence, rationale quoting "password expired" and "reset page also isn't working".

**Incomplete** — "My computer isn't working."
Expected: `category = Other`, `urgency = Normal`, low confidence, rationale stating that neither the affected component nor the specific symptom is stated, so no category can be chosen with reasonable confidence.

**Contradictory / competing signals** — "Can someone add me to the Finance shared folder? Also I noticed some odd login alerts on my account this morning that I didn't recognize."
Expected: `category = Security`, `urgency = Blocking` (security override applies even though the request opens with an access ask), rationale naming the unrecognized login alerts as the driving signal and the folder-access ask as secondary.

These are worked examples for reviewing the profile before enabling it, not executed test results; no live AI run was performed.

## What is confirmed vs. assumed vs. open

- Confirmed: the portable shape of an AI-assigned Standard action (`assignee.type: ai_agent`, `aiWorker.instructions/readableFields/writableFields/mode/reviewRequired/confidenceThreshold`) per `references/action-configs.md`, and that `workflow.yaml` passes `node scripts/validate-workflow.mjs` (`valid: true`, 0 errors; see setup.md) and `node scripts/review-actions.mjs` (all five description parts present).
- Assumed, stated above and in `provia-project.json.decisions[]`: category/urgency taxonomy, intake trigger, absence of a due date, and the 0.6 confidence threshold.
- Open (owner-assigned in `decisions[]`): D1 reviewer identity/role, D2 taxonomy confirmation, D3 intake channel and SLA, D4 confidence threshold tuning and the real AI profile id.

No organization, plan or settings check was performed — none was supplied, and this plugin does not connect to a live Provia tenant in this mode. Whether AI profiles are enabled on the destination plan must be confirmed in Provia directly.
