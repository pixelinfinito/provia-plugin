# Tool calls

1. Skill: provia-skills:provia-bootstrap
   → Launching skill: provia-skills:provia-bootstrap
2. Bash (error): ls -la /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/ 2>&1; echo "---"; ls /Users/marcoslisboa/Development/provia-plugin/references/ 2>&1; echo "---skills---"; ls /Users/marcoslisboa/Development/provia-plugin/skills/ 2>&1
   → This Bash command contains multiple operations. The following parts require approval: ls /Users/marcoslisboa/Development/provia-plugin/references/, ls /Users/marcoslisboa/Development/provia-plugin/skills/
3. Bash: ls -la /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/
   → total 0
     drwxr-xr-x@ 2 marcoslisboa  staff  64 Sep 18 19:47 .
     drwx------@ 3 marcoslisboa  staff  96 Sep 18 19:47 ..
4. Bash (error): ls /Users/marcoslisboa/Development/provia-plugin/references/
   → ls in '/Users/marcoslisboa/Development/provia-plugin/references' was blocked. For security, Claude Code may only list files in the allowed working directories for this session: '/private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting'.
5. Bash (error): ls /Users/marcoslisboa/Development/provia-plugin/skills/
   → ls in '/Users/marcoslisboa/Development/provia-plugin/skills' was blocked. For security, Claude Code may only list files in the allowed working directories for this session: '/private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting'.
6. Read: /Users/marcoslisboa/Development/provia-plugin/references/skill-conventions.md
   → 1	# Shared conventions for every Provia skill
     2	
     3	Every `SKILL.md` in this plugin is generated from `catalog.json` and starts by pointing here. These rules apply to all skills; a skill file repeats only what is specific to its task.
     4	
     5	## Country and language
     6	
     7	Country, jurisdiction, response language, currency and timezone are separate choices. Read [country context](country-context.md) before relying on any of them, and the [Angola reference](countries/angola.md) when Angola applies. If no country is supplied, disclose Angola as a provisional starting context. Respect an explicit langu …
7. Read: /Users/marcoslisboa/Development/provia-plugin/references/project-manifest.md
   → 1	# Project manifest (`provia-project/v1`)
     2	
     3	One implementation project has one manifest, `provia-project.json`. Every skill reads it before starting and appends its result to it, so entity types, groups, workflow actions, forms and decisions are one graph rather than a folder of unrelated files. The map renderer draws that graph; `setup.md` is generated from what the manifest still leaves unresolved; the connected-mode `apply` steps consume it in dependency order.
     4	
     5	This file is a plugin artefact. It is not a Provia import format and it never carries credentials or secret values.
     6	
     7	# …
8. Read: /Users/marcoslisboa/Development/provia-plugin/references/workflow-design-output.md
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
9. Read: /Users/marcoslisboa/Development/provia-plugin/references/groups-design.md
   → 1	# Groups derived from the sources
     2	
     3	Provia assigns work to users or groups, and groups may have one level of sub-groups. `provia-organization-rollout` turns every actor named in the sources into a proposed group **as data** in `groups[]` of the project manifest, so that `workflow-designer` and `workflow-package` can reference owners by key and connected mode can create them with `groups_apply_plan`.
     4	
     5	## For every actor in the sources
     6	
     7	Scan the SOPs, policies, checklists and org charts for who acts: «chefia», «Finanças», «DG», «Compras», «o requerente», «RH». For each one produce:
      …
10. Read: /Users/marcoslisboa/Development/provia-plugin/references/connected-mode.md
   → 1	# Connected mode (`provia-implementer` MCP)
     2	
     3	Provia's API Gateway is gaining an MCP server, `provia-implementer`, specified in Provia feature 026 and pinned to the same product revision as this plugin's contract engine. When an implementer signs in through it, the skills can read the destination organization and create **draft** configuration on the implementer's behalf. This reference is the plugin side of that contract. Until the server is released in the implementer's environment, every skill behaves exactly as in disconnected mode; do not describe connected features as available when …
