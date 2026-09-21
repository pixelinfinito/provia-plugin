# Diagnóstico do processo «Pedido de compra» (COMP)

País: Angola · Língua: pt-AO · Fuso: Africa/Luanda · Moeda: AOA
Momento de observação: **2026-09-18, 09:00 (Africa/Luanda), quinta-feira**
Relatório produzido em 2026-09-21 com `provia-skills/1.2.0` (contrato `fed8efaf`).

## 0. O que foi fornecido e o que não foi

| Fornecido | Conteúdo | Limite |
| --- | --- | --- |
| Exportação Junho 2026 (`export-jun-2026`) | 12 casos concluídos; ciclo médio 6,5 dias úteis; média em «Decidir sobre o pedido» 3,1 dias; 2 devolvidos | Só agregados: sem linhas por caso, sem datas, sem distribuição |
| Exportação Agosto 2026 (`export-ago-2026`) | 19 casos concluídos; ciclo médio 9,8 dias úteis; média em «Decidir sobre o pedido» 6,4 dias; 7 devolvidos | Idem |
| Instantâneo de casos abertos (`snapshot-2026-09-18`) | COMP-201, COMP-204, COMP-207 com acção actual, dias na acção, prazo e responsável quando indicados | Três casos; não se sabe se são todos os abertos |

Não foi fornecido: versão publicada do workflow em cada período, sequência real das acções, motivo das devoluções, definição exacta de «devolvido», unidade dos tempos em «Decidir» (dias úteis ou de calendário), Julho de 2026, responsável e prazo de «Confirmar disponibilidade orçamental», composição do grupo Compras.

Este relatório analisa instantâneos e agregados. **Não há monitorização em directo do Provia**: a ligação ao Provia do cliente não foi autorizada nesta sessão, nada foi lido nem alterado na organização. O que aqui se diz sobre o estado de 18 de Setembro vale para as 09:00 desse dia.

Referência de produto usada: os prazos em dias úteis no Provia saltam sábados e domingos, não feriados; uma acção de Decisão pode «regressar a uma acção» anterior (é a leitura mais provável de «devolvido»); quem executa uma acção vê os seus casos sem concessão de acesso (`provia-capabilities.md`).

### Pressupostos declarados

- P1. «Dias» em «Decidir sobre o pedido» (3,1 e 6,4) são dias úteis, na mesma unidade do ciclo. Se forem dias de calendário a decomposição da secção 2 muda; pedido em D4.
- P2. Junho e Agosto correram na mesma versão do workflow. Pedido em D4.
- P3. «Devolvido» = resultado da Decisão que faz o caso regressar a uma acção anterior (o requerente corrige e o caso volta a passar por «Decidir»). Pedido em D3.
- P4. Os prazos «2 dias» e «3 dias» do instantâneo são em dias úteis, como o «há 8 dias úteis» do mesmo instantâneo. Se forem de calendário, o atraso é ainda maior.
- P5. Sequência assumida: Confirmar disponibilidade orçamental → Decidir sobre o pedido → Registar a encomenda. Não é confirmada pelas exportações.

## 1. Lista de atenção (triagem a 2026-09-18 09:00)

Contagem de dias úteis para trás a partir de quinta-feira 18 de Setembro (fins-de-semana excluídos, feriados não): 8 dias úteis ≈ activação em segunda-feira 8 de Setembro; 4 dias úteis ≈ sexta-feira 12 de Setembro; 1 dia ≈ quarta-feira 17 de Setembro. Datas aproximadas, derivadas do instantâneo e não de registos com data.

| Prioridade | Caso | Acção actual | Estado | Facto (instantâneo) | Quem pode agir | Próximo passo sugerido |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **COMP-201** | Decidir sobre o pedido | **Atrasado e bloqueado por falta de dono** | 8 dias úteis na acção; prazo 2 dias → **6 dias úteis além do prazo (4× o prazo)**; responsável não atribuído | Quem tem `edit`/`admin` no workflow ou o dono do processo de compras (D1); ninguém está designado para decidir | Atribuir hoje um decisor ao caso e registar comentário com o motivo do atraso; confirmar se o pedido ainda é necessário (8 dias úteis sem decisão) |
| 2 | **COMP-207** | Registar a encomenda | **Atrasado, com dono** | 4 dias na acção; prazo 3 dias → **1 dia além do prazo**; responsável Compras | Grupo `compras` | Compras conclui a acção ou regista no caso o que impede o registo (fornecedor, dados em falta) |
| 3 | COMP-204 | Confirmar disponibilidade orçamental | **Em espera, não classificável** | 1 dia na acção; prazo e responsável não constam do instantâneo | Não determinável com os dados (D5) | Nenhuma acção hoje; verificar em 2026-09-19 se a acção tem prazo configurado e quem a detém |

Distinção usada: *atrasado* = dias na acção > prazo fornecido; *bloqueado* = ninguém designado para executar; *em espera* = dentro do prazo ou sem prazo conhecido. Nenhum registo foi concluído, atribuído ou comentado por este relatório; as acções acima são propostas para pessoas autorizadas.

