# Plano de adopção do Provia — Compras primeiro, Recursos Humanos depois

Data: 2026-09-21 · Contexto provisório: Angola, pt-AO, Africa/Luanda, Kz · Artefactos: `provia-project.json`, `project.html` (separador Acesso e Grupos), `setup.md`.

## 1. O que recebemos e o que assumimos

**Facto confirmado.** O único pedido é: começar com Compras e alargar depois à equipa de Recursos Humanos. Está registado no manifesto como fonte `pedido-rollout` (tipo `interview`).

**Não recebemos** procedimento de compras, organigrama, lista de pessoas ou emails, resultados de piloto anterior, nem permissões já existentes no Provia. O anfitrião expõe o servidor `provia-implementer` (ferramenta `org_get_context`), mas a chamada foi recusada por falta de autorização nesta sessão; por isso o projecto está em **modo desligado**: nada foi lido nem criado no Provia, nenhum email está verificado e não há recibos.

**Assunções que sustentam o plano** (cada uma tem uma decisão aberta em `decisions[]`):

| # | Assunção | Decisão |
| --- | --- | --- |
| A1 | Um pedido de compra passa por: requerente → chefia → Compras (cotações) → Finanças (cabimento) → Direcção Geral (adjudicação) → Compras (ordem) → requerente (recepção) → Finanças (pagamento). É a estrutura habitual, não o procedimento desta organização. | D10 |
| A2 | Qualquer colaborador poderá abrir um pedido no estado final; durante o piloto só os departamentos-piloto. | D7 |
| A3 | Finanças, Chefias e Direcção Geral são os nomes usados na organização. | flags `alias`/`unnamed` |
| A4 | «Alargar a RH» significa duas coisas: RH passa a requerente de compras e, depois, RH ganha o seu próprio primeiro workflow. | D2 |
| A5 | O plano da organização inclui relatórios de casos concluídos. | D9 |

Se A1 estiver errada, o esqueleto de oito acções muda mas os grupos e a lógica do plano mantêm-se.

## 2. Quatro autoridades diferentes, quatro respostas diferentes

Ninguém precisa de ser «administrador de tudo». O plano separa:

| Autoridade | Quem | O que faz | O que não faz |
| --- | --- | --- | --- |
| Administração da organização Provia | Owners/Admins da conta (papel, não grupo); a nomear em D8 | Convida utilizadores, cria grupos, activa funcionalidades do plano | Não decide em workflows |
| Administração de grupos | Os mesmos Owners/Admins, ou quem tiver essa permissão | Mantém a lista de membros de cada grupo | Não altera desenhos de workflow |
| Administração de workflows | Grupo `admin_workflows` (2 pessoas, principal e suplente) | Concede e revoga acessos, arquiva; nível `admin` em cada workflow | **Não decide nem executa acções** nos workflows que administra (regra 6 do verificador) |
| Dono do processo | `dono_processo_compras` (vaga 1), `dono_processo_rh` (vaga 2); nível `edit` | Define regras (adjudicação, segregação), revê o piloto, autoriza a publicação, altera versões | Não concede acessos |
| Responsável de acção | Grupos `chefias`, `compras`, `financas`, `direccao_geral`; sem concessão | Executa e decide nos casos que lhes chegam | Não vê os casos dos outros (a não ser que D6 o decida) |

As concessões descritas são **propostas** para revisão no separador Acesso de `project.html`. Nada foi concedido.

## 3. Desenho dos grupos (dados em `groups[]`)

| Chave | Nome (único no tenant) | Tipo | Área | Membros propostos | Sinalizações |
| --- | --- | --- | --- | --- | --- |
| `compras` | Compras | team | gestao_corporativa | Responsável de Compras, Técnico de Compras | unnamed |
| `dono_processo_compras` | Responsável do processo de Compras | role | gestao_corporativa | a nomear | unnamed, single_person |
| `chefias` | Chefias de departamento | team | operacoes | um chefe por departamento requerente | unnamed, segregation (D3) |
| `financas` | Finanças | team | gestao_corporativa | Director financeiro, Técnico de contabilidade | unnamed, segregation (par com Compras) |
| `direccao_geral` | Direcção Geral | team | gestao_corporativa | Director geral | single_person (D5), unnamed |
| `requerentes_piloto` | Requerentes do piloto de Compras | container | operacoes | colaboradores dos departamentos-piloto | requester, unnamed (D7) |
| `rh` | Recursos Humanos | team | recursos_humanos | Director de RH, Técnico de RH | unnamed; sem acções até à vaga 2 |
| `dono_processo_rh` | Responsável do processo de RH | role | recursos_humanos | a nomear | unnamed, single_person (D2) |
| `admin_workflows` | Administradores de workflows | role | tecnologia | principal e suplente | unnamed (D8) |

Notas de desenho:

