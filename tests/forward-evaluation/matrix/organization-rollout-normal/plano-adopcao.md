# Plano de adopção — Piloto Compras, expansão a Recursos Humanos

Angola, pt-AO. Artefacto do plugin; nada foi criado numa organização Provia (modo `disconnected`).

## Aviso sobre as fontes

Não foi fornecido nenhum procedimento, organograma ou export para esta tarefa. Os grupos, papéis e a sequência abaixo são **propostas** baseadas em papéis típicos de um processo de Compras e de Recursos Humanos, não em documentos da organização. Cada grupo tem um `flag` no manifesto (`provia-project.json`) a marcar o que falta confirmar. Antes de configurar qualquer coisa em Provia, confirmar com a Direcção Geral os nomes reais e, com `provia-workflow-designer`, desenhar os workflows de Compras e de RH — só aí é possível verificar que cada grupo tem pelo menos uma acção atribuída (`assigneeRef`).

## 1. Separar administração, propriedade do processo e responsabilidade pelas acções

| Camada | O que cobre | Grupo proposto |
| --- | --- | --- |
| Administração da organização Provia | Criar utilizadores, atribuir licenças, configurar integrações | `administracao_ti` |
| Administração de grupos | Manter a composição dos grupos abaixo à medida que a equipa muda | Mesma pessoa que a administração da organização, até haver volume que justifique separar |
| Dono do processo | Aprova o desenho do workflow, prioridades do piloto/expansão e os indicadores de adopção | `dono_processo_compras` (fase 1), `dono_processo_rh` (fase 2) |
| Responsabilidade pelas acções | Executa e conclui as acções do dia-a-dia do workflow | `compras`, `aprovacao_financeira`, `direccao_geral`, `recursos_humanos`, `chefias` |

Nenhuma destas atribuições concede acesso por si só — são propostas para revisão; a criação real dos grupos e a atribuição de permissões acontece em Provia, por uma pessoa autorizada.

## 2. Grupos propostos e segregação de funções

Ver `groups[]` em `provia-project.json` para os detalhes (propósito, membros propostos, `sourceRefs`, flags). Resumo:

- **`compras`** e **`aprovacao_financeira`** ficam separados (`segregation`): quem prepara o pedido de compra não pode também aprová-lo.
- **`direccao_geral`** está marcado `single_person` — falta nomear um substituto para ausências (decisão D4).
- **`recursos_humanos`** está marcado `segregation` para o caso em que um técnico de RH submete o seu próprio pedido (ex.: férias) — precisa de um aprovador fora da equipa de RH (decisão D6).
- **`dono_processo_compras`**, **`dono_processo_rh`**, **`administracao_ti`** e **`chefias`** estão marcados `unnamed` — são papéis necessários mas sem pessoa identificada nas fontes (decisões D1, D2, D5, D7).

Nenhum limiar de aprovação (valor a partir do qual a Direcção Geral intervém) foi indicado — ver decisão D3; não foi inventado nenhum valor.

## 3. Verificação de cobertura

`--check` confirma que os 8 grupos estão bem formados, mas reporta que nenhum possui ainda uma acção atribuída, porque não existe workflow desenhado nesta fase. Isto é esperado: a cobertura real de `assigneeRef` só pode ser verificada depois de `provia-workflow-designer` desenhar as acções de Compras (fase 1) e de RH (fase 2) usando estas chaves de grupo.

## 4. Faseamento

### Fase 1 — Piloto em Compras (semanas 1–6)

