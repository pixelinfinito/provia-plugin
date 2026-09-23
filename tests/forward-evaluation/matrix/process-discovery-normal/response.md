Trabalho concluído. Ficheiros escritos em `process-discovery-normal/`: `selecao-piloto.md`, `provia-project.json`, `project.html`, `setup.md`.

## Recomendação: comece pelos **Pedidos de TI**

**Ordenação:** 1.º Pedidos de TI · 2.º Compras · 3.º Admissão de trabalhadores.

Porquê TI:

- **Volume.** Um piloto aprende-se com repetição. É o único dos três onde é plausível fechar dezenas de casos em semanas; a admissão fecharia dois ou três.
- **Uma só equipa decide.** Não é preciso alinhar chefias e finanças antes de desenhar o primeiro workflow.
- **Errar é barato.** Se o desenho estiver errado, volta-se ao correio electrónico. Um erro em compras trava um pagamento; na admissão afecta a entrada de uma pessoa.
- **Não há política em falta.** Compras não se desenha sem os limites de aprovação em Kz e sem saber quem aprova em cada nível — e esses valores não podem ser assumidos.

**O que se perde:** Compras é onde está o retorno financeiro e onde a falta de rasto de aprovações mais custa numa auditoria. A troca é deliberada — a equipa aprende o Provia num processo barato de errar e leva isso para compras já com a política escrita.

**Quando a escolha muda (D9):** se a Administração exigir que o piloto demonstre controlo financeiro, ou se os pedidos de TI forem menos de cerca de cinco por semana, o piloto passa a Compras.

## O que tem de ficar claro

Nada nesta comparação é uma medição. Não foram fornecidos procedimentos, volumes, responsáveis nem exportações, por isso a tabela de comparação são indicações de padrão, não dados. A primeira tarefa do piloto é criar a base: uma amostra das mensagens de correio das últimas semanas, para apurar quantos pedidos entram e quanto demoram hoje (D5). Não fixei metas numéricas de redução de tempo — fixá-las antes de existir base seria inventá-las.

**O piloto ainda não está pronto para arrancar:** falta o nome do Responsável de TI que o assume (D1). D2 (categorias) e D3 (prazos) são igualmente necessárias antes do desenho; as restantes seis decisões podem correr em paralelo.

Pressupostos que assumi para avançar: Angola como jurisdição (a empresa está em Luanda), os três processos como trabalho repetido, e existência de um responsável por cada área ainda que sem nome.

## Verificação

`node scripts/build-project-map.mjs provia-project.json --check` correu sobre o manifesto sem erros nem avisos: 9 itens pendentes, que são exactamente as decisões em aberto. O `--check` cobre o manifesto, não o relatório em Markdown. O conector `Provia` aparece listado nesta sessão mas a autorização não foi concedida, portanto `org_get_context` não correu — nenhum grupo, workflow ou utilizador real foi lido, e nada foi criado, importado ou publicado. Para o usar, autorize o conector nas definições da claude.ai e volte a pedir.

---

Próximo passo recomendado: `provia-workflow-designer`, para converter o âmbito acordado em acções, responsáveis e caminhos de excepção. Faz sentido assim que D1, D2 e D3 tiverem resposta; se a Administração ainda estiver a decidir entre TI e Compras (D9), resolva D9 primeiro.

```text
Use provia-workflow-designer com o provia-project.json e o selecao-piloto.md desta pasta. Desenhe o workflow «Pedido de TI» dentro das fronteiras definidas: abertura, triagem com classificação, execução, confirmação do requerente, e recusa ou encaminhamento com motivo. Respeite as decisões D2, D3, D4 e D6 como questões em aberto — não as assuma resolvidas. Responsável do piloto ainda por nomear (D1). País: Angola; responda em pt-AO.
```