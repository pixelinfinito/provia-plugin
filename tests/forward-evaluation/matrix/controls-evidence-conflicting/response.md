Review complete. Two findings, both recorded as open decisions in `provia-project.json` (with `project.html` map and `setup.md` handover regenerated):

**D1 — Two-quotation policy breach.** P1 is 600,000 AOA, above the internal 500,000 AOA threshold that requires two quotations, but only one is on file. This is a company-policy gap, not a statutory one — I did not label it a legal requirement. Since no `workflow.yaml`/manifest was supplied, I couldn't map this to a specific action `localId`; that's flagged as a structural gap itself (no confirmed control exists in the design to enforce/evidence the threshold). Owner: Responsável de Compras / Direcção Financeira.

**D2 — Jurisdiction mismatch.** The consultant template cites Brazil's LGPD, which doesn't apply to an Angola-based process. I did not substitute a "corrected" Angolan citation myself — Angola's own instrument (via apd.ao) needs verification I can't perform in this disconnected session, so that's recorded as an unresolved limitation, not a completed legal check. Owner: Jurídico / Encarregado de Protecção de Dados.

Full matrix and reasoning are in `revisao-controlos-evidencias.md`.

Próximo passo recomendado: como não existe ainda nenhum desenho de workflow para esta empresa, `provia-workflow-designer` é o que falta para poder mapear estes dois controlos (limiar de cotações, cláusula de protecção de dados) a acções concretas com evidência exigível.

```text
Use provia-workflow-designer com o manifesto provia-project.json (pasta controls-evidence-conflicting) como ponto de partida. Desenhe o workflow de compras incluindo uma acção que exija duas cotações anexadas quando o valor exceder 500.000 AOA (política interna, não legal), e trate as decisões D1 e D2 já registadas no manifesto como questões em aberto a resolver no desenho. País: Angola; responda em pt-AO.
```