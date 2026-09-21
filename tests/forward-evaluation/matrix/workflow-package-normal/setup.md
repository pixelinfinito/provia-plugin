# Pedido de compra: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| compras | Pedido de compra | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. organization → create_incident, group:compras → view |
| compras / decidir | Decidir sobre o pedido | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| compras / confirmar_cabimento | Confirmar disponibilidade orçamental | Atribuir o grupo à acção depois de o grupo existir (`financas`) |
| compras / encomendar | Registar a encomenda | Atribuir o grupo à acção depois de o grupo existir (`compras`) |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `compras` | internal | `organization` | create_incident | Qualquer colaborador regista um pedido de compra para o seu departamento (sop-compras §1) | por aplicar |
| `compras` | internal | `group:compras` (Compras) | view | A equipa de Compras acompanha todos os pedidos em curso para planear as encomendas (sop-compras §4) | por aplicar |
| `compras` | internal | `group:chefias` | — | Vê apenas os seus casos (sem concessão) | — |
| `compras` | internal | `group:financas` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `chefias` Chefias de departamento [team]: Aprovam os pedidos de compra do seu departamento.. Membros propostos: Chefe de departamento
- `financas` Finanças [team]: Confirmam o cabimento orçamental.. Membros propostos: Técnico de orçamento
- `compras` Compras [team]: Emitem as encomendas e mantêm o registo de fornecedores.. Membros propostos: Técnico de compras

## Sinalizações de grupos

- `chefias`: Segregação de funções: confirmar responsáveis distintos. A chefia não pode aprovar pedidos que ela própria registou; confirmar com o dono do processo.

## Decisões em aberto

- **D1** Qual é o limite de autoridade das chefias e quem aprova acima dele? (Dono: Director financeiro)
- **D2** Pode a chefia aprovar um pedido que ela própria registou? (Dono: Dono do processo)
- **D3** O desenho aprovado do pedido de compra não foi fornecido nesta sessão; o YAML segue o desenho de referência do plugin (4 acções, 3 grupos). Confirmar que corresponde ao procedimento aprovado pelo cliente ou fornecer o procedimento para regenerar o pacote. (Dono: Dono do processo)

## Notas de configuração

- `compras`: O YAML atribui apenas a acção «Registar a necessidade» ao criador. As acções «Decidir sobre o pedido», «Confirmar disponibilidade orçamental» e «Registar a encomenda» não têm responsável no ficheiro porque os grupos ainda não existem no destino; atribuí-los no Provia depois de criar os grupos, sem substituir pelo criador.
- `compras`: O registo de fornecedores (tipo de entidade) não faz parte deste pacote; se a organização o quiser associado ao pedido, definir o tipo com provia-information-model e configurar a associação no Provia após a importação.
- `compras`: Os prazos (1, 2, 2 e 3 dias úteis) e os limites de aprovação são o desenho de referência, não regras legais nem política confirmada pelo cliente; confirmar antes de publicar.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
