# Pedido de compra — diagnóstico Junho/Agosto 2026: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização |
| compras | Pedido de compra | Registar o actor no registo canónico de grupos ou mapeá-lo para uma chave existente (`decisor-pedido`) |
| compras | Pedido de compra | Registar o actor no registo canónico de grupos ou mapeá-lo para uma chave existente (`confirmador-orcamento`) |
| compras / confirmar-orcamento | Confirmar disponibilidade orçamental | Definir o responsável; a acção não tem dono no desenho |
| compras / confirmar-orcamento | Confirmar disponibilidade orçamental | Definir o prazo; o desenho não propõe `due` |
| compras / decidir | Decidir sobre o pedido | Definir o responsável; a acção não tem dono no desenho |
| compras / decidir | Decidir sobre o pedido | Configurar o prazo à mão em cada caso; a fonte fixa um prazo que `due` não exprime. countdown: prazo 2 dias (instantâneo COMP-201; tipo de dia não indicado) |
| compras / registar-encomenda | Registar a encomenda | Atribuir o grupo à acção depois de o grupo existir (`compras`) |
| compras / registar-encomenda | Registar a encomenda | Configurar o prazo à mão em cada caso; a fonte fixa um prazo que `due` não exprime. countdown: prazo 3 dias (instantâneo COMP-207; tipo de dia não indicado) |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `compras` | internal | apenas criador e administradores da organização (`default: creator_only`) | — | Valor de preenchimento para o verificador. As exportações não indicam quem vê ou abre o workflow; o acesso real do workflow publicado tem de ser lido no Provia do cliente antes de qualquer alteração (ver D6). | — |
| `compras` | internal | `group:compras` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `compras` Compras [team]: Equipa indicada como responsável por «Registar a encomenda» no instantâneo de 2026-09-18. Composição não fornecida.

## Sinalizações de grupos

- `compras`: Responsável sem nome nas fontes. Nenhum membro identificado nas exportações; o grupo existe no Provia do cliente com este nome, mas a sua composição não foi fornecida.

## Decisões em aberto

- **D1** Quem é o responsável por omissão de «Decidir sobre o pedido» e quem o substitui em ausência? COMP-201 está há 8 dias úteis nesta acção sem responsável (prazo 2 dias) e o tempo médio nesta acção passou de 3,1 para 6,4 dias entre Junho e Agosto de 2026. (Dono: Dono do processo de compras (a nomear pela Direcção))
- **D2** Aprovar a mudança proposta: definir responsável por omissão (grupo) e substituto para «Decidir sobre o pedido» e medir, nos casos concluídos em Outubro 2026, o tempo médio nesta acção (meta: ≤ 3,1 dias, nível de Junho) e a percentagem de casos com esta acção sem responsável no momento da activação (meta: 0%). (Dono: Dono do processo de compras (a nomear pela Direcção))
- **D3** Qual é o motivo das 7 devoluções de Agosto de 2026 (36,8% dos casos, contra 16,7% em Junho)? As exportações não trazem o motivo nem a acção para onde o caso regressou; é necessário exportar os comentários e o resultado da decisão desses 7 casos. (Dono: Compras)
- **D4** Confirmar as definições das métricas exportadas: o «tempo médio em Decidir sobre o pedido» (3,1 e 6,4 dias) é em dias úteis como o tempo de ciclo? Junho e Agosto foram executados na mesma versão publicada do workflow? Qual é a sequência real das acções (Confirmar disponibilidade orçamental → Decidir → Registar a encomenda foi assumida)? (Dono: Administrador do Provia na organização)
- **D5** «Confirmar disponibilidade orçamental» tem prazo e responsável por omissão configurados? O instantâneo de COMP-204 não os indica, pelo que não é possível dizer se o caso está atrasado. (Dono: Administrador do Provia na organização)
- **D6** Quem vê e quem abre o workflow «Pedido de compra» no Provia do cliente? O acesso real não consta das exportações; a entrada do manifesto usa creator_only apenas como preenchimento e tem de ser substituída pelo acesso lido antes de planear qualquer alteração. (Dono: Administrador do Provia na organização)

## Notas de configuração

- `compras`: Esta entrada foi reconstruída a partir das exportações agregadas e do instantâneo de casos abertos; não é o desenho publicado. Só as três acções observadas estão listadas e a sua sequência real não foi fornecida (ver D4).
- `compras`: Não foi possível ler o Provia do cliente nesta sessão (o servidor MCP não foi autorizado); o diagnóstico usa apenas os dados fornecidos.
- `compras`: Proposta de mudança (D2): atribuir responsável por omissão a «Decidir sobre o pedido», com substituto nomeado, e medir em Outubro 2026. A alteração do workflow publicado com casos em curso deve ser planeada com provia-workflow-change.

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
