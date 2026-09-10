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

These five runs are not exhaustive evaluations of every skill, host application or Provia import. The separate 42-case matrix is an unexecuted reusable evaluation backlog, not a claim of 42 passing behavioral tests. Manifest validation, deterministic unit tests and real assistant outputs answer different questions.
