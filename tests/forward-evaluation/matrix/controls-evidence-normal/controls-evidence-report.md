# Revisão de controlos e evidências: procedimento de compras

Data: 2026-09-21. Autor: provia-controls-evidence (plugin Provia). Contexto: Angola, assumido como ponto de partida provisório; resposta em pt-AO. Modo: desligado (nada foi lido nem alterado na organização Provia).

## 1. O que foi recebido

Nada. O pedido refere "o nosso procedimento de compras" e "estes registos", mas o directório de trabalho estava vazio: sem procedimento, sem exportação de casos, sem YAML do workflow, sem `provia-project.json` anterior.

O conector Provia está instalado no anfitrião (a ferramenta `org_get_context` aparece na lista), mas a chamada foi recusada por falta de permissão nesta sessão. Não li workflows, grupos nem casos da organização. Se a organização quiser que o desenho actual seja lido directamente, a permissão tem de ser concedida na sessão interactiva ou nas definições do conector em claude.ai.

## 2. Pressupostos declarados

1. País e jurisdição: Angola, provisório. Nenhuma conclusão legal é feita neste relatório e nenhuma fonte legal foi consultada. A revisão fica limitada à política interna, como a convenção do skill exige quando as fontes legais faltam. E, neste caso, também a política interna falta.
2. O procedimento de compras é um documento interno (SOP ou política). Tudo o que aparece na matriz abaixo como "requisito" é uma recomendação de prática, não uma cláusula do vosso procedimento nem uma obrigação legal, até que o documento seja fornecido e citado.
3. Limiares de aprovação, número mínimo de cotações, prazos e períodos de retenção são dados da política. Não estão inventados aqui e a matriz deixa-os em branco.

## 3. O que este relatório pode e não pode afirmar

Não pode indicar as evidências em falta. Para isso é preciso cruzar dois ficheiros que não existem no directório: o procedimento (para saber que evidência cada passo exige) e os registos (para verificar se essa evidência existe em cada caso).

Pode entregar a estrutura que a revisão vai usar quando os ficheiros chegarem: a matriz requisito / acção / evidência já com os pontos de controlo habituais de um processo de compras, o tipo de prova que o Provia produz para cada um, e a lista exacta de campos que a exportação de casos precisa de trazer. Assim, a segunda passagem é preencher e comparar, não desenhar.

## 4. Controlo desenhado e prova de operação

Dois conceitos distintos, que a revisão final vai tratar em colunas separadas.

Um controlo desenhado existe quando o workflow tem a acção, o responsável e a evidência exigida escritos na descrição. Prova-se com o YAML ou o manifesto.

Um controlo operado existe quando um caso concreto mostra a acção concluída por alguém com competência, na data certa, com a evidência anexada. Prova-se com os registos do caso.

Uma evidência em falta num caso não prova que a actividade não aconteceu; prova que o caso não a documenta. A constatação certa é "sem prova no registo", não "não foi feito". A remediação também é diferente: se falta o controlo no desenho, muda-se o workflow; se falta a prova nos casos, muda-se a instrução da acção ou a disciplina de quem a executa.

## 5. Matriz requisito / acção / evidência (modelo a confirmar)

Origem de todas as linhas: recomendação de prática, a substituir pela secção do procedimento quando este for fornecido. Os `localId` são propostos; quando existir um workflow no manifesto, substituem-se pelos identificadores reais. Os estados ficam em branco porque não há registos.

| # | Requisito (a confirmar com o procedimento) | Origem | Acção Provia proposta (`localId`, tipo) | Decisão / dados exigidos | Evidência de operação que o Provia regista | Estado nos registos |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Todo o pedido de compra é formalizado, com descrição, quantidade, justificação e centro de custo | Recomendação | `registar-pedido` (Form Fill ou Standard, criador do caso) | Metadados do caso preenchidos; formulário de pedido | Resposta ao formulário, autor e data de criação do caso | por verificar |
| R2 | Existe verificação de orçamento ou cabimento antes da consulta ao mercado | Recomendação | `verificar-orcamento` (Standard, Finanças) | Rubrica orçamental, saldo disponível | Comentário com a rubrica e o valor, ou ficheiro anexado; acção concluída por membro do grupo de Finanças | por verificar |
| R3 | Consulta ao mercado com o número mínimo de propostas que a política fixar | Recomendação | `recolher-propostas` (Form Fill com respostas múltiplas, Compras) | Número mínimo de propostas (valor da política, não fornecido) | Uma resposta por fornecedor, cada uma com o ficheiro da proposta; contagem de respostas por caso | por verificar |
| R4 | Avaliação comparativa e selecção fundamentada do fornecedor | Recomendação | `avaliar-propostas` (Standard, Compras) | Critério de selecção aplicado | Mapa comparativo anexado; comentário com a justificação da escolha | por verificar |
| R5 | Aprovação por quem tem alçada para o valor | Recomendação | `decidir-aprovacao` (Decision, grupo de chefias ou direcção conforme a política) | Limiares de alçada (valor da política, não fornecido) | Resultado nomeado da decisão, autor, data; comentário obrigatório na rejeição | por verificar |
| R6 | Segregação de funções: quem pede não aprova nem confirma a recepção | Recomendação | Desenho: `assigneeRef` distintos em R1, R5 e R8 | Grupos separados; nenhum grupo com `admin` a decidir no mesmo workflow (regra 6 do acesso) | Criador do caso diferente do decisor e do receptor em cada registo | por verificar |
| R7 | Emissão de ordem de compra ou contrato após aprovação | Recomendação | `emitir-ordem-compra` (Standard, Compras) | Número da ordem de compra em metadados | Ficheiro da ordem anexado; campo preenchido; acção concluída depois de R5 (sequência obrigatória) | por verificar |
| R8 | Recepção e conferência do bem ou serviço | Recomendação | `confirmar-recepcao` (Standard, área requisitante ou armazém) | Guia de remessa ou auto de recepção | Ficheiro anexado; comentário de conformidade ou não conformidade | por verificar |
| R9 | Conferência da factura contra ordem e recepção antes do pagamento | Recomendação | `conferir-factura` (Standard, Finanças) | Factura, ordem de compra e recepção coincidem | Factura anexada; comentário com a referência da ordem; acção só disponível depois de R8 | por verificar |
| R10 | Tratamento de excepções (compra urgente, fornecedor único, valor acima da alçada) | Recomendação | Resultados da decisão em R5 (continuar, devolver a uma acção, cancelar) e acção `justificar-excepcao` | Justificação obrigatória | Resultado da decisão e comentário; caso devolvido a R3 ou R4 quando aplicável | por verificar |
| R11 | Retenção dos registos do processo | Política ou lei (não fornecida) | Não é uma acção; é configuração de arquivo | Período de retenção (não inventado) | Existência do caso e dos ficheiros após o período | não avaliável sem fonte |

