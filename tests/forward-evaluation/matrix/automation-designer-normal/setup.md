# Pedido de compra com envio ao ERP: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| pedido-compra | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| pedido-compra | Pedido de compra | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. organization → create_incident |
| pedido-compra / preparar | Preparar o pedido de compra | Definir o prazo; o desenho não propõe `due` |
| pedido-compra / decidir | Decidir sobre o pedido de compra | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| pedido-compra / decidir | Decidir sobre o pedido de compra | Definir o prazo; o desenho não propõe `due` |
| pedido-compra / confirmar-registo-erp | Confirmar o registo do pedido no ERP | Atribuir o grupo à acção depois de o grupo existir (`financas`) |
| pedido-compra / confirmar-registo-erp | Confirmar o registo do pedido no ERP | Definir o prazo; o desenho não propõe `due` |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `pedido-compra` | internal | `organization` | create_incident | Pressuposto: qualquer colaborador pode abrir um pedido de compra. Confirmar com o dono do processo (D6). (pedido-utilizador §evento) | por aplicar |
| `pedido-compra` | internal | `group:chefias` | — | Vê apenas os seus casos (sem concessão) | — |
| `pedido-compra` | internal | `group:financas` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `chefias` Chefias de departamento [role]: Aprovam os pedidos de compra do seu departamento. Pressuposto: o pedido não identifica quem aprova.
- `financas` Finanças [team]: Confirmam o registo do pedido no ERP, resolvem falhas de envio e anulam duplicados. Pressuposto: equipa que opera o ERP.

## Decisões em aberto

- **D1** A documentação da API do ERP não foi recebida. Qual é o endpoint de criação do documento, o método, o esquema do corpo, o esquema de autenticação, os códigos de resposta e o formato de erro? (Dono: Requerente (lisboa@pixel.ao) / administrador do ERP)
- **D2** O ERP suporta idempotência (cabeçalho Idempotency-Key, referência externa única que rejeita duplicados, ou GET por referência externa)? Sem isso, qualquer repetição da chamada pode criar documentos duplicados. (Dono: Administrador do ERP)
- **D3** Que documento o ERP deve criar quando o pedido é aprovado: requisição de compra, ordem de compra, cabimento orçamental ou outro? O nome da acção («Registar o pedido aprovado no ERP») será ajustado à operação real. (Dono: Finanças)
- **D4** Que campos do caso são obrigatórios no ERP (código de fornecedor em vez de nome, centro de custo codificado, IVA, moeda, data)? Os campos actuais do workflow são o mínimo assumido. (Dono: Finanças / administrador do ERP)
- **D5** Quem reconcilia as falhas de envio ao ERP e em que prazo? Assumiu-se a equipa de Finanças sem prazo definido. (Dono: Director financeiro)
- **D6** O workflow de pedido de compra existente (nome, acções, quem aprova, quem pode abrir) não foi fornecido. Confirmar que a acção HTTP fica imediatamente a seguir à decisão de aprovação existente e que a decisão só continua no resultado «Aprovar». (Dono: Dono do processo de compras)

## Notas de configuração

- `pedido-compra`: Documentação da API do ERP em falta: substituir o endpoint https://erp.example.com/SUBSTITUIR-PELO-CAMINHO-DOCUMENTADO, o método, o corpo, os códigos esperados e os jsonPath dos mapeamentos pelos valores documentados antes de importar (integration-erp.md, secção 3).
- `pedido-compra`: Segredo da organização: criar ERP_API_TOKEN (nome proposto) com a credencial do ERP; ajustar o cabeçalho Authorization ao esquema de autenticação documentado (Bearer, API key, OAuth2 client credentials).
- `pedido-compra`: Lista de destinos permitidos para HTTP: adicionar o domínio real do ERP (HTTPS obrigatório) antes de publicar.
- `pedido-compra`: Idempotência: o cabeçalho Idempotency-Key está desactivado (enabled: false) e retryConfig.maxAttempts é 1 até se confirmar que o ERP suporta chave de idempotência ou pesquisa por referência externa (D2). Só depois subir para 3 tentativas.
- `pedido-compra`: Substituição de variáveis: os marcadores <<request_number>>, <<purchase_description>>, <<purchase_amount>>, <<supplier_name>> e <<cost_center>> no corpo e no cabeçalho devem ser trocados pela sintaxe de variáveis do editor da acção HTTP no Provia; a sintaxe não foi verificada nesta sessão.
- `pedido-compra`: Mapeamentos de resposta: os campos de destino erp_document_id e erp_status existem no workflow; confirmar os jsonPath ($.id, $.status são marcadores) contra a resposta documentada.
- `pedido-compra`: Responsáveis: no YAML as acções «decidir» e «confirmar-registo-erp» ficam com o criador (simplificação de rascunho); atribuir aos grupos Chefias de departamento e Finanças no Provia após a importação.
- `pedido-compra`: Notificação «notificar-requerente»: confirmar que o canal email está activo na organização; o canal in_app não depende de configuração adicional.
- `pedido-compra`: Prazos: nenhuma acção tem due; o pedido não indica prazos de aprovação nem de reconciliação (D5).

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
