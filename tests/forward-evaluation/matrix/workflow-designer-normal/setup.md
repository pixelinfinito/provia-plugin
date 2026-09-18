# Pedido de compra: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| compras / registar_pedido | Registar o pedido de compra | Definir o prazo; o desenho não propõe `due` |
| compras / decidir_chefia | Decidir sobre o pedido de compra | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| compras / decidir_chefia | Decidir sobre o pedido de compra | Definir o prazo; o desenho não propõe `due` |
| compras / confirmar_orcamento | Confirmar a disponibilidade orçamental | Atribuir o grupo à acção depois de o grupo existir (`financas`) |
| compras / confirmar_orcamento | Confirmar a disponibilidade orçamental | Definir o prazo; o desenho não propõe `due` |
| compras / executar_compra | Executar a compra junto do fornecedor | Atribuir o grupo à acção depois de o grupo existir (`compras`) |
| compras / executar_compra | Executar a compra junto do fornecedor | Definir o prazo; o desenho não propõe `due` |
| compras / confirmar_recepcao | Confirmar a recepção dos bens ou serviços | Definir o prazo; o desenho não propõe `due` |

## Grupos a criar

- `chefias` Chefias de departamento: Aprovar os pedidos de compra do respectivo departamento.. Membros propostos: Chefe de departamento
- `financas` Finanças: Confirmar a disponibilidade orçamental dos pedidos de compra aprovados e registar a referência orçamental.. Membros propostos: Colaborador de Finanças
- `compras` Compras: Executar as compras aprovadas junto dos fornecedores. Suposição típica de PME, não mencionada pelo utilizador — confirmar se existe uma equipa dedicada ou se a tarefa cabe a Finanças ou ao requerente.

## Sinalizações de grupos

- `financas`: Nomes alternativos: confirmar a designação. Pode ser designado «Direcção Financeira», «Contabilidade» ou «DAF» na organização; confirmar o nome usado antes da publicação.
- `compras`: Responsável sem nome nas fontes. Grupo proposto apenas como suposição de um procedimento de compras típico de PME; não há menção deste actor no pedido original.

## Decisões em aberto

- **D1** Quem integra o grupo «Chefias de departamento»: a chefia directa de cada requerente, uma chefia única, ou depende do departamento? (Dono: Dono do processo de compras)
- **D2** Existe um limiar de valor a partir do qual a aprovação sobe a uma autoridade superior à chefia (por exemplo direcção-geral)? Nenhum foi indicado; não foi codificado nenhum limiar no desenho. (Dono: Direcção)
- **D3** Quando as Finanças não confirmam disponibilidade orçamental, o pedido deve voltar ao requerente (comportamento assumido nesta versão) ou deve ser decidido pela chefia, por exemplo para aguardar orçamento ou cancelar? (Dono: Dono do processo de compras)
- **D4** Quais são os prazos esperados (SLA) para cada etapa — registo do pedido, decisão da chefia, confirmação orçamental, execução da compra e confirmação de recepção? Nenhum foi indicado, pelo que «due» ficou por definir em todas as acções. (Dono: Dono do processo de compras)
- **D5** As acções «Executar a compra» e «Confirmar a recepção», e o grupo «Compras», são uma suposição típica de PME, não mencionada no pedido original. Pertencem a este workflow, a um workflow separado, ou devem ser removidas nesta fase? (Dono: Dono do processo de compras)
- **D6** Qual é a designação oficial usada pela organização para o grupo «Finanças» (Finanças, Direcção Financeira, Contabilidade, DAF)? (Dono: Direcção Financeira)
- **D7** Qual é o país/jurisdição real da organização? Foi assumido Angola (pt-AO, AOA, Africa/Luanda) a título provisório, na ausência de indicação do utilizador. (Dono: Dono do projecto)

## Notas de configuração

- `compras`: País não indicado pelo utilizador; assumido Angola/pt-AO/AOA/Africa-Luanda a título provisório — confirmar antes de publicar.
- `compras`: As acções «executar_compra» e «confirmar_recepcao», e o grupo «compras», são suposições típicas de PME não mencionadas no pedido original; confirmar se pertencem a este workflow.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