Não foi possível verificar duplicados ou registos em falta: o instantâneo tem três casos e nenhum campo de identificação repetido.

## 2. Desempenho: Junho vs Agosto 2026

### 2.1 Cálculos (reproduzíveis a partir dos agregados fornecidos)

| Indicador | Junho 2026 | Agosto 2026 | Variação |
| --- | --- | --- | --- |
| Casos concluídos (denominador) | 12 | 19 | +7 (+58,3 %) |
| Dias úteis no mês (seg–sex, sem feriados) | 22 | 21 | — |
| Conclusões por dia útil | 0,55 | 0,90 | +65 % |
| Ciclo médio (dias úteis) | 6,5 | 9,8 | **+3,3 (+50,8 %)** |
| Média em «Decidir sobre o pedido» (P1) | 3,1 | 6,4 | **+3,3 (+106 %)** |
| Peso de «Decidir» no ciclo | 47,7 % | 65,3 % | +17,6 pp |
| Ciclo fora de «Decidir» (ciclo − Decidir) | 3,4 | 3,4 | **0,0** |
| Casos devolvidos | 2 | 7 | +5 |
| Taxa de devolução (devolvidos ÷ concluídos) | 16,7 % | 36,8 % | **+20,1 pp (×2,2)** |

Fórmulas: variação absoluta = Agosto − Junho; variação relativa = variação ÷ Junho; peso = média na acção ÷ ciclo médio; taxa de devolução = devolvidos ÷ concluídos do mesmo mês. Exclusões: nenhuma (não há linhas para excluir). Os tempos são médias fornecidas pelo cliente; sem as linhas não é possível calcular mediana, percentis ou separar trabalho activo de espera dentro de cada acção.

### 2.2 Conclusão confirmada pelos números

**Todo o aumento do ciclo médio (+3,3 dias úteis) está em «Decidir sobre o pedido» (+3,3 dias).** As restantes acções, em conjunto, demoraram o mesmo nos dois meses (3,4 dias). O problema não está espalhado pelo processo: está numa acção de decisão que duplicou o seu tempo e que, no instantâneo de Setembro, tem um caso há 8 dias úteis sem ninguém designado.

Confirmado também: o volume subiu 58 % e a taxa de devolução mais do que duplicou. Estes dois factos são confundidores da leitura anterior e são tratados abaixo como hipóteses, não como causas provadas.

### 2.3 Hipóteses de causa (por ordem de evidência)

| # | Hipótese | Evidência a favor | O que falta para confirmar |
| --- | --- | --- | --- |
| H1 | **A acção «Decidir» não tem responsável por omissão; os casos esperam até alguém os reclamar** | COMP-201 sem responsável há 8 dias úteis; o ciclo fora de «Decidir» não mudou | Configuração da acção no workflow publicado (D1, D6); quantos casos de Agosto tiveram esta acção sem responsável à activação |
| H2 | **As devoluções fazem os casos passar duas vezes por «Decidir»**, inflacionando a média nessa acção (P3) | 7 devoluções em 19 casos; a subida em «Decidir» coincide com a subida de devoluções | Motivo e destino de cada devolução (D3); tempo em «Decidir» dos casos devolvidos vs não devolvidos |
| H3 | **Volume**: +58 % de casos com a mesma capacidade de decisão gera fila | 12 → 19 casos; conclusões/dia útil +65 % | Número de decisores e casos abertos em simultâneo em Agosto |
| H4 | Ausência do decisor em Agosto (período de férias) | Nenhuma nas exportações | Registo de ausências; datas de decisão dos casos |

H2 e H3 não excluem H1: se a acção tivesse dono e prazo vigiado, a fila (H3) e a segunda passagem (H2) seriam visíveis e curtas em vez de silenciosas. Não se infere desempenho individual de nenhuma pessoa a partir destes agregados.

### 2.4 Uma mudança, com mecanismo e medida (recomendação)

**Mudança proposta:** definir um **responsável por omissão** (um grupo, não uma pessoa) para «Decidir sobre o pedido», com um **substituto nomeado** para ausências, e manter o prazo de 2 dias úteis como prazo da acção.

- **Dono da mudança:** dono do processo de compras, a nomear pela Direcção (D1/D2). Enquanto não for nomeado, a mudança não avança.
- **Mecanismo esperado:** nenhum caso fica em «Decidir» sem alguém a quem o prazo pertença; o decisor vê os seus casos sem precisar de concessão adicional; um caso devolvido regressa a um decisor conhecido em vez de voltar à fila anónima.
- **Como se mede (casos concluídos em Outubro 2026, mesma exportação de agregados mais as linhas por caso):**
  1. Média em «Decidir sobre o pedido»: **meta ≤ 3,1 dias úteis** (nível de Junho).
  2. Casos em que «Decidir» ficou sem responsável no momento da activação: **meta 0 %**.
  3. Casos com «Decidir» acima do prazo de 2 dias úteis: registar a percentagem (linha de base a criar; Agosto não a tem).
  4. Ciclo médio: acompanhar; espera-se aproximação aos 6,5 dias se o resto do processo se mantiver em 3,4.
  5. Taxa de devolução: acompanhar, sem meta, para separar H1 de H2.
