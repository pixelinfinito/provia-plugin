# Revisão editorial — workflow.yaml (Pedido de viatura)

Âmbito revisto: as 4 acções do workflow `viaturas` (`registar_pedido`, `decidir_pedido`, `entregar_viatura`, `devolver_viatura`). Verificação automática executada com `node scripts/review-actions.mjs workflow.yaml` (resultado completo em `validation.json` refere-se ao validador estrutural; o relatório de `review-actions.mjs` não foi gravado em ficheiro separado, mas as suas 4 acções reportaram as cinco partes presentes, sem fugas de notas de implementação, e nenhuma com descrição demasiado longa). Esta secção acrescenta a leitura semântica, que a verificação automática não faz.

## 1. Verbo inicial, objecto e clareza

Todos os nomes começam por um infinitivo com objecto claro: "Registar o pedido de viatura", "Decidir sobre o pedido de viatura", "Entregar a chave e o cartão de combustível", "Registar a devolução da viatura". Nenhum nome copia um número de passo, um limiar ou um título de formulário.

## 2. Comparação com a fonte, tipo e descrição

| Acção | Fonte | Observação |
| --- | --- | --- |
| `registar_pedido` | Passos 1–2 | Combina numa acção observável o pedido informal do colaborador (dobrado em `Como`) e o registo/verificação de disponibilidade pelo secretariado, que é quem efectivamente executa e prova o trabalho. |
| `decidir_pedido` | Passo 3 | Tipo Decisão correcto: uma pessoa autorizada (a chefia) escolhe entre aprovar e recusar, com prazo declarado na fonte (um dia útil). |
| `entregar_viatura` | Passo 4 | Tipo Standard correcto: entrega física com duas evidências verificáveis (quilometragem, chave/cartão). |
| `devolver_viatura` | Passo 5 | Combina o acto físico do colaborador (dobrado em `Como`) com o registo pelo secretariado, que é quem produz a evidência. |

Nenhuma acção foi dividida, fundida ou reencaminhada como correcção editorial não solicitada.

## 3. Atribuições, autoridade, coordenação e evidência

- `registar_pedido`: atribuído a `creator` no YAML; a intenção real é o secretariado (ver `assigneeRef: creator` no manifesto e nota de configuração sobre quem inicia o caso — decisão de desenho registada, não uma lacuna editorial).
- `decidir_pedido`: autoridade da chefia mantida na descrição («Confirmar que o pedido é do seu departamento»); o encaminhamento à chefia certa não está resolvido (decisão D1).
- `entregar_viatura`, `devolver_viatura`: atribuição pretendida ao secretariado, registada em `assigneeRef` no manifesto; por resolver em `setup.md`.
- Evidência nomeada em todas as quatro acções (quilometragem, chave/cartão, viatura associada, danos).

## 4. Comparação antes/depois

Não aplicável: workflow novo, sem exportação anterior para comparar.

## 5. Achados e questões em aberto

Nenhuma questão de redacção encontrada que exija correcção. Questões de desenho (não de redacção) permanecem em `decisions[]` do manifesto: encaminhamento por departamento (D1), papel da Direcção-Geral (D2), prazos não declarados (D3), comportamento em caso de incumprimento do prazo (D4), segregação de funções (D5).

Verificação automática (`review-actions.mjs`): 4/4 acções completas nas cinco partes, 0 fugas, 0 descrições demasiado longas, `due` em falta em 3 das 4 acções (esperado: só o passo 3 tem prazo na fonte).

Estrutura `valid: true` no validador (`validation.json`) certifica a forma, não esta revisão semântica nem a correcção do negócio.
