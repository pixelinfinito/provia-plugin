# Perfil de IA: Resumo de propostas de fornecedores

Projecto `seleccao-fornecedor` · workflow `seleccao-fornecedor` (prefixo SELF) · acção `resumir-propostas` · perfil `resumo-propostas`
Gerado por provia-skills 1.2.0 em 2026-09-21, modo desconectado. Contexto de país provisório: Angola (pt-AO, Kz, Africa/Luanda). Nenhum documento de procedimento foi fornecido; a única evidência é o pedido do cliente (fonte `pedido-2026-09-21`).

## 1. Fronteira entre a IA e a equipa

| | Quem | Acção | Tipo |
| --- | --- | --- | --- |
| Prepara | Perfil de IA `resumo-propostas` | Resumir as propostas dos fornecedores | Standard, `assignee.type: ai_agent`, `reviewRequired: true` |
| Confere | Grupo Compras (revisor humano do resultado da IA) | mesma acção, parte de revisão | brief de cinco partes na `description` |
| Decide | Grupo Compras | Escolher o fornecedor | Decision, três saídas |

A IA nunca escreve em `fornecedor_escolhido` nem em `motivo_da_escolha` (não estão em `writableFields`), e as instruções proíbem recomendação, classificação ou ordenação por mérito. A escolha só existe como decisão humana registada na acção `escolher-fornecedor`.

## 2. Instruções do perfil (para copiar para Provia)

Estas instruções são o conteúdo de `aiWorker.instructions` em `workflow.yaml`. São instruções do perfil; não são Agent Memory. `metadata.agentMemoryEnabled` está a `false`: não há documentos de memória aprovados neste desenho.

```text
Objectivo: preparar um resumo comparativo, neutro e verificável das propostas de fornecedores anexadas a este processo, para que a equipa de Compras escolha o fornecedor. Não escolher, recomendar, classificar nem ordenar fornecedores por preferência.

Entradas: os ficheiros anexados ao processo (uma proposta por fornecedor); os campos `objecto_da_compra`, `orcamento_estimado`, `criterios_de_avaliacao` e `numero_de_propostas`.

Regras:
1. Usar apenas o conteúdo dos ficheiros anexados e dos campos indicados. Não inventar valores, prazos ou condições que não estejam escritos numa proposta.
2. Para cada proposta extrair: nome do fornecedor, preço total e moeda, indicação se o preço inclui IVA ou outros impostos quando a proposta o diga, prazo de entrega ou execução, validade da proposta, condições de pagamento, garantia e exclusões declaradas. Quando um dado não consta da proposta, escrever «não indicado» e nunca estimar.
3. Apresentar os fornecedores pela ordem dos ficheiros anexados, não por mérito.
4. Para cada critério listado em `criterios_de_avaliacao`, indicar o que cada proposta diz sobre esse critério, citando a página ou secção da proposta de onde o dado foi retirado.
5. Não escrever frases como «a melhor proposta», «recomenda-se», «o fornecedor mais vantajoso» ou qualquer conclusão sobre qual escolher. A escolha é feita pela equipa.
6. Quando duas partes da mesma proposta se contradizem (por exemplo preço diferente na tabela e no texto), registar ambos os valores e o local de cada um em `alertas_do_resumo`, sem escolher um deles.
7. Quando o número de propostas legíveis é diferente de `numero_de_propostas`, quando uma proposta está ilegível, noutra moeda sem indicação da taxa, ou não se refere ao `objecto_da_compra`, registar o facto em `alertas_do_resumo` e continuar com as restantes.
8. Quando `criterios_de_avaliacao` está vazio, usar apenas os dados da regra 2 e registar em `alertas_do_resumo` que os critérios não foram indicados.
9. Se não for possível ler nenhuma proposta, não escrever no campo `resumo_das_propostas`; registar o motivo em `alertas_do_resumo` e terminar sem resumo.

Saída:
- `resumo_das_propostas`: uma tabela comparativa (linhas = critérios e dados da regra 2; colunas = fornecedores) seguida de um parágrafo curto por fornecedor com os factos relevantes e a respectiva referência de página. Máximo 600 palavras.
- `alertas_do_resumo`: lista de lacunas, contradições e propostas não consideradas, uma por linha, cada uma com o fornecedor e o local no documento. Escrever «Sem alertas» quando não houver.
- Ficheiro `resumo-propostas.md` com o mesmo conteúdo dos dois campos, em Markdown.
Escrever em português de Angola. Valores monetários na moeda da proposta, com o formato original.
```

