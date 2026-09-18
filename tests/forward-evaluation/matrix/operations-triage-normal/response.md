Verifiquei o directório de trabalho (`/private/var/folders/.../operations-triage-normal`) e ele está vazio — não existe nenhum ficheiro de exportação, `provia-project.json`, nem dados de registos anexados a este pedido. Não há também texto colado com a exportação na mensagem.

Não posso produzir uma lista de atenção sem registos reais: isso violaria a regra de honestidade do plugin, que proíbe inventar estados, prazos ou resultados. Não vou fabricar pedidos, prazos ou atrasos fictícios "de Luanda" para preencher a resposta.

**O que falta para eu continuar:**
- A exportação de pedidos/casos (CSV, JSON ou texto) — precisa de, no mínimo: identificador do pedido, estado, responsável/grupo, data de criação, prazo (se existir) e localização/filial (para filtrar Luanda).
- A hora de observação (ex.: "exportado às 09:00 de 2026-09-18") para eu poder distinguir o que está realmente atrasado do que ainda está dentro do prazo.
- Opcional: `provia-project.json` do projecto, para eu referenciar os grupos responsáveis pelas chaves correctas em vez de nomes soltos.

Coloque o ficheiro de exportação no directório de trabalho (`operations-triage-normal`) ou cole o conteúdo na mensagem, e refaço a triagem imediatamente com o mesmo pedido.

---

Próximo passo recomendado: assim que a exportação estiver disponível, reinvoque `provia-operations-triage` com os dados reais — é o mesmo pedido, apenas com a evidência anexada.

```text
Usa provia-operations-triage. Exportação de pedidos em anexo/colada abaixo (Luanda). Hora de observação: [preencher]. Pergunta: que pedidos precisam de atenção hoje em Luanda?
```