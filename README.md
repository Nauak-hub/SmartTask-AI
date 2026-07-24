# SmartTask AI

Projeto acadêmico da disciplina de **Programação Orientada a Objetos**. O sistema é uma API REST para gerenciamento de tarefas e demonstra como uma IA pode apoiar o planejamento, desenvolvimento, revisão, testes e documentação de software.

## Funcionalidades

- Criar, listar, consultar, atualizar e excluir tarefas.
- Alterar o status de uma tarefa.
- Filtrar tarefas por status ou categoria.
- Interpretar uma descrição em linguagem natural e sugerir título, prioridade, prazo, categoria e subtarefas.
- Validar dados e retornar erros padronizados.
- Documentar a API automaticamente com OpenAPI/Swagger.

## Tecnologias

- Java 21
- Spring Boot 4.1.0
- Spring Web
- Spring Data JPA
- Bean Validation
- H2 Database
- springdoc-openapi
- JUnit 5 e Mockito
- Maven

## Conceitos de POO aplicados

- **Encapsulamento:** o estado de `Task` só é modificado por métodos controlados.
- **Abstração:** `AiService` e `PriorityStrategy` definem contratos.
- **Polimorfismo:** novas implementações de IA ou prioridade podem substituir as atuais.
- **Composição:** tarefas possuem listas de subtarefas.
- **Injeção de dependência:** serviços recebem suas dependências por construtor.

## Padrões e boas práticas

- Strategy: cálculo da prioridade.
- Service Layer: regras de negócio separadas dos controllers.
- Repository: abstração da persistência.
- DTO: separação entre API e entidade.
- Mapper: conversão de entidade para resposta.
- Dependency Inversion: serviços dependem de interfaces.
- Tratamento global de exceções.

## Como executar

### Requisitos

- JDK 21
- Maven 3.9 ou superior

```bash
mvn clean test
mvn spring-boot:run
```

Aplicação: `http://localhost:8080`

Swagger UI: `http://localhost:8080/swagger-ui.html`

H2 Console: `http://localhost:8080/h2-console`

Configuração do H2:

- JDBC URL: `jdbc:h2:mem:smarttask`
- Usuário: `sa`
- Senha: vazia

## Exemplos de uso

### Criar tarefa

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Finalizar trabalho de POO",
  "description": "Revisar código e preparar apresentação",
  "priority": "HIGH",
  "dueDate": "2026-07-31",
  "category": "Estudos",
  "subtasks": ["Executar testes", "Atualizar README"]
}
```

### Gerar sugestão com IA simulada

```http
POST /api/ai/suggest-task
Content-Type: application/json

{
  "text": "Preciso entregar o trabalho de POO amanhã, é urgente e quero dividir em etapas"
}
```

A implementação padrão é local e determinística, portanto não exige chave de API. Ela foi criada atrás da interface `AiService`, permitindo integrar Gemini, OpenAI ou Ollama posteriormente sem alterar os controllers.

## Estrutura

```text
src/main/java/br/com/smarttask
├── config
├── controller
├── dto
├── exception
├── mapper
├── model
├── repository
├── service
│   └── ai
└── strategy
```

## Testes

- Testes unitários da estratégia de prioridade.
- Testes unitários do serviço com Mockito.
- Testes de integração dos endpoints com MockMvc.

```bash
mvn test
```

## Documentação acadêmica

Consulte:

- `docs/PROCESSO_DESENVOLVIMENTO.md`
- `docs/REQUISITOS.md`
- `docs/DIAGRAMA_CLASSES.md`
- `docs/ROTEIRO_APRESENTACAO.md`

## Autoria e uso de IA

O projeto foi construído com apoio de IA generativa. As sugestões foram revisadas antes de serem incorporadas. A IA não substitui a responsabilidade do desenvolvedor pela validação, pelos testes e pelas decisões arquiteturais.

## Interface web

A aplicação possui uma interface responsiva disponível diretamente em:

```text
http://localhost:8080/
```

Recursos da interface:

- painel com indicadores de tarefas;
- visualização em cartões ou lista;
- pesquisa por título, descrição ou categoria;
- filtros por status e prioridade;
- criação e edição em janela modal;
- alteração rápida de status;
- duplicação e exclusão com confirmação;
- assistente inteligente para preencher tarefas em linguagem natural;
- tema claro e escuro;
- layout responsivo para computador, tablet e celular.

Os arquivos visuais estão em:

```text
src/main/resources/static/
├── index.html
├── css/styles.css
└── js/app.js
```

Como o front-end consome a própria API REST, não é necessário instalar Node.js, npm ou qualquer framework JavaScript.

Kauan Gutierrez Santos Estácio - 
Instituto Federal de Sergipe
