# Adopção do Provia: Compras (vaga 1) e Recursos Humanos (vaga 2): Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização |
| compras | Pedido de compra | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. organization → create_incident, group:dono_processo_compras → edit, group:admin_workflows → admin |
| compras | Pedido de compra | **BLOQUEIO** Restringir o início manual aos principais indicados (bloqueio: o YAML não leva a lista até existirem os identificadores) (`compras, requerentes_piloto`). missing ids: compras, requerentes_piloto |
| compras / decidir_necessidade | Decidir sobre a necessidade do pedido | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| compras / obter_cotacoes | Obter cotações de fornecedores | Atribuir o grupo à acção depois de o grupo existir (`compras`) |
| compras / validar_cabimento | Validar o cabimento orçamental | Atribuir o grupo à acção depois de o grupo existir (`financas`) |
| compras / adjudicar | Adjudicar a proposta seleccionada | Atribuir o grupo à acção depois de o grupo existir (`direccao_geral`) |
| compras / emitir_ordem | Emitir a ordem de compra | Atribuir o grupo à acção depois de o grupo existir (`compras`) |
| compras / confirmar_recepcao | Confirmar a recepção do bem ou serviço | Definir o prazo; o desenho não propõe `due` |
| compras / registar_pagamento | Registar o pagamento ao fornecedor | Atribuir o grupo à acção depois de o grupo existir (`financas`) |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `compras` | internal | `organization` | create_incident | Estado-alvo: qualquer colaborador abre um pedido de compra. Durante o piloto a lista de arranque do gatilho manual restringe quem inicia (assunção a confirmar pelo dono do processo). (pedido-rollout §1) | por aplicar |
| `compras` | internal | `group:dono_processo_compras` (Responsável do processo de Compras) | edit | Dono do desenho: altera versões e publica depois da revisão do piloto. (pedido-rollout §2) | por aplicar |
| `compras` | internal | `group:admin_workflows` (Administradores de workflows) | admin | Administração de acessos e arquivo; o grupo não decide neste workflow. (pedido-rollout §2) | por aplicar |
| `compras` | internal | `group:chefias` | — | Vê apenas os seus casos (sem concessão) | — |
| `compras` | internal | `group:compras` | — | Vê apenas os seus casos (sem concessão) | — |
| `compras` | internal | `group:financas` | — | Vê apenas os seus casos (sem concessão) | — |
| `compras` | internal | `group:direccao_geral` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `compras` Compras [team]: Equipa piloto (vaga 1). Executa a consulta ao mercado e a emissão da ordem de compra em cada pedido.. Membros propostos: Responsável de Compras, Técnico de Compras
- `dono_processo_compras` Responsável do processo de Compras [role]: Dono do desenho do workflow de Compras: decide as regras (adjudicação, segregação), revê o piloto e autoriza a publicação. Não é administrador do Provia.. Membros propostos: Responsável do processo de Compras (a nomear)
- `chefias` Chefias de departamento [team]: Decidem sobre a necessidade de cada pedido de compra do seu departamento.. Membros propostos: Chefe de departamento (um por departamento requerente)
- `financas` Finanças [team]: Valida o cabimento orçamental e regista o pagamento. Alias possíveis: Direcção Financeira, DAF (confirmar o nome usado na organização).. Membros propostos: Director financeiro, Técnico de contabilidade
- `direccao_geral` Direcção Geral [team]: Adjudica a proposta seleccionada segundo a regra que a organização definir (valor, categoria ou risco). A regra não está codificada: fica na descrição da acção depois da decisão D4.. Membros propostos: Director geral
- `requerentes_piloto` Requerentes do piloto de Compras [container]: Grupo de permissão sem acções próprias: reúne os colaboradores dos departamentos-piloto autorizados a iniciar pedidos de compra durante a vaga 1. Na vaga 2 entram os membros de Recursos Humanos; no fim do piloto a lista deixa de ser necessária e a organização inteira inicia pedidos.. Membros propostos: Colaboradores dos departamentos-piloto (a nomear, decisão D7)
- `rh` Recursos Humanos [team]: Equipa da vaga 2. Entra primeiro como requerente no workflow de Compras e depois como dona do seu próprio primeiro processo (a escolher, decisão D2).. Membros propostos: Director de Recursos Humanos, Técnico de Recursos Humanos
- `dono_processo_rh` Responsável do processo de Recursos Humanos [role]: Dono do desenho do primeiro workflow de RH (vaga 2). Placeholder até a decisão D2.. Membros propostos: Responsável do processo de RH (a nomear)
- `admin_workflows` Administradores de workflows [role]: Detém admin nos workflows do projecto (conceder e revogar acessos, arquivar). Não decide nem executa acções em nenhum workflow. Distinto dos Owners/Admins da organização Provia, que são papéis da conta e não grupos.. Membros propostos: Administrador Provia principal (a nomear, decisão D8), Administrador Provia suplente (a nomear, decisão D8)

## Sinalizações de grupos

