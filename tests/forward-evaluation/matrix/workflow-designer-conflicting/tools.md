# Tool calls

1. Skill: provia-skills:provia-workflow-designer
   → Launching skill: provia-skills:provia-workflow-designer
2. Read: /Users/marcoslisboa/Development/provia-plugin/references/skill-conventions.md
   → 1	# Shared conventions for every Provia skill
     2	
     3	Every `SKILL.md` in this plugin is generated from `catalog.json` and starts by pointing here. These rules apply to all skills; a skill file repeats only what is specific to its task.
     4	
     5	## Country and language
     6	
     7	Country, jurisdiction, response language, currency and timezone are separate choices. Read [country context](country-context.md) before relying on any of them, and the [Angola reference](countries/angola.md) when Angola applies. If no country is supplied, disclose Angola as a provisional starting context. Respect an explicit langu …
3. Read: /Users/marcoslisboa/Development/provia-plugin/references/workflow-design-output.md
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
5. Read: /Users/marcoslisboa/Development/provia-plugin/references/workflow-access.md
   → 1	# Workflow access (`workflows[].access`)
     2	
     3	Who may see and open a workflow is design data, declared in the manifest, reviewed with the customer in the Acesso tab of `project.html`, checked by `--check` and applied either through the `access` section of the portable YAML (browser import) or through `workflow_access_apply` (connected mode). Silence is never an accident: a workflow without an `access` section fails `--check`.
     4	
     5	## What the product does
     6	
     7	- Levels are `view` < `create_incident` < `edit` < `admin`, cumulative, one level per grant; the list is published at `GET /api/v1/pe …
6. Read: /Users/marcoslisboa/Development/provia-plugin/references/groups-design.md
   → 1	# Groups derived from the sources
     2	
     3	Provia assigns work to users or groups, and groups may have one level of sub-groups. `provia-organization-rollout` turns every actor named in the sources into a proposed group **as data** in `groups[]` of the project manifest, so that `workflow-designer` and `workflow-package` can reference owners by key and connected mode can create them with `groups_apply_plan`.
     4	
     5	## For every actor in the sources
     6	
     7	Scan the SOPs, policies, checklists and org charts for who acts: «chefia», «Finanças», «DG», «Compras», «o requerente», «RH». For each one produce:
      …
7. Read: /Users/marcoslisboa/Development/provia-plugin/references/project-manifest.md
   → 1	# Project manifest (`provia-project/v1.1`)
     2	
     3	One implementation project has one manifest, `provia-project.json`. Every skill reads it before starting and appends its result to it, so entity types, groups, workflow actions, forms and decisions are one graph rather than a folder of unrelated files. The map renderer draws that graph; `setup.md` is generated from what the manifest still leaves unresolved; the connected-mode `apply` steps consume it in dependency order.
     4	
     5	This file is a plugin artefact. It is not a Provia import format and it never carries credentials or secret values. Its  …
8. Read: /Users/marcoslisboa/Development/provia-plugin/references/next-step.md
   → 1	# Recommend the next step in chat
     2	
     3	After completing a skill, end the final chat response with one short, optional recommendation that advances the user's current workflow. Include the exact next skill name, why it is useful now, and a copyable invocation containing the relevant artifact or result from this task. Write it in the user's response language. Put it in the final chat response, not only in an attached report or intermediate commentary.
     4	
     5	Choose by what is missing, not by a fixed sequence. Carry the agreed design, country context, decisions and unresolved dependencies forward …
9. Read: /Users/marcoslisboa/Development/provia-plugin/references/provia-capabilities.md
   → 1	# Provia capability baseline
     2	
     3	Baseline: workflow contract revision recorded in contracts/workflow-v1/contract-lock.json. This is implementation evidence, not proof of the version deployed in a customer environment.
     4	
     5	A Workflow defines a repeatable process. An Incident is one execution of a workflow. An Action is one step. Entities hold reusable business records, metadata holds structured case values, tags classify records, and pages/files/comments provide explanation and evidence. Explain “incident” as a process case when the business context is not emergency response.
     6	
     7	Entity an …
10. Read: /Users/marcoslisboa/Development/provia-plugin/references/country-context.md
   → 1	# Country context
     2	
     3	Establish country of operation, applicable jurisdiction, response language, currency, timezone, sector and the organization’s own policy. Do not derive jurisdiction from the language of a document. If no country is supplied, disclose Angola as a provisional starting context. Ask before relying on a jurisdiction for a legal conclusion. An English conversation can still concern Angola; Portuguese can concern another country.
     4	
     5	Use Angolan Portuguese for Portuguese outputs in the Angola context. Prefer utilizador, ficheiro, equipa, registo, ecrã, descarregar and protec …
11. Bash (error): ls -la /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-R0RuLV/workflow-designer-conflicting; echo ---; ls /Users/marcoslisboa/Development/provia-plugin; echo ---; ls /Users/marcoslisboa/Development/provia-plugin/scripts; echo ---; node --version
   → This Bash command contains multiple operations. The following parts require approval: ls /Users/marcoslisboa/Development/provia-plugin, ls /Users/marcoslisboa/Development/provia-plugin/scripts
12. Bash: ls -la /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-R0RuLV/workflow-designer-conflicting
   → total 0
     drwxr-xr-x@ 2 marcoslisboa  staff  64 Sep 23 09:50 .
     drwx------@ 3 marcoslisboa  staff  96 Sep 23 09:50 ..
13. Glob: scripts/*.mjs
   → /Users/marcoslisboa/Development/provia-plugin/scripts/check-contract.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-contract.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/validate-workflow.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-entity-catalogue.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/build-skills.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/run-skill-evaluations.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/emit-workflow-access.mjs
     /Users/marcoslisboa/Development/provia-plugin/scripts/plan-workflow …
14. Bash (error): cd /Users/marcoslisboa/Development/provia-plugin && grep -n "assigneeRef" scripts/build-project-map.mjs | head -60
   → This Bash command contains multiple operations. The following part requires approval: cd /Users/marcoslisboa/Development/provia-plugin && grep -n "assigneeRef" scripts/build-project-map.mjs
15. Read: /Users/marcoslisboa/Development/provia-plugin/references/project-manifest.schema.json
   → 1	{
     2	  "$schema": "https://json-schema.org/draft/2020-12/schema",
     3	  "$id": "https://docs.provia.ao/schemas/provia-project-v1.1.json",
     4	  "title": "Provia project manifest (provia-project/v1.1)",
     5	  "description": "One implementation project: sources, entity types, groups, workflows with access, forms, AI profiles, decisions and connected-mode receipts. Plugin artefact; never a Provia import format. scripts/build-project-map.mjs --check is authoritative for cross-references and the access rules; this schema describes the shape. The alternate shapes it lists (section strings, source#anchor  …
16. Read: /Users/marcoslisboa/Development/provia-plugin/references/workflow-yaml.md
   → 1	# Portable workflow YAML
     2	
     3	Emit `apiVersion: provia.ao/v1` and `kind: Workflow`, preceded by a first-line comment `# provia-skills <plugin version>` so an import can be attributed to the plugin (the product records only what its schema knows; the comment is the attribution until `metadata.source` exists). The legacy `provia.io/v1` alias is readable but should not be generated. Allowed top-level sections are metadata, triggers, entities, fields, access and actions. Unknown top-level keys are errors (`schema.unknown_key`); a `permissions:` key never validates. Nested unknown keys are warnin …
17. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-R0RuLV/workflow-designer-conflicting/workflow.yaml
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-R0RuLV/workflow-designer-conflicting/workflow.yaml (file state is current in your context — no need to Read it back)
18. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-R0RuLV/workflow-designer-conflicting/provia-project.json
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-R0RuLV/workflow-designer-conflicting/provia-project.json (file state is current in your context — no need to Read it back)
19. Bash (error): node /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-R0RuLV/workflow-designer-conflicting/provia-project.json --check; echo "EXIT=$?"
   → This Bash command contains multiple operations. The following part requires approval: echo "EXIT=$?"
20. Bash: node /Users/marcoslisboa/Development/provia-plugin/scripts/build-project-map.mjs /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-R0RuLV/workflow-designer-conflicting/provia-project.json --check
   → warning workflows[0].actions[1].assigneeRef: Action decide_request has no owner
     warning groups.department_managers: Group department_managers owns no action
     warning groups.finance_director: Group finance_director owns no action
     Manifest approval: 1 workflows, 2 groups, 0 entity types, 0 forms; access declared on 1/1, 0 readiness block(s), 0 unresolved actor/entity key(s); 16 pending item(s), 3 warning(s), 0 info(s). Plugin artefact only; nothing was created in Provia.
21. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-R0RuLV/workflow-designer-conflicting/workflow-design.md
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-R0RuLV/workflow-designer-conflicting/workflow-design.md (file state is current in your context — no need to Read it back)
