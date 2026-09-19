# Pedido de assistência de TI — exemplo: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.1, 2026-09-19).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| ti | Pedido de assistência de TI — exemplo | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| ti / classificar | Classificar o pedido | Atribuir o grupo à acção depois de o grupo existir (`suporte_ti`) |
| ti / diagnosticar | Diagnosticar o problema | Atribuir o grupo à acção depois de o grupo existir (`suporte_ti`) |
| ti / resolver | Registar a resolução | Atribuir o grupo à acção depois de o grupo existir (`suporte_ti`) |
| ti / confirmar | Confirmar com o requerente | Atribuir o grupo à acção depois de o grupo existir (`suporte_ti`) |

## Grupos a criar

- `suporte_ti` Suporte de TI: Classificam, diagnosticam e resolvem os pedidos de assistência.. Membros propostos: Técnico de suporte

## Decisões em aberto

- **D1** Quem reatribui um caso quando a solução prevista falha e a chefia de TI está ausente? (Dono: Responsável de TI)

## Notas de configuração

- `ti`: O YAML de formação atribui todas as acções ao criador para permitir um ensaio sem identificadores fictícios; o responsável pretendido é o grupo Suporte de TI.
- `ti`: Um formulário de entrada em auto-serviço substituiria o gatilho manual; desenhá-lo com provia-form-designer antes da produção.
- `ti`: Os prazos são ilustrativos, não níveis de serviço aprovados.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