Notas sobre o que o Provia consegue provar, com base na referência de capacidades do plugin:

- Acções de tipo Decision têm resultados nomeados (continuar, cancelar, voltar a uma acção, iniciar outro workflow). Não há encaminhamento automático por valor; a alçada é explicada a um decisor humano na descrição da acção, não a um campo numérico.
- A execução sequencial impede que uma acção comece antes da anterior. Isso é prova de ordem, não prova de qualidade.
- Ficheiros, páginas e comentários são a evidência anexável a um caso. Form Fill com respostas múltiplas mantém cada proposta separada, o que serve para contar cotações.
- Um registo de auditoria mostra quem fez o quê e quando. Sozinho, não satisfaz um requisito que exija um documento concreto (uma factura, uma guia). A revisão não vai tratar o rasto de auditoria como prova universal.

## 6. O que a exportação de casos precisa de trazer

Para cada caso do período a rever:

- Identificador do caso, workflow e versão activa quando foi criado, data de criação, criador.
- Por acção: `localId` ou nome, responsável atribuído, quem concluiu, data de activação, data de conclusão, prazo.
- Por decisão: resultado escolhido, autor, data, comentário.
- Comentários com autor e data.
- Lista de ficheiros anexados, com nome e acção a que estão ligados.
- Respostas a formulários (Form Fill), uma linha por resposta.
- Valores dos metadados do caso (valor, centro de custo, número da ordem de compra, fornecedor).

Sem a lista de ficheiros e as respostas de formulários, só é possível verificar sequência e datas, não a existência dos documentos.

## 7. Constatações

F1. A revisão não pôde ser executada: nenhum procedimento e nenhum registo foram fornecidos no directório de trabalho. Nenhuma evidência em falta é indicada neste relatório; qualquer lista seria inventada.

F2. A leitura da organização Provia através do conector não foi autorizada nesta sessão. O desenho actual do workflow de compras (se existir) não foi verificado.

F3. Jurisdição por confirmar. Angola foi assumida provisoriamente. Nenhum instrumento legal foi consultado, citado ou verificado.

## 8. Remediação proposta e responsáveis

Estes itens estão registados como decisões abertas D1 a D4 no `provia-project.json`.

| Decisão | O que fazer | Responsável |
| --- | --- | --- |
| D1 | Fornecer o procedimento de compras em vigor, com versão, data de entrada em vigor e secções numeradas | Responsável de Compras |
| D2 | Fornecer a exportação de casos do período a rever com os campos da secção 6 | Responsável de Compras |
| D3 | Confirmar o país e indicar se há requisitos legais ou regulamentares a incluir, com a fonte | Direcção Financeira |
| D4 | Fornecer o YAML exportado ou o manifesto do workflow de compras, ou autorizar a leitura pelo conector Provia | Implementador Provia |

## 9. Verificações executadas e ficheiros produzidos

- `provia-project.json`: criado, com as duas fontes referidas mas não fornecidas e as decisões D1 a D4. Verificado com `build-project-map.mjs --check`: 0 workflows, 0 grupos, 4 itens pendentes, 0 avisos.
- `project.html`: mapa do projecto gerado a partir do manifesto.
- `setup.md`: entrega gerada a partir do manifesto; lista apenas as decisões abertas.
- Este relatório não é validado por nenhum script; a verificação do manifesto não cobre o Markdown.

Referências do produto utilizadas: `references/provia-capabilities.md`, `references/project-manifest.md`, `references/workflow-access.md`, `references/country-context.md`, `references/countries/angola.md` do plugin. Nenhuma fonte externa ou legal foi consultada.

Não certifico conformidade com nada. Este documento prepara a comparação; não a substitui.
