# Payment execution via provider API: Setup handover

Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Status

Mode: manual configuration (no receipts recorded).

## Pending configuration

| Where | Item | What to do |
| --- | --- | --- |
| pagamentos | Payment execution | Import the YAML as a draft and review the preview (`workflow.yaml`) |
| pagamentos | Payment execution | Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` section in the import preview. group:financas → create_incident |
| pagamentos / prepare_payment | Prepare the payment instruction | Assign the group to the action once the group exists (`financas`) |
| pagamentos / prepare_payment | Prepare the payment instruction | Set the deadline; the design proposes no `due` |
| pagamentos / decide_payment_outcome | Decide the payment outcome | Assign the group to the action once the group exists (`financas`) |
| pagamentos / decide_payment_outcome | Decide the payment outcome | Set the deadline; the design proposes no `due` |

## Workflow access

Who may see and open each workflow. `view` on a workflow shows every case; whoever executes an action sees their own cases without a grant. Grants are created with `workflow_access_apply` in connected mode or through the `access` section of the YAML imported in the browser.

| Workflow | Sensitivity | Grantee | Level | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| `pagamentos` | restricted | `group:financas` (Finance) | create_incident | Finance opens payment cases and executes the confirmation step; assumption, the request names no starter. (req-payment-api §api) | to apply |

## Groups to create

- `financas` Finance [team]: Prepares payment instructions and confirms payment outcomes with the provider. Proposed; the request names no team.

## Group flags

- `financas`: Owner unnamed in the sources. No source names the team that prepares and confirms payments; Finance is an assumption to be confirmed with the customer.

## Open decisions

- **D1** Does the payment provider offer any of: (a) an idempotency key or client-reference uniqueness on POST /payments, (b) a status lookup by payment id (GET /payments/{id}), (c) a search by client reference, or (d) a settlement/statement export? Automatic retries stay disabled until one of (a)–(c) is confirmed and designed into the workflow. (Owner: Integration lead / payment provider contact)
- **D2** What are the provider's real base URL, request body schema, success status codes and response fields (payment id, status) for POST /payments? The YAML carries placeholders (api.example.com, assumed field names, $.id, $.status). (Owner: Integration lead)
- **D3** Is the requirement 'retry automatically five times' accepted as 'up to five human-confirmed resends' (this design), or does the customer insist on automatic retries? Automatic retries require D1 to be resolved with an idempotency key or a pre-send status check. (Owner: Finance manager / process owner)
- **D4** How long after a timed-out call should the decider wait before concluding the payment was not executed (the provider's settlement window), and where does Finance look it up (portal, statement, support desk)? (Owner: Finance manager)
- **D5** Which team prepares payment instructions and confirms outcomes, and who authorizes a payment before it is sent? Finance is a proposed group with no members; no approval step exists in this draft. (Owner: Process owner)
- **D6** Does returning to the HTTP action (Resend branch) re-execute the call automatically in the customer's Provia environment? To verify on a test workflow before publication. (Owner: Provia implementer)
- **D7** What deadlines apply to preparing the instruction and to confirming the outcome after a send? No service level was supplied, so `due` is unset on prepare_payment and decide_payment_outcome. (Owner: Finance manager)

## Setup notes

- `pagamentos`: Secret: create the organization secret PAYMENT_API_TOKEN with the provider's bearer token before publishing; the YAML references it as {{secret:PAYMENT_API_TOKEN}} and never carries the value.
- `pagamentos`: HTTP allowlist: replace https://api.example.com/payments with the provider's real HTTPS base URL and add that host to the organization's allowed HTTP destinations. The request supplied only the path POST /payments; the host is unknown.
- `pagamentos`: Request body: the JSON body in execute_payment names the case fields to send (client_reference, amount, currency, beneficiary.name, beneficiary.account, description). The provider's actual field names, types and required fields must be taken from its API documentation, and the field-substitution syntax for case values in HTTP bodies must be confirmed in the Provia UI; the pinned contract defines only {{secret:NAME}}.
- `pagamentos`: Response mappings: $.id -> provider_payment_id and $.status -> provider_status are assumed JSONPaths. Replace them with the paths from the provider's response schema, or remove them if the response carries no id.
- `pagamentos`: Expected status codes: [200, 201, 202] is an assumption. Set the list from the provider's documented success responses (e.g. whether 202 means accepted-but-pending).
- `pagamentos`: Retry: retryConfig.maxAttempts is deliberately 1. Do not raise it while POST /payments has no idempotency key; each automatic retry after a timeout can create a duplicate payment. See integration-spec.md.
- `pagamentos`: Failure behaviour: continue_warning lets the case reach the confirmation step after a timeout or error. Verify in the destination that the warning is visible on the action and that the case does not stop.
- `pagamentos`: Return to action: the Resend branch returns to execute_payment. Verify in the destination that returning to an automatic HTTP action re-executes the call (and does not require a manual re-trigger); if it does not re-execute, replace the branch with a manual re-send step.
- `pagamentos`: Owner assignment: actions prepare_payment and decide_payment_outcome are assigned to the creator in the YAML as a draft simplification; set the Finance group as default responsible on import once the group exists.
- `pagamentos`: Loop cap: Provia does not enforce a maximum number of returns to an action; the five-send limit is applied by the decider through payment_attempt_count and the decision brief.
- `pagamentos`: Authorization: this workflow starts at 'prepare the payment instruction' and assumes the payment was authorized before the case is opened; add an approval decision before execute_payment if the customer's procedure requires it.

## Validation

Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.
