Done. Four artefacts are in the working directory: `change-plan.md`, `provia-project.json`, `setup.md`, `project.html`.

## What the request asked for vs. what Provia does

The two halves of the request conflict with the product, and the plan says so rather than working around it:

- **"Import the previous YAML to restore version history" is not achievable.** A YAML import creates a *new draft lineage* — a second workflow at version 1 with a new auto-number counter, no forms, no Form Fill links, creator-only access, and no relation to the six open cases. History, timestamps and version numbers are not carried by YAML. There is also no one-click rollback.
- **"Revert required fields" is achievable as a roll-forward:** create a new draft *version of the live workflow* (not from the file), change only the `required` flags to match the previous YAML, test, publish as version N+1. Lineage and numbering continue; the previous YAML is the source document, not something to import.

## Impact on the six open cases — pending

Their records were unavailable, so the impact check is explicitly **not done**. The risk depends on direction: required→optional is low risk; optional→required can make an open case with an empty field fail validation at its next save or action completion, because metadata validation still consults workflow-level configuration. Decision D4 asks for the incident export; D5 asks how each case is handled (finish as-is / fill before publication / cancel and recreate as last resort). Publication should wait until every case is in one of the first two buckets.

## What was verified and what wasn't

- Verified: manifest passes `build-project-map.mjs --check` (0 errors, 0 warnings, 8 pending items); product rules cited from the plugin references.
- Not run: the semantic comparison (no YAML files supplied), the validator (no workflow file to validate), all nine test cases, and the connected reads — the host offers `org_get_context` but the call was not authorized in this session, so I worked in disconnected mode and recorded that.
- Assumptions: Angola as provisional country context; "revert" means restoring the previous version's required flags on the live workflow; workflow name is a placeholder (`target-workflow`) until D1 is answered.

Open decisions D1–D7 are in the manifest with owners; D2 (accept roll-forward instead of restored history), D3 (both YAML files) and D4/D5 (the six cases) block publication.

**Recommended next step:** no further skill until the evidence exists. Supply the previous YAML, the live export and the six-incident export, then rerun this skill to complete the comparison and the impact check:

```text
Use provia-workflow-change with provia-project.json and change-plan.md in this directory. Here are workflow.previous.yaml, workflow.current.yaml (live export) and the export of the six open incidents. Complete the field-by-field comparison, classify each open case under decision D5, and update the manifest. Country: Angola (confirm); reply in English.
```

If the exports come from a running process and the question broadens to what else to fix, `provia-diagnose` is the alternative.