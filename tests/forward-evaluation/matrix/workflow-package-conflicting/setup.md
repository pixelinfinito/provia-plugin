# Configuração — Pedido de Compra (`workflow.yaml`)

Written by hand: no `provia-project.json` manifest was supplied with this request, so this handover is not machine-generated from `build-project-map.mjs --setup`. It covers the same categories the generated version would.

## Estado

- `workflow.yaml`: rascunho, estruturalmente válido (`validation.json`: `valid: true`), `readyToPublish: false`.
- `review-actions.json`: as 3 acções têm as cinco partes da instrução completas.

## Por resolver antes de publicar

| Item | Acção | O que falta |
| --- | --- | --- |
| Responsável | `submeter_pedido` | Confirmar se é auto-serviço (link público na organização) ou restrito a um grupo de requerentes. |
| Responsável | `aprovar_gestor` | Grupo/utilizador real do "gestor" — nenhum ID de destino foi fornecido; não inventado. |
| Responsável | `confirmar_financas` | Grupo/utilizador real de "Finanças" — nenhum ID de destino foi fornecido; não inventado. |
| Formulário | `submeter_pedido` | Criar/vincular o formulário em Provia após a importação (aviso `form_fill_link` do validador). Especificação em `intake-form-pedido-compra.md`. |
| Prazos (`due`) | Todas as 3 acções | Nenhum SLA foi indicado na pedido original; `due` foi deixado por definir em vez de inventado. |

## Excluído do YAML portátil (por contrato, não por omissão)

- **Nomes de propriedades**: as chaves do YAML (`metadata`, `triggers`, `fields`, `actions`, `name`, `label`, `type`, `assignee`, `config`, etc.) são fixas pelo contrato `provia.ao/v1`; chaves desconhecidas não são extensões e podem ser rejeitadas ou ignoradas na importação. Todo o texto visível ao utilizador — nome do workflow, nomes e descrições das acções, rótulos dos campos — está em português.
- **Formulário de admissão**: formulários, gatilhos de formulário e vínculos Form Fill não são transportados pelo YAML portátil. A especificação de campos está em `intake-form-pedido-compra.md` e deve ser construída directamente em Provia.

## Decisões em aberto

1. Quem é o grupo "gestor" e quem é o grupo "Finanças"? (ver tabela acima)
2. Existe um prazo-alvo (dias) para a aprovação e para a confirmação orçamental?
3. O passo de aprovação deve incluir um terceiro resultado "Devolver" (pedir mais informação) além de Aprovar/Rejeitar? O pedido original mencionou apenas três passos, pelo que este rascunho usa dois resultados.
4. "Departamento" deve ser uma lista fixa de opções (`select`) em vez de texto livre?

## Validação executada

- `node scripts/review-actions.mjs workflow.yaml` → `review-actions.json` (0 partes em falta, 0 fugas de notas de implementador).
- `node scripts/validate-workflow.mjs workflow.yaml` → `validation.json` (`valid: true`, 1 aviso do produto sobre o formulário, `readyToPublish: false`).

Pendente: validação de destino (grupos/formulário reais em Provia) e revisão humana de publicação.
