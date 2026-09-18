Não encontrei nenhum ficheiro no directório de trabalho — não há `workflow.yaml`, `provia-project.json`, nem qualquer SOP ou export do workflow. Sem esse conteúdo não há nada para revisar: não posso inventar etapas, responsáveis ou caminhos de rejeição para depois os "encontrar em falta", isso violaria as regras de honestidade do plugin (nunca inventar factos nem simular verificações que não foram feitas).

**Estado:**
- Ficheiros encontrados: nenhum.
- Verificação executada: nenhuma (não há `workflow.yaml` para correr `node scripts/review-actions.mjs`).
- Decisão em aberto: preciso do desenho do workflow (YAML exportado, ou a descrição/procedimento de origem) para poder mapear outcomes → acções, verificar responsáveis por chave de grupo, dependências, ramos de decisão e caminhos de rejeição/retrabalho.

**Próximo passo recomendado:** coloque o `workflow.yaml` (ou o `provia-project.json` do projecto, se já existir) neste directório de trabalho, e eu retomo a revisão de imediato. Se ainda não existe um workflow desenhado, o passo anterior é `provia-workflow-designer`.

Pedido copiável, assim que tiver o ficheiro:

```text
Use provia-workflow-review com o workflow.yaml (e provia-project.json, se existir) agora presentes no directório de trabalho. Procure etapas sem responsável e caminhos de rejeição em falta antes da publicação. País: Angola; responda em pt-AO.
```