# Formulário de admissão — Pedido de Compra

Not part of `workflow.yaml`. Forms, form triggers and Form Fill links are excluded from the portable `provia.ao/v1` contract, so this specification must be built directly in Provia and linked to the `submeter_pedido` action (the validator's `form_fill_link` warning tracks this).

Binds to: action `submeter_pedido` ("Submeter o pedido de compra"), type `form_fill`.

## Campos

| Campo do formulário | Vincular ao campo do workflow | Tipo | Obrigatório | Notas |
| --- | --- | --- | --- | --- |
| Justificação do pedido | `justificacao` | Texto longo | Sim | Motivo da compra e necessidade. |
| Departamento | `departamento` | Texto | Sim | Considerar lista pré-definida se a organização tiver uma lista fixa de departamentos (converter para `select` no workflow se aplicável). |
| Montante solicitado (AOA) | `montante` | Moeda (AOA, 2 casas decimais) | Sim | Corresponde ao campo `montante` do workflow. |
| Documentos de suporte | — (anexo) | Ficheiro | Não | Facturas pró-forma, cotações ou outro suporte. |

## Comportamento

- Acesso: auto-serviço (o requerente preenche ao criar o pedido). Confirmar em Provia se o link é público dentro da organização ou restrito a um grupo.
- Ao submeter, os valores devem preencher os campos do workflow `justificacao`, `departamento` e `montante` listados acima.
- Rascunho permitido antes da submissão final (ver Excepções na descrição da acção `submeter_pedido`).

## Pendências

- Confirmar se "Departamento" deve ser uma lista de opções fixa (`select`) em vez de texto livre; se sim, actualizar tanto o formulário como `fields[].type` em `workflow.yaml`.
- Confirmar limites de tamanho/tipo de ficheiro para "Documentos de suporte" com o responsável do processo.
