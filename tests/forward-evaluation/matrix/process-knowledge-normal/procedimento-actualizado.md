# Procedimento actualizado — RASCUNHO (versão aprovada desconhecida)

| Campo | Valor |
| --- | --- |
| Estado | Rascunho. Não substitui o procedimento em vigor. |
| Workflow de origem | Não entregue (decisão D1) |
| Procedimento em vigor | Não entregue (decisão D3) |
| Lições do piloto | Não entregues (decisão D2) |
| Responsável pela actualização | Por nomear (decisão D3) |
| País / língua | Angola / pt-AO, assumidos a título provisório (decisão D4) |
| Manifesto | `provia-project.json` (projecto `procedimento-piloto`) |
| Data | 2026-09-21 |

## 1. O que foi e não foi feito

**Verificado:**

- O directório de trabalho estava vazio: não havia `workflow.yaml`, `provia-project.json`, procedimento nem registo de lições.
- O servidor `provia-implementer` está presente no anfitrião, mas a chamada de leitura `org_get_context` não foi autorizada nesta sessão. Nada foi lido nem alterado na organização Provia.
- O manifesto `provia-project.json` foi criado com as cinco decisões em aberto e passou em `build-project-map.mjs --check` (0 workflows, 5 itens pendentes, 0 avisos). Esta verificação cobre só a estrutura do manifesto; não valida este documento.

**Não feito, porque não havia fonte:**

- Nenhuma instrução de acção foi reescrita. Escrever instruções sem o workflow aprovado seria inventar acções, responsáveis e evidências.
- Nenhuma lição do piloto foi incorporada.
- Nenhum conflito entre workflow e política foi reconciliado.

O que se segue é a estrutura do procedimento actualizado com o método de preenchimento, pronta a receber as três fontes assim que forem entregues. As secções marcadas «a preencher» ficam vazias de propósito.

## 2. Fontes

Preencher com referência exacta (título, versão, data, secção). Cada afirmação nas secções 4 a 7 cita uma destas fontes.

| Id | Fonte | Tipo | Versão / data | Estado |
| --- | --- | --- | --- | --- |
| WF | Workflow aprovado (YAML exportado ou `workflow_export_yaml`) | workflow | a preencher | em falta |
| PROC | Procedimento em vigor | sop | a preencher | em falta |
| PIL | Registo de lições do piloto (com caso, data e autor por lição) | export / interview | a preencher | em falta |
| POL | Políticas aprovadas que o procedimento invoca (aprovação, compras, RH…) | policy | a preencher | em falta |

## 3. Âmbito e versão

- Processo: a preencher a partir de WF (`workflow.name`, prefixo dos casos).
- Versão do procedimento que este documento substitui: a preencher a partir de PROC.
- Versão publicada do workflow que serve de base: a preencher a partir de WF. Se a versão publicada e a versão desenhada diferirem, este documento descreve a **publicada**; as alterações propostas vão para a secção 7, não para o corpo do procedimento.

## 4. Instruções por acção (a preencher)

Uma entrada por acção do workflow aprovado, na ordem de execução. O texto de cada entrada é o que se cola no campo `description` da acção em Provia (máximo 5000 caracteres), escrito na segunda pessoa para quem executa. O nome da acção começa por verbo no infinitivo e fica fora da descrição.

Modelo de entrada:

```text
Acção: <nome da acção, começando por verbo — de WF>
Responsável: <grupo de WF; não repetir na descrição>
Prazo: <de WF `due`; se não existir, registar decisão, não inventar>

Tarefa: <uma frase: o que produzir ou decidir>
Como: 1. <passo com sistema, documento ou pessoa concreta> 2. …
Evidência: <o que anexar ou preencher, e onde: ficheiro, campo, comentário>
Concluído quando: <condição observável>
Excepções: <o que fazer quando não é possível concluir como descrito>
```

Regras aplicadas ao preencher:

