I produced four artefacts in the working directory, all explicitly marked as drafts because no actual approved procedure, workflow export, or policy document was supplied to this task:

- **`provia-project.json`** — manifest recording the gap: a placeholder `sources[]` entry for the unsupplied procedure, and four open `decisions[]` (D1: missing procedure/workflow content, D2: missing policy for conflict reconciliation, D3: missing update owner, D4: missing administrator sign-off criteria for memory).
- **`runbook.md`** — a structural runbook template with every field bracketed as `[not supplied]`, so it can't be mistaken for sourced content, plus a five-part-brief table shape ready to fill in once real steps exist.
- **`memory-glossary.md`** — a proposed Agent Memory glossary shell distinguishing stable org-wide terms from case-only facts, with a placeholder row rather than invented terms, and an explicit note that entries need administrator review before activation.
- **`setup.md`** — generated handover listing the four open decisions for the process owner/administrator.

`node scripts/build-project-map.mjs provia-project.json --check` passed (0 warnings, 4 pending items expected).

Nothing here should be treated as a real runbook or glossary — no terms, owners, or steps were invented.

**Recommended next step:** once you have the actual approved procedure (and any governing policy), run `provia-process-knowledge` again — or `provia-workflow-designer` if it hasn't been modeled as a workflow yet — pointing at `provia-project.json` so it resolves D1–D4 and fills in the real steps and glossary terms:

```text
Use provia-process-knowledge with provia-project.json in this directory. The approved procedure is: [paste text or attach workflow.yaml]. Resolve decisions D1–D4 and complete runbook.md and memory-glossary.md from this content.
```