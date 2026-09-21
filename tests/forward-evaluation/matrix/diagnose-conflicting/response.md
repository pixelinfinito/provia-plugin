Diagnóstico concluído. Ficheiros escritos no directório de trabalho: `diagnostico-compras.md` (relatório), `provia-project.json` (manifesto criado, com 6 decisões), `project.html` e `setup.md` (gerados pelo script do plugin).

## O que foi fornecido e o que não foi

Não há ficheiro de exportação no directório: a «exportação» são dois registos descritos em prosa. Faltam período, hora de observação, fuso horário, datas-limite e a versão do workflow que gerou os casos. O servidor MCP do Provia está exposto, mas a autorização para `org_get_context` não foi concedida — trabalhei em modo desligado, sem consultar o tenant.

Suposições registadas como decisões: «Registar»/«Encomendar» → Compras, «Decidir» → Finanças (D4); permissões do workflow desconhecidas, `creator_only` declarado só como valor provisório (D5).

## Contradição entre exportação e desenho — reportada antes dos números

1. **COMP-88** — estado «Aguardar auditoria» e grupo «Auditoria» não podem sair de um desenho com só «Registar», «Decidir», «Encomendar» e os grupos Compras/Finanças. Hipóteses, por ordem: a versão activa não é a descrita (a publicação cria nova versão; casos antigos mantêm as acções instanciadas); outro workflow/ambiente com prefixo COMP; reatribuição manual a um grupo criado fora do desenho; exportação editada. Próximo registo a inspeccionar: histórico do caso e lista de versões do workflow. «Auditoria» ficou em `unresolvedActors`, não foi criado como grupo.
2. **COMP-90** — conclusão 2 dias antes da criação. Fuso horário não explica (máximo <26 h); resta troca de colunas, edição manual, migração retroactiva ou campo de metadados exportado como data de fecho. Enquanto D2 estiver aberta, a exportação não serve para medir tempo de ciclo.

## Triagem
- COMP-88: **bloqueado — responsável fora do desenho**; agem o administrador Provia (histórico/versões) e o dono do processo em Compras (D3: a auditoria é pretendida?).
- COMP-90: **dados inconsistentes — excluir das métricas**; age quem produziu a exportação.
- Nenhuma afirmação de atraso: sem hora de observação nem datas-limite não é possível.

## Desempenho
Nenhum indicador apresentado: amostra concluída válida = 0, sem timestamps por acção, sem segundo período. A comparação fica marcada como ainda não possível. A mudança proposta (D6) é a única defensável com estes dados: **exportação de referência directamente do Provia + reconciliação com o desenho publicado antes de cada diagnóstico**, dono em Compras com o administrador Provia, medidas: % de casos com estado/responsável no desenho (alvo 100 %), casos com conclusão < criação (alvo 0), e só depois tempo de ciclo mediano Registar→Encomendar por versão em dois períodos.

## Verificado
`build-project-map.mjs --check`: 0 erros, 0 avisos, 2 informações (regra 4), 1 actor não resolvido, 16 itens pendentes. Valida a estrutura do manifesto, não o relatório nem o processo. Os itens «Importar YAML» e «Grupos a criar» em `setup.md` reflectem a ausência de recibos, não trabalho a refazer no que já está publicado.

---

Próximo passo recomendado: `provia-workflow-change`, **condicionado à decisão D3** — se a auditoria for pretendida, o workflow publicado precisa de uma nova versão com a acção de auditoria, responsável, prazo e plano para os casos abertos. Se D3 for «não», o passo seguinte é apenas operacional (devolver COMP-88 e corrigir a exportação) e, com a exportação completa, voltar a `provia-diagnose`.

```text
Use provia-workflow-change com provia-project.json e diagnostico-compras.md neste directório. A decisão D3 foi resolvida como «a auditoria faz parte do processo»: planeie a nova versão do workflow «Pedido de compra» (COMP) com a acção de auditoria, o seu grupo responsável, prazo e evidência, o impacto no caso aberto COMP-88 e nos restantes casos em curso, e registe a alteração no manifesto. Considere também D4 (distribuição das acções) e D5 (permissões). País: Angola; responda em pt-AO.
```