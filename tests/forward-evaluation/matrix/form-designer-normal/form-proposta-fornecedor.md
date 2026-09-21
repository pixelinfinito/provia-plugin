# Formulário «Proposta de fornecedor» — especificação

Projecto `compras` · workflow `compras` (Pedido de compra) · acção `recolher_propostas` · manifesto `provia-project.json` · 2026-09-21.

Contexto: Angola (provisório, o pedido não indica país), pt-AO, Kz/AOA, Africa/Luanda. Modo desligado: nada foi criado nem lido no Provia. O servidor MCP do Provia estava disponível no anfitrião, mas a leitura da organização (`org_get_context`) não foi autorizada nesta sessão.

Fonte: uma frase do cliente — «Precisamos de recolher três propostas de fornecedores durante um pedido de compra.» (`pedido-2026-09-21` §1). Não foi fornecido procedimento de compras, política de fornecedores nem exportação; tudo o que vai além dessa frase é pressuposto ou recomendação e está marcado como tal.

## 1. Decisão de desenho: Form Fill com várias respostas, sem mapeamento

| Pergunta | Resposta | Base |
| --- | --- | --- |
| O envio cria um caso ou fornece evidência a um caso existente? | Evidência a um caso existente. As propostas chegam a meio do pedido de compra, depois de a necessidade estar registada. | Pedido do cliente («durante um pedido de compra»); `provia-capabilities.md`: Form Fill recolhe respostas dentro de um caso. |
| Tipo de formulário | Formulário de acção (Form Fill) ligado à acção «Recolher as propostas de fornecedores». Não é formulário de abertura. | Procedimento do skill, passo 1. |
| Uma resposta ou várias? | **Várias respostas, uma por proposta, mínimo três de fornecedores distintos.** | O cliente quer três propostas; um formulário com três blocos fixos não aceita uma quarta proposta nem regista quem não respondeu. |
| As respostas mapeiam valores para os metadados do caso? | **Não.** Três respostas teriam três montantes e três fornecedores; várias respostas são uma colecção para revisão e não podem mapear valores concorrentes. | `provia-capabilities.md`: «Single responses may map values; multiple responses remain separate for review and cannot map competing values to incident metadata.» |
| Como chegam os valores da proposta escolhida ao caso? | Pela acção seguinte, «Comparar as propostas e recomendar o fornecedor» (Standard, Compras), que preenche `quotation_count`, `selected_supplier`, `selected_amount` e `selection_rationale` a partir das respostas. | Passo de revisão proposto pelo skill quando várias propostas competiriam pelo mesmo campo. |

Alternativa não recomendada: uma única resposta com três blocos «Fornecedor 1/2/3» e um campo «proposta escolhida», que permitiria mapear o fornecedor e o montante directamente. Perde-se a quarta proposta, o registo por fornecedor e a separação entre quem recolhe e quem recomenda. Só faz sentido se o cliente confirmar que são sempre exactamente três e que a mesma pessoa recolhe e escolhe.

## 2. Respondentes e acesso

| Aspecto | Confirmado | Recomendação | Pendente |
| --- | --- | --- | --- |
| Quem responde | Nada confirmado. | O técnico de Compras responsável pela acção regista cada proposta recebida (por email, em papel ou em mão). Respondente interno, autenticado, dentro do caso. | D1: se o cliente quiser que o próprio fornecedor submeta a proposta por ligação externa, isso depende do comportamento configurado dos formulários no Provia; **não está prometido** e precisa de um teste de acesso com um fornecedor de teste antes de ser anunciado. |
| Acesso ao caso | Quem executa a acção vê o caso sem concessão adicional. | Sem conceder `view` a Compras; a equipa só vê os pedidos que lhe são atribuídos. | Se Compras acompanhar todos os pedidos (fila partilhada), acrescentar `group:compras → view` no manifesto com a razão e a fonte. |
| Anonimato | Não aplicável. | Não prometer respostas anónimas: cada resposta fica ligada ao utilizador que a submeteu, o que é a evidência pretendida. | — |

## 3. Campos

