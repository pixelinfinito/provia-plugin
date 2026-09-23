# Pedido de compra: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/provia-form-designer, 2026-09-23).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização |
| compras | Pedido de compra | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. organization → create_incident |
| compras / registar-propostas | Registar as propostas de fornecedores | Atribuir o grupo à acção depois de o grupo existir (`compras`) |
| compras / registar-propostas | Registar as propostas de fornecedores | Definir o prazo; o desenho não propõe `due` |
| compras / decidir-adjudicacao | Decidir a adjudicação do pedido de compra | Atribuir o grupo à acção depois de o grupo existir (`direccao-financeira`) |
| compras / decidir-adjudicacao | Decidir a adjudicação do pedido de compra | Definir o prazo; o desenho não propõe `due` |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `compras` | internal | `organization` | create_incident | Assumido: qualquer colaborador pode abrir um pedido de compra através do formulário de pedido. A confirmar com o dono do processo (D3). (pedido-utilizador §1) | por aplicar |
| `compras` | internal | `group:compras` | — | Vê apenas os seus casos (sem concessão) | — |
| `compras` | internal | `group:direccao-financeira` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `compras` Compras [team]: Recolhe as propostas dos fornecedores e regista-as no pedido de compra.. Membros propostos: Técnico de compras
- `direccao-financeira` Direcção Financeira [team]: Decide a adjudicação do pedido de compra depois de as propostas estarem registadas.. Membros propostos: Director financeiro

## Sinalizações de grupos

- `compras`: Responsável sem nome nas fontes. Grupo proposto pelo desenho do formulário; nenhum membro foi nomeado nem verificado. Confirmar em provia-organization-rollout.
- `direccao-financeira`: Responsável sem nome nas fontes. Grupo provisório, necessário para que a acção de decisão tenha dono. A autoridade real de aprovação não foi fornecida (ver D1 e D3).

## Formulários a criar e ligar

- `pedido-compra` Pedido de compra: Criar o formulário de entrada e ligá-lo ao workflow (compras / pedido-compra)
- `propostas-fornecedores` Propostas de fornecedores: Criar o formulário e ligá-lo à acção Form Fill (compras / propostas-fornecedores)

## Decisões em aberto

- **D1** Qual é a regra que exige três propostas e a partir de que montante se aplica? Abaixo desse montante bastam quantas? (Dono: Dono do processo de compras)
- **D2** Quem autoriza uma excepção quando não é possível obter três propostas (fornecedor único, urgência)? (Dono: Dono do processo de compras)
- **D3** Quem pode abrir um pedido de compra: toda a organização ou apenas grupos determinados? (Dono: Dono do processo de compras)
- **D4** Qual é a lista real de centros de custo e de categorias de compra a usar nas opções do formulário de pedido? (Dono: Direcção Financeira)
- **D5** Os valores das propostas são registados com ou sem IVA, e o que fazer quando o fornecedor cota em divisa estrangeira? (Dono: Direcção Financeira)
- **D6** Os fornecedores submetem a proposta directamente num formulário, ou é sempre Compras que a regista? O comportamento de formulários externos ou anónimos não foi verificado no destino. (Dono: Dono do processo de compras)
- **D7** Existe ou deve existir um tipo de entidade Fornecedor, para o formulário referenciar o registo em vez de repetir o nome em texto livre? (Dono: Implementador)
- **D8** Que tipos e que limite de tamanho de ficheiro estão configurados no destino para anexos de formulário? (Dono: Implementador)
- **D9** Qual é o prazo para registar as propostas e para decidir a adjudicação? Sem nível de serviço não foi configurado nenhum due. (Dono: Dono do processo de compras)
- **D10** Que grupo fica com o nível edit sobre o desenho do workflow de compras? (Dono: Dono do processo de compras)

## Notas de configuração

- `compras`: Os dois formulários são criados manualmente em Provia; o contrato portável de workflow não transporta formulários.
- `compras`: Ligar o formulário «Propostas de fornecedores» à acção Form Fill registar-propostas e configurar a política de resposta como uma única resposta por caso.
- `compras`: Confirmar no destino que os mapeamentos de resposta para metadados do caso aceitam os tipos indicados (text, currency, number, select) antes de anunciar a recolha às equipas.
- `compras`: Confirmar os tipos e o limite de tamanho de ficheiro configurados no destino; a especificação propõe PDF, JPG e PNG até 10 MB por ficheiro, valor ainda não verificado (D8).
- `compras`: As listas de opções de centro_custo e categoria estão por preencher com os valores reais do cliente (D4).
- `compras`: Nenhum prazo (due) foi configurado nas duas acções: o nível de serviço não foi fornecido (D9).
- `compras`: Este workflow é um esqueleto provisório criado para ancorar os formulários. O desenho completo do pedido de compra pertence a provia-workflow-designer.

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
