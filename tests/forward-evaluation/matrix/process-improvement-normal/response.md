## Resumo

Não havia nenhum relatório, exportação ou `provia-project.json` na pasta de trabalho — apenas o texto do pedido. Assumi isso e continuei sem perguntar, produzindo um enquadramento reutilizável em vez de números fingidos:

- **`diagnostico-compras.md`** — o que falta confirmar antes de comparar dois períodos (janelas, fuso horário, duplicados, versão do workflow, volume/complexidade como confundidores); fórmulas de tempo de ciclo, tempo activo e tempo de espera; hipóteses de onde se perde tempo (fila na aprovação, cotações de fornecedores em série, retrabalho por informação em falta, emissão manual da PO) — marcadas como hipóteses, não factos; e uma melhoria proposta (recolha de propostas em paralelo via formulário, com prazo de 2 dias úteis e escalonamento) com dono, mecanismo esperado e plano de medição antes/depois.
- **`provia-project.json`** — manifesto novo, validado com `build-project-map.mjs --check` (0 erros), com 3 decisões em aberto: quais registos reais suportam a afirmação, quem é o dono do processo, e se os dois períodos são de facto comparáveis.
- **`project.html`** e **`setup.md`** — mapa offline e handover gerados a partir do manifesto.

Nenhum cálculo de duração é apresentado como resultado real — isso exige os registos que ainda faltam.

**Próximo passo recomendado**: `provia-diagnose`, assim que existirem exportações reais com timestamps por caso e por acção do processo de compras — combina a triagem de incidentes com a investigação de desempenho no mesmo passo.

```text
Use provia-diagnose com a exportação real de casos de "Pedido de compra" (timestamps por caso e por acção, os dois períodos a comparar) e o provia-project.json em anexo. Aplique as fórmulas de tempo de ciclo/activo/espera definidas em diagnostico-compras.md e resolva as decisões D1–D3. País: Angola (a confirmar); responda em pt-AO.
```