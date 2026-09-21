## Piloto recomendado: **Pedido de compra** — com condições

Com apenas a frase inicial (Luanda; compras, admissão e pedidos de TI por e-mail), a comparação é provisória. Não inventei volumes, responsáveis nem poupanças; cada lacuna está registada como decisão com dono.

**Lista ordenada**

1. **Compras** — maior impacto (dinheiro, fornecedores, prova de quem aprovou), evidência que hoje se perde nas caixas de correio, e o padrão de decisão que depois se reutiliza nos outros dois processos. Esforço médio.
2. **Pedidos de TI** — mais rápido e provavelmente com mais volume; é a alternativa se compras ficar sem responsável nomeado ou tiver menos de ~10 casos/mês. Ensina menos sobre aprovações, e parte dele (acessos, equipamento) reaparece dentro da admissão.
3. **Admissão de trabalhadores** — segunda vaga: poucos casos para aprender em 4–6 semanas, três equipas a coordenar, e dados pessoais que exigem verificação de protecção de dados antes de desenhar.

**Âmbito mínimo do piloto:** pedido → proposta anexa → decisão (aprovar / rejeitar / devolver) → confirmação ao fornecedor → informar requerente, para um ou dois departamentos. Fora: pagamento, stock, contratos. Revisão após 10 casos concluídos ou 4 semanas. Linha de base a **observar** nos últimos 20 pedidos por e-mail (dias até decisão, propostas anexadas, seguimentos) antes de fixar metas.

**Decisões em aberto:** D1 responsável do piloto (sem nome, não há piloto); D2 volumes dos 3 processos; D3 procedimento e regras de aprovação de compras; D4 departamentos; D5 linha de base; D6 responsável de TI / helpdesk existente; D7 admissão e APD; D8 nome, sector e tenant Provia.

**Ficheiros escritos no directório de trabalho**
- `discovery-report.md` — inventário, comparação, lista ordenada, âmbito, medidas e decisões
- `provia-project.json` — manifesto novo (título do piloto, fonte `pedido-inicial` com âncoras por candidato, D1–D8)
- `project.html` e `setup.md` — gerados pelo script do plugin

**Verificado:** `build-project-map.mjs --check` passou (0 avisos, 8 itens pendentes = as decisões). Isto valida a forma do manifesto, não o relatório nem a escolha de negócio. **Pendente:** o servidor Provia estava listado, mas a leitura do contexto da organização não foi autorizada nesta sessão — trabalhei em modo desligado; nada foi lido ou alterado no Provia.

Próximo passo recomendado: responder a D1–D3 e depois `provia-workflow-designer`, para transformar o âmbito acordado em acções com responsáveis. Se D1 ficar sem resposta, repita o mesmo pedido com pedidos de TI.

```text
Use provia-workflow-designer com provia-project.json e discovery-report.md nesta pasta. Desenhe o workflow «Pedido de compra» no âmbito da secção 5 do relatório (pedido, proposta, decisão, confirmação ao fornecedor, informar requerente). Responsável do piloto: [nome de D1]. Regras de aprovação: [resposta a D3 ou «não há procedimento escrito; prática actual é …»]. País: Angola; responda em pt-AO.
```