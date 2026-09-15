# Configuração pendente

## Factos confirmados
Fonte: pedido fornecido para este ensaio. Organização em Angola; língua portuguesa; moeda AOA; contexto Africa/Luanda. GC confirma com comprovativo uma gratificação já paga pelos signatários. A chefia propõe uma alteração ao orçamento. Depois, DG decide o investimento por marco até 15 milhões AOA, com Aprovar, Recusar e Devolver. O formulário chama-se «Confirmação de recepção» e é preenchido durante o caso. Não foram fornecidos IDs.

## Proposta, não política aprovada
Um caso por marco, início manual e sequência: confirmar pagamento → propor alteração → confirmar recepção → decidir investimento. A colocação do formulário antes da decisão é provisória: a fonte não estabelece a sua posição nem o objecto recebido. Os dois campos estruturados são recomendados para identificar o marco e o montante; confirmar a sua obrigatoriedade.

Aprovar continua e, sendo a última acção, permite concluir o percurso. Recusar cancela o caso. Devolver regressa a propor_alteracao. Estas consequências são uma proposta para tornar os três resultados reviewáveis, não regras fornecidas. Confirmar especialmente o destino da devolução e se o formulário deve repetir-se. Não há pagamento adicional nem encaminhamento automático por valor. Não foram inventados prazos, escalamentos, assinaturas exigidas, retenção ou critérios de aprovação.

## Atribuições a resolver
| Acção | Executor pretendido | Pendência |
| --- | --- | --- |
| confirmar_gratificacao | GC | Resolver utilizador/grupo real e significado organizacional da sigla |
| propor_alteracao | Chefia | Resolver utilizador/grupo real |
| confirmar_recepcao | Não fornecido | Determinar executor e referência real |
| decidir_investimento | DG | Resolver referência real e autoridade |

assignee foi omitido deliberadamente em todas as acções. Não se substituiu GC, chefia ou DG pelo criador. Rever qualquer valor por defeito atribuído pelo importador; não estabelece autoridade. Signatários são participantes do pagamento já ocorrido, não uma nova tarefa de execução.

## Formulário e recursos fora do YAML
Criar ou ligar «Confirmação de recepção» em Provia. Preservar este título; «Confirmar a recepção» é o nome da acção. Definir objecto da recepção, perguntas, campos obrigatórios, uma ou várias respostas, acesso e eventual mapeamento. Não foram inventadas perguntas nem mapeamentos. Múltiplas respostas não devem disputar mapeamento para metadados. A definição e ligação não são portáveis.

Associar o comprovativo real ao caso pelo mecanismo de ficheiros da instância; nenhum documento empresarial foi lido ou incluído. Não há workflows externos, entidades, tags, modelos de página, documentos de memória, perfis de IA, segredos, chamadas HTTP, allowlists ou endereço de email de entrada necessários a esta proposta. assignmentStrategy, se necessário, fica para configuração na instância.

## Decisões em aberto
Confirmar se as actividades pertencem ao mesmo processo e se a ordem proposta é correcta. Definir critérios de decisão, tratamento acima de 15.000.000 AOA, interpretação do limite por marco e eventuais acumulações. Não há fundamento fornecido para regras legais. O limite é uma informação organizacional do pedido, não uma obrigação legal verificada.

## Validação
validation.json é o stdout exacto do validador incluído no plugin. Sem erros; aviso de ligação do Form Fill; atribuições pendentes; schema backend aprovado; destino não verificado; publicação não pronta. Executado apenas offline. Na instância ainda se exigem referências reais, ligação do formulário, preview/importação ou dry run do servidor, verificação dos percursos e revisão humana antes de publicar. Nenhuma importação ou publicação ocorreu. Não é um backup completo.

## Referências consultadas
- Pedido fornecido neste ensaio (fonte de negócio).
- Plugin local: references/action-writing.md; references/workflow-yaml.md; references/action-configs.md; references/provia-capabilities.md; references/country-context.md; references/countries/angola.md.
- Contrato: contracts/workflow-v1/contract-lock.json, revisão e2875535d29dc976127ee01ebea028cd717a46a5.
- Estrutura inicial adaptada de examples/procurement/workflow.yaml; não se conservaram os responsáveis creator do exemplo.
Todos os caminhos do plugin são relativos a /Users/marcoslisboa/Development/provia-plugin.