Chaves em inglês, rótulos em pt-AO. Tipos escolhidos entre os que o schema de formulários da revisão inspeccionada aceita (`auto_number` excluído; opções dependentes não preservadas em formulários — `metadata-fields.md`). Nenhum campo mapeia para metadados do caso (secção 1).

| # | Chave | Rótulo | Tipo | Obrig. | Validação / configuração | Porque se pede |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `supplier_name` | Nome do fornecedor | text | Sim | Não vazio. | Identifica a proposta; a comparação exige fornecedores distintos. |
| 2 | `supplier_nif` | NIF do fornecedor | text | Não | Texto livre; não validar formato sem regra confirmada. | Distingue fornecedores homónimos; reutilizável se existir tipo de entidade Fornecedor (D4). |
| 3 | `supplier_contact_email` | Email do contacto comercial | email | Não | Formato de email. | Esclarecimentos durante a comparação. |
| 4 | `proposal_reference` | Referência da proposta | text | Não | — | Rastreio com o documento do fornecedor. |
| 5 | `proposal_date` | Data da proposta | date | Sim | Data válida. | Ordena as propostas e verifica a validade. |
| 6 | `proposal_amount` | Montante total da proposta (Kz) | currency | Sim | AOA, 2 decimais, mínimo 0. | Base da comparação; é o valor que Compras copiará para `selected_amount` se for a escolhida. |
| 7 | `amount_includes_tax` | O montante inclui impostos? | boolean | Sim | — | Evita comparar montantes com e sem impostos. Não se assume nenhuma taxa. |
| 8 | `valid_until` | Proposta válida até | date | Sim | Data válida; recomenda-se avisar (não bloquear) se anterior a hoje. | Uma proposta caducada não deve ser recomendada sem confirmação do fornecedor. |
| 9 | `delivery_days` | Prazo de entrega (dias) | number | Não | Inteiro, mínimo 0. | Critério de comparação além do preço. |
| 10 | `payment_terms` | Condições de pagamento | text | Não | — | Critério de comparação; ex.: «50% na adjudicação e 50% na entrega». |
| 11 | `scope_compliance` | Conformidade com a especificação | select | Sim | Opções: `full` Cumpre integralmente · `partial` Cumpre parcialmente · `alternative` Propõe alternativa. Sem valor por omissão. | Obriga quem regista a ler a proposta face à especificação. |
| 12 | `proposal_file` | Ficheiro da proposta | file | Sim | Ver secção 4. | A proposta escrita é a evidência; sem ficheiro a resposta não conta. |
| 13 | `notes` | Observações | rich_text | Não | — | Desvios, exclusões, condições especiais. |

Regras de validação que o formulário não consegue impor sozinho e ficam na acção (descrição de «Recolher as propostas de fornecedores» e de «Comparar as propostas»):

- Mínimo de três respostas de fornecedores distintos antes de concluir a acção — verificado pelo técnico e reconfirmado pela chefia na decisão. Se o Provia permitir configurar um número mínimo de respostas na política do Form Fill, usar essa configuração; não está confirmado que exista.
- Um fornecedor, uma resposta: uma proposta revista substitui-se por nova resposta com nota em `notes`, não por edição silenciosa.

## 4. Ficheiros

| Item | Especificação | Estado |
| --- | --- | --- |
| Campo | `proposal_file`, obrigatório, um ficheiro por resposta. | Recomendação |
| Formatos | PDF (proposta emitida pelo fornecedor); JPG/PNG (proposta em papel digitalizada). | Recomendação |
| Tamanho | Até 10 MB por ficheiro como valor de trabalho. O limite real de carregamento do Provia não consta do contrato pinado e tem de ser confirmado na interface (D6). | Pendente |
| Porquê | A proposta escrita é a evidência que a chefia e a auditoria vão consultar; os campos 1–13 são um resumo para comparação, não a substituem. | — |
| Mapa comparativo | Não entra no formulário; é anexado ao caso na acção «Comparar as propostas». | — |

## 5. Confirmação após submissão

Texto de confirmação proposto (pt-AO), sem prometer prazo por não existir prazo confirmado (D2):

