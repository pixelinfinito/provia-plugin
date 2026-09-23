# Escolha do processo piloto

Empresa em Luanda · 23-09-2026 · País: Angola · Língua: pt-AO · Fuso: Africa/Luanda · Moeda: AOA (Kz)

## 1. O que foi fornecido e o que foi assumido

Confirmado pelo cliente (fonte `briefing-inicial`):

- A empresa tem sede em Luanda.
- Três processos correm hoje por correio electrónico: compras, admissão de trabalhadores e pedidos de TI.
- O pedido é escolher um piloto.

Não foi fornecido: sector, dimensão, número de colaboradores, procedimentos escritos, volumes, responsáveis nomeados, limites de aprovação, prazos de serviço nem qualquer exportação de casos. Por isso esta é uma **comparação provisória**: nenhum valor de base foi observado, e nenhum número abaixo é uma medição.

Pressupostos declarados, assumidos para poder avançar sem esperar por respostas:

1. Angola é a jurisdição aplicável, porque a empresa está em Luanda. Nada aqui depende de uma disposição legal concreta; onde dependeria (admissão de trabalhadores), está registado como questão em aberto.
2. Os três processos são trabalho organizacional repetido, não tarefas pontuais. O padrão descrito (pedidos por correio electrónico) só faz sentido se se repetirem.
3. Existe pelo menos uma pessoa responsável por TI, por compras e por recursos humanos, ainda que sem nome fornecido.
4. O piloto é a primeira utilização do Provia pela equipa, portanto o critério de aprendizagem pesa tanto como o critério de impacto.

Não foi lido nem alterado nada numa organização Provia. O servidor `Provia` aparece listado nesta sessão, mas a autorização não foi concedida, logo `org_get_context` não chegou a correr: não há grupos, workflows nem utilizadores reais verificados neste trabalho.

## 2. Os três candidatos

Um processo só é modelável quando se sabe o que o inicia e qual a condição observável que o termina. Esta é a leitura proposta, a confirmar com quem faz o trabalho:

| Candidato | Evento que inicia | Condição observável de fim |
| --- | --- | --- |
| Pedidos de TI | Um colaborador envia um pedido de acesso, de equipamento ou comunica uma avaria | O pedido está resolvido e o requerente confirmou, ou foi encerrado com motivo registado |
| Compras | Um colaborador manifesta uma necessidade de bem ou serviço | Bem ou serviço recebido e factura conferida, ou pedido recusado com motivo registado |
| Admissão de trabalhadores | Um candidato aceita a proposta | Trabalhador com contrato assinado, registos efectuados e acessos atribuídos |

O fim da admissão é o que exige mais cuidado: «registos efectuados» pressupõe obrigações legais que não foram fornecidas nem verificadas (D8).

## 3. Comparação

Nenhuma célula desta tabela é uma medição. São indicações de padrão, a substituir por dados reais assim que existirem.

| Critério | Pedidos de TI | Compras | Admissão de trabalhadores |
| --- | --- | --- | --- |
| Frequência | A mais alta dos três (indicação, por confirmar) | Intermédia (indicação) | A mais baixa (indicação) |
| Impacto por caso | Baixo a médio: tempo perdido do colaborador | Alto: dinheiro, fornecedores, orçamento | Alto: pessoa, contrato, conformidade |
| Atraso nas passagens de mão | Entre requerente e TI; poucas passagens | Requerente → chefia → finanças → fornecedor; muitas | RH → chefia → TI → finanças; muitas, com prazos externos |
| Falhas de evidência actuais | Quem pediu, quando, o que foi feito, se ficou resolvido | Quem aprovou e com que fundamento | Que documentos foram recolhidos e quando |
| Responsabilidade | Provavelmente uma só equipa e um só responsável | Repartida entre requerente, chefia e finanças | Repartida entre RH, chefia e TI |
| Esforço de implementação | O menor: um departamento, poucas decisões | Médio a alto: exige política de aprovação escrita | O maior: dados pessoais, obrigações legais, vários departamentos |
| Risco se o piloto correr mal | Baixo: volta-se ao correio electrónico | Alto: pode travar pagamentos e fornecedores | Alto: pode afectar a entrada de um trabalhador |
| Casos disponíveis para aprender em 4 semanas | Suficientes (indicação) | Poucos mas úteis | Provavelmente insuficientes |
| Bloqueio que impede começar hoje | Nome do responsável (D1) | Limites de aprovação em Kz e quem aprova (D7) | Registos legais e dados pessoais a verificar (D8) |

