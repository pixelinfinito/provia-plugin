# Revisão editorial — Pedido de viatura (`pedido_viatura/workflow.yaml`)

Data: 2026-09-21. Âmbito: as 4 acções do ficheiro, nomes e descrições, comparadas com `proc-viaturas-v2` §2–§5. Critérios: `references/action-writing.md` (verbo inicial, objecto, cinco partes, sem notas de implementação, evidência nomeada). Esta revisão é separada do relatório estrutural `validation.json`.

## Porta determinística (`review-actions.mjs`, saída em `review-actions.json`)

| Acção | Partes presentes | Fugas | Comprimento | `due` |
| --- | --- | --- | --- | --- |
| `confirmar_disponibilidade` | 5/5 | 0 | 1165 | em falta (D1) |
| `decidir_pedido` | 5/5 | 0 | 1004 | definido (1 dia útil) |
| `entregar_viatura` | 5/5 | 0 | 1097 | em falta (`dueInSource`, relativo à data de utilização) |
| `registar_devolucao` | 5/5 | 0 | 1298 | em falta (D1) |

Resultado: `valid: true`, 4 aplicáveis, 4 completas, 0 fugas. A porta verifica a presença dos rótulos, não a qualidade do texto.

## Revisão semântica (acção a acção)

| Acção | Nome observado | Verificação | Resultado |
| --- | --- | --- | --- |
| `confirmar_disponibilidade` | Confirmar a disponibilidade de viatura para a data pedida | Verbo «Confirmar» corresponde ao «verifica» da fonte; o tipo Decision reflecte os dois desfechos. O passo «regista o pedido» está dobrado no método (passo 3), não perdido. | Sem alteração. Nota: o desfecho «Sem viatura disponível» cancela o pedido — é uma proposta (D2), assinalada, não um facto da fonte. |
| `decidir_pedido` | Decidir sobre o pedido de viatura | Segue o padrão «Decidir sobre …» para uma aprovação; os resultados «Aprovar»/«Recusar» são os da fonte. O método pede à chefia errada que reatribua — instrução necessária porque o produto não atribui a partir do campo «Chefia do colaborador». | Sem alteração. A instrução de reatribuição é operacional, não uma nota ao implementador. |
| `entregar_viatura` | Entregar a viatura e registar a quilometragem de saída | Dois actos da mesma pessoa e do mesmo momento (entrega + registo); a fonte junta-os no passo 4. A entrega da chave e do cartão fica no método. | Sem alteração. Ligeiramente longo (55 caracteres), dentro da orientação. |
| `registar_devolucao` | Registar a devolução da viatura | «Registar» é o trabalho do Secretariado; a devolução pelo colaborador está no método (passo 1). A excepção sobre danos diz explicitamente que o seguimento está fora do procedimento (D6). | Sem alteração. |

## Verificações transversais

- Nenhuma descrição contém «setup.md», «UUID», «pendente de configuração» ou referências ao manifesto.
- Todas as evidências apontam para campos existentes no YAML («Viatura», «Quilometragem de saída», «Cartão de combustível», «Quilometragem de entrada», «Danos registados», «Descrição dos danos») ou para comentários/anexos do caso.
- Autoridade e atribuição não estão no texto como prefixo de actor («Secretariado entrega…»); ficam na configuração (`assigneeRef` no manifesto) e em `setup.md`.
- Rótulos de resultado curtos: «Viatura disponível», «Sem viatura disponível», «Aprovar», «Recusar».

## Questões por resolver (não editoriais)

- D1 prazos do Secretariado; D2 comportamento sem viatura; D7 eventual resultado «Devolver para correcção». Nenhuma foi decidida nesta revisão.

## O que não foi feito

- Não houve comparação antes/depois de uma exportação (o ficheiro é novo).
- A correcção do negócio (por exemplo, se a chefia deve ver a viatura reservada antes de decidir) fica para a revisão do dono do processo.
