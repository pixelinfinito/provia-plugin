Não consegui rever o workflow: não há nada para rever nesta sessão.

**O que verifiquei**

- O directório de trabalho está vazio — sem `workflow.yaml`, sem `provia-project.json`, sem procedimento de origem.
- A leitura ligada ao Provia (`org_get_context`, que permitiria listar e exportar o workflow do tenant) foi pedida e recusada nesta sessão.
- O gate de acções (`review-actions.mjs`) exige um ficheiro e não correu; o `--check` de acesso e o validador também não, por falta de manifesto e YAML.

**O que produzi**

`revisao-workflow.md` neste directório: o estado honesto da revisão (nada revisto), a lista mínima de entradas necessárias, e o protocolo que aplicarei às duas perguntas — critérios concretos para detectar etapas sem responsável (assignee em falta, `field:` sem fallback, grupo inexistente ou sem membros verificados, grupo que não é dono de nada, preparador = decisor) e caminhos de rejeição em falta (decisão só com «Aprovar», rejeição sem retorno ao requerente, devolução prevista no SOP mas não modelada, comentário não obrigatório) — com a separação entre erro de contrato, lacuna de política e melhoria opcional, os cenários de teste (normal, rejeitado, incompleto, integração falhada) e os comandos a correr.

Não criei manifesto: sem grupos, acções ou fontes reais, seria inventado.

**Assunções:** Angola como contexto provisório; resposta em pt-AO.

Próximo passo recomendado: a mesma competência, `provia-workflow-review`, assim que o ficheiro estiver disponível — ou autorizar a leitura ligada para eu exportar o workflow directamente do Provia. Copie o `workflow.yaml` (e, se existir, `provia-project.json` e o SOP) para este directório e peça:

```text
Use provia-workflow-review com o workflow.yaml, o provia-project.json e o procedimento de origem neste directório. Corra o gate de acções e o --check de acesso; procure etapas sem responsável e caminhos de rejeição em falta; registe as lacunas de política em decisions[] com dono. País: Angola; responda em pt-AO.
```