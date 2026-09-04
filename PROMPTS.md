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

---

_(continuar adicionando uma entrada por prompt relevante ao longo do desenvolvimento)_
