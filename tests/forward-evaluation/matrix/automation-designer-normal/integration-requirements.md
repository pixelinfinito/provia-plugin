# Integração com o ERP — requisitos pendentes

O pedido menciona "esta documentação da API", mas nenhum ficheiro, URL ou texto de especificação chegou a esta tarefa — só o pedido em português foi recebido. Sem a documentação real, não é possível confirmar um endpoint, um esquema de autenticação ou um mapeamento de campos; inventar qualquer um deles violaria a regra de nunca supor uma API. `workflow.yaml` contém por isso um excerto estrutural com o destino, o corpo e o caminho de resposta assinalados como marcadores de posição, não como valores reais.

Antes de configurar a acção «Enviar o pedido aprovado ao ERP», confirme com a equipa responsável pelo ERP:

## 1. Destino e autenticação
- URL base e caminho do endpoint para criar um pedido/pedido de compra (por exemplo, `POST /api/v1/purchase-requests`).
- Esquema de autenticação: chave de API em cabeçalho, OAuth2 client-credentials, autenticação básica, ou outro.
- Nome e forma de obtenção do segredo a guardar como referência de organização no Provia (usado em `workflow.yaml` como `{{secret:ERP_API_TOKEN}}` — nome de exemplo, a confirmar).
- Anfitrião(s) a incluir na lista de destinos HTTP permitidos.

## 2. Corpo do pedido
- Lista exacta dos campos exigidos pelo ERP (por exemplo, montante, moeda, centro de custo, fornecedor, linhas do pedido, requisitante) e os respectivos tipos e formatos.
- Campos opcionais e valores por omissão aceites pelo ERP.
- Confirmar no Provia (não documentado na revisão do contrato consultada) como o corpo de um pedido HTTP recebe valores dos campos do caso: mapeamento dinâmico campo-a-campo ou apenas conteúdo estático por importação. Isto determina se o mapeamento de campos abaixo é sequer possível sem um passo intermédio.
- Mapeamento entre os campos do workflow do pedido (a definir pelo desenho aprovado do workflow) e os campos exigidos pelo corpo do ERP.

## 3. Resposta e evidência
- Estrutura da resposta de sucesso e o caminho JSON exacto do identificador do registo criado no ERP (usado como `responseMappings[].jsonPath`; `$.id` em `workflow.yaml` é um exemplo, não confirmado).
- Códigos de estado HTTP de sucesso esperados (200, 201 ou outro).
- Formato das respostas de erro, para decidir o que regista o incidente quando a chamada falha.

## 4. Idempotência e duplicação
- A API do ERP aceita uma chave de idempotência, um número de pedido interno único, ou outro mecanismo para evitar criar dois pedidos quando o Provia tenta novamente após uma falha (tempo limite, erro de rede)?
- Em alternativa, existe uma forma de consultar o ERP para confirmar se um pedido com a mesma referência já foi criado antes de repetir o envio?
- Enquanto isto não for confirmado, `workflow.yaml` usa `retryConfig.maxAttempts: 1` e `failureBehavior: block_incident`: a acção não tenta automaticamente outra vez; uma falha bloqueia o pedido com incidente para verificação manual no ERP antes de qualquer reenvio, precisamente para não criar um pedido duplicado.

## 5. Ligação ao workflow real do pedido
- Este projecto não tinha nenhum `workflow.yaml` nem `provia-project.json` antes desta tarefa. O excerto entregue assume que a acção «Enviar o pedido aprovado ao ERP» será colocada a seguir à saída de aprovação de uma Decisão já existente ou a desenhar no workflow real do pedido.
- Essa Decisão (critérios de aprovação, autoridade, outras saídas) está fora do âmbito desta tarefa; use `provia-workflow-designer` para a desenhar ou confirmar, e depois `provia-workflow-package` para juntar este excerto ao ficheiro final.

Nenhum destes pontos foi confirmado; todos ficam registados como decisões em aberto em `provia-project.json` (D1–D4).
