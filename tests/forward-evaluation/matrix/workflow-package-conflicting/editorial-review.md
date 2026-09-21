# Revisão editorial — Pedido de despesa (`workflow.yaml`)

Gerado por provia-skills 1.2.0 em 2026-09-21. Contexto de país provisório: Angola (pt-AO); nenhum país foi indicado.

## Âmbito

- Workflow: `Pedido de despesa` (prefixo `PED`), 3 acções: `registar_pedido`, `decidir_chefia`, `confirmar_financas`.
- Fonte: o pedido em chat (`pedido-chat` no manifesto). Não existe procedimento escrito; os nomes, as instruções e as excepções foram redigidos a partir dos três passos indicados e são recomendações a confirmar com o dono do processo.
- Revisão feita: verbo inicial e objecto de cada nome; as cinco partes de cada descrição; fuga de notas de implementação; coerência entre nome, tipo e operação real; ramos da decisão.
- Não revisto: correcção de negócio (limites, autoridade, prazos), porque a fonte não os contém.

## O pedido e o limite do contrato

O pedido tinha dois elementos que o contrato `provia.ao/v1` não admite. Nenhum foi silenciosamente ignorado; ambos ficaram preservados fora do YAML.

| Pedido | Contrato `provia.ao/v1` (contract-lock `fed8efaf`) | O que foi feito |
| --- | --- | --- |
| Nomes de propriedades em português (`metadados:`, `acções:`, `responsável:` …) | Só existem as secções `metadata`, `triggers`, `entities`, `fields`, `access` e `actions`; uma chave de topo desconhecida é erro `schema.unknown_key` e chaves aninhadas desconhecidas são avisos que o importador descarta. Traduzir as chaves produz um ficheiro que não importa. | As chaves ficam em inglês. Tudo o que o contrato deixa livre está em português: `metadata.name`, etiquetas dos campos, nomes e descrições das acções, rótulos das decisões, e os identificadores locais (`montante`, `centro_custo`, `registar_pedido`, …), que cumprem o padrão `^[a-z][a-z0-9_]*$`. |
| Definição do formulário de entrada embebida no YAML | Formulários, gatilhos de formulário e ligações Form Fill não são transportados (exclusões de portabilidade do contrato). Não existe secção `form` nem gatilho `form` que possa ser autorado. | A especificação está em `form-pedido.json` e em `provia-project.json` → `forms[formulario-pedido]`, com campos, obrigatoriedade e mapeamentos para os campos do workflow. `setup.md` lista a criação e a ligação do formulário como passo pendente. O YAML mantém o gatilho manual «Iniciar pedido» para que o workflow seja utilizável antes de o formulário existir. |

## Nomes das acções

| ID | Nome | Tipo | Apreciação |
| --- | --- | --- | --- |
| `registar_pedido` | Registar o pedido de despesa | standard | Verbo + objecto. O formulário cria o caso; a acção completa e confirma o registo, por isso «Registar» e não «Submeter». |
| `decidir_chefia` | Decidir sobre o pedido | decision | Verbo de decisão, sem prefixo de actor e sem limiar no nome. A autoridade da chefia fica na atribuição (a configurar) e na descrição. |
| `confirmar_financas` | Confirmar o cabimento orçamental | standard | «Confirmar», não «Executar» nem «Aprovar»: as Finanças verificam saldo e registam a referência; não pagam nem decidem. |

## Descrições (as cinco partes)

`review-actions.mjs`: 3 de 3 acções com Tarefa, Como, Evidência, Concluído quando e Excepções; 0 fugas de notas de implementação; comprimentos 922, 781 e 761 caracteres. Relatório exacto em `review-actions.json` e `review-actions.md`.

Pontos de revisão semântica que ficam para o dono do processo:

1. **`decidir_chefia`, Excepções** — instrui a chefia a não decidir sobre pedidos que ela própria registou ou que excedam a sua autoridade. É uma recomendação de segregação; a fonte não a exige (decisão D2).
2. **`confirmar_financas`, Excepções** — instrui a não concluir e a informar a chefia por comentário quando não há cabimento. A rota formal (devolver, cancelar) não foi definida na fonte e não foi inventada (decisão D3). Se a decisão for «devolver ao requerente», a acção deve passar a decisão com ramo `return_to_action`; isso é uma alteração de desenho, não de redacção.
3. **Evidências** — nenhuma foi fornecida pela fonte; todas são propostas (anexo da proposta, comprovativo de saldo, campo `referencia_cabimento`).
4. **Prazos** — nenhum `due` foi definido. O gate assinala «3 without due»; é intencional (decisão D1). Não foram inventados prazos.

## Ramos da decisão

| Rótulo | outcome | Comentário obrigatório | Destino |
| --- | --- | --- | --- |
| Aprovar | continue | não | `confirmar_financas` (sequencial) |
| Devolver | return_to_action | sim | `registar_pedido` |
| Rejeitar | cancel_incident | sim | encerra o caso |

Todos os outcomes estão explícitos; nenhum rótulo depende do valor por omissão.

## Atribuições

- `registar_pedido` → `creator` (no YAML).
- `decidir_chefia` e `confirmar_financas` → sem `assignee` no YAML. Os grupos `Chefias` e `Finanças` não existem no destino e não há recibos; o validador reporta `assignment_missing` nas duas acções e `setup.md` leva o passo. Não se usou o criador como substituto: isso daria ao requerente a aprovação do seu próprio pedido.

## Acesso

`organization → create_incident` (pressuposto; D4). Chefias e Finanças não recebem `view`: vêem os casos atribuídos. A secção `access` do YAML foi confirmada contra `emit-workflow-access.mjs` (mesma saída, `engineSupportsAccess: true`); nenhuma chave `permissions:` foi emitida.

## O que fica pendente

- Confirmação do país e da língua (Angola/pt-AO são provisórios).
- Decisões D1–D4 no manifesto.
- Pré-visualização de importação no Provia, criação dos grupos, atribuição das acções, criação e ligação do formulário, revisão humana antes da publicação.
