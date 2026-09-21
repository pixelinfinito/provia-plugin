# Tool calls

1. Skill: provia-skills:provia-bootstrap
   → Launching skill: provia-skills:provia-bootstrap
2. Read: /Users/marcoslisboa/Development/provia-plugin/references/skill-conventions.md
   → 1	# Shared conventions for every Provia skill
     2	
     3	Every `SKILL.md` in this plugin is generated from `catalog.json` and starts by pointing here. These rules apply to all skills; a skill file repeats only what is specific to its task.
     4	
     5	## Country and language
     6	
     7	Country, jurisdiction, response language, currency and timezone are separate choices. Read [country context](country-context.md) before relying on any of them, and the [Angola reference](countries/angola.md) when Angola applies. If no country is supplied, disclose Angola as a provisional starting context. Respect an explicit langu …
3. Bash (error): ls -R /Users/marcoslisboa/Development/provia-plugin/references /Users/marcoslisboa/Development/provia-plugin/scripts /Users/marcoslisboa/Development/provia-plugin/contracts 2>/dev/null | head -100; echo ---; ls -la /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete
   → This Bash command contains multiple operations. The following part requires approval: ls -R /Users/marcoslisboa/Development/provia-plugin/references /Users/marcoslisboa/Development/provia-plugin/scripts /Users/marcoslisboa/Development/provia-plugin/contracts
