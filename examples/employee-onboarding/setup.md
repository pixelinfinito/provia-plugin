# Admissão de trabalhador — exemplo: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| admissao | Admissão de trabalhador — exemplo | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| admissao | Admissão de trabalhador — exemplo | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. group:rh → create_incident |
| admissao / confirmar_dados | Confirmar os dados aprovados | Atribuir o grupo à acção depois de o grupo existir (`rh`) |
| admissao / preparar_acessos | Preparar acessos e equipamento | Atribuir o grupo à acção depois de o grupo existir (`ti`) |
| admissao / acolher | Realizar o acolhimento | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| admissao / confirmar_conclusao | Confirmar a conclusão | Atribuir o grupo à acção depois de o grupo existir (`rh`) |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `admissao` | restricted | `group:rh` (Recursos Humanos) | create_incident | Os Recursos Humanos abrem o caso de admissão depois da aprovação da contratação (sop-admissao §1) | por aplicar |
| `admissao` | restricted | `group:ti` | — | Vê apenas os seus casos (sem concessão) | — |
| `admissao` | restricted | `group:chefias` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `rh` Recursos Humanos [team]: Confirmam a aprovação, os dados e o fecho administrativo da admissão.. Membros propostos: Técnico de Recursos Humanos
- `ti` Suporte de TI [team]: Preparam acessos e equipamento.. Membros propostos: Técnico de suporte
- `chefias` Chefias de departamento [team]: Recebem a pessoa no primeiro dia.. Membros propostos: Chefe de departamento

## Decisões em aberto

- **D1** Que documentos pessoais são exigidos na admissão e onde ficam guardados? (Dono: Responsável de Recursos Humanos)
- **D-ACC** Quem abre um caso de admissão vê todos os casos do workflow enquanto não existirem regras por caso. Aceitar a limitação ou restringir quem abre? (Dono: Director de Recursos Humanos)

## Notas de configuração

- `admissao`: O YAML de formação atribui todas as acções ao criador; os responsáveis pretendidos são os grupos deste manifesto.
- `admissao`: Este exemplo não enumera obrigações laborais angolanas; confirmar os documentos exigidos com fontes verificadas.
- `admissao`: Os prazos são ilustrativos. O prazo do acolhimento conta a partir da activação da acção, não da data de início.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
