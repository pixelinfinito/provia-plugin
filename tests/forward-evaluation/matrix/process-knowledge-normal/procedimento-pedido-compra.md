# Procedimento actualizado — Pedido de compra (COMP)

**Estado:** rascunho de reconciliação, para aprovação do dono do processo antes de colar em qualquer `actions[].description`.
**Fonte do workflow:** `workflow.yaml`, workflow `compras`, prefixo `COMP`, versão 1, estado `packaged` no manifesto (`provia-project.json`). Nenhuma alteração estrutural foi feita a este ficheiro: IDs, ramos da decisão, prazos, campos e atribuições mantêm-se.
**Fonte das lições:** `licoes-piloto.md` — **assumida**, não é um registo real de piloto (ver aviso de proveniência nesse ficheiro). Substituir pelas lições reais antes de aplicar qualquer instrução abaixo em produção.
**Dono da actualização:** Dono do processo de Compras (a confirmar; nenhum nome foi fornecido).
**Âmbito:** as quatro acções humanas do workflow `compras` — `registar`, `decidir`, `confirmar_cabimento`, `encomendar`.

## Como ler este documento

Para cada acção: o texto **Aprovado (inalterado)** é o que já está em `actions[].description` no workflow aprovado. **Reconciliação proposta** acrescenta o que o piloto ensinou, apenas dentro das partes «Como» e «Excepções», sem tocar em responsável, prazo ou ramos de decisão. Uma actualização proposta só deve ser colada na acção depois de revista pelo dono do processo; até lá, esta é uma recomendação, não uma alteração publicada.

---

## Acção `registar` — Registar a necessidade

**Aprovado (inalterado):**
> Tarefa: Descrever a necessidade de compra de forma que a chefia possa decidir sem perguntar.
> Como: 1. Preencher o campo «Montante solicitado» com o valor total estimado em Kz, sem IVA. 2. Indicar o «Centro de custo» que suportará a despesa. 3. Escrever no título do pedido o bem ou serviço e a quantidade. 4. Se já existir uma proposta de fornecedor, anexá-la ao pedido.
> Evidência: O título, o montante e o centro de custo preenchidos; a proposta anexada quando existir.
> Concluído quando: O pedido tem título, montante e centro de custo, e passa à decisão da chefia.
> Excepções: Se o montante ainda não for conhecido, não concluir: pedir uma estimativa ao fornecedor ou ao serviço requisitante e registá-la antes de avançar.

**Motivo da reconciliação:** L2 (falta de proposta obriga a "Devolver" em 4 de 10 casos) e L5 (anexar a proposta na origem reduziu o ciclo a metade, segundo o piloto assumido).

**Reconciliação proposta:**
> Tarefa: Descrever a necessidade de compra de forma que a chefia possa decidir sem perguntar.
> Como: 1. Preencher o campo «Montante solicitado» com o valor total estimado em Kz, sem IVA. 2. Indicar o «Centro de custo» que suportará a despesa. 3. Escrever no título do pedido o bem ou serviço e a quantidade. 4. Pedir e anexar a proposta do fornecedor **antes** de submeter, sempre que exista mais de um fornecedor possível ou o montante não seja trivial; o piloto mostrou que pedidos sem proposta são devolvidos pela chefia, alongando o ciclo em 1–2 dias úteis.
> Evidência: O título, o montante e o centro de custo preenchidos; a proposta anexada quando existir.
> Concluído quando: O pedido tem título, montante e centro de custo, e passa à decisão da chefia.
> Excepções: Se o montante ainda não for conhecido, não concluir: pedir uma estimativa ao fornecedor ou ao serviço requisitante e registá-la antes de avançar. Se não for possível obter a proposta do fornecedor antes do prazo desta acção, submeter mesmo assim e assinalar no comentário que a proposta será enviada em separado, para a chefia decidir com essa informação.

---

## Acção `decidir` — Decidir sobre o pedido

**Aprovado (inalterado):**
> Tarefa: Decidir se o pedido de compra avança, com base na necessidade descrita e no orçamento do departamento.
> Como: 1. Ler a justificação no título e a proposta anexada, se existir. 2. Confirmar que a compra está prevista no plano do departamento e que o «Centro de custo» está correcto. 3. Escolher «Aprovar» para avançar, «Devolver» para pedir correcções ao requerente ou «Rejeitar» para encerrar o pedido.
> Evidência: Um comentário com o motivo é obrigatório em «Devolver» e «Rejeitar».
> Concluído quando: A decisão está registada com o comentário exigido.
> Excepções: Se o montante exceder a sua autoridade de aprovação, não decidir: comentar o limite e devolver ao requerente para que o pedido seja encaminhado à autoridade competente.

**Motivo da reconciliação:** L3 (a chefia excedeu o prazo de 2 dias úteis em 5 de 10 casos, por decidir em lote semanal).

**Reconciliação proposta:** nenhuma alteração de redacção é recomendada aqui. O prazo já está definido em `due` (2 dias úteis) e a instrução já diz o que fazer; o problema observado é de cumprimento e cadência de trabalho, não de instrução em falta. Ver decisão **D5** — é o dono do processo, não este documento, que decide se ajusta o prazo, exige decisão diária em vez de semanal, ou reforça o cumprimento. Não alterar `due` nem a redacção sem essa decisão.

---

## Acção `confirmar_cabimento` — Confirmar disponibilidade orçamental

