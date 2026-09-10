# Provia Skills

Provia Skills helps organizations turn procedures into workflow designs, prepare importable Provia YAML, and review how their processes operate. The package contains 14 agent skills, shared product and country references, five business examples, and an offline workflow validator derived from Provia's code.

Angola is the primary country context. Skill instructions are in English; business outputs can use Angolan Portuguese or another language. Country, language, currency and applicable legislation are separate choices.

This is the source and community repository for `pixelinfinito/provia-plugin`. The installable package is named `provia-skills`. Downloads and app installation instructions are distributed through Provia documentation:

- [English documentation](https://docs.provia.ao/guides/provia-skills)
- [Documentação em português](https://docs.provia.ao/pt/guides/provia-skills)
- [Installation guide](https://docs.provia.ao/guides/provia-skills/install)
- [Usage guide](https://docs.provia.ao/guides/provia-skills/using-the-plugin)

The plugin works with procedures, exports and records supplied to the assistant. It has no Provia connector, credentials or telemetry. Authorized users configure, import and publish the resulting drafts in Provia.

## Install from the repository marketplace

Marketplace: `provia`. Plugin: `provia-skills`. Repository URL:

```text
https://github.com/pixelinfinito/provia-plugin
```

### Claude app

Open **Customize → Plugins → Personal plugins → + → Add marketplace → Add from a repository**. Enter the repository URL, then install **provia-skills** from **provia**. Start a new conversation and use `/` or `+` to select a skill. Availability depends on your plan and workspace policy. See [Claude's installation guide](https://support.claude.com/en/articles/13837440-use-plugins-in-claude).

In Claude Code:

```text
/plugin marketplace add pixelinfinito/provia-plugin
/plugin install provia-skills@provia
/provia-skills:provia-process-discovery
```

Follow any reload instruction after installation. To refresh the catalog, run `/plugin marketplace update provia`, then update the installed plugin through `/plugin`.

### ChatGPT workspace

A workspace administrator opens **Admin → Plugins → Add → Import marketplace**. Set **Source** to the repository URL, leave **Path** empty, and select `main` as the branch. Import, authorize GitHub access when prompted, and review the import result. Make **provia-skills** available to the intended roles. Members can then install it from their workspace plugin catalog and start a new conversation.

ChatGPT supports the repository's Claude-compatible marketplace manifest. Admins control availability and can use **Sync now** to fetch updates. If your account has no marketplace import option, use the documentation ZIP and the supported local installation route. Attaching a ZIP to a chat does not install it. See [OpenAI's workspace import guide](https://learn.chatgpt.com/docs/enterprise/plugin-management).

The shared catalog is [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json). Its `./` source includes the whole plugin root, preserving all 14 skills, references and validators. Both provider plugin manifests remain in place. Add the repository URL, not the raw JSON file URL, so relative files are available. Marketplace installation follows repository changes; existing versioned documentation ZIPs remain unchanged. This repository marketplace does not imply a listing in either provider's public directory.

## Contents

- [Choose a skill](#choose-a-skill)
- [Use the skills together](#use-the-skills-together)
- [Country and organization context](#country-and-organization-context)
- [Repository map](#repository-map)
- [Validators and checks](#validators-and-checks)
- [Validate a workflow](#validate-a-workflow)
- [Read the validation result](#read-the-validation-result)
- [Examples and shared references](#examples-and-shared-references)
- [Run tests and evaluate skill behavior](#run-tests-and-evaluate-skill-behavior)
- [Refresh the Provia contract](#refresh-the-provia-contract)
- [Build a documentation download](#build-a-documentation-download)
- [Troubleshooting](#troubleshooting)
- [Contribute](#contribute)

## Choose a skill

Each skill lives at `skills/<skill-name>/SKILL.md`. Select it in your assistant's installed skill interface, or ask for it by its exact name. Skills produce recommendations and artifacts; the shell commands later in this README run the deterministic checks.

### Discover, design and prepare a process

| Skill and source | When to use it | What to provide | Expected output |
| --- | --- | --- | --- |
| [provia-process-discovery](skills/provia-process-discovery/SKILL.md) | Choose a first process or prioritize a pilot. | Process inventory, recurring problems, volumes, owners and constraints. | Ranked shortlist, pilot recommendation, scope and success measures. |
| [provia-workflow-designer](skills/provia-workflow-designer/SKILL.md) | Turn a procedure or checklist into a workflow design. | Procedure, approval authority, start/end conditions and exceptions. | Action table, sequence, decision outcomes, assignments and source mapping. |
| [provia-information-model](skills/provia-information-model/SKILL.md) | Decide what belongs in entities, incident metadata, form answers and tags. | Business objects, sample records and reporting needs. | Entity model, field dictionary, mappings and a reason for each collected field. |
| [provia-form-designer](skills/provia-form-designer/SKILL.md) | Design intake forms or collect evidence within an existing incident. | Respondents, access requirements, required answers and uploads. | Form specification with validation, mappings, confirmation and test steps. |
| [provia-workflow-package](skills/provia-workflow-package/SKILL.md) | Generate, explain or repair portable workflow YAML. | Agreed design or export, known destination references and setup constraints. | `workflow.yaml`, the actual `validation.json` when executed, and `setup.md`. |
| [provia-workflow-review](skills/provia-workflow-review/SKILL.md) | Review a draft before publication. | Workflow design or YAML, procedure, intended outcome and dependencies. | Prioritized findings, proposed corrections and representative test scenarios. |
| [provia-organization-rollout](skills/provia-organization-rollout/SKILL.md) | Plan ownership, training and adoption across teams. | Teams, administrators, process owners, pilot results and permissions. | Role/group proposal, training exercises, rollout milestones and adoption measures. |

### Automate, operate and improve

| Skill and source | When to use it | What to provide | Expected output |
| --- | --- | --- | --- |
| [provia-automation-designer](skills/provia-automation-designer/SKILL.md) | Specify triggers, notifications, waits, HTTP calls or sub-workflows. | Events, actual API documentation, payloads, timing and failure requirements. | Integration design, mappings, secret dependencies, retries, timeouts and exception paths. |
| [provia-ai-action-designer](skills/provia-ai-action-designer/SKILL.md) | Design an AI-assigned Standard action and its profile instructions. | Task, available evidence, expected artifact, field access and review policy. | Profile instructions, output contract, human review behavior and evaluation cases. |
| [provia-operations-triage](skills/provia-operations-triage/SKILL.md) | Identify work needing attention from an incident/action snapshot. | Authorized records, observation time, statuses, owners and due dates. | Evidence-backed attention list with record references and proposed next steps. |
| [provia-process-improvement](skills/provia-process-improvement/SKILL.md) | Investigate delays or compare process performance. | Comparable reporting periods, versions, records and metric definitions. | Reproducible calculations, findings, limitations and a measurable improvement proposal. |
| [provia-controls-evidence](skills/provia-controls-evidence/SKILL.md) | Compare policy requirements with workflow controls and execution evidence. | Approved policy or verified legal sources, workflow and incident evidence. | Requirement/action/evidence matrix, gaps and follow-up ownership. |
| [provia-process-knowledge](skills/provia-process-knowledge/SKILL.md) | Create or reconcile procedures, runbooks, action instructions and proposed Agent Memory. | Approved workflow version, policies, guidance and incident lessons. | Sourced knowledge artifact with scope, version, owner and unresolved conflicts. |
| [provia-workflow-change](skills/provia-workflow-change/SKILL.md) | Plan changes to an existing workflow, including effects on active incidents. | Current/proposed designs, active-case evidence and affected dependencies. | Behavioral comparison, impact assessment, draft-version plan, tests and recovery instructions. |

The structured catalogue is available in [catalog.json](catalog.json). Each entry includes example prompts, inputs, outputs and guidance for incomplete or conflicting information.

## Use the skills together

Choose the sequence that matches the result you need. Carry approved artifacts from one step to the next.

| Goal | Suggested sequence |
| --- | --- |
| Choose a first pilot | Process discovery, workflow design, then organization rollout. |
| Convert a procedure into an importable draft | Workflow design, information model and forms, package generation, then workflow review. |
| Connect a process to an ERP | Automation design, package generation, then review of integration and failure paths. |
| Add AI-assisted preparation | AI action design, workflow design, then review of output and approval responsibilities. |
| Investigate delayed work | Operations triage, then process improvement using comparable records. |
| Prepare control evidence | Controls and evidence review, then process knowledge updates. |
| Change an active process | Workflow change planning, package generation where needed, then workflow review. |

For example, start with a business design request:

```text
Use provia-workflow-designer.
Our company operates in Angola. Reply in pt-AO.
The requester records a purchase need, the department manager approves
or rejects it, and Finance confirms the budget before ordering.
Rejection must end the request. Return the actions, responsibilities,
evidence requirements and unresolved policy decisions.
Do not invent approval thresholds or organization IDs.
```

Once the design is agreed, request the package:

```text
Use provia-workflow-package with the approved design above.
Generate workflow.yaml, run the bundled validator and save its actual
output as validation.json. Put missing group assignments, forms and
other configuration in setup.md. If the validator cannot run, say so.
```

A Portuguese request can use the same skill names:

```text
Use provia-controls-evidence. País: Angola. Responda em pt-AO.
Compare o procedimento de compras aprovado com os registos fornecidos.
Indique as evidências em falta e separe política interna, legislação
verificada e recomendações.
```

The external skills do not install AI profiles inside Provia. Use `provia-ai-action-designer` to prepare the specification, then configure and test the profile in the organization.

## Country and organization context

Supply the country, output language, sector, process owner and applicable policy version. For an Angolan process, a useful starting brief is:

```text
Country: Angola
Output language: Portuguese, pt-AO
Currency: AOA
Timezone: Africa/Luanda
Process owner: Purchasing manager
Policy: Approved purchasing procedure, with its version and effective date
```

Skills use local business terms and keep YAML keys and enums unchanged. For example, an amount may display as `250.000,00 Kz`, while the numeric YAML value is `250000` with currency `AOA`.

Legal requirements need applicable, current primary sources. Portuguese output does not make Brazilian or Portuguese legislation applicable to Angola. Skills distinguish legislation, organization policy and recommendations. The included product baseline skips weekends for workday offsets; it does not automatically calculate Angolan public holidays.

Read [country context](references/country-context.md) and [Angola guidance](references/countries/angola.md) for the full approach and source directories.

## Repository map

| Location | Purpose |
| --- | --- |
| [skills/](skills/) | The 14 `SKILL.md` entry points loaded by the assistant. |
| [references/](references/) | Product capabilities, country guidance, YAML shapes and action configuration details. |
| [examples/](examples/) | Five complete workflow examples, each with a setup handover. |
| [scripts/validate-workflow.mjs](scripts/validate-workflow.mjs) | Read-only YAML/workflow ZIP validation command. |
| [scripts/check-contract.mjs](scripts/check-contract.mjs) | Bundled-engine checksum and optional source-fingerprint verification. |
| [scripts/build-contract.mjs](scripts/build-contract.mjs) | Maintainer tool to regenerate the engine from an authorized Provia checkout. |
| [scripts/build-release.py](scripts/build-release.py) | Package checks and reproducible documentation ZIP generation. |
| [contracts/workflow-v1/](contracts/workflow-v1/) | Bundled engine and `contract-lock.json` with source revision, hashes and library versions. |
| [tests/](tests/) | Automated tests, a behavioral evaluation matrix and preserved trial outputs. |
| [.claude-plugin/plugin.json](.claude-plugin/plugin.json) | Claude plugin manifest. |
| [.codex-plugin/plugin.json](.codex-plugin/plugin.json) | Codex-compatible plugin manifest and interface metadata. |
| [.github/workflows/checks.yml](.github/workflows/checks.yml) | CI for tests, contract integrity and release construction. |

Keep the package directory intact. Skills reference shared files outside their individual skill folders.

## Validators and checks

Run the commands below from the repository root or the root of the extracted `provia-skills` package.

| Tool | When to run it | What it checks | What it writes |
| --- | --- | --- | --- |
| `node scripts/validate-workflow.mjs FILE` | After generating/editing YAML and before importing it. | YAML parsing, product preview rules, conversion and backend schemas where inputs allow, schedule configuration, size limits and detectable setup dependencies. Accepts YAML or a compatible workflow `.zip`. | JSON to standard output. Does not modify the input or contact Provia. |
| `node scripts/check-contract.mjs` | Before relying on the bundled engine or preparing a release. | Engine SHA-256 against the recorded lock file. | A verification message, or a failing process with an error. |
| `node scripts/check-contract.mjs /path/to/processonrails` | When maintainers need to detect source drift. | Engine checksum plus the recorded source-file hashes against the supplied checkout. | A verification message, or an error identifying a mismatch. |
| `npm test` | After changing validator behavior, examples or packaging. | Workflow regressions, all five examples, integrity checks, archive reproducibility, archive contents and execution after extraction. | Test results and temporary test artifacts that the tests clean up. |
| `python3 scripts/build-release.py` | When preparing a documentation download. | Manifest names/versions, engine checksum, 14-skill count, symlinks and output-directory safety before packaging. | A ZIP, `SHA256SUMS` and `release.json` under `dist/` by default. |

Workflow validation and contract integrity are separate commands. A checksum match proves consistency with the lock file, not that the installed Provia server uses that revision. The release builder performs package checks; it does not replace `npm test` or a review of skill behavior.

### Requirements

| Task | Requirements |
| --- | --- |
| Read or use skill instructions | A compatible assistant environment with access to the complete package. Follow the documentation installation guide. |
| Validate YAML or check contract integrity | Node.js 20.11 or later. No npm dependency installation or network access is required. |
| Build a release archive | Python 3 with its standard library. |
| Run `npm test` | Node.js 20.11 or later, npm, Python 3 available as `python3`, and the `unzip` command. |
| Rebuild the contract engine | Node.js, Git, and an authorized Provia checkout with its pnpm dependencies installed, including esbuild and TypeScript. |

If Claude Code is installed, its own manifest validator provides an additional check:

```sh
claude plugin validate .
```

That command belongs to Claude Code, not to this repository. It validates the plugin manifest; it does not establish workflow validity or quality of skill outputs.

## Validate a workflow

Check the bundled engine and run a complete example:

```sh
node scripts/check-contract.mjs
node scripts/validate-workflow.mjs examples/procurement/workflow.yaml
```

Validate your own file and preserve the report:

```sh
node scripts/validate-workflow.mjs /path/to/workflow.yaml > validation.json
```

The npm shortcut is available for interactive use:

```sh
npm run validate -- examples/procurement/workflow.yaml
```

Use the direct `node` command when redirecting output to a JSON file, so npm's command banner does not become part of the report.

A compatible Provia workflow archive can be checked with the same entry point:

```sh
node scripts/validate-workflow.mjs /path/to/workflows.zip
```

A workflow archive contains `manifest.yaml` and `workflows/*.yaml`. It is different from the plugin installation ZIP, which contains skills and tools. For multiple workflows, the validator returns an array of reports; a single workflow returns one report.

### Validation stages

The validator uses functions bundled from the recorded Provia source revision. It checks the document through parsing, product preview validation and normalization. When placeholders do not prevent conversion, it also checks the converted import request, metadata definitions and applicable backend action schemas. Schedule checks cover cron, timezone and missed-run behavior.

The checks cover mistakes such as quoted booleans, unsupported enum values, invalid due offsets, duplicate local action IDs, malformed AI artifact definitions and incorrectly shaped HTTP headers. The report also identifies detectable dependencies such as missing human assignments, destination references, Form Fill links, secret references and memory setup.

New YAML should use `apiVersion: provia.ao/v1` and `kind: Workflow`. The legacy `provia.io/v1` alias is readable with a migration warning. Consult [the lock file](contracts/workflow-v1/contract-lock.json) for the exact source revision; an unchanged API name does not imply unchanged validation rules.

### Input limits

| Input | Limit |
| --- | --- |
| Workflow YAML | 1 MiB in UTF-8. |
| Converted import request | A separate 1 MiB limit, checked when conversion runs. |
| Compressed workflow archive accepted by the CLI | 21 MiB. |
| Archive extraction | 200 entries, 5 MiB per entry and 20 MiB total expanded data. |
| Workflow import structure | Up to 20 triggers, 100 actions, 10 options per decision and 50 created secrets. |

## Read the validation result

| Field | Meaning |
| --- | --- |
| `valid` | The checks performed found no errors. Warnings and pending setup may still exist. |
| `apiVersion` | The validator's canonical target contract, `provia.ao/v1`. Legacy input is identified through a warning. |
| `contractRevision` | Provia source revision recorded in the bundled lock file. |
| `backendSchemaValidation` | Whether backend schema checks passed, failed, were skipped or remain partial. |
| `destinationValidation` | `not_run`. The local tool has no connection to the destination organization. |
| `readyToPublish` | `false`. Publication readiness requires review in Provia. |
| `errors` | Failed checks with rule locations and, where available, YAML line numbers. |
| `warnings` | Issues to review, including compatibility or portability warnings. |
| `setupRequired` | Detected configuration dependencies. Read `setup.md` as well; the tool cannot infer all business requirements. |

`backendSchemaValidation` can be `passed`, `failed`, `not_run`, `not_run_unresolved_placeholders` or `partial_unresolved_references`. A partial result may occur when a portable child-workflow reference cannot be resolved offline. Resolve references and placeholders in the intended organization before relying on the import.

| Exit code | Meaning |
| --- | --- |
| `0` | No errors in the checks performed. This does not mean ready to publish. |
| `1` | One or more workflow validation checks failed. |
| `2` | Missing file argument, unreadable input, or a file/archive rejected during input loading. |

Input-loading failures return a shorter error object; a missing argument prints usage to standard error. Do not assume every failure has every report field.

### Complete the handover in Provia

The package builder should deliver the YAML, its actual validation report and a setup handover. If execution was unavailable, it must say validation was not run rather than inventing a passing report.

Confirm real users, groups, AI profiles, workflows, entities, secrets and access in the destination. Configure excluded resources separately. Portable YAML does not carry intake forms, Form Fill links, page templates, attachments, tags, memory documents or `assignmentStrategy`. The memory-enabled flag does not contain the memory documents. YAML import also does not restore history or version lineage.

A structurally valid file can still implement the wrong approval policy. Use `provia-workflow-review` to review the design, then check Provia's import preview/server validation and test representative cases before publication.

## Examples and shared references

Every example directory contains `workflow.yaml` and `setup.md`.

| Example | Location | What to adapt |
| --- | --- | --- |
| Purchasing | [examples/procurement/](examples/procurement/) | Requester, approving manager, Finance, quotation policy and supplier information. |
| Employee onboarding | [examples/employee-onboarding/](examples/employee-onboarding/) | HR requirements, responsible teams, access and necessary employee data. |
| IT service requests | [examples/it-service/](examples/it-service/) | Support ownership, urgency, resolution evidence and confirmation. |
| Procedure control | [examples/procedure-control/](examples/procedure-control/) | Controlled document, reviewer, approval and revision evidence. |
| Corrective action | [examples/corrective-action/](examples/corrective-action/) | Finding, cause analysis, correction and effectiveness review. |

These are synthetic training drafts for Angola. They deliberately assign actions to the incident creator so a learner can exercise them without invented organization IDs. Replace those assignments with the actual owners before production. They do not implement segregation of duties or define legal approval thresholds.

| Reference | Read it when you need to… |
| --- | --- |
| [Provia capabilities](references/provia-capabilities.md) | Check which behavior the pinned product baseline supports. |
| [Country context](references/country-context.md) | Separate jurisdiction, language, currency and organization policy. |
| [Angola](references/countries/angola.md) | Apply Angolan terminology and identify primary-source directories. |
| [Workflow YAML](references/workflow-yaml.md) | Generate portable shapes and identify excluded configuration. |
| [Action configurations](references/action-configs.md) | Specify HTTP requests, waits, notifications, sub-workflows and AI settings. |

## Run tests and evaluate skill behavior

Run all automated tests:

```sh
npm test
```

Run a focused set while working on one area:

```sh
node --test tests/validator.test.mjs
node --test tests/release.test.mjs
```

The [validator tests](tests/validator.test.mjs) check accepted and rejected workflows and dependency reporting. The [release tests](tests/release.test.mjs) validate all five examples, compare archives built twice, inspect their contents, run the validator after extraction and reject output paths that overlap source directories.

The [CI workflow](.github/workflows/checks.yml) runs tests, contract integrity verification and release construction. It does not publish ZIP assets.

Skill behavior needs separate evaluation. The [42-case matrix](tests/skill-evaluations.json) defines normal, incomplete and conflicting scenarios across the 14 skills. It is an evaluation backlog, not an automated test runner or a record of 42 passing tests.

Five independent trials and their actual outputs are preserved in [tests/forward-evaluation/](tests/forward-evaluation/). Read the [evaluation report](tests/forward-evaluation/README.md) for observed behavior, a detected assignment-reporting gap and its correction. Historical before/after outputs are intentionally retained.

For a skill change, give an evaluator the skill and a realistic request with the minimum source artifacts. Inspect the output for preservation of approval authority, country context, evidence and honest validation status. Structural checks alone do not establish these behaviors.

## Refresh the Provia contract

This is a maintainer operation. Ordinary workflow generation uses the bundled engine and does not require access to the Provia source repository.

First compare the recorded source fingerprints with an authorized checkout:

```sh
node scripts/check-contract.mjs /path/to/processonrails
```

If the source has changed, inspect the relevant product changes before regenerating the bundle. The Provia checkout must have its build dependencies installed.

```sh
node scripts/build-contract.mjs /path/to/processonrails
node scripts/check-contract.mjs /path/to/processonrails
npm test
```

The equivalent build shortcut is:

```sh
npm run build:contract -- /path/to/processonrails
```

The builder regenerates `contracts/workflow-v1/engine.mjs`, updates `contract-lock.json` and produces `THIRD_PARTY_NOTICES.md`. Review generated legal-comment files if the bundler emits them. The lock records the source revision, source-file fingerprints, engine checksum and bundled library versions.

Review the source changes and generated artifacts, run the relevant tests in the Provia checkout, and exercise affected examples and skills. Do not change only a checksum to conceal an engine mismatch. Public plugin CI verifies the committed bundle; it does not have access to the private Provia checkout or automatically detect upstream changes.

## Build a documentation download

Run tests and integrity verification before building:

```sh
npm test
node scripts/check-contract.mjs
python3 scripts/build-release.py
```

The release builder writes these files under `dist/`, using the version from `package.json`:

```text
dist/
  provia-skills-<version>.zip
  SHA256SUMS
  release.json
```

The ZIP has one `provia-skills/` root containing both manifests, all skills, shared resources, examples, scripts and tests. The builder also includes the README, contribution guide, changelog and license notices. It excludes `.git/`, dependency directories and the default `dist/` directory through its source allowlist.

Choose a separate staging directory with either command:

```sh
python3 scripts/build-release.py --output /path/to/release-staging
npm run release -- --output /path/to/release-staging
```

Use one of those alternatives. Output paths cannot overlap bundled source directories or their ancestors. This prevents earlier build artifacts from entering later archives. Building twice from unchanged inputs produces identical ZIP bytes.

For a new release, update `package.json`, both plugin manifests and [CHANGELOG.md](CHANGELOG.md). Validate the package, then promote the reviewed ZIP, checksum and release metadata together to a new versioned path in the Provia documentation project. Update the English and pt-AO documentation links and verify the served download.

Keep published versioned assets intact. A README or source commit does not update an existing documentation ZIP. GitHub maintains source history, tags, community contributions and the repository marketplace; installation ZIPs are distributed only through documentation. Do not publish binary releases to GitHub or add installation entry points to the Provia application or marketing website. Public directory submission is separate from adding this repository marketplace.

## Troubleshooting

| Problem | Next step |
| --- | --- |
| `node` is unavailable | Use Node.js 20.11 or later. If the assistant cannot execute it, report validation as not run. |
| A skill cannot find a reference or script | Restore the complete package structure and resolve paths from the plugin root. |
| `npm test` cannot find Python or unzip | Make `python3` and `unzip` available on the command path, then rerun the release tests. |
| Backend checks are skipped for placeholders | Resolve them in Provia. Do not insert real secrets into shared YAML just to obtain a local pass. |
| A group or child workflow is unresolved | Check the actual destination organization and keep the setup dependency visible. |
| A rejection label continues execution | Set the intended decision outcome explicitly, such as `cancel_incident`. A label alone does not define cancellation. |
| Contract integrity fails | Review the engine/lock mismatch or source drift before rebuilding from the approved checkout. |
| Release output is rejected | Choose `dist/` or a separate staging folder outside bundled source directories. |
| A local pass is followed by an import failure | Compare product revisions, destination references, permissions and server warnings. |

For an issue report, include the plugin version, contract revision, relevant skill or command, expected result and a minimal redacted reproducer. Do not include credentials, personal records or customer documents in public issues.

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution and release expectations. Use [GitHub issues](https://github.com/pixelinfinito/provia-plugin/issues) for reproducible plugin problems and proposals. Country-specific contributions should identify jurisdiction, primary sources and the verification date.

This project uses the [MIT license](LICENSE). Bundled dependencies retain their notices in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