### Ordenação

1. **Pedidos de TI** — recomendado.
2. **Compras** — segundo, com maior retorno, mas com um bloqueio de política por resolver.
3. **Admissão de trabalhadores** — terceiro, por volume baixo e exposição legal alta.

## 4. Piloto escolhido: Pedidos de TI

### Porquê

- **Há casos que cheguem para aprender.** Um piloto aprende-se com repetição. Dos três, é o único onde é plausível fechar dezenas de casos em semanas; a admissão talvez feche dois ou três.
- **Uma equipa decide.** Os pedidos de TI cabem, em regra, num departamento. Não é preciso alinhar finanças e chefias antes de desenhar o primeiro workflow.
- **Nada de irreversível está em jogo.** Se o desenho estiver errado, corrige-se e os casos voltam ao correio electrónico. Um erro em compras pode travar um pagamento; um erro na admissão afecta a entrada de uma pessoa.
- **Não há política em falta.** Compras não pode ser desenhado sem os limites de aprovação em Kz e sem saber quem aprova em cada nível, e esses valores não podem ser assumidos. TI não tem esse bloqueio: os prazos que o piloto adoptar são política interna, decidida pela empresa (D3).
- **As falhas de evidência resolvem-se por si.** Registo de quem pediu, quando, quem tratou e confirmação de fecho são exactamente o que o Provia produz sem configuração adicional.

### O que se perde com esta escolha

Compras é o processo com maior retorno financeiro e onde a falta de rasto de aprovações mais custa numa auditoria. Ao escolher TI, adia-se esse ganho. A troca é deliberada: a equipa aprende o Provia num processo barato de errar e leva essa aprendizagem para compras já com a política de aprovação definida por escrito.

**Quando esta escolha deve mudar** (registado em D9): se a Administração exigir que o piloto demonstre controlo financeiro, ou se os pedidos de TI se revelarem menos de cerca de cinco por semana, o piloto passa a Compras e D7 torna-se bloqueante antes do desenho.

### Fronteiras do piloto

O menor âmbito útil. Dentro:

- Pedidos de colaboradores já registados na empresa.
- Acessos a sistemas existentes, avarias e apoio em equipamento já existente.
- Abertura por formulário ou manualmente, uma triagem com classificação, a execução e a confirmação do requerente.
- Recusa ou encaminhamento com motivo registado.

Fora, nesta primeira fase:

- Compra de equipamento novo ou qualquer pedido com despesa: o caso encerra com encaminhamento registado para Compras (a forma exacta é D6).
- Criação de contas de novos trabalhadores: pertence à admissão, entra quando esse processo for desenhado.
- Projectos e alterações de infra-estrutura.
- Atendimento fora do horário e escalas de piquete.
- Integração com qualquer sistema externo. O piloto não precisa de chamadas HTTP nem de segredos configurados.

Estas fronteiras são para rever no fim do piloto, não para defender.

### Dono

O piloto precisa de um dono nomeado, com nome e endereço de correio electrónico, não de um departamento. Não foi fornecido nenhum nome, portanto **o piloto ainda não está pronto para arrancar**: o papel é o Responsável de TI e a nomeação está registada em D1, a cargo da Administração. O dono responde por três coisas: o desenho do workflow, as decisões em aberto da sua área e a revisão no fim.

### Medidas de sucesso

Não existe base de comparação observada. A primeira tarefa do piloto é criá-la: uma amostra das mensagens de correio electrónico das últimas semanas, para apurar quantos pedidos entram por semana e quanto tempo demoram hoje até ficarem resolvidos (D5). Sem essa amostra, o piloto só se compara consigo próprio.

