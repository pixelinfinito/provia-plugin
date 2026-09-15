# Revisão dos fragmentos fornecidos
Skill aplicada: provia-workflow-review. Âmbito: 8 fragmentos; só o tipo, o nome e as operações explicitamente fornecidas. Não foram fornecidos IDs, descrições completas, bindings, permissões, prazos ou configurações de integração. Não é possível concluir validade de contrato nem prontidão para publicação a partir destes fragmentos.

## Constatações prioritárias
1. Questão de desenho: Standard «GC prepara; DG aprova; signatários executam» reúne preparação, aprovação e execução com autoridades distintas. Não renomear de modo a esconder essa diferença. Identificar objecto e confirmar se devem existir acções separadas; não se aplicou divisão, mudança de tipo ou encaminhamento.
2. Lacunas de configuração: decisões têm resultados indicados, mas falta conhecer consequências e destino de retorno; formulário e perfil IA precisam de referências reais; HTTP e Notification carecem da configuração real. Não se inventaram esses valores.
3. Correcções editoriais propostas abaixo. Nenhuma altera comportamento. Nomes aceitáveis foram mantidos após análise semântica, não por filtro de terminações.

| Fragmento | Nome observado | Correcção proposta | Verificação e pendência |
| --- | --- | --- | --- |
| F1 Decision | Aprovação da despesa | Decidir sobre a despesa | Abrange aprovação, recusa e devolução; preservar resultados existentes; configuração real necessária |
| F2 Form Fill | Protocolo de experiência | Registar o protocolo de experiência | Preservar título do formulário «Protocolo de experiência», ligação, mapeamentos e política de respostas quando fornecidos |
| F3 Standard | Propor uma alteração ao orçamento | Manter | Propor é infinitivo válido; proposta não equivale a aprovação |
| F4 Notification | Informar o DG sobre o desvio | Manter | DG é destinatário pertinente; não é actor redundante; resolver destinatários/canais reais |
| F5 HTTP Request | Consultar o estado do pagamento | Manter | Operação fornecida só lê estado; não renomear para Executar; preservar método, URL, mappings e segredos reais |
| F6 Standard | GC prepara; DG aprova; signatários executam | Pendente de clarificação do desenho | Múltiplos actos e autoridades; objecto em falta; não é mera correcção linguística |
| F7 Standard, inglês | Finance confirms receipt | Confirm receipt | Base-form verb; manter idioma inglês e atribuição Finance no handover/configuração |
| F8 Standard atribuído a IA | AI summary of supplier proposals | Summarize supplier proposals | Base-form verb; conservar perfil, contrato de saída e revisão humana se existentes; configuração não fornecida |

## Cenários representativos para execução posterior
- Normal: decisão aprovada segue o destino configurado; Form Fill regista a resposta no formulário correcto; HTTP apenas consulta; resumo IA produz o artefacto previsto. Destinos, evidências e artefactos ainda dependem das configurações reais.
- Recusado: decisão de recusa apresenta o resultado correspondente e cumpre a consequência definida; devolução leva ao destino configurado. Não se presume cancelamento ou destino inexistente nos fragmentos.
- Incompleto: formulário sem ligação, atribuição ausente ou resposta em falta devem ser identificados no setup/preview; não considerar o pacote pronto para publicação.
- Integração falhada: erro HTTP ou falha de entrega Notification/execução IA deve apresentar o estado e aplicar política real de erro/repetição; essas políticas não foram fornecidas e não foram inventadas.

Nenhum cenário foi executado. Não se identificou erro de contrato confirmado nestes fragmentos, pois falta o documento completo; as lacunas são separadas das recomendações editoriais. Permanecem pendentes validação estrutural do export completo, destino e revisão de publicação.

Evidência: oito fragmentos fornecidos neste ensaio. Referências lidas: /Users/marcoslisboa/Development/provia-plugin/skills/provia-workflow-review/SKILL.md; references/action-writing.md, provia-capabilities.md, country-context.md e countries/angola.md no mesmo plugin.
