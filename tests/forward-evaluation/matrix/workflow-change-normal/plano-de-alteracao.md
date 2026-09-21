# Plano de alteração: campos obrigatórios do «Pedido de compra» com casos em curso

Data: 2026-09-21 · Plugin provia-skills 1.2.0 · Contrato `fed8efaf` · Contexto provisório: Angola, pt-AO, AOA, Africa/Luanda (nenhum país foi indicado).

## 0. Estado desta análise

**O que foi fornecido:** apenas o pedido «Queremos alterar os campos obrigatórios deste workflow, mas ainda existem pedidos em curso.» O directório de trabalho estava vazio: sem export do workflow, sem manifesto anterior, sem lista dos campos a alterar, sem exportação dos casos abertos.

**Modo:** o servidor Provia está listado no host, mas a chamada a `org_get_context` foi recusada nesta sessão. O plano foi feito em modo desligado; nada foi lido nem escrito no tenant. A leitura da versão activa (`workflows_list` → `workflow_get` com `includeVersions`, `includeActionTemplates`, `includeAccess` → `workflow_export_yaml`) fica **pendente** e é o primeiro passo antes de aprovar o que segue.

**Suposições declaradas (a substituir pela realidade):**

| # | Suposição | Onde está |
| --- | --- | --- |
| S1 | O workflow é um pedido de compra interno (prefixo `COMP`) com 4 acções: registar (criador), verificar cabimento (Finanças), decidir (chefias), confirmar encomenda (Compras). | `workflow.current.yaml` |
| S2 | A alteração pedida torna obrigatórios `estimated_amount` e `cost_center`, acrescenta `purchase_category` (obrigatório) e torna `delivery_date` opcional. Foram escolhidos de propósito os três padrões de alteração que têm impactos diferentes nos casos abertos (ver §2). | `workflow.yaml` |
| S3 | Qualquer colaborador abre um pedido (`organization` → `create_incident`); as equipas executantes vêem os seus casos sem concessão explícita. | `provia-project.json` → `access` |

**O que foi verificado de facto:** `validate-workflow.mjs` em `workflow.yaml` e `workflow.current.yaml` (ambos `valid: true`, `backendSchemaValidation: passed`, `destinationValidation: not_run`, 3 `assignment_missing` esperados porque os grupos ainda não têm id); `review-actions.mjs` em `workflow.yaml` (4/4 acções com as cinco partes, 0 fugas de notas de implementador); `build-project-map.mjs --check` no manifesto (0 erros, 0 avisos, 3 infos da regra 4, 18 itens pendentes de configuração). Nenhuma destas verificações valida a correcção de negócio, o impacto real nos casos abertos ou o comportamento do tenant.

## 1. Comparação semântica: v1 activa (assumida) → v2 proposta

### 1.1 Campos

| Campo | v1 | v2 | Tipo de alteração | Efeito de negócio |
| --- | --- | --- | --- | --- |
| `purchase_category` | não existe | `select` obrigatório (Bens / Serviços) | **Novo campo obrigatório** | Todo o pedido novo passa a ser classificado no registo. Casos v1 não têm valor e nunca terão, salvo preenchimento manual. |
| `estimated_amount` | `currency` opcional | `currency` **obrigatório** | **Opcional → obrigatório** | As Finanças deixam de perder tempo a pedir o montante por comentário. Casos v1 podem ter o campo vazio. |
| `cost_center` | `text` opcional | `text` **obrigatório** | **Opcional → obrigatório** | O cabimento passa a ser verificado no centro certo desde o início. Casos v1 podem ter o campo vazio. |
| `delivery_date` | `date` obrigatória | `date` **opcional** | **Obrigatório → opcional** | Pedidos sem prazo deixam de ser bloqueados com datas fictícias. Sem risco para casos abertos (relaxação). |
| `department`, `description`, `supplier_name`, `budget_reference`, `request_reference` | — | — | Inalterados | Nenhum. `request_reference` (auto_number) continua o contador da família na nova versão; não é reiniciado. |

### 1.2 Acções, responsáveis, decisões, integrações

| Acção | Responsável | Alteração | Classificação |
| --- | --- | --- | --- |
| `registar` | criador | Descrição reescrita: exige `purchase_category`, `estimated_amount`, `cost_center`; `delivery_date` passa a «quando houver prazo». | **Comportamental** (é a acção onde a obrigatoriedade se manifesta) |
| `verificar_cabimento` | Finanças | Deixa de ter como passo normal «pedir os valores em falta»; passa a excepção explícita para casos abertos antes da v2. | Editorial (responsável, prazo e evidência iguais) |
| `decidir` | Chefias | Nenhuma. | Inalterada |
| `confirmar_encomenda` | Compras | Passo 3 prevê `delivery_date` vazia. | Editorial |

