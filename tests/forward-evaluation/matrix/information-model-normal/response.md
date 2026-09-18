## Como evitar repetir dados do fornecedor em cada pedido

Não repetir dados significa não criar dois lugares para a mesma informação. A decisão de desenho:

- **Fornecedor** é uma entidade Provia reutilizável (NIF, contactos, categoria de fornecimento, situação, condições comerciais, dados bancários, certidões).
- **Pedido de compra** não é uma segunda entidade — é o *caso* do workflow de compras. Os seus dados variáveis (artigos, montante, aprovação) ficam nos metadados do caso e na evidência das acções.
- A ligação entre os dois é um campo de caso do tipo `entity` (ex.: `fornecedor_selecionado`, alvo = Fornecedor) na acção onde o requerente escolhe a contraparte. Quem prepara o pedido **selecciona** o registo de Fornecedor em vez de reintroduzir NIF, contacto ou condições de pagamento a cada pedido.

Entreguei o catálogo do tipo **Fornecedor** com 18 campos agrupados (Identificação, Classificação, Contactos, Responsabilidade, Situação e ciclo de vida, Condições comerciais, Evidência e conformidade), cada um com propósito, prioridade (core/conditional/optional), exemplo válido, responsável e sensibilidade. A dimensão "Relações" está marcada como `external`: o pedido referencia o fornecedor, o fornecedor não guarda lista inversa de pedidos.

Sem SOP ou workflow fornecidos, este é um baseline assinalado como tal — vocabulário de categorias, exigência real de certidão fiscal e responsáveis devem ser confirmados com compras/financeira antes de configurar.

**Ficheiros gerados** (validados com `build-entity-catalogue.mjs --check`, sem erros):
- `catalogue.json` — fonte editorial
- `catalogue.html` — catálogo offline navegável, com controlos de cópia (não testados em browser real aqui, apenas gerados e verificados por grep)

**Próximo passo recomendado**: `provia-workflow-designer`, para desenhar o workflow de Pedido de compra e ligar a acção de selecção ao tipo Fornecedor através de `entityRefs`.

```text
Use provia-workflow-designer para desenhar o workflow "Pedido de compra". Use o catálogo de Fornecedor em catalogue.json: a acção onde o requerente escolhe a contraparte deve referenciar este tipo (campo de caso `entity`, alvo = fornecedor) em vez de repetir os dados do fornecedor. País: Angola; responda em pt-AO.
```