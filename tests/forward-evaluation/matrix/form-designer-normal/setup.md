# Pedido de compra — recolha de três propostas de fornecedores: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| compras | Pedido de compra | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. organization → create_incident |
| compras / registar | Registar a necessidade de compra | Definir o prazo; o desenho não propõe `due` |
| compras / recolher_propostas | Recolher as propostas de fornecedores | Atribuir o grupo à acção depois de o grupo existir (`compras`) |
| compras / recolher_propostas | Recolher as propostas de fornecedores | Definir o prazo; o desenho não propõe `due` |
| compras / comparar_propostas | Comparar as propostas e recomendar o fornecedor | Atribuir o grupo à acção depois de o grupo existir (`compras`) |
| compras / comparar_propostas | Comparar as propostas e recomendar o fornecedor | Definir o prazo; o desenho não propõe `due` |
| compras / decidir_adjudicacao | Decidir a adjudicação | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| compras / decidir_adjudicacao | Decidir a adjudicação | Definir o prazo; o desenho não propõe `due` |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `compras` | internal | `organization` | create_incident | Pressuposto: qualquer colaborador pode abrir um pedido de compra para o seu departamento; o pedido do cliente não restringe quem inicia. (pedido-2026-09-21 §1) | por aplicar |
| `compras` | internal | `group:compras` | — | Vê apenas os seus casos (sem concessão) | — |
| `compras` | internal | `group:chefias` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `compras` Compras [team]: Pedem e registam as propostas de fornecedores, comparam-nas e recomendam o fornecedor.. Membros propostos: Técnico de compras
- `chefias` Chefias de departamento [team]: Decidem a adjudicação com base nas propostas registadas e na recomendação de Compras.. Membros propostos: Chefe de departamento

## Sinalizações de grupos

- `compras`: Responsável sem nome nas fontes. Grupo proposto pelo desenho do formulário; o pedido não nomeia quem recolhe as propostas. Confirmar com o dono do processo.
- `chefias`: Responsável sem nome nas fontes. Grupo proposto; o pedido não diz quem adjudica nem até que montante. Ver decisão D5.

## Formulários a criar e ligar

- `proposta-fornecedor` Proposta de fornecedor: Criar o formulário e ligá-lo à acção Form Fill (compras / proposta-fornecedor)

## Decisões em aberto

- **D1** Quem submete cada proposta: o técnico de Compras regista as propostas recebidas, ou o próprio fornecedor responde por uma ligação externa? A opção externa depende do comportamento configurado dos formulários no Provia e de um teste de acesso. (Dono: Dono do processo de compras)
- **D2** Qual é o prazo para recolher as três propostas e para a comparação e decisão? Nenhuma acção tem «due» até haver um prazo de serviço confirmado. (Dono: Dono do processo de compras)
- **D3** Quando é admissível avançar com menos de três propostas (fornecedor único, urgência, montante abaixo de um limiar) e quem autoriza a excepção? (Dono: Dono do processo de compras)
- **D4** As propostas devem ficar associadas a registos de um tipo de entidade «Fornecedor» (com NIF e contactos reutilizáveis) em vez de texto livre no formulário? (Dono: Compras)
- **D5** Quem decide a adjudicação e até que montante? O desenho assume as chefias de departamento sem limite definido. (Dono: Direcção financeira)
- **D6** Qual é o limite de tamanho por ficheiro e os formatos aceites para a proposta? O desenho recomenda PDF/JPG/PNG até 10 MB; o limite real de carregamento do Provia tem de ser confirmado na interface. (Dono: Implementador)

## Notas de configuração

- `compras`: O workflow.yaml é um esqueleto da fase de propostas, escrito para ancorar o formulário «Proposta de fornecedor»; o desenho completo do pedido de compra (cabimento, encomenda, recepção) pertence ao provia-workflow-designer.
- `compras`: O YAML atribui todas as acções ao criador porque não existem identificadores do destino. Os responsáveis pretendidos são os grupos deste manifesto (assigneeRef); substituí-los com resolve-workflow-refs.mjs quando existirem recibos, ou manualmente no Provia.
- `compras`: A acção «Recolher as propostas de fornecedores» é do tipo Form Fill e importa sem formulário: criar o formulário «Proposta de fornecedor» no Provia, ligá-lo à acção e configurar a política de múltiplas respostas antes da publicação (form-proposta-fornecedor.md).
- `compras`: Nenhuma acção tem prazo (due): o pedido não indica prazos de serviço. Ver decisão D2.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
