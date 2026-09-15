# Modelo de informação para os pilotos

Recomendo criar dois tipos de entidade, **Fornecedor** e **Equipamento**, e identificar a empresa contratante nos dados de cada compra. A Marcação de férias será um caso do respectivo processo, com o registo oficial em CH. Não há justificação, no uso descrito, para criar uma entidade adicional por pedido de férias.

Esta proposta usa Angola e pt-AO. Os exemplos são sintéticos. Nada foi criado ou verificado na interface de destino. Não há integração nem sincronização com a contabilidade ou CH.

## Catálogo para criação manual

| Configuração | Fornecedor | Equipamento |
| --- | --- | --- |
| Nome do tipo | Fornecedor | Equipamento |
| Unidade de registo | Uma contraparte fornecedora, reutilizada nas compras e avaliações anuais | Um bem físico individual, reutilizado nos casos de manutenção |
| Justificação | A identidade mantém-se entre vários pedidos e avaliações | A identidade mantém-se entre intervenções de manutenção |
| Descrição para colar | Fornecedores seleccionados nos pedidos de compra e nas avaliações anuais. Permite identificar a contraparte e consultar a sua situação de validação. | Equipamentos associados aos casos de manutenção recorrente. Permite identificar o bem e consultar a sua situação corrente. |
| Ícone | `Truck01`, associado ao fornecimento | `Tool01`, associado a equipamentos e manutenção |
| Convenção do Name nativo | Nome comercial ou razão social; acrescentar o número do fornecedor apenas quando necessário para distinguir homónimos | Número de activo e designação curta, quando o número for conhecido; caso contrário, designação e localização distintiva |
| Exemplo de Name | Fornecedor Demonstração Alfa | EQ-DEMO-001 · Bomba de água |
| Manutenção do cadastro | Compras, com Finanças a confirmar a referência contabilística | Responsável pelo parque de equipamentos |

Os ícones constam do catálogo verificado na revisão `36772f7ce0831f0ea6f85a0e3e7849d32e576655`. `IconTruckDelivery` não consta desse catálogo: substituir por `Truck01`. A disponibilidade dos ícones na instalação de destino continua por confirmar. As convenções de Name são instruções de preenchimento manual, não geração automática. [Catálogo de ícones](../../../references/entity-icons.json)

A descrição proposta para Fornecedor, que prometia bloquear automaticamente compras, deve ser substituída pelo texto acima. O campo `supplier_validation` guarda uma classificação. O bloqueio depende do desenho e execução do processo de compra.

Não criar o tipo de entidade Marcação de férias. A designação do caso pode ser `Pedido de férias · pessoa · período`, usando apenas os dados necessários e com acesso apropriado. A descrição do futuro workflow, se necessário, poderá ser: "Pedidos de marcação de férias, com análise da equipa responsável e registo da decisão no sistema CH." Não é necessária configuração de ícone ou Name de entidade para este tipo recusado.

## Decisão sobre todos os campos comuns propostos

Aplicar estas decisões a Fornecedor e Equipamento.

| Campo proposto | Decisão | Motivo e destino |
| --- | --- | --- |
| `record_key` | Não criar | O UUID nativo identifica o registo Provia; números de negócio mantêm campos próprios. |
| `display_name` | Usar Name nativo | Evita preencher e manter o mesmo nome duas vezes. Name é obrigatório. |
| `source_system` | Não criar agora | Documentar a contabilidade como origem de `vendor_number` nas instruções do cadastro. A origem dos dados do equipamento ainda precisa de confirmação. Não existe consumo que justifique um campo por registo. |
| `source_record_id` | Não criar agora | `vendor_number` já fornece a referência concreta conhecida. Não foi indicado outro ID externo utilizado por um processo. |
| `source_url` | Adiado | Só acrescentar se existir ligação estável que a equipa realmente use para consultar o registo de origem, com responsável pela sua manutenção. |
| `verified_at` | Guardar a verificação no caso que a produz | A avaliação anual e a validação devem ter responsável, data e evidência no respectivo caso. Só acrescentar uma data ao cadastro se surgir uma necessidade de consulta ou relatório e uma regra de actualização. `updatedAt` não comprova verificação. |

O UUID, o criador e os timestamps são nativos. Não é necessário recriá-los como campos personalizados. Uma futura integração terá de justificar os seus próprios identificadores. [Desenho de entidades](../../../references/entity-design.md)

## Dicionário de campos retidos

`required` refere-se à criação do registo, não à autorização para concluir uma compra ou iniciar uma intervenção. Os valores de selecção abaixo são estáveis, em ASCII. Os rótulos são apresentados aos utilizadores. As responsabilidades indicadas são recomendações a atribuir a pessoas ou grupos reais.

### Fornecedor

