All artefacts check out. Here's the summary.

## Resumo

Criei o desenho do formulário para recolher as três propostas de fornecedores durante o pedido de compra, em `/private/var/folders/9w/z23tg8hn47j87kyfflmfzqjc0000gn/T/provia-eval-KqeXxm/form-designer-normal/`:

- **`workflow.yaml`** — adaptado do exemplo de compras do plugin (não existia nenhum workflow na pasta), com uma nova acção Form Fill `recolher_propostas` inserida entre "Registar a necessidade" e "Decidir sobre o pedido", e 16 novos campos de caso (3 blocos Fornecedor 1–3 + `justificativa_dispensa`). Validado (`valid: true`) e passou na revisão das cinco partes de cada acção (`review-actions.mjs`, 5/5 completas).
- **`form-propostas-fornecedores.md`** — especificação do formulário: campos, mapeamentos 1:1 para o caso, anexos, validação, confirmação e passos de teste.
- **`provia-project.json`** — manifesto do projecto com o workflow, o form (`forms[]` com `workflowRef`/`actionRef`) e 4 decisões em aberto. Verificado com `--check`.
- **`project.html`** e **`setup.md`** — mapa e handover gerados a partir do manifesto.

**Decisão de desenho central**: como um Form Fill não pode mapear valores concorrentes de respostas repetidas para o mesmo campo, usei **uma resposta única com três blocos de campos distintos** (não três submissões separadas). Isto assume que uma pessoa interna recolhe as três propostas fora do Provia e as regista de uma vez — o modelo alternativo (cada fornecedor preenche via ligação externa) fica registado como decisão em aberto (D1), porque o comportamento de acesso externo do Provia não foi verificado.

Outras decisões por resolver: D2 (segregação de funções — quem recolhe as propostas), D3 (tipos/tamanho de ficheiro, a confirmar com TI) e D4 (se a justificação de dispensa basta quando não há três propostas).

Próximo passo recomendado: `provia-workflow-designer`, para rever e confirmar as restantes acções do `Pedido de compra` (registar, decidir, confirmar cabimento, encomendar) com o processo real do cliente — elas foram apenas adaptadas do exemplo do plugin para esta tarefa, não desenhadas a partir de uma fonte fornecida.

```text
Use provia-workflow-designer com provia-project.json (workflow "compras") e workflow.yaml acima. Reveja as acções registar/decidir/confirmar_cabimento/encomendar face ao procedimento real de compras do cliente, mantendo a acção recolher_propostas e o formulário propostas-fornecedores já desenhados. País: Angola; responda em pt-AO.
```