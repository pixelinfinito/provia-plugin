Diagnóstico concluído. Resumo:

**Lista de atenção (hoje, 2026-09-18 09:00 Africa/Luanda):**
- **COMP-201** — crítico: 8 dias úteis em «Decidir sobre o pedido», 6 dias úteis além do prazo de 2 dias, **sem responsável atribuído**.
- **COMP-207** — 1 dia útil de atraso em «Registar a encomenda», dono conhecido (Compras).
- **COMP-204** — apenas 1 dia na acção; sem prazo informado, não classificável como atrasado.

**Desempenho Junho → Agosto 2026:** ciclo médio subiu 6,5 → 9,8 dias úteis (+3,3 dias); o tempo em «Decidir sobre o pedido» subiu 3,1 → 6,4 dias (também +3,3 dias) — esta acção explica aritmeticamente todo o alongamento do ciclo. As devoluções mais que duplicaram (16,7% → 36,8%), e o volume cresceu 58% (12 → 19 casos), ambos como confundidores a confirmar, não causas provadas.

**Mudança proposta:** atribuir um grupo fixo como responsável por «Decidir sobre o pedido» com escalonamento automático a 1 dia do prazo de 2 dias — medida directamente ligada ao caso COMP-201, que exemplifica hoje o mesmo padrão. Medição: tempo médio na acção e % dentro do prazo no próximo mês.

Ficheiros gerados em `diagnose-normal/`: `diagnostico-compras.md` (relatório completo), `provia-project.json` (4 decisões em aberto), `project.html`, `setup.md`.

**Próximo passo recomendado:** `provia-workflow-change`, para desenhar formalmente a atribuição de responsável fixo e o escalonamento em «Decidir sobre o pedido» — já há um caso aberto (COMP-201) nessa mesma acção, pelo que o impacto em incidentes activos precisa de ser avaliado antes de publicar a alteração.

```text
Use provia-workflow-change com o manifesto provia-project.json (decisões D1 e D4) e o diagnostico-compras.md acima. Planeie a atribuição de um grupo responsável fixo e um alerta de escalonamento na acção «Decidir sobre o pedido» do workflow de Compras, considerando o caso aberto COMP-201 nessa acção. País: Angola; responda em pt-AO.
```