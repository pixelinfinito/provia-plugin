# Diagnóstico do processo «Pedido de compra» (prefixo COMP)

Data do diagnóstico: 2026-09-21 · País: Angola · Fuso de referência: Africa/Luanda · Língua: pt-AO
Gerado por `provia-skills/1.2.0` (`provia-diagnose`), em modo desligado. Nada foi lido nem alterado no Provia.

## 1. O que foi fornecido

| Elemento | Fornecido? | Detalhe |
| --- | --- | --- |
| Ficheiro de exportação | **Não** | Não existe nenhum ficheiro no directório de trabalho. A «exportação» consiste em dois registos descritos em prosa pelo utilizador (COMP-88 e COMP-90). |
| Período da exportação | Não | Desconhecido. |
| Hora de observação e fuso horário | Não | Desconhecidos. As datas de COMP-90 vêm sem hora nem fuso. |
| Versão do workflow que gerou os casos | Não | Só foi descrito o desenho publicado: acções «Registar», «Decidir», «Encomendar», grupos Compras e Finanças. Sem YAML exportado nem identificador da versão activa. |
| Datas-limite, responsáveis por acção, comentários | Não | — |
| Períodos comparáveis | Não | Um único excerto; não há segundo período. |
| Manifesto do projecto | Não existia | Criado neste diagnóstico (`provia-project.json`). |

Modo ligado: o anfitrião expõe o servidor MCP do Provia (`org_get_context`), mas a autorização para o chamar não foi concedida nesta sessão. O tenant **não** foi consultado; tudo o que se segue assenta apenas na descrição fornecida. Este relatório é uma leitura de um retrato parcial, não uma monitorização em tempo real.

Suposições registadas (ver `decisions[]` no manifesto):
- D4 — «Registar» e «Encomendar» pertencem a Compras; «Decidir» pertence a Finanças. O utilizador disse apenas que as três acções estão atribuídas aos dois grupos.
- D5 — As permissões do workflow são desconhecidas; o manifesto declara `creator_only` como valor provisório para passar a verificação estrutural.

## 2. Contradição entre a exportação e o desenho (a tratar antes dos números)

A regra do procedimento é clara: quando a exportação contradiz o desenho, o desencontro é reportado antes de interpretar qualquer indicador. Aqui há duas contradições, e ambas invalidam a exportação como base de medição.

### 2.1 COMP-88 — estado «Aguardar auditoria», grupo «Auditoria»

**Facto confirmado (pela descrição):** o caso COMP-88 aparece num estado chamado «Aguardar auditoria» e atribuído ao grupo «Auditoria». O desenho publicado descrito tem exactamente três acções («Registar», «Decidir», «Encomendar») e dois grupos (Compras, Finanças). Nenhum destes elementos pode produzir um passo ou um responsável chamado «Auditoria».

**Interpretação (hipóteses, por ordem de probabilidade):**
1. **A versão activa não é a que foi descrita.** No Provia, a publicação cria uma versão activa e os novos casos usam esse desenho; os casos existentes mantêm as acções já instanciadas (referência: `provia-capabilities.md`, secção sobre publicação). Se alguém publicou uma versão com uma acção de auditoria depois do desenho ter sido descrito — ou se COMP-88 nasceu de uma versão anterior que a tinha — a exportação está certa e a descrição do desenho está desactualizada.
2. **Outro workflow com o mesmo prefixo COMP** ou outro ambiente (teste vs. produção) contribuiu para a exportação.
3. **Reatribuição manual do caso** a um grupo «Auditoria» criado no tenant fora do desenho, com um estado escrito à mão (comentário, etiqueta ou campo de metadados exportado como «estado»).
4. **Exportação editada** fora do Provia (folha de cálculo).

Nenhuma destas hipóteses pode ser confirmada com o que foi fornecido. O registo a inspeccionar a seguir é o **histórico do caso COMP-88 no Provia** (quem o atribuiu a «Auditoria», quando, e em que versão do workflow foi criado) e a lista de versões do workflow. Em modo ligado, com autorização, `workflow_get` com versões e `workflow_export_yaml` da versão activa responderiam a isto sem intervenção manual.

### 2.2 COMP-90 — concluído antes de ser criado

