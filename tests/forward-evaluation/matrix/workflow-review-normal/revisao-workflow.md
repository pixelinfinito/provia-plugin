# Revisão de workflow antes da publicação

Data: 2026-09-21 · Competência: `provia-workflow-review` · País (provisório, não confirmado): Angola · Língua: pt-AO

## 1. Estado da revisão: sem workflow para rever

Nenhum workflow chegou a esta sessão. Factos verificados:

| Verificação | Resultado |
| --- | --- |
| Directório de trabalho (`workflow-review-normal/`) | Vazio: sem `workflow.yaml`, sem `provia-project.json`, sem SOP, sem exportação |
| Leitura da organização Provia (`org_get_context`) | Pedida e **recusada** nesta sessão; a lista de workflows do tenant não foi lida |
| Gate de acções (`node scripts/review-actions.mjs workflow.yaml`) | **Não corrido** — o script exige um ficheiro (`Usage: node scripts/review-actions.mjs workflow.yaml [--markdown]`, exit 2) |
| Verificação de acesso (`node scripts/build-project-map.mjs provia-project.json --check`) | **Não corrida** — não existe manifesto |
| Validador estrutural (`node scripts/validate-workflow.mjs`) | **Não corrido** |

Consequência: não há resultados de revisão, nem lista de achados, nem prontidão para publicação. Nada abaixo é um achado sobre o vosso workflow; é o protocolo que será aplicado assim que o ficheiro existir, escrito à volta das duas perguntas colocadas (etapas sem responsável, caminhos de rejeição em falta).

Não foi criado `provia-project.json`: sem fontes, grupos ou acções reais, qualquer manifesto seria inventado.

## 2. O que é preciso entregar para a revisão correr

Mínimo: o `workflow.yaml` (exportação do Provia ou pacote gerado). Para responder às duas perguntas com evidência, e não só por inspecção:

1. `workflow.yaml` — exportação da versão candidata a publicação.
2. `provia-project.json` — manifesto com `groups[]`, `workflows[].actions[].assigneeRef` e `workflows[].access`. Sem ele, a pergunta «quem é o responsável» só pode ser respondida pelo que o YAML carrega (`assignee`), não por chave de grupo.
3. O procedimento/SOP de origem — sem ele, uma decisão sem ramo de rejeição é uma suspeita, não um defeito: só o procedimento diz se a rejeição é exigida.

Em alternativa, autorizar a leitura ligada (`org_get_context` → `workflows_list` → `workflow_export_yaml`, `workflow_get` com `includeAccess`, `groups_list`) e indicar qual dos workflows está para publicar.

## 3. Protocolo que será aplicado

### 3.1 Etapas sem responsável

Por cada acção do YAML, na ordem de execução:

| Critério | Como se verifica | Severidade |
| --- | --- | --- |
| Acção Standard/Decision/Form Fill sem `assignee` | Campo ausente ou vazio no YAML; `assigneeRef` ausente no manifesto | Erro de contrato — bloqueia |
| `assigneeRef: field:<campo>` sem `assigneeFallback` | `--check` (regra de `field:`): o campo tem de existir, ser do tipo `user`, e ter fallback (`creator` ou grupo `role`) | Erro — bloqueia |
| Grupo referido que não existe em `groups[]` | `--check` regra 1 | Erro — bloqueia |
| Grupo referido sem membros verificados | `groups[].members[].verified` ausente/false | Aviso: «não se consegue determinar quem executa» |
| Grupo que não é dono de nenhuma acção | Cruzamento `groups[]` × `assigneeRef` | Aviso (grupo inútil ou acção em falta) |
| Mesmo grupo que prepara e decide o mesmo pedido | Cruzamento de assignees entre a acção de preparação e a Decision seguinte | Sinal de segregação — vai para `decisions[]` com dono |
| Acções automáticas (notification, wait, http_request, sub_workflow) | Não têm responsável humano; verifica-se antes quem é dono da acção que trata a falha (ver 3.3) | — |

Resultado esperado: tabela «acção → responsável → evidência de conclusão → `due`». Uma linha sem responsável ou sem evidência é um achado.

### 3.2 Caminhos de rejeição em falta

Por cada acção do tipo `decision`:

