# Tool calls

1. Skill: provia-skills:provia-workflow-package
   → Launching skill: provia-skills:provia-workflow-package
2. Read: /Users/marcoslisboa/Development/provia-plugin/references/skill-conventions.md
   → 1	# Shared conventions for every Provia skill
     2	
     3	Every `SKILL.md` in this plugin is generated from `catalog.json` and starts by pointing here. These rules apply to all skills; a skill file repeats only what is specific to its task.
     4	
     5	## Country and language
     6	
     7	Country, jurisdiction, response language, currency and timezone are separate choices. Read [country context](country-context.md) before relying on any of them, and the [Angola reference](countries/angola.md) when Angola applies. If no country is supplied, disclose Angola as a provisional starting context. Respect an explicit langu …
3. Read: /Users/marcoslisboa/Development/provia-plugin/references/workflow-yaml.md
   → 1	# Portable workflow YAML
     2	
     3	Emit `apiVersion: provia.ao/v1` and `kind: Workflow`, preceded by a first-line comment `# provia-skills <plugin version>` so an import can be attributed to the plugin (the product records only what its schema knows; the comment is the attribution until `metadata.source` exists). The legacy `provia.io/v1` alias is readable but should not be generated. Allowed top-level sections are metadata, triggers, entities, fields, access and actions. Unknown top-level keys are errors (`schema.unknown_key`); a `permissions:` key never validates. Nested unknown keys are warnin …
4. Bash (error): ls -R /Users/marcoslisboa/Development/provia-plugin | head -100; echo ---; ls /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-jARpCn/workflow-package-conflicting
   → This Bash command contains multiple operations. The following part requires approval: ls -R /Users/marcoslisboa/Development/provia-plugin
5. Read: /Users/marcoslisboa/Development/provia-plugin/references/action-writing.md
   → 1	# Write and review action names and descriptions
     2	
     3	Read the source procedure and the action's purpose, type, instructions and configuration before choosing a verb.
     4	
     5	## Name the work
     6	
     7	Write every action name as a concise instruction describing the work expected. In Portuguese, start with an infinitive verb; in English, start with a base-form action verb. Use a verb, an object and only the qualifier needed to identify the task. Aim for 3–10 words and roughly 80 characters when meaning permits. These are editorial guidelines, not Provia contract limits.
     8	
     9	Do not copy an actor-led  …
6. Bash (error): ls -R /Users/marcoslisboa/Development/provia-plugin
   → ls in '/Users/marcoslisboa/Development/provia-plugin' was blocked. For security, Claude Code may only list files in the allowed working directories for this session: '/private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-jARpCn/workflow-package-conflicting'.
7. Bash: ls -la /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-jARpCn/workflow-package-conflicting
   → total 0
     drwxr-xr-x@ 2 marcoslisboa  staff  64 Sep 23 09:59 .
     drwx------@ 3 marcoslisboa  staff  96 Sep 23 09:59 ..
