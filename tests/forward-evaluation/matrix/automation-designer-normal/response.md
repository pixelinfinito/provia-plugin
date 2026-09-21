## Resumo

**Ponto de partida:** a documentação da API referida na mensagem não chegou — a pasta de trabalho estava vazia — e não existia manifesto nem workflow. Também não foi concedida permissão para ler a organização pelo conector Provia, portanto trabalhei em modo desligado. Como o skill indica, produzi uma lista de requisitos da API e um desenho com marcadores explícitos em vez de inventar um endpoint.

**Desenho da integração** (`integration-erp.md`):

- A acção HTTP `Registar o pedido aprovado no ERP` fica imediatamente a seguir à decisão `Decidir sobre o pedido de compra`; só o resultado «Aprovar» continua, logo o envio nunca corre para pedidos devolvidos ou rejeitados.
- Risco de duplicados identificado: um timeout seguido de repetição pode criar dois documentos no ERP. Até se confirmar idempotência (D2): `maxAttempts: 1`, `continue_warning`, cabeçalho `Idempotency-Key` desactivado, e uma acção humana obrigatória `Confirmar o registo do pedido no ERP` (Finanças) que pesquisa pela referência externa antes de qualquer registo manual.
- Notificação ao requerente depois da reconciliação, para a referência do ERP estar sempre preenchida.
- Segredo proposto `ERP_API_TOKEN`; domínio do ERP na lista de destinos permitidos.

**Pressupostos declarados:** Angola/pt-AO/AOA (país não indicado); as acções `preparar` e `decidir` são o mínimo assumido para situar a integração; grupos «Chefias de departamento» e «Finanças»; qualquer colaborador abre um pedido.

**Verificações executadas:** `validate-workflow.mjs` → `valid: true`, validação de destino não corrida, não pronto para publicar; `review-actions.mjs` → 3 briefs completos, 0 fugas, 3 acções sem prazo; `build-project-map.mjs --check` → 0 erros, 0 avisos, 15 itens pendentes. Nada foi criado no Provia.

**Pendente:** seis decisões em aberto (D1–D6) — sobretudo a documentação da API, a idempotência e o workflow existente. O `workflow.yaml` não deve ser importado antes de a secção 3 da especificação estar preenchida; a sintaxe de variáveis do editor HTTP do Provia não foi verificada.

**Ficheiros:** `integration-erp.md`, `workflow.yaml`, `provia-project.json`, `project.html`, `setup.md`, `validation.json`, `review-actions.json`.

Próximo passo recomendado: voltar a `provia-automation-designer` com a documentação da API anexada, para substituir os marcadores por endpoint, corpo, códigos e mapeamentos reais e resolver D1–D4. Se a documentação ainda não estiver disponível, a alternativa útil é `provia-workflow-designer` com o SOP de compras, para substituir as acções assumidas pelo workflow real (D6).

```text
Use provia-automation-designer com provia-project.json, workflow.yaml e integration-erp.md desta pasta. Anexo a documentação da API do ERP. Substitua os marcadores da acção enviar-erp (endpoint, método, autenticação, corpo, códigos esperados, jsonPath dos mapeamentos) pelos valores documentados, resolva D1–D4 (idempotência incluída) e volte a correr o validador. País: Angola; responda em pt-AO.
```