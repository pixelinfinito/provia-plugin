# Alteração aos campos obrigatórios — Pedido de compra (COMP)

## Pressupostos assumidos

O pedido não incluiu o workflow real, um export, o manifesto do projecto nem dados de incidentes activos; a directório de trabalho estava vazia. Não é oferecido servidor `provia-implementer` nesta sessão, pelo que se trabalha em **modo desligado**. País não indicado: assume-se Angola (pt-AO, Kz) a título provisório, conforme convenção do plugin.

Para poder demonstrar o método pedido — planear a alteração de campos obrigatórios com pedidos em curso — usei como linha de base ilustrativa o exemplo de formação "Pedido de compra" já incluído neste plugin (`examples/procurement/workflow.yaml`), copiado para `workflow.yaml` nesta pasta e tratado como a **versão actualmente publicada (v1)**. **Isto é um substituto, não o workflow real do utilizador.** Antes de aplicar qualquer coisa deste relatório a um ambiente real, é necessário substituir `workflow.yaml` pelo export efectivo da versão activa (em modo ligado, `workflow_export_yaml`) e confirmar os campos que o utilizador quer mesmo alterar — ver decisões D2 e D3 abaixo.

A alteração concreta demonstrada (`workflow.v2-draft.yaml`):

1. `budget_reference` ("Referência orçamental"): `required` passa de `false` para `true`.
2. `expense_category` ("Categoria da despesa"): campo novo, `select`, `required: true` (Bens/Serviços/Obras).

Nenhuma contagem real de pedidos em curso foi fornecida; o impacto abaixo é qualitativo e a contagem fica como decisão em aberto (D1).

## 1. Comparação semântica (v1 → v2, rascunho)

| Aspecto | v1 (actual) | v2 (rascunho proposto) | Efeito de negócio |
| --- | --- | --- | --- |
| `budget_reference` | Texto, opcional. Já era pedido na instrução da acção `confirmar_cabimento` ("Registar a referência do cabimento"), mas não era imposto pela plataforma. | Texto, **obrigatório**. | A instrução e a regra passam a coincidir: já não é possível gravar o caso sem a referência orçamental. Não há mudança de responsável, de rota de decisão nem de acção. |
| `expense_category` | Não existe. | Novo campo `select`, **obrigatório**, três opções (Bens/Serviços/Obras). Capturado na acção `registar` (passo 3 acrescentado ao "Como" e à "Evidência"). | Passa a exigir-se, no acto de registo, uma classificação da despesa que nunca foi pedida antes. Não existe forma de um caso criado sob a v1 "já ter" este valor. |
| Outras acções, rotas, prazos, responsáveis | — | Inalterados | `decidir`, `encomendar`, os ramos de decisão (Aprovar/Devolver/Rejeitar), os prazos (`due`) e o `assignee` de cada acção mantêm-se; só o texto do "Como"/"Evidência" de `registar` e `confirmar_cabimento` foi ajustado para reflectir os novos campos. |

Esta é uma alteração de comportamento (regras de obrigatoriedade e um novo campo de captura), não uma correcção editorial: está fora do âmbito de uma "wording-only edit" e deve ser tratada, testada e comunicada como tal.

## 2. Avaliação de impacto sobre pedidos em curso

Segundo a linha de base do produto: publicar uma nova versão cria uma versão activa que os **novos** incidentes usam; um incidente já iniciado mantém as suas acções já instanciadas, mas a validação de metadados pode continuar a consultar a configuração do workflow ao nível do caso. Isto é um risco a verificar, não um comportamento garantido — o comportamento exacto de validação de campos obrigatórios sobre casos já abertos deve ser confirmado no ambiente real do cliente antes de publicar.

Consequências prováveis, por campo:

- **`budget_reference` (obrigatório opcional→obrigatório).** Qualquer pedido em curso que já tenha passado por `confirmar_cabimento` sem preencher a referência (permitido em v1) fica com um caso "incompleto" face à nova regra. Se a plataforma validar o campo obrigatório na próxima gravação do caso (nova acção, comentário, edição), o responsável pode ficar bloqueado a corrigir um campo de uma acção que já achava concluída. Pedidos ainda não chegados a `confirmar_cabimento` são afectados normalmente, como qualquer campo obrigatório novo na sua acção.
- **`expense_category` (campo novo obrigatório).** Nenhum pedido em curso tem este valor, porque o campo não existia quando foi criado. Não há forma de "preencher retroactivamente" sem intervenção humana. Se a validação de obrigatoriedade for aplicada a casos abertos, mesmo pedidos já em `encomendar` ou perto do fim podem ficar bloqueados por um campo que nunca lhes foi pedido.
- **Pedidos que só terminam por decisão de rejeição/cancelamento** não dependem destes campos e não são afectados.

Isto não é uma correcção editorial: nomes, descrições e regras mudam de comportamento, não só de redacção.

## 3. Plano de versão em rascunho e publicação

