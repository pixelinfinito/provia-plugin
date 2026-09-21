Desenho concluído. Ficheiros escritos no directório de trabalho:

- `workflow-design.md`: classificação dos passos, tabela de acções, fluxo Mermaid, notas de acesso e as decisões abertas.
- `workflow.yaml`: esqueleto `provia.ao/v1` com as descrições completas em cinco partes e a secção `access`.
- `provia-project.json`: manifesto novo (não existia) com fonte, grupos propostos, workflow, acesso, gatilho e decisões D1–D10.
- `project.html`: mapa do projecto gerado a partir do manifesto.

## O que a fonte dá e o que o desenho acrescenta

A única fonte é a sua frase. Não recebi o procedimento escrito, por isso tudo o que vai além de «a chefia aprova, as Finanças confirmam o cabimento» está marcado como pressuposto ou recomendação, com decisão aberta. País assumido: Angola (pt-AO, Kz), por falta de indicação.

Três acções, em sequência:

| localId | Nome | Tipo | Responsável | Ramos |
| --- | --- | --- | --- | --- |
| `registar_pedido` | Registar o pedido de compra | Standard | requerente (`creator`) | — |
| `decidir_chefia` | Decidir sobre o pedido de compra | Decision | grupo `chefias` | Aprovar → continua; Devolver → volta a `registar_pedido` (comentário); Rejeitar → cancela (comentário) |
| `confirmar_cabimento` | Confirmar a disponibilidade orçamental | Decision | grupo `financas` | Cabimento confirmado → continua; Sem cabimento → volta a `registar_pedido` (comentário) |

Modelei a confirmação das Finanças como Decisão, e não como acção Standard, porque «não há cabimento» precisa de um destino. Os ramos de devolução e rejeição não estão na fonte; são a minha proposta para o caso não ficar sem saída (D3). Nenhum prazo foi definido e nenhum limite de montante foi codificado, porque a fonte não os indica.

Acesso: `organization` abre pedidos (pressuposto, D6); Chefias e Finanças não recebem `view`, vêem os casos que lhes chegam pelas acções. O dono do procedimento (`edit`, `ownerArea`) fica por nomear (D8).

## Verificações

- `node scripts/build-project-map.mjs provia-project.json --check`: 0 erros, 0 avisos, 2 informações (regra 4, comportamento pretendido); 0 bloqueios de prontidão; 21 itens pendentes (membros dos grupos, atribuições, decisões).
- `emit-workflow-access.mjs` gerou a secção `access` do YAML a partir do manifesto.
- Não corrido: `validate-workflow.mjs` e `review-actions.mjs` (pertencem ao package). O YAML é um esqueleto, não está validado.
- Modo desligado: a leitura do tenant Provia (`org_get_context`) não foi autorizada nesta sessão; nada foi lido nem criado em Provia.

## Decisões a responder antes de empacotar

As dez estão em `provia-project.json` e no relatório. As que mais mudam o desenho: D1 (a ordem chefia → Finanças é mesmo sequencial?), D2 (quem é «a chefia» e como se escolhe a certa em cada pedido), D5 (o que acontece depois do cabimento confirmado, quem executa a compra) e D8 (onde está o procedimento escrito, para refazer a classificação sobre o documento real).

Próximo passo recomendado: `provia-organization-rollout`, para completar os grupos `chefias` e `financas` (membros, nível hierárquico, substitutos, segregação quando o requerente é chefia) antes de gerar o YAML final. Se o procedimento escrito existir, entregue-o primeiro e repita o `provia-workflow-designer` sobre ele.

```text
Use provia-organization-rollout com o provia-project.json deste directório. Complete os grupos chefias e financas (membros, nível hierárquico da chefia que aprova, substitutos em ausência) e responda às decisões D2, D6, D7 e D8 sobre segregação e dono do procedimento. Preserve as acções e o acesso já desenhados. País: Angola; responda em pt-AO.
```