Diagnóstico concluído. Ficheiros no directório de trabalho: `diagnostico-compras.md` (relatório), `provia-project.json` (manifesto novo, com D1–D6), `project.html` e `setup.md` (gerados do manifesto).

**Nota de modo:** o servidor MCP do Provia está listado mas a chamada `org_get_context` não foi autorizada, por isso trabalhei em modo desligado — nada foi lido nem alterado na organização; o relatório usa só os dados fornecidos.

## O que os dados confirmam

- **Todo o aumento do ciclo está numa acção.** Ciclo médio +3,3 dias úteis (6,5 → 9,8); «Decidir sobre o pedido» +3,3 dias (3,1 → 6,4). O resto do processo demorou 3,4 dias nos dois meses.
- Volume +58 % (12 → 19) e devoluções ×2,2 (16,7 % → 36,8 %) — confundidores tratados como hipóteses, não como causas.
- **COMP-201** está em «Decidir» há 8 dias úteis, prazo 2, **sem responsável**: 6 dias úteis além do prazo e ninguém designado para agir. É o mecanismo do problema de Agosto a acontecer hoje.
- **COMP-207** (Compras, Registar a encomenda) está 1 dia além do prazo e tem dono — acompanhamento operacional, não mudança de desenho.
- **COMP-204** não é classificável: o instantâneo não traz prazo nem responsável dessa acção.

## Uma mudança mensurável

Definir um **responsável por omissão (grupo) e substituto** para «Decidir sobre o pedido», mantendo o prazo de 2 dias úteis. Dono: o dono do processo de compras — **ainda a nomear (D1)**. Medida em Outubro 2026: média em «Decidir» ≤ 3,1 dias úteis; 0 % de casos com a acção sem responsável à activação; devoluções acompanhadas sem meta para separar as hipóteses.

## Pressupostos e limites

Assumi dias úteis em «Decidir», mesma versão do workflow nos dois meses, «devolvido» = regresso a uma acção anterior, e a sequência Confirmar orçamento → Decidir → Registar. Tudo isto está registado como decisões abertas (D3–D6). Os agregados sem linhas por caso não permitem distinguir se os 6,4 dias vêm de todos os casos ou de dois casos longos — a exportação por caso de Junho a Setembro é o próximo dado a pedir. O `--check` do manifesto correu sem erros; os dois avisos (acções sem dono) são as constatações do diagnóstico.

Próximo passo recomendado: `provia-workflow-change`, porque a mudança altera um workflow publicado com casos em curso e precisa de plano de versão e de impacto nos casos abertos. Condição: antes disso, o cliente tem de nomear o dono (D1) e exportar o YAML do workflow publicado.

```text
Use provia-workflow-change com provia-project.json e diagnostico-compras.md neste directório. Planeie a nova versão do workflow «Pedido de compra» que atribui responsável por omissão e substituto à acção «decidir» (D2), avaliando o impacto nos casos abertos COMP-201, COMP-204 e COMP-207. Dependências por resolver: D1 (dono do processo) e D6 (acesso real do workflow); YAML do workflow publicado em anexo. País: Angola; responda em pt-AO.
```