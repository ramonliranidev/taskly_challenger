# Convenção de Commits — Taskly

Este projeto adota o padrão **[Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0-beta.4/)**
para manter o histórico legível, facilitar a geração de changelog e deixar clara a
intenção de cada mudança.

---

## Estrutura da mensagem

```
tipo(escopo): descrição

[corpo opcional]

[rodapé(s) opcional(is)]
```

- **tipo** — obrigatório. Um dos tipos permitidos listados abaixo.
- **escopo** — opcional. Área do projeto afetada, entre parênteses (ex.: `backend`,
  `frontend`, `auth`, `tasks`, `projects`, `docker`, `ci`, `db`).
- **descrição** — obrigatória. Resumo curto, em português, no **imperativo** e em
  **minúsculas**, sem ponto final (ex.: "adiciona", não "adicionado" nem "Adiciona.").
- **corpo** — opcional. Explica o *porquê* da mudança e detalhes relevantes. Separado
  da descrição por uma linha em branco.
- **rodapé** — opcional. Usado para referências de issues (`Refs #12`, `Closes #7`) e
  para `BREAKING CHANGE:` quando houver quebra de compatibilidade.

### Breaking changes

Mudanças incompatíveis devem ser sinalizadas de uma das formas:

- com `!` antes dos dois-pontos: `feat(api)!: altera formato de resposta do login`
- ou com um rodapé `BREAKING CHANGE: <descrição do impacto>`

---

## Tipos permitidos

| Tipo       | Quando usar |
|------------|-------------|
| `feat`     | Nova funcionalidade para o usuário final. |
| `fix`      | Correção de bug. |
| `docs`     | Apenas documentação (README, SPEC, este arquivo, comentários de doc). |
| `style`    | Formatação e estilo de código sem alterar comportamento (espaços, ponto e vírgula, lint, Prettier/Pint). |
| `refactor` | Mudança de código que não corrige bug nem adiciona feature (reorganização, renomeação, extração de método). |
| `test`     | Adição ou ajuste de testes, sem mudar código de produção. |
| `chore`    | Tarefas de manutenção que não entram nas categorias acima (dependências, configs, scripts, `.gitignore`). |
| `ci`       | Mudanças em pipelines e automação de CI/CD (GitHub Actions, workflows). |

---

## Boas práticas

- Um commit por mudança lógica; evite commits "guarda-tudo".
- A descrição deve completar a frase: _"Se aplicado, este commit vai **..."**._
- Prefira escopos consistentes com a estrutura do monorepo (`backend/`, `frontend/`).
- Use o corpo para justificar decisões não óbvias.

---

## Exemplos aplicados a este projeto

### 1. Nova feature no backend

```
feat(auth): implementa cadastro e login com Laravel Sanctum

Adiciona endpoints POST /register e POST /login retornando token de acesso
para consumo pela SPA Angular. Sessão persistente via cookie de sessão.

Refs #3
```

### 2. Correção de bug no frontend

```
fix(tasks): corrige quadro Kanban que perdia a tarefa ao arrastar entre colunas

O status não era persistido na API após o drag-and-drop; agora dispara PATCH
/tasks/{id} com o novo status e faz rollback visual em caso de erro.
```

### 3. Ajuste de infraestrutura / configuração

```
chore(docker): roda migrations automaticamente no start do container do backend

Adiciona `php artisan migrate --force` ao entrypoint para que o avaliador
suba o projeto apenas com `docker compose up --build`.
```

### 4. Documentação

```
docs: adiciona COMMIT_CONVENTION.md com o padrão de commits do projeto
```

### 5. Pipeline de CI

```
ci: adiciona job de testes do backend (PHPUnit) e lint do frontend no push para main
```

### 6. Refatoração sem mudança de comportamento

```
refactor(projects): extrai regras de autorização para ProjectPolicy

Move as verificações de dono do projeto dos controllers para uma Policy
dedicada, sem alterar as respostas da API.
```