- O requerente não tem grupo: as acções «Registar o pedido» e «Confirmar a recepção» usam `assigneeRef: creator`. `requerentes_piloto` existe apenas para a lista de arranque do gatilho manual durante o piloto; quando a lista for esvaziada (vaga 3), o grupo pode ser arquivado.
- Direcção Geral é uma pessoa, mas fica em grupo para que a adjudicação continue em ausências. O delegado é a decisão D5.
- Compras e Finanças ficam em grupos separados de propósito: quem escolhe o fornecedor e emite a ordem não regista o pagamento.
- Nenhum email foi inventado. Todos os membros estão `verified: false`; em modo ligado `users_search` confirma-os.

## 4. Matriz de acesso (`workflows[].access`)

Workflow `compras` · sensibilidade `internal` · área dona `gestao_corporativa`.

| Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- |
| `organization` | create_incident | Estado-alvo: qualquer colaborador abre um pedido | por aplicar |
| `group:dono_processo_compras` | edit | Dono do desenho; altera versões e publica | por aplicar |
| `group:admin_workflows` | admin | Acessos e arquivo; não decide | por aplicar |
| `group:compras`, `chefias`, `financas`, `direccao_geral` | — | Vêem só os casos que lhes são atribuídos | — |

Gatilho manual «Iniciar pedido de compra» com lista de arranque `compras` + `requerentes_piloto` durante o piloto. A lista **restringe** abaixo da concessão à organização e é configuração na UI, não vai no YAML. Regra 8 do verificador avisa que não consegue determinar quem consegue iniciar: nenhum membro tem email. Só D7 resolve isso.

Revisão de segregação: `admin_workflows` detém `admin` e não aparece em nenhuma acção; nenhum grupo com `edit` ou `admin` decide. `view` não foi proposto a nenhuma equipa executante; se Compras precisar de fila partilhada (D6), a concessão entra com razão e fonte.

## 5. Cobertura de responsabilidade

Resultado de `node scripts/build-project-map.mjs provia-project.json --check` (2026-09-21):

- 8 acções humanas, 8 com `assigneeRef` resolvido: 2 × `creator`, 2 × `compras`, 2 × `financas`, 1 × `chefias`, 1 × `direccao_geral`. Nenhum actor por resolver.
- Acesso declarado em 1/1 workflows; 0 erros; 5 avisos; 5 informações.
- Avisos esperados e porquê: `rh`, `dono_processo_rh`, `dono_processo_compras` e `admin_workflows` não possuem acções (são papéis de desenho e administração, ou da vaga 2); regra 8 sem membros verificados (D7, D8).
- 1 bloqueio de prontidão: a lista de arranque não pode ser escrita sem os identificadores dos grupos no tenant.
- Pares de segregação registados: requerente/chefia (D3), Compras/Finanças (mantidos separados).

O que o verificador **não** prova: que as oito acções correspondem ao procedimento real (D10), que os prazos propostos (1–5 dias úteis, a contar da activação, sem feriados) são os da organização, nem que a publicação é adequada — isso decide-o o dono do processo no Provia.

## 6. Atribuição dentro dos grupos

O YAML transporta o grupo responsável, não a estratégia de atribuição. Opções a escolher na UI do Provia por grupo (configuração fora do pacote, registada em `setupNotes`):

- **Grupo inteiro, primeiro a aceitar** — recomendado para `compras` e `financas`: continuidade em férias, sem gestor de fila.
- **Um membro por departamento** — `chefias`: o chefe do departamento do requerente decide. Como o Provia não encaminha por valor de campo, ou cria-se um sub-grupo por departamento (um nível de sub-grupos é permitido) ou a chefia é escolhida no caso; a escolha fica para o desenho real com o SOP.
- **Pessoa única com delegado** — `direccao_geral`: o grupo tem duas pessoas e o titular reatribui em ausência.

## 7. Vagas e marcos (calendário proposto, a ajustar)

| Vaga | Período proposto | Conteúdo | Sai quando |
| --- | --- | --- | --- |
| 0 — Preparação | 22 Set – 9 Out 2026 | Resolver D1, D7, D8, D10. Entregar o SOP; `provia-workflow-designer` substitui o esqueleto; `provia-workflow-package` gera e valida o YAML; `provia-workflow-review` antes de importar. Criar grupos e importar rascunho (modo ligado após autorização, ou à mão com `setup.md`). Um membro de `requerentes_piloto` inicia sessão e confirma o botão Iniciar. | Rascunho importado, grupos criados, verificação de arranque registada |
| 1 — Piloto Compras | 12 Out – 20 Nov 2026 (6 semanas) | Publicação pelo dono do processo. Só Compras + 2 departamentos-piloto abrem pedidos. Formação por papel (§8). Todos os pedidos dos departamentos-piloto passam pelo Provia; pedidos por email são registados no Provia por Compras e contados como «fora do canal». Revisão às semanas 2 e 4. | ≥ 15 casos concluídos até ao fim (meta proposta) e revisão do piloto feita |
| Revisão do piloto | 23 – 27 Nov 2026 | `provia-diagnose` sobre a exportação: confusão (acções devolvidas, comentários «não sei o que fazer»), atrasos, evidências em falta. Uma alteração medível com dono. `provia-process-knowledge` actualiza o SOP com o que foi aprovado. | Lista de alterações fechada; nova versão planeada com `provia-workflow-change` se houver casos abertos |
| 2 — Recursos Humanos | 30 Nov 2026 – 26 Fev 2027 | (a) RH entra em `requerentes_piloto` e abre os seus pedidos de compra; (b) `provia-process-discovery` escolhe o primeiro processo de RH (D2); desenho, pacote, revisão e piloto de RH com a mesma cadência de 6 semanas. Sensibilidade: se o processo tocar salários, disciplina ou saúde, marcar `restricted` e nunca conceder `view` à organização. | Piloto de RH concluído e revisto |
| 3 — Alargamento | Mar 2027 | Esvaziar a lista de arranque: `organization` → `create_incident` passa a produzir efeito. Arquivar `requerentes_piloto`. Formação de requerentes a toda a organização (30 min). | Todos os departamentos abrem pedidos no Provia |

