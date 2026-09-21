# Pedido de compra — diagnóstico da exportação de Setembro de 2026: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização |
| compras | Pedido de compra | Registar o actor no registo canónico de grupos ou mapeá-lo para uma chave existente (`auditoria`) |
| compras / registar | Registar | Atribuir o grupo à acção depois de o grupo existir (`compras`) |
| compras / registar | Registar | Definir o prazo; o desenho não propõe `due` |
| compras / decidir | Decidir | Atribuir o grupo à acção depois de o grupo existir (`financas`) |
| compras / decidir | Decidir | Definir o prazo; o desenho não propõe `due` |
| compras / encomendar | Encomendar | Atribuir o grupo à acção depois de o grupo existir (`compras`) |
| compras / encomendar | Encomendar | Definir o prazo; o desenho não propõe `due` |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `compras` | internal | apenas criador e administradores da organização (`default: creator_only`) | — | Provisório: as permissões reais do workflow publicado não foram fornecidas nem lidas do tenant. Declarado apenas para o manifesto passar a verificação estrutural; confirmar em D5 antes de qualquer reutilização. | — |
| `compras` | internal | `group:compras` | — | Vê apenas os seus casos (sem concessão) | — |
| `compras` | internal | `group:financas` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `compras` Compras [team]: Regista o pedido e executa a encomenda após decisão favorável (conforme descrição do workflow publicado).
- `financas` Finanças [team]: Decide sobre o pedido de compra (conforme descrição do workflow publicado).

## Decisões em aberto

- **D1** Que versão do workflow (ou que outro workflow com prefixo COMP) gerou o caso COMP-88 no estado «Aguardar auditoria» atribuído ao grupo «Auditoria»? O desenho publicado descrito só tem «Registar», «Decidir» e «Encomendar» com Compras e Finanças. Confirmar no Provia o histórico do caso e a versão activa (Workflows › versões; ou, em modo ligado, workflow_get / workflow_export_yaml). (Dono: Administrador da organização Provia)
- **D2** Porque é que COMP-90 aparece concluído (2026-09-08) antes de ser criado (2026-09-10)? Verificar no histórico do caso no Provia as duas datas reais; confirmar se a exportação foi editada, se as colunas foram trocadas ou se o caso foi migrado com datas retroactivas. Até lá, a exportação não serve para medir tempo de ciclo. (Dono: Quem produziu a exportação (a identificar) e Administrador da organização Provia)
- **D3** A etapa de auditoria faz parte do processo pretendido? Se sim, o desenho publicado tem de ser alterado (nova versão com a acção de auditoria, o seu responsável e prazo) via provia-workflow-change; se não, COMP-88 tem de ser devolvido a um responsável do desenho (Compras ou Finanças) e o grupo «Auditoria» deixa de ser usado neste workflow. (Dono: Dono do processo de compras (Compras))
- **D4** Confirmar a distribuição das acções publicadas pelos grupos. Suposição registada: «Registar» e «Encomendar» → Compras; «Decidir» → Finanças. O utilizador indicou apenas que as três acções estão atribuídas a Compras e Finanças. (Dono: Dono do processo de compras (Compras))
- **D5** Quais são as permissões reais do workflow publicado (quem vê, quem abre, quem edita)? O manifesto declara «creator_only» apenas como valor provisório para a verificação estrutural; não representa o tenant. (Dono: Administrador da organização Provia)
- **D6** Mudança proposta e mensurável: adoptar uma exportação de referência produzida directamente do Provia (versão do workflow, hora de observação, fuso horário, datas UTC, datas-limite, responsável) e reconciliá-la com o desenho publicado antes de cada diagnóstico. Medidas: (a) percentagem de casos cujo estado e responsável correspondem ao desenho publicado — alvo 100%; (b) número de casos com data de conclusão anterior à de criação — alvo 0; (c) só depois: tempo de ciclo mediano de «Registar» a «Encomendar» com dois períodos comparáveis. Aceitar, atribuir e datar a primeira medição. (Dono: Dono do processo de compras (Compras), com o Administrador da organização Provia)

## Notas de configuração

- `compras`: Diagnóstico de 2026-09-21 (diagnostico-compras.md): a exportação contradiz o desenho publicado (grupo «Auditoria» e estado «Aguardar auditoria» em COMP-88; datas invertidas em COMP-90). Não interpretar indicadores de desempenho desta exportação até as decisões D1–D3 estarem resolvidas.
- `compras`: Antes do próximo diagnóstico, exportar directamente do Provia com: identificador da versão do workflow, hora de observação e fuso horário, datas de criação/conclusão em UTC, datas-limite e responsável por acção.
- `compras`: Os nomes das acções («Registar», «Decidir», «Encomendar») foram mantidos tal como publicados; a reescrita para o brief de cinco partes fica para provia-workflow-change quando D3 for decidida.

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
