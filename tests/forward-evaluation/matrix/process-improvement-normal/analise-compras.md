# Compras: onde se perde tempo e como testar uma melhoria

Data: 2026-09-21 · Skill: `provia-process-improvement` (provia-skills 1.2.0) · Modo: desligado (sem leitura da organização Provia)

## 0. Estado desta análise — leia primeiro

**Factos confirmados**

- O pedido refere «este relatório», mas a pasta de trabalho estava vazia: nenhum relatório, exportação de casos ou definição de métricas foi entregue. Nada foi lido de uma organização Provia (a chamada `org_get_context` não foi autorizada nesta sessão).
- Por isso, **nenhum número deste documento é um resultado**. Todas as quantificações estão marcadas como *incompletas*; o que está pronto é o método, as fórmulas, as hipóteses a testar e o plano de medição. Quando o relatório chegar, o script `calcular-tempos.mjs` produz os valores de forma reproduzível.
- Contexto provisório: Angola, pt-AO, fuso `Africa/Luanda`, moeda AOA. Nenhuma conclusão legal depende disto.

**Ficheiros produzidos**

| Ficheiro | Conteúdo | Verificação feita |
| --- | --- | --- |
| `analise-compras.md` | Este relatório | Nenhuma automática (é Markdown) |
| `calcular-tempos.mjs` | Cálculo reproduzível de ciclo, espera e trabalho activo a partir de um CSV | Executado com um CSV descartável de 2 casos para confirmar que corre; não é um resultado |
| `provia-project.json` | Manifesto do projecto com a fonte em falta e as decisões em aberto | `build-project-map.mjs --check` (ver resultado no fim) |
| `setup.md`, `project.html` | Handover e mapa gerados do manifesto | Gerados pelo mesmo script |

## 1. O que o relatório tem de conter antes de comparar períodos

Procedimento do skill, passo 1: cobertura temporal, fuso, duplicados, conclusões em falta e versões comparáveis. Verifique cada linha e registe o resultado; sem isto a comparação «antes vs. agora» não é defensável.

| Verificação | O que confirmar | Se falhar |
| --- | --- | --- |
| Períodos comparáveis | Dois intervalos de igual duração e com número semelhante de dias úteis (seg–sex; o Provia não conta feriados). | Reportar em dias úteis e indicar a diferença. |
| Fuso horário | Se as datas exportadas estão em UTC ou em `Africa/Luanda`. Um caso concluído às 00:30 pode mudar de dia e de período. | Converter tudo para um único fuso antes de classificar. |
| Duplicados | Uma linha por acção de um caso; o mesmo caso não aparece duas vezes (exportação por caso e por acção misturadas). | O script conta cada combinação caso+acção+activação uma vez e avisa. |
| Conclusões em falta | Casos ainda abertos e casos cancelados. | Abertos ficam fora das medianas (censura); cancelados reportam-se à parte. |
| Versão do workflow | Se houve publicação de nova versão entre os períodos (acção acrescentada, prazo alterado, responsável mudado). | Comparar dentro da mesma versão ou tratar a mudança como variável explicativa. |
| Denominador | Casos classificados pela **data de conclusão** (recomendado) ou pela data de criação — uma só regra nos dois períodos. | Escolher e escrever a regra (decisão D3). |

Colunas mínimas na exportação: id do caso, data de criação, data de conclusão, estado; por acção: nome, grupo responsável, data de activação, data de conclusão, resultado da decisão (continuar / devolver / cancelar); idealmente data da primeira interacção (atribuição ou comentário) e versão do workflow. Comentários e motivo de devolução ajudam a ligar o tempo à causa.

## 2. Definições de métricas (fórmulas, denominadores, exclusões)

Passo 2 do skill: distinguir tempo de ciclo, trabalho activo e espera. Nenhuma delas mede o desempenho de uma pessoa; uma acção «lenta» pode estar à espera do requerente, de um fornecedor ou de um grupo sem membro disponível.

| Métrica | Fórmula | Denominador | Exclusões |
| --- | --- | --- | --- |
| Tempo de ciclo do caso | `concluído − criado`, em dias corridos e em dias úteis | Casos concluídos no período | Cancelados (reportar à parte) |
| Tempo por acção | `acção concluída − acção activada` | Acções de casos concluídos no período | Acções sem data de conclusão |
| Espera na acção | `primeira interacção − activada` (só existe com a data de atribuição/início) | Idem | Sem essa coluna, a espera **não é observável** — dizer isso, não estimar |
| Trabalho activo | `concluída − primeira interacção` | Idem | Idem |
| Retrabalho | nº de decisões com resultado «devolver a uma acção» ÷ casos concluídos; tempo extra = da devolução à nova conclusão | Casos concluídos | — |
| Tempo até ao primeiro responsável | `primeira atribuição − criação` | Casos criados no período | — |

