# Catálogo para criação manual

A especificação em `catalogue.json` é a fonte editorial. `catalogue.html` foi gerado pelo script do plugin a partir desse JSON e funciona sem bibliotecas externas. Contém 24 campos de Cliente e 23 de Função profissional, além do Nome nativo. Os exemplos são inteiramente sintéticos.

O catálogo cobre contratação, facturação, entrega, renovação, recrutamento, integração, avaliação e desenvolvimento. Os campos estão agrupados, classificados como essenciais, condicionais ou opcionais e incluem manutenção, origem, sensibilidade, exemplos e verificações posteriores. O Nome é obrigatório na criação; os campos personalizados podem ser completados ao longo do ciclo de vida. Prontidão para cada processo exige confirmação humana dos dados indicados.

`registo_oficial` foi substituído, na proposta, por `conta_crm` e `descricao_aprovada`. Não foi removido nem criado qualquer campo numa instalação Provia. Não existem registos para migrar segundo o pedido. Confirmar eventuais definições de formulários, mapeamentos e workflows antes de alterar chaves já configuradas.

Os responsáveis, vocabulários e regras de revisão são propostas. Confirmar antes da configuração: atendimento a particulares; áreas e níveis; fonte financeira; tratamento de múltiplos contratos e locais; responsáveis e substitutos; acessos; cadência de manutenção; versão de destino. Outros tipos organizacionais precisam de um levantamento de processos: não foram inventados apenas para ampliar o catálogo.

## Verificações executadas

- Validador editorial do plugin: aprovado, dois tipos.
- Geração de HTML: concluída pelo script do plugin.
- JSON incorporado no HTML: igualdade exacta com o ficheiro de origem.
- Alvos dos 342 botões de cópia: referências internas existentes, verificação estática.
- Sintaxe dos exemplos de datas, URLs, emails e referências simbólicas a utilizadores: aprovada.
- Não existem valores predefinidos nem IDs de destino inventados.
- Percurso manual de um registo sintético de cada tipo: descrito em Configuração e dependências, sem criar registos.

A política de segurança do navegador bloqueou a navegação `file://` para o HTML local. Não foi tentado qualquer desvio. A inspecção visual renderizada, cópia de descrição, cópia de valor/rótulo de opção, pesquisa, navegação e descarregamento no navegador não foram executados. A verificação estática não substitui esses ensaios. Os resultados e hashes estão em `checks.json`.

Não houve ligação ao Provia, instalação de software, publicação nem alteração de repositórios.

## Criação e conferência

1. Abrir o HTML local e conferir visualmente um cartão de cada tipo. Ensaiar cópia de descrição e opções, pesquisa, ligação de navegação e descarregamento JSON.
2. Rever as decisões abertas e confirmar ícones, tipos de campo e permissões na instalação de destino.
3. Criar os dois tipos e configurar campos por grupo, copiando valores para as propriedades correspondentes. Este JSON não é importável no Provia.
4. Resolver referências a utilizadores reais e configurar etiquetas/mapeamentos fora de YAML, se usados.
5. Criar uma ficha de cada tipo com os dados conhecidos e completar os restantes antes dos respectivos processos, seguindo as listas de prontidão do catálogo.

Próxima skill recomendada: `provia-workflow-designer`, para converter as verificações humanas e mapeamentos em acções com responsáveis e evidências.

Pedido reutilizável:

> Use provia-workflow-designer com /private/tmp/provia-bim-complete-trial/catalogue.json e /private/tmp/provia-bim-complete-trial/catalogue.html. Desenhe os processos consumidores e as verificações de prontidão, preservando a recolha faseada, as fontes CRM/documento de funções e a manutenção manual sem integração. Trate as decisões abertas como pendentes. País: Angola; responda em pt-AO.