- `compras`: Responsável sem nome nas fontes. A equipa é nomeada no pedido, mas nenhum membro foi identificado por nome ou email.
- `dono_processo_compras`: Responsável sem nome nas fontes. O pedido não nomeia o dono do processo. Placeholder até a decisão D1.
- `dono_processo_compras`: Actor de pessoa única: definir substituto. Um dono único; registar delegado na decisão D1.
- `chefias`: Responsável sem nome nas fontes. Actor assumido de um processo de compras; o SOP deve confirmar quem aprova a necessidade.
- `chefias`: Segregação de funções: confirmar responsáveis distintos. Par requerente/chefia: quando o requerente é a própria chefia, não pode aprovar o próprio pedido (decisão D3).
- `financas`: Responsável sem nome nas fontes. Actor assumido; o SOP deve confirmar a intervenção de Finanças.
- `financas`: Segregação de funções: confirmar responsáveis distintos. Par Compras/Finanças: quem adjudica e emite a ordem (Compras) não regista o pagamento (Finanças). Manter dois grupos.
- `direccao_geral`: Actor de pessoa única: definir substituto. Uma pessoa; propõe-se grupo para que a adjudicação sobreviva a ausências. Delegado a nomear (decisão D5).
- `direccao_geral`: Responsável sem nome nas fontes. Actor assumido; o SOP deve confirmar.
- `requerentes_piloto`: Requerente: usa o criador do caso. Os requerentes iniciam o caso; as suas acções usam assigneeRef: creator. O grupo existe só para a lista de arranque do gatilho manual durante o piloto.
- `requerentes_piloto`: Responsável sem nome nas fontes. Os departamentos-piloto não foram nomeados (decisão D7).
- `rh`: Responsável sem nome nas fontes. A equipa é nomeada no pedido, mas nenhum membro foi identificado. Ainda não tem workflow próprio: a advertência «não possui acções» é esperada até à vaga 2.
- `dono_processo_rh`: Responsável sem nome nas fontes. Não nomeado no pedido (decisão D2).
- `dono_processo_rh`: Actor de pessoa única: definir substituto. Um dono único; registar delegado na decisão D2.
- `admin_workflows`: Responsável sem nome nas fontes. Ninguém foi nomeado para a administração (decisão D8).

## Decisões em aberto

- **D1** Quem é o responsável do processo de Compras (dono do desenho, revê o piloto e autoriza a publicação) e quem o substitui em ausência? (Dono: Direcção Geral)
- **D2** Quem é o responsável do processo de Recursos Humanos e qual é o primeiro processo de RH a modelar na vaga 2 (por exemplo admissão, férias, justificação de faltas)? (Dono: Direcção de Recursos Humanos)
- **D3** Segregação requerente/chefia: quando o requerente é a própria chefia do departamento, quem decide sobre a necessidade (chefia superior ou Direcção Geral)? (Dono: Responsável do processo de Compras)
- **D4** Qual é a regra de adjudicação (valor, categoria ou risco) que separa o que Compras fecha sozinha do que a Direcção Geral adjudica? Nenhum limiar foi codificado; a regra vai para a descrição da acção «Adjudicar a proposta seleccionada». (Dono: Responsável do processo de Compras)
- **D5** Quem é o delegado da Direcção Geral para adjudicar em ausência do director geral? (Dono: Direcção Geral)
- **D6** A equipa de Compras precisa de ver todos os pedidos em curso (concessão view, que mostra todos os casos) ou basta-lhe ver os pedidos que lhe são atribuídos? (Dono: Responsável do processo de Compras)
- **D7** Que departamentos (e que pessoas, com email) entram como requerentes no piloto da vaga 1? Sem esta lista não é possível determinar quem consegue iniciar um pedido. (Dono: Responsável do processo de Compras)
- **D8** Quem são os dois administradores de workflows (principal e suplente) e quem são os Owners/Admins da organização Provia? Confirmar que nenhum deles decide nos workflows que administra. (Dono: Direcção Geral)
- **D9** O plano Provia da organização inclui relatórios e Ask AI? As revisões de adopção assumem relatórios de casos concluídos; se não estiverem disponíveis, a medição faz-se por exportação. (Dono: Administrador Provia)
- **D10** Fornecer o procedimento de compras em vigor (SOP, política de aprovações, modelos de requisição) para substituir o esqueleto provisório de oito acções pelo desenho real. (Dono: Responsável do processo de Compras)

## Notas de configuração

- `compras`: Esqueleto provisório: as oito acções são a estrutura habitual de um pedido de compra, assumida porque nenhum SOP foi fornecido. Substituir pelo desenho de provia-workflow-designer a partir do procedimento real (decisão D10).
- `compras`: Piloto (vaga 1): a lista de arranque do gatilho manual admite só Compras e Requerentes do piloto; no fim da vaga 2 esvaziar a lista para que a concessão create_incident à organização produza efeito. A lista de arranque não é transportada pelo YAML: é configuração na UI do Provia.
- `compras`: Estratégia de atribuição dentro dos grupos (rotação, carga, primeiro a aceitar) não é transportada pelo YAML; configurar na UI e registar aqui.
- `compras`: Relatórios e Ask AI dependem do plano e das permissões da organização; confirmar antes de prometer painéis ao dono do processo (decisão D9).

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
