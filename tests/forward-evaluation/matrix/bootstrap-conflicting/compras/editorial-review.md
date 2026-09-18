# Revisão editorial — Aprovação de pedidos de compra (`compras/workflow.yaml`)

Âmbito revisto: workflow completo, 1 acção (`decidir`). Gerado a partir de duas fontes parciais e conflituantes (ver `provia-project.json`, decisões D1–D4).

## Verificação determinística (`node scripts/review-actions.mjs compras/workflow.yaml`)

```json
{
  "valid": true,
  "workflow": "Aprovação de pedidos de compra",
  "reviewedActions": 1,
  "summary": { "applicable": 1, "complete": 1, "incomplete": 0, "automatedWithoutDescription": 0, "leaks": 0, "dueMissing": 1 },
  "actions": [
    {
      "id": "decidir",
      "name": "Decidir sobre o pedido de compra",
      "type": "decision",
      "applicable": true,
      "complete": true,
      "parts": { "task": true, "method": true, "evidence": true, "doneWhen": true, "exceptions": true },
      "missing": [],
      "leaks": [],
      "length": 803,
      "tooLong": false,
      "empty": false,
      "due": "missing"
    }
  ]
}
```

As cinco partes da descrição estão presentes, não há fugas de notas de implementador e o comprimento está dentro do limite. O único aviso estrutural é `due: missing`, que é esperado: nenhuma das fontes indica um prazo, e um prazo não é inventado.

## Verificação semântica (manual)

1. **Verbo inicial, objecto e clareza.** «Decidir sobre o pedido de compra» começa com verbo no infinitivo, tem objecto claro e é curto (5 palavras). Aceite.
2. **Nome vs. fonte, tipo, descrição e operação real.** As duas fontes descrevem uma aprovação («a chefia... aprova», «só o director financeiro aprova»); o tipo `decision` com ramos Aprovar/Rejeitar corresponde. O nome não fixa nenhum dos dois aprovadores propostos pelas fontes, o que é intencional: a autoridade está em conflito (decisão D1) e o nome da acção deve continuar útil independentemente de quem for atribuído.
3. **Atribuições, autoridade, coordenação, condições e evidência.** A autoridade real (chefia vs. director financeiro) não está fixada na descrição nem em `assignee`/`assigneeRef` — está registada como decisão em aberto D1 em `provia-project.json`, conforme a regra de não escolher entre fontes que se contradizem. A descrição instrui explicitamente o futuro assinante a confirmar a sua autoridade antes de decidir, precisamente por essa incerteza; isto é orientação operacional para quem decide, não uma nota de implementador, pelo que fica na descrição e não em `setup.md`. A evidência (comentário obrigatório em «Rejeitar») está definida.
4. **Comparação antes/depois.** Não aplicável — desenho novo, sem exportação anterior.
5. **Estado da revisão.** Revisão efectivamente executada sobre o ficheiro gerado nesta sessão (não um exemplo hipotético). Nenhuma acção adicional existe no workflow para rever.

## Achados

Nenhum achado de redacção. O único ponto em aberto é de negócio, não editorial: a quem atribuir `decidir` (decisão D1) e qual o prazo (sem fonte).

## Não verificado

- Correcção de negócio da regra de aprovação: fora do âmbito editorial; depende da resolução de D1–D3 pelo dono do processo.
- Validação de destino (import preview no Provia): não executada — sem servidor `provia-implementer` disponível nesta sessão.
