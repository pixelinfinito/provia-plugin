# Pedido de compra: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.1, 2026-09-23).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| compras | Pedido de compra | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. organization → create_incident |
| compras / registar_pedido | Registar o pedido de compra | Definir o prazo; o desenho não propõe `due` |
| compras / decidir_pedido | Decidir sobre o pedido de compra | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| compras / decidir_pedido | Decidir sobre o pedido de compra | Definir o prazo; o desenho não propõe `due` |
| compras / confirmar_cabimento | Confirmar a disponibilidade orçamental | Atribuir o grupo à acção depois de o grupo existir (`financas`) |
| compras / confirmar_cabimento | Confirmar a disponibilidade orçamental | Definir o prazo; o desenho não propõe `due` |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `compras` | internal | `organization` | create_incident | Proposta: qualquer colaborador abre o seu pedido de compra. A fonte não delimita quem pode abrir um pedido; confirmar em D6 antes de aplicar. (descricao-compras §1) | por aplicar |
| `compras` | internal | `group:chefias` | — | Vê apenas os seus casos (sem concessão) | — |
| `compras` | internal | `group:financas` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `chefias` Chefias [team]: Decidem sobre os pedidos de compra do seu âmbito. Proposto a partir de «a chefia aprova o pedido»; a organização tem de confirmar se é um grupo único ou um grupo por departamento.. Membros propostos: Chefia do requerente
- `financas` Finanças [team]: Confirmam a disponibilidade orçamental do montante pedido no centro de custo indicado.. Membros propostos: Técnico de orçamento

## Sinalizações de grupos

- `chefias`: Responsável sem nome nas fontes. A fonte diz «a chefia» sem identificar quem é nem se varia por departamento. Ver D3.
- `chefias`: Segregação de funções: confirmar responsáveis distintos. A mesma pessoa pode ser requerente e chefia decisora do mesmo pedido. Ver D4.
- `financas`: Nomes alternativos: confirmar a designação. «Finanças» pode corresponder a Direcção Financeira, DAF ou Contabilidade no organigrama. Confirmar o nome oficial antes de criar o grupo, porque o Provia resolve as autorizações pelo nome. Ver D5.

## Decisões em aberto

- **D1** Existe um procedimento de compras escrito? Fornecê-lo para completar a classificação de passos: o desenho actual assenta em duas frases, não no procedimento. (Dono: Quem pediu o desenho do workflow)
- **D2** Em que sequência correm a decisão da chefia e a confirmação do cabimento? Proposto: chefia primeiro, Finanças depois, para não gastar trabalho das Finanças em pedidos que serão rejeitados. Alternativas: cabimento primeiro, ou as duas em paralelo. (Dono: Dono do processo de compras)
- **D3** Quem é «a chefia» que aprova: um grupo único de chefias, ou um grupo por departamento? E qual é o limite de autoridade de aprovação, e quem decide acima dele? (Dono: Dono do processo de compras)
- **D4** Pode uma chefia decidir sobre um pedido que ela própria registou? O desenho instrui a encaminhar, mas a regra não consta da fonte. (Dono: Dono do processo de compras)
- **D5** Qual é o nome oficial da equipa das Finanças no Provia (Finanças, Direcção Financeira, DAF)? O importador resolve as autorizações pelo nome do grupo e descarta nomes ambíguos. (Dono: Dono do processo de compras)
- **D6** Quem pode abrir um pedido de compra: toda a organização, ou apenas certas áreas? Se for restrito, o arranque manual passa a ter lista de grupos autorizados. (Dono: Dono do processo de compras)
- **D7** Que grupo é dono do desenho deste workflow (nível edit, que inclui publicar) e quem autoriza a publicação? (Dono: Dono do processo de compras)
- **D8** Que prazos têm a decisão da chefia e a confirmação do cabimento? Sem resposta, as acções ficam sem due. (Dono: Dono do processo de compras)
- **D9** Quando não há cabimento, o pedido volta ao requerente para correcção (desenho proposto) ou é encerrado pelas Finanças? A fonte descreve uma confirmação, não um caminho negativo. (Dono: Dono do processo de compras)
- **D10** O que acontece depois de confirmado o cabimento? Encomenda ao fornecedor, recepção, conferência da factura e pagamento fazem parte deste workflow ou de outro? (Dono: Dono do processo de compras)
- **D11** Existe lista oficial de centros de custo e de categorias de compra? Com ela, cost_centre passa de texto livre a selecção validada. (Dono: Finanças)

## Notas de configuração

- `compras`: O procedimento escrito de compras não foi fornecido. O desenho cobre apenas as duas regras enunciadas (a chefia aprova; as Finanças confirmam o cabimento) mais o registo do pedido, que é condição das duas. Ver D1.
- `compras`: O servidor MCP da Provia está listado neste ambiente, mas a leitura org_get_context não foi autorizada nesta sessão. Nada foi lido nem escrito na organização: os grupos Chefias e Finanças são propostas, não grupos existentes, e podem ter de ser associados a grupos já criados.
- `compras`: Nenhuma acção tem due: a fonte não fixa prazos. Configurar depois de D8 ser respondida; um prazo inventado não é um acordo de serviço.
- `compras`: A confirmação do cabimento está desenhada como Decisão para que «Sem cabimento» tenha caminho de retorno. Se a organização preferir uma acção Standard sem desfecho negativo, o caso fica sem saída quando não há saldo. Ver D9.
- `compras`: O workflow termina na confirmação do cabimento. Encomenda, recepção, factura e pagamento não constam da fonte e não estão desenhados. Ver D10.
- `compras`: cost_centre é um campo de texto. Com uma lista oficial de centros de custo passa a select com opções. Ver D11.
- `compras`: As responsabilidades em YAML: registar_pedido está atribuída ao criador; decidir_pedido e confirmar_cabimento ficam sem assignee até os grupos existirem no Provia. Nenhum identificador foi inventado.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