| Critério | Como se verifica |
| --- | --- |
| Só existe o ramo «Aprovar» | `config.branches` com uma única saída, ou todas as saídas convergindo na mesma acção seguinte |
| Rejeição existe mas termina o caso sem informar o requerente | Ramo «Rejeitar» sem notificação/acção que devolva o resultado a quem abriu o pedido |
| Devolução para correcção («Devolver») em falta quando o SOP a prevê | Comparação com o procedimento: se o SOP fala em «corrigir e reapresentar», falta um ramo que regresse à acção de preparação |
| Ramo de rejeição sem comentário obrigatório | A `description` da Decision não exige, em `Evidência:`, o motivo em «Rejeitar»/«Devolver» |
| Ciclo de devolução sem limite ou sem contagem | Devolução que volta ao início sem indicação de quem decide após a segunda devolução — pergunta de política, não erro de ficheiro |
| Autoridade por limiar não modelada | A `description` cita «acima de X Kz decide Y», mas não existe ramo nem acção para essa autoridade — pergunta de política com dono |

Cada decisão sem rejeição é classificada de uma de três formas, nunca misturadas:

- **Erro de contrato** — o ficheiro não é válido (ramo aponta para acção inexistente, decisão sem ramos).
- **Lacuna de política** — o SOP exige rejeição/devolução e o desenho não a tem; regista-se em `decisions[]` com o dono do processo.
- **Melhoria opcional** — o SOP não exige, mas a experiência recomenda (ex.: comentário obrigatório na rejeição).

### 3.3 O resto do procedimento da competência (aplicado no mesmo passe)

1. Rastrear cada resultado exigido pelo SOP a uma acção e à sua evidência de conclusão; cada passo classificado da fonte é uma acção ou está dobrado (`folded[]`) numa.
2. Gate por acção: partes em falta do brief de cinco partes (`Tarefa`, `Como`, `Evidência`, `Concluído quando`, `Excepções`), notas de implementador que vazaram para a `description`, descrições acima de 5000 caracteres, `due` não definido. Depois, revisão semântica de nome (verbo + objecto) e concordância com o tipo.
3. Predecessores, acções paralelas, base do `due` (`activation` vs outra), comportamento em cancelamento, grupos indisponíveis.
4. Acesso: `--check` regras 1–8; prontidão falha em 1, 3, 5, ramos de erro de 4 e 8, `field:` sem fallback, grants retidos bloqueantes. Workflow `restricted` com `create_incident`: registar a limitação «quem inicia vê todos os casos» em `access.note`.
5. Form Fill sem `formRef`; referências a entidades inexistentes; segredos e domínios HTTP dependentes de configuração manual.
6. Para cada http_request/sub_workflow: quem é dono da acção quando a integração falha (retry, notificação, acção manual de recuperação).

### 3.4 Cenários de teste que o relatório final devolve

| Cenário | Resultado visível esperado (a preencher com as acções reais) |
| --- | --- |
| Normal | Caso criado → cada acção concluída pelo responsável indicado com a evidência anexada → caso fechado com estado de aprovação |
| Rejeitado | Decision escolhe «Rejeitar» com comentário → requerente notificado com o motivo → caso fechado como rejeitado, sem acções de execução iniciadas |
| Incompleto | Decision escolhe «Devolver» → acção de preparação reaberta ao requerente → nova submissão → nova decisão |
| Integração falhada | http_request falha → acção de recuperação atribuída ao grupo dono → caso não fica bloqueado silenciosamente |

## 4. Comandos a correr quando o ficheiro chegar

Terminal, a partir da raiz do plugin (`/Users/marcoslisboa/Development/provia-plugin`), Node 20.11+, sem rede. `<dir>` é este directório de trabalho.

```bash
node scripts/review-actions.mjs <dir>/workflow.yaml --markdown
node scripts/validate-workflow.mjs <dir>/workflow.yaml
node scripts/build-project-map.mjs <dir>/provia-project.json --check
node scripts/build-project-map.mjs <dir>/provia-project.json --output <dir>/project.html
```

## 5. Estado final

- **Confirmado:** nenhum workflow, manifesto ou SOP nesta sessão; leitura ligada recusada; nenhum script corrido sobre dados reais.
- **Pendente:** toda a revisão. A validação do destino e a publicação ficam, como sempre, na UI do Provia por pessoa autorizada.
- **Decisões abertas:** nenhuma registada — não existe manifesto nem processo identificado onde registá-las.
