All artefacts are written to the working directory. Here's the summary.

## What I designed

A **schedule trigger** in `workflow.yaml` for a monthly review, using the actual Provia trigger schema I pulled from the bundled engine contract (not guessed):

```yaml
type: schedule
config:
  cronExpression: "0 9 1 * *"      # day 1, 09:00
  timezone: Africa/Luanda
  missedBehavior: catch-up-one
```

**Missed-run policy**: `missedBehavior` only accepts `skip`, `catch-up-one`, or `catch-up-all` (verified against the validator's real enum, not inferred). I chose **catch-up-one**: at monthly cadence, `skip` risks silently dropping an entire month's review, while `catch-up-all` could fire several overdue incidents at once if the schedule was down for multiple periods. One catch-up incident restores the cadence without a backlog.

Ran the bundled validator — `valid: true`, `backendSchemaValidation: passed` (see `validation.json`).

## What's unresolved (context you didn't supply)

Recorded as open decisions in `provia-project.json` / `setup.md`:
- **D1** — exact day/time (I assumed 1st of month, 09:00 — could be last business day, a different hour, etc.)
- **D2** — the review's actual actions (what's reviewed, by whom, what evidence closes it) — out of scope for this task, so `actions: []`
- **D3** — confirm `catch-up-one` matches your actual recovery policy
- **D4** — no owning group identified yet, so no assignee/notification is wired to the trigger

Files written: `workflow.yaml`, `validation.json`, `provia-project.json`, `project.html`, `setup.md`.

Next step recommended: **`provia-workflow-designer`**, to define the actual review steps (D2) — the trigger alone doesn't do anything without them. Copyable request:

```text
Use provia-workflow-designer with provia-project.json (workflow key "revisao-mensal", schedule trigger already specified in workflow.yaml). Design the monthly review's own actions — what is reviewed, by whom, what evidence closes it — resolving decisions D1, D2 and D4. Country: Angola; reply in pt-AO.
```