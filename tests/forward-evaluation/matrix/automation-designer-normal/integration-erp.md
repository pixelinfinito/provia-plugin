# Especificação de integração: envio do pedido aprovado ao ERP

Projecto `pedido-compra` · Angola (contexto provisório, não indicado no pedido) · pt-AO · Africa/Luanda · AOA · 2026-09-21
Gerado por `provia-skills/1.2.0` (`provia-automation-designer`), revisão de contrato `fed8efaf019abc901cb2b229f3676dc4031126fa`.

## 1. O que foi recebido e o que falta

**Confirmado (fonte `pedido-utilizador`):**

- Evento: a aprovação do pedido.
- Efeito pretendido: enviar o pedido ao ERP através da API do ERP.

**Não recebido:**

- A documentação da API do ERP (fonte `erp-api-doc`). A mensagem refere «esta documentação», mas a pasta de trabalho estava vazia e nenhum ficheiro ou ligação acompanhou o pedido. Nenhum endpoint, esquema, autenticação ou código de resposta foi lido.
- O workflow de pedido de compra existente (nome, acções, quem aprova, quem pode abrir).
- O país, a organização e o prazo de reconciliação.

**Consequência:** esta especificação não contém um endpoint real. Contém a lista de requisitos a extrair da documentação (secção 3), o desenho das acções automáticas com marcadores explícitos, o tratamento de falhas e duplicados, e a configuração que o implementador terá de fazer. O ficheiro `workflow.yaml` é um esqueleto estruturalmente válido; **não deve ser importado** antes de a secção 3 estar preenchida.

**Ligação ao Provia:** a permissão para ler a organização através do conector Provia não foi concedida nesta sessão, pelo que tudo o que se segue é modo desligado. Nada foi criado, alterado ou publicado no Provia.

## 2. Desenho da automação

### 2.1 Onde a chamada acontece

A execução sequencial do Provia garante que uma acção só activa quando a anterior conclui. A acção HTTP fica **imediatamente a seguir** à decisão de aprovação, e a decisão só «continua» no resultado «Aprovar»; «Devolver» volta à preparação e «Rejeitar» cancela o caso. Assim, o envio ao ERP nunca corre para um pedido devolvido ou rejeitado, sem qualquer condição adicional.

```
preparar (criador) → decidir (chefias) ─Aprovar──► enviar-erp (HTTP) → confirmar-registo-erp (Finanças) → notificar-requerente
                                       ─Devolver─► preparar
                                       ─Rejeitar─► caso cancelado
```

As acções `preparar` e `decidir` são o **mínimo assumido** para situar a integração; substituem-se pelas acções do workflow real quando este for fornecido (D6).

### 2.2 Acções acrescentadas

| localId | Tipo | Nome | Responsável | O que faz |
| --- | --- | --- | --- | --- |
| `enviar-erp` | HTTP Request | Registar o pedido aprovado no ERP | — (automática) | POST ao ERP com os dados do pedido; guarda a referência devolvida em `erp_document_id` e o estado em `erp_status`. |
| `confirmar-registo-erp` | Standard | Confirmar o registo do pedido no ERP | Finanças | Verifica que existe exactamente um documento no ERP para o pedido; regista manualmente se a chamada falhou; anula duplicados. |
| `notificar-requerente` | Notification | Informar o requerente do registo no ERP | — (automática) | Aviso in_app + email ao criador com indicação do campo «Documento no ERP». |

O nome da acção HTTP diz o que a operação faz: **registar** o pedido no ERP. Não aprova nada no ERP, não cria compromissos de pagamento e não executa pagamentos. Se a documentação mostrar que o endpoint cria outra coisa (ordem de compra, cabimento), o nome ajusta-se à operação real (D3).

### 2.3 Configuração da acção HTTP (`enviar-erp`)

