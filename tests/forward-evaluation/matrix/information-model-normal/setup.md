# Fornecedores e pedidos de compra: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

Nada pendente.

## Tipos de entidade a criar

- `fornecedor` Fornecedor

## Decisões em aberto

- **D1** O sistema de contabilidade/ERP atribui um código de fornecedor? Se sim, supplier_code copia-o (text); se não e for necessária uma referência, substituir por auto_number. (Dono: Responsável de Compras)
- **D2** O NIF e os dados bancários do fornecedor são consultados no Provia durante o pedido, ou ficam exclusivamente no sistema de contabilidade? Determina se tax_number se preenche e confirma que os dados bancários ficam fora do Provia. (Dono: Direcção Financeira)
- **D3** Confirmar os vocabulários propostos: categorias de fornecimento, condições de pagamento (prazos), moedas e estados da situação do fornecedor. (Dono: Responsável de Compras com Finanças)
- **D4** O fornecedor é conhecido quando o pedido de compra é aberto, ou só depois das cotações? Determina se a ligação ao Fornecedor no workflow é optional na criação (recomendado) ou required. (Dono: Responsável de Compras)
- **D5** Quem pode criar e editar registos de Fornecedor e quem apenas os consulta? Proposta: criação/edição pela equipa de Compras, consulta pela organização. (Dono: Responsável de Compras e administrador Provia)
- **D6** Existe uma lista estável de centros de custo ou departamentos requerentes? Se for curta e estável, um select no caso chega; se for gerida por Finanças e reutilizada noutros processos, ponderar um tipo de entidade Centro de custo. (Dono: Direcção Financeira)

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
