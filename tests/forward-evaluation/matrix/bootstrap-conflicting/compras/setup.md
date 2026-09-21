# Pedido de compra — aprovação: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra | Importar o YAML como rascunho e rever a pré-visualização (`compras/workflow.yaml`) |
| compras | Pedido de compra | Registar o actor no registo canónico de grupos ou mapeá-lo para uma chave existente (`aprovador_pedido`) |
| compras | Pedido de compra | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. organization → create_incident |
| compras / preparar | Preparar o pedido de compra | Definir o prazo; o desenho não propõe `due` |
| compras / decidir | Decidir sobre o pedido de compra | Definir o responsável; a acção não tem dono no desenho |
| compras / decidir | Decidir sobre o pedido de compra | Definir o prazo; o desenho não propõe `due` |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `compras` | internal | `organization` | create_incident | O Documento A fala em «todos os pedidos» dos departamentos; presume-se que qualquer colaborador pode abrir um pedido de compra para o seu departamento. Presunção a confirmar (D5). (doc-a-procedimento-compras-2024 §aprovacao) | por aplicar |

## Grupos a criar

- `chefias_departamento` Chefias de departamento [role]: Chefias dos departamentos requerentes; segundo o Documento A (2024) aprovam todos os pedidos de compra do seu departamento. A chefia concreta varia por caso (campo `head` do Departamento), pelo que o grupo é um papel de recurso, não uma equipa única.. Membros propostos: Chefe de cada departamento
- `director_financeiro` Director financeiro [team]: O director financeiro; segundo o Documento B (circular de 2026) é, a partir de Janeiro, o único aprovador dos pedidos de compra.. Membros propostos: Director financeiro

## Sinalizações de grupos

- `chefias_departamento`: Responsável sem nome nas fontes. Os documentos não nomeiam os departamentos nem as chefias; lista a fornecer (D7).
- `director_financeiro`: Actor de pessoa única: definir substituto. Uma só pessoa; sem delegado indicado nas fontes (D6).

## Tipos de entidade a criar

- `departamento` Departamento

## Formulários a criar e ligar

- `pedido-compra` Pedido de compra: Criar o formulário de entrada e ligá-lo ao workflow (compras / pedido-compra)

## Decisões em aberto

- **D1** Quem aprova os pedidos de compra? O Documento A (2024) diz que «a chefia do departamento aprova todos os pedidos»; o Documento B (circular da direcção, 2026) diz que «a partir de Janeiro só o director financeiro aprova pedidos». As duas regras são incompatíveis e nenhuma foi escolhida no desenho. Confirmar também: (a) se a circular revoga o procedimento de 2024 na totalidade ou só a cláusula de aprovação; (b) se «Janeiro» é Janeiro de 2026; (c) se a chefia mantém alguma validação prévia. Recomendação do implementador, não adoptada: sendo o Documento B posterior e específico, o cenário mais provável é o director financeiro como aprovador único a partir de Janeiro de 2026. Resolução no manifesto: se prevalecer o Documento B, `assigneeRef: "director_financeiro"` na acção `decidir`; se prevalecer o Documento A, `assigneeRef: "field:department_head"` com `assigneeFallback: "chefias_departamento"` e um campo `department_head` (tipo user) preenchido a partir da chefia do Departamento; em ambos os casos remover `aprovador_pedido` de `unresolvedActors[]`. (Dono: Direcção (autora da circular de 2026))
- **D2** Qual o prazo para decidir um pedido de compra? Nenhuma das fontes indica um nível de serviço; `due` fica vazio na acção `decidir` até ser definido. (Dono: Responsável do processo de compras (a nomear, D4))
- **D3** O que acontece depois da aprovação (execução da compra, recepção, pagamento) e como é informado o requerente de uma rejeição? As fontes só descrevem a aprovação; o workflow termina na decisão. Confirmar se o âmbito do piloto se limita à aprovação ou se devem ser acrescentadas acções posteriores. (Dono: Responsável do processo de compras (a nomear, D4))
- **D4** Quem é o responsável do processo de compras e quem detém o nível `edit` (dono do desenho) do workflow? As fontes não o dizem; o manifesto só declara `create_incident` para a organização. (Dono: Direcção)
- **D5** Qualquer colaborador pode abrir um pedido de compra em nome do seu departamento? O desenho presume que sim (concessão `organization: create_incident`) a partir de «todos os pedidos» no Documento A. Se só as chefias ou um grupo de compras podem abrir, substituir a concessão e, se necessário, restringir o arranque manual. (Dono: Direcção)
- **D6** Quem substitui o director financeiro nas ausências, se o Documento B prevalecer (D1)? O grupo «Director financeiro» tem uma só pessoa; sem delegado, os pedidos param. (Dono: Director financeiro)
- **D7** Lista dos departamentos e da chefia de cada um, e responsável pela manutenção do tipo de entidade «Departamento». As fontes não nomeiam departamentos nem chefias. (Dono: Direcção / Recursos Humanos (a confirmar))

## Notas de configuração

- `compras`: O responsável da acção `decidir` não está definido: as fontes divergem (D1). Não configurar a atribuição no Provia até a Direcção decidir; até lá, um caso que chegue a `decidir` fica sem responsável.
- `compras`: O ramo «Devolver ao requerente» regressa a `preparar`; o ramo «Rejeitar» cancela o caso. Ambos são recomendações do implementador: as fontes só falam em «aprova».
- `compras`: Não há prazo para a decisão nas fontes; `due` fica vazio (D2).
- `compras`: O YAML associa cada caso a um registo do tipo «Departamento» (secção `entities`, modo entity_type, obrigatório). O tipo tem de existir no destino antes da importação; o validador assinala `entity_reference` como configuração pendente.
- `compras`: Formulário de pedido (`pedido-compra`) a criar no Provia depois de importar o rascunho; formulários não viajam no YAML.
- `compras`: Modo ligado (servidor provia-implementer) estava disponível no anfitrião mas a leitura do tenant não foi autorizada nesta sessão; nenhum registo foi lido ou criado no Provia. Toda a configuração é manual até existir um recibo.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs compras/workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
