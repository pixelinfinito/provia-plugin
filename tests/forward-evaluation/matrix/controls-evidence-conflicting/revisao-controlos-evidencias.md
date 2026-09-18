# Revisão de controlos e evidências — Compras (P1)

País: Angola. Modo: desligado (nenhum servidor `provia-implementer` presente). Nenhum `workflow.yaml` nem manifesto anterior foi fornecido nesta pasta; este é o ponto de partida do projecto.

## O que foi fornecido

- Uma regra de **política interna** da empresa: aquisições acima de 500.000 AOA exigem duas cotações. Não foi fornecido o documento de política, a sua versão, secção ou data de vigência — trata-se de uma regra da organização, não de uma norma legal citada. Não a apresento como obrigação estatutária.
- Um caso, **P1**: valor 600.000 AOA, uma cotação registada.
- Um modelo de contrato de consultoria que cita a **LGPD** (Lei Geral de Protecção de Dados, Brasil, Lei n.º 13.709/2018).
- Nenhum desenho de workflow (`workflow.yaml`) nem manifesto — não há acções (`localId`) às quais mapear estes requisitos.

## Achado 1 — Limiar de duas cotações não cumprido em P1

| Item | Detalhe |
| --- | --- |
| Fonte | Política interna de compras (fornecida em texto; documento e secção não fornecidos) — "aquisições acima de 500.000 AOA requerem duas cotações" |
| Caso | P1 |
| Valor do pedido | 600.000 AOA — acima do limiar de 500.000 AOA |
| Cotações registadas | 1 |
| Cotações exigidas pela regra | 2 |
| Acção do workflow responsável | Não determinável — nenhum workflow foi fornecido |

**Estado: incumprimento aparente da política interna**, não de uma norma legal — este é um limiar definido pela organização, e deve ser tratado como tal (ver `angola.md`: limiares de aprovação são um input de política, não um requisito estatutório).

Duas leituras possíveis que não posso distinguir sem mais evidência:
1. A segunda cotação foi obtida mas não está registada/anexada ao caso (falha de evidência, não necessariamente falha do controlo).
2. O controlo não foi executado (falha do controlo).

A ausência de evidência não prova, por si só, que a segunda cotação nunca foi pedida — mas também não a substitui. Ambas as leituras exigem a mesma acção correctiva imediata: localizar ou obter a segunda cotação, ou registar formalmente uma excepção aprovada por quem tem autoridade para a conceder.

**Lacuna estrutural**: sem o desenho do workflow não é possível confirmar se existe uma acção que:
- Calcule/exponha o limiar de 500.000 AOA como campo de decisão;
- Exija o anexo de duas cotações quando o valor o ultrapassa, antes de a acção de decisão poder avançar;
- Deixe evidência (documento anexado, não um comentário livre) de que a regra foi verificada.

Registado como `D1` no manifesto (`provia-project.json`), com responsável "Responsável de Compras / Direcção Financeira", estado `open`.

## Achado 2 — Modelo de consultoria cita a LGPD (Brasil) para um processo em Angola

| Item | Detalhe |
| --- | --- |
| Fonte | Modelo de contrato de consultoria fornecido pelo utilizador |
| Cláusula citada | LGPD — Lei Geral de Protecção de Dados, Lei n.º 13.709/2018 (Brasil) |
| Jurisdição do processo | Angola |

**Incompatibilidade de jurisdição.** A LGPD é legislação brasileira; não é o instrumento aplicável a um processo sediado em Angola só porque o modelo está em português. Angola tem a sua própria legislação de protecção de dados pessoais — a Autoridade de Protecção de Dados (APD) publica os instrumentos em vigor em https://apd.ao/ao/legislacao/ — mas não posso, nesta sessão desligada e sem acesso à internet, confirmar o número, o texto em vigor, alterações ou a data de vigência exactos. Isto fica registado como uma limitação de verificação, não como uma citação legal que estou a assumir correcta.

**Não faço a substituição da cláusula** sem verificação jurídica: seria inventar uma provisão legal, o que as regras de honestidade deste plugin proíbem. A acção correctiva é:
1. Obter o texto actual e verificado do instrumento angolano aplicável (fonte APD, com número, artigo/secção, data de publicação, estado em vigor e data de verificação).
2. Rever se o processo em causa envolve alguma transferência transfronteiriça de dados (ex.: consultor com operação no Brasil) que possa, adicionalmente, accionar obrigações de outra jurisdição — isto é uma questão em aberto, não uma conclusão.
3. Substituir a cláusula no modelo e obter validação jurídica antes de reutilizar o modelo noutros contratos.

Registado como `D2` no manifesto, com responsável "Jurídico / Encarregado de Protecção de Dados", estado `open`.

## Matriz requisito / acção / evidência

| Requisito | Fonte | Tipo | Acção do workflow (localId) | Evidência exigida | Evidência encontrada | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| Duas cotações acima de 500.000 AOA | Política interna de compras | Política da organização | Não determinável — sem workflow fornecido | Duas cotações anexadas ao caso | 1 cotação (P1, 600.000 AOA) | Gap — ver D1 |
| Cláusula de protecção de dados no contrato de consultor | Modelo de contrato | Modelo/instrução interna citando lei | N/A (documento, não acção de workflow) | Cláusula alinhada com a lei angolana aplicável | Cláusula cita a LGPD (Brasil) | Gap de jurisdição — ver D2 |

## Confirmado vs. recomendação vs. em aberto

- **Confirmado pelos dados fornecidos**: P1 tem valor acima do limiar interno declarado e apenas uma cotação anexada; o modelo de consultor cita a LGPD brasileira.
- **Recomendação**: tratar D1 como excepção a decidir por quem tem autoridade (obter a 2.ª cotação ou aprovar formalmente a excepção); substituir a cláusula do modelo por texto angolano verificado antes de reutilizar o modelo.
- **Em aberto / não verificável nesta sessão**: se o controlo de duas cotações existe hoje como acção de workflow com validação automática; o texto e estado em vigor exactos da lei angolana de protecção de dados aplicável; se há transferência transfronteiriça de dados no contrato de consultoria.

Não certifico conformidade da organização com nenhuma norma. Não afirmo que este relatório, por si só, constitui evidência de execução de um controlo.
