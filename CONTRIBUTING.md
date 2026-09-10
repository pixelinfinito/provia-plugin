# Contributing

Use issues for reproducible problems and pull requests for proposed changes. Describe the user task, current result, expected result, plugin version, assistant environment and country/language context. Provide synthetic or redacted inputs. Never attach credentials or private organization data.

For skill changes, keep the name and description specific, preserve the user’s task, and link only relevant references. Add normal, incomplete and contradictory examples with observable expected behavior. Do not assert that a skill is evaluated just because a frontmatter check passes.

For contract changes, first write a failing behavioral test. Run it, implement the change, and rerun the test suite. Refresh the contract only from the explicit product revision under review. Include a fingerprint comparison and evidence from the actual product validation path. Do not edit the generated engine by hand. Keep third-party notices.

For country guidance, identify terminology and authoritative sources. Include jurisdiction, effective date, current-status checks and the date of verification for legal claims. Do not copy another country’s legislation into the Angola reference. Tax rates and statutory deadlines need a maintained source and applicability analysis.

English skill instructions and pt-AO examples are maintained together. Documentation contributions belong in Provia’s documentation; link the matching documentation change in a source PR. ZIP downloads remain documentation assets. The repository marketplace supports direct installation in Claude and ChatGPT workspace import; do not publish GitHub release binaries.

Maintainers review behavior, compatibility, source licensing and the archive contents before promotion. No automatic release occurs on merge. The initial license is MIT; contributions must be yours to contribute and compatible with it. Third-party components retain their own licenses.
