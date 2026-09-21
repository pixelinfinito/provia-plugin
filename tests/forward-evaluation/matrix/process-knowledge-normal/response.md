Não consegui actualizar o procedimento: o pedido refere «este procedimento», «o workflow aprovado» e «estas lições do piloto», mas o directório de trabalho estava vazio (sem `workflow.yaml`, manifesto, procedimento nem registo de lições) e a leitura da organização Provia via `org_get_context` não foi autorizada nesta sessão. Reescrever instruções de acções sem essas fontes seria inventar acções, responsáveis, evidências e autoridades de aprovação, o que as regras do skill proíbem. Assumi Angola / pt-AO a título provisório.

## O que ficou no directório de trabalho

| Ficheiro | Conteúdo | Estado |
| --- | --- | --- |
| `procedimento-actualizado.md` | Rascunho estrutural: fontes a citar, modelo de instrução em cinco partes (Tarefa / Como / Evidência / Concluído quando / Excepções), tabela de classificação das lições (instrução, conhecimento estável, facto do caso, contorno, alteração de desenho), registo de conflitos, alterações propostas fora do procedimento, responsável e ciclo de revisão | Rascunho; secções de conteúdo vazias de propósito |
| `memoria-agente-proposta.md` | Critérios de entrada na Memória do Agente, três documentos a propor quando houver fonte, o que fica fora | Rascunho; sem conteúdo aprovado; exige revisão de administrador |
| `provia-project.json` | Manifesto novo (`procedimento-piloto`) com as decisões D1–D5 | Passou em `build-project-map.mjs --check`: 0 workflows, 5 itens pendentes, 0 avisos |
| `setup.md`, `project.html` | Gerados a partir do manifesto | Só reflectem as decisões em aberto |

O `--check` valida apenas o manifesto; não valida os ficheiros Markdown. `review-actions.mjs` não foi corrido porque não há `workflow.yaml`.

## Decisões em aberto (donos no manifesto)

- **D1** — qual é o workflow aprovado (versão publicada, data): entregar o YAML exportado ou autorizar `workflows_list` / `workflow_export_yaml`.
- **D2** — quais são as lições do piloto, cada uma com caso de origem, data e autor.
- **D3** — qual é o procedimento em vigor e quem o aprova e mantém.
- **D4** — confirmar país e língua.
- **D5** — autorizar a leitura da organização Provia, ou trabalhar em modo desligado com os ficheiros entregues.

Nota: vários conectores MCP deste anfitrião (Cloudflare, Figma, Slack, Salesforce, etc.) exigem autorização prévia nas definições de conectores do claude.ai; nenhum era necessário para esta tarefa.

## Próximo passo recomendado

Repetir `provia-process-knowledge` assim que as três fontes existirem no directório de trabalho; o rascunho e o manifesto já têm o lugar de cada coisa. Se o workflow ainda não tiver versão publicada, o passo anterior é `provia-workflow-package` para exportar/validar o YAML.

```text
Use provia-process-knowledge com o manifesto provia-project.json deste directório. Fontes: workflow.yaml (versão publicada em <data>), procedimento-<nome>.md (versão <n>) e licoes-piloto.md (uma lição por linha, com caso, data e autor). Reescreva as instruções de cada acção em cinco partes, classifique cada lição pelo destino da secção 5, registe os conflitos com política em decisions[] e proponha a memória do agente. Resolva D1 a D5. País: Angola; responda em pt-AO.
```