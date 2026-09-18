# AI profile: Compare supplier quotations

Country context: none was supplied, so Angola is used as a provisional starting context (currency AOA, timezone Africa/Luanda) per plugin convention; confirm before relying on it. No source SOP was supplied for this task; criteria, weights and thresholds below are proposals, not confirmed policy — see `decisions[]` in `provia-project.json`.

## Why the request was adjusted

The request asked for an AI profile that compares quotations, selects the winner **and approves its own recommendation with no human decision**. That last part is kept out of this design for two separate reasons, one structural and one of authority:

- **Structural**: in Provia, AI agents are assignees on **Standard** actions only. A Decision action's outcome (continue, cancel, trigger another workflow, or return) is not an automatic value-based gateway — it is an authorized person's act. There is no configuration that assigns a Decision to an AI agent.
- **Authority**: even where a platform allowed it, having the same actor prepare and approve a procurement award removes the segregation of duties that a supplier award decision exists to provide, and removes the reviewable moment this skill is built to protect.

So the design below keeps the AI on a Standard action, `compare_quotations`, that prepares a ranked, evidence-based comparison and a **proposed** winner. It is always followed by a human Decision action, `decide_supplier`, that records the actual award. The AI never writes to any field that represents an approval, award or status change; it can only ever write a proposal.

## Action 1 — `compare_quotations` (Standard, AI-assigned)

### Assignment

`assignee.type: ai_agent`, `assignee.id`: the profile UUID created in Provia from the settings below (not invented here).

### aiWorker settings

```yaml
aiWorker:
  instructions: |
    Objective: compare the supplier quotations attached to this case and produce a
    structured, evidence-based comparison with one proposed winning supplier. You
    do not approve, award, select or finalize anything; a human makes that decision
    in the next action.

    Inputs you may read: purchase_request_id, required_specifications, budget_reference,
    evaluation_criteria (the criteria and their weights, when the case defines them),
    and the attached supplier quotation documents (supplier_quotes).

    Rules:
    1. Score every quotation strictly against the criteria and weights present in the
       case. Do not invent a criterion, weight, tax rule or discount that is not stated.
    2. A quotation missing a price, delivery term or another criterion needed for
       scoring is "incomplete": exclude it from the ranking and list it with the
       missing field(s). Do not estimate or guess a missing value.
    3. If two or more quotations conflict or are ambiguous (unclear currency, unclear
       scope, inconsistent units, expired validity date), mark the comparison as
       "contains contradictions", list them, and do not resolve them by assumption.
    4. Fewer than 2 usable quotations: state that a comparison cannot be produced and
       explain why, instead of proposing a winner.
    5. Always name a rationale for the proposed winner in terms of the stated criteria.
       Always state a confidence score (0-1) reflecting completeness and clarity of
       the input quotations, not the size of the price gap.
    6. Never write to any approval, award or status field. Your output is a proposal
       for the human decision that follows this action.
  readableFields:
    - purchase_request_id
    - required_specifications
    - budget_reference
    - evaluation_criteria
    - supplier_quotes
  writableFields:
    - comparison_summary
    - proposed_supplier_ref
    - comparison_confidence
  requiredArtifacts:
    - filenamePattern: "quote-*.pdf"
      mime: application/pdf
      maxBytes: 10485760
      description: "One quotation document per supplier being compared"
  mode: safe
  reviewRequired: true
  confidenceThreshold: 0.7
  limits:
    timeoutSeconds: 90
    maxRetries: 1
```

`comparison_summary`, `proposed_supplier_ref` and `comparison_confidence` are field keys proposed for this task; confirm them against the organization's actual metadata schema (or design them with `provia-information-model`) before import. `reviewRequired: true` is the useful default for a new AI task per the product guidance and is reinforced here structurally: the very next action is a human Decision, so the AI's output is reviewed regardless.

### `description` (five-part brief, written for the human who reviews the AI's output)

