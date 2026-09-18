The three required inputs for this task — the policy text, the workflow/manifest, and the incident records — weren't included in the request, and the working directory was empty, so I couldn't fabricate a real matrix. I've produced the honest version of this deliverable instead of inventing content.

**What I found:** None of the three inputs (approved policy, workflow design, incident evidence) was supplied. Rather than invent a policy clause, a workflow action, or incident evidence to fill the gaps — which the plugin's honesty rules explicitly forbid — I recorded the gap itself as the finding.

**Artefacts written to the working directory:**
- `provia-project.json` — manifest with three open decisions (`D1` missing policy, `D2` missing workflow/manifest, `D3` missing incident records), each with a proposed owner; disconnected mode; Angola disclosed only as the provisional default context, not a legal conclusion.
- `controls-evidence-report.md` — the requirement/action/evidence matrix as a template, the three gaps, and an explicit list of what this deliverable does *not* claim (no compliance certification, no assertion about whether controls ran).
- `project.html` and `setup.md` — generated from the manifest via the bundled `build-project-map.mjs` script, validated with `--check` (0 errors, 3 pending items).

**Next step:** the actual policy document, the workflow/manifest, and the three incident records are needed before a real matrix can be built. If the workflow doesn't exist yet, start with `provia-workflow-designer` using the policy text as the source; if it already exists, supply it along with the policy and incidents and re-run:

```text
Use provia-controls-evidence with provia-project.json in this working directory. Policy: <paste text or attach>. Workflow: <paste YAML/manifest or attach>. Incidents: <three records with dates and evidence>. Resolve decisions D1–D3.
```