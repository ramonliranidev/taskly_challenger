# Spec Técnica — Taskly

## 1. Escopo

- [x] Autenticação própria (cadastro, login, sessão persistente)
- [x] CRUD de Projetos
- [x] CRUD de Tarefas (título, descrição curta, descrição completa, prazo, tags, anexos/fotos)
- [x] Alternância de visualização Lista / Kanban
- [x] Status de tarefa: Não iniciada, Em andamento, Concluída, Cancelada
- [x] Kanban: arrastar cards entre colunas troca a situação da tarefa (drag-and-drop)

## 2. Modelagem de dados

### users

| campo    | tipo        | observação |
| -------- | ----------- | ---------- |
| id       | uuid/bigint |            |
| name     | string      |            |
| email    | string      | único      |
| password | string      | hash       |

### projects

| campo   | tipo        | observação      |
| ------- | ----------- | --------------- |
| id      | bigint      |                 |
| user_id | FK -> users | dono do projeto |
| name    | string      |                 |

### tasks

| campo             | tipo           | observação                                |
| ----------------- | -------------- | ----------------------------------------- |
| id                | bigint         |                                           |
| project_id        | FK -> projects |                                           |
| title             | string         |                                           |
| short_description | string         |                                           |
| full_description  | text           |                                           |
| due_date          | timestamp      | data e hora                               |
| status            | enum           | not_started, in_progress, done, cancelled |

### tags

| campo   | tipo        | observação                                                          |
| ------- | ----------- | ------------------------------------------------------------------- |
| id      | bigint      |                                                                     |
| user_id | FK -> users | dono da tag (reaproveitada entre projetos/tarefas do mesmo usuário) |
| name    | string      | único por usuário                                                   |

### task_tag (N:N)

| campo   | tipo        | observação                         |
| ------- | ----------- | ---------------------------------- |
| task_id | FK -> tasks | chave primária composta com tag_id |
| tag_id  | FK -> tags  |                                    |

### attachments (1:N com tasks)

| campo         | tipo        | observação                                                      |
| ------------- | ----------- | --------------------------------------------------------------- |
| id            | bigint      |                                                                 |
| task_id       | FK -> tasks |                                                                 |
| disk          | string      | disco do Laravel (`public`)                                     |
| path          | string      | caminho no disco                                                |
| original_name | string      | nome original do arquivo                                        |
| mime_type     | string      |                                                                 |
| size          | bigint      | bytes (formatação para exibição é responsabilidade do frontend) |

## 3. Decisões de arquitetura

- **Angular:** a especificação técnica do desafio não definiu framework nem linguagem para o frontend, deixando essa escolha em aberto. Optei por Angular por ser o framework com que tenho mais afinidade e domínio, garantindo maior produtividade e qualidade de entrega dentro do prazo. Pela mesma razão (ausência de exigência na spec e decisão minha), o Tailwind CSS foi adotado para a estilização.
- **Claude Design (design + aceleração de desenvolvimento):** o design de todas as telas foi definido com a ferramenta Claude Design. O fluxo foi: descrever as features para o Claude, que auxiliou na concepção do design, e a partir disso gerar um arquivo de referência de design. Esse arquivo serviu tanto para fixar o padrão visual das telas quanto como base para o próprio desenvolvimento — o código das telas partiu dele, o que acelerou bastante o processo e deixou para mim apenas os ajustes finos de visual e de usabilidade.
- **PostgreSQL:** escolhido por ser o banco de dados com que tenho mais familiaridade e experiência prática, o que reduz risco de erros de modelagem/configuração dentro do prazo do desafio.
- **ORM:** Eloquent — ORM nativo do Laravel, com integração direta ao driver PostgreSQL, migrations, factories e relacionamentos bem estabelecidos no framework.
- **Docker Compose:** escolhido para orquestrar banco de dados, backend e frontend com um único comando, facilitando a avaliação do projeto por terceiros sem necessidade de configurar ambiente local manualmente. Ambiente de desenvolvimento: VSCode rodando via WSL, com Docker Desktop e WSL Integration habilitada.
- **Autenticação:** Laravel Sanctum com tokens Bearer (`personal_access_tokens`) para consumo pela SPA Angular. Endpoints: `POST /api/register`, `POST /api/login`, `POST /api/logout`, `GET /api/me`. No frontend, o token e o usuário são persistidos em `localStorage` (sessão sobrevive a refresh) e injetados via HTTP interceptor.
- **Comunicação Front/Back:** API REST em JSON. Base do frontend em `environment.apiUrl` (`http://localhost:8000/api`).
- **Estilização do frontend:** Tailwind CSS v4 (via `@tailwindcss/postcss`), com os tokens do design system "Modernist" registrados em `@theme` (`src/styles.css`).
- **CRUD de Projetos/Tarefas:** endpoints REST (`/api/projects`, `/api/projects/{id}/tasks`, `/api/tasks/{id}`, `/api/tasks/{id}/attachments`, `/api/attachments/{id}`, `/api/tags`), sempre escopados ao usuário autenticado via `ProjectPolicy`/`TaskPolicy`/`AttachmentPolicy`. `status` é um PHP enum backed (`App\Enums\TaskStatus`); a tradução para pt-BR (`Não iniciada`/`Em andamento`/...) é só do frontend.
- **Tags:** globais por usuário (não por projeto), find-or-create por nome ao salvar uma tarefa — evita duplicar a mesma tag em cada tarefa.
- **Anexos:** upload real via disco `public` do Laravel (`php artisan storage:link` no start do container); validação de mime (`png,jpg,jpeg,gif,pdf,doc,docx`) e tamanho (máx. 10MB). Ao excluir uma tarefa/projeto, os arquivos correspondentes também são apagados do disco (a cascata do banco `cascadeOnDelete()` só apaga as linhas, não os arquivos).
- **Auto-save do painel de edição:** cada campo salva sozinho, sem botão "Salvar" bloqueante — texto/prazo usam debounce (~500ms, acumulando patches por tarefa) para não gerar 1 request por tecla; situação/tags/anexos salvam imediatamente.
- **Diálogos:** `<dialog>` HTML nativo (sem Angular Material) para criar/renomear projeto, nova tag e confirmação de exclusão de tarefa e de projeto.
- **Drag-and-drop do Kanban:** `@angular/cdk/drag-drop` (única peça do CDK usada no projeto). Cada coluna é um `cdkDropList` conectado via `cdkDropListGroup`, cada card um `cdkDrag`. Soltar um card em outra coluna chama `TasksService.updateStatus`, que reaproveita o mesmo `PATCH /api/tasks/{id}` do auto-save. UI otimista: a situação é gravada no signal local na hora (o card já "pula" de coluna porque `byStatus()` deriva de `tasks`) e, se o PATCH falhar, a situação anterior é restaurada. Reordenação dentro da mesma coluna não é persistida (o backend não guarda ordem), então o `cdkDropList` roda com `cdkDropListSortingDisabled`.
