# Action writing acceptance cases

Use these cases when changing action-writing guidance. Give the evaluated assistant the raw scenario and relevant skill, not the expected column. Inspect the generated artifacts and actual validator output. These are semantic acceptance cases, not an automated grammar checker. Record each execution and its limits separately.

| Raw scenario | Acceptance criteria |
| --- | --- |
| GC confirma o pagamento da gratificação; payment was already executed by signatories | Infinitive confirmation task, GC retained in assignment/handover, evidence retained; no new execution authority |
| Decision named Aprovação da despesa, with approve/reject/return branches | Verb-led decision name; all branches and authority retained |
| Form Fill named Confirmação de recepção | Verb-led task; separate form definition, binding, mappings and response policy preserved |
| Form Fill named Protocolo de experiência | Registration/completion task, not a renamed form definition |
| Propor uma alteração ao orçamento | Accepted as an infinitive; no suffix-only rejection |
| Informar o DG sobre o desvio | Accepted with DG as recipient |
| DG decide até 15 milhões, with exceptions specified in the source | Brief decision task; threshold and exceptions retained outside the name |
| GC prepara; DG aprova; signatários executam | Separate acts and authorities identified; no silent split/merge/routing change |
| Consultar o estado do pagamento, with a read-only HTTP operation | Status lookup remains distinct from executing payment |
| Finance confirms receipt; AI summary of supplier proposals | Base-form English verbs; executor stays separate; AI does not gain approval authority |
| Existing export with stable IDs, branches, assignments, fields and bindings | Compare parsed before/after artifacts excluding only reviewed action names/descriptions; all other values unchanged |
| New package generated from a procedure | Every action reviewed; actual structural validation and editorial review delivered separately; unresolved destination setup explicit |

The reference's 3–10 words and roughly 80 characters are style guidance. Do not reject a technically valid YAML file on this basis. Preserve the pinned contract engine and its fingerprint when changing editorial instructions.

## Description acceptance cases (1.1.0)

The five-part brief (Tarefa/Task, Como/How, Evidência/Evidence, Concluído quando/Done when, Excepções/Exceptions) is checked for presence by `node scripts/review-actions.mjs workflow.yaml`; the cases below are semantic and need a reader.

| Raw scenario | Acceptance criteria |
| --- | --- |
| SOP step «A chefia aprova; o requerente é informado» | One Decision action; the information step is folded into `Como` and recorded in `folded[]`, not emitted as an action |
| SOP with a stated service level of two working days for approval | `due` proposed as 2 workdays from activation, with the section cited |
| SOP with no service level | `due` unset and an open decision with the process owner; no invented deadline |
| Source says «verificar o cabimento» without saying how | `Como` names the concrete system or document to open, or the missing information becomes a decision; `Evidência` names what to attach |
| Design brief contains «atribuição pendente de configuração» | The note lands in `setup.md` / the manifest; the description addressed to the assignee has no implementer note; the gate reports zero leaks |
| Decision with Aprovar / Devolver / Rejeitar | `Como` states the criteria and the meaning of each outcome; `Excepções` says what to do above the assignee's authority |
| Form Fill action | `Evidência` names the submitted response; the form title stays separate from the action name |
| AI-assigned Standard action | The brief is addressed to the human reviewer of the AI output; approval authority stays human |
| Description over 5000 characters | Trimmed to the essentials with the rest in a Page or linked procedure; the gate reports `tooLong` otherwise |
| Bundled examples and the 1.0.2 fixture rewrite | `review-actions.mjs` exits 0 on all five examples and on `workflow-rewritten-1.1.yaml`; exits 1 on the original 1.0.2 fixture with the two leaks named |
