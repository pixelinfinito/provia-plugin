# Controls and evidence review — purchase quotation rule, case P1

Country: Angola · Currency: AOA · Timezone: Africa/Luanda · Reviewed: 2026-09-21 · Mode: disconnected (supplied statements only)

## 1. What was supplied and what was not

Supplied (three statements in chat, no documents):

| Ref | Statement | Classification |
| --- | --- | --- |
| `politica-compras#cotacoes` | "Our Angolan internal policy requires two quotations above 500000 AOA." | **Company policy.** Not legislation. Version, effective date and section not supplied. |
| `registo-p1#p1` | "P1 is 600000 with one quotation." | **Execution record** for one case. No export, case id, dates, requester, approver or attachment list supplied. |
| `template-consultor#base-legal` | "The consultant template cites Brazilian LGPD." | **Recommendation / template**, and a **jurisdiction mismatch**. Not a requirement source for Angola. |

Not supplied: the policy document, a workflow design or `provia-project.json`, a Provia incident export for P1, the consultant template itself, any Angolan legal instrument. The working directory was empty, so a new manifest was created (`provia-project.json`).

Assumptions made to continue:

- "P1" is one purchase case (a Provia incident) with a stated amount of 600 000 AOA and exactly one quotation attached or referenced.
- "Above 500 000 AOA" is read as strictly greater than 500 000. The tax basis (with or without IVA) is unknown. 600 000 exceeds the threshold under either reading, so the finding below does not depend on this ambiguity; the ambiguity is still recorded as decision D2 because it will matter for cases near the threshold.
- The policy is in force today. This is not verified: no effective date was given.

## 2. Jurisdiction and requirement sources

**Jurisdiction: Angola.** The consultant template's citation of the Brazilian Lei Geral de Proteção de Dados (LGPD) does not apply to an Angolan organization's purchasing process. Portuguese-language material is not evidence of Brazilian law applying; jurisdiction follows the country of operation, not the language of the document. The citation is therefore **not adopted** as a requirement in this review.

