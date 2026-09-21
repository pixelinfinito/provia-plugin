# Provia Skills 1.2.0 release verification

Evaluated on 21 September 2026 using the repository plugin at version 1.2.0 and Claude Code's configured model (`claude-opus-5[1m]`). All 48 cases loaded their intended skill. Results: 46 passed, 2 inconclusive, no failures, no stale or unfinished cases.

## Method and evidence

The 48-case matrix covers normal, incomplete and conflicting requests for all 16 skills. Run metadata, compact tool logs, final responses, generated artifacts and original grades are preserved under `matrix/<case>/`. Raw transcripts remain ignored. These are synthetic evaluations, not customer project evidence or proof of applied tenant changes.

Commands used:

```sh
node scripts/run-skill-evaluations.mjs --judge
node scripts/run-skill-evaluations.mjs --judge --concurrency 6
node scripts/run-skill-evaluations.mjs --only bootstrap-incomplete --rerun --judge --max-turns 100
```

The initial runner completed three cases before being stopped and resumed at concurrency six; the completed cases were retained. Bootstrap's incomplete-input case hit the default turn limit. Its first attempt is preserved under `attempts/1.2.0/bootstrap-incomplete-turn-limit/`; its completed retry is the current matrix result.

## Grading corrections

The bundled judge truncates its tool log input at 20,000 characters. For six long cases, that omitted successful script calls and caused unsupported failure or inconclusive grades. The completed Bootstrap incomplete-input retry also needed a new grade after its grading process exited with code 1 without returning a result. All seven cases were independently graded again using the complete preserved tool log, response and non-HTML artifacts. Original `judge.json` files and matrix `judgeHistory` remain intact; `judge.complete.json` and `judge.complete.raw.json` hold the new model grades. No execution output or validation result was rewritten.

Regraded cases:

- `automation-designer-incomplete`
- `automation-designer-normal`
- `bootstrap-conflicting`
- `bootstrap-incomplete`
- `bootstrap-normal`
- `form-designer-normal`
- `workflow-package-normal`

The automation-designer incomplete-input regrade retains two minor observations: an artifact called a permission-denied server unavailable, and the tenant read occurred after artifact preparation. Its final response accurately disclosed the denial and disconnected operation. See its full grade for details.

## Inconclusive cases

- `workflow-review-normal`: no workflow, manifest or SOP was supplied to the isolated run, so substantive review could not be evaluated.
- `operations-triage-normal`: no export records were supplied, so evidence-backed operational triage could not be evaluated.

Both runs disclosed the missing inputs and avoided inventing results. These are fixture limitations, not passing coverage of those tasks. Future evaluations should supply concrete input fixtures and remove whole-log truncation from grading.

## Other release checks

- 152 non-browser automated tests passed. The browser scenario was not rerun in this release check; the implementation author reported the full 153-test suite passing before release preparation.
- Generated skills and README matched the catalog (`build-skills --check`).
- The bundled contract matched the source fingerprint (`check-contract`).
- All five example project maps matched the renderer byte for byte.
- English and Portuguese documentation builds, translation checks and all 56 documentation tests passed.
- Documented access emission/planning commands ran successfully, and the emitted workflow passed the bundled validator.

The release remains marketplace-only. The packaging command is used as an internal consistency check; no installation ZIP is published.