| Semana | Marco | Critério de saída |
| --- | --- | --- |
| 1 | Confirmar `dono_processo_compras` (D1), limiar de aprovação (D3) e substituto da Direcção Geral (D4) | As três decisões têm resposta registada |
| 2 | Desenhar o workflow de Compras (`provia-workflow-designer`) usando `compras`, `aprovacao_financeira`, `direccao_geral` | Workflow revisto e as acções têm `assigneeRef` resolvido |
| 3 | Configurar os grupos em Provia com os membros reais e formar os três grupos | Todos os membros propostos substituídos por pessoas nomeadas |
| 4 | Exercícios de formação (ver secção 5) com um pedido de compra fictício | Cada papel conclui o exercício sem apoio na segunda tentativa |
| 5–6 | Piloto a correr com pedidos reais de baixo risco | Ver métricas na secção 6 |

### Fase 2 — Expansão a Recursos Humanos (após o piloto de Compras estabilizar)

Não iniciar antes de rever as métricas do piloto (secção 6); reutilizar as lições sobre confusão e trabalho em atraso.

| Passo | Marco | Critério de saída |
| --- | --- | --- |
| 1 | Confirmar `dono_processo_rh` (D2), regra de auto-aprovação (D6) e chefias por departamento (D7) | Decisões respondidas |
| 2 | Desenhar o(s) workflow(s) de RH (ex.: admissão, férias/ausências) reutilizando `chefias` e criando `recursos_humanos` | Workflow revisto |
| 3 | Configurar `recursos_humanos` e confirmar a composição de `chefias` por departamento | Grupos com membros reais |
| 4 | Exercícios de formação específicos de RH | Cada papel conclui o exercício sem apoio |
| 5 | Piloto de RH com casos reais de baixo risco, depois alargamento | Ver métricas na secção 6 |

## 5. Exercícios de formação por papel

Cada exercício usa um caso fictício, nunca dados reais de terceiros, e termina com o participante a repetir a tarefa sem apoio.

| Papel | Exercício | Quem apoia |
| --- | --- | --- |
| Requisitante (qualquer colaborador, `assigneeRef: creator` no workflow) | Iniciar um pedido de compra fictício e acompanhar o estado | `dono_processo_compras` |
| `compras` | Completar uma acção: preencher cotações, avançar o pedido | `dono_processo_compras` |
| `aprovacao_financeira` | Tomar uma decisão: aprovar e rejeitar (com comentário obrigatório) um pedido fictício | `dono_processo_compras` |
| `direccao_geral` | Rever um relatório do piloto e decidir uma excepção fictícia acima do limiar | `dono_processo_compras` |
| `recursos_humanos` (fase 2) | Completar uma acção de admissão ou de férias fictícia | `dono_processo_rh` |
| `chefias` (fase 2) | Tomar uma decisão de aprovação de férias de um subordinado fictício | `dono_processo_rh` |
| `administracao_ti` | Criar/editar um grupo e confirmar que um membro perdeu e ganhou acesso correctamente | Implementador Provia |

## 6. Medidas de adopção (revistas no fim de cada fase, não apenas contagem de contas criadas)

- **Trabalho útil concluído**: número de pedidos de compra (fase 1) ou casos de RH (fase 2) concluídos de início a fim, não apenas iniciados.
- **Cobertura de responsabilidade**: percentagem de acções cujo `assigneeRef` resolve para uma pessoa activa no grupo (via `--check` depois do workflow desenhado), não para um grupo vazio.
- **Confusão**: número de pedidos de apoio durante os exercícios e durante as duas primeiras semanas de cada fase.
- **Atrasos**: acções que excedem o prazo definido no workflow (`due.offsetDays`), quando o workflow existir.
- **Evidência em falta**: decisões sem comentário obrigatório ou casos sem os anexos exigidos.

Estas medidas dependem de o workflow estar desenhado e de haver casos reais a correr; nesta fase (sem workflow) só é possível preparar o plano e os grupos propostos.

## Decisões em aberto

Ver `decisions[]` em `provia-project.json` (D1–D7): dono do processo de Compras, dono do processo de RH, limiar de aprovação, substituto da Direcção Geral, responsável pela administração da organização Provia, regra de auto-aprovação em RH, e a lista real das chefias de departamento.