4. Glob: **/*
   → /Users/marcoslisboa/Development/provia-plugin/references/countries/angola.md
     /Users/marcoslisboa/Development/provia-plugin/references/country-context.md
     /Users/marcoslisboa/Development/provia-plugin/references/entity-icons.json
     /Users/marcoslisboa/Development/provia-plugin/references/entity-design.md
     /Users/marcoslisboa/Development/provia-plugin/references/metadata-fields.md
     /Users/marcoslisboa/Development/provia-plugin/references/action-writing.md
     /Users/marcoslisboa/Development/provia-plugin/references/next-step.md
     /Users/marcoslisboa/Development/provia-plugin/references/entity-catalogue-for …
5. Read: /Users/marcoslisboa/Development/provia-plugin/references/project-manifest.md
   → 1	# Project manifest (`provia-project/v1.1`)
     2	
     3	One implementation project has one manifest, `provia-project.json`. Every skill reads it before starting and appends its result to it, so entity types, groups, workflow actions, forms and decisions are one graph rather than a folder of unrelated files. The map renderer draws that graph; `setup.md` is generated from what the manifest still leaves unresolved; the connected-mode `apply` steps consume it in dependency order.
     4	
     5	This file is a plugin artefact. It is not a Provia import format and it never carries credentials or secret values. Its  …
6. Read: /Users/marcoslisboa/Development/provia-plugin/references/workflow-design-output.md
   → 1	# Workflow design deliverable
     2	
     3	`provia-workflow-designer` returns a design the customer can sign off in one reading and the package skill can turn into YAML without a second interpretation. Five parts, in this order.
     4	
     5	## 1. Source step classification
     6	
     7	Every numbered step, sentence or checklist item in the sources receives one classification, with the reason and the action that owns it. Nothing from the source is dropped without a row.
     8	
     9	| Classification | Meaning | Where it lands |
     10	| --- | --- | --- |
     11	| `action` | An observable unit of work by one owner with evidence | I …
7. Read: /Users/marcoslisboa/Development/provia-plugin/references/groups-design.md
   → 1	# Groups derived from the sources
     2	
     3	Provia assigns work to users or groups, and groups may have one level of sub-groups. `provia-organization-rollout` turns every actor named in the sources into a proposed group **as data** in `groups[]` of the project manifest, so that `workflow-designer` and `workflow-package` can reference owners by key and connected mode can create them with `groups_apply_plan`.
     4	
     5	## For every actor in the sources
     6	
     7	Scan the SOPs, policies, checklists and org charts for who acts: «chefia», «Finanças», «DG», «Compras», «o requerente», «RH». For each one produce:
      …
8. Read: /Users/marcoslisboa/Development/provia-plugin/references/workflow-access.md
   → 1	# Workflow access (`workflows[].access`)
     2	
     3	Who may see and open a workflow is design data, declared in the manifest, reviewed with the customer in the Acesso tab of `project.html`, checked by `--check` and applied either through the `access` section of the portable YAML (browser import) or through `workflow_access_apply` (connected mode). Silence is never an accident: a workflow without an `access` section fails `--check`.
     4	
     5	## What the product does
     6	
     7	- Levels are `view` < `create_incident` < `edit` < `admin`, cumulative, one level per grant; the list is published at `GET /api/v1/pe …
9. Read: /Users/marcoslisboa/Development/provia-plugin/references/connected-mode.md
   → 1	# Connected mode (`provia-implementer` MCP)
     2	
     3	Provia's API Gateway exposes an MCP server, `provia-implementer`, specified in Provia feature 026 and extended by feature 027 (workflow permissions), pinned to the same product revision as this plugin's contract engine. When an implementer signs in through it, the skills can read the destination organization and create **draft** configuration on the implementer's behalf. This reference is the plugin side of that contract. Until the server is released in the implementer's environment, every skill behaves exactly as in disconnected mode; do not  …
10. Read: /Users/marcoslisboa/Development/provia-plugin/references/country-context.md
   → 1	# Country context
     2	
     3	Establish country of operation, applicable jurisdiction, response language, currency, timezone, sector and the organization’s own policy. Do not derive jurisdiction from the language of a document. If no country is supplied, disclose Angola as a provisional starting context. Ask before relying on a jurisdiction for a legal conclusion. An English conversation can still concern Angola; Portuguese can concern another country.
     4	
     5	Use Angolan Portuguese for Portuguese outputs in the Angola context. Prefer utilizador, ficheiro, equipa, registo, ecrã, descarregar and protec …
11. Read: /Users/marcoslisboa/Development/provia-plugin/references/countries/angola.md
   → 1	# Angola
     2	
     3	Use this reference for terminology and source selection, not as a statement of legal compliance. Source directory reviewed on 2026-09-10. Verify each relevant instrument again when using it for a decision.
     4	
     5	## Working context
     6	
     7	Use Portuguese appropriate to Angola unless another language is requested. Examples may use Luanda, AOA/Kz, Africa/Luanda, procurement teams and Recursos Humanos. A NIF may be relevant to a supplier process; collect it only if the process requires it. Do not substitute Brazilian identifiers or institutions.
     8	
     9	Organization approval thresholds, c …
12. Read: /Users/marcoslisboa/Development/provia-plugin/references/provia-capabilities.md
   → 1	# Provia capability baseline
     2	
     3	Baseline: workflow contract revision recorded in contracts/workflow-v1/contract-lock.json. This is implementation evidence, not proof of the version deployed in a customer environment.
     4	
     5	A Workflow defines a repeatable process. An Incident is one execution of a workflow. An Action is one step. Entities hold reusable business records, metadata holds structured case values, tags classify records, and pages/files/comments provide explanation and evidence. Explain “incident” as a process case when the business context is not emergency response.
     6	
     7	Entity an …
13. Read: /Users/marcoslisboa/Development/provia-plugin/references/workflow-yaml.md
   → 1	# Portable workflow YAML
     2	
     3	Emit `apiVersion: provia.ao/v1` and `kind: Workflow`, preceded by a first-line comment `# provia-skills <plugin version>` so an import can be attributed to the plugin (the product records only what its schema knows; the comment is the attribution until `metadata.source` exists). The legacy `provia.io/v1` alias is readable but should not be generated. Allowed top-level sections are metadata, triggers, entities, fields, access and actions. Unknown top-level keys are errors (`schema.unknown_key`); a `permissions:` key never validates. Nested unknown keys are warnin …
14. Read: /Users/marcoslisboa/Development/provia-plugin/references/action-writing.md
   → 1	# Write and review action names and descriptions
     2	
     3	Read the source procedure and the action's purpose, type, instructions and configuration before choosing a verb.
     4	
     5	## Name the work
     6	
     7	Write every action name as a concise instruction describing the work expected. In Portuguese, start with an infinitive verb; in English, start with a base-form action verb. Use a verb, an object and only the qualifier needed to identify the task. Aim for 3–10 words and roughly 80 characters when meaning permits. These are editorial guidelines, not Provia contract limits.
     8	
     9	Do not copy an actor-led  …
15. Read: /Users/marcoslisboa/Development/provia-plugin/references/entity-catalogue-format.md
   → 1	# JSON and HTML catalogue delivery
     2	
     3	Deliver both files for a standalone entity catalogue creation or revision. JSON is the source of truth for this deliverable; generate the HTML from the same JSON after every change. Inside an implementation project, the same type objects live in `entityTypes[]` of `provia-project.json` (see project-manifest.md), `build-project-map.mjs --check` applies these editorial checks to them, and `project.html` renders them in its catalogue tab; a separate `catalogue.html` is then optional. This is an **editorial specification for manual configuration**, not a P …
16. Read: /Users/marcoslisboa/Development/provia-plugin/references/entity-design.md
   → 1	# Practical entity design
     2	
     3	Design complete entity types for people creating, finding and maintaining records in Provia. Completeness is coverage of the requested business uses, not a field-count target. A business information model is not a request to reproduce a relational database or an ERP. This guidance concerns entities; it does not change the portable workflow YAML contract.
     4	
     5	## Decide where the information belongs
     6	
     7	| Need | Starting point |
     8	| --- | --- |
     9	| Stable object selected across cases, or with its own recurring lifecycle processes | Entity, with named consumers  …
17. Read: /Users/marcoslisboa/Development/provia-plugin/references/metadata-fields.md
   → 1	# Entity and workflow metadata fields
     2	
     3	Source: Provia revision `2641364d9c1aa0aa2b76aa788ef521bcb6218118`. The bundled backend field schema and workflow YAML engine use this revision. Read this reference when defining entity fields, workflow case fields, defaults or dependencies. Destination availability still needs verification.
     4	
     5	## Supported types
     6	
     7	| Types | Use and stored shape |
     8	| --- | --- |
     9	| `text`, `rich_text` | Short text or formatted narrative, stored as strings |
     10	| `number`, `currency`, `percentage`, `rating` | Numeric values; put currency, bounds and formatting …
18. Read: /Users/marcoslisboa/Development/provia-plugin/references/next-step.md
   → 1	# Recommend the next step in chat
     2	
     3	After completing a skill, end the final chat response with one short, optional recommendation that advances the user's current workflow. Include the exact next skill name, why it is useful now, and a copyable invocation containing the relevant artifact or result from this task. Write it in the user's response language. Put it in the final chat response, not only in an attached report or intermediate commentary.
     4	
     5	Choose by what is missing, not by a fixed sequence. Carry the agreed design, country context, decisions and unresolved dependencies forward …
19. Read: /Users/marcoslisboa/Development/provia-plugin/skills/provia-workflow-designer/SKILL.md
   → 1	---
     2	name: provia-workflow-designer
     3	description: "Turn supplied procedures, SOPs and checklists into a Provia workflow design with classified source steps, executable action briefs, a flow diagram, a YAML skeleton and the manifest entry. Use when the user asks for \"turn this SOP into a workflow\", \"design the approval flow\", \"convert this procedure into actions\", \"model this process in Provia\", or says «transforma este procedimento num workflow», «ajuda-me a organizar as compras», «desenha o fluxo de aprovação», «converte este manual em acções»."
     4	---
     5	
     6	<!-- Generated from cata …
20. Read: /Users/marcoslisboa/Development/provia-plugin/skills/provia-workflow-package/SKILL.md
   → 1	---
     2	name: provia-workflow-package
     3	description: "Generate, explain or repair portable Provia workflow YAML, run the bundled validator and the action review gate, and generate the setup handover from the project manifest. Use when the user asks for \"generate the workflow YAML\", \"validate this workflow file\", \"repair this exported YAML\", \"package the approved design\", or says «gera o YAML do workflow», «valida este ficheiro», «corrige este YAML exportado», «prepara o pacote para importar»."
     4	---
     5	
     6	<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue,  …
21. Read: /Users/marcoslisboa/Development/provia-plugin/skills/provia-form-designer/SKILL.md
   → 1	---
     2	name: provia-form-designer
     3	description: "Design intake forms and Form Fill responses with appropriate access and mappings, traced to the workflow action they serve. Use when the user asks for \"design the request form\", \"collect supplier quotations in the case\", \"self-service form for IT requests\", \"what should the intake form ask\", or says «cria o formulário de pedido», «recolher três propostas durante o pedido», «formulário de auto-serviço», «que perguntas deve ter o formulário»."
     4	---
     5	
     6	<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, no …
22. Read: /Users/marcoslisboa/Development/provia-plugin/skills/provia-organization-rollout/SKILL.md
   → 1	---
     2	name: provia-organization-rollout
     3	description: "Derive the groups design as data from the sources and plan Provia ownership, training and adoption for a team or organization. Use when the user asks for \"design the groups\", \"who should own each action\", \"plan the rollout\", \"adoption plan for the pilot\", \"training for the purchasing team\", or says «define os grupos», «quem fica responsável por cada acção», «plano de adopção», «vamos começar com Compras e depois alargar», «formação da equipa»."
     4	---
     5	
     6	<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the c …
23. Read: /Users/marcoslisboa/Development/provia-plugin/skills/provia-information-model/SKILL.md
   → 1	---
     2	name: provia-information-model
     3	description: "Design complete, usable Provia entity types and field dictionaries, delivered as JSON and a copy-ready HTML catalogue for manual setup. Use when the user asks for \"which fields belong to the supplier\", \"design our entity types\", \"what data should we keep in Provia\", \"build the entity catalogue\", or says «que campos deve ter o fornecedor», «como organizar os dados dos clientes», «define os tipos de entidade», «catálogo de entidades»."
     4	---
     5	
     6	<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogue, not th …
24. Glob: {scripts/*.mjs,examples/*,contracts/workflow-v1/contract-lock.json,plugin.json,.claude-plugin/*,package.json}
   → /Users/marcoslisboa/Development/provia-plugin/scripts/check-contract.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-contract.mjs
     /Users/marcoslisboa/Development/provia-plugin/examples/metadata-fields.yaml
     /Users/marcoslisboa/Development/provia-plugin/examples/metadata-fields-setup.md
     /Users/marcoslisboa/Development/provia-plugin/examples/entity-catalogue.json
     /Users/marcoslisboa/Development/provia-plugin/examples/entity-catalogue.html
     /Users/marcoslisboa/Development/provia-plugin/scripts/validate-workflow.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-entity-c …
25. Bash (error): cd /Users/marcoslisboa/Development/provia-plugin && cat .claude-plugin/plugin.json && head -c 1500 contracts/workflow-v1/contract-lock.json && ls examples && node --version
   → cd in '/Users/marcoslisboa/Development/provia-plugin' was blocked. For security, Claude Code may only change directories to the allowed working directories for this session: '/private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete'.
26. Read: /Users/marcoslisboa/Development/provia-plugin/.claude-plugin/plugin.json
   → 1	{
     2	  "name": "provia-skills",
     3	  "version": "1.2.0",
     4	  "description": "Design, structure, validate and improve Provia workflows with country-aware business guidance.",
     5	  "author": {
     6	    "name": "Pixel Infinito",
     7	    "url": "https://github.com/pixelinfinito"
     8	  },
     9	  "homepage": "https://docs.provia.ao/guides/provia-skills",
     10	  "repository": "https://github.com/pixelinfinito/provia-plugin",
     11	  "license": "MIT",
     12	  "skills": "./skills/"
     13	}
     14	
27. Bash (error): head -c 1200 /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/contract-lock.json; echo; node --version
   → head in '/Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/contract-lock.json' was blocked. For security, Claude Code may only read the beginning of files from the allowed working directories for this session: '/private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete'.
28. Read: /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/contract-lock.json
   → 1	{
     2	  "apiVersion": "provia.ao/v1",
     3	  "sourceRevision": "fed8efaf019abc901cb2b229f3676dc4031126fa",
     4	  "generatedBy": "scripts/build-contract.mjs",
     5	  "engineSha256": "18254457a69fff8103d6ea833a5764a89314f373e4436739520e7a45f1fcab01",
     6	  "sourceFiles": {
     7	    "backend/src/lib/cron.ts": "4fb64e136b66a74eef3f03048f72243b050a7b7cafed30adc9141240da6ad399",
     8	    "backend/src/lib/dependent-options.ts": "6277ac8ad16c9b9fb5639e7a9c14f77dcdc945588cd6077bb5d403e37b26dae5",
     9	    "backend/src/lib/errors.ts": "ea6848230bd7565bc4877c1010ee74042cd5ffa79a643cef0f0c26e8eb756038",
     10	    "backend/src/ …
29. Read: /Users/marcoslisboa/Development/provia-plugin/examples/metadata-fields.yaml
   → 1	apiVersion: provia.ao/v1
     2	kind: Workflow
     3	metadata:
     4	  name: Pedido de serviço
     5	  prefix: SERV
     6	  description: Exemplo sintético de referência automática e classificação dependente para uma equipa em Angola.
     7	triggers:
     8	  - type: manual
     9	    label: Iniciar pedido
     10	    enabled: true
     11	    config: {}
     12	fields:
     13	  - name: service_reference
     14	    label: Referência de serviço
     15	    type: auto_number
     16	    required: false
     17	    config:
     18	      prefix: SRV-
     19	      padding: 5
     20	      startAt: 1
     21	  - name: category
     22	    label: Categoria
     23	    type: select
     24	    required: t …
30. Read: /Users/marcoslisboa/Development/provia-plugin/references/project-manifest.schema.json
   → 1	{
     2	  "$schema": "https://json-schema.org/draft/2020-12/schema",
     3	  "$id": "https://docs.provia.ao/schemas/provia-project-v1.1.json",
     4	  "title": "Provia project manifest (provia-project/v1.1)",
     5	  "description": "One implementation project: sources, entity types, groups, workflows with access, forms, AI profiles, decisions and connected-mode receipts. Plugin artefact; never a Provia import format. scripts/build-project-map.mjs --check is authoritative for cross-references and the access rules; this schema describes the shape. The alternate shapes it lists (section strings, source#anchor  …
31. ToolSearch: {"query":"select:mcp__claude_ai_Provia__org_get_context,mcp__claude_ai_Provia__entity_types_list,mcp__claude_ai_Provia__groups_list,mcp__claude_ai_Provia__workflows_list,mcp__claude_ai_Provia__forms_l
   → 
     
     
     
     
     
32. mcp__claude_ai_Provia__org_get_context (error): {}
   → Claude requested permissions to use mcp__claude_ai_Provia__org_get_context, but you haven't granted it yet.
33. Grep: setsFields|assigneeFallback
   → /Users/marcoslisboa/Development/provia-plugin/scripts/lib/project-map/app.js:58:      else if (ref.startsWith('field:')) { if (action.assigneeFallback && action.assigneeFallback !== 'creator') push(groupFallback, action.assigneeFallback, action.id); }
     /Users/marcoslisboa/Development/provia-plugin/scripts/lib/project-map/app.js:105:  if (ref.startsWith('field:')) return html`<code>${ref}</code>${action.assigneeFallback ? html` · ${T.fields.fallback}: ${action.assigneeFallback === 'creator' ? T.enums.creator : link('group/' + action.assigneeFallback)}` : ''}`;
     /Users/marcoslisboa/Development/pro …
34. Read: /Users/marcoslisboa/Development/provia-plugin/scripts/lib/project-manifest.mjs
   → 225	    if (workflow.status !== undefined && !WORKFLOW_STATUS.has(workflow.status)) error(`${at}.status`, 'Unknown workflow status');
     226	    if (workflow.ownerArea !== undefined && workflow.ownerArea !== null && !(text(workflow.ownerArea) && KEY.test(workflow.ownerArea))) error(`${at}.ownerArea`, 'Owner area is a short ASCII key');
     227	    checkSourceRefs(workflow.sourceRefs, `${at}.sourceRefs`);
     228	    const yaml = readWorkflowFile(workflow, baseDir);
     229	    const yamlFields = new Map(list(yaml.draft?.fields).map(field => [field?.name, field]));
     230	    const localIds = unique(list(workflo …
35. Read: /Users/marcoslisboa/Development/provia-plugin/references/action-configs.md
   → 1	# Action configuration details
     2	
     3	Use with workflow-yaml.md when emitting an action's config or aiWorker mapping. These are field guides for the pinned source revision; the executable validator remains authoritative for checks it performs. Examples below are fragments, not complete workflow documents.
     4	
     5	## HTTP Request
     6	
     7	Use HTTPS endpoint and method GET, POST, PUT, PATCH or DELETE. headers is a list of `{key, value, enabled}`; at most 50. A body is required for POST/PUT/PATCH and absent for GET/DELETE. Prefer body `{type: json|form|raw, content: string}`. responseMappings is a list  …
36. Grep: currency
   → /Users/marcoslisboa/Development/provia-plugin/references/entity-design.md:41:- Operational or commercial attributes: service scope, agreed terms, contract dates, currency, criticality, support arrangements or equipment specifications relevant to decisions.
     /Users/marcoslisboa/Development/provia-plugin/references/entity-design.md:83:Keep country, currency, timezone and language separate. Use Angola-aware wording when appropriate; do not invent fiscal obligations, identifier formats or retention periods. Financial/identity details need an actual process use and an appropriate access model. A sen …
37. Grep: currency|min:|max:
   → /Users/marcoslisboa/Development/provia-plugin/scripts/lib/project-map/app.js:350:  if (['number', 'currency', 'integer', 'decimal'].includes(type)) return html`<input type="number" disabled placeholder="${type}${field.config && field.config.currency ? ' · ' + field.config.currency : ''}">`;
     /Users/marcoslisboa/Development/provia-plugin/scripts/lib/project-map/labels.mjs:11:[Omitted long matching line]
     /Users/marcoslisboa/Development/provia-plugin/scripts/lib/project-map/labels.mjs:30:[Omitted long matching line]
38. Bash (error): ls /Users/marcoslisboa/Development/provia-plugin/scripts/lib /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1; grep -o '"currency"[^}]\{0,200\}' /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/*.mjs 2>/dev/null | head -5; grep -o 'config\.currency[^;]\{0,120\}' /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/*.mjs 2>/dev/null | head -5
   → This Bash command contains multiple operations. The following parts require approval: ls /Users/marcoslisboa/Development/provia-plugin/scripts/lib /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1; grep -o '"currency"[^}]\{0,200\}' /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/*.mjs, head -5; grep -o 'config\.currency[^;]\{0,120\}' /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/*.mjs
39. Glob: **/*
   → /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/contract-lock.json
     /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/engine.mjs
