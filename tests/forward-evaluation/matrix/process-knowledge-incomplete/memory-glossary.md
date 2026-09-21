# Proposed Agent Memory glossary — DRAFT, pending administrator review

| | |
| --- | --- |
| Status | Proposal. Nothing here is entered in Provia; memory documents are configured in Provia separately after YAML import and are not carried by the YAML. An administrator reviews and approves before entry. |
| Source | Provia product references bundled with `provia-skills/1.2.0` (contract revision `fed8efaf…`) for Part A; **no organization source available** for Part B (decisions D1, D3). |
| Scope | Stable, approved guidance only. Temporary facts about one case stay in that case (incident comments, files, metadata), never in memory. |
| Update owner | Not supplied (decision D4) |

## What belongs in memory and what does not

| Goes into Agent Memory | Stays in the incident |
| --- | --- |
| Definitions the organization has approved | The status of one request |
| Stable roles and who holds which authority | Who is covering for whom this week |
| Approved exception rules | A workaround agreed for one case |
| Naming conventions for records and files | A file attached to one case |

## Part A — Provia product terms (confirmed from product references)

These definitions describe how the pinned Provia contract behaves. They are safe to propose for any organization; the wording can be translated to pt-AO if the organization works in Portuguese.

| Term | Proposed definition |
| --- | --- |
| Workflow | A repeatable process definition. Publishing creates an active version; new cases use the active design. |
| Incident (case) | One execution of a workflow. Use "case" with people unless the business is emergency response. |
| Action | One step of a workflow. Types: Standard, Decision, Sub-workflow, Notification, Wait, HTTP Request, Form Fill. |
| Decision | An action with named outcomes. An outcome continues, cancels the case, triggers another workflow or returns to an earlier action. There is no automatic branching on a value. |
| Action brief | The action's `description`: Task, How, Evidence, Done when, Exceptions — written to the assignee, under 5000 characters. |
| Evidence | The file, field value or comment an action must leave before it counts as done. |
| Assignee | The group, person or AI profile responsible for an action. AI profiles can be assignees on Standard actions only. |
| Group | A team, container or role used for ownership and assignment. One level of sub-groups. |
| Entity | A reusable business record (for example a supplier or an employee) referenced from cases. |
| Metadata | Structured values on a case or entity, in one of the 19 supported field types. |
| Tag | A flexible label on a record; a governed vocabulary uses a select field instead. |
| Page / file / comment | Where explanation and evidence live on a case. |
| Form (intake) | A separately configured form that creates a case. |
| Form Fill | An action that collects answers inside a case. A single response can map values into case metadata; multiple responses stay separate. |
| Due (workdays) | Deadlines counted in workdays skip Saturday and Sunday only; public holidays are not skipped. |
| Access level | Workflow permissions `view` < `create_incident` < `edit` < `admin`, cumulative, one level per grant. `view` shows every case; assignees and creators see their own cases without a grant. |
| Manual-trigger allowlist | Narrows who may start a case below the `create_incident` holders; others are refused. |
| Ask AI | Read-only assistance; it does not complete, decide or notify. |

## Part B — Organization terms (not available)

No procedure, policy or workflow text was supplied, so no organization-specific term can be proposed without inventing it. When the source arrives, fill this table from it and cite the section for each row.

| Term | Definition | Source section | Type |
| --- | --- | --- | --- |
| `[FROM PROCEDURE]` | | | role / abbreviation / threshold / document / rule |

Candidates to look for in the procedure: role abbreviations, document template codes, approval limits and who holds them, service levels, the names of systems the steps touch, and the meaning of each decision outcome label.

## Review needs

1. An administrator confirms Part A matches the deployed Provia version (the plugin's contract is implementation evidence, not proof of the customer's deployment).
2. The process owner supplies the procedure so Part B can be written (D1, D3).
3. The update owner is named (D4) and the glossary is dated against the workflow version it describes (D2).
