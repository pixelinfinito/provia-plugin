# Selecção de fornecedor com resumo de propostas por IA: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| seleccao-fornecedor | Selecção de fornecedor com resumo de propostas | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| seleccao-fornecedor | Selecção de fornecedor com resumo de propostas | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. group:compras → create_incident |
| seleccao-fornecedor / registar-propostas | Registar o pedido e anexar as propostas dos fornecedores | Definir o prazo; o desenho não propõe `due` |
| seleccao-fornecedor / resumir-propostas | Resumir as propostas dos fornecedores | Atribuir o perfil de IA à acção (`ai:resumo-propostas`) |
| seleccao-fornecedor / escolher-fornecedor | Escolher o fornecedor | Atribuir o grupo à acção depois de o grupo existir (`compras`) |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `seleccao-fornecedor` | internal | `group:compras` (Compras) | create_incident | A equipa de Compras abre a selecção e acompanha todas as propostas em análise; é a mesma equipa que escolhe o fornecedor. (pedido-2026-09-21 §2) | por aplicar |

## Grupos a criar

- `compras` Compras [team]: Equipa que abre a selecção de fornecedor, confere o resumo preparado pela IA e escolhe o fornecedor.

## Sinalizações de grupos

- `compras`: Responsável sem nome nas fontes. O pedido fala em «a equipa» sem a nomear; assumiu-se a equipa de Compras. Confirmar o nome do grupo e os membros.

## Perfis de IA a configurar

- `resumo-propostas` Resumo de propostas de fornecedores

## Decisões em aberto

- **D1** Quem abre a selecção de fornecedor e anexa as propostas: a própria equipa de Compras, o requerente da área que precisa da compra, ou qualquer colaborador? Isto define o grant de create_incident e o responsável da acção registar-propostas. (Dono: Responsável de Compras)
- **D2** Que prazos se aplicam à conferência do resumo e à escolha do fornecedor? O desenho propõe 1 e 3 dias úteis a título ilustrativo. (Dono: Responsável de Compras)
- **D3** Existe um limite de valor acima do qual a escolha do fornecedor sai da equipa de Compras (por exemplo direcção ou comissão)? Se sim, a decisão «Escolher o fornecedor» precisa de uma segunda decisão a montante ou de um grupo diferente. (Dono: Responsável de Compras)
- **D4** Quais são os critérios de avaliação fixos da organização (preço, prazo, garantia, condições de pagamento, outros) e a sua ordem? Sem isto o campo criterios_de_avaliacao é preenchido caso a caso pelo requerente. (Dono: Responsável de Compras)
- **D5** Quem é o revisor humano do resumo da IA: o grupo Compras (proposto), ou uma pessoa específica da equipa? A revisão e a escolha podem ficar na mesma equipa, mas convém saber se são a mesma pessoa. (Dono: Responsável de Compras)

## Notas de configuração

- `seleccao-fornecedor`: Criar o perfil de IA «Resumo de propostas de fornecedores» em Provia com as instruções, campos legíveis/escritos e artefacto descritos em ai-profile-resumo-propostas.md; copiar o UUID do perfil para assignee.id da acção resumir-propostas. O plugin não instala perfis.
- `seleccao-fornecedor`: Definir o revisor humano da acção resumir-propostas (reviewRequired: true) como o grupo Compras, ou o utilizador que a equipa indicar, nas definições do aiWorker em Provia.
- `seleccao-fornecedor`: Confirmar que o plano da organização inclui agentes de IA como responsáveis de acções Standard e que a funcionalidade está activa nas definições; sem isso a acção fica sem responsável.
- `seleccao-fornecedor`: Os prazos de 1 e 3 dias úteis (due) são propostas do desenho, não vêm do pedido; confirmar com o responsável de Compras (D2).
- `seleccao-fornecedor`: A acção registar-propostas está atribuída ao criador do processo como simplificação do desenho; confirmar quem regista o pedido (D1).

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