| Parâmetro | Valor no esqueleto | Estado |
| --- | --- | --- |
| `endpoint` | `https://erp.example.com/SUBSTITUIR-PELO-CAMINHO-DOCUMENTADO` | **Marcador.** Substituir pelo endpoint documentado. HTTPS é obrigatório pelo contrato. |
| `method` | `POST` | Pressuposto (criação de documento). Confirmar. |
| `headers` | `Authorization: Bearer {{secret:ERP_API_TOKEN}}`, `Content-Type: application/json`, `Idempotency-Key: <<request_number>>` (desactivado) | Nome do segredo proposto; esquema de autenticação a confirmar. `Idempotency-Key` só se activa se a API o suportar (D2). |
| `body` | JSON com `externalReference`, `description`, `amount`, `currency`, `supplier`, `costCenter`, `source` | **Marcador.** Os nomes das chaves são hipóteses; o esquema real vem da documentação (D4). |
| `responseMappings` | `$.id → erp_document_id` (required), `$.status → erp_status` | **Marcador.** Os jsonPath vêm da resposta documentada. Os campos de destino existem no workflow. |
| `executionTiming` | `automatic` | Executa quando a acção activa, isto é, logo após «Aprovar». |
| `timeoutSeconds` | `30` | Dentro do intervalo 10–120 do contrato. Subir se a documentação indicar latências maiores. |
| `retryConfig` | `maxAttempts: 1`, `failureBehavior: continue_warning` | Ver 2.5. |
| `expectedStatusCodes` | `[200, 201]` | **Marcador.** Confirmar na documentação (alguns ERP devolvem 202 e processam de forma assíncrona). |

**Substituição de variáveis:** os marcadores `<<campo>>` no corpo e no cabeçalho indicam o campo do caso a inserir. A sintaxe de variáveis do editor da acção HTTP no Provia não foi verificada nesta sessão (sem acesso à documentação do produto nem ao ecrã); o implementador troca os marcadores pela sintaxe que o editor oferece.

### 2.4 Mapeamento pedido → ERP (a preencher com a documentação)

| Campo do caso (Provia) | Tipo | Chave no corpo (hipótese) | Campo do ERP (documentado) | Obrigatório no ERP? | Transformação |
| --- | --- | --- | --- | --- | --- |
| `request_number` (PC-000001) | auto_number | `externalReference` | ? | ? | Referência externa única; base da idempotência |
| `purchase_description` | text | `description` | ? | ? | — |
| `purchase_amount` | currency | `amount` | ? | ? | Número sem separadores; confirmar casas decimais |
| — | — | `currency` | ? | ? | Constante `AOA` (pressuposto Angola) |
| `supplier_name` | text | `supplier` | ? | ? | Se o ERP exigir código de fornecedor, é preciso um campo `supplier_code` ou uma entidade Fornecedor (D4) |
| `cost_center` | text | `costCenter` | ? | ? | Se o ERP exigir código, usar select com os códigos do ERP |
| — | — | `source` | ? | ? | Constante `provia` (rastreabilidade) |

Mapeamento resposta → caso:

| jsonPath (hipótese) | Campo do caso | Obrigatório | Nota |
| --- | --- | --- | --- |
| `$.id` | `erp_document_id` | sim | Se o ERP não devolver o identificador na criação, `required: true` fará a acção falhar; passar a `false` e usar a reconciliação |
| `$.status` | `erp_status` | não | Útil quando o ERP processa de forma assíncrona |

### 2.5 Falhas, repetições e duplicados

**Risco identificado:** uma repetição da chamada depois de um timeout pode criar **dois documentos no ERP** para o mesmo pedido, porque o ERP pode ter criado o documento e a resposta ter-se perdido. Uma configuração aceite pelo validador não prova que as repetições sejam seguras.

Desenho adoptado até D2 ser resolvida:

1. `maxAttempts: 1` — sem repetição automática.
2. `failureBehavior: continue_warning` — o caso não fica bloqueado numa acção sem responsável humano; a falha fica registada como aviso e o caso avança para `confirmar-registo-erp`.
3. `confirmar-registo-erp` (Finanças) é a reconciliação: verifica `erp_document_id`; se vazio, **pesquisa primeiro no ERP pela referência externa** e só depois regista manualmente; se houver dois documentos, anula o duplicado segundo o procedimento de Finanças e comenta no caso.

Quando D2 for resolvida:

- **ERP suporta `Idempotency-Key` ou rejeita referência externa duplicada** → activar o cabeçalho, subir `maxAttempts` para 3, manter `continue_warning` e a reconciliação (que passa a ser uma verificação rápida).
- **ERP só suporta GET por referência externa** → manter `maxAttempts: 1`; a reconciliação continua a ser o mecanismo anti-duplicado.
- **ERP não suporta nada** → manter exactamente o desenho actual e registar a decisão como aceite pelo Director financeiro.

Alternativa não adoptada: `failureBehavior: block_action` bloqueia o caso na acção HTTP até intervenção; é mais seguro contra avanços silenciosos, mas a acção HTTP não tem responsável e o bloqueio não gera uma tarefa para ninguém. A reconciliação obrigatória em `confirmar-registo-erp` cobre o mesmo risco com um responsável nomeado.

### 2.6 Notificação

