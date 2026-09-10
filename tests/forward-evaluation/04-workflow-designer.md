# Desenho de workflow — aprovação por resolver

As secções fornecidas atribuem a aprovação a responsáveis diferentes. A secção 2 diz «chefe de departamento aprova pedidos»; a secção 7 diz «só director financeiro aprova». Não é possível escolher o aprovador nem concluir que são duas aprovações sucessivas com esta informação. O desenho abaixo mantém esse conflito explícito e não está pronto para publicação.

## Acções e sequência propostas

| ID | Acção | Tipo Provia | Responsável | Execução e evidência | Base |
|---|---|---|---|---|---|
| registar | Registar o pedido | Standard | Requerente, hipótese a confirmar | Sequencial; registo da necessidade e dados necessários | Recomendação mínima para tornar o pedido identificável |
| decidir | Decidir sobre o pedido | Decision | **Por resolver: chefe de departamento ou director financeiro** | Depois do registo; identidade do decisor, decisão e comentário | Secções 2 e 7, em conflito |

Sequência proposta: registar → decidir → concluir quando aprovado. Não se adiciona trabalho paralelo ou sub-workflow, pois não foi fornecida uma necessidade independente. A entrada pode ser manual nesta proposta; um formulário de entrada, se escolhido, seria configurado à parte e criaria um pedido.

Desfechos recomendados, ainda sem fundamento expresso no procedimento: Aprovar → `continue` e concluir o fluxo; Rejeitar → `cancel_incident`, com comentário, encerrando o pedido. Não se cria autorização automática por montante. Devolução para correcção só deve ser acrescentada se o procedimento a admitir; não está assumida aqui.

## Mapeamento e decisão pendente

- Secção 2: associa a acção `decidir` ao chefe de departamento.
- Secção 7: associa a mesma acção exclusivamente ao director financeiro.
- A numeração superior da secção 7 não estabelece prevalência. Faltam escopo, vigência, excepções e regra de precedência.
- Nenhuma fonte permite transformar o chefe num mero revisor ou exigir ambos. Essas seriam alterações de política, não conversão fiel.

O dono do procedimento deve confirmar qual disposição prevalece ou em que circunstâncias cada uma se aplica, e aprovar uma redacção inequívoca. Como não há mais informação disponível, esta parte fica pendente; o rascunho permite rever o restante desenho sem inventar essa resposta.

Não foram fixados prazos: falta SLA, criticidade e calendário. Se forem adoptados dias úteis do Provia, a referência fixada exclui fins-de-semana e não calcula feriados nacionais. Campos, evidências específicas, rejeição e responsável pelo registo são recomendações/questões abertas, não requisitos extraídos.

Contexto territorial não fornecido: Angola é apenas ponto de partida provisório, sem conclusão legal. Fontes: duas secções citadas pelo utilizador; `references/provia-capabilities.md`, `references/country-context.md` e `references/countries/angola.md`. Não foi solicitado YAML; nenhuma validação, configuração ou publicação foi executada.
