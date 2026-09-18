# Diagnóstico do processo de compras — Angola

**Momento de observação:** 2026-09-18, 09:00 (Africa/Luanda). **Idioma:** pt-AO.

## 0. O que foi fornecido

Este diagnóstico baseia-se em três registos fornecidos pelo utilizador, sem ligação ao Provia:

1. **Exportação agregada de Junho de 2026** — 12 casos concluídos: ciclo médio 6,5 dias úteis; tempo médio em «Decidir sobre o pedido» 3,1 dias; 2 casos devolvidos.
2. **Exportação agregada de Agosto de 2026** — 19 casos concluídos: ciclo médio 9,8 dias úteis; tempo médio em «Decidir sobre o pedido» 6,4 dias; 7 casos devolvidos.
3. **Casos abertos hoje** (instantâneo, não monitorização em directo): COMP-201, COMP-204, COMP-207.

Não foi fornecido o desenho do workflow (`provia-project.json` / `workflow.yaml`), pelo que os grupos responsáveis, os prazos de cada acção e a versão do workflow em vigor em cada período não estão confirmados — ver secção 4. Os registos de Junho e Agosto são agregados (médias), não casos individuais: não é possível recalcular medianas, dispersão ou confirmar exclusões a partir do que foi fornecido.

---

## 1. Lista de atenção (casos abertos hoje)

| Caso | Acção actual | Tempo na acção | Prazo da acção | Responsável | Situação |
| --- | --- | --- | --- | --- | --- |
| **COMP-201** | Decidir sobre o pedido | 8 dias úteis | 2 dias | **não atribuído** | **Atrasado — 6 dias úteis além do prazo**, sem dono |
| COMP-207 | Registar a encomenda | 4 dias úteis | 3 dias | Compras | Atrasado — 1 dia útil além do prazo, dono conhecido |
| COMP-204 | Confirmar disponibilidade orçamental | 1 dia útil | não informado | não informado | Em espera; não classificável como atrasado (falta o prazo) |

**Prioridade 1 — COMP-201.** É o caso mais crítico: maior atraso absoluto e relativo (4× o prazo definido) e sem responsável atribuído, pelo que ninguém está formalmente accionável no sistema para o destravar. Recomenda-se que a chefia de Compras assuma ou delegue a decisão hoje. Isto não é uma acção que o diagnóstico executa — é uma recomendação para decisão humana autorizada.

**Prioridade 2 — COMP-207.** Atraso menor (1 dia útil) e com responsável identificado (grupo Compras): o encaminhamento imediato é lembrar/escalar dentro do próprio grupo Compras, sem necessidade de reatribuição.

**COMP-204.** Apenas 1 dia útil na acção «Confirmar disponibilidade orçamental»; sem prazo nem responsável informados nos dados fornecidos, não é possível dizer se está atrasado ou apenas em espera normal. Regista-se como lacuna de dados (ver decisão D3), não como incidente.

Nenhum dos três registos apresenta conflito de estado entre si nos dados fornecidos.

---

## 2. Desempenho: Junho vs. Agosto de 2026

### 2.1 Ressalvas antes de comparar

- Ambos os períodos são tratados como comparáveis apenas porque foram apresentados lado a lado; **não foi confirmado** que usam a mesma versão publicada do workflow «Pedido de compra», nem que a definição de "dia útil" e de "ciclo" é idêntica nos dois relatórios.
- São médias agregadas de 12 e 19 casos — amostras pequenas; não há mediana, desvio nem casos individuais para verificar outliers.
- Não está confirmado se o tempo de "Decidir sobre o pedido" e o "ciclo" incluem o tempo de casos devolvidos (ciclos de retrabalho) ou só a primeira passagem pela acção.

Os números abaixo são cálculos directos sobre o que foi fornecido, não uma auditoria independente dos registos de origem.

### 2.2 Cálculos

| Métrica | Junho 2026 | Agosto 2026 | Variação |
| --- | --- | --- | --- |
| Casos concluídos | 12 | 19 | +7 casos (+58,3%) |
| Ciclo médio total | 6,5 dias úteis | 9,8 dias úteis | **+3,3 dias úteis (+50,8%)** |
| Tempo médio em «Decidir sobre o pedido» | 3,1 dias | 6,4 dias | **+3,3 dias (+106,5%)** |
| Casos devolvidos | 2 (16,7%) | 7 (36,8%) | +20,1 pontos percentuais (taxa mais que duplicada) |

### 2.3 Leitura

O aumento do tempo médio em **«Decidir sobre o pedido» (+3,3 dias) é numericamente igual ao aumento do ciclo médio total (+3,3 dias)**. Assumindo que o ciclo total é a soma dos tempos por acção — o que não foi confirmado com o detalhe completo de todas as acções —, esta acção sozinha explicaria a totalidade do alongamento do processo entre Junho e Agosto. Trata-se de uma correlação aritmética directa nos números fornecidos, apresentada como **achado**, não como causa comprovada.

