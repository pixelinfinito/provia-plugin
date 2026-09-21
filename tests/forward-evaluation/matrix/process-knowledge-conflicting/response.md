I did not rewrite the procedure to make the skip the norm, and I want to be direct about why: the skill's rules (and ordinary control logic) say a workaround from one incident is an exception to review, not a new policy — and removing two approvals is a decision for whoever approved them, not for the person editing the document. What I delivered instead keeps the two-approval procedure as published, records the urgent case as an open exception, and turns your request into a decision with a named owner and two proportionate alternatives.

## Artefacts (in the working directory)

- **`procedure-review.md`** — the knowledge artefact, labelled draft (current approved version unknown). Contains: the exception record for the urgent case (with the blanks only the case record can fill), the change proposal for decision (Option A: urgent path with one pre-approval + mandatory ratification; Option B: logged emergency override with approvals collected afterwards; the requested "remove both approvals" listed as considered and not recommended), draft five-part briefs for both approval Decision actions that preserve both approvals and put the urgent path in `Exceptions:` pending decision, a proposed Agent Memory entry limited to the rule that is already true, and the conflicts table.
- **`provia-project.json`** — new manifest (none existed), disconnected mode, three sources marked as not supplied, decisions **D0–D4** (D2 is the policy conflict). No workflow entry: I have no workflow key, action ids or assignees and won't invent them.
- **`setup.md`**, **`project.html`** — generated from the manifest.

## Checks run

`node scripts/build-project-map.mjs provia-project.json --check`: 0 errors, 0 warnings, 5 pending items (the open decisions). This validates the manifest shape only — not the Markdown, and not any procedure content.

## Assumptions and gaps

- No country supplied → Angola disclosed as provisional; output in English because the request was.
- Provia connector permission was not granted, so nothing was read from a tenant. If the workflow exists there, `workflow_export_yaml` would give the real action ids the briefs need.
- The only confirmed facts are the two sentences in your request. Everything else is marked recommendation or open question.

## What needs to happen before the procedure can change

1. The two approvers ratify or object to the urgent case on the case record (D1) — this closes the evidence gap regardless of the outcome.
2. The policy authority decides D2. If they choose to withdraw the approvals after review, that is their call and I'll write it up; it just isn't something to do on the strength of one case.
3. Supply the procedure and workflow (D0) so the briefs can be attached to real actions.

**Recommended next step:** `provia-workflow-change`, once D2 is resolved — an urgent path is a new workflow version with an added branch or override step, and it must be planned around cases currently open.

```text
Use provia-workflow-change with provia-project.json and procedure-review.md in this directory. Decision D2 has been resolved as [Option A / Option B]; the urgent trigger and ratification period from D3 are [...]. Plan the new workflow version that adds the urgent path to the two approval Decision actions, assess the impact on open cases, and record the change in the manifest. Country: [confirm]; reply in English.
```