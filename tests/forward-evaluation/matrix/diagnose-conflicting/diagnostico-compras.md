# Diagnóstico do processo de compras — Angola

**Idioma:** pt-AO. **Modo:** desligado (disconnected) — este diagnóstico não lê nem monitoriza o Provia em directo; trabalha apenas com o que foi descrito nesta conversa.

## 0. O que foi fornecido

- **Desenho do workflow publicado**, descrito em texto (não foi anexado um `workflow.yaml` nem um `provia-project.json` anterior): três acções — «Registar», «Decidir» e «Encomendar» — atribuídas a Compras e Finanças.
- **Excerto de uma exportação de casos**, também descrito em texto e não como ficheiro completo: dois casos, COMP-88 e COMP-90, cada um com um problema específico apontado abaixo.

Não foi indicado o momento de observação da exportação, o fuso horário dos registos, nem se estes dois casos são representativos de um lote maior ou os únicos casos com problemas. Trato-os como os únicos dados de execução disponíveis; não presumo volumes, prazos ou responsáveis além do que foi dito.

---

## 1. Incompatibilidades a resolver antes de interpretar os números

Os dois casos fornecidos não são, antes de mais, uma questão de desempenho — são conflitos entre a exportação e o desenho, e dentro dos próprios dados. Reporto-os primeiro, como pede o procedimento de diagnóstico, em vez de os tratar como atrasos comuns.

### COMP-88 — grupo responsável inexistente no desenho

| Campo | Valor |
| --- | --- |
| Caso | COMP-88 |
| Estado | «Aguardar auditoria» |
| Atribuído a | grupo «Auditoria» |

O desenho publicado só descreve dois grupos com acções atribuídas — Compras e Finanças — e três acções — «Registar», «Decidir», «Encomendar». Nem o grupo «Auditoria» nem um estado ou acção de auditoria constam do desenho fornecido. Isto é uma incompatibilidade directa entre a exportação e o desenho, não uma lentidão do caso.

Duas leituras possíveis, ambas em aberto (decisão **D1**):

1. **«Auditoria» é um passo real do processo** que existe na operação mas nunca foi modelado no workflow — o caso está correctamente à espera de um responsável que o Provia não reconhece formalmente. Isto aponta para uma lacuna de desenho, a tratar com `provia-workflow-change` (o caso COMP-88 está activo nessa situação e teria de ser considerado no plano de migração).
2. **É um erro de atribuição ou de dados** — por exemplo um grupo renomeado, um caso de outro workflow, ou um valor de teste — e o caso está, na prática, à espera de Compras ou Finanças.

Não invento qual das duas é verdadeira. Enquanto não for esclarecido, ninguém está formalmente accionável neste caso dentro do desenho publicado: nem Compras nem Finanças reconhecem essa fila como sua.

### COMP-90 — conclusão anterior à criação

| Campo | Valor |
| --- | --- |
| Caso | COMP-90 |
| Criado em | 2026-09-10 |
| Concluído em | 2026-09-08 |

A data de conclusão é dois dias **anterior** à data de criação. Isto é impossível na ordem natural dos acontecimentos e indica um defeito nos dados — não uma execução real do processo. Causas plausíveis incluem erro de introdução manual, problema de fuso horário na exportação, ou um campo copiado de outro caso; não posso determinar qual sem acesso à origem dos dados (decisão **D2**).

**Consequência para qualquer cálculo:** não uso o COMP-90 para calcular tempo de ciclo, tempo de espera ou qualquer métrica de duração. Incluí-lo produziria uma duração negativa sem significado, o que contaminaria qualquer média ou comparação.

---

## 2. Lista de atenção

| Caso | Estado / Acção | Responsável | Classificação | Motivo |
| --- | --- | --- | --- | --- |
| **COMP-88** | «Aguardar auditoria» | «Auditoria» (grupo não reconhecido pelo desenho) | **Bloqueado por incompatibilidade de desenho** | Sem um grupo válido no workflow, não há dono accionável até a decisão D1 ser resolvida |
| **COMP-90** | Concluído (nas datas fornecidas) | não indicado | **Registo suspeito, não accionável como caso aberto** | Datas de criação/conclusão invertidas; tratar como defeito de dados, não como caso a gerir operacionalmente |

Não é possível dizer se COMP-88 está "atrasado" no sentido habitual (tempo na acção versus prazo definido), porque a acção/estado «Aguardar auditoria» e o seu prazo não existem no desenho publicado — não há prazo contra o qual medir o atraso. O que está confirmado é que o caso está **bloqueado por ambiguidade de responsabilidade**, o que já é, por si, motivo de atenção imediata independentemente da duração.

**Próximo passo recomendado para quem pode agir:** o dono do processo de Compras deve confirmar, hoje, se «Auditoria» é um passo a formalizar ou um erro de atribuição, e reatribuir manualmente o COMP-88 a Compras ou Finanças enquanto isso não for esclarecido, para que o caso tenha um responsável reconhecido pelo sistema. Esta é uma recomendação para decisão humana autorizada; este diagnóstico não reatribui casos nem publica alterações ao workflow.