Estatísticas: mediana e P90, não média (um caso preso um mês distorce a média). Reportar sempre o `n` ao lado. Volume de casos por período e distribuição por valor/tipo são variáveis de confusão obrigatórias (secção 5).

## 3. Onde se costuma perder tempo — hipóteses, não conclusões

Passo 3: ligar os estrangulamentos a casos, decisões e comentários concretos. Sem o relatório, o que se pode fazer é enumerar as hipóteses habituais num fluxo de compras e dizer **que evidência confirma ou refuta cada uma**. Ordene-as pelo resultado da tabela por acção do script (coluna «% da soma das medianas»).

| # | Hipótese | Confirma-se se… | Refuta-se se… | Onde procurar |
| --- | --- | --- | --- | --- |
| H1 | A aprovação (decisão da chefia / direcção financeira) espera na fila | A acção de decisão domina o tempo por acção e o P90 é muito superior à mediana; espera concentrada em certos dias da semana | Mediana da decisão ≤ 1 dia útil e estável entre períodos | Tempo por acção; data de activação vs. conclusão; grupo responsável |
| H2 | Pedidos devolvidos por estarem incompletos (falta cotação, centro de custo, NIF do fornecedor) | Frequência de «devolver à acção» subiu; comentários com o motivo; casos devolvidos têm ciclo muito maior | Devoluções raras ou iguais nos dois períodos | Resultado das decisões; comentários; ciclo dos casos devolvidos vs. não devolvidos |
| H3 | Recolha de propostas de fornecedores demora (dependência externa) | A acção de cotações é a mais longa e varia com o fornecedor / valor | Cotações curtas ou sem variação entre períodos | Tempo por acção; metadados de valor e categoria |
| H4 | Casos sem responsável ou atribuídos a grupo sem membro disponível | Tempo até à primeira interacção alto; acções activadas e sem atribuição durante dias | Atribuição no mesmo dia | Data de atribuição; grupos com um só membro (férias, saída) |
| H5 | Mudou o volume ou a mistura (mais casos, mais casos acima do limiar que exige aprovação adicional) | Volume ou proporção de casos de valor elevado subiu no período recente | Volume e mistura estáveis | Contagem por período; metadados de valor |
| H6 | Nova versão do workflow acrescentou passos ou prazos | Publicação entre os períodos; acções que só existem no período recente | Uma só versão nos dois períodos | Versão nas linhas exportadas |

H5 e H6 não são «causas a corrigir»: são variáveis de confusão. Se se confirmarem, qualquer comparação directa entre os períodos precisa de ser feita por estrato (mesma faixa de valor, mesma versão) antes de atribuir o atraso a um passo ou a um grupo.

## 4. Como calcular (reproduzível)

Comando de terminal, nesta pasta, Node 20 ou superior, sem rede. Os nomes das colunas são os da exportação real; os abaixo são exemplos.

```bash
node calcular-tempos.mjs exportacao.csv \
  --caso=incident_id --accao=action_name --activada=activated_at --concluida=completed_at \
  --criado=incident_created_at --concluido-caso=incident_completed_at \
  --grupo=assignee_group --resultado=decision_outcome --versao=workflow_version \
  --periodo=A:2026-05-01:2026-06-30 --periodo=B:2026-07-01:2026-08-31
```

Saída por período: `n` de casos concluídos e de abertos (excluídos), mediana e P90 do ciclo em dias corridos e úteis, tabela por acção ordenada pela mediana com a percentagem da soma das medianas, contagem de devoluções e grupos, e os avisos de cobertura (fuso em falta, duplicados, várias versões, conclusão aproximada). Passe `--iniciada=<coluna>` se a exportação tiver a data da primeira interacção; sem ela o script não separa espera de trabalho activo e diz isso.

Leitura: a acção com maior mediana **e** maior diferença entre períodos é a primeira a investigar nos casos concretos (abrir 5–10 casos do P90 e ler comentários e resultado das decisões). Só depois disso uma hipótese passa a facto.

## 5. Uma melhoria e como a testar

Passo 4: uma mudança, um dono, um mecanismo esperado, uma medida de acompanhamento. Como a hipótese ainda não está confirmada, a proposta é condicional — a regra de escolha está fixa, o conteúdo depende do que a secção 4 mostrar.

**Regra de escolha:** atacar a acção que concentra a maior parcela do aumento do ciclo entre os períodos, com a intervenção mais pequena que altere o mecanismo de espera.