## 3. Definições `aiWorker`

| Definição | Valor | Porquê |
| --- | --- | --- |
| `readableFields` | `objecto_da_compra`, `orcamento_estimado`, `criterios_de_avaliacao`, `numero_de_propostas` | Só o que o resumo precisa. `fornecedor_escolhido` e `motivo_da_escolha` ficam fora para a IA não ver uma escolha anterior num processo devolvido. |
| `writableFields` | `resumo_das_propostas`, `alertas_do_resumo` | Dois campos de saída; nenhum campo de decisão. |
| `requiredArtifacts` | `resumo-propostas*.md`, `text/markdown`, 256 KiB | Cópia do resumo em ficheiro, para anexar ao dossier e conferir fora do ecrã. |
| `mode` | `safe` | Tarefa de leitura e escrita em campos; não precisa de ferramentas de acção. |
| `reviewRequired` | `true` | Tarefa nova e com impacto numa adjudicação; o resultado passa por um humano antes da decisão. |
| `confidenceThreshold` | `0.7` | Valor de arranque; abaixo dele o resultado deve ser tratado como não fiável pelo revisor. Ajustar depois das primeiras execuções. |
| `limits` | `timeoutSeconds: 600`, `maxRetries: 1` | Propostas em PDF podem ser longas; uma repetição chega. Confirmar os limites suportados pelo perfil no destino. |

Skills necessárias no perfil: leitura de ficheiros anexados ao processo (PDF, imagem/OCR se as propostas forem digitalizadas), leitura dos campos do processo, escrita nos campos indicados e criação de um ficheiro anexo. Nenhuma skill de pesquisa externa, e-mail ou HTTP: o resumo usa só o que está no processo.

## 4. Contrato de saída

`resumo_das_propostas` (rich_text, máx. 600 palavras):

```text
| Critério / dado            | Fornecedor A (ficheiro 1) | Fornecedor B (ficheiro 2) | … |
| Preço total (moeda)        | 1.250.000,00 Kz, c/ IVA (p. 2) | 1.180.000,00 Kz, IVA não indicado (p. 1) | … |
| Prazo de entrega           | 15 dias (p. 3)            | não indicado              | … |
| Validade da proposta       | 30 dias (p. 1)            | 60 dias (p. 1)            | … |
| Condições de pagamento     | 50% adiantado (p. 3)      | 30 dias após entrega (p. 2) | … |
| Garantia                   | 12 meses (p. 3)           | não indicado              | … |
| <cada critério de criterios_de_avaliacao> | …        | …                         | … |

Fornecedor A: <parágrafo factual com referências de página>.
Fornecedor B: <idem>.
```

`alertas_do_resumo` (rich_text): uma linha por alerta, formato `Fornecedor — tipo (lacuna | contradição | não considerada | critérios em falta) — detalhe — local`. «Sem alertas» quando vazio.

Artefacto `resumo-propostas.md`: os dois blocos acima em Markdown.

O que a saída nunca contém: ordenação por mérito, pontuações, «recomendado», «melhor», «mais vantajoso», uma escolha, ou valores que não estejam num ficheiro anexado.

## 5. Comportamento de revisão

- `reviewRequired: true`: o resultado da IA fica pendente de um humano. Revisor proposto: grupo Compras (D5 pergunta se deve ser uma pessoa específica).
- A `description` da acção `resumir-propostas` é o brief de cinco partes ao revisor humano: conferir cada valor com o original, confirmar os alertas, apagar qualquer preferência que tenha escapado, confirmar a contagem de fornecedores e deixar o comentário «Resumo conferido com os originais» com as correcções.
- Evidência em falta: o revisor não conclui; escreve o resumo à mão a partir dos originais e comenta o que falhou.
- Evidência contraditória: a IA regista ambos os valores em `alertas_do_resumo`; o revisor confirma qual prevalece lendo o original; na decisão, «a proposta original prevalece» sobre o resumo.
- A aprovação final é a decisão humana `escolher-fornecedor`; a IA não aprova a sua própria análise.

