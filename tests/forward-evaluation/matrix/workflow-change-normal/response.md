Plano concluído e registado no manifesto. Resumo do que foi feito e do que fica em aberto.

## Ponto de partida

O directório estava vazio: sem export do workflow, sem lista dos campos a alterar, sem exportação dos casos abertos. O servidor Provia está listado, mas a chamada a `org_get_context` foi recusada nesta sessão, por isso trabalhei em modo desligado e a leitura do tenant fica pendente. Para não parar, construí uma **baseline assumida** (pedido de compra, 4 acções) e uma alteração assumida que cobre de propósito os três padrões com impactos diferentes nos casos abertos: campo novo obrigatório, opcional→obrigatório, obrigatório→opcional. Tudo está marcado como suposição (S1–S3) e é D1 que o responsável confirme os campos reais.

## Conclusões do plano (`plano-de-alteracao.md`)

- **Mecanismo:** os casos abertos mantêm as acções instanciadas da v1, mas a validação de metadados pode consultar a definição em vigor ao gravar. Um caso v1 devolvido ao passo de registo depois da publicação é o cenário de maior exposição. O plugin não consegue observar este comportamento; o caso de teste T7 existe para o medir antes de publicar (D3).
- **Impacto por padrão:** relaxar (`delivery_date`) não tem risco; tornar obrigatório ou acrescentar obrigatório afecta casos v1 com valor vazio — a proporção só se sabe com a exportação dos casos (§2.3, **pendente**).
- **Como fazer a versão:** nova versão a partir da activa (`workflow_create_draft_version` ou «Nova versão»), nunca `workflow_import_draft` com o YAML — isso cria uma nova linhagem sem histórico, sem permissões e com contador `auto_number` novo. Formulário de abertura, se existir, publica-se à parte (D5).
- **Recuperação:** não há rollback de um clique; a reposição é uma v3 que reaplica os `required` da v1, com os casos v2 tratados separadamente.
- 12 casos de teste (caminhos alterados e inalterados) e 9 passos de rascunho→publicação com evidência a guardar.

## Ficheiros no directório

`plano-de-alteracao.md`, `workflow.current.yaml` (baseline assumida), `workflow.yaml` (v2 proposta), `validation.json` / `validation.current.json` (ambos `valid: true`, validação de destino não corrida), `review-actions.json` (4/4 acções completas, 0 fugas), `provia-project.json` (`status: change_planned`, fonte `cr-campos-obrigatorios`, `changeNote` por acção, D1–D6), `setup.md`, `project.html`. O `--check` do manifesto deu 0 erros, 0 avisos, 3 infos.

## Verificado vs pendente

Verificado: estrutura dos dois YAML, gate das cinco partes, consistência do manifesto. Pendente: export real da versão activa, exportação e classificação dos casos abertos, comportamento observado num caso v1, formulários e consumidores dos campos. Nada foi criado nem publicado no Provia.

Próximo passo recomendado: `provia-operations-triage`, para classificar os casos em curso por passo e exposição assim que a exportação existir — é o que desbloqueia a aprovação do plano. Se preferir primeiro confirmar a baseline, repita este skill com o export real da versão activa.

```text
Use provia-operations-triage com provia-project.json e plano-de-alteracao.md deste directório. Analise a exportação anexa dos pedidos de compra em curso (id, acção actual, responsável, data de criação, estimated_amount, cost_center, delivery_date) e classifique cada caso segundo a tabela da secção 2.3 do plano: exposição alta/média/baixa e quem deve agir antes da publicação da v2. País: Angola; responda em pt-AO.
```