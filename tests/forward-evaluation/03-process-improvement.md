# Comparação de Agosto e Setembro

Os dados mostram mais pedidos concluídos e maior duração média em Setembro. Não permitem provar que o novo gestor piorou o processo: o volume e a complexidade também mudaram, e não há dados individuais ou comparação ajustada.

## Cálculos reproduzíveis

Fonte: agregados fornecidos pelo utilizador. Assume-se, só para calcular, que «dias» tem a mesma definição nos dois períodos e que as médias são exactas.

| Indicador | Agosto | Setembro | Diferença |
|---|---:|---:|---:|
| Pedidos concluídos | 10 | 30 | +20; (30−10)/10 = +200% |
| Duração média | 2 dias | 4 dias | +2 dias; (4−2)/2 = +100% |
| Soma implícita das durações | 10×2 = 20 dias-pedido | 30×4 = 120 dias-pedido | +100 dias-pedido |

Média combinada, se comparáveis: (10×2 + 30×4)/(10+30) = 3,5 dias em 40 pedidos. Dias-pedido são soma de durações dos casos, não dias de esforço da equipa. Concluídos não medem entradas nem toda a carga pendente. Não é possível decompor a duração em trabalho activo e espera.

## Limitações que afectam a conclusão

Setembro inclui casos mais complexos, segundo o utilizador. Não há classificação de complexidade, versões de workflow, timestamps, equipas, data de mudança de gestor, regras de contagem, duplicados, exclusões, pedidos abertos ou eventos por acção. Assim, não foram verificadas comparabilidade, integridade ou causalidade. O ano, a cobertura dos meses e o fuso não foram fornecidos; os 30 pedidos podem referir-se a um período incompleto. Angola/Africa-Luanda é apenas contexto provisório desta skill, sem inferência jurídica.

Ciclo proposto para a próxima medição: conclusão − criação de cada pedido concluído, na mesma unidade e calendário. Denominador: pedidos únicos concluídos no intervalo, da versão e população explicitamente escolhidas. Excluir cancelados da métrica de conclusão e reportá-los separadamente; reportar abertos e a sua idade para evitar ocultar atrasos. As exclusões ainda não foram aplicadas aos dados apresentados.

Possíveis causas a investigar: aumento de complexidade, espera por documentos, capacidade insuficiente ou diferenças de aprovação. São hipóteses. Não há evidência para uma avaliação individual do gestor.

## Uma alteração proposta e como a testar

Introduzir uma conferência inicial de completude e complexidade conduzida por Compras antes da aprovação. O dono do processo assume o piloto; confirmar a pessoa responsável. Mecanismo esperado: detectar documentos em falta antes de ocupar a etapa de aprovação. A existência actual deste gargalo ainda deve ser verificada numa amostra de casos; não é uma conclusão destes agregados.

Definir critérios simples e estáveis de complexidade antes do piloto e registar se há documentação em falta. Durante quatro semanas, comparar casos da mesma categoria e versão com uma linha de base reconstruída; se o volume permitir, usar introdução faseada entre grupos comparáveis. Medir mediana e p90 do ciclo, tempo de espera por documentos, retrabalho, idade dos abertos e carga da conferência. Objectivo proposto: reduzir espera documental sem aumentar rejeições indevidas nem trabalho administrativo desproporcional. A meta numérica deve seguir a linha de base, ainda inexistente.

Ao terminar, apresentar tamanho das amostras e resultados por categoria. Se a espera documental não for relevante ou a conferência aumentar o ciclo, retirar ou ajustar o piloto. Uma melhoria observada neste desenho continua a exigir cautela causal.

Fonte de produto: `references/provia-capabilities.md` e skill `provia-process-improvement`. Relatórios dependem de plano e permissões; não se promete envio programado de relatórios. Não houve acesso ao Provia nem alterações.