Medidas a recolher a partir dos registos do Provia, desde o primeiro caso:

| Medida | Como se lê | Base |
| --- | --- | --- |
| Adopção | Pedidos abertos no Provia face aos que continuam a chegar por correio à caixa de TI | Hoje 0% |
| Tempo até à triagem | Da abertura à primeira classificação | A apurar na amostra (D5) |
| Tempo até ao fecho, por categoria | Da abertura ao fecho confirmado | A apurar na amostra (D5) |
| Fechos com confirmação do requerente | Casos fechados com confirmação registada, em percentagem | Hoje não existe evidência nenhuma |
| Pedidos sem responsável ao fim de um dia útil | Contagem | Hoje não é observável |
| Reabertura | Casos que voltam a abrir depois de fechados | Hoje não é observável |

Não se fixa aqui nenhuma meta numérica de redução de tempo: fixá-la antes de existir a base seria inventar. As metas definem-se com o dono quando a amostra de D5 estiver feita.

### Revisão

Revisão com o dono após **30 casos concluídos ou 4 semanas**, o que ocorrer primeiro. Se ao fim de 4 semanas houver menos de 15 casos concluídos, isso é em si o achado mais importante: o volume não sustenta o processo como piloto e a escolha reabre-se a favor de Compras (D9).

A revisão decide três coisas: que passos sobram ou faltam, se as categorias e os prazos se confirmam, e se o âmbito alarga a novas categorias ou avança para o processo seguinte.

## 5. Sequência proposta para os três processos

1. **Pedidos de TI** — agora. Aprendizagem rápida, risco baixo.
2. **Compras** — a seguir, mal D7 esteja resolvido. É onde está o retorno; o desenho depende de ter a política de aprovação por escrito, não de mais análise.
3. **Admissão de trabalhadores** — por último. Exige os tipos de entidade e os grupos já criados nas duas fases anteriores, e exige que D8 seja respondido com instrumentos legais verificados. A recolha de dados pessoais deve manter-se proporcional à tarefa.

## 6. Questões em aberto

Estão registadas em `provia-project.json` como `decisions[]` e listadas em `setup.md`:

| Id | Questão | Dono |
| --- | --- | --- |
| D1 | Nome e endereço do Responsável de TI que assume o piloto | Administração |
| D2 | Categorias de pedido dentro e fora do âmbito | Responsável de TI |
| D3 | Prazos de resposta e de resolução por categoria | Responsável de TI |
| D4 | Quem pode abrir um pedido: toda a organização ou só a primeira fase | Responsável de TI com a Administração |
| D5 | Quem extrai a amostra de correio electrónico que fixa a base | Responsável de TI |
| D6 | Como termina um pedido que implica despesa | Responsável de TI com a DAF |
| D7 | Compras: limites de aprovação em Kz, quem aprova, quantas propostas | Director Financeiro |
| D8 | Admissão: registos legais aplicáveis e dados pessoais admissíveis | Responsável de RH |
| D9 | Confirmação do piloto em TI, ou mudança para Compras | Administração |

D1, D2 e D3 são necessárias antes de desenhar o workflow. As restantes podem correr em paralelo com o desenho.

## 7. Estado dos artefactos

| Ficheiro | O que é | Verificação |
| --- | --- | --- |
| `provia-project.json` | Manifesto do projecto: `sources[]`, `decisions[]` e o piloto em `project.title` | `node scripts/build-project-map.mjs provia-project.json --check` correu sem erros nem avisos; 9 itens pendentes, que são as decisões em aberto |
| `project.html` | Mapa do projecto para navegar as fontes e as decisões | Gerado a partir do manifesto |
| `setup.md` | Entrega com o que falta configurar e decidir | Gerado a partir do manifesto |
| `selecao-piloto.md` | Este documento | Não é validado por nenhum script; o `--check` cobre apenas o manifesto |

Não foi desenhado nenhum workflow, não foi criado nenhum ficheiro YAML e nada foi configurado, importado ou publicado no Provia. A prontidão para publicar decide-se no Provia, por pessoa autorizada, e está muito à frente deste ponto.
