# Action-writing trial, 15 September 2026

An independent agent used the updated workflow-package and workflow-review skills on synthetic raw requests. It was given the skills and inputs, without the acceptance rubric or a target answer. The request described GC confirming an already executed payment, a proposed budget change, a DG decision with three outcomes and a receipt form. A second request supplied eight review fragments. No real Pixel workflows or Provia organization were accessed.

Observed results:

- The four generated action names start with appropriate infinitives. GC and DG authority remain in the instructions or assignment handover. The receipt form keeps its noun title separately.
- Review of eight fragments accepts "Propor" and DG as recipient, distinguishes reading payment status from execution, and flags multiple acts/authorities without silently splitting the action. English and AI action names use base-form verbs.
- The agent delivered editorial and structural reports separately. The bundled validator returned `valid: true`, `backendSchemaValidation: passed` and `readyToPublish: false`. Missing assignments and form configuration remain pending.
- A wording-only trial changed four names. The recorded parser comparison passed. The reviewing agent also independently compared complete YAML values with PyYAML, excluding only action names/descriptions; all remaining values were identical.

These are observed semantic trials, not automated proof of all future titles. The synthetic export has no real assignment IDs, linked form or HTTP configuration, so preservation of those populated destination settings is not demonstrated by this fixture. Fragment reviews describe preservation requirements without executing integrations. Proposed sequence and branch consequences are explicitly pending business review in setup.md.

The original generated artifacts are retained here. Their source paths identify the local plugin used during the trial; they are evidence, not installation instructions. The reusable acceptance cases are in ../../action-writing-evaluations.md.

## Rewrite to the 1.1 description standard

`workflow-rewritten-1.1.yaml` is the same fixture rewritten to the five-part description standard (task, method, evidence, done-when, exceptions) introduced in 1.1.0. The original `workflow.yaml` is unchanged as evidence. `review-actions-before.md` is the deterministic gate run on the original: no action has the five parts and two descriptions leak implementer notes («pendentes em setup.md»). `review-actions-after.md` is the gate on the rewrite: all four actions complete, no leaks; `due` stays unset because the request gave no service level, which is an open decision, not a deadline to invent. `workflow-rewritten-1.1-validation.json` is the exact validator output for the rewrite.
