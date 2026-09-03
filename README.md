# Taskly

Sistema web de gestão de tarefas pessoais — desafio técnico para a vaga de Desenvolvedor Fullstack (UEX Startup Studio).

## Stack

- **Backend:** PHP 8.3 + Laravel 13 + Eloquent (ORM nativo)
- **Frontend:** Angular + Tailwind CSS
- **Banco de dados:** PostgreSQL 16
- **Autenticação:** Laravel Sanctum (e-mail/senha própria)
- **Infra local:** Docker Compose

## Como rodar o projeto

Pré-requisitos: Docker e Docker Compose instalados.

```bash
# 1. Clonar o repositório
git clone <url-do-repo>
cd taskly

# 2. Subir os containers
docker compose up --build
```

- Backend (API): http://localhost:8000
- Frontend (app): http://localhost:4200
- Banco de dados: localhost:5432

> Na primeira execução, o container do backend roda as migrations automaticamente.

## Estrutura do repositório

```
taskly/
├── backend/        # API Laravel
├── frontend/       # SPA Angular
├── docker-compose.yml
├── SPEC.md         # Especificação técnica e decisões de arquitetura
├── PROMPTS.md      # Registro dos prompts usados com IA no desenvolvimento
└── README.md
```

## Documentação

- [SPEC.md](./SPEC.md) — decisões técnicas, modelagem de dados e arquitetura
- [PROMPTS.md](./PROMPTS.md) — prompts utilizados durante o desenvolvimento com IA

## Deploy

_(preencher com o link, se houver deploy)_

## Vídeo de apresentação

_(preencher com o link do vídeo)_
