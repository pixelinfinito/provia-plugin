Plano preparado. Ficheiros no directório de trabalho:

- `provia-project.json` — manifesto novo (não existia): fonte `pedido-rollout`, 9 grupos com tipo, área, sinalizações e membros por papel (sem emails inventados), workflow `compras` provisório com 8 acções e `access`, 10 decisões abertas.
- `plano-de-adopcao.md` — autoridades separadas, desenho dos grupos, matriz de acesso, cobertura de responsabilidade, vagas com datas propostas (Compras: 12 Out–20 Nov 2026; RH: Dez 2026–Fev 2027; alargamento: Mar 2027), exercícios de formação por papel, suporte e medidas de adopção.
- `project.html` e `setup.md` — gerados com `build-project-map.mjs`.

**O que verifiquei.** `--check` sobre o manifesto: 0 erros, 5 avisos, 5 informações, 1 bloqueio de prontidão. Todas as 8 acções humanas têm responsável (2 `creator`, 2 Compras, 2 Finanças, 1 Chefias, 1 Direcção Geral). Os avisos são esperados: grupos de papel/administração sem acções, RH sem workflow até à vaga 2, e ninguém com email verificado (regra 8).

**Assunções que fiz, porque não recebi SOP, organigrama nem nomes:**
- O circuito de compras é o habitual (requerente → chefia → Compras → Finanças → Direcção Geral → Compras → recepção → pagamento). É um esqueleto a substituir pelo procedimento real (D10).
- «Alargar a RH» = RH passa a requerente de compras e depois ganha o seu próprio primeiro processo (D2).
- Piloto restringido pela lista de arranque do gatilho manual a Compras + departamentos-piloto (D7); estado final: toda a organização abre pedidos.
- Angola/pt-AO como contexto provisório.

**Modo desligado.** O servidor Provia está exposto, mas a chamada `org_get_context` foi recusada por falta de permissão nesta sessão — nada foi lido ou criado no tenant, nenhum email está verificado. Com autorização, o passo seguinte seria ler grupos/utilizadores existentes e oferecer `groups_apply_plan` após revisão.

**Decisões que bloqueiam o arranque:** D1 (dono do processo de Compras), D7 (departamentos-piloto com emails), D8 (administradores), D10 (SOP de compras).

Próximo passo recomendado: `provia-workflow-designer`, assim que o procedimento de compras for entregue — o esqueleto de oito acções precisa de ser substituído pelo processo real antes de formar alguém. Se não existir procedimento escrito, entreviste primeiro o dono do processo (D1) e use as notas como fonte.

```text
Use provia-workflow-designer com o manifesto provia-project.json deste directório e o procedimento de compras em anexo. Substitua o esqueleto provisório do workflow «compras» pelas acções do procedimento, mantendo as chaves de grupo já definidas (compras, chefias, financas, direccao_geral, dono_processo_compras, admin_workflows) e resolvendo as decisões D3, D4 e D10. País: Angola; responda em pt-AO.
```