1. **Obter a versão real.** Em modo ligado, `workflow_export_yaml` da versão activa é o ponto de partida obrigatório — nunca este exemplo. Em modo desligado, pedir ao dono do processo o export actual ou o YAML já empacotado (`provia-workflow-package`).
2. **Criar o rascunho a partir da versão real**, aplicando só as duas alterações de campo acordadas (e as edições de "Como"/"Evidência" das acções que passam a capturar esses campos), sem tocar em responsáveis, prazos, ramos de decisão ou outros campos — para poder isolar o efeito da alteração pedida.
3. **Validar o rascunho** com `node scripts/validate-workflow.mjs workflow.v2-draft.yaml` (feito nesta sessão, resultado abaixo) e rever as acções alteradas com `node scripts/review-actions.mjs workflow.v2-draft.yaml`.
4. **Decidir o tratamento dos pedidos em curso antes de publicar** (decisão D4): as opções realistas são (a) aceitar que os casos abertos fiquem com a lacuna e resolver caso a caso por comentário/página quando surgir a necessidade, (b) pedir ao dono do processo para percorrer os pedidos em curso e completar os campos manualmente antes da publicação, ou (c) confirmar com o ambiente/fornecedor se existe forma de isentar casos já abertos da nova obrigatoriedade. Nenhuma destas é assumida como certa; nenhuma acção de publicação foi executada aqui.
5. **Publicar como nova versão** (acção manual na Provia, fora do alcance deste plugin) só depois de resposta às decisões D1–D4 e de teste manual dos dois caminhos (secção 4).
6. Formulários de intake publicam-se independentemente da versão do workflow; qualquer Form Fill ligado às acções `registar`/`confirmar_cabimento` fica congelado na publicação do workflow — se existirem, têm de ser actualizados separadamente para pedir os mesmos campos novos/obrigatórios, ou o formulário e a regra de campo ficam dessincronizados.

## 4. Casos de teste

| # | Cenário | Passos | Resultado esperado a confirmar no ambiente real |
| --- | --- | --- | --- |
| T1 | Novo pedido, fluxo normal | Criar um pedido depois de a v2 estar activa; preencher todos os campos incluindo `expense_category` e `budget_reference` | Pedido avança por `registar` → `decidir` → `confirmar_cabimento` → `encomendar` sem bloqueios |
| T2 | Pedido em curso, ainda em `registar` | Um caso criado sob v1, ainda na primeira acção, quando a v2 for publicada | Confirmar se o formulário/ecrã da acção passa a pedir `expense_category`; se não pedir, identificar como lacuna a resolver manualmente |
| T3 | Pedido em curso, já em `confirmar_cabimento` sem `budget_reference` | Um caso que passou a decisão e está nesta acção sem o campo preenchido | Confirmar se a gravação do caso é bloqueada pela nova obrigatoriedade antes de o campo ser preenchido, e documentar o comportamento observado |
| T4 | Pedido em curso, já em `encomendar` | Um caso perto do fim, sem `expense_category` (inexistente em v1) | Confirmar se o encerramento/avanço da acção final exige o campo em falta; se sim, definir como o dono do processo o resolve caso a caso |
| T5 | Rejeição/cancelamento em curso | Um caso em `decidir` que é rejeitado | Confirma-se que a rejeição não é bloqueada pelos novos campos, já que o incidente é cancelado antes de os precisar |
| T6 | Formulário de intake, se existir | Repetir T1 através do formulário público/Form Fill ligado a `registar` | Confirmar que o formulário também pede `expense_category`; caso não peça (porque forms não são veiculados pelo YAML), tratar como acção de configuração manual pendente |

Nenhum destes testes foi executado num ambiente Provia real; são o guião a seguir antes da publicação.

## 5. Recuperação e reversão

Não existe uma reversão de um clique nem comparação lado a lado de versões na Provia. Se a v2 publicada se revelar problemática para os pedidos em curso:

1. Criar **uma nova versão em rascunho** (não reimportar a v2 “ao contrário”) que reaplique o desenho de `workflow.yaml` (v1) — `budget_reference` volta a opcional e `expense_category` é removido ou tornado opcional.
2. Publicar essa nova versão. Isto gera uma nova linhagem de versão; não restaura o histórico nem o número de versão anterior, e reimportar YAML nunca preserva a linhagem de versões.
3. Os pedidos que entretanto ficaram bloqueados ou que foram forçados a preencher `expense_category`/`budget_reference` sob a v2 **não são automaticamente revertidos**: os valores já gravados permanecem no caso. Trate isso como um assunto de dados a resolver caso a caso com o dono do processo, não como algo que a reversão da versão resolve.
4. Documente a data efectiva de cada versão (activação da v2, activação da reversão) para que se saiba qual pedido foi criado ou avançou sob qual regra.

## 6. Ficheiros produzidos nesta pasta

- `workflow.yaml` — linha de base assumida (v1), a substituir pelo export real antes de qualquer uso a sério.
- `workflow.v2-draft.yaml` — rascunho proposto com os dois campos obrigatórios alterados.
- `validation.v1.json`, `validation.v2-draft.json` — saída real de `node scripts/validate-workflow.mjs` (ambos `"valid": true`, `"readyToPublish": false` porque a validação de destino não foi executada).
- `provia-project.json` — manifesto do projecto, workflow `compras` com `status: change_planned`, acções alteradas com `sourceRefs` para a fonte do pedido, e quatro decisões em aberto (D1–D4).
- `project.html`, `setup.md` — mapa do projecto e entrega gerados por `node scripts/build-project-map.mjs`.
- Este relatório.

## Factos confirmados, recomendações e decisões em aberto

**Confirmado por execução real dos scripts do plugin:** os dois YAML passam a validação estrutural e o portão de revisão de acções (`review-actions.mjs`) reporta as quatro acções completas nos cinco campos exigidos.

**Recomendação:** não publicar a v2 sem primeiro obter a contagem real de pedidos em curso (D1) e confirmar com o dono do processo se são mesmo estes os dois campos e regras pretendidos (D2, D3), e sem decidir o tratamento dos casos abertos (D4).

**Decisões em aberto** (registadas em `provia-project.json` → `decisions[]`): D1 contagem e estado dos pedidos em curso; D2 obrigatoriedade retroactiva de `budget_reference`; D3 confirmação de `expense_category` e das suas opções; D4 tratamento dos casos abertos sem os novos valores.
