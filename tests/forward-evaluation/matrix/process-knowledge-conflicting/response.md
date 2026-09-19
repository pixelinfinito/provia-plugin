I didn't rewrite the procedure to make the skipped-approval workaround the normal process. The skill governing this task has an explicit rule for exactly this case: an incident that bypassed a control gets recorded as an exception to review, not silently promoted into policy — because one urgent case isn't evidence the two-approval control should be removed for everyone, and that call belongs to whoever owns the approval policy, not to this task.

What I wrote to the working directory instead:
- **`provia-project.json`** — manifest with the approved procedure and the incident as sources, and an open decision (`D1`) asking the policy owner whether a bounded, still-governed expedited path should exist for urgent cases.
- **`procedure-conflict-review.md`** — explains why the literal request wasn't carried out, keeps the two-approval requirement unchanged, logs the incident as a flagged exception, and lays out what a legitimate expedited-approval design would need (a precise urgency trigger, at least one approver plus ratification, formal authorization) if the owner decides to go that route.

Both are drafts because the actual procedure text and the incident record weren't supplied — only your description.

Next step: if you want an expedited-but-still-governed urgent path designed and built into the actual workflow, that's a real policy change and belongs in `provia-workflow-change` (it handles changes to a live procedure/workflow with proper impact assessment and manifest tracking), once the approval owner has answered decision `D1`.