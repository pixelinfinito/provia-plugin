# Integration specification: POST /payments from a Provia workflow

Project `pagamentos` · provia-skills 1.2.0 · 2026-09-21 · contract revision `fed8efaf019abc901cb2b229f3676dc4031126fa`.
Disconnected mode: nothing was read from or written to a Provia organization. Country context: Angola, provisional (none was supplied); language en; timezone Africa/Luanda; currency AOA used only as the example currency in the body.

## 1. What was supplied and what it means

| Confirmed from the request (source `req-payment-api`) | Consequence |
| --- | --- |
| The provider exposes `POST /payments`. | The workflow can execute a payment through an HTTP Request action. |
| There is no idempotency key. | The provider cannot tell a repeated request from a new payment. Two identical POSTs are two payments. |
| A timeout does not tell us whether the payment happened. | After a timeout the request may have been processed. Anything sent again is a possible duplicate. |
| "Retry automatically five times." | **Conflicts with the two facts above.** Five automatic retries of a non-idempotent payment can produce up to six payments for one instruction. |

Nothing else is known: no host, no request or response schema, no status codes, no status-lookup endpoint, no settlement window, no team names, no service levels. Those are listed in section 6 as integration requirements and in the manifest as open decisions D1–D7.

## 2. The duplicate risk, stated plainly

Provia's HTTP Request action offers `retryConfig.maxAttempts` (1–5) and `failureBehavior` (`block_incident`, `continue_warning`, `block_action`) — see `references/action-configs.md`. The pinned contract does not distinguish a failure before the request left (connection refused, DNS) from a failure after it was sent (timeout while waiting for the answer). Every automatic retry therefore treats "no answer" as "not sent". For an API without an idempotency key that assumption is wrong in exactly the case the user described: the timeout.

Failure sequence with `maxAttempts: 5`:

1. Attempt 1 is sent; the provider debits the account; the response is lost or arrives after 60 s.
2. Provia sees a timeout and sends attempt 2 with the same body. The provider has no key to recognise it. Second payment.
3. Up to five sends can happen while the case shows a single "failed" action.

`references/action-configs.md` says it in one sentence: "An accepted configuration does not prove that retries are safe for the external operation." The validator accepts `maxAttempts: 5`; it is the business that pays for it.

**Decision taken in this design:** `maxAttempts: 1`. Automatic retries stay off until the provider confirms an idempotency mechanism or a status lookup (D1, D3). The "five" survives as a *cap on human-confirmed resends*, not as an automatic loop.

## 3. Design delivered (`workflow.yaml`, prefix PAY)

```
Start payment (manual)
  → prepare_payment        Standard   Prepare the payment instruction         Finance (creator in the draft)
  → execute_payment        HTTP       Send the payment to the provider        automatic, 1 attempt, continue_warning
  → decide_payment_outcome Decision   Decide the payment outcome              Finance (creator in the draft)
        Paid    → continue
        Resend  → return_to_action: execute_payment   (comment required; only when confirmed not executed and attempts < 5)
        Abandon → cancel_incident                     (comment required)
  → notify_payment_result  Notification to the case creator (in_app)
```

### 3.1 `execute_payment` — HTTP Request