Não há alteração de encaminhamento, ramos de decisão, atribuições, prazos, permissões, gatilhos, chamadas externas ou sub-workflows. Se o pedido real incluir alguma dessas alterações, ela deve ser tratada como uma alteração separada e revista com `provia-workflow-review`.

### 1.3 O que a comparação não pode dizer

Não há no produto uma comparação lado a lado de versões; a comparação acima foi feita entre dois ficheiros YAML. Quando a versão activa real for exportada, repetir esta tabela contra o export — é a tabela, não o diff de linhas, que o responsável aprova.

## 2. Impacto nos casos em curso

### 2.1 O mecanismo

Confirmado pelo baseline de capacidades do plugin (`references/provia-capabilities.md`):

- A publicação cria uma versão activa; **os casos novos** usam o desenho novo.
- Nos **casos abertos**, as acções já estão instanciadas, **mas a validação de metadados pode ainda consultar a configuração ao nível do workflow**. Ou seja: um caso v1 não muda de desenho, mas quando alguém grava campos nesse caso, a validação de «obrigatório» pode aplicar a definição em vigor.
- Alterações incompatíveis de campos são, por isso, um risco a verificar caso a caso nos incidentes abertos, não um efeito automático nem garantidamente nulo.

O plugin não tem forma de testar este comportamento; **D3** pede que seja observado num caso de teste no tenant antes de publicar.

### 2.2 Efeito por padrão de alteração

| Padrão | Casos v1 abertos | Risco | Tratamento |
| --- | --- | --- | --- |
| Novo campo obrigatório (`purchase_category`) | Valor sempre vazio | Se a validação consultar a v2 ao gravar o caso, o requerente pode ser bloqueado num passo que a v1 não previa. Relatórios e filtros que assumam o campo preenchido excluem os casos v1. | Ver 2.3. Consumidores (D6) têm de tolerar vazio. |
| Opcional → obrigatório (`estimated_amount`, `cost_center`) | Vazio numa parte dos casos (a proporção só se sabe com a exportação) | Mesmo risco de bloqueio ao gravar; além disso, os casos v1 em `verificar_cabimento` continuam sem o valor e as Finanças mantêm o pedido por comentário (por isso a excepção ficou na descrição da v2). | Ver 2.3. |
| Obrigatório → opcional (`delivery_date`) | Sempre preenchido | Nenhum para casos abertos. `confirmar_encomenda` em casos novos pode encontrar o campo vazio — coberto no passo 3 da descrição. | Nenhum. |

### 2.3 Verificação pendente: quais casos e em que passo

Não foi possível inspeccionar os incidentes. Antes de publicar, exportar os casos abertos do workflow (UI: lista de casos do workflow, filtro «em curso», exportação) com, no mínimo: id do caso, acção actual, responsável actual, data de criação, e os valores de `estimated_amount`, `cost_center`, `delivery_date`. Com essa exportação, classificar cada caso:

| Situação do caso v1 | Exposição | Acção recomendada |
| --- | --- | --- |
| Em `registar` (ainda a preencher) ou devolvido a `registar` por «Devolver» | **Alta**: é o passo que grava os campos alterados. | Avisar o requerente de que os campos passam a ser exigidos; ou concluir estes casos antes da publicação; ou aceitar que se preencham segundo a v2 (D2). |
| Em `verificar_cabimento` com `estimated_amount`/`cost_center` vazios | Média: as Finanças precisam dos valores de qualquer forma. | Pedir os valores por comentário (excepção prevista na v2). Não bloquear o caso. |
| Em `decidir` ou `confirmar_encomenda` | Baixa: os campos alterados já foram gravados ou não são gravados aqui. | Nenhuma; observar apenas se alguém editar os metadados do caso. |
| Devolvido a `registar` **depois** da publicação | Alta (o mesmo que a primeira linha, mas surge mais tarde). | Incluir nas instruções às Finanças e chefias: ao devolver um caso v1, comentar que os novos campos podem ser exigidos. |

Sem a exportação, o item «impacto nos casos em curso» permanece **pendente** e este plano não deve ser aprovado como completo.

### 2.4 Dependências além dos casos