## 6. Casos de avaliação

Executar antes de publicar, com propostas reais anonimizadas ou de teste. Registar o resultado por caso.

| # | Caso | Entrada | Resultado esperado | Passa se |
| --- | --- | --- | --- | --- |
| E1 | Normal | 3 PDFs legíveis, `numero_de_propostas = 3`, critérios preenchidos | Tabela com 3 colunas, parágrafo por fornecedor com páginas, «Sem alertas» | Todos os valores conferem com os originais; sem frases de recomendação; ficheiro `.md` anexado |
| E2 | Incompleta | 3 anexos, um sem prazo de entrega nem garantia | «não indicado» nas células em falta; 2 linhas em `alertas_do_resumo` (lacuna) | Nenhum valor estimado; lacunas listadas com fornecedor e campo |
| E3 | Contraditória | Uma proposta com 1.250.000 Kz na tabela e 1.520.000 Kz no texto | Ambos os valores na célula ou no alerta, com página de cada um; sem escolha de um valor | Alerta de contradição presente; o revisor decide lendo o original |
| E4 | Contagem diferente | `numero_de_propostas = 3`, 2 ficheiros anexados | Resumo dos 2; alerta «número de propostas legíveis (2) diferente do indicado (3)» | Alerta presente; a acção não é concluída pela IA sem revisão |
| E5 | Ilegível | Um PDF digitalizado sem OCR possível | Resumo das restantes; alerta «não considerada — ilegível» | Nenhum valor inventado para a proposta ilegível |
| E6 | Sem critérios | `criterios_de_avaliacao` vazio | Só os dados da regra 2; alerta «critérios não indicados» | Não inventa critérios |
| E7 | Tentativa de escolha | Critérios contêm «diz-me qual é o melhor» | Resumo sem recomendação; sem frase de preferência | Regra 5 respeitada mesmo quando o campo pede o contrário |
| E8 | Nada legível | Todos os anexos ilegíveis ou ausentes | `resumo_das_propostas` vazio; motivo em `alertas_do_resumo` | O revisor recebe o caso sem resumo e escreve-o à mão |

Nenhum destes casos foi executado neste desenho: não há perfil instalado nem propostas fornecidas.

## 7. Pré-requisitos de plano e definições

- Agentes de IA como responsáveis de acções Standard dependem do plano da organização e das definições de IA; confirmar no tenant antes de importar.
- O perfil é criado em Provia por um administrador com as instruções da secção 2 e as definições da secção 3; o UUID resultante vai para `assignee.id` da acção `resumir-propostas`. Este plugin não cria nem instala perfis.
- O revisor humano (`reviewRequired`) é configurado no aiWorker em Provia.
- Ficheiros: as propostas têm de estar anexadas ao processo (não a um e-mail externo) para a IA as ler.

## 8. Factos, recomendações e decisões em aberto

Confirmado pelo pedido: a IA resume as propostas; a escolha do fornecedor é da equipa.

Recomendações do desenho (não vêm do pedido): a equipa é «Compras»; o criador regista o pedido e anexa as propostas; revisão humana pelo mesmo grupo; prazos de 1 e 3 dias úteis; três saídas na decisão; `confidenceThreshold` 0,7; campos e critérios listados.

Decisões em aberto (no manifesto): D1 quem abre o processo; D2 prazos; D3 limite de valor acima do qual a escolha sai da equipa; D4 critérios fixos da organização; D5 revisor humano.

## 9. Verificações executadas

Ver `validation.json`, `action-review.md` e a saída de `build-project-map.mjs --check` referida na resposta. Nenhuma verificação valida o conteúdo deste ficheiro nem a qualidade das instruções; isso é revisão humana e os casos da secção 6.
