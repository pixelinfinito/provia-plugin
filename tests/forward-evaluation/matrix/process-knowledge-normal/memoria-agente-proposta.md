# Proposta de Agent Memory — Pedido de compra (COMP)

**Estado:** proposta apenas; requer revisão de um administrador antes de ser carregada como memória do agente. Nada aqui foi aplicado.
**Regra de fundo:** só entra aqui orientação estável e aprovada, válida para qualquer caso futuro do workflow `compras`. Factos de um caso concreto (um fornecedor específico suspenso, o défice de um centro de custo num mês) ficam no incidente, nunca nesta memória.

## Glossário proposto

| Termo | Definição estável proposta | Fonte |
| --- | --- | --- |
| Cabimento orçamental | Confirmação de que o centro de custo tem saldo disponível para o montante pedido, feita com captura do saldo datada e `budget_reference` preenchida. Uma confirmação verbal ou por telefone não constitui cabimento confirmado. | `sop-compras` §3; reforçado por `licoes-piloto` L1 (excepção observada, não nova regra) |
| Fornecedor activo | Fornecedor cujo campo «Situação» está «Activo» e cujo contacto comercial está actualizado; só um fornecedor activo pode receber uma nota de encomenda. | `sop-compras` §4; `licoes-piloto` L4 |
| Proposta na origem | Proposta do fornecedor anexada já na acção `registar`, antes da decisão da chefia. | `licoes-piloto` L2, L5 (observação de piloto, não política formal) |

## Orientação estável proposta (para o agente aplicar em casos futuros)

1. **Não aceitar confirmação de cabimento sem evidência anexada**, incluindo em pedidos marcados como urgentes, até existir uma decisão do dono do processo (D3) que defina uma via alternativa formal.
2. **Verificar a «Situação» do fornecedor antes de emitir uma encomenda**; se não estiver «Activo», não avançar e pedir a actualização — sem inventar a quem dirigir esse pedido enquanto D4 estiver aberta.
3. **Sugerir ao requerente que anexe a proposta do fornecedor em `registar`** quando o pedido envolver mais de um fornecedor possível ou um montante não trivial, para reduzir devoluções pela chefia.

## Observação não promovida a memória

- A frequência de incumprimento do prazo de `decidir` (observada em L3) é um sinal de desempenho do processo, não um facto reutilizável por caso; não entra na memória do agente. Fica em `decisions[].D5`, para o dono do processo decidir se ajusta o prazo ou a cadência — e, se quiser investigar isso com dados reais de execução, é matéria de `provia-process-improvement`, não desta memória.

## Nota de proveniência

Toda a base factual acima (L1–L5) vem de `licoes-piloto.md`, que é uma entrada **assumida** para esta tarefa, não um registo real de piloto. Antes de qualquer administrador carregar isto como memória efectiva, confirmar com dados reais de execução do workflow `compras`.