| Prioridade e chave | Rótulo e ajuda | Tipo; required; opções; default | Exemplo | Uso, origem e manutenção | Sensibilidade |
| --- | --- | --- | --- | --- | --- |
| Mínimo: `vendor_number` | Número do fornecedor. "Copie o número existente na contabilidade. Preserve zeros iniciais e confirme a empresa contabilística a que pertence." | `text`; `false`; sem opções; sem default | `FOR-DEMO-0042` | Compras e Finanças conciliam a contraparte com a contabilidade. Finanças preenche ou confirma antes da contratação. Não é criado um novo código Provia. | Informação comercial interna |
| Mínimo: `supplier_validation` | Situação de validação. "Registe a decisão de validação mais recente e conserve a justificação no caso correspondente." | `select`; `true`; `unverified` = Por validar, `validated` = Validado, `blocked` = Bloqueado; default `unverified` | `unverified`; depois da validação, `validated` | Compras consulta antes de autorizar a contratação; a equipa designada actualiza após validação, avaliação ou bloqueio. Origem: decisão documentada no processo. | Decisão interna de avaliação de terceiros |
| Opcional justificado: `nif` | NIF. "Transcreva o NIF da documentação confirmada por Finanças quando necessário para identificar a contraparte." | `text`; `false`; sem opções; sem default | `NIF-DEMO-001`, texto fictício sem validade fiscal | Apoio à identificação e conferência documental em compras. Finanças mantém. Activar se a equipa confirmar este uso; caso contrário, deixar na contabilidade/documentação. | Identificador fiscal; pode identificar pessoa singular |

O exemplo proposto `approved` não é um valor válido de `supplier_validation`. Para representar Validado, usar `validated`. O default `unverified` evita atribuir uma aprovação sem avaliação. Não impõe qualquer controlo automático.

`vendor_number` pode ficar vazio na criação porque quem abre o registo pode não ter acesso imediato à contabilidade. Continua a ser um campo mínimo do modelo, pois o número existe e tem uso concreto. Antes de contratar, Finanças deverá confirmá-lo. Não usar um URL neste campo.

| Campo adicional proposto | Decisão |
| --- | --- |
| `country_code` | Adiado. Angola é o contexto da operação, não prova do país de cada fornecedor. Não preencher `AO` por defeito. Acrescentar apenas se fornecedores de vários países exigirem tratamento ou relatórios distintos; então definir opções, origem e responsável. |
| `bank_account` | Manter na contabilidade ou no processo financeiro restrito que valida pagamentos. Nenhum dos pilotos descritos exige um cadastro bancário paralelo no Provia. Não copiar para campos ou formulários de compra por rotina. |

### Equipamento

| Prioridade e chave | Rótulo e ajuda | Tipo; required; opções; default | Exemplo | Uso, origem e manutenção | Sensibilidade |
| --- | --- | --- | --- | --- | --- |
| Mínimo: `asset_number` | Número do activo. "Copie o número patrimonial existente. Não invente um número para completar o registo." | `text`; `false`; sem opções; sem default | `EQ-DEMO-001` | Identificação do bem em cada manutenção. Responsável pelo parque copia da etiqueta ou cadastro patrimonial, cuja fonte deve ser confirmada. | Informação patrimonial interna |
| Opcional justificado: `serial_reference` | Número de série. "Transcreva o número do fabricante quando ajudar a distinguir o bem ou a prestar assistência." | `text`; `false`; sem opções; sem default | `SN-DEMO-007` | Técnico consulta em diagnóstico e assistência; responsável pelo parque mantém a partir da placa ou documento do equipamento. | Identificação interna do equipamento |
| Opcional justificado: `custodian` | Responsável pela guarda. "Indique a pessoa ou equipa que confirma a localização e disponibiliza o equipamento para manutenção." | `text`; `false`; sem opções; sem default | `Equipa de manutenção de Luanda` | Coordenação da intervenção. Responsável pelo parque actualiza quando muda a guarda. Texto evita exigir que toda a pessoa responsável tenha conta Provia. | Informação profissional; dado pessoal se contiver nome |
| Opcional justificado: `asset_state` | Situação do equipamento. "Actualize após confirmar a situação física do bem; este valor não é o estado do caso de manutenção." | `select`; `false`; `operational` = Operacional, `out_of_service` = Fora de serviço, `retired` = Retirado de uso; sem default | `operational` | Apoia a preparação de intervenções. Responsável pelo parque actualiza após informação confirmada pela manutenção. Vocabulário proposto, sujeito a aprovação da equipa. | Informação operacional interna |

Se a equipa só souber a designação e localização ao criar o registo, pode deixar os campos desconhecidos vazios. Antes de executar a manutenção, deverá confirmar a identidade física através do número patrimonial, número de série ou evidência suficiente. Não marcar o equipamento como Operacional por defeito.

