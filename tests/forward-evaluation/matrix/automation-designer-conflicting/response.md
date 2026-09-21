## Result

The request contradicts itself: `POST /payments` has no idempotency key, a timeout leaves the outcome unknown, and five automatic retries of that call can produce up to six payments for one instruction. Provia's `retryConfig` (1–5 attempts) does not distinguish "never sent" from "sent, no answer", so I did **not** configure five automatic retries. The design keeps the five as a cap on *human-confirmed* resends instead.

**Design in `workflow.yaml` (prefix PAY, validates clean):**

1. `prepare_payment` (Standard) — instruction data, authorization attached, `payment_attempt_count = 0`.
2. `execute_payment` (HTTP Request) — `POST`, `maxAttempts: 1`, `failureBehavior: continue_warning`, 60 s timeout, bearer token via `{{secret:PAYMENT_API_TOKEN}}`, case `payment_reference` (auto-number) sent as client reference for later reconciliation.
3. `decide_payment_outcome` (Decision) — Finance confirms the outcome in the provider portal/statement, records `payment_status` and attempts, then chooses **Paid** → continue, **Resend** → return to `execute_payment` (only when proven not executed and attempts < 5, comment required), or **Abandon** → cancel. `unknown` never resends.
4. `notify_payment_result` (Notification to creator).

**Files written to the working directory:** `integration-spec.md` (risk analysis, settings table, what would make retries safe, exception paths, the requirements list for the provider), `workflow.yaml`, `provia-project.json` (new manifest: source, Finance group, workflow with access, 11 setup notes, decisions D1–D7), `validation.json`, `action-review.md`, `setup.md`, `project.html`.

**Checks run:** validator `valid: true` (warning: organization secret required; destination validation not run); action review 2/2 human briefs complete, no leaks, `due` unset on both; manifest `--check` 0 errors, 0 warnings, 1 info, 15 pending setup items.

**Assumptions I had to make (all recorded as decisions or setup notes):** host is `api.example.com` placeholder; body field names, `$.id`/`$.status` mappings, `[200, 201, 202]` and bearer auth are proposals pending the provider's docs (D2); Finance is a proposed, memberless group (D5); Angola is a provisional country context; whether returning to an automatic HTTP action re-executes it must be verified in the customer's environment (D6). The Provia MCP read was not permitted in this session, so nothing was read from a tenant.

**The one thing to push back to the provider:** a client-reference uniqueness rule or an `Idempotency-Key` header (D1). With either, `maxAttempts` can go to 5 safely and the manual search disappears.

Recommended next step: `provia-workflow-review`, because the design contains a deliberate deviation from the stated requirement (no automatic retries) and an assumed owner, and a review of ownership, exceptions and publication readiness should happen before anyone asks the provider for the documentation listed in D1–D2.

```text
Use provia-workflow-review with provia-project.json and workflow.yaml in this folder. Review the Payment execution workflow: ownership (Finance is assumed), the Resend/Abandon exception paths, the decision brief that replaces automatic retries, and publication readiness. Keep maxAttempts at 1 unless decision D1 is resolved. Country: Angola (provisional); reply in English.
```