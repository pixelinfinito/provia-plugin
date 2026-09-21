Projecto preparado de fio a pavio, em modo desligado. Nada foi criado no Provia.

## Pressupostos declarados

- **Modo desligado.** O servidor Provia está listado no ambiente, mas a leitura do tenant (`org_get_context`) não foi autorizada nesta sessão; não li nem escrevi nada na organização. Sem recibos, `setup.md` é uma entrega de configuração manual.
- **Âmbito** = o único procedimento fornecido (v2, 2026-03-01); registado como decisão já tomada, sem passar por `process-discovery`.
- Nome da empresa, emails e nomes dos departamentos não constam das fontes; não inventei nenhum.

## Ficheiros entregues (directório actual)

| Ficheiro | Conteúdo |
| --- | --- |
| `provia-project.json` | Manifesto `provia-project/v1.1`: 2 fontes, 1 tipo de entidade (Viatura), 3 grupos, 1 workflow com 4 acções e secção `access`, 1 formulário de entrada, 7 decisões |
| `project.html` | Mapa offline do projecto (fluxo, acções, catálogo, grupos, acesso, decisões) |
| `catalogue.json` / `catalogue.html` | Catálogo editorial do tipo Viatura (derivado do manifesto) |
| `pedido_viatura/workflow.yaml` | YAML `provia.ao/v1`, prefixo `VIAT`, 10 campos, 2 decisões + 2 acções Standard com briefs de cinco partes, `access: organization → create_incident` |
| `pedido_viatura/validation.json` | Saída exacta do validador |
| `pedido_viatura/review-actions.json` | Saída exacta da porta editorial |
| `pedido_viatura/editorial-review.md` | Revisão semântica dos nomes e descrições |
| `pedido_viatura/design.md` | Classificação dos passos da fonte, tabela de acções, fluxo Mermaid, campos, acesso, grupos, formulário |
| `pedido_viatura/setup.md` | Entrega de configuração gerada pelo manifesto |

## Desenho em resumo

`Iniciar pedido` (qualquer colaborador: data, destino, motivo, chefia) → **Confirmar a disponibilidade** (Secretariado; sem viatura → cancela com comentário) → **Decidir sobre o pedido** (chefia do colaborador, 1 dia útil; Recusar → cancela com comentário) → **Entregar a viatura e registar a quilometragem de saída** (Secretariado) → **Registar a devolução da viatura** (Secretariado: km de entrada, danos, fotografias).

«A chefia do colaborador» ficou como `field:chefia_colaborador` com substituto `chefias` — o produto não atribui a partir de um campo, por isso a descrição pede à chefia errada que reatribua, e `setup.md` lista-o como responsável definido por caso.

## O que foi verificado

- `validate-workflow.mjs`: `valid: true`, 0 erros, 0 avisos; 4 itens `assignment_missing` (os `assignee` foram omitidos por não haver identificadores do tenant).
- `review-actions.mjs`: 4/4 acções com as cinco partes, 0 fugas de notas de implementação.
- `build-project-map.mjs --check`: 0 erros, 0 bloqueios de prontidão, 0 actores/entidades por resolver; 1 aviso esperado (`direccao_geral` não é responsável por nenhuma acção — a v2 não lhe atribui passos) e 2 informações (Secretariado e Chefias sem grant `view`, vêem os casos por atribuição).
- `build-entity-catalogue.mjs --check`: 1 tipo verificado.
- A secção `access` do YAML coincide com a que `emit-workflow-access.mjs` gera do manifesto.

**Não verificado:** pré-visualização de importação no destino, existência do tipo Viatura/grupos no tenant, publicação. Validade estrutural não é correcção do negócio.

## Decisões em aberto para a revisão com o cliente

- **D1** Prazos do Secretariado para verificar disponibilidade e registar a devolução (a fonte só fixa o da chefia) — `due` ficou vazio.
- **D2** Sem viatura disponível: cancelar (proposto) ou propor outra data?
- **D3** Dono do processo / grant `edit` (proposta: Direcção-Geral) — nenhum `edit` atribuído até lá.
- **D4** Quem decide quando o requerente é uma chefia e nas ausências (proposta: Direcção-Geral no campo «Chefia do colaborador»).
- **D5** O mapa de viaturas migra para o tipo Viatura no Provia ou fica na ferramenta actual?
- **D6** Seguimento dos danos registados — fora do âmbito da v2.
- **D7** Recomendação: resultado «Devolver para correcção» na decisão da chefia.

Passo seguinte recomendado: `provia-workflow-review`, para a revisão de prontidão com o dono do processo antes de criar os grupos e importar o rascunho — as sete decisões acima condicionam os prazos, o acesso e um eventual caminho de devolução.

```text
Use provia-workflow-review com provia-project.json e pedido_viatura/workflow.yaml. Reveja o workflow Pedido de viatura quanto a responsáveis, sequência, evidências, excepções e prontidão para publicação, tendo em conta as decisões D1–D7 em aberto. Não altere o desenho sem registar a alteração no manifesto. País: Angola; responda em pt-AO.
```