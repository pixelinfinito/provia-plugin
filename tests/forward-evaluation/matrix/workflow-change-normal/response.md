## Resumo

Não foi fornecido o workflow real, exports nem dados de pedidos em curso, e a pasta de trabalho estava vazia — não há servidor `provia-implementer` ligado, por isso trabalhei em **modo desligado**, sem país indicado (assumi Angola/pt-AO a título provisório). Para demonstrar o método de planeamento de alteração, usei como substituto ilustrativo o exemplo de formação "Pedido de compra" já incluído no plugin, e marquei isso claramente no relatório — **não é o workflow real do utilizador**.

Entregue em `/private/var/folders/.../workflow-change-normal/`:
- `workflow.yaml` — linha de base assumida (v1)
- `workflow.v2-draft.yaml` — rascunho com `budget_reference` a passar de opcional a obrigatório e um novo campo obrigatório `expense_category`
- `validation.v1.json` / `validation.v2-draft.json` — saída real de `validate-workflow.mjs` (ambos válidos estruturalmente)
- `workflow-change-report.md` — comparação semântica, avaliação de impacto sobre pedidos em curso, plano de rascunho/publicação, 6 casos de teste e instruções de recuperação (sem rollback de um clique)
- `provia-project.json` — manifesto com `status: change_planned` e 4 decisões em aberto (D1–D4)
- `project.html`, `setup.md` — mapa e entrega gerados a partir do manifesto

Decisões pendentes que o dono do processo tem de confirmar antes de qualquer publicação: quantos pedidos estão em curso e em que acção (D1), se `budget_reference` deve mesmo tornar-se obrigatório retroactivamente (D2), se `expense_category` e as suas opções são mesmo o campo pretendido (D3), e como tratar casos abertos sem esses valores (D4).

Próximo passo recomendado: `provia-workflow-package`, para gerar/confirmar o pacote validado a partir do YAML real do cliente (substituindo este exemplo) e produzir o `setup.md` definitivo.

```text
Use provia-workflow-package com o provia-project.json e o workflow.v2-draft.yaml desta pasta, depois de substituir workflow.yaml pelo export real da versão activa do cliente. Valide o rascunho, corra o portão de revisão de acções e gere o setup.md final. País: Angola; responda em pt-AO.
```