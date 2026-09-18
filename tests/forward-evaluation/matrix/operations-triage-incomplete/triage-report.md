# Operational triage — attention list

## Export period and observation time

Not stated. No export file, timestamp, or timezone was supplied with this request, and the working
directory (`/private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-wkQDJt/operations-triage-incomplete/`)
is empty. This report is not a live view of Provia; it is a record of what is missing before one can
be produced.

## What triage needs and what is missing

| Required input | Status |
| --- | --- |
| Authorized incident/action record export (statuses, ownership, due dates) | Missing — no file in the working directory or conversation |
| Observation/export time and timezone | Missing |
| `provia-project.json` (workflows, groups, owner keys) | Missing — no manifest present, none created by this task |

## Confirmed facts

- No incident or action records were supplied, so no blocked action, overdue item, or ownership gap
  can be identified for this run.
- No manifest exists yet in this directory, so there are no owner keys (`assigneeRef`) to resolve
  even if records were supplied.

## Why I'm not answering the question as asked

The request asks which blocked actions are delaying "these incidents," but no incident records were
provided. Answering with specific blocked actions, causes, or named owners would mean inventing
records and ownership that were never supplied — which the skill's honesty rules rule out. Per the
skill's incomplete-input guidance, when due dates or export time are missing the right move is to
flag the gap, not guess which work is overdue or blocked.

## Recommendations

1. Supply the authorized record export (CSV/JSON/table) covering the incidents in question, including
   per-record status, current owner/group, due date, and last-updated timestamp.
2. State the export's observation time and timezone, so overdue/blocked/waiting can be distinguished
   correctly.
3. If a Provia implementation project already exists for this organization, supply its
   `provia-project.json` so owners can be resolved to real groups (`assigneeRef`) instead of raw names.

## Unresolved decisions

- `D1` — question: "Which record export and observation time should ground this triage?" — owner: the
  requester (lisboa@pixel.ao) — status: open — raised by: provia-operations-triage.

No `provia-project.json` exists in this directory, so this decision is recorded here rather than
appended to a manifest; once a manifest is created (e.g., by a later skill), carry this open decision
into it.