- **Confundidores a registar na medição:** volume de casos em Outubro; feriados de Outubro (o Provia não os salta ao contar dias úteis); qualquer outra alteração ao workflow no mesmo período; ausências do decisor.
- **Porque não outra mudança primeiro:** um checklist de pedido para reduzir devoluções (H2) depende de saber o motivo das devoluções (D3), que ainda não existe nos dados; reforçar Compras (COMP-207) atacaria 1 dia de atraso num caso, não os 3,3 dias médios.

Esta mudança altera o desenho de um workflow publicado com casos em curso (pelo menos COMP-201, 204 e 207). O plano da alteração — nova versão, efeito nos casos abertos, sem retrocesso automático — é tarefa de `provia-workflow-change`.

## 3. Ligação entre a triagem e a mudança

| Item da triagem | É sintoma da mudança proposta? | Tratamento |
| --- | --- | --- |
| COMP-201 (Decidir, sem responsável, 6 dias úteis além do prazo) | **Sim** — é exactamente o mecanismo de H1 em curso | Hoje: atribuição manual por pessoa autorizada. Estrutural: `provia-workflow-change` (responsável por omissão + substituto) |
| COMP-207 (Registar a encomenda, Compras, 1 dia além do prazo) | Não — a acção tem dono e o resto do processo não piorou | Acompanhamento operacional por Compras; se se repetir, rever instrução da acção com `provia-process-knowledge` |
| COMP-204 (Confirmar disponibilidade orçamental, 1 dia) | Não classificável | D5: confirmar prazo e dono da acção |
| Devoluções ×2,2 | Possivelmente ligado (H2) | D3 primeiro; depois, se o motivo for pedido incompleto, instrução ao requerente com `provia-process-knowledge` ou formulário com `provia-form-designer` |

## 4. Decisões registadas no manifesto (`provia-project.json`, `decisions[]`)

| Id | Questão (resumo) | Dono | Estado |
| --- | --- | --- | --- |
| D1 | Quem decide «Decidir sobre o pedido» e quem substitui | Dono do processo de compras (a nomear) | aberta |
| D2 | Aprovar a mudança (responsável por omissão + substituto) e as metas de Outubro 2026 | Dono do processo de compras (a nomear) | aberta |
| D3 | Motivo e destino das 7 devoluções de Agosto | Compras | aberta |
| D4 | Unidade dos tempos em «Decidir», versão do workflow em cada mês, sequência real das acções | Administrador do Provia | aberta |
| D5 | Prazo e dono de «Confirmar disponibilidade orçamental» | Administrador do Provia | aberta |
| D6 | Acesso real ao workflow (quem vê, quem abre) antes de planear a alteração | Administrador do Provia | aberta |

## 5. Limites dos dados

1. **Agregados sem linhas.** Médias escondem a distribuição: um ou dois casos muito longos em Agosto podem explicar os 6,4 dias. Pedir a exportação por caso (id, data de criação, data de conclusão, tempo por acção, responsável por acção, resultado da decisão, comentários) para Junho, Julho, Agosto e Setembro.
2. **Amostras pequenas** (12 e 19 casos): variações de um ou dois casos mudam as percentagens; a taxa de devolução de Junho assenta em 2 casos.
3. **Unidades e versões não confirmadas** (P1, P2, D4).
4. **Julho em falta**: não se sabe se a degradação foi gradual ou súbita.
5. **Feriados**: o Provia conta dias úteis sem feriados; os dias úteis de Angola em cada mês podem ser menos do que os 22/21 usados.
6. **Instantâneo parcial**: três casos abertos; não se sabe se há outros nem quantos casos de Setembro já foram concluídos.
7. **Sem acesso ao Provia do cliente** nesta sessão; nada foi verificado no produto.

## 6. Ficheiros produzidos e verificações efectuadas

| Ficheiro | Conteúdo | Verificação |
| --- | --- | --- |
| `diagnostico-compras.md` | Este relatório | Nenhuma verificação automática (é Markdown) |
| `provia-project.json` | Manifesto novo: 3 fontes, grupo `compras`, workflow `compras` reconstruído das exportações (3 acções observadas), decisões D1–D6 | `node scripts/build-project-map.mjs provia-project.json --check`: 0 erros, 2 avisos (acções `confirmar-orcamento` e `decidir` sem dono — são as constatações do diagnóstico, não defeitos do ficheiro), 1 informação (grupo `compras` sem concessão: vê os seus casos) |
| `project.html` | Mapa do projecto gerado do manifesto | Gerado com `--output` |
| `setup.md` | Entrega gerada do manifesto | Gerado com `--setup`. Atenção: as linhas «Importar o YAML como rascunho» e «grupos a criar» são o texto genérico do gerador; o workflow e o grupo Compras **já existem** no Provia do cliente. Use `setup.md` apenas pela lista de decisões e de responsáveis em falta. |

A entrada `workflows[0]` do manifesto é uma reconstrução para dar chaves estáveis (`decidir`, `registar-encomenda`, `confirmar-orcamento`) às próximas tarefas; não substitui o YAML exportado do workflow publicado, que deve ser obtido antes de planear a alteração.
