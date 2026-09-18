Todos os artefactos foram gerados e validados no directório de trabalho.

## Resumo

Analisei os três processos candidatos (Compras, Admissão de trabalhadores, Pedidos de TI) por âmbito, número de áreas envolvidas, complexidade de desenho e capacidade de gerar casos reais num piloto curto — sem inventar volumes, já que nenhum foi fornecido.

**Piloto recomendado: Pedidos de TI** — dono único (equipa de TI), fluxo linear (pedido → triagem → execução → confirmação), cadência tipicamente alta o suficiente para aprender rapidamente, e risco contido face a Compras (exposição financeira) e Admissão (coordenação entre RH/TI/gestor). Compras fica como segundo piloto natural; Admissão fica adiada até haver clareza sobre volume de contratação.

Ficheiros produzidos:
- `provia-project.json` — manifesto (`provia-project/v1`), validado com `--check` (5 decisões em aberto, 0 avisos)
- `piloto-recomendacao.md` — comparação completa, justificação e questões em aberto
- `project.html` — mapa do projecto
- `setup.md` — handover das pendências

Cinco questões ficaram registadas como decisões em aberto (D1–D5), principalmente sobre volumes reais e o responsável nomeado — nenhuma foi inventada.

**Próximo passo recomendado:** `provia-workflow-designer`, para transformar o âmbito acordado de Pedidos de TI num desenho de workflow (acções, responsáveis, evidência), assim que o volume e o dono nomeado (D1, D2) forem confirmados.

```text
Use provia-workflow-designer com o piloto "Pedidos de TI" definido em provia-project.json (chave "piloto-provia"). Âmbito: pedidos de equipamento, acessos e suporte técnico simples, fluxo pedido → triagem/atribuição → execução → confirmação do requerente; excluir projectos de TI de âmbito alargado. Leia sources[] "conv-pedidos-ti" e as decisões D1/D2 ainda em aberto. País: Angola; responda em pt-AO.
```