> Proposta de **{supplier_name}** registada neste pedido de compra. Cada proposta é uma resposta separada: submeta o formulário de novo para a próxima proposta. Quando existirem pelo menos três propostas de fornecedores distintos, conclua a acção «Recolher as propostas de fornecedores»; Compras compara-as e a chefia decide a adjudicação.

Se o Provia não permitir inserir o valor de um campo na confirmação, usar a versão sem o nome do fornecedor.

## 6. A acção Form Fill

| Elemento | Valor |
| --- | --- |
| Título do formulário | Proposta de fornecedor |
| Nome da acção | Recolher as propostas de fornecedores |
| Tipo | form_fill · `localId` `recolher_propostas` |
| Responsável pretendido | grupo `compras` (proposto, D1); no YAML de ensaio está o criador por não existirem identificadores do destino |
| Política de respostas | várias respostas; mínimo três; uma por fornecedor; sem mapeamento para o caso |
| Prazo | não definido (D2) |
| Descrição | cinco partes em `workflow.yaml`; a parte «Evidência» nomeia as respostas submetidas ao formulário «Proposta de fornecedor», cada uma com o ficheiro anexado |

Acções vizinhas que o formulário serve: `registar` (antes: descreve o que se compra e a data-limite), `comparar_propostas` (depois: lê as respostas e preenche os quatro campos do caso), `decidir_adjudicacao` (depois: confirma que há três respostas ou uma excepção justificada; «Devolver» regressa a `recolher_propostas`).

## 7. Passos de teste (a executar no Provia depois de criar e ligar o formulário)

Nenhum destes passos foi executado; estão aqui para o implementador.

1. Importar `workflow.yaml` como rascunho e confirmar na pré-visualização o aviso esperado «Form must be re-linked after import» na acção `recolher_propostas`.
2. Criar o formulário «Proposta de fornecedor» com os 13 campos da secção 3 e ligá-lo à acção; configurar várias respostas por acção. Anotar se a interface permite um mínimo de respostas.
3. Abrir um caso de teste, chegar à acção e submeter **três** respostas com fornecedores distintos, cada uma com um PDF. Confirmar que as três ficam visíveis no caso como respostas separadas e que nenhum campo do caso (`selected_amount`, etc.) foi alterado.
4. Submeter uma quarta resposta e confirmar que é aceite (o desenho não limita a três).
5. Tentar submeter sem ficheiro e sem `proposal_amount`; ambos devem ser recusados.
6. Carregar um ficheiro acima do limite que a interface indicar; registar o limite real em D6.
7. Concluir a acção, preencher os quatro campos em «Comparar as propostas» e verificar que a chefia vê as respostas e o mapa comparativo na decisão.
8. Em «Decidir a adjudicação», escolher «Devolver» e confirmar que o caso regressa a `recolher_propostas` com as respostas anteriores intactas.
9. Só se D1 for decidido a favor do acesso externo: testar a ligação com um utilizador fornecedor de teste e registar o resultado antes de comunicar a opção aos fornecedores.

## 8. O que foi verificado, o que está pendente

Verificado nesta sessão (ficheiros nesta pasta):

- `workflow.yaml` — `node scripts/validate-workflow.mjs`: `valid: true`, `backendSchemaValidation: passed`, 1 aviso esperado (ligação do formulário), `readyToPublish: false`, validação de destino não executada (`validation.json`).
- `workflow.yaml` — `node scripts/review-actions.mjs`: 4/4 acções com as cinco partes, 0 fugas de notas de implementador, `due` em falta nas 4 (`review-actions.json`).
- `provia-project.json` — `build-project-map.mjs --check`: 0 erros, 0 avisos, 2 infos (grupos atribuídos sem concessão, comportamento pretendido), 20 itens pendentes; `project.html` e `setup.md` gerados.

Estas verificações são estruturais. Não validam este documento, não provam correcção do negócio e não substituem a pré-visualização de importação nem a publicação por pessoa autorizada.

Pendente: D1 a D6 no manifesto; criação e ligação do formulário no Provia; atribuição dos grupos; prazos; limite real de ficheiros; teste de acesso externo se aplicável.