| Setting | Value | Why |
| --- | --- | --- |
| `endpoint` | `https://api.example.com/payments` | Host unknown; `example.com` is the placeholder the plugin conventions use. Replace at setup and allowlist the real host. |
| `method` | `POST` | From the request. |
| `headers` | `Authorization: Bearer {{secret:PAYMENT_API_TOKEN}}`, `Content-Type: application/json` | Secret by reference only; value lives in the organization's secrets. Auth scheme is an assumption (D2). |
| `body` | JSON with `client_reference`, `amount`, `currency`, `beneficiary.name`, `beneficiary.account`, `description` | Field names are a proposal to be replaced from the provider's schema (D2). `client_reference` carries the case's `payment_reference` (auto-number `PAY-000001`) so that a later lookup by reference is possible if the provider supports one. How Provia substitutes case field values into a body must be confirmed in the product UI; the pinned contract defines only the `{{secret:NAME}}` substitution. |
| `responseMappings` | `$.id → provider_payment_id`, `$.status → provider_status`, both optional | Assumed paths (D2). Optional so an unexpected response shape does not fail the action a second time. |
| `executionTiming` | `automatic` | Runs when the action activates. |
| `timeoutSeconds` | `60` | Longer than the 30 s default to reduce how often a slow-but-successful call is reported as a timeout. Within the 10–120 range. Tune with the provider's observed latency. |
| `retryConfig.maxAttempts` | `1` | Section 2. |
| `retryConfig.failureBehavior` | `continue_warning` | On timeout or non-expected status the case **moves on to the human confirmation step with a warning** instead of stopping. Blocking would leave the ambiguous outcome unexamined; continuing lets Finance reconcile immediately. |
| `expectedStatusCodes` | `[200, 201, 202]` | Assumption; set from the documentation (D2). If the provider answers 202 for "accepted, pending", the confirmation step is still required for those cases. |

### 3.2 `decide_payment_outcome` — the reconciliation step

This is the replacement for automatic retries. The brief (in the YAML) tells the decider to:

1. Increment `payment_attempt_count`.
2. Look the payment up by `provider_payment_id` when the provider answered, otherwise by the case reference, amount and beneficiary in the provider's portal or statement, after the provider's settlement window (D4).
3. Record `payment_status` (`paid` / `not_executed` / `unknown`) with a dated screenshot or statement line as evidence.
4. Choose **Paid**, **Resend** (only when `not_executed` is proven and attempts < 5) or **Abandon** (five confirmed non-executions, or the payment must not proceed).
5. Never choose Resend on `unknown`: keep the action open and escalate.

Resend returns the case to `execute_payment`, which sends the same instruction once more, once. Each resend is therefore preceded by a reconciliation and a signed comment. After five confirmed non-executions the decider abandons and the case is cancelled with the reason recorded.

Two product limits to know:

- Provia does not count returns to an action. The cap of five is enforced by the decider through `payment_attempt_count` and the brief, not by the engine.
- Whether returning to an automatic HTTP action re-executes the call must be verified on a test workflow in the customer's environment before publication (D6). If it does not, the Resend branch is replaced by a manual "Send the payment again" step.

### 3.3 Fields added to the workflow

| Field | Type | Filled by | Purpose |
| --- | --- | --- | --- |
| `payment_reference` | auto_number `PAY-` | Provia | Client reference sent to the provider; reconciliation key. Unique within this workflow family, not globally. |
| `amount`, `beneficiary_name`, `beneficiary_account`, `payment_purpose` | currency / text | prepare_payment | Instruction data sent in the body. |
| `provider_payment_id`, `provider_status` | text | response mapping | Provider's answer, when there is one. |
| `payment_status` | select | decide_payment_outcome | Confirmed outcome after reconciliation. |
| `payment_attempt_count` | number | prepare_payment (0), decide_payment_outcome (+1) | Human-counted sends; the cap of five reads this field. |

### 3.4 Access

`restricted` sensitivity; one grant, `group:Finance → create_incident`, reason and source recorded. Consequence recorded in `access.note`: every Finance member who can open a case sees every payment case. Narrow the starters if the customer requires it.

## 4. What would make automatic retries safe (for when D1 is answered)

| Provider capability | Safe design in Provia |
| --- | --- |
| **Idempotency key** header (or a client reference the provider rejects as duplicate) | Send `payment_reference` as the key; `maxAttempts` may then rise to 5 with `failureBehavior: continue_warning`, and the confirmation step becomes a check rather than a search. |
| **Status lookup by id** (`GET /payments/{id}`) | Only helps when an id was received; a timeout on the create leaves no id. Still useful in the confirmation step to replace the portal search. |
| **Search by client reference** | Add a second HTTP action after `execute_payment` that looks up `payment_reference`; a metadata Wait (`conditionType: metadata`, field `provider_status`) can hold the case until the lookup answers. Resend becomes safe when the lookup confirms absence. Name it as a lookup ("Check the payment status"), never as an execution. |
| **Two-phase API** (create pending, then confirm) | Create is idempotent-safe if the provider ignores duplicates in pending state; confirm carries the id. Redesign on receipt of the documentation. |
| **Settlement export / statement API** | A scheduled reconciliation sub-workflow (five-field cron, `Africa/Luanda`, `missedBehavior: catch-up-one`) that matches cases with `payment_status` unknown against the statement. |

