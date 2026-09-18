# Pedido — integração com o ERP: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| pedido | Pedido | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |

## Decisões em aberto

- **D1** Qual é o endpoint, método e esquema de autenticação reais da API do ERP para criar um pedido/pedido de compra? (Dono: Equipa responsável pelo ERP)
- **D2** A API do ERP suporta uma chave de idempotência (ou permite consultar se um pedido já foi criado) para evitar duplicar o registo em caso de nova tentativa após falha? (Dono: Equipa responsável pelo ERP)
- **D3** Quais os campos do pedido (montante, fornecedor, centro de custo, linhas, etc.) que o ERP exige, e qual o mapeamento para os campos do workflow do pedido? (Dono: Equipa responsável pelo ERP / dono do processo de compras)
- **D4** Este excerto assume que existe (ou vai existir) uma acção de Decisão com uma saída de aprovação no workflow real do pedido, à qual esta chamada HTTP se liga a seguir. Essa decisão ainda não está desenhada neste projecto — confirmar com provia-workflow-designer. (Dono: Dono do processo de compras)

## Notas de configuração

- `pedido`: Criar o segredo da organização ERP_API_TOKEN com o token/credencial de acesso ao ERP antes de importar.
- `pedido`: Adicionar o anfitrião real da API do ERP (substituir example.com) à lista de destinos HTTP permitidos.
- `pedido`: Ligar a acção «Enviar o pedido aprovado ao ERP» à saída «Aprovar»/«Aprovado» da decisão de aprovação do workflow real do pedido; este excerto não inclui essa decisão.
- `pedido`: Confirmar no Provia como o corpo do pedido HTTP recebe valores dos campos do caso (mapeamento dinâmico ou conteúdo estático); o corpo em workflow.yaml está vazio até essa confirmação.
- `pedido`: Confirmar o endpoint real, os campos exigidos pelo ERP e o caminho JSON da resposta com a equipa responsável pelo ERP; ver integration-requirements.md.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