- **Formulário de abertura (trigger form):** não é transportado pelo YAML e publica-se separadamente do workflow. Se existir, os seus campos obrigatórios têm de ser alinhados com a v2 e publicados na mesma janela; caso contrário, o formulário continua a aceitar pedidos sem `purchase_category`, `estimated_amount` ou `cost_center` (D5).
- **Form Fill:** as definições ficam congeladas com a publicação do workflow; uma resposta Form Fill que mapeie para os campos alterados tem de ser revista antes de publicar.
- **Relatórios, filtros guardados, integrações HTTP, sub-workflows:** qualquer consumidor dos três campos tem de tolerar valores vazios em casos v1 (D6). O YAML assumido não tem integrações; o real pode ter.
- **Permissões:** pertencem ao id do workflow e sobrevivem à nova versão; nada a fazer se a alteração for feita como nova versão do mesmo workflow. Perdem-se se o workflow for duplicado ou re-importado como novo.
- **`request_reference` (auto_number):** a nova versão continua o contador; um re-import como novo workflow começaria um contador novo — mais uma razão para não re-importar.

## 3. Plano de rascunho e publicação

Nenhum destes passos foi executado. A publicação é sempre uma acção humana na UI do Provia.

| Passo | Quem | Como | Evidência a guardar |
| --- | --- | --- | --- |
| 1. Ler a versão activa | Implementador | Modo ligado: `org_get_context`, `workflows_list`, `workflow_get` (`includeVersions`, `includeActionTemplates`, `includeTriggers`, `includeAccess`), `workflow_export_yaml` da versão activa. UI: exportar o YAML do workflow. | Export guardado como `workflow.current.yaml` (substitui o assumido) |
| 2. Confirmar a lista de campos | Responsável do processo | Responder a D1 sobre a tabela §1.1 refeita a partir do export real. | D1 resolvida no manifesto |
| 3. Exportar e classificar os casos abertos | Implementador + Finanças | §2.3. | Ficheiro de casos + tabela de classificação |
| 4. Criar o rascunho v2 | Implementador | Modo ligado: `workflow_create_draft_version` a partir da versão activa, depois `workflow_update_draft_actions` para as descrições de §1.2; alterar os `required` dos campos conforme §1.1. UI: «Nova versão» no workflow e editar os campos. **Não** usar `workflow_import_draft` com `workflow.yaml`: cria uma nova linhagem, sem a versão, o histórico, as permissões e o contador. | Id da versão rascunho; recibo do `workflow_create_draft_version` em `receipts[]` com `ref: { kind: "workflow", key: "compras" }` |
| 5. Alinhar formulários | Implementador | Se D5 for «sim»: actualizar o formulário de abertura e as ligações Form Fill; publicação do formulário é separada. | Formulário revisto |
| 6. Testar no rascunho | Implementador + um requerente | Casos de teste de §4, incluindo o teste do caso v1 (D3). | Resultados registados por caso de teste |
| 7. Comunicar a data efectiva | Responsável do processo | Aviso aos requerentes e às Finanças com a data, os campos novos e o tratamento dos casos abertos (D4). | Cópia do aviso |
| 8. Publicar | Pessoa autorizada | UI do Provia, na janela acordada. | Versão activa = v2; data/hora |
| 9. Acompanhar os casos v1 | Finanças / chefias | Durante as duas primeiras semanas, registar qualquer caso v1 bloqueado por campo obrigatório e resolver por comentário ou preenchimento manual. | Lista de ocorrências (alimenta `provia-operations-triage`) |

## 4. Casos de teste

Executar no rascunho antes de publicar (passos 6) e repetir os marcados com † logo após a publicação.

| # | Caminho | Passos | Resultado esperado |
| --- | --- | --- | --- |
| T1 † | Alterado: registo novo completo | Criar caso; preencher todos os campos, incluindo `purchase_category`, `estimated_amount`, `cost_center`; concluir `registar`. | Concluído; caso avança para `verificar_cabimento`. |
| T2 | Alterado: registo novo incompleto | Criar caso; deixar `cost_center` vazio; tentar concluir `registar`. | Bloqueado com mensagem de campo obrigatório em `cost_center`. Repetir para `estimated_amount` e `purchase_category`. |
| T3 | Alterado: relaxação | Criar caso sem `delivery_date`; concluir `registar`. | Concluído (a data deixou de ser obrigatória). |
| T4 | Inalterado: verificação de cabimento | Continuar T1: Finanças preenche `budget_reference`, anexa captura, conclui. | Concluído dentro dos 2 dias úteis; caso avança para `decidir`. |
| T5 | Inalterado: os três ramos da decisão | Em três casos: Aprovar; Devolver (sem comentário → bloqueado; com comentário → volta a `registar`); Rejeitar com comentário. | Aprovar avança; Devolver regressa a `registar`; Rejeitar cancela o caso. |
| T6 | Alterado: devolução obriga aos novos campos | Continuar o «Devolver» de T5 num caso criado **na v2** com campos completos; alterar e reconcluir `registar`. | Concluído; nenhum bloqueio inesperado. |
| T7 † | Caso aberto na v1 (D3) | Antes de publicar, ter um caso de teste v1 em `registar` com `cost_center` vazio. Publicar a v2 (em ambiente de teste, se existir; senão, como primeiro caso a observar após a publicação real). Tentar concluir `registar` nesse caso. | **Registar o que acontece**: (a) conclui sem exigir os campos, ou (b) exige os campos da v2. O resultado decide o texto do aviso aos requerentes e o tratamento em §2.3. |
| T8 | Inalterado: encomenda | Continuar T1 até `confirmar_encomenda`; anexar nota de encomenda; comentar data; concluir. | Concluído dentro dos 5 dias úteis; caso termina. |
| T9 | Inalterado: encomenda sem data | Continuar T3 até `confirmar_encomenda`. | Compras acorda a data por comentário (passo 3 novo) e conclui. |
| T10 | Inalterado: permissões | Um colaborador fora dos grupos cria um caso; um membro de Finanças só vê os casos que lhe estão atribuídos. | Ambos como antes da alteração. |
| T11 | Formulário de abertura (se D5 = sim) | Submeter o formulário sem `purchase_category`. | Rejeitado pelo formulário (após alinhamento). |
| T12 | Numeração | Criar um caso após a publicação. | `request_reference` continua a sequência da v1, sem reiniciar. |

