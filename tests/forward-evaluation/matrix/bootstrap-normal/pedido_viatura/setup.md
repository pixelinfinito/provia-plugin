# Pedido de viatura: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| pedido_viatura | Pedido de viatura | Importar o YAML como rascunho e rever a pré-visualização (`pedido_viatura/workflow.yaml`) |
| pedido_viatura | Pedido de viatura | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. organization → create_incident |
| pedido_viatura / confirmar_disponibilidade | Confirmar a disponibilidade de viatura para a data pedida | Atribuir o grupo à acção depois de o grupo existir (`secretariado`) |
| pedido_viatura / confirmar_disponibilidade | Confirmar a disponibilidade de viatura para a data pedida | Definir o prazo; o desenho não propõe `due` |
| pedido_viatura / decidir_pedido | Decidir sobre o pedido de viatura | Responsável definido à mão em cada caso: o produto não atribui a partir de um campo; o YAML leva o substituto (`field:chefia_colaborador`). chefias |
| pedido_viatura / entregar_viatura | Entregar a viatura e registar a quilometragem de saída | Atribuir o grupo à acção depois de o grupo existir (`secretariado`) |
| pedido_viatura / entregar_viatura | Entregar a viatura e registar a quilometragem de saída | Configurar o prazo à mão em cada caso; a fonte fixa um prazo que `due` não exprime. event_relative: Até à data de utilização indicada no pedido (campo «Data de utilização») |
| pedido_viatura / registar_devolucao | Registar a devolução da viatura | Atribuir o grupo à acção depois de o grupo existir (`secretariado`) |
| pedido_viatura / registar_devolucao | Registar a devolução da viatura | Definir o prazo; o desenho não propõe `due` |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `pedido_viatura` | internal | `organization` | create_incident | Qualquer colaborador pede a viatura ao secretariado; o pedido é aberto pelo próprio colaborador com data, destino e motivo (proc-viaturas-v2 §1) | por aplicar |
| `pedido_viatura` | internal | `group:secretariado` | — | Vê apenas os seus casos (sem concessão) | — |
| `pedido_viatura` | internal | `group:chefias` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `secretariado` Secretariado [team]: Verifica a disponibilidade no mapa de viaturas, regista os pedidos, entrega e recebe as viaturas e mantém o registo de viaturas.. Membros propostos: Técnico/a de secretariado (1 de 2), Técnico/a de secretariado (2 de 2)
- `chefias` Chefias de departamento [team]: Aprovam ou recusam os pedidos de viatura dos colaboradores do seu departamento. Grupo de recurso da acção de decisão: a chefia concreta é a indicada no campo «Chefia do colaborador» de cada pedido.. Membros propostos: Chefe de departamento (5 pessoas, uma por departamento; departamentos não nomeados nas fontes)
- `direccao_geral` Direcção-Geral [role]: Chefia das chefias de departamento: decide os pedidos feitos pelas próprias chefias (proposta) e é a dona do processo proposta para o desenho do workflow. O procedimento v2 não lhe atribui nenhum passo.. Membros propostos: Director/a-Geral

## Sinalizações de grupos

- `chefias`: Segregação de funções: confirmar responsáveis distintos. Uma chefia que pede viatura para si própria não deve aprovar o seu pedido; proposta: indicar a Direcção-Geral no campo «Chefia do colaborador» (decisão D4).
- `direccao_geral`: Actor de pessoa única: definir substituto. Uma só pessoa; definir quem decide na sua ausência (decisão D4).

## Tipos de entidade a criar

- `viatura` Viatura

## Formulários a criar e ligar

- `pedido-viatura` Pedido de viatura: Criar o formulário de entrada e ligá-lo ao workflow (pedido_viatura / pedido-viatura)

## Decisões em aberto

- **D1** Qual é o prazo do Secretariado para confirmar a disponibilidade (§2) e para registar a devolução (§5)? O procedimento só fixa o prazo da chefia (um dia útil). (Dono: Direcção-Geral, com o Secretariado)
- **D2** Quando não há viatura disponível na data pedida, o pedido é cancelado com comentário (desenho proposto) ou o Secretariado propõe outra data ao colaborador antes de decidir? (Dono: Direcção-Geral, com o Secretariado)
- **D3** Quem é o dono do processo e recebe «edit» no workflow (proposta: Direcção-Geral)? Até à resposta, só o importador e os administradores editam o desenho. (Dono: Direcção-Geral)
- **D4** Quem decide o pedido quando o requerente é uma chefia de departamento (proposta: Direcção-Geral, indicada no campo «Chefia do colaborador») e quem decide na ausência da chefia ou da Direcção-Geral? (Dono: Direcção-Geral)
- **D5** O mapa de viaturas passa a ser o tipo de entidade Viatura no Provia (mais os pedidos aprovados como reservas) ou mantém-se na ferramenta actual, ficando o Provia apenas com a referência da viatura no pedido? (Dono: Secretariado)
- **D6** O que acontece depois de o Secretariado registar danos na devolução (§5)? O procedimento termina no registo; o seguimento (orçamento, responsabilidade, seguro) está fora do âmbito da v2. (Dono: Direcção-Geral)
- **D7** Recomendação: acrescentar à decisão da chefia um resultado «Devolver para correcção» que reabra o pedido ao colaborador? Exige uma acção inicial do criador como destino de retorno; o procedimento v2 só prevê aprovar ou recusar. (Dono: Direcção-Geral)

## Notas de configuração

- `pedido_viatura`: O YAML omite «assignee» nas acções do Secretariado e da chefia porque não existem identificadores do tenant; atribuir os grupos Secretariado e Chefias de departamento na interface antes de publicar.
- `pedido_viatura`: A acção «Decidir sobre o pedido de viatura» tem a intenção «chefia indicada no campo Chefia do colaborador»; o produto não atribui a partir de um campo, por isso o grupo Chefias de departamento é o responsável configurado e a descrição pede à chefia errada que reatribua.
- `pedido_viatura`: Associar o campo «Viatura» (tipo entity) ao tipo de entidade Viatura depois de o criar; o YAML não transporta o identificador do tipo.
- `pedido_viatura`: O formulário de entrada «Pedido de viatura» (forms[]) não é transportado pelo YAML; criar no Provia, ligar ao workflow e verificar que os campos do formulário mapeiam para os campos do caso.
- `pedido_viatura`: O prazo de entrega da viatura (§4) é relativo à data de utilização do pedido; o contrato não exprime prazos relativos a um campo, por isso fica como configuração manual ou instrução.
- `pedido_viatura`: Sem prazos no procedimento para as acções do Secretariado (§2, §5): «due» fica vazio até à decisão D1.
- `pedido_viatura`: O Secretariado vê todos os pedidos por atribuição; se o mapa de viaturas passar a ser consultado a partir dos casos aprovados no Provia, avaliar um relatório em vez de um grant «view».

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs pedido_viatura/workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