A taxa de devolução mais que duplicou (16,7% → 36,8%). Como hipótese a confirmar: mais devoluções tendem a gerar mais voltas pela decisão (o pedido regressa para nova apreciação), o que é consistente com — mas não prova por si só — o alongamento observado em «Decidir sobre o pedido». Não há dados para separar "tempo de decisão por caso único" de "tempo total incluindo reenvios".

**Confundidor de volume:** o número de casos concluídos subiu 58% (12 → 19) entre os dois períodos. Um aumento de volume sem aumento proporcional de capacidade de decisão é consistente com fila de espera crescente na mesma acção — também aqui como hipótese, não como facto estabelecido.

**Ligação à lista de atenção:** o caso aberto **COMP-201** está hoje na mesma acção («Decidir sobre o pedido»), 8 dias úteis sem decisão e sem responsável atribuído. É um exemplo concreto e actual do padrão agregado de Agosto — não uma coincidência isolada.

---

## 3. Mudança proposta (uma mudança, mensurável, com dono)

**Mudança:** Atribuir um responsável fixo (grupo, não uma pessoa nomeada) à acção «Decidir sobre o pedido», com escalonamento automático de aviso quando faltar 1 dia útil para o prazo de 2 dias sem decisão registada.

**Mecanismo esperado:** um caso sem responsável atribuído (como o COMP-201) não tem ninguém formalmente accionável quando o prazo se aproxima; um dono fixo por grupo elimina essa lacuna e o alerta antecipado dá tempo de reacção antes do incumprimento, em vez de o detectar apenas quando já está muito atrasado.

**Dono da mudança:** dono do processo de Compras (grupo/pessoa a confirmar — ver decisão D4).

**Medida de acompanhamento no próximo mês:**
- Tempo médio em «Decidir sobre o pedido» nos casos concluídos em Setembro/Outubro de 2026, comparado com os 6,4 dias de Agosto (referência a aproximar dos 3,1 dias de Junho).
- Percentagem de casos decididos dentro do prazo de 2 dias.
- Número de casos que chegam a esta acção sem responsável atribuído (deveria cair a zero).

**Confundidores a vigiar ao interpretar o próximo mês:** se o volume de casos continuar a crescer acima do de Agosto, ou se a taxa de devolução não baixar, uma melhoria parcial no tempo de decisão pode não se dever apenas à atribuição de responsável — seria necessário isolar os dois efeitos.

Esta mudança altera responsabilidades e comportamento de escalonamento da acção; se avançar, o desenho formal (responsável, prazo, escalonamento) deve ser tratado em `provia-workflow-change`, com atenção aos casos já abertos nessa acção (incluindo o COMP-201).

---

## 4. Decisões em aberto registadas

| ID | Questão | Dono proposto |
| --- | --- | --- |
| D1 | Quem assume agora a decisão do COMP-201, sem responsável e 6 dias úteis além do prazo? | Chefia de Compras (a confirmar) |
| D2 | Confirmar a causa do aumento em «Decidir sobre o pedido» e da taxa de devolução: falta de dono, volume (+58%) ou informação insuficiente nas propostas. | Dono do processo de Compras |
| D3 | Definir prazo e responsável da acção «Confirmar disponibilidade orçamental» (COMP-204 sem prazo registado). | Dono do processo de Compras |
| D4 | Aprovar a atribuição de responsável fixo e o alerta de escalonamento em «Decidir sobre o pedido». | Dono do processo de Compras / Direcção Financeira (a confirmar) |

Registadas em `provia-project.json` (`decisions[]`).

---

## 5. Limitações dos dados

- Apenas médias agregadas foram fornecidas para Junho e Agosto; sem casos individuais, medianas ou dispersão, não é possível confirmar se a média foi distorcida por poucos casos extremos.
- Não está confirmado se as duas exportações usam a mesma versão publicada do workflow «Pedido de compra».
- Não está confirmado se o tempo em «Decidir sobre o pedido» e o ciclo total incluem voltas de retrabalho de casos devolvidos.
- COMP-204 não tem prazo nem responsável informados; não é possível classificá-lo como atrasado.
- Os "dias úteis" seguem o comportamento descrito na base do Provia: excluem sábado e domingo, não feriados nacionais de Angola — relevante se algum feriado caiu dentro destes períodos.
- Nenhum desenho de workflow (`workflow.yaml`) foi fornecido; os `assigneeRef` reais dos grupos (ex.: "Compras") não puderam ser confirmados contra o manifesto e não foram inventados.

---

## Artefactos produzidos

- `provia-project.json` — manifesto do projecto (fontes das três exportações, 4 decisões em aberto).
- `project.html` — mapa do projecto (offline).
- `setup.md` — resumo das decisões em aberto gerado a partir do manifesto.
- `diagnostico-compras.md` — este relatório.