None of these endpoints is in the YAML because none was supplied.

## 5. Failure and exception paths

| Situation | What happens | Who acts |
| --- | --- | --- |
| Provider answers an expected code with an id | Mappings fill `provider_payment_id`/`provider_status`; decider confirms by id and chooses Paid. | Finance |
| Timeout (60 s) | Action ends with a warning; case reaches the decision; decider searches by reference after the settlement window. | Finance |
| Unexpected status code (4xx/5xx) | Same as timeout; the response body, if any, is in the action's execution log; a 4xx that proves rejection lets the decider choose Resend after fixing the instruction — or Abandon if the instruction itself is wrong. | Finance |
| Provider cannot say (`unknown`) | Decision stays open; escalation to the finance manager by comment; no resend. | Finance manager |
| Fifth confirmed non-execution | Abandon with comment; case cancelled; requester informed outside the workflow (the notification only fires on Paid). | Finance |
| Secret missing or host not allowlisted | The action fails at execution; the same path as a timeout. Setup item, see `setup.md`. | Implementer |

## 6. Integration requirements list (to obtain from the provider before publication)

1. Base URL and environment (sandbox/production) for `POST /payments`.
2. Authentication scheme and how the token is issued and rotated.
3. Request schema: field names, types, required fields, currency and amount format (minor units or decimal), beneficiary identifiers accepted (IBAN, account number, bank code).
4. Whether any request field is enforced as unique per payment (a client reference the provider rejects on repeat). This is the cheapest route to safe retries.
5. Success and error status codes and their meaning, particularly whether 202 exists and what it commits to.
6. Response schema: payment id, status values and their lifecycle (pending → settled/rejected).
7. Any status lookup: by id, by client reference, or a list/search endpoint; or a statement/settlement export.
8. Timeout and settlement window guidance: after how long is an unanswered request guaranteed not to be processed.
9. Rate limits and allowlisting requirements on the provider side (source IPs).

## 7. Checks run and their scope

| Check | File | Result |
| --- | --- | --- |
| `node scripts/validate-workflow.mjs workflow.yaml` | `validation.json` | `valid: true`, backend schema checks passed, `destinationValidation: not_run`, `readyToPublish: false`. Warning: organization secret required (`PAYMENT_API_TOKEN`). Setup: verify the secret and notification delivery. |
| `node scripts/review-actions.mjs workflow.yaml --markdown` | `action-review.md` | 2 of 2 human actions have all five brief parts; no leaked implementer notes; `due` unset on both (D7). |
| `node scripts/build-project-map.mjs provia-project.json --check` | console | 0 errors, 0 warnings, 1 info (rule 5: starters see every case, recorded in `access.note`); 15 pending setup items; 0 readiness blocks. |
| `--output project.html`, `--setup setup.md` | `project.html`, `setup.md` | Written from the manifest. |

Structural validity is not business correctness. Nothing was imported, published, called or tested against a provider. This Markdown file was not validated by any script.

## 8. Recommendations vs. facts vs. open

- **Fact:** with no idempotency key, an automatic retry after a timeout can duplicate a payment. `maxAttempts: 1` is the only configuration that cannot.
- **Recommendation:** keep the five as a human-confirmed resend cap; ask the provider for a client-reference uniqueness rule or an idempotency header (section 4, first row) — it is usually a small change on their side and removes the manual search.
- **Recommendation:** add an approval decision before `execute_payment` if the customer's procedure requires authorization inside the case (D5).
- **Open:** D1–D7 in `provia-project.json`; each has an owner.
