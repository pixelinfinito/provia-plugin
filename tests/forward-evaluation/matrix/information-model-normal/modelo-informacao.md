# Fornecedores e pedidos de compra · modelo de informação

Pergunta: *Como organizar fornecedores e pedidos de compra sem repetir os dados do fornecedor em cada pedido?*

Contexto assumido: Angola (provisório, não indicado), pt-AO, Kz, Africa/Luanda. Não foram fornecidos procedimentos, exportações nem catálogo existente; nenhuma organização Provia foi lida (a permissão para `org_get_context` não foi concedida nesta sessão, pelo que o trabalho decorreu em modo desligado). Tudo o que se segue é uma base fundamentada com pressupostos assinalados; as decisões em aberto estão em `provia-project.json` (D1–D6) e em `setup.md`.

## 1. Resposta curta

Separar dois objectos com naturezas diferentes:

| Objecto | O que é no Provia | Porquê |
| --- | --- | --- |
| **Fornecedor** | Tipo de entidade `Fornecedor` (um registo por fornecedor) | É estável, tem ciclo de vida próprio (em aprovação → activo → suspenso/inactivo) e é seleccionado em muitos pedidos. |
| **Pedido de compra** | Um **caso** (incident) do workflow «Pedido de compra», não uma entidade | Cada pedido é uma execução: tem requerente, valor, justificação, cotações, aprovação e recepção, e termina. |

O pedido **liga-se** ao registo do fornecedor em vez de o copiar. Quem abre ou trata o pedido selecciona o fornecedor na lista; nome, contacto, NIF, condições de pagamento e contrato lêem-se no registo. Só os factos daquele pedido concreto se escrevem no caso.

## 2. O que fica no registo Fornecedor

Catálogo completo em `catalogue.json` / `catalogue.html` (18 campos em seis grupos, com chave, tipo, texto de ajuda, exemplo e responsável prontos a copiar). Resumo:

| Grupo | Campos | Obrigatório na criação |
| --- | --- | --- |
| Identificação | Nome (nativo), `supplier_code`, `legal_name`, `tax_number` | Nome |
| Classificação | `category`, `supply_scope`, `criticality` | `category`, `supply_scope` |
| Contactos e localização | `contact_name`, `contact_email`, `contact_phone`, `address` | — |
| Responsabilidade | `relationship_owner` (utilizador) | — |
| Condições comerciais | `payment_terms`, `currency`, `lead_time_days`, `agreement_url`, `agreement_end` | — |
| Ciclo de vida | `relationship_status`, `approved_on`, `notes` | `relationship_status` |

Ícone: `Truck01` (snapshot 36772f7c…; confirmar no destino). Padrão de Nome: nome comercial pelo qual a equipa conhece o fornecedor.

Fora do Provia, de propósito: **dados bancários** (ficam no sistema de contabilidade, onde há conferência e controlo de acesso); **histórico de pedidos** (resulta dos casos ligados, não de campos na entidade). Pendentes de decisão: avaliação de desempenho e documentos de habilitação (só com processo definido).

## 3. O que fica em cada pedido de compra (metadados do caso)

Proposta para o desenho do workflow; não faz parte do catálogo de entidades e será integrada por `provia-workflow-designer`.

| Campo do caso | Tipo | Quando se preenche | Nota |
| --- | --- | --- | --- |
| `numero_pedido` | auto_number (prefixo por ex. `PC-`) | gerado ao criar | Referência do pedido; não editável. |
| `fornecedor` | entity → Fornecedor | na abertura se já conhecido; senão após cotações (D4) | Ligação, não cópia. Recomendado `optional` na criação, com verificação humana antes da aprovação. |
| `descricao` | rich_text | abertura | O que se pretende comprar e para quê. |
| `centro_custo` / `departamento` | select (ou entity, ver D6) | abertura | Para encaminhamento e relatórios. |
| `valor_estimado` | currency (Kz) | abertura | Base para a aprovação. |
| `data_necessidade` | date | abertura | Compara-se com `lead_time_days` do fornecedor. |
| `urgencia` | select | abertura | Vocabulário a confirmar. |
| `valor_adjudicado` | currency | após cotações/adjudicação | Valor final. |
| `condicoes_pagamento_acordadas` | select (mesmas opções de `payment_terms`) | adjudicação | Instantâneo do que foi acordado **neste** pedido; pode diferir do habitual. |
| cotações, nota de encomenda, guia de recepção | ficheiros/respostas de formulário nas acções | ao longo do caso | Evidência das acções, não metadados. |

Regra prática: se um valor é o mesmo para todos os pedidos do fornecedor, pertence à entidade; se pode variar de pedido para pedido ou é uma decisão do pedido, pertence ao caso.

## 4. Como se faz a ligação no Provia

Duas formas suportadas (referências: `provia-capabilities.md`, `workflow-yaml.md`):