**Aprovado (inalterado):**
> Tarefa: Confirmar que existe cabimento orçamental para o montante pedido no centro de custo indicado.
> Como: 1. Abrir o mapa orçamental do centro de custo no sistema de contabilidade. 2. Comparar o saldo disponível com o valor em «Montante solicitado». 3. Registar a referência do cabimento no campo «Referência orçamental».
> Evidência: Anexar a captura do saldo com data e preencher «Referência orçamental».
> Concluído quando: O saldo cobre o montante e a referência orçamental está registada.
> Excepções: Se não houver cabimento, não concluir: comentar o défice e pedir à chefia que reveja o pedido ou indique outro centro de custo.

**Motivo da reconciliação:** L1 — em 3 de 10 casos, Finanças confirmou por telefone e concluiu sem a captura do saldo nem a `budget_reference`, alegando urgência.

**Conflito identificado (não reconciliado por este documento):** a prática observada contraria a política aprovada, que exige evidência documental do saldo. Este documento **não** promove a confirmação verbal a alternativa válida. Regista-se como excepção a rever, não como nova regra — ver decisão **D3**.

**Reconciliação proposta (apenas reforço, sem mudar a exigência):**
> Tarefa: Confirmar que existe cabimento orçamental para o montante pedido no centro de custo indicado.
> Como: 1. Abrir o mapa orçamental do centro de custo no sistema de contabilidade. 2. Comparar o saldo disponível com o valor em «Montante solicitado». 3. Registar a referência do cabimento no campo «Referência orçamental».
> Evidência: Anexar a captura do saldo com data e preencher «Referência orçamental». Uma confirmação verbal ou por telefone, sem captura anexada, não constitui evidência suficiente para concluir esta acção, mesmo em pedidos urgentes.
> Concluído quando: O saldo cobre o montante, a referência orçamental está registada e a captura do saldo está anexada.
> Excepções: Se não houver cabimento, não concluir: comentar o défice e pedir à chefia que reveja o pedido ou indique outro centro de custo. Se a urgência do pedido tornar impraticável obter a captura antes do prazo, não concluir a acção: comentar a urgência e escalar ao dono do processo (decisão em aberto, ver D3), em vez de confirmar apenas por telefone.

---

## Acção `encomendar` — Registar a encomenda

**Aprovado (inalterado):**
> Tarefa: Emitir a encomenda ao fornecedor e registar a sua referência no pedido.
> Como: 1. Confirmar que o fornecedor existe no registo de fornecedores e que os seus dados estão actualizados. 2. Emitir a nota de encomenda com o montante aprovado e a referência orçamental. 3. Enviar a nota ao fornecedor pelo canal acordado. 4. Preencher «Referência da encomenda».
> Evidência: A nota de encomenda anexada e o campo «Referência da encomenda» preenchido.
> Concluído quando: O fornecedor recebeu a nota de encomenda e a referência está registada no pedido.
> Excepções: Se o fornecedor não existir no registo ou os dados estiverem desactualizados, não concluir: pedir a criação ou actualização do registo e comentar o pedido.

**Motivo da reconciliação:** L4 — em 2 casos, a acção ficou bloqueada porque o fornecedor estava suspenso ou com o contacto desactualizado, sem indicação de a quem pedir a reactivação.

**Reconciliação proposta:**
> Tarefa: Emitir a encomenda ao fornecedor e registar a sua referência no pedido.
> Como: 1. Confirmar que o fornecedor existe no registo de fornecedores, que a «Situação» está «Activo» e que o contacto comercial está actualizado. 2. Emitir a nota de encomenda com o montante aprovado e a referência orçamental. 3. Enviar a nota ao fornecedor pelo canal acordado. 4. Preencher «Referência da encomenda».
> Evidência: A nota de encomenda anexada e o campo «Referência da encomenda» preenchido.
> Concluído quando: O fornecedor recebeu a nota de encomenda e a referência está registada no pedido.
> Excepções: Se o fornecedor não existir no registo, estiver suspenso ou com os dados desactualizados, não concluir: comentar o pedido e pedir a criação ou reactivação do registo. *(A quem dirigir esse pedido dentro de Compras ainda não está definido — ver decisão D4; não inventar aqui um destinatário.)*

---

## Resumo dos conflitos e decisões em aberto

| Id | Questão | Dono proposto | Estado |
| --- | --- | --- | --- |
| D1 | Limite de autoridade das chefias e quem aprova acima dele | Director financeiro | aberta (herdada do desenho) |
| D2 | Pode a chefia aprovar um pedido que ela própria registou | Dono do processo | aberta (herdada do desenho) |
| D3 | Confirmação de cabimento por telefone sem evidência: excepção pontual ou via alternativa a formalizar | Director financeiro | aberta (deste piloto) |
| D4 | A quem pedir a reactivação de um fornecedor suspenso antes de encomendar | Compras | aberta (deste piloto) |
| D5 | Ajustar prazo/cadência da decisão da chefia face ao incumprimento observado | Dono do processo | aberta (deste piloto) |

Estas decisões estão registadas em `provia-project.json` → `decisions[]` (D1–D2 herdadas do desenho original; D3–D5 acrescentadas por esta tarefa). Nenhuma foi resolvida aqui.

## O que este documento não faz

- Não altera `workflow.yaml`: nenhuma redacção acima foi colada nas acções; ficam como recomendação até o dono do processo aprovar.
- Não promove a excepção do L1 a nova política.
- Não confirma se as lições do piloto (L1–L5) reflectem execuções reais: são uma entrada assumida por falta de ficheiro fornecido, registada em `licoes-piloto.md`.
