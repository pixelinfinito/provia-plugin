# Revisão de procedimento — exemplo: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.2.1, 2026-09-23).

## Estado

Modo: configuração manual (sem recibos registados).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| procedimentos | Revisão de procedimento — exemplo | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| procedimentos | Revisão de procedimento — exemplo | Aplicar as concessões de acesso (`workflow_access_apply`, dry run primeiro) ou confirmar a secção `access` na pré-visualização de importação. organization → create_incident, group:qualidade → edit |
| procedimentos / preparar | Preparar a revisão | Atribuir o grupo à acção depois de o grupo existir (`qualidade`) |
| procedimentos / aprovar | Decidir sobre a revisão | Atribuir o grupo à acção depois de o grupo existir (`donos_processo`) |
| procedimentos / publicar | Registar a versão aprovada | Atribuir o grupo à acção depois de o grupo existir (`qualidade`) |

## Acesso ao workflow

Quem pode ver e abrir cada workflow. `view` num workflow mostra todos os casos; quem executa uma acção vê os seus casos sem concessão. As concessões são criadas com `workflow_access_apply` em modo ligado ou na secção `access` do YAML importado no browser.

| Workflow | Sensibilidade | Destinatário | Nível | Razão | Estado |
| --- | --- | --- | --- | --- | --- |
| `procedimentos` | internal | `organization` | create_incident | Qualquer colaborador pode pedir a alteração de um procedimento (sop-controlo §1) | por aplicar |
| `procedimentos` | internal | `group:qualidade` (Gestão da qualidade) | edit | A Gestão da qualidade é dona do desenho do workflow e publica as versões (sop-controlo §4) | por aplicar |
| `procedimentos` | internal | `group:donos_processo` | — | Vê apenas os seus casos (sem concessão) | — |

## Grupos a criar

- `qualidade` Gestão da qualidade [team]: Redigem as revisões e publicam as versões aprovadas.. Membros propostos: Gestor da qualidade
- `donos_processo` Donos de processo [team]: Aprovam as revisões dos procedimentos que lhes pertencem.. Membros propostos: Dono do processo

## Sinalizações de grupos

- `qualidade`: Actor de pessoa única: definir substituto. Uma só pessoa redige e publica; definir substituto.
- `donos_processo`: Segregação de funções: confirmar responsáveis distintos. Quem redige não aprova; confirmar que o grupo de aprovação é distinto.

## Decisões em aberto

- **D1** Que revisões exigem aprovação da direcção além do dono do processo? (Dono: Gestor da qualidade)

## Notas de configuração

- `procedimentos`: O YAML de formação atribui todas as acções ao criador; os responsáveis pretendidos são os grupos deste manifesto.
- `procedimentos`: A notificação das equipas afectadas pode tornar-se uma acção Notification com provia-automation-designer.

## Validação

Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.

```sh
node scripts/validate-workflow.mjs workflow.yaml
```

Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.
