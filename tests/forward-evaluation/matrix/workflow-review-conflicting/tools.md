# Tool calls

1. Skill: provia-skills:provia-workflow-review
   → Launching skill: provia-skills:provia-workflow-review
2. Bash: ls -la /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-leIPjX/workflow-review-conflicting
   → total 0
     drwxr-xr-x@ 2 marcoslisboa  staff  64 Sep 18 19:21 .
     drwx------@ 3 marcoslisboa  staff  96 Sep 18 19:21 ..
3. Read: /Users/marcoslisboa/Development/provia-plugin/references/skill-conventions.md
   → 1	# Shared conventions for every Provia skill
     2	
     3	Every `SKILL.md` in this plugin is generated from `catalog.json` and starts by pointing here. These rules apply to all skills; a skill file repeats only what is specific to its task.
     4	
     5	## Country and language
     6	
     7	Country, jurisdiction, response language, currency and timezone are separate choices. Read [country context](country-context.md) before relying on any of them, and the [Angola reference](countries/angola.md) when Angola applies. If no country is supplied, disclose Angola as a provisional starting context. Respect an explicit langu …
4. Bash (error): ls -la /Users/marcoslisboa/Development/provia-plugin/skills/provia-workflow-review/ 2>/dev/null; echo "---scripts---"; find /Users/marcoslisboa/Development/provia-plugin -iname "review-actions.mjs" 2>/dev/null; echo "---contract---"; find /Users/marcoslisboa/Development/provia-plugin -iname "contract-lock.json" 2>/dev/null
   → This Bash command contains multiple operations. The following parts require approval: ls -la /Users/marcoslisboa/Development/provia-plugin/skills/provia-workflow-review/, find /Users/marcoslisboa/Development/provia-plugin -iname "review-actions.mjs", find /Users/marcoslisboa/Development/provia-plugin -iname "contract-lock.json"
5. Read: /Users/marcoslisboa/Development/provia-plugin/references/provia-capabilities.md
   → 1	# Provia capability baseline
     2	
     3	Baseline: workflow contract revision recorded in contracts/workflow-v1/contract-lock.json. This is implementation evidence, not proof of the version deployed in a customer environment.
     4	
     5	A Workflow defines a repeatable process. An Incident is one execution of a workflow. An Action is one step. Entities hold reusable business records, metadata holds structured case values, tags classify records, and pages/files/comments provide explanation and evidence. Explain “incident” as a process case when the business context is not emergency response.
     6	
     7	Entity an …
6. Read: /Users/marcoslisboa/Development/provia-plugin/references/project-manifest.md
   → 1	# Project manifest (`provia-project/v1`)
     2	
     3	One implementation project has one manifest, `provia-project.json`. Every skill reads it before starting and appends its result to it, so entity types, groups, workflow actions, forms and decisions are one graph rather than a folder of unrelated files. The map renderer draws that graph; `setup.md` is generated from what the manifest still leaves unresolved; the connected-mode `apply` steps consume it in dependency order.
     4	
     5	This file is a plugin artefact. It is not a Provia import format and it never carries credentials or secret values.
     6	
     7	# …
7. Read: /Users/marcoslisboa/Development/provia-plugin/references/action-writing.md
   → 1	# Write and review action names and descriptions
     2	
     3	Read the source procedure and the action's purpose, type, instructions and configuration before choosing a verb.
     4	
     5	## Name the work
     6	
     7	Write every action name as a concise instruction describing the work expected. In Portuguese, start with an infinitive verb; in English, start with a base-form action verb. Use a verb, an object and only the qualifier needed to identify the task. Aim for 3–10 words and roughly 80 characters when meaning permits. These are editorial guidelines, not Provia contract limits.
     8	
     9	Do not copy an actor-led  …
8. Read: /Users/marcoslisboa/Development/provia-plugin/references/next-step.md
   → 1	# Recommend the next step in chat
     2	
     3	After completing a skill, end the final chat response with one short, optional recommendation that advances the user's current workflow. Include the exact next skill name, why it is useful now, and a copyable invocation containing the relevant artifact or result from this task. Write it in the user's response language. Put it in the final chat response, not only in an attached report or intermediate commentary.
     4	
     5	Choose by what is missing, not by a fixed sequence. Carry the agreed design, country context, decisions and unresolved dependencies forward …
9. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-leIPjX/workflow-review-conflicting/review-findings.md
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-leIPjX/workflow-review-conflicting/review-findings.md (file state is current in your context — no need to Read it back)
10. Write: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-leIPjX/workflow-review-conflicting/provia-project.json
   → File created successfully at: /private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-leIPjX/workflow-review-conflicting/provia-project.json (file state is current in your context — no need to Read it back)
