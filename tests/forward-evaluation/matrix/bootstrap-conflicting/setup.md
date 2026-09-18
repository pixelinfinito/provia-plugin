# Aprovação de pedidos de compra: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Aprovação de pedidos de compra | Importar o YAML como rascunho e rever a pré-visualização (`compras/workflow.yaml`) |
| compras / decidir | Decidir sobre o pedido de compra | Definir o responsável; a acção não tem dono no desenho |
| compras / decidir | Decidir sobre o pedido de compra | Definir o prazo; o desenho não propõe `due` |

## Grupos a criar

- `chefias` Chefias de departamento: Segundo o procedimento de compras de 2024 (Documento A), aprovavam todos os pedidos de compra do seu departamento. A circular de 2026 (Documento B) contradiz esta regra — ver decisão D1; não escolher entre as duas fontes sem confirmação da organização.. Membros propostos: Chefe de departamento
- `director_financeiro` Director financeiro: Segundo a circular da direcção de 2026 (Documento B), passa a ser o único aprovador dos pedidos de compra a partir de Janeiro. O procedimento de 2024 (Documento A) contradiz esta regra — ver decisão D1; não escolher entre as duas fontes sem confirmação da organização.. Membros propostos: Director financeiro

## Sinalizações de grupos

- `chefias`: Segregação de funções: confirmar responsáveis distintos. Se a chefia também puder ser quem regista o pedido do seu próprio departamento, confirmar com o dono do processo se pode aprovar um pedido que ela própria iniciou.
- `director_financeiro`: Actor de pessoa única: definir substituto. Actor de pessoa única. Nomear um substituto para ausências, para que a aprovação não fique bloqueada.

## Decisões em aberto

- **D1** Quem tem autoridade para aprovar os pedidos de compra: a chefia do departamento (procedimento de compras de 2024) ou o director financeiro (circular da direcção de 2026)? As duas fontes fornecidas contradizem-se e não há informação adicional para resolver o conflito. (Dono: Direcção / dono do processo de compras)
- **D2** A circular de 2026 diz que a nova regra é válida «a partir de Janeiro», sem indicar o ano. É Janeiro de 2026 (o próprio ano da circular) ou de um ano posterior? (Dono: Direcção)
- **D3** A circular substitui o procedimento de 2024 para todos os pedidos, sem excepção de valor ou categoria, ou mantém-se algum papel para a chefia do departamento (por exemplo, iniciar ou visar o pedido antes da aprovação financeira)? (Dono: Direcção financeira)
- **D4** Que etapas existem antes da decisão (registo do pedido, dados a preencher) e depois dela (cabimento orçamental, emissão de encomenda, comunicação ao requerente)? Nenhum dos dois documentos fornecidos as descreve. (Dono: Dono do processo de compras)
- **D5** Qual é o nome da organização e o sector de actividade, para completar o projecto? (Dono: Cliente)
- **D6** Quem substitui o director financeiro na aprovação quando este estiver ausente? (Dono: Direcção financeira)

## Notas de configuração

- `compras`: O responsável desta acção não está definido no YAML porque as duas fontes fornecidas indicam autoridades diferentes (chefia do departamento vs. director financeiro) — ver decisão D1. Não atribuir o grupo até a organização confirmar a regra em vigor.
- `compras`: As fontes fornecidas descrevem apenas a regra de aprovação. Não há informação sobre o registo do pedido, campos obrigatórios, cabimento orçamental, emissão de encomenda ou qualquer etapa posterior à decisão — ver decisão D4. O workflow foi mantido deliberadamente mínimo (accionador manual + uma decisão) para não inventar etapas de processo.
- `compras`: Nenhum campo de caso (metadata) foi definido: as fontes não indicam que dados o pedido deve conter. Confirmar os campos reais antes de usar provia-form-designer ou provia-information-model.
- `compras`: Prazo (due) não foi proposto por não constar de nenhuma das fontes.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs compras/workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
