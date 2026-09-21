# Acção correctiva — exemplo: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.0, 2026-09-21).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| accao_correctiva | Acção correctiva — exemplo | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| accao_correctiva | Acção correctiva — exemplo | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. group:qualidade → create_incident |
| accao_correctiva / registar | Registar a constatação | Atribuir o grupo à acção depois de o grupo existir (`qualidade`) |
| accao_correctiva / analisar | Analisar a causa | Atribuir o grupo à acção depois de o grupo existir (`donos_processo`) |
| accao_correctiva / corrigir | Executar a correcção | Atribuir o grupo à acção depois de o grupo existir (`donos_processo`) |
| accao_correctiva / verificar | Verificar a eficácia | Atribuir o grupo à acção depois de o grupo existir (`qualidade`) |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `accao_correctiva` | internal | `group:qualidade` (Gestão da qualidade) | create_incident | A Gestão da qualidade regista as não conformidades e abre o caso (sop-nc §1) | por aplicar |
| `accao_correctiva` | internal | `group:donos_processo` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `qualidade` Gestão da qualidade [team]: Registam constatações e verificam a eficácia das correcções.. Membros propostos: Gestor da qualidade
- `donos_processo` Donos de processo [team]: Analisam a causa e executam a correcção no processo afectado.. Membros propostos: Dono do processo

## Sinalizações de grupos

- `qualidade`: Segregação de funções: confirmar responsáveis distintos. Quem executa a correcção não verifica a sua eficácia.

## Decisões em aberto

- **D1** Qual é o período de verificação da eficácia por tipo de constatação? (Dono: Gestor da qualidade)

## Notas de configuração

- `accao_correctiva`: O YAML de formação atribui todas as acções ao criador; os responsáveis pretendidos são os grupos deste manifesto.
- `accao_correctiva`: O período de verificação da eficácia (30 dias de calendário) é ilustrativo; a organização define-o por tipo de constatação.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
