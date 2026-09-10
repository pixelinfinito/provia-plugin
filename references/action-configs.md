# Action configuration details

Use with workflow-yaml.md when emitting an action's config or aiWorker mapping. These are field guides for the pinned source revision; the executable validator remains authoritative for checks it performs. Examples below are fragments, not complete workflow documents.

## HTTP Request

Use HTTPS endpoint and method GET, POST, PUT, PATCH or DELETE. headers is a list of `{key, value, enabled}`; at most 50. A body is required for POST/PUT/PATCH and absent for GET/DELETE. Prefer body `{type: json|form|raw, content: string}`. responseMappings is a list of `{jsonPath, targetField, defaultValue?, required?}` with JSONPath starting `$` and an existing compatible metadata target. At most 50 mappings.

executionTiming is on_start, on_complete or automatic. timeoutSeconds is an integer from 10 to 120. retryConfig has maxAttempts (1–5) and failureBehavior (block_incident, continue_warning or block_action). expectedStatusCodes is a list of HTTP codes. An accepted configuration does not prove that retries are safe for the external operation.

```yaml
config:
  endpoint: https://example.com/status
  method: GET
  headers:
    - key: Authorization
      value: "Bearer {{secret:SERVICE_TOKEN}}"
      enabled: true
  executionTiming: automatic
  timeoutSeconds: 30
  retryConfig:
    maxAttempts: 1
    failureBehavior: block_action
  expectedStatusCodes: [200]
```

Replace example.com with an approved actual API destination during organization setup. Confirm the secret exists and the endpoint is allowed. Never call it merely to validate a YAML file.

## Wait

conditionType is datetime, duration, metadata or webhook. datetime conditionValue uses UTC ISO 8601 such as `2026-10-01T09:00:00Z`. duration uses an ISO duration containing at least one component, such as `PT2H`. metadata uses conditionValue for the field path, targetValue and an operator among eq, neq, gt, gte, lt, lte, contains. Webhook tokens are generated/configured by Provia; do not invent one.

All modes support integer timeoutDays (1–365) and onTimeout complete, cancel_incident or block. Specify the timeout behavior according to the procedure.

```yaml
config:
  conditionType: duration
  conditionValue: PT2H
  timeoutDays: 1
  onTimeout: block
```

## Notification

recipientType is users, groups, creator or previous_owner. users/groups require nonempty recipientIds with real UUIDs. channels is a nonempty list of email and/or in_app. messageTemplate is required (up to 5000 characters); subject is optional (up to 200).

```yaml
config:
  recipientType: creator
  channels: [in_app]
  messageTemplate: O pedido foi revisto. Consulte a decisão e os comentários.
```

## Sub-workflow

config.workflow holds a portable workflow reference (prefix or slug). The import resolves it to targetWorkflowId. Do not fabricate a UUID to make an offline check pass. inputMapping and outputMapping use `{sourceField, targetField}`. inheritEntities is boolean. onChildCancel is proceed, cancel_parent or block. timeoutDays, when used, is an integer from 1 to 365. Check mappings against both workflows' actual fields and verify the target in Provia.

## AI-assigned Standard action

Set type to standard and assignee.type to ai_agent with the actual profile UUID in assignee.id. Put settings in aiWorker: instructions, readableFields, writableFields, requiredArtifacts, mode (safe/power), reviewRequired, confidenceThreshold (0–1), and optional limits. A readable/writable field list contains field keys, not labels. limits can specify timeoutSeconds, maxRetries, maxToolCalls, maxInputTokens and maxOutputTokens within the destination profile's supported bounds.

Each requiredArtifacts entry needs filenamePattern, mime and positive maxBytes; description is optional. Do not emit requiredArtifacts as a mapping or put null/scalars in the list. For a new task, reviewRequired true is a useful starting proposal. Assigning the profile or enabling memory does not install the profile or transport its memory documents.

## Forms and decisions

Form Fill uses type form_fill, but the form must be linked in Provia after import. Supply the form specification in setup.md. For decision branches and rejection/return behavior, use the exact fields in workflow-yaml.md. A human decision is not an automatic value-based gateway.
