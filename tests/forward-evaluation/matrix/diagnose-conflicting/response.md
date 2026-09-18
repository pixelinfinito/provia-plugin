Tudo gerado e validado (`node build-project-map.mjs --check` passou sem avisos). Resumo do diagnóstico:

**O que foi encontrado, antes de qualquer número de desempenho:**
- **COMP-88** está em «Aguardar auditoria», atribuído ao grupo «Auditoria» — que não existe no desenho publicado (só Compras e Finanças têm acções atribuídas). Isto é uma incompatibilidade entre a exportação e o desenho, não um simples atraso: o caso fica sem dono reconhecido pelo sistema até se esclarecer se «Auditoria» é um passo real por modelar (via `provia-workflow-change`) ou um erro de atribuição.
- **COMP-90** aparece concluído em 2026-09-08, dois dias antes de criado (2026-09-10) — impossível cronologicamente, tratado como defeito de dados e excluído de qualquer cálculo de duração.

Com apenas estes dois casos conflituosos, não há base para calcular tempo de ciclo ou comparar desempenho — isso ficou registado como não possível ainda, com a especificação exacta da exportação necessária para o fazer. A mudança proposta foi, por isso, uma validação de integridade na origem dos dados (grupo fora do desenho / data de conclusão anterior à criação), não uma alteração de prazos.

Artefactos em `diagnose-conflicting/`: `provia-project.json`, `project.html`, `setup.md`, `diagnostico-compras.md`.

**Próximo passo sugerido:** como o esclarecimento de D1 (grupo «Auditoria») pode revelar uma lacuna real de desenho, o passo mais útil a seguir é `provia-workflow-change`, para avaliar o impacto de acrescentar esse grupo/acção ao workflow publicado, considerando o COMP-88 como caso já activo nessa situação.

```text
Use provia-workflow-change com o provia-project.json anexo. Avalie o impacto de acrescentar o grupo/acção «Auditoria» ao workflow «compras», considerando o caso COMP-88 já activo em «Aguardar auditoria». País: Angola; responda em pt-AO.
```