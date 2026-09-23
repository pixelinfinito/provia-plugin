# Pedido de compra: campos do caso, não um segundo tipo de entidade

Complemento de `catalogue.json` (tipo `fornecedor`). Especificação editorial para configuração manual; não é um payload de importação Provia. Contexto assumido: Angola, pt-AO, AOA/Kz, Africa/Luanda — a confirmar.

## A decisão de desenho

| Objecto | Onde vive no Provia | Porquê |
| --- | --- | --- |
| Fornecedor | Tipo de entidade `Fornecedor` | É escolhido em muitos pedidos, tem ciclo de vida próprio (qualificação, suspensão, reavaliação) e é mantido por Compras e Finanças |
| Pedido de compra | Caso (incidente) do workflow de compras | É uma execução única: o que se precisa, quando, quanto, quem aprovou, quando chegou |
| A ligação entre os dois | Secção `entities` do workflow, `mode: entity_type`, `entityType: Fornecedor`, `requirement: optional` | O caso aponta para um registo; os dados do fornecedor ficam num só lugar |

Não se cria um tipo de entidade «Pedido de compra». Existiriam então dois registos do mesmo pedido — o caso, que é onde as acções, os prazos e as aprovações acontecem, e uma entidade paralela que alguém teria de manter em sincronia à mão.

Também não se cria no Fornecedor uma lista inversa dos seus pedidos. O relatório de casos já filtra por fornecedor ligado; uma lista mantida à mão no registo fica desactualizada.

`requirement: optional` porque no momento em que o pedido é aberto o fornecedor pode ainda não estar escolhido — a escolha acontece depois das propostas. Se o procedimento real exigir fornecedor identificado desde a abertura, passar a `required`.

## O que deixa de ser repetido

Estes dados são lidos no registo do fornecedor e **não** se voltam a introduzir em cada pedido: razão social, NIF, contacto e email comerciais, telefone, email de facturação, morada, condições de pagamento acordadas, moeda habitual, prazo de entrega habitual, situação do fornecedor e referência no sistema de contabilidade.

Quem trata do pedido abre o fornecedor ligado a partir do caso e vê tudo isto. Um fornecedor novo é registado uma vez; a partir daí o pedido não repete nada dele.

## Cópia deliberada (`fieldMapping`), não sincronização

`fieldMapping` copia valores da entidade para os metadados do caso no momento em que a ligação é feita. É uma cópia pontual: se as condições de pagamento do fornecedor mudarem no ano seguinte, os casos antigos mantêm o valor copiado e os novos recebem o novo valor. Não há sincronização contínua.

Isso torna a cópia útil exactamente num caso: quando é preciso provar mais tarde em que condições a decisão foi tomada. Proposta mínima, a confirmar (decisão D7 no manifesto):

| Copiar para o caso | Razão |
| --- | --- |
| `condicoes_pagamento` → `condicoes_pagamento_na_decisao` | Fixar o prazo de pagamento que vigorava quando o pedido foi aprovado |
| `moeda_habitual` → `moeda_prevista` | Registar a moeda esperada no momento da decisão |

Tudo o resto — contactos, morada, situação, NIF — consulta-se no registo, para que o caso mostre sempre o dado actual em vez de um contacto antigo copiado.

## Campos propostos para o caso «Pedido de compra»

Todos são metadados do workflow, não campos de entidade. Tipos conforme a revisão Provia `2641364d9c1aa0aa2b76aa788ef521bcb6218118`; opções e prazos são propostas sintéticas, porque não foi fornecido nenhum procedimento de compras.

| Campo | Tipo | Obrigatório na abertura | Finalidade |
| --- | --- | --- | --- |
| `numero_pedido` | `auto_number` (`prefix: PC-`, `padding: 4`) | não (gerado) | Referência do pedido para correspondência interna |
| `descricao_necessidade` | `rich_text` | sim | O que se precisa, em linguagem do requerente |
| `categoria_compra` | `select` | sim | Encaminhar o pedido e procurar fornecedores da categoria; usar o mesmo vocabulário de `categorias_fornecimento` |
| `quantidade` | `number` | não | Quantificar, quando aplicável |
| `data_necessidade` | `date` | sim | Data em que o bem ou serviço é preciso |
| `valor_estimado` | `currency` | não | Encaminhar a aprovação; o requerente pode não saber na abertura |
| `moeda_prevista` | `select` (`aoa`, `usd`, `eur`, `outra`) | não | Moeda esperada; pode vir copiada do fornecedor |
| `centro_de_custo` | `text` ou `select` | sim | Imputar a despesa; substituir por `select` quando a lista real for conhecida |
| `justificacao` | `rich_text` | sim | Fundamentar o pedido para quem aprova |
| `propostas_recebidas` | `file` | não | Anexar as propostas consultadas |
| `fornecedor_alternativo` | `entity` (alvo `Fornecedor`) | não | Referir um segundo fornecedor consultado, quando o procedimento exigir alternativas; a escolha principal é a entidade ligada ao caso |
| `condicoes_pagamento_na_decisao` | `select` (opções de `condicoes_pagamento`) | não | Cópia deliberada, ver acima |
| `valor_adjudicado` | `currency` | não | Valor efectivamente aprovado |
| `data_entrega_confirmada` | `date` | não | Fechar o pedido com a entrega verificada |

O fornecedor escolhido **não** é um destes campos: é a entidade ligada ao caso pela secção `entities`. `fornecedor_alternativo` existe só porque a ligação nativa é um registo, não uma lista.

Fica no caso, e não no fornecedor, tudo o que pertence a esta execução: requerente (o criador do caso, nativo), decisão de aprovação (evidência da acção de decisão), comentários e prazos (nativos do workflow).

## O que este desenho não faz

- Um campo `select` de situação no fornecedor não impede que alguém escolha um fornecedor suspenso. A verificação pertence à acção do workflow e ao seu texto de instruções.
- `auto_number` não garante numeração sem intervalos nem reinício anual, e a sequência não é exportada no YAML.
- Ligar a entidade não cria integração com contabilidade nem com ERP. `referencia_contabilidade` é uma referência para consulta manual.
- Nada aqui foi criado no Provia. Os ficheiros são artefactos do plugin.

## Verificações feitas

- `catalogue.json` validado com `build-entity-catalogue.mjs --check` (1 tipo, sem erros editoriais): formato, chaves, ícone, tipos de campo, exemplos e configuração de `auto_number`.
- `provia-project.json` validado com `build-project-map.mjs --check`: 1 tipo de entidade, 0 avisos, 8 itens pendentes (7 decisões em aberto e o tipo a criar).
- `catalogue.html` e `project.html` gerados e inspeccionados por leitura do ficheiro (conteúdo, 189 controlos de cópia, nenhuma dependência externa). Não foi aberto um navegador nesta sessão, pelo que os botões de cópia não foram premidos.
- Não foi validada nenhuma correspondência com a versão de destino do Provia, nem com política, procedimento ou legislação: não foi fornecido nenhum documento.
