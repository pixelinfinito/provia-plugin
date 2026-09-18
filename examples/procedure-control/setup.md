# Revisão de procedimento — exemplo: Entrega de configuração

Angola · pt-AO · Africa/Luanda. Gerado a partir de `provia-project.json` (provia-skills/1.1.0, 2026-09-18).

## Estado

Modo: sem ligação ao Provia (configuração manual).

## Configuração pendente

| Onde | Item | O que fazer |
| --- | --- | --- |
| procedimentos | Revisão de procedimento — exemplo | Importar o YAML como rascunho e rever a pré-visualização (`workflow.yaml`) |
| procedimentos / preparar | Preparar a revisão | Atribuir o grupo à acção depois de o grupo existir (`qualidade`) |
| procedimentos / aprovar | Decidir sobre a revisão | Atribuir o grupo à acção depois de o grupo existir (`donos_processo`) |
| procedimentos / publicar | Registar a versão aprovada | Atribuir o grupo à acção depois de o grupo existir (`qualidade`) |

## Grupos a criar

- `qualidade` Gestão da qualidade: Redigem as revisões e publicam as versões aprovadas.. Membros propostos: Gestor da qualidade
- `donos_processo` Donos de processo: Aprovam as revisões dos procedimentos que lhes pertencem.. Membros propostos: Dono do processo

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
