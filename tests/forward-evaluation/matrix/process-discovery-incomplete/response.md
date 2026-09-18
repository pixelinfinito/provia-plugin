## Summary

No process inventory, volumes, owners, or source documents were available in this task — the working directory was empty. I couldn't compare *your* actual processes, so I documented what's missing and built a provisional comparison instead, using three placeholder processes (procurement, employee onboarding, IT support requests) purely to demonstrate the method — clearly flagged as illustrative, not your data.

**Provisional take:** among generic process types, one with high case frequency, a single clear owner, and low implementation effort — the "IT support requests" pattern — typically fits a 4-week pilot best, because four weeks needs to produce enough completed cases to actually learn something. A procurement-type process is often higher-impact but usually needs an approval-threshold decision resolved first and has a less certain frequency profile. An onboarding-type process is usually deprioritized for a *first* pilot specifically because low hiring volume may not generate enough cases in four weeks.

Artefacts written to the working directory:
- `pilot-comparison.md` — the full comparison, method, and reasoning
- `provia-project.json` — manifest with 5 open decisions (D1–D5: real process list, volumes, owners, country/language confirmation, pain points)
- `project.html` — offline map (validated with `build-project-map.mjs --check`)
- `setup.md` — generated handover of the same open items

**Next step:** once you supply the actual process names, rough volumes, and owners, re-run `provia-process-discovery` with that data (pointing at this `provia-project.json`) to replace the placeholder comparison with a real one. Example copyable request:

```text
Use provia-process-discovery with the attached provia-project.json. Our real candidate processes are: [names + one-line descriptions]. Approximate volumes: [X cases/month each]. Owners: [names/roles]. Resolve decisions D1–D5 and re-rank the pilot choice for a four-week pilot. Country: Angola; reply in English.
```