40. Grep: currency
   → 140:[Omitted long matching line]
     142:[Omitted long matching line]
41. Bash (error): grep -o '.\{120\}currency.\{160\}' /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/engine.mjs | head -8
   → This Bash command contains multiple operations. The following part requires approval: grep -o '.\{120\}currency.\{160\}' /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/engine.mjs
42. Read: /Users/marcoslisboa/Development/provia-plugin/scripts/review-actions.mjs
   → 1	#!/usr/bin/env node
     2	// Deterministic review gate for action briefs: reports, per action, which of the five description parts are missing,
     3	// leaked implementer notes, over-long descriptions (warning at 4 500 characters, error above the product limit) and unset due
     4	// dates. It checks presence, not quality.
     5	import fs from 'node:fs';
     6	import path from 'node:path';
     7	import { fileURLToPath } from 'node:url';
     8	import * as engine from '../contracts/workflow-v1/engine.mjs';
     9	
     10	export const MAX_DESCRIPTION = 5000;
     11	export const WARN_DESCRIPTION = 4500;
     12	const HUMAN_TYPES = new Set( …
43. Read: /Users/marcoslisboa/Development/provia-plugin/scripts/emit-workflow-access.mjs
   → 1	#!/usr/bin/env node
     2	// Writes the manifest's `workflows[].access` into a copy of the workflow YAML for a browser import: `group:<groups[].name>`
     3	// (the importer matches names, not keys), `user:<email>`, `organization`; `creator` rows are documentation the importer drops.
     4	// Against an engine that carries `access` in the portable document the section goes inside the YAML; against an older bundle
     5	// it is written to access.yaml next to the output. It never emits a `permissions:` key and never edits the source file.
     6	// Manual-trigger allowlists are not written here (the contract need …
44. Grep: function readWorkflowFile|function writeSetup|--setup
   → /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs:43:    const usage = 'Usage: node scripts/build-project-map.mjs provia-project.json --check | --output project.html | --setup setup.md';
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs:44:    if (!input || extra.length || !((flag === '--check' && !output) || ((flag === '--output' || flag === '--setup') && output))) throw new Error(usage);
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs-45-    if (output && resolve(input) === resolve(output)) throw new Error('Outpu …
45. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete/provia-project.json
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete/provia-project.json (file state is current in your context — no need to Read it back)
46. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete/expense-reimbursement/workflow.yaml
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete/expense-reimbursement/workflow.yaml (file state is current in your context — no need to Read it back)
47. Bash (error): node /Users/marcoslisboa/Development/provia-plugin/scripts/validate-workflow.mjs expense-reimbursement/workflow.yaml > expense-reimbursement/validation.json; echo "exit=$?"; cat expense-reimbursement/validation.json
   → This Bash command contains multiple operations. The following part requires approval: echo "exit=$?"
48. Bash (error): node /Users/marcoslisboa/Development/provia-plugin/scripts/validate-workflow.mjs expense-reimbursement/workflow.yaml | tee expense-reimbursement/validation.json
   → This Bash command contains multiple operations. The following part requires approval: tee expense-reimbursement/validation.json
49. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/validate-workflow.mjs expense-reimbursement/workflow.yaml
   → {
       "valid": true,
       "apiVersion": "provia.ao/v1",
       "contractRevision": "fed8efaf019abc901cb2b229f3676dc4031126fa",
       "destinationValidation": "not_run",
       "backendSchemaValidation": "passed",
       "readyToPublish": false,
       "errors": [],
       "warnings": [],
       "setupRequired": [
         {
           "code": "assignment_missing",
           "path": "actions[1].assignee",
           "message": "Set the intended owner before publication; import defaults do not establish approval authority."
         },
         {
           "code": "assignment_missing",
           "path": "actions[2].assignee",
           "message": "Set the intended owner bef …
50. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/validate-workflow.mjs expense-reimbursement/workflow.yaml > expense-reimbursement/validation.json
   → (Bash completed with no output)
51. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/review-actions.mjs expense-reimbursement/workflow.yaml --markdown
   → # Action review: Expense reimbursement
     
     3 actions reviewed; 3 of 3 human/AI actions have all five parts; 0 with leaked implementer notes; 3 without `due`.
     
     | Action | Type | Missing parts | Leaks | Length | Due |
     | --- | --- | --- | --- | --- | --- |
     | `submit_receipts` Submit the receipts for reimbursement | standard | none | none | 1064 | missing |
     | `decide_claim` Decide on the expense claim | decision | none | none | 1181 | missing |
     | `pay_reimbursement` Pay the approved reimbursement | standard | none | none | 1055 | missing |
     
     Presence of the labelled parts (Tarefa/Task, Como/How, Evidê …
52. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/review-actions.mjs expense-reimbursement/workflow.yaml > expense-reimbursement/review-actions.json
   → (Bash completed with no output)
53. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs provia-project.json --check
   → info workflows[0].access: Assigned group line_managers holds no workflow grant: its members see the cases that carry their actions (rule 4)
     info workflows[0].access: Assigned group finance holds no workflow grant: its members see the cases that carry their actions (rule 4)
     Manifest expense-reimbursement: 1 workflows, 2 groups, 0 entity types, 1 forms; access declared on 1/1, 0 readiness block(s), 0 unresolved actor/entity key(s); 27 pending item(s), 0 warning(s), 2 info(s). Plugin artefact only; nothing was created in Provia.
54. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/emit-workflow-access.mjs provia-project.json expense-reimbursement expense-reimbursement/workflow.yaml --output expense-reimbursement/workflow.access.yaml
   → {
       "output": "expense-reimbursement/workflow.access.yaml",
       "placement": "workflow.yaml",
       "accessFile": null,
       "access": {
         "grants": [
           {
             "grantee": "organization",
             "level": "create_incident"
           }
         ]
       },
       "skipped": [],
       "engineSupportsAccess": true
     }
55. Bash: rm expense-reimbursement/workflow.access.yaml
   → (Bash completed with no output)
56. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs provia-project.json --setup expense-reimbursement/setup.md
   → info workflows[0].access: Assigned group line_managers holds no workflow grant: its members see the cases that carry their actions (rule 4)
     info workflows[0].access: Assigned group finance holds no workflow grant: its members see the cases that carry their actions (rule 4)
     Manifest expense-reimbursement: 1 workflows, 2 groups, 0 entity types, 1 forms; access declared on 1/1, 0 readiness block(s), 0 unresolved actor/entity key(s); 27 pending item(s), 0 warning(s), 2 info(s). Plugin artefact only; nothing was created in Provia. Handover written to expense-reimbursement/setup.md.
57. Read: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete/expense-reimbursement/setup.md
   → 1	# Expense reimbursement: Setup handover
     2	
     3	Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.0, 2026-09-21).
     4	
     5	## Status
     6	
     7	Mode: manual configuration (no receipts recorded).
     8	
     9	## Pending configuration
     10	
     11	| Where | Item | What to do |
     12	| --- | --- | --- |
     13	| expense-reimbursement | Expense reimbursement | Import the YAML as a draft and review the preview (`expense-reimbursement/workflow.yaml`) |
     14	| expense-reimbursement | Expense reimbursement | Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` sect …
58. Edit: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete/provia-project.json
   → The file /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete/provia-project.json has been updated successfully. (file state is current in your context — no need to Read it back)
59. Edit: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete/provia-project.json
   → The file /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete/provia-project.json has been updated successfully. (file state is current in your context — no need to Read it back)
60. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete/expense-reimbursement/design.md
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-smUNVD/bootstrap-incomplete/expense-reimbursement/design.md (file state is current in your context — no need to Read it back)
