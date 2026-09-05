# Registro de Prompts — Uso de IA no Desenvolvimento

Este documento registra os prompts relevantes utilizados durante o desenvolvimento do Taskly, a ferramenta usada e onde o output foi revisado/corrigido manualmente.

**Ferramenta principal:** Claude Code (VSCode)

---

## Formato de cada entrada

```
### [data] — [contexto/feature]
**Prompt:**
> (prompt utilizado)

**O que foi gerado:** breve resumo do output.

**Revisão/ajustes manuais:** o que precisou ser corrigido, ajustado ou rejeitado.
```

---

### 2026-09-02 — Leitura do desafio, escolha de stack e organização do projeto/spec

**Prompt:**
> Analisei o documento do desafio técnico Taskly (UEX Startup Studio) e tirei dúvidas com a IA sobre como organizar o projeto: backend definido em PHP 8.3 + Laravel 13, frontend em Angular + Tailwind (por afinidade própria), banco de dados PostgreSQL (por afinidade própria) com uso de Docker Compose para facilitar a avaliação por terceiros. Pedi ajuda para planejar a ordem de execução (repositório, padrão de commits, estrutura de pastas, Docker, instalação das libs) dado o prazo curto de entrega.

**O que foi gerado:** roteiro de organização do projeto (estrutura de monorepo, ordem de implementação das features, uso de Docker Compose com `artisan serve`), estrutura de pastas, `docker-compose.yml`, Dockerfiles de backend/frontend, `.gitignore`, workflow de CI, esqueletos de `README.md`/`SPEC.md`/`PROMPTS.md`.

**Revisão/ajustes manuais:** troca da proposta inicial de ORM (Prisma, incompatível com PHP) por Eloquent, nativo do Laravel; ajuste do `command` do serviço `backend` no `docker-compose.yml` para incluir `composer install` antes do `migrate`, já que `vendor/` fica fora do controle de versão.

### 2026-09-03 — Criação do repositório com GitHub CLI

**Prompt:**
> Crie um repositório privado no meu GitHub chamado `taskly_challenger`, estruturado como monorepo (backend e frontend no mesmo repositório). Use o GitHub CLI (gh repo create) a partir do diretório atual do projeto e faça o push inicial para a branch main.

**O que foi gerado:** inicialização do git no diretório do projeto com `git init -b main`, commit inicial (`chore: estrutura inicial do monorepo Taskly (backend + frontend)`) cobrindo `backend/`, `frontend/`, `docker-compose.yml`, `.github/workflows/ci.yml`, `.gitignore`, `README.md`, `SPEC.md`, `PROMPTS.md` e `.claude/settings.json`, e criação do repositório privado via `gh repo create taskly_challenger --private --source=. --remote=origin --push`, com push da branch `main` para `origin`. Repositório: https://github.com/ramonliranidev/taskly_challenger (privado, branch padrão `main`).

**Revisão/ajustes manuais:** _(a preencher)_

### 2026-09-03 — Documento de convenção de commit

