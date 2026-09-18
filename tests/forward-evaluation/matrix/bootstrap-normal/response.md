Tudo gerado, validado e consistente. Resumo do trabalho, em pt-AO:

## Projecto Provia "Pedido de viatura" — entregue

**Ficheiros em `bootstrap-normal/`:**
- `provia-project.json` — manifesto do projecto (fontes, grupos, tipo de entidade, workflow, 6 decisões em aberto)
- `workflow.yaml` — YAML do workflow `viaturas` (prefixo `VIAT`), 4 acções
- `validation.json` — resultado do validador estrutural: **válido**, sem erros
- `editorial-review.md` — revisão editorial das acções (nomes, descrições em cinco partes, atribuições)
- `catalogue.json` / `catalogue.html` — catálogo autónomo do tipo de entidade `Viatura`
- `project.html` — mapa navegável do projecto completo
- `setup.md` — entrega de configuração (o que falta fazer no Provia)

**Desenho:** os 5 passos do procedimento mapeiam para 4 acções — `registar_pedido` (dobra o passo 1 do colaborador), `decidir_pedido` (Decisão, com o prazo de 1 dia útil do procedimento), `entregar_viatura` e `devolver_viatura` (dobra o acto físico do passo 5). Grupos criados: `secretariado` (2), `chefias` (5, um grupo agregado), `direccao_geral` (1, sem acção neste processo — sinalizado).

**6 decisões em aberto** (não resolvidas por mim, por não estarem na fonte): encaminhamento à chefia certa do departamento (D1), papel da Direcção-Geral (D2), prazos não definidos para 3 das 4 acções (D3), comportamento em caso de incumprimento do prazo de decisão (D4), segregação de funções se a chefia for a própria requerente (D5), e confirmação da designação/sector da empresa (D6).

O validador reporta `valid: true` e `readyToPublish: false` — a validação de destino (grupos, tipo de entidade) e a publicação ficam pendentes no Provia, listadas em `setup.md`.

---

Próximo passo recomendado: `provia-organization-rollout`, para fechar o encaminhamento por departamento (D1) e o plano de adopção junto do Secretariado e das chefias, já que é a maior lacuna de desenho identificada.

```text
Use provia-organization-rollout com o manifesto provia-project.json (workflow «viaturas»). Resolva a decisão D1 sobre o encaminhamento à chefia correcta do departamento do colaborador (sub-grupos por departamento ou outro mecanismo) e proponha o plano de adopção e formação para o Secretariado e as chefias. País: Angola; responda em pt-AO.
```