`custodian` não atribui acções automaticamente. Se o piloto exigir selecção de uma conta Provia real, substituir a opção de texto por `user` após confirmar a cobertura das contas e resolver os registos existentes. Não usar nomes ilustrativos como UUIDs. A classificação de sensibilidade também não cria permissões ao nível do campo.

## As duas empresas legais

A organização Provia é o espaço de trabalho comum. Não identifica, por si só, quem contrata. Para este piloto, usar um select controlado nos metadados do caso de compra, sem criar já outro catálogo de entidades.

| Chave | Rótulo e ajuda | Tipo e required | Opções e exemplo | Origem, manutenção e sensibilidade |
| --- | --- | --- | --- | --- |
| `contracting_company` | Empresa contratante. "Seleccione a empresa legal em cujo nome a compra será contratada." | `select`; `true` na abertura da compra; sem default | Valores propostos `company_a` e `company_b`; os rótulos devem ser as duas razões sociais reais. Exemplo sintético: `company_a`. | Requerente selecciona; Compras/Finanças confirma antes da contratação. Administrador mantém as opções aprovadas por Finanças. Informação comercial interna. |

As opções `company_a` e `company_b` são códigos propostos, não IDs do destino. Substituir os rótulos provisórios pelas razões sociais reais antes de disponibilizar o formulário. Se as entradas por email não permitirem este dado na abertura, a recepção deverá recolhê-lo antes de prosseguir e o desenho deverá ajustar a obrigatoriedade nesse canal.

Não acrescentar automaticamente a empresa contratante a cada fornecedor: o mesmo fornecedor pode servir as duas empresas. Também não a exigir em todos os equipamentos sem demonstrar que a propriedade legal é necessária à manutenção.

Há uma decisão pendente que afecta `vendor_number`: confirmar se o fornecedor tem um número global ou números diferentes em cada empresa contabilística. Com um número global, o campo acima basta. Se forem diferentes, o campo único não representa a relação completa. Nesse caso, conservar a identidade comum do fornecedor e consultar o número correcto na contabilidade para cada compra, guardando-o no caso com a empresa correspondente; só desenhar um cadastro de relações contabilísticas se a repetição justificar a manutenção adicional. Não juntar dois números numa string sem regra, nem prometer unicidade automática por empresa e número.

Confirmar também se `supplier_validation` vale para toda a organização. Se cada empresa decidir separadamente, não usar um estado global como autorização: guardar a avaliação aplicável à empresa no caso de compra e rever o modelo antes de o usar como fonte de aprovação.

## Dados dos casos, formulários e mapeamentos

- Em compras, seleccionar o Fornecedor através de um campo `entity`, por exemplo `supplier`, limitado ao tipo real criado no destino. Guardar empresa contratante, objecto e valor pedido nos metadados do caso quando necessários à decisão ou ao relatório. Facturas, propostas e justificação ficam como documentos ou evidência das acções.
- Na manutenção, seleccionar o Equipamento num campo `entity`, por exemplo `equipment`. Datas da intervenção, sintomas, trabalho realizado e resultado pertencem ao caso. Uma avaliação anual do fornecedor também é um caso, ligado ao Fornecedor; notas e conclusões de cada ano não devem substituir o histórico num único campo de cadastro.
- Na Marcação de férias, manter respostas de recolha no formulário. Mapear pessoa, período e decisão para metadados apenas quando necessários à execução ou a relatórios. Guardar a confirmação e, se útil para consulta, a referência do registo CH no caso. CH mantém o registo oficial; a equipa responsável efectua a actualização manual e confirma a conclusão no Provia.
- Um formulário de abertura pode mapear as referências seleccionadas e `contracting_company` para os metadados do respectivo caso. Os tipos de entidade e os UUIDs usados nos selectores só podem ser escolhidos depois da configuração real. Não foram inventados IDs.
- Se a decisão precisar de preservar o estado do fornecedor naquele momento, registar uma fotografia desse valor e a data da consulta no caso. A direcção é cadastro para caso, por consulta ou cópia configurada. Uma cópia não acompanha alterações posteriores do cadastro.
- Depois de uma avaliação ou manutenção, o responsável actualiza manualmente `supplier_validation` ou `asset_state` com base na decisão documentada. Esta direcção, caso para cadastro, não está automatizada nesta proposta.

Não são necessárias tags para o arranque. Empresa contratante, validação e situação do equipamento precisam de vocabulários controlados. Tags poderão servir classificações flexíveis futuras, como categorias de fornecimento, se existir um uso concreto.

Antes de contratar, uma acção humana deve consultar a situação actual do fornecedor e a evidência aplicável. Um fornecedor Bloqueado deve conduzir à interrupção ou resolução do pedido segundo a política aprovada. É necessário definir os resultados da acção Decision, responsáveis e eventuais excepções; o campo personalizado, isoladamente, não impede seleccionar o fornecedor nem contratar. [Capacidades Provia](../../../references/provia-capabilities.md)

