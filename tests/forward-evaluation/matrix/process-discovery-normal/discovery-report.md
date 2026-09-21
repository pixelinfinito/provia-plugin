# Escolha do piloto Provia — compras, admissão de trabalhadores e pedidos de TI

Data: 2026-09-21 · Contexto: empresa em Luanda, Angola · Língua: pt-AO · Modo: desligado (nenhuma leitura ou escrita na organização Provia)

## 1. O que foi fornecido e o que foi assumido

Factos confirmados pelo pedido (fonte `pedido-inicial` no manifesto):

- A empresa está em Luanda.
- Três processos correm por correio electrónico: compras, admissão de trabalhadores e pedidos de TI.

Não foi fornecido: volumes, responsáveis, procedimentos escritos, casos recentes, regras de aprovação, prazos ou queixas concretas. Tudo o que se segue sobre esses pontos é uma **comparação provisória** baseada no padrão habitual destes três processos, e cada suposição está marcada. Nenhum valor de volume, tempo ou poupança foi inventado.

Suposições declaradas:

- País Angola, moeda AOA/Kz, fuso Africa/Luanda (Luanda foi indicada; nada de legal é afirmado a partir daqui).
- «Compras» significa pedidos internos de bens ou serviços com decisão de aprovação antes da encomenda, não concursos públicos nem contratos plurianuais.
- «Admissão de trabalhadores» é o percurso interno depois da decisão de contratar (contrato, registo, acessos, equipamento), não o recrutamento.
- «Pedidos de TI» são pedidos de acesso, equipamento e suporte feitos por colaboradores à equipa de TI.

Nota sobre a sessão: o servidor Provia estava listado, mas a leitura do contexto da organização (`org_get_context`) não foi autorizada. Este trabalho ficou em modo desligado; nada foi lido nem alterado na organização (decisão D8).

## 2. Inventário: evento inicial e condição final

| Processo | Evento que inicia | Condição observável que termina | Trabalho repetível? |
| --- | --- | --- | --- |
| Compras | Um colaborador envia por e-mail um pedido de bem ou serviço | O pedido foi aprovado ou rejeitado e, se aprovado, a encomenda foi confirmada ao fornecedor (evidência: proposta aceite e nota de encomenda ou e-mail de confirmação) | Sim; cada pedido segue os mesmos passos |
| Admissão de trabalhadores | RH comunica por e-mail que uma pessoa foi contratada com data de início | A pessoa iniciou funções com contrato assinado, registos feitos, acessos e equipamento entregues (evidência: lista de verificação completa) | Sim, mas com muitas mãos (RH, TI, Finanças, chefia) |
| Pedidos de TI | Um colaborador envia um pedido à TI | O pedido foi resolvido ou recusado e o requerente foi informado (evidência: resposta final registada) | Sim; alto número de pedidos pequenos e variados |

## 3. Comparação dos candidatos

Critérios do procedimento: impacto, frequência, atraso nas passagens, lacunas de evidência, responsabilidade e esforço de implementação. Onde não há dados, a célula diz «por confirmar» e indica a decisão que o resolve.

| Critério | Compras | Admissão de trabalhadores | Pedidos de TI |
| --- | --- | --- | --- |
| Impacto no negócio | Alto: envolve dinheiro, fornecedores e prova de quem aprovou | Alto por caso, mas poucos casos; erro afecta uma pessoa no primeiro dia | Médio-baixo por caso; afecta produtividade |
| Frequência | Por confirmar (D2); em regra semanal ou mais | Por confirmar (D2); em regra a mais baixa das três | Por confirmar (D2); em regra a mais alta das três |
| Atraso nas passagens por e-mail | Aprovações presas em caixas de correio; propostas em anexos dispersos | Passagens RH → TI → Finanças sem ninguém a ver o todo | Pedidos perdidos entre muitos e-mails; sem fila visível |
| Lacunas de evidência | Quem aprovou, quando, com que propostas — difícil de reconstruir para auditoria | Que passos foram feitos para cada admissão | Quem tratou e quando fechou |
| Responsável claro | Por confirmar (D1); em regra Compras/DAF | Por confirmar; em regra RH, mas executam três áreas | Por confirmar (D6); em regra a TI |
| Esforço de implementação em Provia | Médio: uma decisão de aprovação, um tipo de entidade Fornecedor, um formulário de pedido | Médio-alto: acções paralelas em várias equipas, dados pessoais, dependências legais por verificar | Baixo: acção de intake, triagem, resolução, fecho |
| Padrões Provia que ensina | Decisão com resultados nomeados, evidência anexa, entidade reutilizável | Sub-workflows e trabalho em paralelo | Formulário de auto-serviço, prazos e filas |
| Risco de dados | Dados de fornecedor (NIF só se necessário) | Dados pessoais de trabalhadores; verificação APD necessária (D7) | Baixo |

## 4. Lista ordenada

