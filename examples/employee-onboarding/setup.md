# Admissão de trabalhador — exemplo: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.1, 2026-09-19).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| admissao | Admissão de trabalhador — exemplo | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| admissao / confirmar_dados | Confirmar os dados aprovados | Atribuir o grupo à acção depois de o grupo existir (`rh`) |
| admissao / preparar_acessos | Preparar acessos e equipamento | Atribuir o grupo à acção depois de o grupo existir (`ti`) |
| admissao / acolher | Realizar o acolhimento | Atribuir o grupo à acção depois de o grupo existir (`chefias`) |
| admissao / confirmar_conclusao | Confirmar a conclusão | Atribuir o grupo à acção depois de o grupo existir (`rh`) |

## Grupos a criar

- `rh` Recursos Humanos: Confirmam a aprovação, os dados e o fecho administrativo da admissão.. Membros propostos: Técnico de Recursos Humanos
- `ti` Suporte de TI: Preparam acessos e equipamento.. Membros propostos: Técnico de suporte
- `chefias` Chefias de departamento: Recebem a pessoa no primeiro dia.. Membros propostos: Chefe de departamento

## Decisões em aberto

- **D1** Que documentos pessoais são exigidos na admissão e onde ficam guardados? (Dono: Responsável de Recursos Humanos)

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