1. **Secção `entities` do workflow** com `mode: entity_type`, `entityType: Fornecedor` e `requirement: optional` ou `required`. O caso passa a ter o fornecedor associado e pode receber **`fieldMapping`** (de campo da entidade para campo do caso).
2. **Campo de caso do tipo `entity`** apontando para o tipo Fornecedor, útil quando o fornecedor só é conhecido a meio do processo ou quando um pedido compara vários fornecedores (um campo por proposta).

Sobre os mapeamentos: copiar da entidade para o caso apenas o que precisa de ficar **congelado à data do pedido** (por exemplo `payment_terms` → `condicoes_pagamento_acordadas` como valor inicial, que o comprador pode alterar). O resto lê-se no registo. Um valor copiado é um instantâneo, não sincronização: se o fornecedor mudar de email, os pedidos antigos não se actualizam, e é isso que se quer para efeitos de evidência.

O que o Provia **não** faz a partir destes campos: `relationship_status = suspended` não impede a selecção do fornecedor; `relationship_owner` não atribui acções; não há unicidade automática por NIF. Estas verificações ficam descritas na acção de aprovação (ver prontidão no catálogo) e a unicidade é uma regra de conciliação da equipa de Compras.

## 5. Percurso de um registo e de um pedido (sintético)

1. O comprador cria o fornecedor «Papelaria Demonstração»: Categoria = Bens e materiais, O que fornece = material de escritório, Situação = Em aprovação. Três campos e o Nome; nada mais é exigido.
2. Ao receber a primeira proposta, completa contacto, email, condições habituais (30 dias), moeda (Kz) e responsável. Quando Finanças confirma o NIF, muda a Situação para Activo e regista a data de aprovação.
3. Um requerente abre o pedido PC-0001: descrição, centro de custo, valor estimado, data de necessidade. Não sabe ainda o fornecedor — o campo fica vazio (D4).
4. O comprador pede cotações, selecciona «Papelaria Demonstração» no campo `fornecedor`, regista o valor adjudicado e a condição acordada (contra entrega, diferente do habitual). Nenhum dado do fornecedor foi digitado.
5. O aprovador abre o registo ligado, confirma Situação = Activo e NIF confirmado, e decide.
6. No segundo pedido ao mesmo fornecedor, o passo 4 repete-se com uma selecção; o registo já tem tudo.

Entrada duplicada evitada: contacto, NIF, condições, contrato. Esforço de manutenção que fica por resolver: quem actualiza o registo quando o fornecedor muda de contacto ou de condições (proposta: `relationship_owner`, a confirmar em D5) e com que periodicidade se revê a lista de fornecedores activos.

## 6. Disposição das alternativas consideradas

| Proposta | Decisão | Razão |
| --- | --- | --- |
| Pedido de compra como tipo de entidade | Rejeitada | Duplicaria o caso; o histórico por fornecedor obtém-se pelos casos ligados. |
| Campo `historico_pedidos` ou `total_comprado` no Fornecedor | Rejeitada | Sem mecanismo de actualização credível; ficaria desactualizado. Relatórios devem partir dos casos. |
| Dados bancários no Fornecedor | Externa | Sistema de contabilidade é a fonte; sensibilidade e conferência fora do Provia (D2). |
| `source_system`, `source_url`, `verified_at` genéricos | Não incluídos | Sem consumidor definido; um `supplier_code` e um `agreement_url` concretos cobrem a necessidade real. |
| Tipo de entidade Centro de custo | Adiada | Depende de a lista ser gerida por Finanças e reutilizada (D6). |
| Contacto do fornecedor como entidade separada | Rejeitada | Um contacto principal por fornecedor chega para o processo descrito; separar só se houver vários contactos por fornecedor com papéis distintos. |

## 7. Verificações efectuadas e limites

- `node scripts/build-entity-catalogue.mjs catalogue.json --check`: 1 tipo verificado (forma editorial, ícone, tipos de campo, opções e exemplos). Não é validação de importação Provia.
- `catalogue.html` gerado a partir do mesmo JSON; o ficheiro contém os controlos de cópia, mas não foram exercidos num browser nesta sessão.
- `node scripts/build-project-map.mjs provia-project.json --check`: 1 tipo de entidade, 0 workflows, 6 decisões em aberto, 0 avisos. `project.html` e `setup.md` gerados.
- Nada foi criado, lido ou alterado numa organização Provia. A disponibilidade do ícone e dos tipos de campo no destino fica por confirmar.
- Pendente do dono do processo: D1–D6, vocabulários dos selects, e a definição do workflow de compras que consumirá este tipo.

## Ficheiros

- `catalogue.json` — fonte de verdade do tipo Fornecedor.
- `catalogue.html` — catálogo offline com controlos de cópia para configuração manual.
- `provia-project.json` — manifesto do projecto com `entityTypes[]` e decisões D1–D6.
- `project.html` — mapa do projecto; `setup.md` — entrega de configuração.
