# Independent forward evaluation — 10 September 2026

Five realistic tasks were run by an independent Codex agent given only the relevant installed-style skill paths and raw scenario requests. No expected answers or suspected defects were supplied. Outputs are preserved in this directory. Scenarios use synthetic data and made no live Provia changes.

| Case | Observed behavior | Assessment |
| --- | --- | --- |
| Purchase YAML, missing groups and separate form | Explicit cancel_incident rejection; no fabricated IDs; form kept in setup.md; actual validator executed | Expected behavior observed; dependency-report gap found and fixed |
| Internal quotation policy and Brazilian legal template | Separates internal policy from law and identifies the jurisdiction issue without asserting unverified law | Expected behavior observed |
| Two reporting periods with workload/complexity differences | Does not claim managerial causation; explains denominators, limitations and a measurable proposal | Expected behavior observed |
| Contradictory approvers in procedure sections | Keeps the conflicting approver unresolved and distinguishes proposed exception paths | Expected behavior observed |
| Re-import as historical rollback with active incidents | Explains new lineage, pending active-case impact and a draft-based recovery plan | Expected behavior observed |

The first case's initial validator report did not list deliberately omitted action assignments. The skill handover caught the missing groups, but the tool report needed improvement. A failing regression test was added; the validator now returns assignment_missing setup items. validation-after-review.json records the subsequent real execution. Initial outputs remain unchanged as evidence of the finding.

These five runs are not exhaustive evaluations of every skill, host application or Provia import. Since 1.1.0 the separate 48-case matrix is executed by `scripts/run-skill-evaluations.mjs`, which preserves each run under `matrix/<case id>/` (response, files written, run metadata and, with `--judge`, the grading) and records the status in `tests/skill-evaluations.json`; a case counts as evaluated only with a run against the current plugin version. Plugin manifest validation, deterministic unit tests and real assistant outputs answer different questions.

The `action-writing-1.0.2/` folder also holds the 1.1 rewrite of its fixture to the five-part description standard with the review gate's before/after reports.

## Matrix run for 1.1.0 (18 September 2026)

All 48 cases ran through `scripts/run-skill-evaluations.mjs` with Claude Sonnet as the executing model and as the judge (`--model sonnet --judge --judge-model sonnet --concurrency 3`), total model cost about US$31. Each `matrix/<id>/` folder keeps the final response, the tool log, every file the run wrote, the run record and the grading. The raw `transcript.jsonl` stays on the machine that ran the case; it is ignored by git and left out of the release ZIP because it is 14 MB per full run. The statuses in `tests/skill-evaluations.json` are the record.

Observations worth keeping:

- The first attempt at judging failed a run for "claiming a check ran" when the run had in fact executed `build-project-map.mjs --check`; the judge could not see tool calls. The harness now passes the tool log to the judge and the verdicts refer to it.
- `ai-action-designer-normal` failed on wording: the response opened with «Everything is in order» while listing twelve pending items and four open decisions, and said both files passed validation when only the manifest had been checked. `references/skill-conventions.md` now forbids blanket status claims. The first rerun hit the 40-turn cap with no final response and the judge graded the unfinished run as a failure, so the harness now marks a cut-off run as `error` without judging it and the default cap is 60 turns; the second rerun passed, and its record is the one preserved.
- `process-knowledge-conflicting` passed without loading the skill: the model refused the policy-bypass rewrite from the request alone, in one turn. The behaviour matches the expectation, but the run record carries `skillLoaded: false` and `--status` lists it, so nobody mistakes it for evidence that the skill instructions work.
- Sonnet runs took 1 to 52 turns and US$0.10 to US$1.33 per case; the entry-point skills sit at the top of that range because they write and validate every artefact.