1. **Compras — recomendado.** Maior impacto, evidência de aprovação que hoje se perde no e-mail, padrão de decisão que é o núcleo do Provia e que se reutiliza nos outros dois processos. Condição: um responsável nomeado (D1) e volume suficiente para aprender (D2).
2. **Pedidos de TI — alternativa.** Menor esforço e provavelmente maior volume; bom piloto se o objectivo for adopção rápida ou se compras ficar sem responsável. Fica em segundo porque ensina menos sobre aprovações e evidência, e porque parte deste processo (acessos e equipamento) reaparece dentro da admissão.
3. **Admissão de trabalhadores — segunda vaga.** Vale a pena, mas não como primeiro passo: poucos casos por mês para revisar em quatro a seis semanas, várias equipas a coordenar antes de a equipa conhecer a ferramenta, e dados pessoais que exigem verificação de protecção de dados antes de desenhar.

Compromisso entre velocidade e responsabilidade: a TI é o candidato mais rápido de implementar, mas o piloto não se escolhe só por velocidade. Se compras tiver responsável nomeado e pelo menos cerca de 10 casos por mês, compras é o piloto. Se não tiver responsável, ou se o volume for menor, a TI passa a piloto desde que a TI confirme responsável e não tenha já um helpdesk (D6).

## 5. Piloto proposto: Pedido de compra

**Âmbito mínimo útil**

- Entra: pedido de compra de bens ou serviços por um ou dois departamentos requisitantes (D4), do pedido à decisão e à confirmação da encomenda ao fornecedor.
- Fica de fora nesta versão: pagamento, recepção e conferência de stock, contratos, concursos, avaliação anual de fornecedores. Podem entrar em versões seguintes.
- Passos previstos para o desenho (a validar contra o procedimento real, D3): registar o pedido (formulário) → juntar proposta ou pró-forma → decidir (aprovar / rejeitar / devolver para completar) → confirmar a encomenda ao fornecedor → informar o requerente.
- Responsável: o nome resolvido em D1. Sem responsável não há piloto.
- Regras de aprovação (limites por valor, quem aprova, número de propostas) são política da empresa; entram no desenho apenas quando fornecidas por escrito (D3). Não se assume nenhum limite legal.

**Linha de base — a observar, não estimada (D5)**

Antes de desenhar, o responsável de Compras conta nos últimos 20 pedidos por e-mail:

- dias entre o pedido e a decisão;
- quantos tinham a proposta ou pró-forma anexada na primeira mensagem;
- quantos e-mails de seguimento («onde está o meu pedido?») existiram;
- quantos pedidos não têm uma decisão localizável.

**Medidas de sucesso do piloto** (comparação com a linha de base observada; sem metas numéricas até haver linha de base)

- Tempo do pedido à decisão registado no caso.
- Percentagem de casos com proposta anexada antes da decisão.
- Percentagem de decisões com resultado e comentário registados (evidência de quem aprovou e quando).
- Número de seguimentos por e-mail fora do Provia.
- Adopção: percentagem de pedidos dos departamentos do piloto que entraram pelo Provia e não por e-mail.

**Revisão**

Depois de 10 casos concluídos ou 4 semanas, o que vier primeiro: o responsável, um requerente e um aprovador revêem os casos e decidem se o âmbito alarga (mais departamentos, recepção, pagamento) ou se o desenho muda.

## 6. Decisões em aberto (manifesto `decisions[]`)

| Id | Pergunta | Responsável |
| --- | --- | --- |
| D1 | Responsável nomeado pelo piloto de compras | Direcção |
| D2 | Volumes dos últimos 3 meses nos três processos | Compras, RH e TI |
| D3 | Procedimento, modelo e regras de aprovação de compras | Compras / Director financeiro |
| D4 | Departamentos incluídos no piloto | Responsável do piloto |
| D5 | Linha de base observada nos últimos 20 pedidos | Compras |
| D6 | Responsável de TI e existência de helpdesk (alternativa) | TI |
| D7 | Passos e base de protecção de dados da admissão (segunda vaga) | RH |
| D8 | Nome, sector e tenant Provia da empresa | Implementador |

## 7. Artefactos e verificações

- `provia-project.json` — manifesto criado nesta sessão com `project.title`, a fonte `pedido-inicial` (com âncoras `contexto`, `compras`, `admissao`, `ti`) e as decisões D1–D8. Sem workflows, grupos ou tipos de entidade: são trabalho do desenho seguinte.
- `project.html` — mapa do projecto gerado a partir do manifesto.
- `setup.md` — handover gerado; lista as 8 decisões pendentes.
- Verificação executada: `node scripts/build-project-map.mjs provia-project.json --check` → 0 workflows, 0 grupos, 8 itens pendentes, 0 avisos. Esta verificação cobre a forma do manifesto e as referências cruzadas; não valida este relatório nem a escolha de negócio.
- Referências do produto usadas: `provia-capabilities.md` (tipos de acção, decisões com resultados nomeados, formulários fora do YAML), `countries/angola.md` (terminologia e limites de aprovação como política, não lei), `project-manifest.md`.

Nada foi criado, publicado ou alterado no Provia. A adequação do piloto fica decidida quando D1 e D2 tiverem resposta.