## 8. Formação por papel

Cada exercício é feito num caso de treino real no rascunho (prefixo COMP) antes da publicação, e repetido com um caso verdadeiro na primeira semana.

| Papel | Exercício | Duração | Evidência de que aprendeu |
| --- | --- | --- | --- |
| Requerente (`creator`) | Iniciar um pedido, preencher descrição/quantidade/justificação/estimativa, anexar um ficheiro, acompanhar o estado, confirmar a recepção | 30 min | Um caso de treino concluído até «Confirmar a recepção» |
| Chefia (`chefias`) | Receber a acção, ler o pedido, decidir aprovado/rejeitado com comentário obrigatório na rejeição | 20 min | Uma aprovação e uma rejeição com comentário |
| Compras | Concluir «Obter cotações» com três cotações anexadas e proposta recomendada; emitir a ordem; reatribuir dentro do grupo | 60 min | Acção concluída com evidências no caso de treino |
| Finanças | Validar cabimento (decisão com rubrica), registar pagamento com comprovativo | 30 min | Decisão e acção concluídas |
| Direcção Geral e delegado | Adjudicar com fundamento; reatribuir para o delegado | 20 min | Uma adjudicação por cada um |
| Dono do processo | Ler o relatório de casos concluídos (ou a exportação, se o plano não tiver relatórios), identificar um atraso e uma evidência em falta; abrir uma nova versão em rascunho sem publicar | 45 min | Uma nota de revisão registada em `project.html` |
| Administradores de workflows | Criar um grupo, adicionar um membro, conceder e revogar `view` num workflow de teste, confirmar que não estão em nenhuma acção | 45 min | Concessão criada e revogada |

Suporte durante o piloto: primeira linha `admin_workflows` (acessos, membros, «não vejo o caso»); segunda linha `dono_processo_compras` (regras, excepções, «quem aprova isto»); terceira linha o implementador (desenho e YAML). Um canal único (Teams ou email) com resposta no mesmo dia útil, e um registo de perguntas que alimenta a revisão do piloto.

## 9. Medidas de adopção (trabalho útil concluído, não contas criadas)

Revisão às semanas 2, 4 e 6 do piloto, pelo dono do processo com o implementador. Fonte: relatório de casos concluídos se o plano o incluir (D9); caso contrário, exportação de casos e acções.

| Medida | Como se calcula | Meta proposta para o fim do piloto |
| --- | --- | --- |
| Pedidos no canal | casos COMP criados ÷ (casos COMP + pedidos recebidos fora do Provia pelos departamentos-piloto) | ≥ 90 % |
| Casos concluídos | casos que chegaram a «Registar o pagamento» ou foram cancelados com motivo | ≥ 15 (a confirmar com o volume real) |
| Acções com evidência | acções concluídas com o anexo/campo que a acção exige ÷ acções concluídas | ≥ 95 % |
| Acções atrasadas | acções concluídas depois do prazo ÷ acções concluídas | ≤ 20 % na semana 6, com tendência a descer |
| Cobertura de responsabilidade | acções cujo grupo tem ≥ 1 membro activo e verificado ÷ acções humanas | 100 % antes da publicação |
| Casos parados | casos sem actividade há mais de 5 dias úteis | 0 na revisão da semana 6 |
| Decisões com comentário | rejeições e «sem cabimento» com comentário ÷ rejeições | 100 % |
| Confusão | acções devolvidas ou reatribuídas mais de uma vez; perguntas no canal de suporte por tema | Lista fechada na revisão do piloto |

Logins, contas criadas e cliques não contam como adopção.

## 10. O que foi verificado, o que está pendente

**Verificado.** Forma do manifesto, referências cruzadas, regras de acesso 1–8, cobertura de `assigneeRef` e unicidade de nomes de grupos, por `build-project-map.mjs --check` sobre `provia-project.json`. `project.html` e `setup.md` gerados a partir dele. Este ficheiro Markdown não é verificado por nenhum script.

**Pendente.** D1–D10; o SOP real; emails de membros; autorização do servidor `provia-implementer` (para ler o tenant, verificar emails com `users_search` e aplicar `groups_apply_plan` após revisão); a lista de arranque (bloqueio de prontidão até existirem identificadores); confirmação do plano quanto a relatórios. Nada foi importado, publicado ou concedido no Provia.