---

## 3. Desempenho: não é possível ainda

O procedimento de melhoria de desempenho precisa de registos comparáveis — idealmente dois períodos com casos individuais, datas de criação e conclusão fiáveis, e a mesma versão publicada do workflow. O que foi fornecido é:

- dois casos isolados, não um período;
- um deles (COMP-90) com datas inutilizáveis para cálculo de duração;
- o outro (COMP-88) sem prazo definido para a acção/estado em que está.

Não há, portanto, ciclo médio, tempo de espera ou qualquer métrica comparável a reportar nesta análise. Apresentar um número aqui seria inventar um resultado que os dados não sustentam.

**Para tornar esta análise possível no futuro (decisão D3), a exportação a produzir precisa de:**

- todos os casos do período (não apenas os que têm problemas), com identificador, acção/estado actual, data e hora de criação e de conclusão em formato ISO 8601 com fuso horário explícito;
- o momento de observação da exportação e o fuso horário de referência;
- a versão do workflow publicado em vigor durante o período, para confirmar que os prazos e responsáveis comparados são os mesmos;
- validação de integridade mínima antes do envio (por exemplo, conclusão não anterior à criação), para evitar que casos como o COMP-90 cheguem a uma análise de desempenho sem serem detectados antes.

---

## 4. Mudança proposta

Dada a natureza dos dados disponíveis, a mudança mensurável mais defensável não é uma alteração ao tempo de ciclo (que não pode ser calculado agora), mas sim uma correcção de qualidade de dados e de desenho que impede que os dois problemas encontrados se repitam:

**Mudança:** introduzir uma validação de integridade na origem da exportação de casos (ou no processo que a gera) que rejeite ou sinalize antes da entrega: (a) qualquer caso atribuído a um grupo que não conste do desenho publicado do workflow em causa; (b) qualquer caso com data de conclusão anterior à data de criação.

**Mecanismo esperado:** os dois problemas encontrados — grupo inexistente e datas invertidas — só chegaram a este diagnóstico porque não há verificação entre a exportação e o desenho publicado, nem verificação de coerência temporal, antes de os dados saírem da origem. Uma validação nesse ponto elimina a classe de erro, em vez de depender de revisão manual caso a caso.

**Dono da mudança:** responsável pela exportação/integração de casos, em conjunto com o dono do processo de Compras para validar os grupos e acções esperados (decisão D2, ligada a D1).

**Medida de acompanhamento no próximo mês:**
- número de casos exportados com um grupo responsável fora do desenho publicado (meta: zero);
- número de casos exportados com data de conclusão anterior à de criação (meta: zero);
- tempo até à resolução de D1 (esclarecer «Auditoria») e reatribuição do COMP-88.

**Confundidor a vigiar:** se «Auditoria» for confirmado como um passo real do processo (leitura 1 da secção 1), a correcção correcta não é apenas validar a exportação — é modelar essa acção e esse grupo no workflow via `provia-workflow-change`, com atenção ao COMP-88 como caso já activo nessa situação.

---

## 5. Decisões em aberto registadas

| ID | Questão | Dono proposto |
| --- | --- | --- |
| D1 | «Auditoria» (COMP-88) é um passo real a modelar no workflow ou um erro de atribuição/dados? | Dono do processo de Compras |
| D2 | Investigar a origem das datas invertidas do COMP-90 antes de o usar em qualquer cálculo. | Responsável pela exportação/integração de casos |
| D3 | Produzir uma exportação completa e comparável para permitir uma análise real de desempenho. | Dono do processo de Compras |
| D4 | Confirmar qual grupo (Compras ou Finanças) fica com cada uma das três acções publicadas. | Dono do processo de Compras |

Registadas em `provia-project.json` (`decisions[]`).

---

## 6. Limitações dos dados

- Nenhum ficheiro de exportação nem `workflow.yaml` foi efectivamente fornecido — ambos foram descritos em texto; não confirmei a exportação nem o desenho contra o produto Provia.
- Não há momento de observação nem fuso horário indicados para os dois casos citados.
- Não se sabe se COMP-88 e COMP-90 são os únicos casos com problemas ou uma amostra de um lote maior; não generalizo a partir de dois casos.
- O desenho publicado atribui as três acções a "Compras e Finanças" em conjunto, sem indicar a atribuição exacta por acção (decisão D4); não inventei essa correspondência no manifesto.
- Nenhuma verificação foi feita no Provia em directo; este é um diagnóstico desligado (disconnected), sobre dados fornecidos numa conversa.

---

## Artefactos produzidos

- `provia-project.json` — manifesto do projecto (2 fontes descritas, 4 decisões em aberto).
- `project.html` — mapa do projecto (offline; sem workflows, grupos ou entidades porque não foram fornecidos em forma estruturada).
- `setup.md` — resumo das decisões em aberto gerado a partir do manifesto.
- `diagnostico-compras.md` — este relatório.