## 5. Recuperação

Não existe no produto um controlo geral de reposição («rollback») nem comparação lado a lado de versões. Se a v2 tiver de ser retirada:

1. **Nova versão com o desenho anterior.** Criar um rascunho v3 a partir da v2 (`workflow_create_draft_version` ou «Nova versão») e repor manualmente os `required` da v1: `purchase_category` opcional (ou removido — remover apaga o campo dos casos v2 que o preencheram; preferir mantê-lo opcional), `estimated_amount` e `cost_center` opcionais, `delivery_date` obrigatória, descrições da v1. Publicar a v3. Os casos criados na v2 mantêm os valores que gravaram.
2. **Não** re-importar `workflow.current.yaml`: cria um novo workflow numa nova linhagem, sem histórico, sem permissões e com contador novo; os casos abertos ficam no workflow antigo. Uma re-importação não restaura a versão nem preserva a linhagem.
3. **Casos abertos na v2 durante a reposição:** tratar separadamente, com a mesma lógica de §2.3 mas em sentido inverso (a v3 volta a exigir `delivery_date`; casos v2 sem data podem ser bloqueados em `registar` se devolvidos). Listar esses casos antes de publicar a v3.
4. **Formulário de abertura:** repor a versão anterior do formulário na mesma janela; publica-se separadamente.

Guardar `workflow.current.yaml` (o export real) e o id da versão activa v1 antes de publicar a v2; é a única referência fiável para a reposição.

## 6. Registo no manifesto

`provia-project.json` foi criado (não existia) com:

- `workflows[0]` `compras`, `status: change_planned`, ficheiro `workflow.yaml` (versão proposta).
- Fonte `cr-campos-obrigatorios` (o pedido de alteração, com secções `pedido`, `casos-abertos`, `suposicoes`) e fonte `baseline-assumida`; cada acção alterada tem `sourceRefs` para a secção do pedido de alteração e um `changeNote` com a classificação (comportamental / editorial / inalterada).
- `decisions[]` D1–D6, todas abertas, com responsável.
- `setupNotes` com o modo, a verificação pendente dos casos e a instrução de não importar como novo workflow.
- `receipts: []` — nada foi aplicado.

`setup.md` e `project.html` foram gerados do manifesto. Ficheiros no directório: `workflow.current.yaml`, `workflow.yaml`, `validation.current.json`, `validation.json`, `review-actions.json`, `provia-project.json`, `setup.md`, `project.html`, este plano.

## 7. Verificado, pendente, por decidir

**Verificado:** validação estrutural dos dois YAML; gate das cinco partes nas quatro acções; consistência do manifesto (`--check`, 0 erros).

**Pendente:** leitura da versão activa real; exportação e classificação dos casos abertos (§2.3); comportamento observado da validação num caso v1 (T7); existência de formulário de abertura e consumidores dos campos; validação de destino (`workflow_import_draft` com `dryRun: true` não se aplica — a alteração faz-se por nova versão, não por importação).

**Por decidir (responsável no manifesto):** D1 campos exactos; D2 tratamento dos casos v1; D3 comportamento a confirmar; D4 data efectiva e comunicação; D5 formulários; D6 consumidores dos campos.

Este plano não é uma aprovação de publicação. A prontidão para publicar é decidida no Provia por uma pessoa autorizada, depois de D1–D6 e da verificação de §2.3.
