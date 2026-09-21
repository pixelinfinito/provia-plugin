Trabalho concluído em modo desligado. Ponto essencial primeiro: **o relatório não foi entregue** — a pasta de trabalho estava vazia e a leitura da organização Provia (`org_get_context`) não foi autorizada nesta sessão. Assumi Angola / pt-AO / Africa/Luanda como contexto provisório e continuei com tudo o que não depende dos dados.

## O que ficou pronto

| Ficheiro | Conteúdo |
| --- | --- |
| `analise-compras.md` | Verificações de cobertura (períodos, fuso, duplicados, casos abertos, versão do workflow), fórmulas de ciclo / espera / trabalho activo com denominadores e exclusões, seis hipóteses de perda de tempo com a evidência que confirma ou refuta cada uma, e o desenho do teste antes/depois com guardas de confusão |
| `calcular-tempos.mjs` | Script Node que calcula mediana e P90 do ciclo (dias corridos e úteis), tabela por acção, devoluções e avisos de cobertura a partir de um CSV — colunas passadas como parâmetros para não inventar formato. Corri-o com um CSV descartável de 2 linhas só para confirmar que executa |
| `provia-project.json` | Manifesto com a fonte em falta e decisões D1–D6 (`--check`: 0 erros, 0 avisos, 6 pendentes) |
| `setup.md`, `project.html` | Gerados do manifesto |

## Onde se perde tempo — hipóteses, não factos

Sem dados não há resultado. As hipóteses a ordenar pela tabela por acção do script: **H1** fila na aprovação, **H2** devoluções por pedido incompleto, **H3** recolha de cotações a fornecedores, **H4** casos sem responsável. **H5** (volume/mistura) e **H6** (nova versão do workflow) são variáveis de confusão a estratificar antes de atribuir o atraso a um passo ou grupo.

## Como testar a melhoria

Uma mudança só, escolhida pela acção que concentra o aumento entre períodos (tabela na secção 5 do relatório). Teste antes/depois: linha de base ≥ 4 semanas ou 30 casos concluídos, nova versão publicada com data registada, período de teste igual em dias úteis, só casos da nova versão, métrica principal = mediana do ciclo em dias úteis, guardas = volume, faixa de valor, departamento, taxa de cancelamento, critério de sucesso fixado pelo dono antes de publicar. A extracção é manual nos dois períodos: a entrega agendada de relatórios não existe na versão base.

## O que falta e quem decide

D1 entregar a exportação (Direcção de Compras); D3 regra do denominador; D4 versão do workflow entre períodos; D5 dono da mudança; D6 escolha da mudança após confirmar a hipótese nos casos do P90.

Nota: o conector Provia precisa de autorização nas definições de conectores do claude.ai para o modo ligado ficar disponível numa próxima sessão.

---

Próximo passo recomendado: voltar a `provia-process-improvement` com a exportação real, porque o método está pronto mas nenhum número existe até os dados chegarem. Se preferir avançar directamente para a mudança no desenho, a alternativa é `provia-workflow-change` depois de D6 ficar resolvida.

```text
Use provia-process-improvement com a exportação de casos e acções de compras em anexo (dois períodos) e o manifesto provia-project.json desta pasta. Corra calcular-tempos.mjs com as colunas reais, confirme ou refute as hipóteses H1–H6 de analise-compras.md com casos concretos, e escolha a mudança e o dono (D5, D6). País: Angola; responda em pt-AO.
```