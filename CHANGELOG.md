# Changelog

## 1.0.3

All 14 skills now end the final chat response with a contextual next-step recommendation, explaining the next skill and providing a copyable request. Shared guidance covers conditional routing, artifact handover, host-specific invocation and cases where no further skill is needed. Recommendations do not automatically invoke skills or interrupt already authorized end-to-end work. The YAML contract and validators are unchanged.

## 1.0.2

- Shared action-writing guidance for all action types, with Portuguese and English examples and explicit preservation of business meaning, assignments and routing.
- Eight skills apply the convention during design, generation, review, forms, automation, AI, knowledge maintenance and workflow changes.
- Package handover separates semantic editorial review from actual structural validation. Includes semantic acceptance cases.
- Includes the repository marketplace added after 1.0.1. The YAML contract engine, fingerprints and validator are unchanged.

## 1.0.1

Reject release output locations that overlap bundled source directories or their ancestors, preventing previous build artifacts from entering subsequent archives. Added a regression test. Skills and the pinned Provia contract are unchanged.


## 1.0.0

- Fourteen skills for workflow creation, organizational use and process improvement.
- Angola-aware country guidance and Portuguese business examples.
- Offline YAML validation using the pinned Provia contract engine.
- Versioned documentation download with checksums and explicit installation limitations.
- No live Provia connector or application integration.
