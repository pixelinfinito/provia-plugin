# Contributing

Use issues for reproducible problems and pull requests for proposed changes. Describe the user task, current result, expected result, plugin version, assistant environment and country/language context. Provide synthetic or redacted inputs. Never attach credentials or private organization data.

For skill changes, edit `catalog.json` and run `node scripts/build-skills.mjs`; the `SKILL.md` files, README tables and docs pages are generated and CI rejects a drift. Keep the description specific and its Portuguese and English trigger phrases realistic, preserve the user’s task, link only relevant references, and state what the skill reads from and appends to the project manifest. Add normal, incomplete and contradictory cases to `tests/skill-evaluations.json` with observable expected behaviour, then run them with `node scripts/run-skill-evaluations.mjs --skill <name> --judge`. Do not assert that a skill is evaluated just because a frontmatter check passes; a case counts only with a preserved run against the current version.

For manifest, map or review-gate changes, keep the examples' generated `setup.md` and `project.html` in sync (`build-project-map.mjs --setup` and `--output`) and keep the five examples passing `review-actions.mjs`.

For contract changes, first write a failing behavioral test. Run it, implement the change, and rerun the test suite. Refresh the contract only from the explicit product revision under review. Include a fingerprint comparison and evidence from the actual product validation path. Do not edit the generated engine by hand. Keep third-party notices.

For country guidance, identify terminology and authoritative sources. Include jurisdiction, effective date, current-status checks and the date of verification for legal claims. Do not copy another country’s legislation into the Angola reference. Tax rates and statutory deadlines need a maintained source and applicability analysis.

English skill instructions and pt-AO examples are maintained together. Documentation contributions belong in Provia’s documentation; link the matching documentation change in a source PR. ZIP downloads remain documentation assets. The repository marketplace supports direct installation in Claude and ChatGPT workspace import; do not publish GitHub release binaries.

Maintainers review behavior, compatibility, source licensing and the archive contents before promotion. No automatic release occurs on merge. The initial license is MIT; contributions must be yours to contribute and compatible with it. Third-party components retain their own licenses.
