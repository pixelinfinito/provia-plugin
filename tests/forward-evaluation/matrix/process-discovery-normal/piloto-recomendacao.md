# Escolha de piloto Provia — empresa em Luanda

País: Angola · Idioma: pt-AO · Moeda de referência: AOA/Kz · Fuso: Africa/Luanda

## O que foi fornecido e o que é suposto

Nenhum documento (SOP, exportação, registo) foi anexado — apenas a descrição, em conversa, de três processos tratados por correio electrónico. Não foram fornecidos volumes, tempos de ciclo, responsáveis nomeados ou queixas concretas. Este relatório assume:

- Uma PME/empresa de média dimensão em Angola, sem sistema estruturado (tudo por e-mail).
- Nenhum dos três processos tem hoje registo estruturado, aprovações rastreáveis ou visibilidade de atrasos — todos partem do mesmo ponto (caixa de correio).

Estas suposições estão marcadas como tal; os volumes reais e os donos nomeados ficam como decisões em aberto (`provia-project.json` → `decisions[]`, D1–D4).

## Os três processos

| Processo | Evento de início | Condição de fim | Envolvidos |
| --- | --- | --- | --- |
| Compras | Pedido de compra interno | Ordem de compra emitida (ou pedido recusado) | Requerente, Compras, Direcção Financeira, fornecedor |
| Admissão de trabalhadores | Decisão de contratação | Novo colaborador operacional (documentação, acessos, posto de trabalho) | RH, TI, gestor directo, novo colaborador |
| Pedidos de TI | Pedido de equipamento/acesso/suporte | Pedido resolvido e confirmado pelo requerente | Requerente, equipa de TI |

## Comparação (qualitativa, sem inventar volumes)

| Critério | Compras | Admissão de trabalhadores | Pedidos de TI |
| --- | --- | --- | --- |
| Frequência típica | Alta a moderada (recorrente) | Tipicamente baixa (liga-se ao ritmo de contratação) | Tipicamente alta (diária/semanal) |
| Nº de áreas envolvidas | 3+ (requerente, Compras, Financeira, fornecedor externo) | 3+ (RH, TI, gestor, novo colaborador) | 1–2 (requerente, TI) |
| Impacto por caso quando corre mal | Alto (exposição financeira, ausência de registo de aprovação) | Alto (colaborador sem acessos/equipamento no primeiro dia) | Moderado (produtividade, sem exposição financeira directa) |
| Visibilidade actual (hoje, por e-mail) | Baixa — cotações e aprovações dispersas em threads | Baixa — tarefas paralelas sem ponto único de acompanhamento | Baixa — pedidos sem fila, prioridade ou registo de conclusão |
| Dono provável | Responsável de Compras ou Direcção Financeira | Recursos Humanos, com dependência de TI e gestor | Responsável de TI |
| Complexidade de desenho inicial | Média–alta (aprovação com limiar, cotações de fornecedores, entidade "fornecedor") | Alta (várias sub-tarefas paralelas entre departamentos) | Baixa (fluxo linear pedido → triagem → execução → confirmação) |
| Casos reais esperados num piloto de 4 semanas | Depende do volume (a confirmar — D3) | Provavelmente poucos, salvo contratação activa (a confirmar — D4) | Provavelmente vários por semana (a confirmar — D1) |

## Recomendação: Pedidos de TI

Piloto proposto: **gestão de pedidos de TI** (equipamento, acessos, suporte técnico), com um único departamento dono (TI) e um fluxo linear.

Porquê, à luz do que separa estes três candidatos:

