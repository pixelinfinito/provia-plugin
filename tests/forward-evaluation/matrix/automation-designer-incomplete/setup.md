# Revisão mensal — trigger: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| revisao-mensal | Revisão mensal — arranque | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |

## Decisões em aberto

- **D1** Qual é o dia e a hora exactos pretendidos para a revisão mensal? Assumimos dia 1 de cada mês às 09:00 (Africa/Luanda) por não ter sido indicado (ex.: podia ser o último dia útil do mês, ou outro horário). (Dono: Dono do processo de revisão mensal)
- **D2** Quais são as acções da revisão mensal em si (o que é revisto, por quem, com que evidência de conclusão)? O pedido definiu apenas o disparo (trigger); o corpo do workflow está por desenhar. (Dono: Dono do processo de revisão mensal)
- **D3** A política de execução perdida (missedBehavior) foi assumida como catch-up-one (um único incidente de recuperação, sem acumular revisões atrasadas). Confirmar se "skip" (não recuperar) ou "catch-up-all" (um incidente por cada mês perdido) serve melhor a política da organização. (Dono: Dono do processo de revisão mensal)
- **D4** Qual o grupo ou pessoa responsável por executar/receber a revisão mensal, para que o workflow tenha um assignee e, se aplicável, uma notificação associada ao disparo? (Dono: Dono do processo de revisão mensal)

## Notas de configuração

- `revisao-mensal`: Trigger de agendamento (schedule) configurado: cronExpression "0 9 1 * *", timezone Africa/Luanda, missedBehavior catch-up-one. Confirmar em Provia, após importação, que o fuso Africa/Luanda é aceite e que o disparo em falta gera exactamente um incidente de recuperação, conforme documentado no comentário do YAML.
- `revisao-mensal`: Nenhuma acção foi definida — este ficheiro só especifica o disparo (trigger). As acções da revisão mensal em si (quem revê, o quê, com que evidência) ainda não foram desenhadas; ver decisão D2.
- `revisao-mensal`: Nenhum grupo responsável foi identificado para receber ou executar a revisão; ver decisão D3.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
