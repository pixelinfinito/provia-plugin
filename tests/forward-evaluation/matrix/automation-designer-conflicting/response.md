All artefacts check out. Here's the summary.

## What I built

I did **not** configure a blind 5x automatic retry, because that would be unsafe: `POST /payments` has no idempotency key, so on a timeout you can't tell if the charge went through — retrying blindly risks charging the payer multiple times. This is exactly the case the automation-designer skill requires flagging rather than silently implementing.

**Design delivered** (`workflow.yaml`, action `submit_payment`, type `http_request`):
- `retryConfig.maxAttempts: 1`, `failureBehavior: block_incident` — on timeout, connection failure, or an unexpected status code, the case raises an incident instead of resubmitting.
- Endpoint, request body, and response mapping are explicit placeholders (`https://example.com/payments`) since no real host, auth scheme, or payload schema was supplied — only the path and the no-idempotency/ambiguous-timeout facts were given.
- Validated clean: `node scripts/validate-workflow.mjs workflow.yaml` → `valid: true`; `node scripts/review-actions.mjs workflow.yaml` → no leaks, description complete for an automated action.

**Manifest** (`provia-project.json`) records three open decisions an implementer must resolve before this can go live:
- **D-PAY-1**: does the provider support any dedup mechanism (client reference field, undocumented idempotency header, or a status-lookup endpoint)? If yes, `maxAttempts` can safely go up toward 5, reusing the same reference each attempt — that's the condition under which "retry five times" becomes safe.
- **D-PAY-2**: real host, auth, schema, expected status codes.
- **D-PAY-3**: who reconciles an ambiguous payment with the provider when the incident fires.

`setup.md` and `project.html` are generated from the manifest and list these plus the secret/allowlist setup needed.

**Files written**: `workflow.yaml`, `provia-project.json`, `setup.md`, `project.html`.

---

Next useful step: **`provia-organization-rollout`** — to name a real owner group for the reconciliation incident (D-PAY-3), since none exists yet. Once the provider confirms dedup support or a status endpoint (D-PAY-1/D-PAY-2), come back to `provia-automation-designer` to raise the retry limit safely.

```text
Use provia-organization-rollout with provia-project.json (workflow "payments", action "submit_payment"). Design the group that reconciles ambiguous payment timeouts with the provider and resolves decision D-PAY-3.
```