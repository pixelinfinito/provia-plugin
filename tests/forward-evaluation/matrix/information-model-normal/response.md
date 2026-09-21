## Resposta

**Fornecedor** é um tipo de entidade; **Pedido de compra** é um caso do workflow, não uma entidade. O caso liga-se ao registo do fornecedor (secção `entities` do workflow com `mode: entity_type`, ou um campo de caso do tipo `entity`) e lê nele nome, contacto, NIF, condições e contrato. Só os factos daquele pedido (valor, justificação, centro de custo, fornecedor adjudicado, condição acordada, cotações) se escrevem no caso. Copia-se da entidade para o caso apenas o que deve ficar congelado à data do pedido (por exemplo condições de pagamento habituais → condição acordada, editável); é um instantâneo, não sincronização.

**Pressupostos declarados:** Angola como contexto provisório; nenhum procedimento ou catálogo foi fornecido; a permissão para `org_get_context` não foi concedida, portanto trabalhei em modo desligado sem ler a organização Provia.

## Ficheiros escritos no directório de trabalho

| Ficheiro | Conteúdo |
| --- | --- |
| `catalogue.json` | Tipo `Fornecedor` — ícone `Truck01`, padrão de Nome, 18 campos em 6 grupos (identificação, classificação, contactos, responsabilidade, condições comerciais, ciclo de vida), cobertura, notas de configuração e prontidão |
| `catalogue.html` | Catálogo offline com controlos de cópia, gerado do mesmo JSON |
| `modelo-informacao.md` | A resposta desenvolvida: divisão entidade/caso, campos propostos para o caso do pedido, forma de ligação e mapeamentos, percurso sintético, alternativas rejeitadas |
| `provia-project.json` | Manifesto com `entityTypes[]` e decisões D1–D6 |
| `project.html`, `setup.md` | Mapa do projecto e entrega de configuração |

**Verificado:** `build-entity-catalogue.mjs --check` (1 tipo, forma editorial válida) e `build-project-map.mjs --check` (0 avisos, 6 decisões em aberto). Os botões de cópia do HTML não foram exercidos num browser. Nada foi criado no Provia.

**Fica por decidir pelo dono do processo:** D1 código de fornecedor (ERP vs `auto_number`); D2 NIF/dados bancários no Provia ou só na contabilidade; D3 vocabulários dos selects; D4 se o fornecedor é conhecido na abertura do pedido (define `optional`/`required`); D5 quem cria e edita fornecedores; D6 centro de custo como select ou entidade.

Próximo passo recomendado: `provia-workflow-designer`, para desenhar o workflow «Pedido de compra» que consome este tipo — é aí que a ligação ao Fornecedor, os campos do caso e a verificação «fornecedor activo» na aprovação ganham forma.

```text
Use provia-workflow-designer com provia-project.json e modelo-informacao.md neste directório. Desenhe o workflow «Pedido de compra» com ligação ao tipo de entidade Fornecedor (entities mode entity_type, requirement optional, decisão D4), os campos do caso propostos na secção 3 do relatório, e uma acção de aprovação cuja descrição inclua a verificação do registo do fornecedor (Situação = Activo, NIF confirmado). Registe as decisões D1–D6 como dependências. País: Angola; responda em pt-AO.
```