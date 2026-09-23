# Tool calls

1. Bash: ls -la /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-KW9VCJ/workflow-review-incomplete
   → total 0
     drwxr-xr-x@ 2 marcoslisboa  staff  64 Sep 23 09:59 .
     drwx------@ 3 marcoslisboa  staff  96 Sep 23 09:59 ..
2. Bash (error): ls ~/.claude/plugins 2>/dev/null; find ~/.claude -type d -name "provia-skills*" 2>/dev/null | head -20
   → This Bash command contains multiple operations. The following part requires approval: ls ~/.claude/plugins ; find ~/.claude -type d -name "provia-skills*"
3. Bash (error): ls -d ~/.claude/plugins/*/ 2>/dev/null; ls ~/.claude/ 2>/dev/null
   → This Bash command contains multiple operations. The following parts require approval: ls -d ~/.claude/plugins/*/, ls ~/.claude/
4. Glob: **/provia-workflow-review/SKILL.md
   → /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills~g3/skills/provia-workflow-review/SKILL.md
     /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/skills/provia-workflow-review/SKILL.md
     /Users/marcoslisboa/.claude/plugins/.trash/1789942601103-66196-hh31uX/provia-skills/skills/provia-workflow-review/SKILL.md
     /Users/marcoslisboa/.claude/plugins/.trash/1790153593761-86912-zi3YfJ/provia-skills~g3/skills/provia-workflow-review/SKILL.md
     /Users/m …
5. Read: /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/skills/provia-workflow-review/SKILL.md
   → 1	---
     2	name: provia-workflow-review
     3	description: "Review a Provia workflow for ownership, sequencing, evidence, exceptions, executable action briefs and publication readiness. Use when the user asks for \"review this workflow before we publish\", \"find steps without an owner\", \"can these actions run in parallel\", \"check the action instructions\", or says «revê este workflow antes de publicar», «há passos sem responsável», «faltam caminhos de rejeição», «as instruções das acções estão completas»."
     4	---
     5	
     6	<!-- Generated from catalog.json by scripts/build-skills.mjs. Edit the catalogu …
6. Read: /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/references/skill-conventions.md
   → 1	# Shared conventions for every Provia skill
     2	
     3	Every `SKILL.md` in this plugin is generated from `catalog.json` and starts by pointing here. These rules apply to all skills; a skill file repeats only what is specific to its task.
     4	
     5	## Country and language
     6	
     7	Country, jurisdiction, response language, currency and timezone are separate choices. Read [country context](country-context.md) before relying on any of them, and the [Angola reference](countries/angola.md) when Angola applies. If no country is supplied, disclose Angola as a provisional starting context. Respect an explicit langu …
7. Read: /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/references/action-writing.md
   → 1	# Write and review action names and descriptions
     2	
     3	Read the source procedure and the action's purpose, type, instructions and configuration before choosing a verb.
     4	
     5	## Name the work
     6	
     7	Write every action name as a concise instruction describing the work expected. In Portuguese, start with an infinitive verb; in English, start with a base-form action verb. Use a verb, an object and only the qualifier needed to identify the task. Aim for 3–10 words and roughly 80 characters when meaning permits. These are editorial guidelines, not Provia contract limits.
     8	
     9	Do not copy an actor-led  …
8. Read: /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/references/project-manifest.md
   → 1	# Project manifest (`provia-project/v1.1`)
     2	
     3	One implementation project has one manifest, `provia-project.json`. Every skill reads it before starting and appends its result to it, so entity types, groups, workflow actions, forms and decisions are one graph rather than a folder of unrelated files. The map renderer draws that graph; `setup.md` is generated from what the manifest still leaves unresolved; the connected-mode `apply` steps consume it in dependency order.
     4	
     5	This file is a plugin artefact. It is not a Provia import format and it never carries credentials or secret values. Its  …
9. Read: /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/references/workflow-access.md
   → 1	# Workflow access (`workflows[].access`)
     2	
     3	Who may see and open a workflow is design data, declared in the manifest, reviewed with the customer in the Acesso tab of `project.html`, checked by `--check` and applied either through the `access` section of the portable YAML (browser import) or through `workflow_access_apply` (connected mode). Silence is never an accident: a workflow without an `access` section fails `--check`.
     4	
     5	## What the product does
     6	
     7	- Levels are `view` < `create_incident` < `edit` < `admin`, cumulative, one level per grant; the list is published at `GET /api/v1/pe …
10. Read: /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/references/provia-capabilities.md
   → 1	# Provia capability baseline
     2	
     3	Baseline: workflow contract revision recorded in contracts/workflow-v1/contract-lock.json. This is implementation evidence, not proof of the version deployed in a customer environment.
     4	
     5	A Workflow defines a repeatable process. An Incident is one execution of a workflow. An Action is one step. Entities hold reusable business records, metadata holds structured case values, tags classify records, and pages/files/comments provide explanation and evidence. Explain “incident” as a process case when the business context is not emergency response.
     6	
     7	Entity an …
11. Read: /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/references/connected-mode.md
   → 1	# Connected mode (`provia-implementer` MCP)
     2	
     3	Provia's API Gateway exposes an MCP server, `provia-implementer`, specified in Provia feature 026 and extended by feature 027 (workflow permissions), pinned to the same product revision as this plugin's contract engine. When an implementer signs in through it, the skills can read the destination organization and create **draft** configuration on the implementer's behalf. This reference is the plugin side of that contract. Until the server is released in the implementer's environment, every skill behaves exactly as in disconnected mode; do not  …
12. ToolSearch: {"query":"select:mcp__claude_ai_Provia__org_get_context,mcp__claude_ai_Provia__workflows_list,mcp__claude_ai_Provia__workflow_get,mcp__claude_ai_Provia__workflow_export_yaml,mcp__claude_ai_Provia__gro
   → 
     
     
     
     
13. Read: /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/references/next-step.md
   → 1	# Recommend the next step in chat
     2	
     3	After completing a skill, end the final chat response with one short, optional recommendation that advances the user's current workflow. Include the exact next skill name, why it is useful now, and a copyable invocation containing the relevant artifact or result from this task. Write it in the user's response language. Put it in the final chat response, not only in an attached report or intermediate commentary.
     4	
     5	Choose by what is missing, not by a fixed sequence. Carry the agreed design, country context, decisions and unresolved dependencies forward …
14. mcp__claude_ai_Provia__org_get_context (error): {}
   → Claude requested permissions to use mcp__claude_ai_Provia__org_get_context, but you haven't granted it yet.
15. Bash (error): ls /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/scripts/
   → ls in '/Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/scripts' was blocked. For security, Claude Code may only list files in the allowed working directories for this session: '/private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-KW9VCJ/workflow-review-incomplete'.
16. Glob: scripts/*.mjs
   → /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/scripts/resolve-workflow-refs.mjs
     /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/scripts/plan-workflow-access.mjs
     /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c6/provia-skills/scripts/build-skills.mjs
     /Users/marcoslisboa/.claude/plugins/synced/7ffa3c95-47ec-460b-999e-e28ca70d760a_f21768ea-71be-4a4f-8733-4ec52ae868c …
