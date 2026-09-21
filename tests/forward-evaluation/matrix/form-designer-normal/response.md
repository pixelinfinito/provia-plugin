## Formulário «Proposta de fornecedor» — desenho concluído

**Contexto assumido:** Angola (provisório, o pedido não indica país), pt-AO, Kz. Modo desligado: o servidor MCP do Provia estava disponível, mas a leitura da organização não foi autorizada nesta sessão, por isso nada foi lido nem criado no Provia. A única fonte é a frase do cliente; não havia manifesto na pasta, por isso criei um.

### Decisão central

Três propostas não podem ir para os metadados do caso a partir do formulário: várias respostas Form Fill são uma colecção para revisão e não mapeiam valores concorrentes (`provia-capabilities.md`). O desenho separa por isso dois passos:

1. **`recolher_propostas`** (Form Fill, Compras) — formulário «Proposta de fornecedor», **uma resposta por proposta**, mínimo três de fornecedores distintos, sem mapeamento. Aceita uma quarta proposta e regista quem submeteu cada uma.
2. **`comparar_propostas`** (Standard, Compras) — lê as respostas e preenche `quotation_count`, `selected_supplier`, `selected_amount`, `selection_rationale` no caso, com mapa comparativo anexado. Depois, `decidir_adjudicacao` (Decisão, chefias) com «Devolver» a regressar à recolha.

A alternativa de um único formulário com três blocos fixos (que permitiria mapear) fica documentada como não recomendada.

### Ficheiros escritos na pasta de trabalho

| Ficheiro | Conteúdo |
| --- | --- |
| `form-proposta-fornecedor.md` | Especificação: 13 campos com validação e razão de cada um, respondentes e acesso, ficheiros (PDF/JPG/PNG, limite a confirmar), texto de confirmação sem prazo prometido, acção Form Fill, 9 passos de teste, o que foi verificado vs. pendente |
| `provia-project.json` | Manifesto novo: `forms[]` com `workflowRef`/`actionRef`, `formRef` na acção, 2 grupos propostos (sinalizados como sem nome na fonte), acesso declarado, 6 decisões abertas (D1–D6) |
| `workflow.yaml` | Esqueleto da fase de propostas (4 acções, briefs de cinco partes) para ancorar o formulário — não é o desenho completo do pedido de compra |
| `validation.json`, `review-actions.json` | Saídas reais dos scripts |
| `project.html`, `setup.md` | Mapa e entrega gerados do manifesto |

### O que foi verificado

- `validate-workflow.mjs`: `valid: true`, schema backend passou, 1 aviso esperado (o formulário liga-se depois da importação), destino não validado.
- `review-actions.mjs`: 4/4 acções completas, 0 fugas de notas de implementador, `due` em falta nas 4 (sem prazo na fonte — D2).
- `build-project-map.mjs --check`: 0 erros, 0 avisos, 2 infos (Compras e chefias vêem só os seus casos, comportamento pretendido), 20 itens pendentes.

Verificações estruturais apenas; não certificam o negócio nem a publicação.

### Decisões que o cliente tem de tomar

- **D1** Quem submete: Compras regista (assumido) ou o fornecedor por ligação externa? A opção externa não está prometida e exige teste de acesso.
- **D2** Prazos para recolha, comparação e decisão.
- **D3** Excepções à regra das três propostas e quem as autoriza.
- **D4** Associar as propostas a um tipo de entidade «Fornecedor» em vez de texto livre.
- **D5** Quem adjudica e até que montante.
- **D6** Limite real de tamanho de ficheiro no Provia.

Próximo passo recomendado: `provia-workflow-designer`, porque o `workflow.yaml` só cobre a fase de propostas; o pedido de compra completo (cabimento, encomenda, recepção) e as decisões D3/D5 precisam de ser integrados à volta desta acção Form Fill. Se D4 for decidido primeiro, `provia-information-model` para o tipo «Fornecedor» é a alternativa.

```text
Use provia-workflow-designer com provia-project.json e workflow.yaml desta pasta. Complete o workflow «Pedido de compra» à volta da acção Form Fill «Recolher as propostas de fornecedores» (formulário proposta-fornecedor), mantendo o passo «Comparar as propostas e recomendar o fornecedor» e a decisão de adjudicação. Resolva ou mantenha em aberto D1–D6. País: Angola; responda em pt-AO.
```