```text
Task: Review the supplier comparison the AI prepared and check it is fit to decide on.
How: 1. Open the comparison report in this case. 2. Confirm every attached quotation
that should be in scope was actually compared, and that any exclusion (incomplete or
contradictory quotation) is explained. 3. Spot-check the score of at least one
supplier against the source quotation.
Evidence: The comparison report is attached with per-supplier scores against the
stated criteria, the proposed winner, its rationale, and a confidence score.
Done when: You can see which quotations were compared, why any were excluded, and
what is proposed, well enough to make the award decision in the next action.
Exceptions: If a required quotation is missing from the case, or the comparison
confidence is low, or the report flags a contradiction it did not resolve, do not
treat the proposal as a recommendation to follow blindly: resolve the gap (request the
missing quotation, clarify the contradiction) before deciding.
```

## Action 2 — `decide_supplier` (Decision, human)

This is the actual award decision. It is unchanged from a normal procurement Decision action except that its brief now explicitly incorporates reviewing the AI's proposal rather than treating it as final.

### `description` (five-part brief to the assignee)

```text
Tarefa: Decide qual fornecedor é adjudicado, com base na comparação preparada pela IA
e na necessidade descrita no pedido.
Como: 1. Ler o relatório de comparação e a proposta de vencedor. 2. Confirmar que os
critérios e pesos aplicados correspondem à política de compras. 3. Escolher
«Adjudicar ao fornecedor proposto», «Adjudicar a outro fornecedor» ou «Devolver para
nova comparação».
Evidência: Um comentário com o motivo é obrigatório sempre que a decisão diverge da
proposta da IA, e em «Devolver».
Concluído quando: A adjudicação fica registada com o fornecedor escolhido e o
comentário exigido.
Excepções: Se a comparação estiver incompleta, contraditória ou com confiança baixa,
não decidir: comentar a lacuna e devolver para nova comparação ou para recolha de
propostas adicionais.
```

(Given in pt-AO as the working example for the Angola context; translate to the
organization's actual working language before import.) `assigneeRef` for this action
is intentionally left unset in `provia-project.json` — see `decisions[D1]`: which
group or role holds award authority, and any value-based escalation, is an open
question for `provia-organization-rollout`, not a decision this skill can make.

## Output contract

The AI's Standard action always produces a `comparison_summary` shaped as:

```json
{
  "suppliers_compared": [
    { "supplier_ref": "string", "scores": { "criterion_key": "number" }, "weighted_total": "number" }
  ],
  "excluded": [
    { "supplier_ref": "string", "reason": "incomplete | contradictory", "detail": "string" }
  ],
  "proposed_supplier_ref": "string | null",
  "rationale": "string",
  "confidence": "number (0-1)",
  "notice": "This is a proposal for review; it is not an award decision."
}
```

`proposed_supplier_ref` is `null` when fewer than 2 usable quotations remain or every quotation is excluded; the AI must say so in `rationale` rather than leaving the case silently unresolved.

## Evaluation cases

| Case | Input | Expected AI behaviour |
| --- | --- | --- |
| Normal | 3 complete, consistent quotations, criteria and weights present | Full ranking, one proposed supplier, rationale tied to stated criteria, confidence reflects completeness (high) |
| Incomplete | 1 of 3 quotations missing a price | That quotation is excluded and listed with the missing field; ranking proceeds on the remaining 2 if ≥2 remain usable, otherwise no proposal is made |
| Contradictory | 2 quotations quote different currencies with no stated exchange rate, or an ambiguous scope | Flagged as "contains contradictions" with the specific conflict named; no silent resolution; if the contradiction blocks scoring, no proposal is made for the affected suppliers |
| Below minimum | Only 1 usable quotation | No comparison or proposal produced; case states a comparison needs at least 2 quotations |
| Self-approval attempt | (Out of scope for the AI) | The AI never has write access to any award/status field, so this cannot occur structurally regardless of instructions |

## What this deliverable does not do

- It does not create the AI profile, the fields, or the workflow in Provia; nothing was published, and no organization was read or changed (disconnected mode; the `provia-implementer` server was not detected in this session).
- It does not resolve `decisions[D1]` and `decisions[D2]` in `provia-project.json`: the approving group/role and the exact criteria/weights are open questions for the process owner.
- It does not certify that this satisfies the organization's actual procurement policy; only the supplied request was used as evidence.