**Prompt:**
> Crie um arquivo COMMIT_CONVENTION.md na raiz do projeto documentando o padrão de commits baseado no Conventional Commits (https://www.conventionalcommits.org/pt-br/v1.0.0-beta.4/). Inclua os tipos permitidos (feat, fix, docs, style, refactor, test, chore, ci), a estrutura da mensagem (tipo(escopo): descrição) e pelo menos 3 exemplos reais aplicados a este projeto.

**O que foi gerado:** `COMMIT_CONVENTION.md` na raiz, com: estrutura da mensagem (`tipo(escopo): descrição` + corpo/rodapé opcionais), regras de descrição no imperativo, seção sobre breaking changes (`!` e `BREAKING CHANGE:`), tabela dos 8 tipos permitidos (feat, fix, docs, style, refactor, test, chore, ci), boas práticas e 6 exemplos aplicados ao Taskly (feat de auth com Sanctum, fix do Kanban no frontend, chore de migrations no Docker, docs, ci de testes/lint e refactor de Policy).

**Revisão/ajustes manuais:** _(a preencher)_

### 2026-09-03 — Backend: endpoints de autenticação (Sanctum)

**Prompt:**
> Implemente a autenticação própria do Taskly no backend Laravel usando Sanctum: endpoints de registro (name, email, password), login (retornando token) e logout. Use as tabelas definidas em SPEC.md para users. Valide e-mail único e senha mínima, com respostas de erro em JSON claras para o frontend consumir.

**O que foi gerado:** `laravel/sanctum` adicionado ao `composer.json`; rota de API habilitada em `bootstrap/app.php` e novo `routes/api.php` com `POST /api/register`, `POST /api/login` (ambas com `throttle:10,1`), `POST /api/logout` e `GET /api/me` (protegidas por `auth:sanctum`); `config/sanctum.php` e `config/cors.php` publicados; migration `personal_access_tokens`; trait `HasApiTokens` no model `User`; `AuthController` + Form Requests `RegisterRequest`/`LoginRequest` com mensagens de validação em pt-BR (e-mail único, senha mínima de 8 caracteres, credenciais inválidas retornando 422 JSON no formato `{ message, errors }`); suíte de testes `tests/Feature/Auth/AuthTest.php` cobrindo registro, login, logout, `me` e casos de validação.

**Revisão/ajustes manuais:** _(a preencher)_ — como o ambiente não tinha PHP/Composer, o `composer.lock` não foi atualizado automaticamente; é necessário rodar `composer require laravel/sanctum` (ou `docker compose run --rm backend composer update laravel/sanctum`) uma vez para sincronizar o lockfile e instalar o pacote.

### 2026-09-03 — Frontend: telas de Login e Cadastro (handoff de design)

**Prompt:**
> Implemente as telas de Login e Cadastro do Taskly em Angular + Tailwind, seguindo o handoff de design em `frontend/design-reference/design_handoff_taskly_auth/` (referência visual em `screenshots/login.png` e `screenshots/cadastro.png`, tokens de estilo em `reference/modernist-styles.css`). Crie os componentes standalone `LoginComponent` e `RegisterComponent` com Reactive Forms e validação de e-mail/senha, integrando com os endpoints `/api/login` e `/api/register` do backend. Após login bem-sucedido, redirecionar para a tela de projetos e persistir a sessão via `environment.apiUrl`.

**O que foi gerado:** Tailwind CSS v4 configurado (`package.json`, `.postcssrc.json`, tokens do design system Modernist em `src/styles.css` via `@theme` + classes de formulário reaproveitáveis). `src/environments/environment{,.development}.ts` com `apiUrl` e `fileReplacements` no `angular.json`. Camada `core/auth`: `AuthService` (register/login/logout, sessão em `localStorage` com signals `token`/`user`/`isAuthenticated`), `authInterceptor` (Bearer token + logout automático no 401), `authGuard`/`guestGuard`, `auth-error.ts` (mensagem única a partir do 422 do Laravel). Feature `features/auth`: `BrandPanelComponent` (painel-pôster vermelho, responsivo <900px), `AuthShellComponent` (layout 2 colunas + abas + cabeçalho, conteúdo via `ng-content`), `LoginComponent` e `RegisterComponent` standalone com Reactive Forms — e-mail obrigatório/válido, senha mín. 8, confirmação de senha no cadastro (validador de grupo), toggle Mostrar/Ocultar, estados `submitting`/`error`. `ProjectsComponent` placeholder protegido como alvo do redirecionamento pós-login. Rotas `/login`, `/cadastro`, `/projetos` (lazy) + `provideHttpClient(withInterceptors([...]))`. Testes: `auth.service.spec.ts` (persistência/limpeza de sessão) e `app.spec.ts` ajustado.

**Revisão/ajustes manuais:** _(a preencher)_ — pontos de atenção: (1) o `node_modules` do frontend não pôde ser instalado no ambiente, então Tailwind entra no build só quando o container roda `npm install` (ou `npm install` local); (2) a tela de Cadastro do handoff não coleta "nome", que é obrigatório no backend — o `RegisterComponent` deriva um nome a partir do e-mail (`deriveNameFromEmail`); revisar se deve virar um campo no formulário.

---

_(continuar adicionando uma entrada por prompt relevante ao longo do desenvolvimento)_
