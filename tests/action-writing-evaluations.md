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