`notificar-requerente`: `recipientType: creator`, `channels: [in_app, email]`, assunto «Pedido de compra registado no ERP». Corre depois da reconciliação, para que a referência esteja sempre preenchida quando o requerente é avisado. Não requer UUIDs (destinatário «criador»).

### 2.7 O que não é necessário

- Wait: não há prazo nem webhook a aguardar; se o ERP responder 202 e processar de forma assíncrona, acrescentar um Wait de tipo `webhook` (token gerado pelo Provia) ou uma segunda chamada GET de consulta — decisão dependente de D1.
- Sub-workflow: o registo no ERP não justifica um workflow filho.
- Gatilho agendado: não pedido.

## 3. Requisitos a extrair da documentação da API (D1)

Preencher antes de tocar no YAML:

1. **URL base e endpoint** de criação do documento; ambiente de testes vs. produção.
2. **Método** (POST/PUT) e **Content-Type**.
3. **Autenticação**: Bearer estático, API key em cabeçalho, OAuth2 client credentials (neste caso a acção HTTP do Provia não obtém tokens; é preciso um token de longa duração ou um intermediário).
4. **Esquema do corpo**: campos obrigatórios, tipos, formatos de montante e data, códigos de fornecedor e centro de custo.
5. **Resposta de sucesso**: código(s) HTTP e onde está o identificador do documento (jsonPath).
6. **Erros**: códigos 4xx/5xx, formato do erro, se 409 significa duplicado.
7. **Idempotência**: cabeçalho suportado, unicidade da referência externa, endpoint de consulta por referência.
8. **Limites**: rate limits, timeouts do lado do ERP, tamanho máximo do corpo.
9. **Rede**: domínio e IPs a colocar na lista de destinos permitidos do Provia; se o ERP exigir IP fixo de origem, confirmar com o suporte do Provia.

## 4. Configuração no Provia (fora do YAML)

Tudo isto está também em `setup.md` (gerado do manifesto):

- Segredo da organização `ERP_API_TOKEN` (nome proposto; valor nunca entra no YAML nem no manifesto).
- Domínio do ERP na lista de destinos HTTP permitidos.
- Grupos «Chefias de departamento» e «Finanças»; atribuição das acções `decidir` e `confirmar-registo-erp` (no YAML ficam com o criador, simplificação de rascunho declarada).
- Canal email activo para a notificação.
- Prazos (`due`) das acções humanas: nenhum foi indicado.

## 5. Verificações executadas nesta sessão

| Verificação | Ficheiro | Resultado |
| --- | --- | --- |
| `node scripts/validate-workflow.mjs workflow.yaml` | `validation.json` | `valid: true`, `backendSchemaValidation: passed`, `destinationValidation: not_run`, `readyToPublish: false`; 1 aviso (segredo `ERP_API_TOKEN` a criar), 2 itens de configuração (segredo, destinatários da notificação). |
| `node scripts/review-actions.mjs workflow.yaml` | `review-actions.json` | 5 acções; 3 briefs de cinco partes completos; 0 fugas de notas de implementador; 3 acções sem `due`. |
| `node scripts/build-project-map.mjs provia-project.json --check` | — | 0 erros, 0 avisos, 2 infos (grupos atribuídos sem concessão de visualização, comportamento esperado); 15 itens pendentes. |
| `--output project.html`, `--setup setup.md` | `project.html`, `setup.md` | Gerados. |

O que estas verificações **não** provam: que o endpoint existe, que o corpo é aceite pelo ERP, que o segredo está criado, que o domínio está permitido, que as repetições são seguras. A validação de destino e a publicação ficam pendentes de uma pessoa autorizada no Provia.

## 6. Factos, recomendações e decisões

**Factos:** evento = aprovação; destino = ERP via API; documentação não recebida; workflow existente não fornecido.

**Recomendações:** HTTP imediatamente após a decisão; uma tentativa e `continue_warning` até D2; reconciliação humana obrigatória por Finanças; referência externa = número do pedido; notificação ao criador depois da reconciliação.

**Decisões em aberto (manifesto `decisions[]`):** D1 documentação da API; D2 idempotência; D3 documento criado no ERP; D4 campos obrigatórios do ERP; D5 quem reconcilia e em que prazo; D6 workflow existente e posição da acção.

## Ficheiros entregues

- `integration-erp.md` — esta especificação.
- `workflow.yaml` — esqueleto com as acções automáticas e marcadores; não importar antes da secção 3.
- `provia-project.json` — manifesto do projecto (criado nesta sessão; não existia).
- `project.html` — mapa do projecto.
- `setup.md` — entrega de configuração gerada do manifesto.
- `validation.json`, `review-actions.json` — saídas exactas dos scripts.
