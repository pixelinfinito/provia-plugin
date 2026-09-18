# Revisão editorial — Pedido de compra — exemplo

Gerado por `scripts/review-actions.mjs workflow.yaml`; saída completa em `review-actions.json`.

## Resultado

4 acções aplicáveis, 4 completas, 0 incompletas, 0 fugas de notas de implementação, 0 prazos em falta.

| Acção | Tipo | Tarefa | Como | Evidência | Concluído quando | Excepções | Prazo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| registar | standard | ✓ | ✓ | ✓ | ✓ | ✓ | definido |
| decidir | decision | ✓ | ✓ | ✓ | ✓ | ✓ | definido |
| confirmar_cabimento | standard | ✓ | ✓ | ✓ | ✓ | ✓ | definido |
| encomendar | standard | ✓ | ✓ | ✓ | ✓ | ✓ | definido |

Nenhuma acção precisou de correcção. O verificador confirma a presença das cinco partes (Tarefa, Como, Evidência, Concluído quando, Excepções), ausência de fugas de notas de implementação, comprimento e prazo — não certifica qualidade de redacção nem correcção de negócio (ver `references/action-writing.md`).

## Não coberto por este relatório

- Correcção do processo de negócio (limites de aprovação, segregação de funções) — ver decisões D1 e D2 em `provia-project.json` e `setup.md`.
- Pré-visualização de importação no Provia e revisão de publicação pelo dono do processo.
