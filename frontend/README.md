# Taskly — Frontend (Angular)

SPA em Angular 21 + Tailwind CSS v4. Gerada com Angular CLI 21.2.23.

## Desenvolvimento local (recomendado para desenvolver)

Pré-requisitos: Node 20 (`nvm use` lê o `.nvmrc`) e o backend rodando em
`http://localhost:8000` (veja abaixo).

```bash
cd frontend
npm install        # instala deps (Angular, Tailwind, PostCSS...)
npm start          # ng serve em http://localhost:4200
```

O `npm start` recompila e recarrega a cada alteração de arquivo.

> **Backend:** como o PHP roda em container, suba só o banco + a API:
> ```bash
> docker compose up -d db backend
> ```
> Na primeira vez, sincronize o Sanctum no lockfile:
> ```bash
> docker compose run --rm backend composer require laravel/sanctum:^4.2
> ```

### `node_modules` pertencente ao root?

Se `npm install` falhar com `EACCES ... mkdir '.../frontend/node_modules'`, é
porque uma execução anterior do Docker criou a pasta como root. Corrija uma vez:

```bash
sudo rm -rf frontend/node_modules
```

O `Dockerfile` agora roda como usuário `node` (uid 1000), então isso não deve
voltar a acontecer.

## Configuração de ambiente

`src/environments/environment.ts` (build de produção) e
`src/environments/environment.development.ts` (usado no `npm start`, via
`fileReplacements` no `angular.json`). Ambos expõem `apiUrl`.

## Tailwind CSS

Tailwind v4 via `@tailwindcss/postcss` (config em `.postcssrc.json`). Os tokens
do design system "Modernist" ficam em `src/styles.css`, no bloco `@theme`
(`bg-bg`, `text-ink`, `bg-accent`, `border-ink/40`, ...).

## Testes

```bash
npm test           # Vitest (builder @angular/build:unit-test)
```

## Build

```bash
npm run build      # artefatos em dist/
```
