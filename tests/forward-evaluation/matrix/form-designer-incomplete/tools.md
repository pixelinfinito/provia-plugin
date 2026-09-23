# Tool calls

1. Skill: provia-skills:provia-form-designer
   → Launching skill: provia-skills:provia-form-designer
2. Read: /Users/marcoslisboa/Development/provia-plugin/references/skill-conventions.md
   → 1	# Shared conventions for every Provia skill
     2	
     3	Every `SKILL.md` in this plugin is generated from `catalog.json` and starts by pointing here. These rules apply to all skills; a skill file repeats only what is specific to its task.
     4	
     5	## Country and language
     6	
     7	Country, jurisdiction, response language, currency and timezone are separate choices. Read [country context](country-context.md) before relying on any of them, and the [Angola reference](countries/angola.md) when Angola applies. If no country is supplied, disclose Angola as a provisional starting context. Respect an explicit langu …
3. Read: /Users/marcoslisboa/Development/provia-plugin/references/metadata-fields.md
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
4. Read: /Users/marcoslisboa/Development/provia-plugin/references/action-writing.md
   → 1	# Write and review action names and descriptions
     2	
     3	Read the source procedure and the action's purpose, type, instructions and configuration before choosing a verb.
     4	
     5	## Name the work
     6	
     7	Write every action name as a concise instruction describing the work expected. In Portuguese, start with an infinitive verb; in English, start with a base-form action verb. Use a verb, an object and only the qualifier needed to identify the task. Aim for 3–10 words and roughly 80 characters when meaning permits. These are editorial guidelines, not Provia contract limits.
     8	
     9	Do not copy an actor-led  …
5. Bash: ls -la /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-nqJA5s/form-designer-incomplete
   → total 0
     drwxr-xr-x@ 2 marcoslisboa  staff  64 Sep 23 09:54 .
     drwx------@ 3 marcoslisboa  staff  96 Sep 23 09:54 ..
6. Read: /Users/marcoslisboa/Development/provia-plugin/references/project-manifest.md
   → 1	# Project manifest (`provia-project/v1.1`)
     2	
     3	One implementation project has one manifest, `provia-project.json`. Every skill reads it before starting and appends its result to it, so entity types, groups, workflow actions, forms and decisions are one graph rather than a folder of unrelated files. The map renderer draws that graph; `setup.md` is generated from what the manifest still leaves unresolved; the connected-mode `apply` steps consume it in dependency order.
     4	
     5	This file is a plugin artefact. It is not a Provia import format and it never carries credentials or secret values. Its  …
7. Read: /Users/marcoslisboa/Development/provia-plugin/references/provia-capabilities.md
   → 1	# Provia capability baseline
     2	
     3	Baseline: workflow contract revision recorded in contracts/workflow-v1/contract-lock.json. This is implementation evidence, not proof of the version deployed in a customer environment.
     4	
     5	A Workflow defines a repeatable process. An Incident is one execution of a workflow. An Action is one step. Entities hold reusable business records, metadata holds structured case values, tags classify records, and pages/files/comments provide explanation and evidence. Explain “incident” as a process case when the business context is not emergency response.
     6	
     7	Entity an …
8. Read: /Users/marcoslisboa/Development/provia-plugin/references/next-step.md
   → 1	# Recommend the next step in chat
     2	
     3	After completing a skill, end the final chat response with one short, optional recommendation that advances the user's current workflow. Include the exact next skill name, why it is useful now, and a copyable invocation containing the relevant artifact or result from this task. Write it in the user's response language. Put it in the final chat response, not only in an attached report or intermediate commentary.
     4	
     5	Choose by what is missing, not by a fixed sequence. Carry the agreed design, country context, decisions and unresolved dependencies forward …
9. Read: /Users/marcoslisboa/Development/provia-plugin/references/country-context.md
   → 1	# Country context
     2	
     3	Establish country of operation, applicable jurisdiction, response language, currency, timezone, sector and the organization’s own policy. Do not derive jurisdiction from the language of a document. If no country is supplied, disclose Angola as a provisional starting context. Ask before relying on a jurisdiction for a legal conclusion. An English conversation can still concern Angola; Portuguese can concern another country.
     4	
     5	Use Angolan Portuguese for Portuguese outputs in the Angola context. Prefer utilizador, ficheiro, equipa, registo, ecrã, descarregar and protec …
10. Bash (error): ls /Users/marcoslisboa/Development/provia-plugin/references /Users/marcoslisboa/Development/provia-plugin/scripts /Users/marcoslisboa/Development/provia-plugin
   → ls in '/Users/marcoslisboa/Development/provia-plugin/references' was blocked. For security, Claude Code may only list files in the allowed working directories for this session: '/private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-nqJA5s/form-designer-incomplete'.
