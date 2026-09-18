# Pedido de compra: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |

## Decisões em aberto

- **D1** Quantos pedidos (incidentes) estão actualmente em curso neste workflow, e em que acção se encontra cada um? Sem esta contagem não é possível confirmar o impacto real da alteração. (Dono: Dono do processo de compras)
- **D2** Confirmar se «Referência orçamental» (budget_reference) deve mesmo passar a obrigatória para todos os pedidos, incluindo os já em curso, ou só para pedidos criados a partir da nova versão. (Dono: Dono do processo de compras)
- **D3** Confirmar se «Categoria da despesa» (expense_category, novo campo) é mesmo o campo obrigatório pretendido, e os valores correctos das opções (Bens/Serviços/Obras) — nenhuma lista foi fornecida pelo utilizador, esta é uma proposta ilustrativa. (Dono: Dono do processo de compras)
- **D4** Como devem ser tratados os pedidos em curso sem valor em budget_reference/expense_category quando a v2 for publicada: aceitar a lacuna, pedir ao requerente que complete o campo por comentário/página, ou bloquear a acção seguinte até estar preenchido? A plataforma não garante um comportamento único — confirmar com o fornecedor/ambiente real antes de publicar. (Dono: Dono do processo de compras)

## Notas de configuração

- `compras`: Confirmar responsáveis reais (assignee) antes de publicar; o rascunho usa `creator` por não existir organização ligada.
- `compras`: workflow.yaml é a linha de base assumida como a versão activa (v1); workflow.v2-draft.yaml é a proposta com os campos obrigatórios alterados. Nenhum export real foi fornecido — ver workflow-change-report.md.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