11. Read: /Users/marcoslisboa/Development/provia-plugin/references/provia-capabilities.md
   → 1	# Provia capability baseline
     2	
     3	Baseline: workflow contract revision recorded in contracts/workflow-v1/contract-lock.json. This is implementation evidence, not proof of the version deployed in a customer environment.
     4	
     5	A Workflow defines a repeatable process. An Incident is one execution of a workflow. An Action is one step. Entities hold reusable business records, metadata holds structured case values, tags classify records, and pages/files/comments provide explanation and evidence. Explain “incident” as a process case when the business context is not emergency response.
     6	
     7	Entity an …
12. Read: /Users/marcoslisboa/Development/provia-plugin/references/action-writing.md
   → 1	# Write and review action names and descriptions
     2	
     3	Read the source procedure and the action's purpose, type, instructions and configuration before choosing a verb.
     4	
     5	## Name the work
     6	
     7	Write every action name as a concise instruction describing the work expected. In Portuguese, start with an infinitive verb; in English, start with a base-form action verb. Use a verb, an object and only the qualifier needed to identify the task. Aim for 3–10 words and roughly 80 characters when meaning permits. These are editorial guidelines, not Provia contract limits.
     8	
     9	Do not copy an actor-led  …
13. Read: /Users/marcoslisboa/Development/provia-plugin/references/next-step.md
   → 1	# Recommend the next step in chat
     2	
     3	After completing a skill, end the final chat response with one short, optional recommendation that advances the user's current workflow. Include the exact next skill name, why it is useful now, and a copyable invocation containing the relevant artifact or result from this task. Write it in the user's response language. Put it in the final chat response, not only in an attached report or intermediate commentary.
     4	
     5	Choose by what is missing, not by a fixed sequence. Carry the agreed design, country context, decisions and unresolved dependencies forward …
14. Read: /Users/marcoslisboa/Development/provia-plugin/references/country-context.md
   → 1	# Country context
     2	
     3	Establish country of operation, applicable jurisdiction, response language, currency, timezone, sector and the organization’s own policy. Do not derive jurisdiction from the language of a document. If no country is supplied, disclose Angola as a provisional starting context. Ask before relying on a jurisdiction for a legal conclusion. An English conversation can still concern Angola; Portuguese can concern another country.
     4	
     5	Use Angolan Portuguese for Portuguese outputs in the Angola context. Prefer utilizador, ficheiro, equipa, registo, ecrã, descarregar and protec …
15. Read: /Users/marcoslisboa/Development/provia-plugin/references/countries/angola.md
   → 1	# Angola
     2	
     3	Use this reference for terminology and source selection, not as a statement of legal compliance. Source directory reviewed on 2026-09-10. Verify each relevant instrument again when using it for a decision.
     4	
     5	## Working context
     6	
     7	Use Portuguese appropriate to Angola unless another language is requested. Examples may use Luanda, AOA/Kz, Africa/Luanda, procurement teams and Recursos Humanos. A NIF may be relevant to a supplier process; collect it only if the process requires it. Do not substitute Brazilian identifiers or institutions.
     8	
     9	Organization approval thresholds, c …
16. Read: /Users/marcoslisboa/Development/provia-plugin/references/entity-catalogue-format.md
   → 1	# JSON and HTML catalogue delivery
     2	
     3	Deliver both files for a standalone entity catalogue creation or revision. JSON is the source of truth for this deliverable; generate the HTML from the same JSON after every change. Inside an implementation project, the same type objects live in `entityTypes[]` of `provia-project.json` (see project-manifest.md), `build-project-map.mjs --check` applies these editorial checks to them, and `project.html` renders them in its catalogue tab; a separate `catalogue.html` is then optional. This is an **editorial specification for manual configuration**, not a P …
17. Read: /Users/marcoslisboa/Development/provia-plugin/references/workflow-yaml.md
   → 1	# Portable workflow YAML
     2	
     3	Emit `apiVersion: provia.ao/v1` and `kind: Workflow`, preceded by a first-line comment `# provia-skills <plugin version>` so an import can be attributed to the plugin (the product records only what its schema knows; the comment is the attribution until `metadata.source` exists). The legacy `provia.io/v1` alias is readable but should not be generated. Allowed top-level sections are metadata, triggers, entities, fields and actions. Unknown keys are not extensions. The full contract version and source fingerprints are in ../../contracts/workflow-v1/contract-lock.js …
