# Spec Técnica — Taskly

## 1. Escopo

- [x] Autenticação própria (cadastro, login, sessão persistente)
- [ ] CRUD de Projetos
- [ ] CRUD de Tarefas (título, descrição curta, descrição completa, prazo, tags, anexos/fotos)
- [ ] Alternância de visualização Lista / Kanban
- [ ] Status de tarefa: Não iniciada, Em andamento, Concluída, Cancelada

## 2. Modelagem de dados

### users
| campo | tipo | observação |
|---|---|---|
| id | uuid/bigint | |
| name | string | |
| email | string | único |
| password | string | hash |

### projects
| campo | tipo | observação |
|---|---|---|
| id | bigint | |
| user_id | FK -> users | dono do projeto |
| name | string | |

### tasks
| campo | tipo | observação |
|---|---|---|
| id | bigint | |
| project_id | FK -> projects | |
| title | string | |
| short_description | string | |
| full_description | text | |
| due_date | timestamp | data e hora |
| status | enum | not_started, in_progress, done, cancelled |

### tags / task_tag (N:N)
### attachments (1:N com tasks)

> Preencher/ajustar conforme a implementação avançar.

## 3. Decisões de arquitetura

- **Angular:** escolhido para o frontend por ser o framework com que tenho mais afinidade e domínio, garantindo maior produtividade e qualidade de entrega dentro do prazo do desafio.
- **PostgreSQL:** escolhido por ser o banco de dados com que tenho mais familiaridade e experiência prática, o que reduz risco de erros de modelagem/configuração dentro do prazo do desafio.
- **ORM:** Eloquent — ORM nativo do Laravel, com integração direta ao driver PostgreSQL, migrations, factories e relacionamentos bem estabelecidos no framework.
- **Docker Compose:** escolhido para orquestrar banco de dados, backend e frontend com um único comando, facilitando a avaliação do projeto por terceiros sem necessidade de configurar ambiente local manualmente. Ambiente de desenvolvimento: VSCode rodando via WSL, com Docker Desktop e WSL Integration habilitada.
- **Autenticação:** Laravel Sanctum com tokens Bearer (`personal_access_tokens`) para consumo pela SPA Angular. Endpoints: `POST /api/register`, `POST /api/login`, `POST /api/logout`, `GET /api/me`. No frontend, o token e o usuário são persistidos em `localStorage` (sessão sobrevive a refresh) e injetados via HTTP interceptor.
- **Comunicação Front/Back:** API REST em JSON. Base do frontend em `environment.apiUrl` (`http://localhost:8000/api`).
- **Estilização do frontend:** Tailwind CSS v4 (via `@tailwindcss/postcss`), com os tokens do design system "Modernist" registrados em `@theme` (`src/styles.css`).
- _(adicionar demais decisões conforme forem tomadas: upload de anexos, kanban drag-and-drop, etc.)_

## 4. O que foi além do escopo mínimo

_(preencher ao final com o que foi adicionado além do pedido)_
