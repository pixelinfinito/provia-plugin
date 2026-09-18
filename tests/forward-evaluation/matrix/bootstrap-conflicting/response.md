**Projecto Provia preparado a partir dos dois documentos.** Ficheiros criados em `bootstrap-conflicting/`:

- `provia-project.json` — manifesto do projecto (fontes, grupos, workflow, decisões)
- `compras/workflow.yaml` — desenho executável (accionador manual + uma decisão)
- `compras/validation.json` — saída real de `validate-workflow.mjs` (`valid: true`, `readyToPublish: false`)
- `compras/editorial-review.md` — saída real de `review-actions.mjs` + revisão semântica
- `project.html` — mapa navegável do projecto
- `setup.md` — entrega de configuração gerada do manifesto

**Ponto central: o Documento A e o Documento B contradizem-se** sobre quem aprova o pedido (chefia do departamento vs. director financeiro). Seguindo a regra do próprio processo de bootstrap — manter ambas as fontes e não escolher entre elas —, propus os dois grupos (`chefias`, `director_financeiro`), citando cada um à sua fonte, e deixei o responsável da acção `decidir` por atribuir (`assigneeRef: null`), registado como decisão aberta **D1** com dono "Direcção / dono do processo de compras". Isto aparece correctamente como aviso (não erro) no `--check` e no `setup.md`.

Outras decisões em aberto que registei por falta de dados nas fontes: **D2** (a que ano se refere "a partir de Janeiro" na circular), **D3** (se a circular exclui totalmente a chefia ou mantém algum papel), **D4** (nenhuma etapa antes ou depois da aprovação está descrita — registo do pedido, cabimento, encomenda), **D5** (nome/sector da organização não fornecidos) e **D6** (substituto do director financeiro nas ausências). Por isso mantive o workflow deliberadamente mínimo — uma única decisão — em vez de inventar etapas de processo não descritas.

Próximo passo recomendado: `provia-organization-rollout`, para levar a D1 à direcção e fechar quem aprova antes de definir formulários ou dados de compra.

```text
Use provia-organization-rollout com provia-project.json deste projecto (chave "compras"). Resolva a decisão D1 — chefia do departamento vs. director financeiro como aprovador — junto do dono do processo, e complete os grupos "chefias" e "director_financeiro". País: Angola; responda em pt-AO.
```