8. Glob: **/*
   → /Users/marcoslisboa/Development/provia-plugin/examples/metadata-fields.yaml
     /Users/marcoslisboa/Development/provia-plugin/examples/metadata-fields-setup.md
     /Users/marcoslisboa/Development/provia-plugin/examples/entity-catalogue.json
     /Users/marcoslisboa/Development/provia-plugin/examples/entity-catalogue.html
     /Users/marcoslisboa/Development/provia-plugin/examples/employee-onboarding/workflow.yaml
     /Users/marcoslisboa/Development/provia-plugin/examples/corrective-action/workflow.yaml
     /Users/marcoslisboa/Development/provia-plugin/examples/it-service/workflow.yaml
     /Users/marcoslisboa/Development/pr …
9. Glob: scripts/*.mjs
   → /Users/marcoslisboa/Development/provia-plugin/scripts/check-contract.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-contract.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/validate-workflow.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-entity-catalogue.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-skills.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/run-skill-evaluations.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/emit-workflow-access.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/plan-workflow …
10. Read: /Users/marcoslisboa/Development/provia-plugin/examples/procurement/workflow.yaml
   → 1	# provia-skills 1.2.1 — training draft for Angola; see setup.md and provia-project.json before importing.
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
11. Read: /Users/marcoslisboa/Development/provia-plugin/references/workflow-access.md
   → 1	# Workflow access (`workflows[].access`)
     2	
     3	Who may see and open a workflow is design data, declared in the manifest, reviewed with the customer in the Acesso tab of `project.html`, checked by `--check` and applied either through the `access` section of the portable YAML (browser import) or through `workflow_access_apply` (connected mode). Silence is never an accident: a workflow without an `access` section fails `--check`.
     4	
     5	## What the product does
     6	
     7	- Levels are `view` < `create_incident` < `edit` < `admin`, cumulative, one level per grant; the list is published at `GET /api/v1/pe …
12. Read: /Users/marcoslisboa/Development/provia-plugin/references/project-manifest.md
   → 1	# Project manifest (`provia-project/v1.1`)
     2	
     3	One implementation project has one manifest, `provia-project.json`. Every skill reads it before starting and appends its result to it, so entity types, groups, workflow actions, forms and decisions are one graph rather than a folder of unrelated files. The map renderer draws that graph; `setup.md` is generated from what the manifest still leaves unresolved; the connected-mode `apply` steps consume it in dependency order.
     4	
     5	This file is a plugin artefact. It is not a Provia import format and it never carries credentials or secret values. Its  …
13. Read: /Users/marcoslisboa/Development/provia-plugin/examples/procurement/provia-project.json
   → 1	{
     2	  "schemaVersion": "provia-project/v1.1",
     3	  "project": {
     4	    "key": "compras-exemplo",
     5	    "title": "Pedido de compra — exemplo",
     6	    "language": "pt-AO",
     7	    "country": "Angola",
     8	    "timezone": "Africa/Luanda",
     9	    "currency": "AOA",
     10	    "generator": "provia-skills/1.2.1",
     11	    "contractRevision": "fed8efaf019abc901cb2b229f3676dc4031126fa",
     12	    "updatedAt": "2026-09-23"
     13	  },
     14	  "organization": {
     15	    "name": "Empresa de demonstração",
     16	    "sector": "Serviços",
     17	    "mode": "disconnected",
     18	    "tenantId": null,
     19	    "productRevision": null
     20	  },
      …
14. Bash: node -e "const j=require('/Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/contract-lock.json');console.log(JSON.stringify({v:j.contractVersion,rev:j.revision,keys:Object.keys(j)},null,1))"
   → {
      "keys": [
       "apiVersion",
       "sourceRevision",
       "generatedBy",
       "engineSha256",
       "sourceFiles",
       "libraries"
      ]
     }
15. Glob: references/*.md
   → /Users/marcoslisboa/Development/provia-plugin/references/country-context.md
     /Users/marcoslisboa/Development/provia-plugin/references/entity-design.md
     /Users/marcoslisboa/Development/provia-plugin/references/metadata-fields.md
     /Users/marcoslisboa/Development/provia-plugin/references/next-step.md
     /Users/marcoslisboa/Development/provia-plugin/references/entity-catalogue-format.md
     /Users/marcoslisboa/Development/provia-plugin/references/workflow-access.md
     /Users/marcoslisboa/Development/provia-plugin/references/action-configs.md
     /Users/marcoslisboa/Development/provia-plugin/references/connected-mo …
16. Bash: node -e "const j=require('/Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/contract-lock.json');console.log(j.apiVersion, j.sourceRevision, j.generatedBy)"; node -e "const p=require('/Users/marcoslisboa/Development/provia-plugin/package.json');console.log(p.name,p.version)" 2>/dev/null || true
   → provia.ao/v1 fed8efaf019abc901cb2b229f3676dc4031126fa scripts/build-contract.mjs
     provia-skills 1.2.1
17. Grep: form|Formulário
   → 7:Entity and workflow metadata support the [19 field types](metadata-fields.md), including server-generated `auto_number` and dependent selections configured on `select`/`multi_select`. Form schemas have separate limits.
     9:Supported action types: Standard, Decision, Sub-workflow, Notification, Wait, HTTP Request and Form Fill. AI agents are assignees on Standard actions. Decisions have named outcomes: continue, cancel the incident, trigger another workflow or return to an action. Do not promise arbitrary BPMN gateways or automatic value-based branching. Standard actions should say what evidenc …
