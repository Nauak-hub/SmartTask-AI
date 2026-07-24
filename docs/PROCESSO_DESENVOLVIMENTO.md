# Processo de desenvolvimento com apoio de IA

## 1. Objetivo

Registrar como a IA foi utilizada como ferramenta de apoio, mantendo o desenvolvedor responsável pelas decisões e validações.

## 2. Etapas

### Levantamento de requisitos

**Prompt utilizado:** “Proponha requisitos funcionais e não funcionais para um gerenciador inteligente de tarefas adequado a uma avaliação de POO.”

**Uso da resposta:** a lista foi revisada, reduzida ao escopo acadêmico e registrada em `REQUISITOS.md`.

### Modelagem orientada a objetos

A IA sugeriu entidades, serviços e interfaces. Foram mantidas as abstrações `AiService` e `PriorityStrategy`, pois elas favorecem baixo acoplamento e polimorfismo.

### Arquitetura

Foi escolhida arquitetura em camadas: Controller, Service, Repository, Model, DTO e Mapper. A decisão evita colocar regras de negócio nos endpoints.

### Implementação

A IA ajudou a gerar uma primeira versão. O código foi revisado para:

- usar injeção por construtor;
- evitar setters públicos indiscriminados;
- proteger a lista de subtarefas;
- centralizar tratamento de exceções;
- separar entidade e DTO.

### Testes

A IA sugeriu cenários felizes, validações e falhas. Foram criados testes unitários e de integração. Cada teste deve ser executado localmente com `mvn test`.

### Revisão

Checklist aplicado:

- classes possuem responsabilidade definida;
- interfaces só existem onde há possibilidade real de variação;
- controllers não acessam repositórios diretamente;
- mensagens de erro são padronizadas;
- nenhuma chave de API está versionada;
- a aplicação funciona sem internet.

## 3. Limitações da IA

- pode gerar dependências incompatíveis;
- pode criar testes que apenas confirmam a própria implementação;
- pode sugerir padrões de projeto desnecessários;
- não executa automaticamente todas as validações no ambiente do aluno;
- respostas precisam ser confrontadas com documentação oficial.

## 4. Conclusão

A IA atuou como assistente de planejamento, implementação, testes e documentação. As decisões finais, a revisão e a comprovação do funcionamento permaneceram sob responsabilidade do desenvolvedor.
