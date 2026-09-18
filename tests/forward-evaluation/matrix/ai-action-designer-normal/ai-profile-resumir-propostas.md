# Perfil de IA: Resumo de propostas de fornecedores

- Chave no manifesto: `resumir-propostas` (`aiProfiles[]`)
- Workflow: `escolha-fornecedor` (`workflow.yaml`)
- Acção: `resumir-propostas` (Standard, `assigneeRef: ai:resumir-propostas`)
- Acção seguinte, não coberta por este perfil: `escolher-fornecedor` (Decision, `assigneeRef: equipa-compras`)

Este documento é a especificação para configurar o perfil em Provia. O plugin não cria nem instala o perfil; atribuir `ai:resumir-propostas` no manifesto e em `workflow.yaml` não substitui essa configuração manual.

## 1. Objectivo

Preparar um resumo comparativo, factual, das propostas de fornecedores anexadas a um pedido, para que a equipa de compras decida com mais rapidez. O perfil nunca escolhe, recomenda ou ordena fornecedores por preferência — essa decisão fica exclusivamente na acção `escolher-fornecedor`, atribuída ao grupo `equipa-compras`.

## 2. Acesso (inputs e outputs)

| Campo | Acesso | Uso |
| --- | --- | --- |
| `documentos_propostas` | leitura | Documentos das propostas anexadas (ficheiros PDF esperados) |
| `resumo_propostas` | escrita | Único campo que o perfil pode preencher |

O perfil não tem acesso a outros campos do caso, a outros casos, ao histórico do incidente ou a qualquer ferramenta externa. `requiredArtifacts` exige pelo menos um ficheiro `*.pdf` (`application/pdf`, até 20 MB) antes de a acção poder ser considerada — outros formatos de proposta (por exemplo `.docx`) devem ser confirmados com o dono do processo e acrescentados a `requiredArtifacts` se forem aceites na prática.

## 3. Instruções do perfil (`aiWorker.instructions`)

Ver o texto completo em `workflow.yaml`, acção `resumir-propostas`. Resumo das regras:

1. Ler apenas `documentos_propostas`.
2. Por proposta: extrair fornecedor, preço/valor total, prazo de entrega, condições de pagamento e outras condições relevantes.
3. Escrever uma tabela comparativa em `resumo_propostas` (uma linha por fornecedor) seguida de uma lista curta das diferenças mais relevantes.
4. Nunca recomendar, ordenar ou sugerir qual fornecedor escolher.
5. Campo não indicado no documento → escrever "Não indicado", nunca inventar um valor.
6. Duplicados ou documentos que não são propostas → sinalizar no topo do resumo, fora da tabela.
7. Sem documentos legíveis → não preencher `resumo_propostas`; devolver sem alterações e sinalizar a falta de documentos.

## 4. Contrato de saída

`resumo_propostas` (rich_text) contém, por esta ordem:

1. Uma linha de alerta, se aplicável (duplicados, ficheiros ilegíveis, documentos que não são propostas).
2. Uma tabela markdown: `Fornecedor | Preço | Prazo de entrega | Condições de pagamento | Outras condições`.
3. Uma lista curta ("Diferenças a considerar") com as divergências mais relevantes entre propostas, em linguagem neutra (sem juízo de valor sobre qual é "melhor").

Nenhum outro campo é alterado. O perfil não cria comentários, não altera `fornecedor_escolhido` nem `justificativa_escolha`, e não decide o resultado da acção `escolher-fornecedor`.

## 5. Comportamento de revisão humana

- `mode: safe`, `reviewRequired: true` — ponto de partida recomendado por se tratar de uma tarefa nova (`action-configs.md`); o resultado fica pendente de confirmação humana antes de a acção `resumir-propostas` se dar por concluída.
- `confidenceThreshold: 0.6` — valor proposto, não confirmado; depende do plano e das definições de IA do tenant (decisão em aberto D4 no manifesto).
- A pessoa que revê o resumo é orientada pela descrição em cinco partes da própria acção (`workflow.yaml`), escrita para quem vai confirmar o resultado da IA, não para o agente.
- A escolha do fornecedor permanece uma acção humana separada (`escolher-fornecedor`, Decision, grupo `equipa-compras`), com uma excepção explícita: se o resumo parecer incompleto ou incorrecto face às propostas originais, a equipa deve devolver para nova preparação em vez de decidir sobre um resumo em que não confia.

## 6. Memória de agente

`agentMemoryEnabled: false` neste workflow. Não foi fornecida nenhuma instrução aprovada de processo (SOP) para converter em Agent Memory. Se a equipa aprovar, mais tarde, um conjunto de regras de negócio estáveis (por exemplo, "propostas em moeda estrangeira devem ser convertidas para AOA à taxa X"), essas regras são candidatas a Agent Memory por `provia-process-knowledge`, distintas das instruções deste perfil — memória não é transportada pelo YAML.

## 7. Competências necessárias (não é um campo de YAML)

Esta acção não faz chamadas a ferramentas nem a sistemas externos: precisa apenas de leitura de anexos e resumo de texto, cobertos pelas definições padrão de `aiWorker` (`readableFields`, `writableFields`, `requiredArtifacts`). Confirmar antes de configurar:

- Se o plano Provia do tenant inclui leitura de anexos por agentes de IA em acções Standard (decisão em aberto D4).
- Se `requiredArtifacts` deve incluir outros formatos além de PDF.

## 8. Casos de avaliação

| Caso | Entrada | Resultado esperado |
| --- | --- | --- |
| Normal | 3 PDF de propostas, cada um com fornecedor, preço, prazo e condições de pagamento claros | Tabela completa com as 3 linhas, sem "Não indicado", sem recomendação; acção fica pendente de revisão humana |
| Incompleto | 1 PDF sem prazo de entrega indicado | Linha desse fornecedor com "Não indicado" na coluna Prazo de entrega; nenhum valor inventado |
| Contraditório / limite | 2 PDF que são a mesma proposta em versões diferentes (mesmo fornecedor, preços diferentes); ou `documentos_propostas` vazio | Duplicado: alerta no topo do resumo em vez de listar como duas ofertas concorrentes. Vazio: `resumo_propostas` não é preenchido; a acção é devolvida sem alterações, sinalizando a falta de documentos legíveis |

### Exemplo de saída (caso normal)

```markdown
| Fornecedor | Preço | Prazo de entrega | Condições de pagamento | Outras condições |
| --- | --- | --- | --- | --- |
| Fornecedor A | 4 500 000 Kz | 15 dias úteis | 50% adiantamento, 50% na entrega | Garantia de 12 meses |
| Fornecedor B | 4 950 000 Kz | 10 dias úteis | 100% na entrega | Sem garantia indicada |
| Fornecedor C | 4 200 000 Kz | 20 dias úteis | 30% adiantamento, 70% na entrega | Garantia de 6 meses |

Diferenças a considerar:
- Fornecedor C é o mais barato mas tem o prazo de entrega mais longo.
- Fornecedor B entrega mais rápido mas exige pagamento integral na entrega e não indica garantia.
```

Nenhuma destas frases recomenda um fornecedor; a tabela e as diferenças assinaladas alimentam a decisão da equipa em `escolher-fornecedor`.
