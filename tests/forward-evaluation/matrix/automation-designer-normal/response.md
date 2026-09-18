Especifiquei a integração com o ERP a partir do que foi realmente recebido. Um detalhe importante: **a mensagem não trouxe nenhuma documentação da API** — nem ficheiro nem texto — apesar de a referenciar; e a pasta de trabalho estava vazia, sem workflow nem manifesto do pedido existente. Por isso, em vez de inventar um endpoint ou ligar a acção a uma decisão de aprovação fictícia, produzi um excerto estrutural e a lista exacta do que falta confirmar.

Ficheiros gerados em `automation-designer-normal/`:
- **`workflow.yaml`** — excerto `provia.ao/v1` com a acção HTTP Request «Enviar o pedido aprovado ao ERP» (destino, cabeçalhos, corpo e mapeamento de resposta como marcadores de posição explícitos, não valores reais); validado estruturalmente (`validate-workflow.mjs` → `valid: true`) e revisto (`review-actions.mjs` → sem problemas na descrição da acção automatizada).
- **`provia-project.json`** — manifesto novo (nenhum existia) com o workflow `pedido`, a acção, `setupNotes` e 4 decisões em aberto (D1–D4).
- **`integration-requirements.md`** — lista dos dados que faltam da API do ERP: endpoint/autenticação, campos exigidos no corpo, caminho da resposta, idempotência/duplicação, e a ligação à decisão de aprovação (que ainda não existe no projecto).
- **`setup.md`** e **`project.html`** — gerados por `build-project-map.mjs` a partir do manifesto (`--check` passou sem erros).

Decisão de risco assumida: como não está confirmado se a API do ERP suporta uma chave de idempotência, configurei `retryConfig.maxAttempts: 1` e `failureBehavior: block_incident` — a chamada não repete sozinha; uma falha bloqueia o pedido com incidente, para evitar criar um pedido duplicado no ERP.

Próximo passo recomendado: `provia-workflow-designer`, para desenhar (ou confirmar) a Decisão de aprovação real do workflow do pedido, à qual esta acção deve ligar-se — é o maior bloqueio (D4) antes de `provia-workflow-package` poder juntar este excerto ao ficheiro final.

```text
Use provia-workflow-designer para desenhar o workflow do pedido, incluindo a Decisão de aprovação. Ligue a seguir a acção HTTP «Enviar o pedido aprovado ao ERP» já especificada em provia-project.json/workflow.yaml (chave do workflow: pedido). Assim que a documentação real da API do ERP estiver disponível, resolva as decisões D1–D3 em provia-project.json. País: Angola; responda em pt-AO.
```