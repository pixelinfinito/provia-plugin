# Diagnóstico de desempenho — Pedido de compra

## 0. Nota sobre os dados fornecidos

A pasta de trabalho não contém nenhum relatório, exportação (CSV/JSON) ou `provia-project.json`. O pedido refere "este relatório", mas nenhum ficheiro foi anexado ou encontrado. Assunção assumida para continuar sem pergunta: trato este documento como um **enquadramento de análise reutilizável** — a fórmula de cálculo, as hipóteses de bottleneck típicas de um processo de compra e o desenho do teste de melhoria — pronto a aplicar assim que os registos reais (com timestamps por caso e por acção) forem fornecidos. Nenhum número abaixo é um resultado calculado a partir de dados reais; onde surge um valor ilustrativo, está marcado como tal.

País/contexto: não indicado — assumo Angola como ponto de partida provisório (pt-AO, AOA, Africa/Luanda), a confirmar.

## 1. O que falta para comparar os dois períodos

Antes de qualquer comparação "compras demoram mais", confirmar:

- **Período A vs. período B**: datas exactas de início/fim de cada janela, e se são de duração comparável (ex.: dois meses completos, não um mês completo vs. um mês parcial).
- **Fuso horário** dos timestamps (registos Provia guardam UTC; exportações locais podem já estar convertidas — confirmar antes de subtrair datas).
- **Duplicados**: casos reabertos, casos cancelados e reactivados, ou o mesmo pedido exportado duas vezes (paginação da exportação).
- **Casos sem `completedAt`**: excluir do cálculo de ciclo, não tratar como zero nem como em curso indefinidamente.
- **Versão do workflow**: se o desenho do processo (novas acções, novos aprovadores, novos campos obrigatórios) mudou entre os dois períodos, a diferença de duração pode reflectir a mudança de desenho, não degradação de desempenho.
- **Volume e complexidade**: nº de pedidos por período e distribuição por valor/categoria — um aumento de volume ou de pedidos mais complexos é um confundidor plausível para "demora mais", não uma prova de perda de eficiência.

Sem estes dados, qualquer número de "aumento de X dias" é **incompleto** e não deve ser apresentado como facto.

## 2. Definições de métrica (a aplicar aos dados reais)

| Métrica | Fórmula | Numerador/denominador | Exclusões |
| --- | --- | --- | --- |
| Tempo de ciclo (cycle time) | `completedAt − createdAt` por caso | Só casos com `completedAt` no período em análise | Casos cancelados sem decisão final; casos ainda abertos |
| Tempo activo (active time) por acção | `actionCompletedAt − actionStartedAt` somado por caso | Soma das acções efectivamente trabalhadas | Tempo em que a acção está "parada" à espera de outro interveniente |
| Tempo de espera (wait time) | `Tempo de ciclo − Σ tempo activo` | Diferença por caso | — |
| Tempo de fila por acção | `actionStartedAt − actionAvailableAt` | Por acção, por caso | Acções puladas (skip) por regra de workflow |

Não inferir desempenho individual a partir da duração bruta de um caso: um pedido pode demorar mais por complexidade (valor elevado, fornecedor novo, exceção) e não por lentidão de quem decide.

## 3. Hipóteses de onde se perde tempo (a validar, não confirmadas)

Estas são hipóteses típicas de um processo de pedido de compra, a confirmar ligando cada bottleneck a casos, decisões e comentários reais — não são conclusões:

1. **Espera na aprovação (decisão do gestor/chefia)** — se a acção de decisão não tem prazo (`due`) ou escalonamento, um pedido pode ficar disponível na fila sem ser trabalhado; a fila "aguarda decisão" costuma ser o maior componente de tempo de espera, não de trabalho activo.
2. **Recolha de propostas de fornecedores em série** — pedir cotações por email sequencialmente (um fornecedor, depois o outro) em vez de em paralelo aumenta o tempo de espera sem aumentar o tempo activo de ninguém.
3. **Retrabalho por informação em falta** — pedidos rejeitados ou devolvidos por falta de justificação/orçamento reiniciam parte do ciclo; se a taxa de rejeição subiu entre os dois períodos, isso por si só explica um aumento do tempo médio.
4. **Emissão manual da nota de encomenda / PO** — transcrição manual de dados do fornecedor para o sistema de facturação introduz espera adicional não visível como "acção" no workflow.

Para confirmar qual hipótese pesa mais, seria necessário: tempo médio de fila por acção (não só o total do caso), taxa de rejeição/retrabalho por período, e nº de comentários "a aguardar resposta do fornecedor" nos casos mais lentos.

## 4. Melhoria proposta a testar

**Mudança**: substituir a recolha sequencial de propostas de fornecedores por recolha em paralelo através de um formulário de auto-serviço (Form Fill), com prazo de 2 dias úteis e escalonamento automático se não houver resposta.

- **Mecanismo esperado**: reduz o tempo de espera na fase de cotação porque as respostas dos fornecedores deixam de estar em série (bottleneck = fornecedor mais lento a ser contactado, não a soma de todos); o prazo com escalonamento reduz casos "esquecidos" na fila.
- **Dono do processo**: a confirmar — tipicamente o responsável de Compras/Procurement (`decisions[D2]` abaixo).
- **Se esta mudança alterar o desenho do workflow** (nova acção, novo formulário, novo prazo), o desenho passa a `provia-workflow-change`, não é aplicado directamente aqui.

### Plano de medição

- **Desenho**: antes/depois (não é viável correr as duas variantes em simultâneo para o mesmo fornecedor), com janela de pelo menos 4–6 semanas de cada lado para absorver variação semanal de volume.
- **Métrica primária**: tempo médio de espera na fase de cotação (fila + tempo de resposta do fornecedor mais lento), conforme fórmula da secção 2.
- **Métrica secundária**: tempo de ciclo total do pedido; taxa de rejeição/retrabalho (para verificar que a mudança não piora a qualidade da decisão).
- **Confundidores a registar em paralelo**: volume de pedidos por semana, mistura de categorias/valor, mudanças de pessoal em Compras — reportar estes valores junto do resultado, não só a métrica principal.
- **Critério de sucesso**: redução mensurável do tempo médio de espera na fase de cotação, mantendo a taxa de rejeição estável ou melhor (não é sucesso reduzir tempo aumentando erros).
- **Amostra mínima**: suficientes casos por período para que a diferença não seja dominada por 1–2 outliers (idealmente ≥30 casos por período; a confirmar com o volume real).

## 5. Separação factos / recomendações / decisões em aberto

- **Facto confirmado**: nenhum — não foi fornecido nenhum registo real nesta conversa.
- **Recomendação**: aplicar as fórmulas da secção 2 aos registos reais antes de aceitar "compras demoram mais" como conclusão; testar a mudança da secção 4 com o plano de medição proposto.
- **Decisões em aberto**: registadas em `provia-project.json` (`decisions[]`), com dono a confirmar.
