## Resumo

Nenhum manifesto, desenho ou receitas foram fornecidos com o pedido, por isso parti do exemplo formativo do plugin que corresponde ao pedido: **"Pedido de compra — exemplo"** (`examples/procurement/`), que já cobre o fluxo Registar → Decidir → Confirmar cabimento → Encomendar.

Artefactos gerados no directório de trabalho:

- **`workflow.yaml`** — `provia.ao/v1` / `Workflow`, prefixo `COMP`, 4 acções com as cinco partes obrigatórias.
- **`validation.json`** — saída exacta de `validate-workflow.mjs`: `valid: true`, `backendSchemaValidation: passed`, 0 erros, 0 avisos. `destinationValidation` e `readyToPublish` continuam pendentes (dependem do Provia real).
- **`review-actions.json`** e **`editorial-review.md`** — revisão de acções: 4/4 completas, sem notas de implementação a vazar.
- **`provia-project.json`** — manifesto do projecto, com o workflow marcado `status: packaged`.
- **`setup.md`** e **`project.html`** — entrega de configuração e mapa gerados a partir do manifesto.

Pontos por resolver (no `setup.md`, não inventados): todas as acções estão atribuídas a `creator` porque não havia receitas para resolver `assigneeRef` — os donos pretendidos são os grupos `chefias`, `financas` e `compras`, a substituir antes da produção; o tipo de entidade `fornecedor` ainda não existe no destino; e há duas decisões em aberto (limite de aprovação das chefias; se a chefia pode aprovar o que ela própria registou). Falta ainda a pré-visualização de importação no Provia e a revisão de publicação pelo dono do processo — isto não é uma cópia de segurança completa.

Próximo passo sugerido: **provia-organization-rollout**, para transformar os grupos `chefias`, `financas` e `compras` deste manifesto num plano de adopção e resolver os donos reais antes de importar.

Pedido copiável:
```
Usa provia-project.json e workflow.yaml deste directório (workflow "compras") para desenhar os grupos chefias, financas e compras e planear o rollout.
```