# Interface do Usuário — SmartTask AI

## Objetivo

A interface foi criada para tornar o uso da API acessível a usuários sem conhecimento técnico. Ela foi implementada com HTML, CSS e JavaScript puro e é servida pelo próprio Spring Boot.

## Decisões de usabilidade

1. **Dashboard inicial:** apresenta os totais de tarefas pendentes, em andamento e concluídas.
2. **Ações visíveis:** o botão de nova tarefa permanece no cabeçalho.
3. **Feedback imediato:** operações exibem notificações de sucesso ou erro.
4. **Prevenção de erros:** a exclusão exige confirmação e o título é validado antes do envio.
5. **Filtros rápidos:** pesquisa, status e prioridade podem ser combinados.
6. **Responsividade:** a barra lateral torna-se um menu recolhível em telas menores.
7. **Acessibilidade básica:** os campos possuem rótulos, botões têm descrições e os modais podem ser fechados com Escape.

## Fluxo do assistente de IA

1. O usuário descreve uma necessidade em linguagem natural.
2. O front-end envia o texto para `POST /api/ai/suggest-task`.
3. O serviço de IA interpreta o texto.
4. O formulário é preenchido com a sugestão.
5. O usuário revisa os dados antes de salvar.

Essa etapa de revisão mantém a decisão final sob controle do usuário.

## Arquitetura da interface

```text
index.html
    ↓ eventos
app.js
    ↓ HTTP/JSON
Controllers REST
    ↓
Services → Repository → H2
```

## Teste manual recomendado

- Criar uma tarefa sem IA.
- Criar uma tarefa usando o assistente.
- Editar título e prioridade.
- Alterar o status pelo cartão.
- Pesquisar e aplicar filtros.
- Alternar entre cartões e lista.
- Alternar tema claro/escuro.
- Excluir uma tarefa e confirmar a remoção.
