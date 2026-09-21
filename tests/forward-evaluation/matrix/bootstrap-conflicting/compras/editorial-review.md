# Revisão editorial — «Pedido de compra» (`compras/workflow.yaml`)

Data: 2026-09-21. Âmbito: as 2 acções do ficheiro, revistas uma a uma contra `references/action-writing.md`. Relatório determinístico: `review-actions.json` (`node scripts/review-actions.mjs compras/workflow.yaml`), 2/2 acções com as cinco partes, 0 notas de implementador nas descrições, 0 acções perto do limite. Esta revisão cobre a redacção; não certifica a correcção do negócio.

## Conclusões por acção

| id | Nome observado | Verbo/objecto | Descrição | Resultado |
| --- | --- | --- | --- | --- |
| `preparar` | Preparar o pedido de compra | Infinitivo + objecto; 5 palavras. | Cinco partes presentes; método numerado nomeia os campos do caso e o anexo; excepção diz o que fazer sem montante. Nenhuma referência a configuração ou ao manifesto. | Mantida |
| `decidir` | Decidir sobre o pedido de compra | Infinitivo + objecto; 6 palavras. Não copia «a chefia aprova» nem «o director financeiro aprova» — o nome é útil seja quem for o responsável, o que importa enquanto D1 está aberta. | Cinco partes; critérios e significado de cada resultado em `Como`; comentário obrigatório em «Devolver» e «Rejeitar» em `Evidência`; a excepção cobre o caso de o decisor não ter autoridade, sem mencionar o conflito de fontes ao destinatário. | Mantida |

## Verificações semânticas

- Nomes distintos para preparar (requerente) e decidir (autoridade); nenhuma acção de execução de pagamento ou compra foi introduzida (D3).
- A autoridade de aprovação não está na descrição nem no nome: fica no `assignee` (por resolver, D1) e em `setup.md`. Isto é deliberado: a descrição não deve afirmar «a chefia» ou «o director financeiro» enquanto as fontes divergem.
- Rótulos de resultado curtos («Aprovar», «Devolver ao requerente», «Rejeitar»); o destino de «Devolver ao requerente» é `preparar`, existente no ficheiro.
- `due` ausente em ambas as acções por falta de nível de serviço nas fontes (D2); não foi inventado prazo.

## Questões em aberto relevantes para a redacção

- Se D1 fixar o director financeiro, rever a excepção de `decidir`: com um aprovador único, «quem deve decidir» passa a ser o substituto (D6).
- Se D1 fixar a chefia do departamento, acrescentar em `Como` de `preparar` o passo «confirmar que a chefia do departamento está preenchida no registo Departamento».