| Se a evidência apontar para… | Mudança candidata | Mecanismo esperado | Dono proposto (a confirmar, D5) |
| --- | --- | --- | --- |
| H2 (devoluções) | Lista de verificação de completude na acção de registo do pedido (campos obrigatórios: cotação anexa, centro de custo, fornecedor com NIF) e comentário obrigatório na devolução | Menos ciclos de devolução; a decisão recebe pedidos completos | Responsável de Compras |
| H1 (fila de aprovação) | Prazo explícito na acção de decisão (ex.: 2 dias úteis) com notificação ao activar e lembrete ao vencer; substituto nomeado no grupo | A espera passa a ser visível e escalável | Chefia que aprova |
| H3 (cotações) | Recolha das propostas em paralelo com a validação interna, ou formulário Form Fill para o requerente anexar as propostas na abertura | Remove a dependência externa do caminho crítico | Responsável de Compras |
| H4 (sem responsável) | Grupo responsável com pelo menos dois membros activos; atribuição no mesmo dia | Elimina espera antes de qualquer trabalho | Administrador do workflow |

Qualquer destas altera o desenho do workflow (campos obrigatórios, prazos, ordem das acções) com casos em curso — isso é trabalho de `provia-workflow-change`, não desta análise.

**Desenho do teste** (o Provia não distribui casos aleatoriamente entre dois desenhos; o teste é antes/depois com controlo de confundidores):

1. **Linha de base:** correr o script no período anterior à mudança (mínimo 4 semanas ou 30 casos concluídos, o que chegar mais tarde) e guardar a saída.
2. **Publicar a mudança** numa nova versão e registar a data de publicação; casos criados antes continuam na versão antiga e ficam fora da medição.
3. **Período de teste:** mesma duração e semelhante nº de dias úteis; classificar por data de conclusão; só casos da nova versão.
4. **Métrica principal:** mediana do ciclo do caso em dias úteis. **Secundárias:** P90 do ciclo; mediana da acção alvo; taxa de devoluções (se H2); tempo até ao primeiro responsável (se H4).
5. **Guardas:** volume de casos, proporção por faixa de valor e por departamento requerente nos dois períodos; se divergirem, comparar por estrato. Taxa de cancelamentos não deve subir (uma «melhoria» que faz desistir do pedido não é melhoria).
6. **Critério de sucesso:** definido pelo dono antes de publicar (ex.: mediana reduz ≥ 2 dias úteis e P90 não sobe). Sem critério prévio, o resultado não decide nada.
7. **Leitura:** a diferença é atribuída à mudança só se as guardas se mantiverem e a versão for única no período de teste. Não é uma prova estatística; é uma comparação controlada e documentada.

Entrega de relatórios: a disponibilidade de relatórios no Provia depende do perfil e do plano; o envio agendado de relatórios não existe na versão base pinada, por isso a extracção nos dois períodos é manual (exportar, correr o script, guardar a saída).

## 6. Limitações

- Sem relatório não há factos sobre onde se perde tempo — só o método para os obter.
- Sem coluna de primeira interacção, espera e trabalho activo dentro de uma acção não se separam; o script mostra apenas activada→concluída.
- Dias úteis contam seg–sex; feriados nacionais não são considerados (comportamento do Provia).
- Durações por acção não medem pessoas; uma comparação por grupo exige ver volume, mistura e substitutos.
- Contexto de país é provisório; nenhum prazo ou limiar deste documento é legal ou de política — os que aparecem são exemplos.

## 7. Decisões em aberto (também em `provia-project.json`)

| Id | Questão | Dono |
| --- | --- | --- |
| D1 | Entregar o relatório ou a exportação de casos e acções (colunas da secção 1), com os dois períodos | Quem pediu a análise (Direcção de Compras) |
| D2 | Confirmar país, língua e fuso horário (provisório: Angola, pt-AO, Africa/Luanda) | Quem pediu a análise |
| D3 | Regra do denominador: casos por data de conclusão ou de criação; tratamento de cancelados | Dono do processo de compras |
| D4 | Houve publicação de nova versão do workflow entre os períodos? Qual? | Administrador do workflow |
| D5 | Nomear o dono do processo que assume a mudança e o critério de sucesso | Direcção |
| D6 | Escolher a mudança (secção 5) depois de a hipótese ser confirmada nos casos | Dono do processo |

## 8. Referências usadas

- Skill `provia-process-improvement` (procedimento 1–5) e convenções partilhadas do plugin.
- `references/provia-capabilities.md`: dias úteis sem feriados; relatórios dependem de plano/permissões; entrega agendada de relatórios não implementada; decisões com resultado «devolver a uma acção»; publicação cria nova versão e casos existentes mantêm a anterior.
- `references/country-context.md` e `references/countries/angola.md`: contexto provisório e regra de não inventar limiares.
- `references/project-manifest.md`: secção `decisions[]` que este skill acrescenta.
