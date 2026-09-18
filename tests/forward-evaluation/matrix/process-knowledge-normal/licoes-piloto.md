# Lições do piloto — Pedido de compra (entrada assumida)

**Aviso de proveniência:** nem o workflow aprovado nem as lições do piloto foram fornecidos como ficheiros ou texto colado nesta conversa, e o directório de trabalho estava vazio. Para poder executar a tarefa pedida sem interromper com perguntas, assumi como base o exemplo de formação do próprio plugin (`workflow.yaml`, "Pedido de compra — exemplo", COMP v1) como "workflow aprovado", e registei aqui um conjunto ilustrativo e plausível de lições de piloto para esse mesmo processo. Estas lições **não** são registos reais de um piloto executado; são um enunciado de trabalho para produzir o artefacto pedido. Substituir por observações reais antes de qualquer decisão operacional.

## Piloto observado (assumido)

- Processo: `compras` — Pedido de compra — exemplo (prefixo COMP), versão 1, publicado.
- Período assumido: 10 incidentes concluídos durante um piloto de quatro semanas.

## Lições registadas

1. **Cabimento orçamental confirmado por telefone, sem captura de saldo.** Em 3 dos 10 casos, Finanças confirmou o cabimento por telefone à chefia e concluiu a acção sem anexar a captura do saldo nem preencher a `budget_reference`, alegando urgência. Isto contradiz a evidência exigida na acção `confirmar_cabimento`.
2. **Falta de proposta do fornecedor obriga a "Devolver".** Em 4 casos, o requerente não anexou proposta do fornecedor na acção `registar`; a chefia teve de escolher "Devolver" para pedir a proposta, alongando o ciclo em 1–2 dias úteis.
3. **Prazo de decisão da chefia frequentemente excedido.** A acção `decidir` excedeu o prazo de 2 dias úteis em 5 dos 10 casos; a causa observada foi a chefia acumular pedidos para decidir em lote semanalmente.
4. **Fornecedor por actualizar bloqueia a encomenda.** Em 2 casos, a acção `encomendar` não pôde ser concluída porque o registo do fornecedor estava suspenso ou com o email comercial desactualizado; não havia indicação de a quem pedir a reactivação.
5. **Pedido positivo:** quando a proposta do fornecedor já vinha anexada em `registar`, o tempo total do pedido caiu para metade; os utilizadores do piloto pediram que isso fosse reforçado na instrução da acção.

## Classificação preliminar (a confirmar pelo dono do processo)

- Lições 2, 3 e 4 apontam para reforço de instrução/evidência dentro do desenho já aprovado — não implicam alterar o workflow.
- Lição 1 é uma prática de excepção observada no terreno que **contraria** a política aprovada (evidência obrigatória do cabimento); não deve ser promovida a nova regra sem decisão do dono do processo.
