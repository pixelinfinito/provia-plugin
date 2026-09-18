# Comparação: procedimento de compras vs. registos — evidências em falta

## Estado: bloqueado por falta de insumos

O pedido refere "o nosso procedimento de compras" e "estes registos", mas nem a pasta de
trabalho (`/private/var/folders/.../controls-evidence-normal`) nem a conversa contêm:

- o procedimento de compras (SOP, política ou desenho/export do workflow de compras); ou
- os registos/evidências de execução (pedidos, aprovações, cotações, contratos, facturas,
  recepções) a comparar com esse procedimento.

Não foi encontrado nenhum ficheiro na pasta de trabalho além deste relatório e do
`provia-project.json` agora criado. Sem o procedimento não há requisitos para mapear; sem
registos não há evidência para confrontar com esses requisitos.

Por regra de honestidade desta skill, não se inventam requisitos de política, prazos legais,
limiares de aprovação nem registos de execução. Este relatório não certifica conformidade nem
aponta lacunas concretas — apenas prepara o terreno para quando os documentos forem fornecidos.

## O que falta receber

1. **Procedimento de compras** — o texto do SOP/política actualmente em vigor (com data de
   entrada em vigor e, se aplicável, secções/números de cláusula), ou o `workflow.yaml`/export
   do workflow de compras já desenhado no Provia.
2. **Registos** — as evidências de execução a comparar: pode ser um export de pedidos de compra
   (CSV/JSON), cópias de aprovações, cotações recebidas, contratos assinados, facturas e guias de
   recepção, ou o histórico de acções de um ou mais casos concretos.
3. Se o procedimento invocar legislação (ex.: contratação pública, IVA, retenção fiscal), a fonte
   legal actual (diploma, artigo, data de vigência) — caso contrário a revisão fica limitada à
   política interna, sem conclusões legais.

## Matriz preparada (vazia) para preenchimento

| Requisito (fonte/secção) | Acção responsável (`localId`) | Decisão/dado exigido | Evidência esperada | Evidência encontrada | Estado |
| --- | --- | --- | --- | --- | --- |
| _a preencher a partir do procedimento_ | | | | | |

## Registado no manifesto

Foi criado `provia-project.json` (projecto `compras`, Angola/pt-AO por omissão, modo
`disconnected`) com uma entrada aberta em `decisions[]` (D1) a registar esta lacuna de insumos,
com responsável "Dono do processo de compras (a designar)". Nenhuma fonte foi adicionada a
`sources[]` por não ter sido fornecido nenhum documento.

## Próximo passo recomendado

Assim que o procedimento de compras e os registos existirem como ficheiros (ou colados na
conversa), o passo indicado é retomar esta mesma skill, `provia-controls-evidence`, com esses
dois insumos e este `provia-project.json`, para construir a matriz requisito/acção/evidência e
apontar lacunas concretas.

```text
Usa provia-controls-evidence com o provia-project.json em anexo. Segue o procedimento de compras
em anexo (ficheiro/colado) e compara-o com estes registos de execução (ficheiro/colado). Indica
as evidências em falta, separando legislação, política interna e recomendação. País: Angola;
responde em pt-AO.
```

Se o procedimento em si ainda não estiver desenhado como workflow, o passo alternativo é
`provia-workflow-designer` para o transformar num desenho de acções antes de mapear evidências.
