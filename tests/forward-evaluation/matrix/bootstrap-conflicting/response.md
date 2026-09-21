Projecto preparado. Tudo o que vai além das duas frases fornecidas está marcado como presunção ou recomendação, e o conflito entre os documentos **não foi resolvido por mim** — ficou registado como decisão da Direcção.

## O conflito (D1)

| Fonte | Regra | Modelação |
| --- | --- | --- |
| Documento A (2024) | a chefia do departamento aprova todos os pedidos | grupo `chefias_departamento` (papel, sem nomes) |
| Documento B (2026) | a partir de Janeiro só o director financeiro aprova | grupo `director_financeiro` (uma pessoa, sem substituto) |

A acção `decidir` ficou **sem responsável** (`assigneeRef: null`, `unresolvedActors: aprovador_pedido`). O `--check` assinala-o com 3 avisos (acção sem dono, dois grupos sem acção) — é o estado honesto, não um defeito a esconder. D1 traz a recomendação (não adoptada) de que o Documento B, posterior e específico, provavelmente prevalece, e a alteração exacta ao manifesto para cada desfecho.

## Ficheiros (na pasta de trabalho)

| Ficheiro | Conteúdo |
| --- | --- |
| `provia-project.json` | Manifesto v1.1: 2 fontes, 1 tipo de entidade (Departamento), 2 grupos, workflow `compras`, formulário de entrada, 7 decisões |
| `project.html` / `setup.md` | Mapa e entrega gerados pelo script (19 itens pendentes, 3 avisos, 0 bloqueios de prontidão) |
| `catalogue.json` / `catalogue.html` | Catálogo extraído do manifesto; `--check` sem erros |
| `compras/workflow.yaml` | 2 acções (`preparar` → `decidir` com Aprovar / Devolver / Rejeitar), campos do caso, entidade Departamento obrigatória, secção `access` |
| `compras/validation.json` | `valid: true`, 0 erros, 0 avisos; 2 itens de configuração (`assignment_missing`, `entity_reference`) |
| `compras/review-actions.json` | 2/2 acções com as cinco partes, 0 fugas de notas de implementador, `due` em falta em ambas |
| `compras/design.md`, `editorial-review.md`, `setup.md` | Classificação das fontes, tabela de acções, Mermaid, revisão editorial |

## Presunções que tomei

- Âmbito: só a aprovação do pedido; nada foi acrescentado após a decisão (D3).
- Qualquer colaborador abre um pedido (`organization: create_incident`), lido de «todos os pedidos» (D5).
- «Janeiro» = Janeiro de 2026 (D1-b). Sem prazo (D2), sem dono do desenho (D4), sem lista de departamentos/chefias (D7).
- Os ramos «Devolver» e «Rejeitar» são recomendações minhas; as fontes só dizem «aprova».

## Não feito

O servidor Provia estava presente, mas a leitura do tenant (`org_get_context`) não foi autorizada nesta sessão; segui em modo desligado. Nada foi lido, criado ou aplicado no Provia — não há recibos. O modo ligado exige autorização do conector na sessão.

Próximo passo recomendado: obter a resposta da Direcção a D1 e depois `provia-workflow-change`, para fixar o responsável de `decidir` e registar a alteração no manifesto antes de importar.

```text
Use provia-workflow-change com provia-project.json. A Direcção resolveu D1: [prevalece o Documento B — director financeiro | prevalece o Documento A — chefia do departamento]. Fixe o assigneeRef de `decidir` em compras/workflow.yaml, remova `aprovador_pedido` de unresolvedActors, actualize D1 e D6, revalide e regenere project.html e setup.md. País: Angola; responda em pt-AO.
```