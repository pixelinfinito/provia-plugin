# Plano para reaplicar o desenho anterior

Importar o YAML anterior não repõe o histórico: cria uma nova linhagem em rascunho. O YAML não é uma cópia de segurança dos registos, evidências e versões. Com seis pedidos ainda em curso e sem exportação dos registos, a compatibilidade de campos permanece por verificar; não se deve tratar a reimportação como reversão concluída.

## Comparação semântica disponível

| Elemento | Conhecido | Efeito/ponto em aberto |
|---|---|---|
| Campos obrigatórios | Pretende-se repor configuração anterior | Sem YAML actual e anterior, não é possível identificar nomes, tipos, obrigatoriedade ou valores incompatíveis |
| Pedidos activos | Existem seis | IDs, versão, etapa, valores e dependências não fornecidos |
| Histórico | Não existe exportação dos registos | Reimportação não recupera histórico nem permite demonstrar recuperação de evidência |
| Formulários e integrações | Não fornecidos | Formulários, ficheiros e outros recursos excluídos precisam de inventário e religação |
| Acções e responsáveis | Não fornecidos | Comparar para evitar que reaplicar campos reverta involuntariamente decisões ou responsáveis |

As acções de pedidos existentes são instanciadas, mas alguma validação de metadados consulta configuração ao nível do workflow. Por isso, não se assume isolamento completo dos seis pedidos perante uma alteração de campos. Desactivar obrigatoriedade pode permitir novos registos incompletos; tornar um campo obrigatório ou mudar o tipo pode bloquear actualizações de casos existentes. O efeito exacto depende da diferença real.

## Preparação e rascunho

1. Dono do processo e administrador recolhem o YAML actual e anterior e um retrato dos seis pedidos: ID, versão, estado, etapa, campos/valores necessários e referências a evidências. Preservar anexos, respostas de formulários e histórico disponível por meios suportados. Restringir acesso aos dados; não incluir segredos. A exportação ainda não existe e nada foi preservado nesta execução.
2. Comparar comportamento campo a campo e acção a acção. Classificar cada mudança como manter, reaplicar ou excluir e registar o motivo. Sem os ficheiros, esta comparação continua pendente.
3. Preparar uma nova versão em rascunho no workflow existente, reaplicando o desenho anterior pretendido. Se for necessário importar para obter uma cópia de referência, tratá-la como rascunho de nova linhagem; não a confundir com restauro. Não eliminar o workflow original.
4. Inventariar e conferir formulários, anexos, templates de páginas, tags e referências de destino que o YAML não transporta. Formulários de entrada publicam separadamente; definições de Form Fill são congeladas com a publicação do workflow. Planear estas alterações explicitamente.
5. Só definir a data efectiva e publicar após avaliar os seis pedidos e testar compatibilidade. Não transferir ou cancelar esses pedidos automaticamente. Se a mudança for incompatível, escolher com o dono do processo uma transição que preserve a execução deles, apoiada em ensaios reais; não presumir migração automática disponível.

## Ensaios necessários

- Novo pedido com os campos anteriores válidos: criação e conclusão esperadas.
- Novo pedido sem cada campo obrigatório: bloqueio onde a configuração final o exigir.
- Novo pedido sem um campo que passa a opcional: comportamento conforme desenho aprovado.
- Cópia sintética representativa de cada um dos seis pedidos: leitura, edição e transições antes/depois, sem perda de valores ou evidências.
- Campos de tipos diferentes, valores vazios, decisões, responsáveis e caminhos não alterados.
- Formulário de entrada e Form Fill da versão relevante: respostas, mapeamentos e obrigatoriedade.
- Integrações existentes: payloads com campos ausentes/antigos e resposta esperada.

Nenhum destes ensaios foi executado; não há acesso ao ambiente ou aos registos. A validação de YAML deve ser feita quando os ficheiros forem fornecidos, seguindo `provia-workflow-package`; não há resultado de validação nesta entrega.

## Recuperação se surgir uma falha

Registar os pedidos afectados e a diferença de configuração, evitar novas entradas na configuração problemática por controlo administrativo disponível, e preparar outro rascunho que reaplique a configuração verificada. Rever e testar antes de publicar. Não existe reversão geral com um clique e publicar outra versão não recupera dados já removidos. Recuperar valores/evidência exige o retrato preservado e um procedimento suportado; sem exportação ou outra cópia verificável, não se promete recuperação do que esteja em falta.

Responsáveis propostos: dono do processo aprova a semântica e a data; administrador preserva/configura; responsáveis dos seis pedidos validam continuidade; equipa de qualidade executa os ensaios. Todos os nomes e acções continuam pendentes.

Fontes: pedido do utilizador; `references/provia-capabilities.md`, `references/workflow-yaml.md` e skill `provia-workflow-change` do pacote. Território não fornecido; Angola é apenas contexto provisório, sem obrigação legal inferida. Nenhuma importação, alteração ou publicação foi realizada.
