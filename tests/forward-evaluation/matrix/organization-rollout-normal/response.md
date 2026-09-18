Deliverables are ready in the working directory: `provia-project.json`, `project.html`, `setup.md`, `plano-adopcao.md`.

Resumo do que foi feito:

**Não recebi nenhum SOP, organograma ou export** — por isso `sources[]` está vazio e todos os grupos e decisões abaixo são propostas explicitamente marcadas para confirmação, não factos derivados de documentos.

**Grupos propostos** (`groups[]`, 8 no total): administração da organização Provia separada da propriedade do processo, separada da responsabilidade pelas acções — `administracao_ti`, `dono_processo_compras`, `compras`, `aprovacao_financeira`, `direccao_geral` para a fase 1; `dono_processo_rh`, `recursos_humanos`, `chefias` (partilhado com Compras) para a fase 2. Segregação de funções aplicada entre `compras`/`aprovacao_financeira` e sinalizada para `recursos_humanos` (auto-aprovação).

**7 decisões em aberto** (D1–D7): dono do processo de Compras, dono do processo de RH, limiar de aprovação, substituto da Direcção Geral, responsável pela administração TI, regra de auto-aprovação em RH, lista real de chefias.

**`--check` confirmou** a estrutura válida, mas todos os 8 grupos aparecem "sem acção atribuída" — esperado, porque nenhum workflow foi desenhado ainda; a cobertura real só se verifica depois disso.

O `plano-adopcao.md` detalha o faseamento (piloto Compras semanas 1–6, depois expansão a RH), exercícios de formação por papel, e medidas de adopção baseadas em trabalho concluído, não em contas criadas.

---

Próximo passo recomendado: `provia-workflow-designer`, para desenhar o workflow de Compras usando as chaves de grupo já definidas (`compras`, `aprovacao_financeira`, `direccao_geral`) — só depois disso o `--check` consegue confirmar que cada grupo tem pelo menos uma acção atribuída.

```text
Use provia-workflow-designer com o manifesto provia-project.json (grupos compras, aprovacao_financeira, direccao_geral já definidos). Desenhe o workflow de Pedido de compra para o piloto, com as decisões D1, D3 e D4 ainda em aberto. País: Angola; responda em pt-AO.
```