18. Glob: /Users/marcoslisboa/Development/provia-plugin/scripts/*
   → /Users/marcoslisboa/Development/provia-plugin/scripts/check-contract.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-contract.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/validate-workflow.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-skills.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-entity-catalogue.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/lib/yaml-emit.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/resolve-workflow-refs.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-release.py
     /Us …
19. Glob: /Users/marcoslisboa/Development/provia-plugin/examples/*
   → /Users/marcoslisboa/Development/provia-plugin/examples/metadata-fields.yaml
     /Users/marcoslisboa/Development/provia-plugin/examples/metadata-fields-setup.md
     /Users/marcoslisboa/Development/provia-plugin/examples/entity-catalogue.json
     /Users/marcoslisboa/Development/provia-plugin/examples/entity-catalogue.html
     /Users/marcoslisboa/Development/provia-plugin/examples/procurement/workflow.yaml
     /Users/marcoslisboa/Development/provia-plugin/examples/it-service/workflow.yaml
     /Users/marcoslisboa/Development/provia-plugin/examples/employee-onboarding/workflow.yaml
     /Users/marcoslisboa/Development/provia-p …
20. Read: /Users/marcoslisboa/Development/provia-plugin/examples/procurement/workflow.yaml
   → 1	# provia-skills 1.1.0 — training draft for Angola; see setup.md and provia-project.json before importing.
     2	apiVersion: provia.ao/v1
     3	kind: Workflow
     4	metadata:
     5	  name: "Pedido de compra — exemplo"
     6	  prefix: COMP
     7	  description: "Exemplo de formação. Configurar responsáveis e regras antes da publicação."
     8	triggers:
     9	  - type: manual
     10	    label: Iniciar pedido
     11	    enabled: true
     12	    config: {}
     13	fields:
     14	  - name: purchase_amount
     15	    label: Montante solicitado
     16	    type: currency
     17	    required: true
     18	    config:
     19	      currency: AOA
     20	      decimals: 2
     21	  - nam …
21. Read: /Users/marcoslisboa/Development/provia-plugin/examples/procurement/provia-project.json
   → 1	{
     2	  "schemaVersion": "provia-project/v1",
     3	  "project": {
     4	    "key": "compras-exemplo",
     5	    "title": "Pedido de compra — exemplo",
     6	    "language": "pt-AO",
     7	    "country": "Angola",
     8	    "timezone": "Africa/Luanda",
     9	    "currency": "AOA",
     10	    "generator": "provia-skills/1.1.0",
     11	    "contractRevision": "2641364d9c1aa0aa2b76aa788ef521bcb6218118",
     12	    "updatedAt": "2026-09-18"
     13	  },
     14	  "organization": {
     15	    "name": "Empresa de demonstração",
     16	    "sector": "Serviços",
     17	    "mode": "disconnected",
     18	    "tenantId": null,
     19	    "productRevision": null
     20	  },
     21 …
22. Read: /Users/marcoslisboa/Development/provia-plugin/scripts/lib/project-manifest.mjs
   → 1	// Shared logic for provia-project/v1 manifests: shape checks, reference resolution and the generated handover.
     2	import { readFileSync, existsSync } from 'node:fs';
     3	import path from 'node:path';
     4	import { validateTypes } from '../build-entity-catalogue.mjs';
     5	import * as engine from '../../contracts/workflow-v1/engine.mjs';
     6	
     7	export const SCHEMA = 'provia-project/v1';
     8	const KEY = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
     9	const ACTION_TYPES = new Set(['standard', 'decision', 'sub_workflow', 'notification', 'wait', 'http_request', 'form_fill']);
     10	const SOURCE_KINDS = new Set(['sop', 'polic …
23. Read: /Users/marcoslisboa/Development/provia-plugin/examples/corrective-action/workflow.yaml
   → 1	# provia-skills 1.1.0 — training draft for Angola; see setup.md and provia-project.json before importing.
     2	apiVersion: provia.ao/v1
     3	kind: Workflow
     4	metadata:
     5	  name: "Acção correctiva — exemplo"
     6	  prefix: AC
     7	  description: "Exemplo de formação. Configurar responsáveis e regras antes da publicação."
     8	triggers:
     9	  - type: manual
     10	    label: Iniciar pedido
     11	    enabled: true
     12	    config: {}
     13	fields:
     14	  - name: finding_reference
     15	    label: Referência da constatação
     16	    type: text
     17	    required: true
     18	  - name: finding_source
     19	    label: Origem da constatação
     20	 …
24. Grep: executionMode|required.*true|last action|terminal
   → Found 1 file
     /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/engine.mjs
25. Grep: continue|cancel_incident|branches|outcome
   → 65:[Omitted long matching line]
     66:[Omitted long matching line]
     67:[Omitted long matching line]
     100:[Omitted long matching line]
     121:`:!1}charAt(e){return this.buffer[this.pos+e]}continueScalar(e){let n=this.buffer[e];if(this.indentNext>0){let r=0;for(;n===" ";)n=this.buffer[++r+e];if(n==="\r"){let i=this.buffer[r+e+1];if(i===`
     125:`,this.pos);if(i!==-1){for(;i!==-1;){let s=this.continueScalar(i+1);if(s===-1)break;i=r.indexOf(`
     128:`)break}default:break e}if(!r&&!this.atEnd)return this.setNext("block-scalar");if(n>=this.indentNext){this.blockScalarIndent===-1?this.indentNext=n:this.indentNext= …
26. Read: /Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/contract-lock.json
   → 1	{
     2	  "apiVersion": "provia.ao/v1",
     3	  "sourceRevision": "2641364d9c1aa0aa2b76aa788ef521bcb6218118",
     4	  "generatedBy": "scripts/build-contract.mjs",
     5	  "engineSha256": "8da9659c69a4209608794b63a5d06024caf71ebddff9b42927d0db26256e9b79",
     6	  "sourceFiles": {
     7	    "backend/src/lib/cron.ts": "4fb64e136b66a74eef3f03048f72243b050a7b7cafed30adc9141240da6ad399",
     8	    "backend/src/lib/dependent-options.ts": "6277ac8ad16c9b9fb5639e7a9c14f77dcdc945588cd6077bb5d403e37b26dae5",
     9	    "backend/src/lib/errors.ts": "ea6848230bd7565bc4877c1010ee74042cd5ffa79a643cef0f0c26e8eb756038",
     10	    "backend/src/ …
27. Glob: /Users/marcoslisboa/Development/provia-plugin/.claude-plugin/plugin.json
   → /Users/marcoslisboa/Development/provia-plugin/.claude-plugin/plugin.json
28. Read: /Users/marcoslisboa/Development/provia-plugin/.claude-plugin/plugin.json
   → 1	{
     2	  "name": "provia-skills",
     3	  "version": "1.1.0",
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
29. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/provia-project.json
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/provia-project.json (file state is current in your context — no need to Read it back)
30. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/compras/workflow.yaml
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/compras/workflow.yaml (file state is current in your context — no need to Read it back)
31. Bash (error): cd /Users/marcoslisboa/Development/provia-plugin && node scripts/validate-workflow.mjs /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/compras/workflow.yaml; echo "EXIT:$?"
   → This Bash command contains multiple operations. The following parts require approval: cd /Users/marcoslisboa/Development/provia-plugin, echo "EXIT:$?"
32. Bash (error): cd /Users/marcoslisboa/Development/provia-plugin && node scripts/review-actions.mjs /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/compras/workflow.yaml; echo "EXIT:$?"
   → This Bash command contains multiple operations. The following parts require approval: cd /Users/marcoslisboa/Development/provia-plugin, echo "EXIT:$?"
33. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/validate-workflow.mjs compras/workflow.yaml
   → {
       "valid": true,
       "apiVersion": "provia.ao/v1",
       "contractRevision": "2641364d9c1aa0aa2b76aa788ef521bcb6218118",
       "destinationValidation": "not_run",
       "backendSchemaValidation": "passed",
       "readyToPublish": false,
       "errors": [],
       "warnings": [
         {
           "code": "product_warning",
           "path": "workflow.fields",
           "message": "Validation warning"
         }
       ],
       "setupRequired": [
         {
           "code": "assignment_missing",
           "path": "actions[0].assignee",
           "message": "Set the intended owner before publication; import defaults do not establish approval authority."
         }
       ]
     }
34. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/review-actions.mjs compras/workflow.yaml
   → {
       "valid": true,
       "workflow": "Aprovação de pedidos de compra",
       "reviewedActions": 1,
       "summary": {
         "applicable": 1,
         "complete": 1,
         "incomplete": 0,
         "automatedWithoutDescription": 0,
         "leaks": 0,
         "dueMissing": 1
       },
       "actions": [
         {
           "id": "decidir",
           "name": "Decidir sobre o pedido de compra",
           "type": "decision",
           "applicable": true,
           "complete": true,
           "parts": {
             "task": true,
             "method": true,
             "evidence": true,
             "doneWhen": true,
             "exceptions": true
           },
           "missing": [],
           "leaks …
35. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/compras/validation.json
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/compras/validation.json (file state is current in your context — no need to Read it back)
36. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/compras/editorial-review.md
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/compras/editorial-review.md (file state is current in your context — no need to Read it back)
37. Read: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/provia-project.json
   → 1	{
     2	  "schemaVersion": "provia-project/v1",
     3	  "project": {
     4	    "key": "compras",
     5	    "title": "Aprovação de pedidos de compra",
     6	    "language": "pt-AO",
     7	    "country": "Angola",
     8	    "timezone": "Africa/Luanda",
     9	    "currency": "AOA",
     10	    "generator": "provia-skills/1.1.0",
     11	    "contractRevision": "2641364d9c1aa0aa2b76aa788ef521bcb6218118",
     12	    "updatedAt": "2026-09-18"
     13	  },
     14	  "organization": {
     15	    "name": "Não indicado nas fontes fornecidas",
     16	    "sector": "Não indicado nas fontes fornecidas",
     17	    "mode": "disconnected",
     18	    "tenantId": null,
     19	    " …
38. Edit: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/provia-project.json
   → The file /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/provia-project.json has been updated successfully. (file state is current in your context — no need to Read it back)
39. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs provia-project.json --check
   → warning workflows[0].actions[0].assigneeRef: Action decidir has no owner
     warning groups.chefias: Group chefias owns no action
     warning groups.director_financeiro: Group director_financeiro owns no action
     Manifest compras: 1 workflows, 2 groups, 0 entity types, 0 forms; 13 pending item(s), 3 warning(s). Plugin artefact only; nothing was created in Provia.
40. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs provia-project.json --output project.html && node /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs provia-project.json --setup setup.md && ls -la
   → warning workflows[0].actions[0].assigneeRef: Action decidir has no owner
     warning groups.chefias: Group chefias owns no action
     warning groups.director_financeiro: Group director_financeiro owns no action
     Manifest compras: 1 workflows, 2 groups, 0 entity types, 0 forms; 13 pending item(s), 3 warning(s). Plugin artefact only; nothing was created in Provia. Map written to project.html.
     warning workflows[0].actions[0].assigneeRef: Action decidir has no owner
     warning groups.chefias: Group chefias owns no action
     warning groups.director_financeiro: Group director_financeiro owns no action
     Manifest com …
41. Read: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-iAJyu5/bootstrap-conflicting/setup.md
   → 1	# Aprovação de pedidos de compra: Entrega de configuração
     2	
     3	Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).
     4	
     5	## Estado
     6	
     7	Modo: sem ligação ao Provia (configuração manual).
     8	
     9	## Configuração pendente
     10	
     11	| Onde | Item | O que fazer |
     12	| --- | --- | --- |
     13	| compras | Aprovação de pedidos de compra | Importar o YAML como rascunho e rever a pré-visualização (`compras/workflow.yaml`) |
     14	| compras / decidir | Decidir sobre o pedido de compra | Definir o responsável; a acção não tem dono no desenho |
     15	| compras / d …
42. Bash: ls -la compras/
   → total 24
     drwxr-xr-x@ 5 marcoslisboa  staff   160 Sep 18 19:52 .
     drwxr-xr-x@ 6 marcoslisboa  staff   192 Sep 18 19:52 ..
     -rw-r--r--@ 1 marcoslisboa  staff  3304 Sep 18 19:52 editorial-review.md
     -rw-r--r--@ 1 marcoslisboa  staff   601 Sep 18 19:51 validation.json
     -rw-r--r--@ 1 marcoslisboa  staff  1955 Sep 18 19:51 workflow.yaml
