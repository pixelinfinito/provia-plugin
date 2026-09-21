# Revisão editorial — Pedido de compra (`workflow.yaml`)

Data: 2026-09-21 · Plugin: provia-skills 1.2.0 · Contrato: `fed8efaf019abc901cb2b229f3676dc4031126fa` · Modo: desligado (sem leitura do tenant).

Este documento é separado de `validation.json` (estrutura) e de `review-actions.json` (presença das cinco partes). Regista o que foi revisto à mão segundo `references/action-writing.md`.

## Âmbito

- Workflow: Pedido de compra (`COMP`), 4 acções, 1 gatilho manual, 4 campos, 2 concessões de acesso.
- Revisto: nome de cada acção (verbo inicial, objecto, clareza), descrição em cinco partes, coerência entre nome, tipo, descrição e configuração; ramos da decisão; ausência de notas de implementador nas descrições.
- Não revisto: correcção do negócio face ao procedimento do cliente (não fornecido — ver D3) e adequação dos prazos (ver notas de configuração).

## Acções

| ID | Nome observado | Tipo | Verbo/objecto | Cinco partes | Observações |
| --- | --- | --- | --- | --- | --- |
| `registar` | Registar a necessidade | standard | ✔ infinitivo + objecto | ✔ completas (724 car.) | Responsável: criador (requerente). Coerente com a fonte §1. |
| `decidir` | Decidir sobre o pedido | decision | ✔ | ✔ completas (739 car.) | Três ramos com resultado explícito: Aprovar → `continue`, Devolver → `return_to_action` (`registar`, comentário obrigatório), Rejeitar → `cancel_incident` (comentário obrigatório). A descrição explica o significado de cada ramo. Limite de autoridade não definido (D1). |
| `confirmar_cabimento` | Confirmar disponibilidade orçamental | standard | ✔ | ✔ completas (631 car.) | Evidência nomeada (captura do saldo + `budget_reference`). A excepção «sem cabimento» devolve à chefia por comentário; não existe ramo formal de retorno a partir desta acção — decisão de desenho a confirmar com o dono do processo. |
| `encomendar` | Registar a encomenda | standard | ✔ | ✔ completas (717 car.) | Evidência nomeada (nota de encomenda + `order_reference`). O passo «confirmar dados do fornecedor» está dobrado no `Como`, registado em `folded[]`. |

## Constatações

1. Nenhuma nota de implementador nas descrições (`leaks: 0` em `review-actions.json`); as notas de configuração estão em `provia-project.json` → `setupNotes` e em `setup.md`.
2. Nenhuma alteração de nome foi necessária: todos os nomes começam por verbo no infinitivo e nomeiam o trabalho, não o actor.
3. A `access` foi emitida pelo script a partir do manifesto (`group:Compras` por nome, `organization` → `create_incident`); as razões e referências de fonte ficam no manifesto, não no YAML (o contrato não as transporta).
4. As acções `decidir`, `confirmar_cabimento` e `encomendar` não têm `assignee` no ficheiro: os grupos `chefias`, `financas` e `compras` não têm recibo no destino. Não foram substituídos pelo criador. O validador assinala-o como `assignment_missing` (configuração pendente, não erro).

## Questões em aberto (registadas em `decisions[]`)

- D1 — limite de autoridade da chefia e escalonamento (Director financeiro).
- D2 — segregação: a chefia pode aprovar pedidos que ela própria registou? (Dono do processo).
- D3 — o desenho aprovado não foi fornecido nesta sessão; o YAML segue o desenho de referência do plugin. Confirmar ou fornecer o procedimento para regenerar (Dono do processo).

## O que esta revisão não certifica

Validade estrutural não é correcção do negócio, nem conformidade. A pré-visualização de importação no Provia, a validação de destino e a revisão humana antes de publicar continuam pendentes.
