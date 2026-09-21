Não consegui fazer a triagem: **a exportação não chegou**. A mensagem refere «esta exportação», mas a pasta de trabalho está vazia e não há conteúdo colado. Não vou inventar uma lista de pedidos atrasados.

## O que verifiquei

- **Pasta de trabalho** (`operations-triage-normal/`): sem CSV, XLSX, JSON ou relatório.
- **Manifesto `provia-project.json`**: inexistente — sem chaves de grupos para nomear responsáveis.
- **Conector Provia do anfitrião**: só expõe configuração (tipos de entidade, grupos, workflows, formulários); não lista casos nem acções em curso, e o plugin não monitoriza o Provia em directo. Não substitui a exportação.

## Ficheiros criados

- `triagem-2026-09-21.md` — relatório com data de observação (2026-09-21, Africa/Luanda), o que foi verificado, lista de atenção **vazia por falta de evidência** (não por estar tudo em ordem), os critérios que serão aplicados (atrasado / bloqueado / sem responsável / parado / em conflito / à espera) e duas decisões em aberto (D1: qual exportação; D2: existe manifesto com grupos?).
- `modelo-exportacao-triagem.csv` — colunas mínimas que a exportação deve trazer: referência do caso, workflow, estado do caso, acção actual (nome, tipo, estado), responsável, data de activação, data-limite, última actualização, predecessora pendente, hora e fuso da exportação.

Assumi Angola / pt-AO a partir do pedido. Não criei manifesto porque a tarefa não produziu artefacto de desenho reutilizável.

## Próximo passo

Anexe a exportação (com a hora exacta em que foi tirada) e, se existir, o `provia-project.json`. Próximo passo recomendado: repetir `provia-operations-triage` com esses ficheiros — é o único bloqueio.

```text
Use provia-operations-triage com a exportação anexa (casos e acções do workflow X, exportada em 2026-09-21 às HH:MM, Africa/Luanda) e o provia-project.json, se existir. Aplique os critérios do ficheiro triagem-2026-09-21.md e indique, por registo, o motivo, o responsável (chave do grupo) e o próximo passo. País: Angola; responda em pt-AO.
```