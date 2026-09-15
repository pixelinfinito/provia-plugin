# Recommend the next step in chat

After completing a skill, end the final chat response with one short, optional recommendation that advances the user's current workflow. Include the exact next skill name, why it is useful now, and a copyable invocation containing the relevant artifact or result from this task. Write it in the user's response language. Put it in the final chat response, not only in an attached report or intermediate commentary.

Choose by what is missing, not by a fixed sequence. Carry the agreed design, country context, decisions and unresolved dependencies forward. Do not recommend repeating completed work without a reason. When several paths are possible, recommend the most useful next step and briefly state the condition for an alternative. Workflow design is iterative; data, forms, AI and integrations can feed back into it.

## Choose the next skill

| Current need after this task | Recommended skill |
| --- | --- |
| Process scope or pilot is still unclear | `provia-process-discovery` |
| Discovery is agreed, or specialist designs need integrating into actions and decisions | `provia-workflow-designer` |
| Data objects, fields or mappings need definition | `provia-information-model` |
| Intake or an action requires a form specification | `provia-form-designer` |
| Notifications, waits, APIs, triggers or sub-workflows need design | `provia-automation-designer` |
| An AI task needs a bounded output, profile or review policy | `provia-ai-action-designer` |
| The agreed design needs YAML, or identified YAML errors need repair | `provia-workflow-package` |
| Design or package is ready for business, editorial and exception review | `provia-workflow-review` |
| A reviewed pilot needs ownership, training or adoption planning | `provia-organization-rollout` |
| Current incidents need an evidence-based attention list | `provia-operations-triage` |
| Sufficient comparable execution records exist to investigate performance | `provia-process-improvement` |
| Policy requirements need mapping to controls and evidence | `provia-controls-evidence` |
| Approved process instructions, runbooks or knowledge need maintenance | `provia-process-knowledge` |
| Findings require changes to an existing workflow and impact assessment | `provia-workflow-change` |

If progress depends on missing evidence or a decision, explain that dependency in the suggested request. Do not imply it has been resolved. If no further skill adds value, say so and recommend the concrete next action, such as destination configuration, Provia import preview, a pilot, or collecting execution records. Do not force another skill solely to keep the conversation going.

## Provide an invocation the user can copy

A natural-language request works across supported hosts and is the default when host command syntax is unknown:

```text
Use provia-form-designer with the workflow design above. Specify the receipt form, its Form Fill action name, fields and mappings. Preserve the agreed responsibilities. Country: Angola; reply in pt-AO.
```

In Claude Code, the corresponding skill invocation is `/provia-skills:provia-form-designer` followed by that task context. Do not present Claude's namespace as a universal ChatGPT/Codex command. A copied chat request is an instruction for the assistant, not a terminal command. Never invent a Provia CLI command.

If a real shell command is the immediate next step, label it as a terminal command and give the working directory and actual file path. For example, when validation could not run, from the plugin root: `node scripts/validate-workflow.mjs workflow.yaml`. Do not recommend rerunning successful validation unless the file changed or another concrete concern requires it.

Example final paragraph in pt-AO, followed by a copyable request:

> Próximo passo recomendado: `provia-form-designer`, para definir a recolha de dados necessária antes de concluir o desenho do workflow.

```text
Use provia-form-designer com o desenho acima. Defina o formulário de recepção, o nome da acção Form Fill e os mapeamentos. Preserve as responsabilidades acordadas. País: Angola; responda em pt-AO.
```

This is a suggestion, not automatic invocation, a prerequisite for every workflow, or authorization to configure or publish anything. If the user explicitly requested an end-to-end task, continue the already authorized work and recommend only what remains when that task is finished; do not stop after each skill to seek permission.
