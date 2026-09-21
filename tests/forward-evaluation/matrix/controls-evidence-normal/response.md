A revisão não pôde ser feita: o directório de trabalho estava vazio. Não há procedimento de compras, não há registos, não há YAML nem manifesto anterior. O conector Provia existe no anfitrião, mas a chamada a `org_get_context` foi recusada por falta de permissão nesta sessão, por isso também não li o desenho actual da organização. Nenhuma lista de "evidências em falta" foi produzida, porque seria inventada.

Pressupostos com que avancei: Angola como contexto provisório, pt-AO, modo desligado, procedimento de compras tratado como política interna (nenhuma fonte legal consultada).

O que ficou no directório:

- `controls-evidence-report.md`: o relatório. Explica o que faltou, separa controlo desenhado de prova de operação, e traz a matriz requisito / acção / evidência já estruturada com os onze pontos de controlo habituais de compras (pedido formal, cabimento, cotações, selecção, alçada, segregação, ordem de compra, recepção, conferência de factura, excepções, retenção), cada um marcado como recomendação a confirmar e com a evidência que o Provia regista para o provar. Inclui a lista de campos que a exportação de casos precisa de trazer.
- `provia-project.json`: manifesto criado com as duas fontes referidas (procedimento e registos, ambas assinaladas como não fornecidas) e quatro decisões abertas com responsável: D1 procedimento em vigor (Responsável de Compras), D2 exportação de casos (Responsável de Compras), D3 jurisdição e fontes legais (Direcção Financeira), D4 YAML do workflow ou autorização do conector (Implementador Provia).
- `project.html` e `setup.md`: gerados pelo `build-project-map.mjs`. O `--check` passou com 0 avisos e 4 itens pendentes; esse check cobre o manifesto, não o relatório em Markdown.

Próximo passo recomendado: repetir `provia-controls-evidence` assim que o procedimento e a exportação de casos estiverem no directório. Nessa altura a matriz preenche-se e a comparação caso a caso torna-se possível. Se o desenho do workflow ainda não existir em Provia, o passo anterior é `provia-workflow-designer` a partir do procedimento.

```text
Use provia-controls-evidence com o provia-project.json desta pasta. Junto o procedimento de compras (versão e data de entrada em vigor) e a exportação de casos do período. Preencha a matriz do controls-evidence-report.md, indique por caso as evidências sem prova no registo e resolva as decisões D1 a D4. País: Angola; responda em pt-AO.
```