# Pedido de viatura: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| viaturas | Pedido de viatura | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| viaturas / registar_pedido | Registar o pedido de viatura | Definir o prazo; o desenho não propõe `due` |
| viaturas / decidir_pedido | Decidir sobre o pedido de viatura | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| viaturas / entregar_viatura | Entregar a chave e o cartão de combustível | Atribuir o grupo à acção depois de o grupo existir (`secretariado`) |
| viaturas / entregar_viatura | Entregar a chave e o cartão de combustível | Definir o prazo; o desenho não propõe `due` |
| viaturas / devolver_viatura | Registar a devolução da viatura | Atribuir o grupo à acção depois de o grupo existir (`secretariado`) |
| viaturas / devolver_viatura | Registar a devolução da viatura | Definir o prazo; o desenho não propõe `due` |

## Grupos a criar

- `secretariado` Secretariado: Regista os pedidos de viatura, verifica a disponibilidade no mapa de viaturas, entrega a chave e o cartão de combustível e regista a devolução.. Membros propostos: Assistente de secretariado, Assistente de secretariado
- `chefias` Chefias de departamento: Aprovam ou recusam o pedido de viatura do colaborador do respectivo departamento, no prazo de um dia útil. Agrupa as 5 chefias de departamento; ver decisão sobre encaminhamento à chefia correcta.. Membros propostos: Chefe de departamento, Chefe de departamento, Chefe de departamento, Chefe de departamento, Chefe de departamento
- `direccao_geral` Direcção-Geral: Consta do organigrama fornecido; o procedimento de pedidos de viatura não lhe atribui nenhuma acção. Mantida para uso noutros processos e para uma eventual função de escalonamento, a confirmar.. Membros propostos: Director-Geral

## Sinalizações de grupos

- `direccao_geral`: Actor de pessoa única: definir substituto. É uma única pessoa (o Director-Geral); propor um delegado para ausências, a confirmar com a organização.

## Tipos de entidade a criar

- `viatura` Viatura

## Decisões em aberto

- **D1** Como encaminhar a decisão à chefia do departamento correcto do colaborador? (sub-grupos por departamento, campo de encaminhamento manual pelo secretariado, ou outro mecanismo) (Dono: Dono do processo)
- **D2** A Direcção-Geral tem alguma função neste processo (por exemplo, escalonamento quando a chefia não decide a tempo, ou aprovação de pedidos da própria chefia), ou está apenas registada no organigrama para uso noutros processos? (Dono: Direcção-Geral)
- **D3** O procedimento não define prazos-alvo para o registo do pedido, a entrega da viatura e o registo da devolução (só a decisão da chefia tem prazo de um dia útil). Definir prazos-alvo para estas três acções? (Dono: Dono do processo)
- **D4** O que fazer se a chefia não decidir dentro do prazo de um dia útil (escalar, lembrete automático, ou outro)? O procedimento não descreve o comportamento em caso de incumprimento do prazo. (Dono: Dono do processo)
- **D5** Pode a chefia aprovar um pedido de viatura submetido por si própria (segregação de funções)? O procedimento não o exclui. (Dono: Dono do processo)
- **D6** Confirmar a designação social exacta da empresa e o sector de actividade para o manifesto do projecto. (Dono: Cliente)

## Notas de configuração

- `viaturas`: O YAML de formação atribui a primeira acção ao criador do caso. O procedimento descreve o colaborador a pedir ao secretariado, que é quem regista; propõe-se que o secretariado inicie o caso no Provia. Se a organização preferir auto-serviço do colaborador, redesenhar a entrada com provia-form-designer.
- `viaturas`: A associação ao tipo de entidade Viatura configura-se no Provia depois de criar o tipo; o YAML de formação não a inclui.
- `viaturas`: O grupo «Chefias de departamento» agrega as 5 chefias; o encaminhamento à chefia correcta do departamento do colaborador não está resolvido no YAML (ver decisão D1).

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