## Ensaio de preenchimento manual

Este é um ensaio de desenho, sem criação de registos ou teste de interface.

1. Compras cria Fornecedor Demonstração Alfa com o Name e `supplier_validation = unverified`. Se tiver o número contabilístico confirmado, preenche `vendor_number = FOR-DEMO-0042`; caso contrário, deixa vazio até Finanças confirmar. Não volta a escrever o nome em `display_name`, nem procura um URL sem utilidade. O NIF só é transcrito se a conferência o exigir. Antes da compra, confirma-se a empresa contratante, a referência contabilística aplicável e a validação. A avaliação anual posterior tem o seu próprio caso e evidência.
2. O responsável pelo parque cria `EQ-DEMO-001 · Bomba de água` e preenche `asset_number = EQ-DEMO-001` a partir da etiqueta. O número também pode constar do Name para facilitar a pesquisa, mas isso obriga a manter ambos coerentes; se a interface permitir identificá-lo bem sem repetir o código no Name, usar apenas a designação distintiva. Preenche série, guarda e situação apenas se conhecidas. Se o número não existir ou ainda não for conhecido, usa um Name distintivo, como `Bomba de água · Edifício de demonstração`, e confirma a identidade física antes da primeira intervenção.
3. Para a Marcação de férias, abre-se apenas um pedido. A pessoa e o período são recolhidos no formulário; a equipa responsável analisa e regista a decisão em CH. Não se cria uma entidade duplicada nem um saldo de férias paralelo. Falta confirmar o significado exacto de CH e a referência que permite localizar o registo oficial, caso o processo precise dela.

Sem integração, a alteração de um número contabilístico, da guarda ou da situação do equipamento depende de actualização humana. Finanças e o responsável pelo parque precisam de aceitar esse trabalho. A evidência dos casos conserva o contexto das decisões; um campo de estado não substitui esse histórico.

## O que falta configurar e decidir

1. Confirmar os nomes das duas empresas legais, o âmbito dos números contabilísticos e se a validação do fornecedor é comum ou específica de cada empresa. São dependências para usar o cadastro como apoio à autorização da compra.
2. Atribuir responsáveis pelo cadastro, validação, avaliação anual e parque de equipamentos. Confirmar a fonte do número patrimonial e a necessidade efectiva de NIF, série, guarda e situação.
3. Criar manualmente os dois tipos, descrições, ícones e campos. Os tipos de entidade e eventuais tags exigem configuração fora do YAML de workflow. Confirmar os tipos de campo, ícones e opções na versão de destino.
4. Configurar os selectores de entidades nos workflows e formulários, com as referências reais; configurar a empresa contratante e os mapeamentos de abertura. As definições e ligações dos formulários também exigem configuração própria.
5. Desenhar os passos de validação e autorização, a consulta de fornecedores bloqueados, as excepções, a avaliação anual e a actualização manual após cada conclusão. Definir o que impede prosseguir por falta de número ou identificação suficiente. Não presumir que `required` na entidade resolve essas regras de processo.
6. Confirmar quem pode consultar e alterar dados fiscais e avaliações na configuração disponível. Se os acessos não forem adequados, manter os dados sensíveis no sistema de origem. Não foi verificada permissão por campo.
7. Executar um ensaio na instalação com uma compra de cada empresa, um fornecedor bloqueado, uma avaliação anual e duas manutenções do mesmo equipamento. Confirmar pesquisa, ausência de duplicação desnecessária e visibilidade dos dados. Como nada foi criado, não há migração a executar; se houver criação entretanto, rever formulários, mapeamentos e casos antes de renomear ou retirar campos.

As decisões de negócio fornecidas são a reutilização de fornecedores e activos, a avaliação anual, a existência de número contabilístico, as duas empresas legais, a ausência de integração e CH como origem oficial das férias. As opções de equipamento, responsabilidades e controlos acima são propostas. Não se fez uma avaliação de conformidade legal nem se presumiram obrigações fiscais a partir do contexto Angola. [Contexto Angola](../../../references/countries/angola.md)

Próximo passo recomendado: `provia-workflow-designer`, para transformar este modelo nas acções e decisões dos dois pilotos e resolver o âmbito por empresa.

```text
Use provia-workflow-designer com o modelo de informação em response.md. Desenhe os pilotos de compras e manutenção recorrente, incluindo consulta da validação, tratamento de fornecedor bloqueado, avaliação anual e actualizações manuais dos cadastros. Preserve os dois tipos Fornecedor e Equipamento e a empresa contratante por compra. Resolva o âmbito dos números contabilísticos e das validações nas duas empresas legais. Não existe integração; nada foi criado. País: Angola; responda em pt-AO.
```
