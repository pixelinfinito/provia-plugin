# Plano de adopção Provia — Compras (piloto) e Recursos Humanos (expansão): Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

Nada pendente.

## Grupos a criar

- `administracao_ti` Administração da organização Provia (TI/Sistemas): Administra a organização Provia: cria utilizadores, atribui licenças, mantém integrações. Não é dono de processo nem responsável por acções.. Membros propostos: Responsável de TI/Sistemas (a nomear)
- `dono_processo_compras` Dono do processo de Compras: Aprova o desenho do workflow de Compras, define prioridades do piloto e os indicadores de adopção; não executa acções operacionais do processo.. Membros propostos: A nomear (ex.: Director de Compras/Operações)
- `compras` Equipa de Compras: Regista pedidos de compra, obtém cotações de fornecedores e executa as compras aprovadas.. Membros propostos: Técnico de compras (a nomear)
- `aprovacao_financeira` Aprovação financeira: Revê e aprova ou rejeita pedidos de compra face ao orçamento e à política interna.. Membros propostos: Responsável financeiro (a nomear)
- `direccao_geral` Direcção Geral: Aprova compras acima do limiar delegado à Aprovação financeira e decide excepções.. Membros propostos: Director Geral (a nomear)
- `dono_processo_rh` Dono do processo de Recursos Humanos: Aprova o desenho dos workflows de RH na fase 2 e define os indicadores de adopção da expansão.. Membros propostos: A nomear (ex.: Director/Responsável de RH)
- `recursos_humanos` Equipa de Recursos Humanos: Processa pedidos de RH (por exemplo admissão, férias e ausências) uma vez iniciada a fase 2.. Membros propostos: Técnico de RH (a nomear)
- `chefias` Chefias de departamento: Aprovam pedidos submetidos pelos membros da sua equipa, tanto em Compras (requisitantes) como em RH (férias e ausências) uma vez alargado a RH.. Membros propostos: Chefe de departamento (por departamento, a nomear)

## Sinalizações de grupos

- `administracao_ti`: Responsável sem nome nas fontes. Nenhum organograma ou documento foi fornecido; falta nomear quem administra a organização Provia.
- `dono_processo_compras`: Responsável sem nome nas fontes. Nenhuma fonte identifica o responsável pelo processo de Compras; é uma condição para iniciar o piloto.
- `compras`: Segregação de funções: confirmar responsáveis distintos. A mesma equipa não deve pedir e aprovar a compra; ver grupo aprovacao_financeira.
- `aprovacao_financeira`: Segregação de funções: confirmar responsáveis distintos. Mantido separado da equipa de Compras para evitar que quem pede também aprove.
- `direccao_geral`: Actor de pessoa única: definir substituto. Papel tipicamente ocupado por uma única pessoa; falta nomear um substituto para ausências.
- `dono_processo_rh`: Responsável sem nome nas fontes. Nenhuma fonte identifica o responsável pelo processo de RH; é uma condição para iniciar a fase 2.
- `recursos_humanos`: Segregação de funções: confirmar responsáveis distintos. Quando um membro da própria equipa de RH submete um pedido (ex.: férias), a aprovação não pode ficar com a equipa de RH; ver decisão sobre auto-aprovação.
- `chefias`: Responsável sem nome nas fontes. Sem organograma, não é possível listar as chefias por departamento.

## Decisões em aberto

- **D1** Quem é o dono do processo de Compras, responsável por aprovar o desenho do piloto e os seus indicadores? (Dono: Direcção Geral)
- **D2** Quem é o dono do processo de Recursos Humanos para a fase 2 da adopção? (Dono: Direcção Geral)
- **D3** Qual o valor a partir do qual uma compra deixa de ser aprovada pela Aprovação financeira e passa a exigir aprovação da Direcção Geral? (Dono: Direcção Geral / Direcção Financeira)
- **D4** Quem substitui o Director Geral nas aprovações de compras durante ausências? (Dono: Direcção Geral)
- **D5** Quem administra a organização Provia (utilizadores, licenças, integrações) — TI ou outro responsável? (Dono: Direcção Geral)
- **D6** Quando um membro da equipa de RH submete o seu próprio pedido (ex.: férias), quem aprova para evitar auto-aprovação? (Dono: dono_processo_rh)
- **D7** Quais são as chefias de departamento nomeadas (nomes/emails), para preencher os membros do grupo chefias? (Dono: Direcção Geral)

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