1. A autoridade de aprovação vem de WF e de POL, não das lições do piloto. Uma lição que altere quem aprova é um conflito (secção 6), não uma reescrita.
2. Uma lição que acrescente um passo dentro do trabalho de uma pessoa entra em `Como:` da acção que o detém. Não cria acção nova; a dobra fica registada no manifesto (`actions[].folded[]`).
3. Toda a acção nomeia evidência. Se WF e PROC não a indicarem, propõe-se uma e marca-se como recomendação.
4. Notas para o implementador (UUIDs por resolver, «ver setup.md», atribuição pendente) nunca entram na descrição; vão para `setup.md` e `decisions[]`.
5. Depois de preenchido, correr `node scripts/review-actions.mjs workflow.yaml` a partir da raiz do plugin para confirmar que as cinco partes estão presentes em todas as acções. O script verifica presença, não qualidade.

## 5. Lições do piloto e o seu destino (a preencher)

Cada lição recebe exactamente um destino. Uma lição sem caso de origem, data e autor não é incorporada até ser confirmada.

| # | Lição (texto original) | Caso / data / autor | Classificação | Destino | Estado |
| --- | --- | --- | --- | --- | --- |
| — | a preencher | — | — | — | — |

Classificações possíveis:

| Classificação | Significado | Destino |
| --- | --- | --- |
| Instrução | Melhora a forma de executar uma acção existente sem mudar quem decide ou o que se decide | `Como:`, `Evidência:` ou `Excepções:` da acção, secção 4 |
| Conhecimento estável | Regra, definição ou contacto que se mantém entre casos e foi aprovado | Proposta de Memória do Agente, ficheiro `memoria-agente-proposta.md` |
| Facto do caso | Só se aplica ao caso onde surgiu (um fornecedor atrasado, uma excepção pontual) | Fica no incidente; não entra no procedimento nem na memória |
| Contorno | Solução de recurso usada no piloto que contraria PROC ou POL | Excepção a rever, secção 6; não se promove a política |
| Alteração de desenho | Exige mudar acções, ramos, responsáveis ou campos do workflow | Secção 7; encaminhar para `provia-workflow-change` |

## 6. Conflitos e excepções a rever (a preencher)

Registo explícito de cada desacordo entre WF, PROC, POL e PIL. Nenhum é resolvido aqui por omissão; cada linha tem dono e entra em `decisions[]` do manifesto.

| Id | Fonte A diz | Fonte B diz | Tipo | Dono da decisão | Estado |
| --- | --- | --- | --- | --- | --- |
| — | a preencher | — | workflow vs política / contorno do piloto / autoridade | — | aberto |

## 7. Alterações propostas ao workflow (fora do procedimento)

Lista das lições classificadas como «Alteração de desenho». Estas não entram no procedimento publicado enquanto o workflow não tiver nova versão publicada.

| # | Alteração | Origem (lição / caso) | Impacto em casos abertos | Estado |
| --- | --- | --- | --- | --- |
| — | a preencher | — | — | proposta |

## 8. Configuração fora do YAML

Páginas e documentos de memória não são transportados pelo YAML. Depois de importar o workflow, é preciso criar separadamente em Provia:

- a página ou ligação ao procedimento, se as descrições das acções a citarem;
- os documentos de Memória do Agente propostos em `memoria-agente-proposta.md`, após revisão de um administrador.

## 9. Responsável e ciclo de revisão

| Papel | Nome | Estado |
| --- | --- | --- |
| Dono do procedimento (aprova o texto) | a nomear | D3 |
| Responsável pela actualização (mantém o ficheiro) | a nomear | D3 |
| Administrador Provia (revê a memória) | a nomear | D3 |

Revisão proposta: a cada nova versão publicada do workflow e no fecho de cada ciclo de piloto. É uma recomendação; o dono do procedimento decide.

## 10. Decisões em aberto

Ver `provia-project.json` → `decisions[]` (D1 a D5) e `setup.md`. Enquanto D1, D2 e D3 estiverem abertas, este documento é um rascunho estrutural e não deve ser distribuído como procedimento.
