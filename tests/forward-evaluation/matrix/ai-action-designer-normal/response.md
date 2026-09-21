Desenho concluído em modo desconectado: o pedido de leitura do tenant Provia (`org_get_context`) não foi autorizado nesta sessão, por isso nada foi lido nem escrito na organização. Contexto provisório: Angola, pt-AO. Não foi fornecido nenhum procedimento; a única evidência é o próprio pedido.

## O que foi desenhado

**Fronteira IA / equipa** — três acções no workflow `Selecção de fornecedor com resumo de propostas` (prefixo `SELF`):

| Acção | Tipo | Quem |
| --- | --- | --- |
| Registar o pedido e anexar as propostas dos fornecedores | Standard | criador do processo |
| Resumir as propostas dos fornecedores | Standard, `ai_agent`, `reviewRequired: true` | perfil `resumo-propostas`; revisor humano: Compras |
| Escolher o fornecedor | Decision (Fornecedor escolhido / Pedir esclarecimentos / Cancelar a selecção) | grupo Compras |

A IA lê só 4 campos do pedido e escreve só em `resumo_das_propostas` e `alertas_do_resumo`; `fornecedor_escolhido` e `motivo_da_escolha` estão fora do seu alcance. As instruções proíbem recomendar, classificar ou ordenar fornecedores, obrigam a citar a página de cada valor, e definem o comportamento com propostas em falta (escrever «não indicado», nunca estimar) e contraditórias (registar ambos os valores e o local, sem escolher). A `description` da acção de IA é o brief de cinco partes ao revisor humano, que confere cada valor com o original antes de a decisão avançar.

## Ficheiros escritos na pasta de trabalho

- `workflow.yaml` — YAML portável com campos, `aiWorker` completo, briefs e decisão
- `provia-project.json` — manifesto com o workflow, o grupo `compras`, `aiProfiles[]` (`resumo-propostas`), `assigneeRef: ai:resumo-propostas` e 5 decisões em aberto
- `ai-profile-resumo-propostas.md` — instruções do perfil, definições `aiWorker`, skills necessárias, contrato de saída, comportamento de revisão e 8 casos de avaliação (normal, incompleta, contraditória, contagem diferente, ilegível, sem critérios, tentativa de escolha, nada legível)
- `validation.json`, `action-review.json`, `project.html`, `setup.md`

## O que foi verificado e o que fica pendente

- `validate-workflow.mjs workflow.yaml`: `valid: true`, `backendSchemaValidation: passed`; 2 itens de configuração (`assignment_missing` nas acções de IA e de decisão — sem UUIDs de destino, por desenho).
- `review-actions.mjs`: 3/3 acções com as cinco partes, sem notas de implementador; `due` em falta na primeira acção (deliberado, ver D2).
- `build-project-map.mjs --check`: 0 erros, 0 avisos, 13 itens pendentes de configuração.
- Não executado: os casos de avaliação (não há perfil instalado nem propostas), a validação no destino, e a revisão de qualidade das instruções por um humano.

**Pressupostos a confirmar** (registados como D1–D5, dono: Responsável de Compras): a equipa é «Compras»; quem abre o processo; prazos de 1 e 3 dias úteis; se existe um limite de valor acima do qual a escolha sai da equipa; critérios de avaliação fixos; se o revisor do resumo é o grupo ou uma pessoa. O plugin não cria perfis em Provia: o perfil é criado por um administrador e o UUID copiado para `assignee.id`; depende do plano e das definições de IA do tenant.

Próximo passo recomendado: `provia-workflow-review`, para rever a separação preparação/decisão, os caminhos de devolução e os briefs antes de criar o perfil e importar o rascunho.

```text
Use provia-workflow-review com provia-project.json e workflow.yaml desta pasta. Reveja a acção de IA «Resumir as propostas dos fornecedores» (reviewRequired, campos legíveis/escritos, ausência de recomendação) e a decisão «Escolher o fornecedor», os caminhos de devolução e cancelamento, e as decisões em aberto D1–D5. País: Angola; responda em pt-AO.
```