# Pedido de despesa com aprovação da chefia e confirmação financeira: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| pedido-despesa | Pedido de despesa | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| pedido-despesa | Pedido de despesa | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. organization → create_incident |
| pedido-despesa / registar_pedido | Registar o pedido de despesa | Definir o prazo; o desenho não propõe `due` |
| pedido-despesa / decidir_chefia | Decidir sobre o pedido | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| pedido-despesa / decidir_chefia | Decidir sobre o pedido | Definir o prazo; o desenho não propõe `due` |
| pedido-despesa / confirmar_financas | Confirmar o cabimento orçamental | Atribuir o grupo à acção depois de o grupo existir (`financas`) |
| pedido-despesa / confirmar_financas | Confirmar o cabimento orçamental | Definir o prazo; o desenho não propõe `due` |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `pedido-despesa` | internal | `organization` | create_incident | Pressuposto: qualquer colaborador pode registar um pedido de despesa; a fonte não restringe quem pede (ver decisão D4). (pedido-chat §1) | por aplicar |
| `pedido-despesa` | internal | `group:chefias` | — | Vê apenas os seus casos (sem concessão) | — |
| `pedido-despesa` | internal | `group:financas` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `chefias` Chefias [role]: Decidem sobre os pedidos de despesa da sua área.. Membros propostos: Chefe de departamento
- `financas` Finanças [team]: Confirmam o cabimento orçamental dos pedidos aprovados.. Membros propostos: Técnico de orçamento

## Sinalizações de grupos

- `chefias`: Segregação de funções: confirmar responsáveis distintos. A fonte não diz se a chefia pode aprovar um pedido que ela própria registou; ver decisão D2.

## Formulários a criar e ligar

- `formulario-pedido` Formulário de pedido de despesa: Criar o formulário de entrada e ligá-lo ao workflow (pedido-despesa / formulario-pedido)

## Decisões em aberto

- **D1** Que prazos (em dias úteis) se aplicam ao registo, à decisão da chefia e à confirmação das Finanças? Nenhum foi fornecido; o YAML não define due. (Dono: Dono do processo)
- **D2** Pode a chefia aprovar um pedido que ela própria registou? Existe limite de valor acima do qual outra autoridade decide? (Dono: Dono do processo)
- **D3** Quando as Finanças não confirmam cabimento, o pedido volta à chefia, volta ao requerente ou é cancelado? O YAML instrui a não concluir e comentar; não define a rota. (Dono: Director financeiro)
- **D4** Pode qualquer colaborador registar um pedido (organization: create_incident), ou só determinados grupos? Depois de criar o formulário de entrada, o gatilho manual mantém-se activo ou é desactivado? (Dono: Dono do processo)

## Notas de configuração

- `pedido-despesa`: O YAML usa as chaves em inglês exigidas pelo contrato provia.ao/v1 (metadata, fields, actions, assignee, …); nomes, etiquetas, descrições e identificadores de campos e acções estão em português. Chaves traduzidas falham a importação (schema.unknown_key).
- `pedido-despesa`: O formulário de entrada não é transportável em YAML (nem o gatilho de formulário). A especificação está em form-pedido.json e no manifesto (forms[]); criar o formulário no Provia e ligá-lo ao workflow depois da importação.
- `pedido-despesa`: As acções decidir_chefia e confirmar_financas não têm assignee no YAML: os grupos Chefias e Finanças ainda não existem no destino. Atribuir depois de criar os grupos; não deixar o criador como aprovador.
- `pedido-despesa`: Nenhum prazo foi fornecido; due está por definir (decisão D1). Não foram inventados prazos.
- `pedido-despesa`: Contexto de país provisório: Angola (pt-AO, AOA, Africa/Luanda), assumido por omissão; confirmar com o cliente.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
