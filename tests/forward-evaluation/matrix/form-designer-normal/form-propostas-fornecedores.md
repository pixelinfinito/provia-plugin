# Formulário: Propostas de fornecedores

- **Chave (`forms[].key`)**: `propostas-fornecedores`
- **Kind**: `action` (Form Fill, não é um formulário de abertura de incidente)
- **Workflow**: `compras` (`Pedido de compra`)
- **Acção associada (`actionRef`)**: `recolher_propostas` — "Registar as propostas dos fornecedores"
- **Nome da acção Form Fill**: Registar as propostas dos fornecedores (ver `workflow.yaml`, acção `recolher_propostas`, para a descrição em cinco partes)

## Decisão de desenho

O pedido pede para "recolher três propostas de fornecedores durante um pedido de compra". Um único Form Fill não pode mapear valores concorrentes de respostas repetidas para o mesmo campo do caso (ver `references/metadata-fields.md` e a regra do procedimento: "multiple responses are a review collection and cannot map competing values"). Por isso este desenho usa **uma única resposta com três blocos de campos distintos** (Fornecedor 1/2/3), em vez de três respostas separadas ao mesmo formulário — assim cada proposta mapeia para os seus próprios campos do caso, sem sobreposição.

Esta escolha assume que **uma pessoa interna** (o requisitante ou comprador) recolhe as três propostas fora do Provia (email, telefone, presencial) e preenche o formulário uma vez. Ver "Acesso" abaixo para a alternativa não confirmada.

## Respondentes e acesso

- **Respondente previsto**: interno — o utilizador atribuído à acção `recolher_propostas` (por omissão, `creator`, isto é, o próprio requisitante; ver `decisions[]` D2 sobre segregação de funções).
- **Acesso**: autenticado, restrito ao atribuído da acção. Não é prometido um link externo para os fornecedores preencherem directamente — o comportamento de acesso externo/anónimo do Provia não foi verificado nesta tarefa (ver `references/connected-mode.md`).
- **Alternativa não resolvida**: se se pretender que cada fornecedor preencha a sua própria proposta através de uma ligação externa, seriam necessárias três ligações/formulários distintos (um por fornecedor) para evitar o mesmo problema de mapeamento concorrente, e a disponibilidade dessa funcionalidade tem de ser confirmada em Provia antes de prometer o fluxo. Registado como decisão em aberto (D1).

## Campos do formulário

Os nomes e tipos correspondem aos campos do caso já declarados em `workflow.yaml` (`fields[]`), para que o mapeamento seja directo e sem transformação.

| Bloco | Campo do formulário | Campo do caso (`fields[].name`) | Tipo | Obrigatório | Nota |
| --- | --- | --- | --- | --- | --- |
| Fornecedor 1 | Nome do fornecedor | `fornecedor_1_nome` | `text` | Sim | |
| Fornecedor 1 | Valor da proposta | `fornecedor_1_valor` | `currency` (AOA) | Sim | > 0 |
| Fornecedor 1 | Prazo de entrega (dias) | `fornecedor_1_prazo_entrega_dias` | `number` | Sim | inteiro ≥ 0 |
| Fornecedor 1 | Documento da proposta | `fornecedor_1_documento` | `file` | Sim | ver "Anexos" |
| Fornecedor 1 | Condições / observações | `fornecedor_1_condicoes` | `rich_text` | Não | pagamento, garantia, etc. |
| Fornecedor 2 | Nome do fornecedor | `fornecedor_2_nome` | `text` | Sim | |
| Fornecedor 2 | Valor da proposta | `fornecedor_2_valor` | `currency` (AOA) | Sim | > 0 |
| Fornecedor 2 | Prazo de entrega (dias) | `fornecedor_2_prazo_entrega_dias` | `number` | Sim | inteiro ≥ 0 |
| Fornecedor 2 | Documento da proposta | `fornecedor_2_documento` | `file` | Sim | ver "Anexos" |
| Fornecedor 2 | Condições / observações | `fornecedor_2_condicoes` | `rich_text` | Não | |
| Fornecedor 3 | Nome do fornecedor | `fornecedor_3_nome` | `text` | Sim | |
| Fornecedor 3 | Valor da proposta | `fornecedor_3_valor` | `currency` (AOA) | Sim | > 0 |
| Fornecedor 3 | Prazo de entrega (dias) | `fornecedor_3_prazo_entrega_dias` | `number` | Sim | inteiro ≥ 0 |
| Fornecedor 3 | Documento da proposta | `fornecedor_3_documento` | `file` | Sim | ver "Anexos" |
| Fornecedor 3 | Condições / observações | `fornecedor_3_condicoes` | `rich_text` | Não | |
| Excepção | Justificação de dispensa | `justificativa_dispensa` | `rich_text` | Não | só preenchido se não for possível obter as três propostas |