11. Read: /Users/marcoslisboa/Development/provia-plugin/references/workflow-access.md
   → 1	# Workflow access (`workflows[].access`)
     2	
     3	Who may see and open a workflow is design data, declared in the manifest, reviewed with the customer in the Acesso tab of `project.html`, checked by `--check` and applied either through the `access` section of the portable YAML (browser import) or through `workflow_access_apply` (connected mode). Silence is never an accident: a workflow without an `access` section fails `--check`.
     4	
     5	## What the product does
     6	
     7	- Levels are `view` < `create_incident` < `edit` < `admin`, cumulative, one level per grant; the list is published at `GET /api/v1/pe …
12. Glob: /Users/marcoslisboa/Development/provia-plugin/{references,scripts}/*
   → /Users/marcoslisboa/Development/provia-plugin/scripts/check-contract.mjs
     /Users/marcoslisboa/Development/provia-plugin/references/country-context.md
     /Users/marcoslisboa/Development/provia-plugin/references/entity-icons.json
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-contract.mjs
     /Users/marcoslisboa/Development/provia-plugin/references/entity-design.md
     /Users/marcoslisboa/Development/provia-plugin/scripts/validate-workflow.mjs
     /Users/marcoslisboa/Development/provia-plugin/references/metadata-fields.md
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-entity-catalogue. …
13. Read: /Users/marcoslisboa/Development/provia-plugin/references/project-manifest.schema.json
   → 1	{
     2	  "$schema": "https://json-schema.org/draft/2020-12/schema",
     3	  "$id": "https://docs.provia.ao/schemas/provia-project-v1.1.json",
     4	  "title": "Provia project manifest (provia-project/v1.1)",
     5	  "description": "One implementation project: sources, entity types, groups, workflows with access, forms, AI profiles, decisions and connected-mode receipts. Plugin artefact; never a Provia import format. scripts/build-project-map.mjs --check is authoritative for cross-references and the access rules; this schema describes the shape. The alternate shapes it lists (section strings, source#anchor  …
14. Bash: node -e "const l=require('/Users/marcoslisboa/Development/provia-plugin/contracts/workflow-v1/contract-lock.json');console.log(JSON.stringify({rev:l.revision||l.sourceRevision||Object.keys(l).slice(0,12)},null,1))"
   → {
      "rev": "fed8efaf019abc901cb2b229f3676dc4031126fa"
     }
15. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-nqJA5s/form-designer-incomplete/provia-project.json
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-nqJA5s/form-designer-incomplete/provia-project.json (file state is current in your context — no need to Read it back)
16. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs provia-project.json --check
   → info workflows[0].access: Assigned group suporte-ti holds no workflow grant: its members see the cases that carry their actions (rule 4)
     Manifest ti-autoservico: 1 workflows, 1 groups, 0 entity types, 1 forms; access declared on 1/1, 0 readiness block(s), 0 unresolved actor/entity key(s); 16 pending item(s), 0 warning(s), 1 info(s). Plugin artefact only; nothing was created in Provia.
17. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs provia-project.json --setup setup.md && node /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs provia-project.json --output project.html && ls -la
   → info workflows[0].access: Assigned group suporte-ti holds no workflow grant: its members see the cases that carry their actions (rule 4)
     Manifest ti-autoservico: 1 workflows, 1 groups, 0 entity types, 1 forms; access declared on 1/1, 0 readiness block(s), 0 unresolved actor/entity key(s); 16 pending item(s), 0 warning(s), 1 info(s). Plugin artefact only; nothing was created in Provia. Handover written to setup.md.
     info workflows[0].access: Assigned group suporte-ti holds no workflow grant: its members see the cases that carry their actions (rule 4)
     Manifest ti-autoservico: 1 workflows, 1 group …
18. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-nqJA5s/form-designer-incomplete/form-it-request.md
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-nqJA5s/form-designer-incomplete/form-it-request.md (file state is current in your context — no need to Read it back)
19. Read: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-nqJA5s/form-designer-incomplete/setup.md
   → 1	# Self-service IT requests: Setup handover
     2	
     3	Angola · en · Africa/Luanda. Generated from `provia-project.json` (provia-skills/1.2.1, 2026-09-23).
     4	
     5	## Status
     6	
     7	Mode: manual configuration (no receipts recorded).
     8	
     9	## Pending configuration
     10	
     11	| Where | Item | What to do |
     12	| --- | --- | --- |
     13	| pedidos-ti | IT support request | Import the YAML as a draft and review the preview |
     14	| pedidos-ti | IT support request | Apply the access grants (`workflow_access_apply`, dry run first) or confirm the `access` section in the import preview. organization → create_incident |
     15	|  …
