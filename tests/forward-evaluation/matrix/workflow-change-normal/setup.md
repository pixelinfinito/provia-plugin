# Pedido de compra — alteração dos campos obrigatórios: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| compras | Pedido de compra | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. organization → create_incident |
| compras / registar | Registar o pedido de compra | Definir o prazo; o desenho não propõe `due` |
| compras / verificar_cabimento | Verificar o cabimento orçamental | Atribuir o grupo à acção depois de o grupo existir (`financas`) |
| compras / decidir | Decidir sobre o pedido de compra | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| compras / confirmar_encomenda | Confirmar a encomenda ao fornecedor | Atribuir o grupo à acção depois de o grupo existir (`compras`) |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `compras` | internal | `organization` | create_incident | Qualquer colaborador abre um pedido de compra (assumido da versão activa; confirmar com workflow_get includeAccess). (baseline-assumida §accoes) | por aplicar |
| `compras` | internal | `group:financas` | — | Vê apenas os seus casos (sem concessão) | — |
| `compras` | internal | `group:chefias` | — | Vê apenas os seus casos (sem concessão) | — |
| `compras` | internal | `group:compras` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `financas` Finanças [team]: Verifica o cabimento orçamental dos pedidos de compra.
- `chefias` Chefias de departamento [team]: Decide sobre os pedidos de compra do seu departamento.
- `compras` Compras [team]: Emite as encomendas aos fornecedores.

## Sinalizações de grupos

- `financas`: Responsável sem nome nas fontes. Grupo assumido; confirmar o nome real no tenant antes de resolver as atribuições.
- `chefias`: Responsável sem nome nas fontes. Grupo assumido; confirmar o nome real no tenant antes de resolver as atribuições.
- `compras`: Responsável sem nome nas fontes. Grupo assumido; confirmar o nome real no tenant antes de resolver as atribuições.

## Decisões em aberto

- **D1** Quais são exactamente os campos a tornar obrigatórios (e quais deixam de o ser)? O plano assume estimated_amount, cost_center e o novo purchase_category como obrigatórios e delivery_date como opcional. (Dono: Responsável do processo de compras)
- **D2** Os casos abertos na v1 concluem-se na v1 (recomendado) ou é exigido aos requerentes que completem os novos campos obrigatórios antes de os seus casos avançarem? No segundo caso, quem preenche e até quando? (Dono: Responsável do processo de compras)
- **D3** Casos abertos que estejam a preencher o passo «Registar o pedido de compra» ou que sejam devolvidos a esse passo após a publicação: o requerente deve ser avisado de que a validação pode exigir os novos campos? Confirmar o comportamento observado num caso de teste antes de publicar. (Dono: Implementador Provia)
- **D4** Data efectiva da v2 e janela de publicação (fora do horário de registo de pedidos?), e quem comunica aos requerentes e às Finanças. (Dono: Responsável do processo de compras)
- **D5** Existe formulário de abertura (trigger form) ou Form Fill ligado a este workflow? Se sim, os campos obrigatórios do formulário têm de ser alinhados e publicados separadamente. (Dono: Implementador Provia)
- **D6** Existem relatórios, filtros guardados, integrações (HTTP) ou sub-workflows que leiam estimated_amount, cost_center ou delivery_date? Vazios históricos em casos v1 têm de ser tolerados por esses consumidores. (Dono: Implementador Provia)

## Notas de configuração

- `compras`: Plano de alteração em plano-de-alteracao.md. Baseline em workflow.current.yaml (assumida) e versão proposta em workflow.yaml.
- `compras`: Modo ligado não confirmado: a chamada a org_get_context foi recusada nesta sessão. A leitura do tenant (workflows_list, workflow_get includeVersions/includeAccess, workflow_export_yaml) fica pendente.
- `compras`: Não importar workflow.yaml como novo workflow (o item genérico «Importar o YAML como rascunho» desta entrega não se aplica a uma alteração de versão): criar um rascunho a partir da versão activa (workflow_create_draft_version ou «Nova versão» no ecrã do workflow) e aplicar as diferenças da secção 1 do plano.
- `compras`: A verificação de impacto nos casos em curso (secção 2.3 do plano) está pendente: requer a exportação dos incidentes abertos com os valores de estimated_amount, cost_center e delivery_date e a acção actual de cada um.
- `compras`: Formulário de abertura (trigger form), se existir, não é transportado pelo YAML e publica-se separadamente: alinhar os campos obrigatórios do formulário com a v2 na mesma janela de publicação.
- `compras`: Comunicar a data efectiva da v2 aos requerentes e às Finanças antes de publicar; os casos abertos continuam na v1.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