Nenhum campo usa `auto_number` nem opções dependentes — ambos ficam fora do enum suportado em formulários (`references/metadata-fields.md`).

## Anexos (ficheiro)

- Tipos propostos: PDF, JPG, PNG.
- Tamanho máximo proposto: 10 MB por ficheiro.
- **Estes limites são uma recomendação editorial, não um facto verificado**: confirmar com o responsável de TI/política de retenção antes de configurar (ver `decisions[]` D3). Não foi consultada nenhuma política real de anexos.

## Validação

- Os três blocos (Fornecedor 1–3) são obrigatórios em conjunto: a acção só se considera concluída com os três nomes, valores, prazos e documentos preenchidos — conforme o "Concluído quando" da acção `recolher_propostas`.
- Excepção: quando não for possível obter três propostas, o campo `justificativa_dispensa` substitui o preenchimento em falta e a acção é concluída com essa justificação e um comentário, sem aprovação adicional configurada nesta tarefa (ver Excepções da acção e D4).
- `valor` > 0; `prazo_entrega_dias` inteiro ≥ 0. Não foi definido um tecto de valor nem uma comparação automática entre propostas — a escolha do fornecedor permanece uma decisão humana na acção `decidir`.

## Mensagem de confirmação

"Propostas registadas. Obrigado." — mensagem neutra, sem prometer um prazo ou próximo passo não configurado (a acção seguinte, `decidir`, não tem uma notificação automática desenhada nesta tarefa).

## Passos de teste (manuais, em Provia)

1. Criar o formulário `propostas-fornecedores` com os campos e tipos da tabela acima.
2. Associá-lo à acção Form Fill `recolher_propostas` do workflow `Pedido de compra`.
3. Confirmar que só o atribuído da acção consegue aceder e submeter o formulário (sem acesso anónimo/externo, dado que este não foi configurado).
4. Submeter uma resposta de teste com os três blocos preenchidos e um documento por fornecedor; confirmar que os 15 campos mapeiam para os campos do caso sem conflito.
5. Submeter uma segunda resposta de teste incompleta (duas propostas) com `justificativa_dispensa` preenchida; confirmar que a acção pode ser concluída nesse caminho de excepção.
6. Verificar os limites de tipo/tamanho de ficheiro depois de confirmados com TI (ver D3); testar a rejeição de um ficheiro fora dos limites.

## Decisões em aberto (ver também `provia-project.json`)

- **D1**: os fornecedores devem preencher a sua própria proposta através de uma ligação externa (um formulário por fornecedor), ou o requisitante regista as três centralmente? — condiciona o modelo de acesso e se são precisos mais formulários/acções.
- **D2**: a recolha de propostas deve ficar com o requisitante (`creator`/`previous`) ou com uma equipa de compras dedicada, por segregação de funções entre quem pede e quem negoceia preços?
- **D3**: tipos e tamanho máximo de ficheiro aceites para o documento da proposta — a confirmar com TI.
- **D4**: se faltarem propostas, a "Justificação de dispensa" basta para concluir a acção ou deve exigir uma aprovação adicional (ex.: decisão da chefia) antes de avançar?
