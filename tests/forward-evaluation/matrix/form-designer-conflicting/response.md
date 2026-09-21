## Result

The request contains a conflict, and the design resolves it rather than pretending it away.

**The conflict.** Three quotations as *multiple* Form Fill responses cannot each map to the same incident field. In the pinned Provia contract a single response can map values and complete the action; multiple responses are kept as a review collection and cannot map competing values (references/provia-capabilities.md). And even if the product allowed it, the case would end up showing whichever quotation arrived last, with no record of a choice.

**The design.** Form "Supplier quotation" linked to Form Fill action `register-quotation` (**Register the supplier quotations received**) with multiple responses and **no mappings**. A separate Standard action `select-quotation` (**Select the winning quotation**) reads the three responses and fills `purchase_amount`, `selected_supplier`, `selected_quotation_reference`, `quotations_received` and `selection_rationale`, so the amount on the case is always traceable to one submitted quotation. The alternative (three single-response actions mapping to `quotation_1/2/3_amount`, then the same review step) is documented and left to the Purchasing lead as decision D4.

**Assumptions stated** (no procedure, manifest or organization context was supplied): Angola/AOA as provisional context; English output; respondents are internal Purchasing staff (external supplier access not promised — D1); no deadlines (D2); workflow declared `creator_only` until someone says who opens purchase requests (D3).

**Artefacts written** to the working directory:

| File | Content |
| --- | --- |
| `quotation-form.md` | The form specification: conflict analysis, respondents/access, 10 fields with validation and reason, mappings (none, deliberately), uploads, confirmation text, both action briefs, 10 testing steps, what was/wasn't verified, open decisions |
| `provia-project.json` | New manifest: `forms[]` entry `cotacao-fornecedor` with `workflowRef`/`actionRef`, `formRef` on the action, proposed group `compras`, access declaration, 7 setup notes, decisions D1–D5 |
| `workflow.yaml` | Minimal skeleton carrying the two actions and incident fields (forms are not packaged in YAML) |
| `validation.json` | `validate-workflow.mjs`: `valid: true`, backend schema passed; 1 product warning (form must be re-linked after import), 3 setup items |
| `action-review.json` | `review-actions.mjs`: 2/2 briefs complete, 0 leaks, 2 without `due` |
| `project.html`, `setup.md` | `build-project-map.mjs --check`: 0 errors, 0 warnings, 1 expected info; map and handover regenerated |

**Not verified:** anything in a Provia tenant. The host offered the Provia MCP server but the `org_get_context` read was not permitted in this session, so nothing was read from or written to an organization. Whether the link allows multiple responses, the file size limit and any external form access must be confirmed in Provia (listed in `setup.md`).

Recommended next step: `provia-workflow-designer`, because the quotation segment now exists without the surrounding purchase process (intake, approval of the selected amount, who opens the case), and decisions D3–D5 belong to that design.

```text
Use provia-workflow-designer with provia-project.json and workflow.yaml in this directory. Keep the form cotacao-fornecedor, the actions register-quotation and select-quotation and their briefs. Design the rest of the purchase request around them (who opens the case, approval of purchase_amount after selection, what happens with fewer than three quotations) and resolve decisions D3, D4 and D5 with the process owner. Country: Angola; reply in English.
```