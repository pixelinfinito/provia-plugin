# Pedido de compra: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |

## Formulários a criar e ligar

- `propostas-fornecedores` Propostas de fornecedores: Criar o formulário e ligá-lo à acção Form Fill (compras / propostas-fornecedores)

## Decisões em aberto

- **D1** Cada fornecedor deve preencher a sua própria proposta através de uma ligação externa (um formulário por fornecedor), ou o requisitante regista as três centralmente num único formulário interno? (Dono: Dono do processo de compras)
- **D2** A acção de recolha de propostas deve ficar com o requisitante (creator) ou com uma equipa de compras dedicada, por segregação de funções entre quem pede e quem negoceia preços? (Dono: Dono do processo de compras)
- **D3** Que tipos e tamanho máximo de ficheiro são aceites para o documento de cada proposta? (Dono: Responsável de TI)
- **D4** Quando não for possível obter três propostas, a justificação de dispensa basta para concluir a acção ou deve exigir uma aprovação adicional antes de avançar? (Dono: Dono do processo de compras)

## Notas de configuração

- `compras`: workflow.yaml foi adaptado do exemplo de compras do plugin apenas para acolher a acção Form Fill pedida nesta tarefa; as acções registar/decidir/confirmar_cabimento/encomendar não foram revistas com o processo real do cliente e devem ser confirmadas com provia-workflow-designer.
- `compras`: Criar e associar o formulário 'propostas-fornecedores' à acção recolher_propostas em Provia; o vínculo não é transportado pelo YAML.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
