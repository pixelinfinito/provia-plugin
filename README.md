# Provia Skills

Provia Skills is the toolkit for whoever implements Provia in a customer: it turns the customer's procedures, SOPs, checklists, org charts and exports into what a tenant needs (entity types, groups, workflow drafts, forms, AI profiles, rollout plan) and keeps the process healthy after go-live. The package contains 16 agent skills generated from one catalogue, a project manifest and offline project map that keep every artefact in one graph, an action-brief standard with a review gate, shared product and country references, five business examples, an offline workflow validator derived from Provia's code, and a behavioural evaluation harness.

Angola is the primary country context. Skill instructions are in English; business outputs can use Angolan Portuguese or another language. Country, language, currency and applicable legislation are separate choices.

This is the source and community repository for `pixelinfinito/provia-plugin`. The installable package is named `provia-skills`. Downloads and app installation instructions are distributed through Provia documentation:

- [English documentation](https://docs.provia.ao/guides/provia-skills)
- [Documentação em português](https://docs.provia.ao/pt/guides/provia-skills)
- [Installation guide](https://docs.provia.ao/guides/provia-skills/install)
- [Usage guide](https://docs.provia.ao/guides/provia-skills/using-the-plugin)

The plugin works with procedures, exports and records supplied to the assistant and has no credentials or telemetry. Authorized users configure, import and publish the resulting drafts in Provia. A connected mode through the `provia-implementer` MCP server is specified in [connected mode](references/connected-mode.md); until that server is released in your environment every skill behaves identically without it.

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

The shared catalog is [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json). Its `./` source includes the whole plugin root, preserving all 16 skills, references and validators. Both provider plugin manifests remain in place. Add the repository URL, not the raw JSON file URL, so relative files are available. Marketplace installation follows repository changes; existing versioned documentation ZIPs remain unchanged. This repository marketplace does not imply a listing in either provider's public directory.

## Contents

- [Choose a skill](#choose-a-skill)
- [One project, one map](#one-project-one-map)
- [Executable action briefs](#executable-action-briefs)
- [Groups as data](#groups-as-data)
- [Connected mode](#connected-mode)
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

Each skill lives at `skills/<skill-name>/SKILL.md` and is generated from [catalog.json](catalog.json) by `node scripts/build-skills.mjs`, which also writes the tables below and the documentation pages; edit the catalogue, not the generated files (`--check` verifies they match). Every skill starts by reading the [shared conventions](references/skill-conventions.md), so country and language, disconnected or connected mode, the project manifest, the honesty rules and the final next-step recommendation are stated once. Skill descriptions carry Portuguese and English trigger phrases, so a host that auto-selects skills matches «ajuda-me a organizar as compras» as well as "turn this SOP into a workflow".

Select a skill in your assistant's installed skill interface, or ask for it by its exact name. Skills produce recommendations and artefacts; the shell commands later in this README run the deterministic checks.

<!-- skills:begin -->
### Discover, design and prepare a process

| Skill and source | When to use it | What to provide | Expected output |
| --- | --- | --- | --- |
| [provia-process-discovery](skills/provia-process-discovery/SKILL.md) | Choose a suitable first Provia process from an organization’s repeated work and constraints. «por onde começar com o Provia» | Process inventory, recent cases, pain points, volumes, owners, constraints and baseline measures. | A ranked shortlist, an explained pilot choice, boundaries, owner, success measures, open questions, and the manifest `sources[]` and `decisions[]` for the pilot. |
| [provia-workflow-designer](skills/provia-workflow-designer/SKILL.md) | Turn supplied procedures, SOPs and checklists into a Provia workflow design with classified source steps, executable action briefs, a flow diagram, a YAML skeleton and the manifest entry. «transforma este procedimento num workflow» | Procedure, start/end conditions, roles, approval rules, required evidence, service levels and exceptions; the manifest when one exists. | A source step classification, an action table with owners by group key and evidence, a Mermaid flow, a YAML skeleton with full descriptions, the manifest `workflows[]` entry with proposed `groups[]` and `decisions[]`, and the open decisions to answer before packaging. |
| [provia-information-model](skills/provia-information-model/SKILL.md) | Design complete, usable Provia entity types and field dictionaries, delivered as JSON and a copy-ready HTML catalogue for manual setup. «que campos deve ter o fornecedor» | Business processes across the requested scope, business objects, sample records, reporting questions, forms, existing catalogues and systems of record. | Matching JSON and offline HTML (or the manifest `entityTypes[]` and the map's catalogue tab), with a justification, paste-ready description, verified icon and record Name pattern for each proposed type; a complete, grouped field dictionary and functional coverage review; useful mappings/tags; a disposition of removed or deferred proposals; and a manual-entry review with unresolved setup. |
| [provia-form-designer](skills/provia-form-designer/SKILL.md) | Design intake forms and Form Fill responses with appropriate access and mappings, traced to the workflow action they serve. «cria o formulário de pedido» | Respondents, desired answers, process stage, access constraints, uploads and response policy; the workflow action the form serves. | A form specification with fields, validation, access, mappings, uploads, confirmation and testing steps, plus the manifest `forms[]` entry linked to its workflow action. |
| [provia-workflow-package](skills/provia-workflow-package/SKILL.md) | Generate, explain or repair portable Provia workflow YAML, run the bundled validator and the action review gate, and generate the setup handover from the project manifest. «gera o YAML do workflow» | An agreed design or YAML export, the project manifest, source contract version, known destination references or receipts, and setup constraints. | `workflow.yaml`, the exact structural `validation.json`, the `review-actions` report, `editorial-review.md`, the generated `setup.md` and the updated manifest and map. |
| [provia-workflow-review](skills/provia-workflow-review/SKILL.md) | Review a Provia workflow for ownership, sequencing, evidence, exceptions, executable action briefs and publication readiness. «revê este workflow antes de publicar» | Workflow design or export, the project manifest, intended business outcome, procedure and known dependencies. | A prioritized findings list with evidence, the per-action review gate result, proposed corrections, new `decisions[]` and representative test scenarios. |
| [provia-organization-rollout](skills/provia-organization-rollout/SKILL.md) | Derive the groups design as data from the sources and plan Provia ownership, training and adoption for a team or organization. «define os grupos» | Teams, org chart, administrators, process owners, the sources naming each actor, the manifest workflows, pilot results, existing permissions and rollout constraints. | The `groups[]` design as data with flags and decisions, an ownership coverage check across the workflows, training exercises, rollout milestones and measurable adoption reviews. |

### Automate and extend

| Skill and source | When to use it | What to provide | Expected output |
| --- | --- | --- | --- |
| [provia-automation-designer](skills/provia-automation-designer/SKILL.md) | Specify Provia notifications, waits, triggers, HTTP calls and reusable sub-workflows from actual API documentation. «enviar o pedido aprovado para o ERP» | Target event, system API contract, payload examples, timing, access restrictions and failure handling; the manifest workflow the automation belongs to. | An integration specification with mappings, dependencies, retries, timeouts and exception paths, and the manifest actions and setup notes it needs. |
| [provia-ai-action-designer](skills/provia-ai-action-designer/SKILL.md) | Design reviewable AI-assigned Standard actions and narrowly scoped Provia agent profiles. «a IA resume as propostas» | Task, supplied evidence, expected artefact, available fields, review policy and plan availability; the manifest action the AI will prepare. | Profile instructions, required skills, output contract, review behaviour, evaluation cases and the manifest `aiProfiles[]` entry. |

### Operate, control and improve

| Skill and source | When to use it | What to provide | Expected output |
| --- | --- | --- | --- |
| [provia-operations-triage](skills/provia-operations-triage/SKILL.md) | Analyze supplied incident/action records for overdue, blocked, unassigned or stalled work and name who can act. «que pedidos precisam de atenção hoje» | Authorized record export, observation time, timezone, statuses, ownership and due dates; the manifest for owner keys. | An evidence-backed attention list with reasons, record references, suggested owners and next steps. |
| [provia-process-improvement](skills/provia-process-improvement/SKILL.md) | Analyze supplied Provia reports and exports to propose one measurable process improvement with its measurement plan. «porque é que as compras demoram mais» | Comparable reporting periods, workflow/version scope, raw records, metric definitions and the business question. | Findings, reproducible calculations, limitations and a proposed change with a measurement plan. |
| [provia-controls-evidence](skills/provia-controls-evidence/SKILL.md) | Map supplied organizational requirements to Provia actions and execution evidence, separating legislation, policy and recommendation. «compara o procedimento com estes registos» | Applicable policy or verified legal sources, the workflow design or manifest, incident records and evidence. | A requirement/action/evidence matrix, gaps, source references and follow-up ownership. |
| [provia-process-knowledge](skills/provia-process-knowledge/SKILL.md) | Create or reconcile SOPs, action instructions, runbooks and proposed Agent Memory from supplied Provia designs. «actualiza o procedimento com o workflow aprovado» | Current workflow version or manifest, approved policies, existing guidance and incident lessons. | A sourced procedure or knowledge artefact with owner, scope, version, conflicts and review needs. |
| [provia-workflow-change](skills/provia-workflow-change/SKILL.md) | Plan changes to a Provia workflow with attention to active incidents, data and dependencies, and record the change in the manifest. «alterar os campos obrigatórios com pedidos em curso» | Current and proposed designs, the manifest and receipts, active-incident evidence, affected fields/integrations and the change reason. | A semantic comparison, impact assessment, draft-version plan, test cases, recovery instructions and the manifest update. |

### Implementer entry points

| Skill and source | When to use it | What to provide | Expected output |
| --- | --- | --- | --- |
| [provia-bootstrap](skills/provia-bootstrap/SKILL.md) | Take an implementer from the customer's documents to a reviewable Provia project in one authorized run: manifest, catalogue, groups, workflows, forms, validated packages and the project map. «prepara o projecto Provia a partir destes documentos» | The customer's procedures, SOPs, checklists, org chart and exports; country, language, timezone and currency; the process or processes in scope; explicit authorization to run end to end. | `provia-project.json`, `project.html`, one folder per workflow with `workflow.yaml`, `validation.json`, `editorial-review.md` and generated `setup.md`, the entity catalogue inside the manifest, and the list of open decisions for the customer review. |
| [provia-diagnose](skills/provia-diagnose/SKILL.md) | Run triage and performance improvement together on supplied Provia exports: what needs attention now, where time is lost, and one measurable change with an owner. «diagnostica este processo» | Authorized incident/action exports with observation time and timezone, comparable periods when available, the manifest or workflow design, and the business question. | One diagnosis report: attention list, performance findings with calculations, a proposed measurable change with owner, decisions and data limitations. |
<!-- skills:end -->

The structured catalogue is [catalog.json](catalog.json). Each entry carries the procedure, references, trigger phrases, manifest reads/appends, example prompts, guidance for incomplete or conflicting information and the Portuguese documentation text.

## One project, one map

Every skill reads and appends one manifest, `provia-project.json` (schema `provia-project/v1`), so entity types, groups, workflow actions, forms, AI profiles, sources and open decisions are one graph rather than a folder of unrelated files. Actions carry `sourceRefs` to the SOP section they implement, `assigneeRef` as a group key (never an invented UUID), `formRef`, `entityRefs`, `evidence`, `due` and the source steps folded into them. Read the [project manifest reference](references/project-manifest.md) for the shape, the rules the checker enforces and what each skill appends.

```sh
node scripts/build-project-map.mjs provia-project.json --check
node scripts/build-project-map.mjs provia-project.json --output project.html
node scripts/build-project-map.mjs provia-project.json --setup setup.md
node scripts/resolve-workflow-refs.mjs provia-project.json compras workflow.yaml --output workflow.resolved.yaml
```

`--check` validates every reference and compares each workflow file next to the manifest with its actions. `--output` renders an offline `project.html`: a left rail of sources, entity types, groups, workflows and forms; a centre graph with edges SOP section → action → group / form / entity type and workflow → sub-workflow; a right panel with the selected node, including the action's full brief from the YAML; an entity catalogue tab; and a pending-items tab. Unresolved references are red and receipts are green. `--setup` generates the handover from what is still unresolved, so `setup.md` shrinks as receipts arrive instead of growing with every skill. `resolve-workflow-refs` substitutes real ids from receipts into a copy of the YAML and never invents one. Try it on [examples/procurement/](examples/procurement/), which ships the manifest, the rendered map and the generated handover.

## Executable action briefs

Provia gives an action one instruction field, `description`, and that is the whole brief the assignee gets. The [action-writing guide](references/action-writing.md) now requires a five-part description written to the assignee: `Tarefa` (what to produce or decide), `Como` (numbered steps naming the system, document or person), `Evidência` (what to attach or fill, and where), `Concluído quando` (the observable condition) and `Excepções` (what to do when it cannot be completed as described). Source steps that are hand-offs or sub-steps are folded into `Como`, never emitted as their own action; implementer notes go to the manifest and `setup.md`, never into a description; `due` is proposed from the stated service level or recorded as an open decision.

```sh
node scripts/review-actions.mjs workflow.yaml            # JSON report, exit 1 when a brief is incomplete
node scripts/review-actions.mjs workflow.yaml --markdown # review table for the handover
```

The gate reports, per action, the missing parts, leaked implementer notes (`setup.md`, «pendente de configuração», UUIDs, placeholders), descriptions over 5000 characters and unset `due`. It checks presence, not quality; `provia-workflow-review` still reads every brief. The five bundled examples pass the gate; the preserved 1.0.2 trial fixture does not, and its [rewrite](tests/forward-evaluation/action-writing-1.0.2/workflow-rewritten-1.1.yaml) shows the difference. Names still follow the same guide: a Portuguese infinitive or English base-form verb names the work, and a form title remains separate from its Form Fill task name. See the [acceptance cases](tests/action-writing-evaluations.md).

## Groups as data

`provia-organization-rollout` turns every actor named in the sources («chefia», «Finanças», «DG») into a `groups[]` entry with key, localized name, one level of parent, purpose, members by role or supplied email, the sections that justify it and flags: `single_person`, `alias`, `segregation`, `requester`, `external`, `unnamed`. `provia-workflow-designer` and `provia-workflow-package` reference owners by those keys, the map shows which group owns which actions, and the checker warns about owner-less actions and orphan groups. Read the [groups design reference](references/groups-design.md).

## Connected mode

Provia feature 026 specifies a `provia-implementer` MCP server on the API Gateway through which a signed-in implementer can read the tenant and create draft entity types, groups, workflow drafts and forms. The plugin side of that contract is in [connected mode](references/connected-mode.md): detection by the `org_get_context` tool, read-before-design, `apply` in dependency order with dry-run first, and receipts stored in `receipts[]` of the manifest with a `ref` back to the manifest key. The manifest, the receipt shape and `resolve-workflow-refs.mjs` ship now so that connected mode is a thin layer when the server is available; nothing in this repository connects to Provia today.

## Use the skills together

Every skill ends its final chat response with a recommended next skill, a reason and a request you can copy. The recommendation follows what the workflow still needs and carries the current artifacts forward. If no additional skill is useful, it identifies the next action in Provia or the evidence to collect. See [next-step guidance](references/next-step.md). It is a recommendation; it does not automatically run another skill.

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
| Build the whole project from the customer's documents in one authorized run | `provia-bootstrap`, then workflow review with the customer over `project.html`. |
| Find what to fix in a running process | `provia-diagnose`, then workflow change or process knowledge. |

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

The information-model skill uses [practical entity design](references/entity-design.md) to justify each reusable object and custom field. It checks functional coverage across the requested lifecycle and delivers the full recommended field set, with collection timing separate from completeness. Its matching JSON and offline HTML catalogue includes copy controls, paste-ready descriptions, native record Name conventions and exact icons from the [verified icon snapshot](references/entity-icons.json). It distinguishes creation requirements from later process checks and avoids implying that metadata implements synchronization, composite uniqueness or access controls. [Acceptance cases](tests/information-model-evaluations.md) cover these decisions.

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
| [catalog.json](catalog.json) | Single source for the 16 skills, the README tables and the docs pages. |
| [skills/](skills/) | The 16 generated `SKILL.md` entry points loaded by the assistant. |
| [references/](references/) | Shared conventions, project manifest, connected mode, groups design, design deliverable, action writing, product capabilities, country guidance, YAML shapes and action configuration details. |
| [examples/](examples/) | Five complete projects (manifest, workflow with five-part briefs, generated handover, rendered map) plus a synthetic entity catalogue. |
| [scripts/build-skills.mjs](scripts/build-skills.mjs) | Generates skills, README tables and docs pages from the catalogue; `--check` verifies. |
| [scripts/build-project-map.mjs](scripts/build-project-map.mjs) | Manifest checks, offline project map and generated `setup.md`. |
| [scripts/review-actions.mjs](scripts/review-actions.mjs) | Deterministic gate for five-part action briefs and leaked implementer notes. |
| [scripts/resolve-workflow-refs.mjs](scripts/resolve-workflow-refs.mjs) | Substitutes destination ids from receipts into a copy of the YAML. |
| [scripts/run-skill-evaluations.mjs](scripts/run-skill-evaluations.mjs) | Runs the behavioural matrix through the Claude Code CLI and records results. |
| [scripts/validate-workflow.mjs](scripts/validate-workflow.mjs) | Read-only YAML/workflow ZIP validation command. |
| [scripts/build-entity-catalogue.mjs](scripts/build-entity-catalogue.mjs) | Editorial entity-catalogue checks and offline HTML generation. |
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
| `node scripts/build-entity-catalogue.mjs FILE --check` | After editing an entity catalogue JSON. | Editorial shape, supported icons/types, references and select examples/defaults. Does not certify business completeness or Provia import validity. | Check summary; no output file. |
| `node scripts/build-entity-catalogue.mjs FILE --output catalogue.html` | Before manual entity-type configuration. | Same editorial checks before rendering. | Standalone HTML with copy controls and the matching JSON download. |
| `node scripts/build-project-map.mjs FILE --check` | After any skill appends to the manifest. | Manifest shape, every cross-reference, one-level groups, receipt integrity, and the action ids of each workflow file next to it. | Warnings for owner-less actions, orphan groups and Form Fill actions without a form; errors stop generation. |
| `node scripts/build-project-map.mjs FILE --output project.html` / `--setup setup.md` | Before reviewing with the customer; after every manifest change. | Same checks, then renders the offline map or the handover. | `project.html` or `setup.md` in the project language. |
| `node scripts/review-actions.mjs FILE [--markdown]` | Before handing over a package; during workflow review. | Presence of the five description parts, leaked implementer notes, length limit and `due` per human/AI action. | JSON or a Markdown table; exit 1 when a brief is incomplete. |
| `node scripts/resolve-workflow-refs.mjs MANIFEST KEY FILE --output OUT` | When receipts (connected or manual) exist for groups or workflows. | Manifest integrity, then substitutes ids. | A resolved copy of the YAML plus the list of applied and pending substitutions. |
| `node scripts/build-skills.mjs [--check \| --docs DIR]` | After editing `catalog.json`. | Catalogue completeness and consistency with the generated files. | Regenerated `SKILL.md` files and README tables, or docs pages. |
| `node scripts/check-contract.mjs` | Before relying on the bundled engine or preparing a release. | Engine SHA-256 against the recorded lock file. | A verification message, or a failing process with an error. |
| `node scripts/check-contract.mjs /path/to/processonrails` | When maintainers need to detect source drift. | Engine checksum plus the recorded source-file hashes against the supplied checkout. | A verification message, or an error identifying a mismatch. |
| `npm test` | After changing validator behavior, examples or packaging. | Workflow regressions, all five examples, integrity checks, archive reproducibility, archive contents and execution after extraction. | Test results and temporary test artifacts that the tests clean up. |
| `node scripts/run-skill-evaluations.mjs [--judge]` | Before a release; after a skill change. | Runs the 48-case matrix through `claude -p` with this repository as the plugin, preserves outputs, optionally grades each run. | `tests/forward-evaluation/matrix/<id>/` and statuses in `tests/skill-evaluations.json`. |
| `python3 scripts/build-release.py` | When preparing a documentation download. | Manifest names/versions, engine checksum, 16-skill count, catalogue consistency, the evaluation gate, symlinks and output-directory safety before packaging. | A ZIP, `SHA256SUMS` and `release.json` under `dist/` by default. |

Workflow validation and contract integrity are separate commands. A checksum match proves consistency with the lock file, not that the installed Provia server uses that revision. The release builder performs package checks; it does not replace `npm test` or a review of skill behavior.

### Requirements

| Task | Requirements |
| --- | --- |
| Read or use skill instructions | A compatible assistant environment with access to the complete package. Follow the documentation installation guide. |
| Validate YAML, check contract integrity or generate catalogue HTML | Node.js 20.11 or later. No npm dependency installation or network access is required. |
| Build a release archive | Python 3 with its standard library. |
| Run `npm test` | Node.js 20.11 or later, npm, Python 3 available as `python3`, and the `unzip` command. |
| Rebuild the contract engine | Node.js, Git, and an authorized Provia checkout with its pnpm dependencies installed, including esbuild and TypeScript. |

If Claude Code is installed, its own manifest validator provides an additional check:

```sh
claude plugin validate .
```

That command belongs to Claude Code, not to this repository. It validates the plugin manifest; it does not establish workflow validity or quality of skill outputs.

## Entity catalogue JSON and manual setup HTML

Entity and workflow metadata now support 19 types, including `auto_number`. Dependent choices use `select` or `multi_select` with `config.parentField` and option `parentValue`. Read [metadata field rules](references/metadata-fields.md) for constraints, counter lifecycle, forms and migrations. The [workflow example](examples/metadata-fields.yaml) and entity catalogue demonstrate both features.

For catalogue creation or revision, `provia-information-model` delivers both `catalogue.json` and `catalogue.html`. Core fields can remain optional at creation when collected later. External sources do not replace operational attributes needed inside Provia.

```bash
node scripts/build-entity-catalogue.mjs catalogue.json --check
node scripts/build-entity-catalogue.mjs catalogue.json --output catalogue.html
# Try the synthetic example:
node scripts/build-entity-catalogue.mjs examples/entity-catalogue.json --output example.html
```

Open the HTML locally. Search types/fields, copy configuration values and option labels/values, and download the matching JSON. Clipboard fallback selects the text for keyboard copying when needed. The script runs offline with Node.js 20.11+. Its checks cover the editorial format, identifiers, field types, relationships, automatic-number configuration and dependent selections; they do not certify business completeness or destination configuration. This JSON is not a Provia import contract. See [catalogue format and checks](references/entity-catalogue-format.md).


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

Every example directory is a small project: `provia-project.json` (sources, groups with flags, the workflow entry with `assigneeRef`, `sourceRefs`, `evidence`, `due` and folded steps, open decisions), `workflow.yaml` with a five-part brief and a proposed `due` on every action, `setup.md` generated from the manifest, and `project.html` rendered from it. The procurement project also carries a `Fornecedor` entity type in the catalogue tab.

| Example | Location | What to adapt |
| --- | --- | --- |
| Purchasing | [examples/procurement/](examples/procurement/) | Requester, approving manager, Finance, quotation policy and supplier information. |
| Employee onboarding | [examples/employee-onboarding/](examples/employee-onboarding/) | HR requirements, responsible teams, access and necessary employee data. |
| IT service requests | [examples/it-service/](examples/it-service/) | Support ownership, urgency, resolution evidence and confirmation. |
| Procedure control | [examples/procedure-control/](examples/procedure-control/) | Controlled document, reviewer, approval and revision evidence. |
| Corrective action | [examples/corrective-action/](examples/corrective-action/) | Finding, cause analysis, correction and effectiveness review. |

These are synthetic training drafts for Angola. The YAML still assigns every action to the incident creator so a learner can exercise the draft without invented organization IDs; the intended owners are the group keys in each manifest, and the generated `setup.md` lists the substitution. Service levels, approval limits and the segregation flags are illustrative, not legal thresholds or approved policy.

| Reference | Read it when you need to… |
| --- | --- |
| [Provia capabilities](references/provia-capabilities.md) | Check which behavior the pinned product baseline supports. |
| [Country context](references/country-context.md) | Separate jurisdiction, language, currency and organization policy. |
| [Angola](references/countries/angola.md) | Apply Angolan terminology and identify primary-source directories. |
| [Workflow YAML](references/workflow-yaml.md) | Generate portable shapes and identify excluded configuration. |
| [Action configurations](references/action-configs.md) | Specify HTTP requests, waits, notifications, sub-workflows and AI settings. |
| [Shared conventions](references/skill-conventions.md) | Know what every skill assumes before its own procedure. |
| [Project manifest](references/project-manifest.md) | Read or append `provia-project.json` and generate the map and handover. |
| [Action writing](references/action-writing.md) | Name actions and write the five-part brief; run the review gate. |
| [Workflow design deliverable](references/workflow-design-output.md) | Classify source steps and deliver the table, flow, YAML skeleton and manifest entry. |
| [Groups design](references/groups-design.md) | Turn actors into groups with flags and decisions. |
| [Connected mode](references/connected-mode.md) | Detect the `provia-implementer` server and apply in dependency order. |

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

The [validator tests](tests/validator.test.mjs) check accepted and rejected workflows and dependency reporting. The [manifest tests](tests/project-manifest.test.mjs) check every example manifest, the generated handover and map, reference integrity, receipts, the resolver and the YAML emitter. The [review-gate tests](tests/review-actions.test.mjs) check the five parts in both languages and the leak patterns. The [generator tests](tests/build-skills.test.mjs) check that skills, README tables, docs pages and the evaluation matrix match the catalogue. The [release tests](tests/release.test.mjs) validate all five examples, compare archives built twice, inspect their contents, run the validator, map, gate and generator after extraction, exercise the evaluation gate and reject output paths that overlap source directories.

The [CI workflow](.github/workflows/checks.yml) runs the generator check, tests, contract integrity verification, the evaluation status and a packaging build with the evaluation gate bypassed. It does not publish ZIP assets.

Skill behaviour needs separate evaluation. The [48-case matrix](tests/skill-evaluations.json) defines normal, incomplete and conflicting scenarios for each of the 16 skills. `node scripts/run-skill-evaluations.mjs` runs the cases through the Claude Code CLI with this repository loaded as the plugin, in a temporary folder per case, and preserves the response, the tool log and every file the run wrote under `tests/forward-evaluation/matrix/<id>/` (the raw transcript stays local and out of the ZIP); `--judge` grades each run against the expected behaviour and the shared rules with a second model call and records `passed`, `failed` or `unclear`. The status in the matrix file is the record: a case is only as run as its `run.pluginVersion` says, and a `failed` case needs a `triage` note. Use `--only`, `--skill`, `--model`, `--judge-model`, `--concurrency` and `--rerun` to scope a run; `--status` prints the summary. Running a full matrix costs real model usage; run it before a release, not on every commit.

Earlier independent trials and their actual outputs are preserved in [tests/forward-evaluation/](tests/forward-evaluation/). Read the [evaluation report](tests/forward-evaluation/README.md) for observed behaviour, a detected assignment-reporting gap and its correction, and the 1.0.2 fixture rewritten to the 1.1 brief standard. Historical before/after outputs are intentionally retained.

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

Run the generator check, tests, integrity verification and the evaluation matrix before building:

```sh
node scripts/build-skills.mjs --check
npm test
node scripts/check-contract.mjs
node scripts/run-skill-evaluations.mjs --judge
python3 scripts/build-release.py
```

The builder refuses to package while any matrix case has not been run against the current `package.json` version or a failed case has no `triage` note; `--allow-stale-evaluations` bypasses the gate for a packaging check and records `evaluationGate: bypassed` in `release.json`, which also carries the pass/fail counts.

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

For a new release, update `package.json`, both plugin manifests, the `provia-skills <version>` header of the bundled examples and [CHANGELOG.md](CHANGELOG.md), regenerate the skills and docs pages from the catalogue (`node scripts/build-skills.mjs` and `--docs <docs root>`), and run the matrix. Validate the package, then promote the reviewed ZIP, checksum and release metadata together to a new versioned path in the Provia documentation project. Update the English and pt-AO documentation links and verify the served download.

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
| `build-skills.mjs --check` reports a difference | Edit `catalog.json`, run `node scripts/build-skills.mjs`, and commit the generated files together. |
| `build-project-map.mjs --check` reports an unknown key | Add the group, form, entity type or source the action references to the manifest, or fix the key; never invent an id. |
| `review-actions.mjs` exits 1 | Add the missing parts to the description and move implementer notes to `setup.md`; the labels must start a line. |
| The release builder stops at the evaluation gate | Run `node scripts/run-skill-evaluations.mjs --judge`, add a `triage` note to failed cases, or pass `--allow-stale-evaluations` for a packaging check only. |
| A matrix run cannot write files | Claude Code blocks writes inside a loaded plugin directory; the harness runs each case in a temporary folder and copies results back. |
| A local pass is followed by an import failure | Compare product revisions, destination references, permissions and server warnings. |

For an issue report, include the plugin version, contract revision, relevant skill or command, expected result and a minimal redacted reproducer. Do not include credentials, personal records or customer documents in public issues.

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution and release expectations. Use [GitHub issues](https://github.com/pixelinfinito/provia-plugin/issues) for reproducible plugin problems and proposals. Country-specific contributions should identify jurisdiction, primary sources and the verification date.

This project uses the [MIT license](LICENSE). Bundled dependencies retain their notices in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
