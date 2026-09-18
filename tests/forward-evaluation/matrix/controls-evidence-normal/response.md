Não encontrei nenhum ficheiro na pasta de trabalho nem conteúdo colado na conversa com o procedimento de compras ou os registos referidos — por isso não posso construir a matriz requisito/acção/evidência nem apontar lacunas concretas sem inventar factos, o que viola as regras de honestidade desta skill. Criei:

- `provia-project.json` — manifesto do projecto (Angola/pt-AO por omissão), com uma decisão aberta (`D1`) a registar esta falta de insumos e um responsável a designar. Validado com `build-project-map.mjs --check`.
- `evidencias-compras-relatorio.md` — explica o bloqueio, lista exactamente o que falta (o procedimento/SOP ou export do workflow, e os registos de execução a comparar) e deixa uma matriz vazia pronta a preencher.

**Próximo passo recomendado:** assim que tiver o procedimento de compras e os registos (como ficheiros ou colados na conversa), reinvoque `provia-controls-evidence` com esses dois documentos e este `provia-project.json`:

```text
Usa provia-controls-evidence com o provia-project.json em anexo. Segue o procedimento de compras
em anexo (ficheiro/colado) e compara-o com estes registos de execução (ficheiro/colado). Indica
as evidências em falta, separando legislação, política interna e recomendação. País: Angola;
responde em pt-AO.
```

Se o procedimento ainda não estiver desenhado como workflow, o passo alternativo é `provia-workflow-designer` para o converter em acções antes de mapear evidências.