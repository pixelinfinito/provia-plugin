# Pedido de compra — exemplo (piloto): Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| compras | Pedido de compra — exemplo | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| compras / decidir | Decidir sobre o pedido | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| compras / confirmar_cabimento | Confirmar disponibilidade orçamental | Atribuir o grupo à acção depois de o grupo existir (`financas`) |
| compras / encomendar | Registar a encomenda | Atribuir o grupo à acção depois de o grupo existir (`compras`) |

## Grupos a criar

- `chefias` Chefias de departamento: Aprovam os pedidos de compra do seu departamento.. Membros propostos: Chefe de departamento
- `financas` Finanças: Confirmam o cabimento orçamental.. Membros propostos: Técnico de orçamento
- `compras` Compras: Emitem as encomendas e mantêm o registo de fornecedores.. Membros propostos: Técnico de compras

## Sinalizações de grupos

- `chefias`: Segregação de funções: confirmar responsáveis distintos. A chefia não pode aprovar pedidos que ela própria registou; confirmar com o dono do processo.

## Tipos de entidade a criar

- `fornecedor` Fornecedor

## Decisões em aberto

- **D1** Qual é o limite de autoridade das chefias e quem aprova acima dele? (Dono: Director financeiro)
- **D2** Pode a chefia aprovar um pedido que ela própria registou? (Dono: Dono do processo)
- **D3** O piloto observou confirmações de cabimento por telefone sem captura de saldo nem preenchimento de budget_reference, contrariando a evidência exigida em confirmar_cabimento. Confirmar se isto é sempre uma excepção a corrigir caso a caso, ou se existe um cenário de urgência a formalizar com uma via de evidência alternativa. (Dono: Director financeiro)
- **D4** Quando o fornecedor está suspenso ou com contacto desactualizado, a quem deve o técnico de Compras pedir a reactivação do registo antes de emitir a encomenda? (Dono: Compras)
- **D5** O piloto observou que a chefia acumula pedidos e decide em lote semanal, excedendo o prazo de 2 dias úteis em metade dos casos. Ajustar o prazo, a cadência de decisão ou reforçar o cumprimento é uma decisão do dono do processo, não uma correcção de redacção. (Dono: Dono do processo)

## Notas de configuração

- `compras`: O YAML de formação atribui todas as acções ao criador para permitir um ensaio sem identificadores fictícios. Os responsáveis pretendidos são os grupos deste manifesto; substituí-los antes da produção.
- `compras`: Os limites de aprovação e os prazos são ilustrativos, não regras legais nem política aprovada.
- `compras`: provia-process-knowledge (2026-09-18): reconciliou as lições do piloto (licoes-piloto.md, assumidas) com o workflow aprovado. Instruções revistas em procedimento-pedido-compra.md, prontas para colar em actions[].description após aprovação do dono do processo; este manifesto não altera workflow.yaml. Ver decisions D3–D5.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
