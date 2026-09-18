## Resumo

Não havia manifesto nem workflow existentes na pasta de trabalho, nem foi fornecido um procedimento (SOP), por isso desenhei um workflow mínimo mas reviewável só com o âmbito pedido — resumo de propostas + escolha do fornecedor — em vez de inventar um processo de compras completo.

**Desenho:**
- `resumir-propostas` (Standard, `assigneeRef: ai:resumir-propostas`) — a IA lê apenas `documentos_propostas` e escreve apenas `resumo_propostas`, uma tabela factual (fornecedor, preço, prazo, condições). As instruções proíbem explicitamente recomendar, ordenar ou sugerir um fornecedor. `reviewRequired: true` mantém o resultado pendente de confirmação humana.
- `escolher-fornecedor` (Decision, `assigneeRef: equipa-compras`) — acção humana separada, com ramos Aprovar/Pedir novas propostas/Cancelar, e uma excepção explícita: se o resumo parecer incompleto ou incorrecto, a equipa devolve para nova preparação em vez de decidir sobre ele.

**Ficheiros escritos** (na pasta de trabalho):
- `provia-project.json` — manifesto com o workflow, o grupo `equipa-compras`, `aiProfiles[]` e 4 decisões em aberto (composição do grupo, prazos, catálogo de entidades definitivo, plano/limiar de confiança de IA do tenant)
- `workflow.yaml` — validado (`node scripts/validate-workflow.mjs`: `valid: true`) e revisto (`node scripts/review-actions.mjs`: as 5 partes presentes nas 2 acções); os únicos avisos são `assignment_missing` e `due: missing`, esperados porque ainda não há perfil de IA nem grupo resolvidos em Provia
- `ai-profile-resumir-propostas.md` — especificação completa do perfil: instruções, contrato de saída, comportamento de revisão, e 3 casos de avaliação (normal, incompleto, contraditório/limite)
- `setup.md` e `project.html` — gerados a partir do manifesto (`build-project-map.mjs`), 11 itens pendentes, nada criado em Provia

Nada disto instala o perfil de IA em Provia — isso é configuração manual a partir do documento do perfil.

Próximo passo recomendado: **`provia-information-model`**, para substituir os campos provisórios de caso (`documentos_propostas`, `resumo_propostas`, `fornecedor_escolhido`) por tipos de entidade definitivos de proposta/fornecedor (decisão D3 do manifesto).

```text
Use provia-information-model com provia-project.json (workflow escolha-fornecedor). Defina os tipos de entidade para proposta de fornecedor e fornecedor, substituindo os campos de caso documentos_propostas/resumo_propostas/fornecedor_escolhido. País: Angola; responda em pt-AO.
```