**Facto confirmado (pela descrição):** criado em 2026-09-10, concluído em 2026-09-08. A conclusão precede a criação em 2 dias de calendário.

**Interpretação:** uma diferença de fuso horário nunca inverte datas em dois dias (o maior desvio possível é inferior a 26 horas). Restam: colunas trocadas ou desalinhadas na exportação, edição manual, um caso migrado/importado com data de conclusão retroactiva, ou um campo de metadados (por exemplo, uma «data de conclusão» pedida pelo requerente) exportado no lugar da data real de fecho. Enquanto D2 não for resolvida, **qualquer cálculo de tempo de ciclo que inclua COMP-90 é inválido** e, por arrasto, a fiabilidade das restantes datas da mesma exportação fica em dúvida.

## 3. Lista de atenção (triagem)

Sem hora de observação nem datas-limite, não é possível afirmar que algum caso esteja **atrasado**. A lista distingue por isso apenas o que está **bloqueado por incoerência** do que está **em espera**.

| # | Registo | Classificação | Razão (evidência) | Quem pode agir | Próximo passo sugerido |
| --- | --- | --- | --- | --- | --- |
| 1 | COMP-88 | **Bloqueado — responsável fora do desenho** | Estado «Aguardar auditoria» e grupo «Auditoria» não existem no desenho publicado (secção 2.1). Um grupo que o desenho não conhece não tem prazo, instruções nem critério de conclusão definidos; o caso pode ficar parado sem que ninguém o veja na sua fila. | Administrador da organização Provia (histórico e versões); dono do processo em Compras (decidir se a auditoria pertence ao processo — D3) | Abrir o histórico de COMP-88; identificar a versão de origem e quem atribuiu ao grupo «Auditoria». Se a auditoria não for pretendida, devolver o caso ao responsável da acção correcta (Compras ou Finanças, conforme D4). Nenhuma acção foi executada por este diagnóstico. |
| 2 | COMP-90 | **Dados inconsistentes — excluir das métricas** | Conclusão (2026-09-08) anterior à criação (2026-09-10) (secção 2.2). | Quem produziu a exportação; Administrador da organização Provia | Confirmar no Provia as datas reais de criação e fecho; corrigir a rotina de exportação (D2). |
| — | Casos COMP-1…COMP-87, COMP-89 e posteriores | **Sem informação** | Não descritos. Não se sabe quantos estão abertos, em que acção, nem se há duplicados ou lacunas de numeração. | — | Entregar a exportação completa (secção 5). |

Registos em falta ou duplicados: não verificável com dois registos. Ausência de datas-limite: nenhuma afirmação de atraso é feita.

## 4. Desempenho (melhoria de processo)

### 4.1 O que não pode ser calculado

- **Tempo de ciclo** (criação → conclusão): amostra de 1 caso concluído (COMP-90) com datas invertidas. Resultado: −2 dias, o que não é um tempo de ciclo, é um erro de dados. Denominador válido: 0.
- **Trabalho activo vs. espera por acção:** não há timestamps de activação/conclusão por acção.
- **Comparação entre períodos:** só existe um excerto. A comparação fica marcada como **ainda não possível**.
- **Confundidores** (volume, complexidade, alteração de versão): não avaliáveis; a própria existência de uma versão diferente (D1) é o principal confundidor por identificar.

Nenhum indicador de desempenho é apresentado porque nenhum seria reproduzível.

### 4.2 Uma mudança, com mecanismo e medida (D6)

**Mudança proposta:** instituir uma **exportação de referência** produzida directamente do Provia — com identificador da versão do workflow, hora de observação e fuso horário, datas de criação/activação/conclusão em UTC, datas-limite e responsável por acção — e **reconciliá-la com o desenho publicado** antes de cada diagnóstico.

**Mecanismo:** as duas anomalias encontradas são exactamente as que uma reconciliação automática apanha (estado/responsável fora do desenho; datas impossíveis). Sem esta base, qualquer melhoria posterior ao processo de compras seria medida contra números que não se sabe se descrevem o processo.

**Dono:** dono do processo de compras (Compras), com o Administrador da organização Provia a produzir a exportação.