What replaces it is not asserted here. Angola has its own data-protection framework supervised by the Agência de Protecção de Dados (APD, starting point: https://apd.ao/ao/legislacao/). Verification of the applicable instrument, its article, status and effective date could not be performed in this session (web access was not granted), so **no Angolan legal provision is cited as a requirement**. Decision D3 carries this to Legal/compliance with the source-record fields to fill in (country, authority, instrument title/number, article, publication/effective date, status checked, URL, verification date, implication for the process).

Separation of sources:

| Source type | Content in this review |
| --- | --- |
| Legislation | None verified. No legal requirement is mapped. |
| Company policy | Two quotations above 500 000 AOA (`politica-compras#cotacoes`). This is the only requirement mapped. |
| Recommendation / template | Consultant template; its legal citation is rejected for jurisdiction. Any procedural content in it was not supplied and is not reviewed. |

Nothing in this review is a statement that the organization is, or is not, compliant with Angolan law.

## 3. Requirement / action / evidence matrix

No workflow design was supplied, so the "action" column names the **proposed** action localIds a purchasing workflow would need. They are proposals for `provia-workflow-designer`, not existing Provia actions, and they are not written into `workflows[]` of the manifest.

| # | Requirement (source) | Responsible action (proposed `localId`) | Decision | Required data / document | Evidence of execution | Status for P1 |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Purchases above 500 000 AOA carry at least two quotations (`politica-compras#cotacoes`) | `recolher-cotacoes` — Standard or Form Fill action, assignee: purchasing team (group key to be confirmed) | none | Case metadata: estimated amount (number, AOA); two quotation files or two Form Fill responses, each with supplier, amount, date | Two attachments (or two Form Fill responses) on the case before the approval action; completion timestamp and user | **Gap.** One quotation on record for 600 000 AOA. |
| R1a | Someone verifies the quotation count against the threshold before approval (implicit in R1; the policy text as supplied does not name the verifier) | `verificar-cotacoes` — Standard action, assignee: purchasing lead or finance (to be confirmed, D2) | none | Amount and quotation count on the case | Completion comment stating "N quotations checked against threshold", or a checklist field on the action | **Not evidenced.** No record of a check was supplied. Absence of the record does not prove the check did not happen (see §4). |
| R1b | Exception path: single quotation admitted only with a documented justification and an approver (policy does not say whether this exists — D2) | `decidir-excepcao-fonte-unica` — Decision action, assignee: the approver the policy names (unknown) | Outcomes: continue (exception approved) / return to `recolher-cotacoes` / cancel | Justification text, approver identity | Decision outcome with mandatory comment | **Unknown.** If the policy has no exception path, P1 is a deviation, not an exception. |
| R2 | Personal-data handling basis cited in templates matches the jurisdiction (`template-consultor#base-legal`) | Not a workflow action: template governance | none | Corrected template citing the verified Angolan instrument, or no legal citation | Template version with the correction and the source record from D3 | **Gap.** Template cites Brazilian LGPD. |

Provia references used: Standard actions state what evidence proves completion; Decision actions have named outcomes (continue, cancel, return to an action, trigger a workflow); Form Fill with multiple responses keeps each response separate for review, which fits collecting quotations; a numeric metadata field does not route the workflow by value on its own, so the threshold check must be explained to a human assignee in the action brief (`references/provia-capabilities.md`, `references/countries/angola.md`).

## 4. Designed control versus proof it operated

- **Designed control:** whether a workflow contains an action that requires two quotations above the threshold. Cannot be assessed: no workflow was supplied. Decision D4.
- **Control operated on P1:** the supplied record shows one quotation against a requirement of two. That is a **gap in evidence**. It is not, by itself, proof that a second quotation was never requested or received: it may exist outside the case (email, paper, another system) or a single-source exception may have been approved and not recorded on the case. Decision D1 asks the process owner to establish which.
- An audit trail of the case (who completed which action, when) would show that actions were completed; it would not by itself show that the quotation *content* met the policy. The trail plus the attached quotations plus the verifier's completion comment together form the evidence.

## 5. Findings

| ID | Finding | Type | Severity | Owner |
| --- | --- | --- | --- | --- |
| F1 | P1 (600 000 AOA) has one quotation where policy requires two. Either the second quotation is missing from the record or an undocumented exception was taken. | Confirmed from supplied statements | High for this case | Purchasing manager (D1) |
| F2 | The policy statement as supplied has no version, date, threshold semantics (above/from; with/without tax) or exception rule. | Confirmed gap in the requirement source | Medium | Finance director (D2) |
| F3 | The consultant template cites Brazilian LGPD for an Angolan organization. Jurisdiction mismatch. | Confirmed | Medium (template), not a finding about any specific case | Legal / compliance (D3) |
| F4 | The Angolan data-protection instrument that should replace the citation was not verified in this session. | Limitation | — | Legal / compliance (D3) |
| F5 | No workflow design exists in the project, so the two-quotation control has no named action, assignee or evidence definition yet. | Confirmed gap in design | Medium | Purchasing manager (D4) |

## 6. Remediation proposals

Recommendations, not completed actions:

1. **P1 (F1, owner: purchasing manager).** Locate a second quotation or a written exception approval. If found, attach it to the case with a comment naming the date it was obtained. If not found, record the deviation on the case with the reason and the person who accepted the single source; do not backdate. Resolve D1 with the outcome.
2. **Policy text (F2, owner: finance director).** Supply the policy document (version, effective date, section) so the manifest source `politica-compras` can carry real anchors. Decide the threshold semantics and whether a single-source exception exists and who approves it (D2).
3. **Template (F3/F4, owner: legal/compliance).** Remove the LGPD citation from the consultant template for Angola. Replace it only with an instrument verified from an authoritative source, recording the source-record fields listed in §2 (D3). Until then the template should carry no legal citation rather than a wrong one.
4. **Design (F5, owner: purchasing manager).** Design or export the purchasing workflow so that `recolher-cotacoes`, `verificar-cotacoes` and (if D2 confirms it) `decidir-excepcao-fonte-unica` become named actions with assignees by group key, required evidence and due dates. The action brief for `verificar-cotacoes` must explain the threshold to the assignee in words; Provia does not branch automatically on a numeric field.

## 7. What was and was not verified

- Written: `provia-project.json` (new manifest: 3 sources, 4 open decisions, no workflows), `project.html`, `setup.md`, this report.
- Run: `node scripts/build-project-map.mjs provia-project.json --check` → 0 workflows, 0 groups, 0 errors, 0 warnings, 4 pending items (the decisions). This check validates the manifest shape and references only; it does not validate this Markdown report and it says nothing about compliance.
- Not done: tenant read via `org_get_context` (permission not granted in this session; the manifest stays `mode: disconnected`), web verification of Angolan legislation (permission not granted), review of the actual policy document, template or P1 export (not supplied).
- Nothing was created, changed or published in Provia.

## Source references

- `politica-compras#cotacoes` — internal policy statement, supplied in chat 2026-09-21.
- `registo-p1#p1` — case P1 statement, supplied in chat 2026-09-21.
- `template-consultor#base-legal` — consultant template citation, supplied in chat 2026-09-21.
- Plugin references: `references/skill-conventions.md`, `references/country-context.md`, `references/countries/angola.md`, `references/provia-capabilities.md`, `references/project-manifest.md`.
