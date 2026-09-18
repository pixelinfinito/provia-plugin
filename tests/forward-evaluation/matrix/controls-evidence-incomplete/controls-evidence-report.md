# Controls and evidence review — status

## Country and mode

No country, sector or organization was named in the request. Per the shared convention, Angola is disclosed here only as a **provisional starting context**, not a legal conclusion; the manifest is set to `disconnected` mode because no `provia-implementer` connection is available. This project record and the review below apply regardless of jurisdiction, but any legal statements would need explicit confirmation before being relied on.

## What was requested vs. what was supplied

The task is to map an *approved policy* to *workflow actions* and to check it against *evidence from three incidents*. That requires three inputs. None was supplied with the request, and the working directory contained no files before this run:

| Required input | Status |
| --- | --- |
| The approved policy (title, version, effective date, jurisdiction, exact clause text) | **Not supplied** |
| The workflow design or `provia-project.json` manifest the policy should be mapped to (action `localId`s, assignees, evidence fields) | **Not supplied** |
| The three incident records and their execution evidence (case ids, dates, receipts, comments, attachments, timestamps) | **Not supplied** |

Per this skill's own guidance for incomplete input, the review is limited to what was supplied — and nothing organization-specific was supplied. Producing a requirement/action/evidence matrix without these means either leaving it empty or inventing content; the honesty rules for this plugin (never invent legal provisions, approval thresholds, or that a check ran when it did not) rule out the second option, so the matrix below is a template rather than a filled review.

## Requirement / action / evidence matrix (template — not populated)

| Policy clause (source, section) | Requirement (legislation / policy / recommendation) | Mapped action (`localId`) | Responsible group (`assigneeRef`) | Required data/document | Evidence of execution | Found in incident? |
| --- | --- | --- | --- | --- | --- | --- |
| *pending — needs policy text* | *pending — needs classification* | *pending — needs workflow/manifest* | *pending* | *pending* | *pending* | *pending — needs 3 incident records* |

Once the real documents are available, each policy clause should be classified first as **legislation**, **company policy**, or **recommendation** (these are distinct and must not be merged), then linked to the action that carries it out, and finally checked against each incident to see whether the designed control actually left evidence — a missing record is a gap to investigate, not proof the step never happened.

## Gaps

1. **G1 — No approved policy text.** Cannot identify jurisdiction, effective date, or the specific clauses that constitute the control requirements. *Owner: Compliance / policy owner.*
2. **G2 — No workflow design or manifest.** Cannot name the `localId`s, assignees or evidence fields the policy would map to. *Owner: Workflow owner / implementer.*
3. **G3 — No incident records.** Cannot check whether any designed control produced evidence in a real case. *Owner: Operations / incident owner.*

These three gaps are recorded as open decisions `D1`–`D3` in `provia-project.json` (see below), each with a proposed owner. They are unresolved dependencies, not findings about the organization's actual compliance — no compliance conclusion is drawn here, positive or negative.

## What this deliverable does not claim

- It does not certify compliance with any law or standard.
- It does not assert that any control was, or was not, executed in any incident.
- It does not invent a policy source, workflow action, retention period or approval threshold to fill the gap.

## Artefacts produced

- `provia-project.json` — project manifest recording the three open decisions (`D1`, `D2`, `D3`) with owners; `sources[]`, `workflows[]`, `groups[]` and `entityTypes[]` left empty because none were supplied.
- `project.html` — offline project map (currently only shows the three pending decisions; will populate once sources, a workflow and groups exist).
- `setup.md` — generated handover listing the same open decisions.
- `controls-evidence-report.md` — this report.

Validated with the plugin's own checker:

```
node scripts/build-project-map.mjs provia-project.json --check
→ Manifest controles-evidencias: 0 workflows, 0 groups, 0 entity types, 0 forms; 3 pending item(s), 0 warning(s).
```
