# Resumo de propostas e escolha de fornecedor: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| escolha-fornecedor | Resumo e escolha de fornecedor | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| escolha-fornecedor / resumir-propostas | Resumir as propostas dos fornecedores | Atribuir o perfil de IA à acção (`ai:resumir-propostas`) |
| escolha-fornecedor / resumir-propostas | Resumir as propostas dos fornecedores | Definir o prazo; o desenho não propõe `due` |
| escolha-fornecedor / escolher-fornecedor | Escolher o fornecedor | Atribuir o grupo à acção depois de o grupo existir (`equipa-compras`) |
| escolha-fornecedor / escolher-fornecedor | Escolher o fornecedor | Definir o prazo; o desenho não propõe `due` |

## Grupos a criar

- `equipa-compras` Equipa de compras: Escolhe o fornecedor a contratar, com base no resumo comparativo preparado pela IA e nas propostas originais.. Membros propostos: Membro da equipa de compras

## Perfis de IA a configurar

- `resumir-propostas` Resumo de propostas de fornecedores

## Decisões em aberto

- **D1** Quem compõe a equipa de compras (grupo equipa-compras) e quem é o seu responsável? (Dono: Dono do processo de compras)
- **D2** Que prazo (due) se aplica à preparação do resumo pela IA e à decisão de escolha do fornecedor? (Dono: Dono do processo de compras)
- **D3** Que tipos de entidade e campos definitivos devem representar propostas e fornecedores (em vez dos campos de caso provisórios documentos_propostas/resumo_propostas)? (Dono: Implementador)
- **D4** O plano e as definições de IA do tenant Provia suportam leitura de anexos por um agente de IA, e qual o limiar de confiança (confidenceThreshold) apropriado? O valor 0.6 proposto é um ponto de partida, não confirmado. (Dono: Administrador Provia)

## Notas de configuração

- `escolha-fornecedor`: Nenhum procedimento (SOP) foi fornecido; este workflow cobre apenas o resumo de propostas e a escolha do fornecedor, como pedido. Integrar num processo de compras mais amplo é trabalho de provia-workflow-designer.
- `escolha-fornecedor`: Criar o perfil de IA 'Resumo de propostas de fornecedores' em Provia a partir de ai-profile-resumir-propostas.md antes de importar; depois preencher assignee={type: ai_agent, id: <UUID do perfil>} na acção resumir-propostas.
- `escolha-fornecedor`: Resolver o grupo equipa-compras (membros reais) antes de importar; depois preencher assignee={type: group, id: <UUID do grupo>} na acção escolher-fornecedor.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
