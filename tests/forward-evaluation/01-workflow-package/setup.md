# Pedido de compra — entrega e configuração

Foi preparado `workflow.yaml` a partir do exemplo de compras incluído na skill. Contexto confirmado: empresa em Angola; montantes em AOA; linguagem pt-AO. Africa/Luanda é a referência proposta de apresentação. Não foram introduzidos requisitos legais.

## Comportamento do rascunho

1. O requerente regista/confere necessidade, montante e três propostas.
2. A chefia decide: Aprovar prossegue para Finanças; Rejeitar cancela o pedido (`cancel_incident`) e exige comentário. Rejeição termina o pedido sem executar a confirmação orçamental.
3. Finanças documenta a disponibilidade orçamental e conclui a acção.

A ordem chefia → Finanças é uma interpretação da sequência pedida. Não foram definidos prazos, limites de aprovação ou um caminho para orçamento indisponível: são decisões de política ainda não fornecidas. Até se definir a excepção, Finanças não deve concluir a acção sem confirmação. Não existe aprovação automática por montante.

## Responsáveis e limites do YAML

O registo foi atribuído ao criador como hipótese explícita de que o requerente cria o pedido. Rever se o formulário público tiver outro comportamento de autoria.

Os IDs reais da chefia e de Finanças não foram fornecidos. Por isso, o YAML omite deliberadamente `assignee` nas duas acções; não substitui esses responsáveis pelo criador nem contém UUIDs inventados. Esta omissão pode receber valores por defeito na importação: rever a pré-visualização e atribuir cada acção ao grupo correcto antes de publicar. Ausência de erros no validador não confirma segregação de funções.

O accionador manual permite importar o rascunho. O formulário de entrada deve ser criado, ligado e publicado separadamente; depois rever se o accionador manual deverá continuar disponível. Não há definições de formulários, anexos ou accionador de formulário no YAML portátil.

## Especificação separada do formulário de entrada

Proposta de nome: Pedido de compra. Uma submissão cria um pedido. Os três anexos pedidos são uma exigência deste formulário, não um limiar legal.

| Campo | Tipo pretendido | Obrigatório | Regra/mapeamento |
|---|---|---|---|
| Necessidade da compra | Texto longo | Sim, proposto | Finalidade e justificação; conservar na resposta do formulário |
| Montante solicitado (AOA) | Moeda/valor numérico | Sim | Mapear para `purchase_amount`; exibir AOA/Kz, 2 casas; propor valor superior a zero e verificar suporte da validação no editor |
| Proposta 1 | Ficheiro | Sim | Uma proposta identificável, legível, ligada à resposta/pedido |
| Proposta 2 | Ficheiro | Sim | Segunda proposta identificável |
| Proposta 3 | Ficheiro | Sim | Terceira proposta identificável |

A especificação não afirma que os ficheiros ou o formulário já existem. Confirmar tipos/tamanhos permitidos e permissões no destino. As propostas devem permitir comparar fornecedores, valores e escopo; o requerente confere e a chefia revê se são três propostas distintas. Não prometer detecção automática de duplicados. Os anexos ficam na evidência do pedido/formulário, sem inventar mapeamentos de ficheiros no YAML. Uma confirmação de orçamento deve indicar montante confirmado e referência de orçamento, sem incluir dados desnecessários.

## Validação efectuada

Comando executado:

```sh
node /private/tmp/provia-plugin-work/provia-skills/scripts/validate-workflow.mjs /private/tmp/provia-skill-evaluation/01-workflow-package/workflow.yaml > /private/tmp/provia-skill-evaluation/01-workflow-package/validation.json
```

Código de saída: 0. Conteúdo exacto produzido, também entregue em `validation.json`:

```json
{
  "valid": true,
  "apiVersion": "provia.ao/v1",
  "contractRevision": "e2875535d29dc976127ee01ebea028cd717a46a5",
  "destinationValidation": "not_run",
  "backendSchemaValidation": "passed",
  "readyToPublish": false,
  "errors": [],
  "warnings": [],
  "setupRequired": []
}
```

Erros locais: nenhum. Avisos emitidos: nenhum. Verificações de destino: não executadas. `setupRequired: []` não substitui a configuração manual acima.

## Próximos passos de execução pelo responsável Provia

Obter os grupos reais, atribuir as duas acções, configurar o formulário e permissões, importar como rascunho e rever os avisos da pré-visualização/validação do servidor. Não há entidades, sub-workflows, perfis AI, segredos, destinos HTTP ou email de entrada a resolver neste desenho.

Antes da revisão humana de publicação, ensaiar: aprovação normal; rejeição com comentário e cancelamento sem Finanças; bloqueio de submissão sem montante ou uma das três propostas; permissões da chefia e Finanças; orçamento indisponível conforme política a definir. Esses ensaios não foram executados. Nenhuma ligação a Provia, importação ou publicação foi realizada.

Fontes: pedido do utilizador; `examples/procurement/workflow.yaml`; `references/workflow-yaml.md`; `references/provia-capabilities.md`; `references/country-context.md`; `references/countries/angola.md`; `contracts/workflow-v1/contract-lock.json` do pacote. A revisão fixada não comprova a versão instalada no destino.
