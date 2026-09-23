## A resposta curta

O fornecedor é **um tipo de entidade**; o pedido de compra é **um caso (incidente) do workflow de compras**, não um segundo tipo de entidade. Cada pedido liga-se a um registo de Fornecedor e lê os dados dele; nada se repete.

| Objecto | Onde vive | Porquê |
| --- | --- | --- |
| Fornecedor | Tipo de entidade `Fornecedor` (ícone `Truck01`) | É escolhido em muitos pedidos, tem ciclo de vida próprio e é mantido por Compras/Finanças |
| Pedido de compra | Caso do workflow | É uma execução única: o que se precisa, quando, quanto, quem aprovou |
| A ligação | Secção `entities` do workflow: `mode: entity_type`, `entityType: Fornecedor`, `requirement: optional` | O caso aponta para o registo em vez de o copiar |

`requirement: optional` porque na abertura do pedido o fornecedor pode ainda não estar escolhido. Também **não** se cria no fornecedor uma lista inversa dos seus pedidos — o relatório de casos já filtra por fornecedor ligado.

Dois avisos que mudam o desenho:

- `fieldMapping` **copia** valores da entidade para o caso no momento da ligação. É cópia pontual, não sincronização: use-a só para fixar o que precisa de provar mais tarde (as condições de pagamento na data da decisão). Contactos, morada e situação consultam-se no registo, para o caso mostrar sempre o dado actual.
- O campo `situacao` («Suspenso», «Aprovado com condições») **informa** quem escolhe; não bloqueia a selecção. Esse controlo tem de estar na acção do workflow.

## Ficheiros escritos em `information-model-normal/`

- `catalogue.json` — tipo `Fornecedor` com 21 campos agrupados (identificação, classificação, responsabilidade, contactos, localização, situação, condições comerciais, evidência), cada um com finalidade, origem, responsável de manutenção, sensibilidade e exemplo sintético; revisão de cobertura das 9 dimensões.
- `catalogue.html` — catálogo offline com 189 controlos de cópia para configuração manual.
- `pedido-de-compra-campos.md` — os 14 campos propostos para o caso, a ligação `entities`, o que copiar por `fieldMapping` e a lista do que deixa de ser reintroduzido.
- `provia-project.json` + `project.html` + `setup.md` — manifesto do projecto com `entityTypes[]` e 7 decisões em aberto.

Verificado: `build-entity-catalogue.mjs --check` (1 tipo, sem erros editoriais) e `build-project-map.mjs --check` (0 avisos, 8 itens pendentes). O HTML foi inspeccionado por leitura do ficheiro — sem dependências externas — mas não abri um navegador, pelo que os botões de cópia não foram premidos. Nada foi criado no Provia.

## Pressupostos e o que falta decidir

Não forneceu procedimentos, exportações nem catálogo existente, por isso avancei com um contexto declarado: **Angola, pt-AO, AOA/Kz** (provisório — a língua não determina a jurisdição). Os vocabulários (categorias, criticidade, situações, condições de pagamento) são propostas minhas, não política verificada.

Só 2 dos 21 campos são obrigatórios na criação (categorias e situação), porque é o que quem registra um fornecedor novo sabe. As decisões que ficam com dono em `setup.md`: se o código do fornecedor é gerado pelo Provia ou vem da contabilidade (D1, evita dois códigos), as listas reais (D2, D3), quem vê NIF e documentos (D4), se existe processo de avaliação (D5), se já existe um tipo de fornecedor na organização (D6, reutilizar em vez de duplicar) e o que fixar por `fieldMapping` (D7). Dados bancários ficam deliberadamente de fora, no sistema onde o pagamento é executado.

---

Próximo passo recomendado: `provia-workflow-designer`, para desenhar o workflow de compras onde estes campos e a ligação ao fornecedor são efectivamente configurados — o catálogo só produz valor quando as acções o consomem.

```text
Use provia-workflow-designer com o provia-project.json desta pasta. Desenhe o workflow «Pedido de compra» com a ligação entities ao tipo Fornecedor (mode entity_type, requirement optional) e os campos de caso especificados em pedido-de-compra-campos.md. Inclua a verificação da situação do fornecedor antes da adjudicação e acrescente entityRefs às acções que usam o fornecedor. Preserve as decisões D1-D7 em aberto. País: Angola; responda em pt-AO.
```