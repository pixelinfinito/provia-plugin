O pacote está gerado e validado. Ficheiros na pasta de trabalho:

| Ficheiro | Conteúdo |
| --- | --- |
| `workflow.yaml` | `provia.ao/v1`, prefixo `COMP`, 1 gatilho manual, 4 campos, 4 acções com brief em cinco partes, secção `access` emitida do manifesto |
| `validation.json` | Saída exacta de `validate-workflow.mjs` |
| `review-actions.json` | Saída exacta de `review-actions.mjs` |
| `editorial-review.md` | Revisão editorial manual (nomes, descrições, ramos, questões em aberto) |
| `provia-project.json` | Manifesto (`status: validated`, `setupNotes`, `access`, decisões D1–D3) |
| `setup.md` / `project.html` | Handover e mapa gerados por `build-project-map.mjs` |

**Pressupostos declarados**

- Não havia desenho, manifesto nem procedimento na pasta. Usei o desenho de referência de compras do plugin (registar → decidir → cabimento → encomendar; grupos Chefias, Finanças, Compras) e registei isto como decisão **D3**: o dono do processo tem de confirmar que corresponde ao procedimento aprovado, ou fornecer o procedimento para regenerar.
- País Angola / pt-AO / AOA como contexto provisório.
- Modo desligado: o servidor Provia está exposto, mas a chamada a `org_get_context` não foi autorizada nesta sessão, por isso nada foi lido nem alterado no tenant.

**O que foi verificado**

- Validador: `valid: true`, 0 erros, 0 avisos, `backendSchemaValidation: passed`, `destinationValidation: not_run`. 3 itens `setupRequired` do tipo `assignment_missing` (acções `decidir`, `confirmar_cabimento`, `encomendar`) — esperados: sem recibos dos grupos, deixei o `assignee` de fora em vez de inventar UUIDs ou substituir pelo criador.
- Gate das acções: 4/4 completas, 0 fugas de notas de implementador, `due` definido em todas.
- `--check` do manifesto: 0 erros, 0 avisos, 2 infos (chefias e financas sem concessão `view`, o que é o comportamento pretendido).

**Pendente (não feito)**: criar os 3 grupos e atribuí-los às acções; pré-visualização de importação no Provia; validação de destino; decisões D1 (limite de autoridade), D2 (segregação) e D3; revisão humana antes de publicar. O tipo de entidade Fornecedor não faz parte deste pacote.

Próximo passo recomendado: `provia-workflow-review`, para a revisão de negócio e de excepções antes da importação, já que a estrutura está validada mas D1–D3 continuam em aberto.

```text
Use provia-workflow-review com provia-project.json, workflow.yaml, validation.json e editorial-review.md nesta pasta. Reveja responsabilidades, sequência, evidências e caminhos de excepção do workflow «Pedido de compra», e trate as decisões D1, D2 e D3. País: Angola; responda em pt-AO.
```