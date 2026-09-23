# Fornecedores e pedidos de compra: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/provia-information-model, 2026-09-23).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

Nada pendente.

## Tipos de entidade a criar

- `fornecedor` Fornecedor

## Decisões em aberto

- **D1** O código do fornecedor deve ser gerado pelo Provia (auto_number FOR-0001) ou é o código que o sistema de contabilidade já atribui? Manter apenas um. (Dono: Finanças)
- **D2** Qual é a lista real de categorias de compra da organização, para substituir o vocabulário proposto em categorias_fornecimento? (Dono: Compras)
- **D3** Quais são as condições de pagamento efectivamente praticadas, para substituir as opções propostas? (Dono: Finanças)
- **D4** Quem pode ver e criar registos de Fornecedor? NIF, documentos de qualificação e condições comerciais ficam visíveis a toda a organização ou apenas a Compras e Finanças? (Dono: Administrador Provia, com Compras)
- **D5** Existe um processo definido de avaliação de fornecedores? Sem ele, data_proxima_avaliacao fica sem quem a preencha e não se acrescenta classificação de desempenho. (Dono: Compras)
- **D6** Já existe um tipo de entidade de fornecedor nesta organização Provia? Em caso afirmativo, reutilizar e conferir o esquema em vez de criar um segundo tipo. (Dono: Implementador)
- **D7** Que valores do fornecedor devem ser fixados no caso por fieldMapping na data da decisão (por exemplo condições de pagamento) e quais devem ser sempre consultados no registo actual? (Dono: Compras, com Finanças)

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