**Medidas e alvos:**
1. Percentagem de casos cujo estado e responsável correspondem a uma acção e a um grupo do desenho publicado — alvo 100 %.
2. Número de casos com data de conclusão anterior à de criação — alvo 0.
3. Só depois de (1) e (2) atingidos: tempo de ciclo mediano de «Registar» a «Encomendar», por versão do workflow, em dois períodos comparáveis (por exemplo, Setembro e Outubro de 2026), separando tempo em «Decidir» (espera pela decisão) do restante.

**Fórmulas a usar quando houver dados:** tempo de ciclo = conclusão − criação, em dias de calendário, apenas para casos concluídos e criados na mesma versão; excluir casos migrados; indicar sempre o denominador. Não inferir desempenho individual a partir de durações de casos.

Nota de produto: os relatórios do Provia dependem do plano e das permissões, e o envio agendado de relatórios não está implementado na base de referência; a exportação terá de ser produzida manualmente em cada medição.

## 5. Ligação entre triagem e melhoria

| Item | É sintoma da mudança proposta? | Precisa de… |
| --- | --- | --- |
| COMP-88 fora do desenho | Sim — a reconciliação detecta-o; mas a **causa** exige decisão (D1, D3). | `provia-workflow-change` se a auditoria for pretendida (nova versão com a acção «Auditar …», responsável, prazo, e plano para os casos abertos); caso contrário, apenas correcção operacional do caso e do grupo no Provia. |
| COMP-90 datas invertidas | Sim — é a medida (2) da mudança. | Correcção da exportação (D2); nenhuma alteração ao workflow. |
| Desenho descrito sem prazos, evidências nem briefs de cinco partes | Não visível na exportação, mas o manifesto criado mostra-o (`setup.md`, itens «Definir o prazo»). | `provia-workflow-change` / `provia-process-knowledge` quando D3 e D4 estiverem decididas. |

## 6. Decisões registadas no manifesto (`provia-project.json` → `decisions[]`)

| Id | Questão (resumo) | Dono | Estado |
| --- | --- | --- | --- |
| D1 | Que versão/workflow gerou COMP-88 com «Aguardar auditoria» e grupo «Auditoria»? | Administrador da organização Provia | aberta |
| D2 | Porque é que COMP-90 tem conclusão anterior à criação? | Quem produziu a exportação; Administrador Provia | aberta |
| D3 | A auditoria faz parte do processo pretendido? | Dono do processo (Compras) | aberta |
| D4 | Distribuição das três acções por Compras e Finanças (suposição actual) | Dono do processo (Compras) | aberta |
| D5 | Permissões reais do workflow publicado | Administrador da organização Provia | aberta |
| D6 | Adoptar a exportação de referência e as três medidas | Dono do processo (Compras) + Administrador Provia | aberta |

O grupo «Auditoria» ficou registado em `workflows[0].unresolvedActors` e **não** foi criado como grupo do manifesto: a sua existência legítima depende de D3.

## 7. Limites dos dados e do que foi verificado

- Verificado: `node scripts/build-project-map.mjs provia-project.json --check` correu sem erros nem avisos (2 informações da regra 4 de acesso: Compras e Finanças vêem apenas os seus casos); 1 actor não resolvido (`auditoria`); 16 itens pendentes em `setup.md`. Esta verificação valida a estrutura do manifesto, não este relatório nem a correcção do processo.
- Gerados: `provia-project.json`, `project.html`, `setup.md`, este relatório. Os itens «Importar o YAML como rascunho» e «Grupos a criar» em `setup.md` reflectem a ausência de recibos no manifesto (modo desligado), não uma instrução para recriar o que já está publicado.
- Não verificado: o tenant Provia, a versão activa, o histórico dos casos, as permissões, o ficheiro de exportação (inexistente).
- Nenhuma acção foi concluída, nenhum caso reatribuído, nenhuma mensagem enviada, nada publicado.

## 8. O que o cliente deve produzir para o próximo diagnóstico

1. Exportação completa dos casos COMP directamente do Provia, indicando hora de observação e fuso horário, com: id do caso, versão do workflow, acção actual, responsável (grupo/utilizador), datas de criação, activação e conclusão por acção em UTC, data-limite, estado.
2. YAML exportado da versão activa do workflow (ou autorização para leitura em modo ligado).
3. Histórico dos casos COMP-88 e COMP-90.
4. Um segundo período comparável (mesma versão do workflow) quando existir.