1. **Fronteira de responsabilidade mais simples.** Compras e Admissão dependem de pelo menos três áreas a coordenar-se por e-mail; Pedidos de TI tem essencialmente um dono (TI) a receber e a fechar o pedido. Menos coordenação entre departamentos no primeiro piloto reduz o risco de o piloto falhar por razões organizacionais, não técnicas.
2. **Ciclo de aprendizagem mais rápido.** Um processo com cadência tipicamente alta gera casos reais em poucos dias, permitindo rever o desenho depois de várias execuções completas ainda dentro de um piloto curto — ao contrário de Admissão, cuja cadência depende do ritmo de contratação e pode não gerar casos suficientes num piloto de 4 semanas (decisão D4 em aberto).
3. **Risco contido.** Um erro de desenho num pedido de TI é barato de corrigir (sem exposição financeira nem impacto directo na experiência de um novo colaborador no primeiro dia). Isto é uma vantagem para um primeiro piloto, mesmo sabendo que Compras e Admissão têm, cada uma, impacto mais alto por caso.
4. **Lacuna de evidência clara.** Hoje, um pedido de TI feito por e-mail não tem fila, prioridade nem confirmação registada de conclusão — o ganho de trazê-lo para o Provia é imediatamente visível ao requerente e à equipa de TI.

Isto é uma recomendação provisória: se a Direcção confirmar que o volume mensal de Compras é elevado e o limiar de aprovação já está definido (D3), Compras é um candidato igualmente forte, com maior impacto por caso — mas exige desenhar aprovação com limiar e gestão de cotações de fornecedores, o que é mais trabalho de desenho antes do primeiro caso real. Recomenda-se tratar Compras como segundo piloto natural (D5).

Admissão de trabalhadores tem o impacto mais alto por caso (um colaborador sem acessos no primeiro dia é visível e caro), mas a dependência de três áreas e a cadência normalmente mais baixa tornam-no um piloto mais difícil de aprender rapidamente. Não é descartado — é adiado até haver volume de contratação e clareza sobre coordenação entre RH/TI/gestor.

## Âmbito mínimo útil do piloto

- Incluir: pedidos de equipamento (ex.: portátil, periférico), pedidos de acesso (ex.: conta, permissão a sistema) e pedidos de suporte técnico simples.
- Excluir do piloto inicial: projectos de TI de âmbito alargado (ex.: novo sistema, mudança de infraestrutura) — estes não são "pedidos" repetíveis no mesmo padrão e devem seguir outro processo.
- Fluxo mínimo: pedido → triagem/atribuição → execução → confirmação do requerente. Sem esta confirmação final, não há evidência de que o pedido foi de facto resolvido — é o ganho central do piloto.

## Dono e revisão

- Dono proposto: responsável da equipa de TI (nome concreto a confirmar — decisão D2).
- Revisão do piloto: após um número suficiente de casos concluídos para observar o fluxo completo pelo menos uma dezena de vezes (número exacto de casos e data de revisão dependem do volume real — decisão D1). Não fixar uma data de revisão antes de confirmar a cadência.

## Medidas de sucesso (linha de base vs. estimativa)

- **A confirmar como linha de base observada** (não estimar): tempo médio actual entre pedido por e-mail e resolução; número de pedidos "perdidos" ou esquecidos em threads de e-mail; existência ou não de qualquer registo de conclusão hoje.
- **Medidas a acompanhar no piloto**: tempo entre abertura e confirmação do requerente; percentagem de pedidos com atribuição registada num prazo definido pela equipa de TI; número de pedidos sem resposta durante mais de X dias úteis (X a definir pela equipa de TI, não um valor inventado aqui).

## Questões em aberto (registadas em `provia-project.json` → `decisions[]`)

- D1 — Volume e tempo de ciclo actual de Pedidos de TI.
- D2 — Nome do responsável que assume o piloto de TI.
- D3 — Volume, valor médio e limiar de aprovação (se já existir, mesmo informal) de Compras.
- D4 — Volume de admissões, para avaliar se gera casos suficientes num piloto curto.
- D5 — Se Compras deve ser o segundo piloto após TI.

## Ficheiros produzidos

- `provia-project.json` — manifesto do projecto (`provia-project/v1`), com as três fontes registadas em `sources[]`, as questões acima em `decisions[]` e `project.title` a apontar para o piloto escolhido.
- `piloto-recomendacao.md` — este relatório.

Nenhuma verificação de ficheiro Provia, publicação ou configuração de organização foi executada — este é um trabalho de desenho desligado (modo `disconnected`), sem ligação a um servidor `provia-implementer`.
