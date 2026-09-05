# Handoff: Taskly — Login e Cadastro

## Visão geral
Tela única de autenticação do Taskly, com alternância entre dois modos:
**Entrar** (e-mail + senha) e **Criar conta** (e-mail + senha + repetir senha).
Layout de duas colunas: painel-pôster vermelho à esquerda (marca + statement + métricas),
formulário à direita.

## Sobre os arquivos deste pacote
Os arquivos aqui são **referências de design feitas em HTML** — protótipos que mostram
aparência e comportamento pretendidos, **não código de produção para copiar**.
A tarefa é **recriar esses designs no codebase existente**, usando seus padrões
estabelecidos.

**Stack alvo: Angular + Tailwind CSS + lucide (ícones).**
Implementar como componente(s) Angular standalone, estilização com classes Tailwind,
ícones via `lucide-angular`.

## Fidelidade
**Alta (hi-fi).** Cores, tipografia, espaçamentos e estados são finais e devem ser
reproduzidos com precisão. Os valores exatos estão em *Design tokens* abaixo.

---

## Telas / Views

### 1. Painel esquerdo (fixo nos dois modos)
- **Propósito:** identidade da marca e contexto do produto.
- **Layout:** coluna com `grid-template-columns: 1.05fr 1fr` na página (esquerda = 1.05fr).
  `display:flex; flex-direction:column; justify-content:space-between;`
  padding `56px 48px`. Fundo `#ec3013`, texto `#f3f2f2`.
  Borda direita: `2px solid #201e1d`.
- **Componentes:**
  - **Topo:** `TASKLY` — Archivo 800, 26px, `letter-spacing:-0.02em`. Ao lado (baseline
    alinhada, gap 12px): `Gestão de tarefas` — 11px, uppercase, `letter-spacing:.18em`,
    opacidade .8.
  - **Meio** (flex column, gap 28px, `max-width:460px`):
    - H1: `O trabalho do dia, em ordem.` — Archivo 800, 64px, `line-height:.94`,
      `letter-spacing:-0.035em`.
    - Régua: `height:2px; background:#f3f2f2; opacity:.5`.
    - Parágrafo (`max-width:380px`, 16px, `line-height:1.5`, opacidade .92):
      `Uma lista por projeto, um prazo por tarefa. Entre e continue de onde parou.`
  - **Base:** grid de 3 colunas iguais, `border-top:2px solid #f3f2f2`; cada célula
    (exceto a primeira) com `border-left:2px solid #f3f2f2`, padding-top 16px e 16px
    horizontais entre células. Números em Archivo 800 / 28px; rótulos 11px uppercase
    `letter-spacing:.14em`, opacidade .85.
    - `12k` / `Equipes` · `98%` / `No prazo` · `24/7` / `Sincronizado`

### 2. Coluna direita — formulário
- **Layout:** flex, alinhado ao centro vertical, **flush left** horizontalmente
  (`justify-content:flex-start`), padding `56px 64px`. Conteúdo em coluna,
  `max-width:420px`, gap 32px. Fundo `#f3f2f2`.
- **Ordem dos elementos:**
  1. **Abas** — grid 2 colunas iguais dentro de `border:2px solid #201e1d`.
     Botões: Archivo 800, 13px, uppercase, `letter-spacing:.14em`, `text-align:left`,
     padding `14px 18px`, sem borda.
     - Ativa: fundo `#201e1d`, texto `#f3f2f2`.
     - Inativa: fundo transparente, texto `#201e1d`.
     - Labels: `Entrar` · `Criar conta`.
  2. **Cabeçalho** (gap 10px):
     - Kicker 11px uppercase `letter-spacing:.18em`, cor `#605d5d`:
       login → `Bem-vindo de volta`; cadastro → `Nova conta`.
     - H2 Archivo 800, 38px, `line-height:1.02`, `letter-spacing:-0.03em`:
       login → `Entrar no Taskly`; cadastro → `Criar sua conta`.
  3. **Régua** `2px` cor divisor.
  4. **Formulário** (flex column, gap 20px) — ver campos abaixo.
  5. **Régua** `2px`.
  6. **Rodapé de troca** — 13px, cor `#605d5d`:
     - login: `Ainda não tem conta?` + link `Criar conta`
     - cadastro: `Já tem uma conta?` + link `Entrar`
     - Links: cor `#ae1800`, sem sublinhado, `border-bottom:2px solid #ec3013`.

#### Campos
Todos os labels: 11px, uppercase, `letter-spacing:.14em`, cor `#201e1d` a 70%,
`margin-bottom:5px`. Inputs: altura mínima **48px**, padding `12px 14px`, 15px,
borda `2px` na cor divisor, fundo `#f8f4f4`, **raio 0**.

| Campo | Modo | Tipo | Label | Placeholder |
|---|---|---|---|---|
| email | ambos | `email`, required | E-MAIL | `voce@empresa.com` |
| senha | ambos | `password`/`text`, required | SENHA | `••••••••` |
| senha2 | só cadastro | `password`/`text`, required | REPETIR SENHA | `••••••••` |

- **Campo senha:** wrapper flex com a borda 2px; o input é `border:0; background:transparent`;
  à direita um botão de texto (`Mostrar` / `Ocultar`) — 11px uppercase `letter-spacing:.14em`,
  cor `#ae1800`, `border-left:2px solid` divisor, padding horizontal 14px.
  O toggle controla **os dois** campos de senha ao mesmo tempo.
- **Cadastro:** abaixo de "repetir senha", texto auxiliar 12px cor `#605d5d`:
  `Mínimo de 8 caracteres.`
- **Login apenas:** linha entre campos e CTA, `justify-content:space-between`:
  - checkbox 16px (accent `#ec3013`) + label 13px `Manter conectado`
  - link 13px `Esqueci a senha` (mesmo estilo de link acima)
- **CTA:** botão largura total, altura mínima 52px, fundo `#ec3013`, texto `#f3f2f2`,
  14px uppercase `letter-spacing:.14em`, padding horizontal 18px,
  **texto alinhado à esquerda** (regra do sistema: labels flush left).
  - login → `Entrar` · cadastro → `Criar conta`
  - hover `#dd2b0f`; active `#ae1800`.

---

## Interações e comportamento
- **Alternância de modo:** clicar em uma aba ou no link do rodapé troca entre
  `login` e `signup`. Sem navegação de rota no protótipo; no Angular, pode ser
  rota (`/login`, `/cadastro`) ou estado interno — a escolha é do time.
- **Mostrar/ocultar senha:** alterna `type` entre `password` e `text` nos campos de senha.
- **Submit:** no protótipo é `preventDefault()`. Implementar com Reactive Forms.
- **Validação (a implementar):**
  - e-mail: obrigatório, formato válido
  - senha: obrigatória, mínimo 8 caracteres
  - repetir senha: obrigatória, deve ser igual à senha (validador de grupo)
  - Mensagens de erro: 12px, cor `#ae1800`, abaixo do campo; borda do campo em erro
    `2px solid #ec3013`.
- **Loading:** botão CTA `disabled` (opacidade .45, cursor not-allowed) com label
  `Entrando…` / `Criando conta…`.
- **Foco de teclado:** `outline: 2px solid #ec3013; outline-offset: 2px` — nunca o anel azul padrão.
- **Responsivo:** abaixo de ~900px, empilhar em uma coluna — o painel vermelho vira
  faixa superior (só marca + H1, sem métricas), formulário abaixo com padding 32px 24px.

## Estado
| Estado | Tipo | Origem |
|---|---|---|
| `mode` | `'login' \| 'signup'` | abas / link do rodapé |
| `showPassword` | `boolean` | botão Mostrar/Ocultar |
| `form` | FormGroup | email, password, (confirmPassword) |
| `submitting` | `boolean` | chamada de API |
| `error` | `string \| null` | resposta da API |

## Design tokens
Sistema **Modernist**. Registrar no `tailwind.config` como cores/fontes customizadas.

**Cores**
| Token | Hex | Uso |
|---|---|---|
| bg | `#f3f2f2` | fundo da página |
| surface | `#eae9e9` | superfícies |
| text | `#201e1d` | texto principal, aba ativa |
| accent | `#ec3013` | painel esquerdo, CTA, foco |
| accent-600 | `#dd2b0f` | hover do CTA |
| accent-700 | `#ae1800` | active, texto/links em vermelho |
| neutral-100 | `#f8f4f4` | fundo dos inputs |
| neutral-700 | `#605d5d` | texto secundário |
| divider | `#201e1d` a 40% | bordas 2px |

**Tipografia:** Archivo (400 / 600 / 800) para tudo — títulos peso 800.
Escala usada: 64 · 38 · 28 · 26 · 16 · 15 · 13 · 12 · 11px.

**Espaçamento:** 4 · 8 · 12 · 16 · 24 · 32px (múltiplos de 4).

**Raio de borda: 0px em todos os elementos.** Nunca arredondar.

**Sombras:** nenhuma nesta tela — a estrutura é feita por réguas de 2px.

## Ícones
`lucide-angular`. A tela atual não usa ícones; se quiserem substituir o texto
`Mostrar`/`Ocultar` por ícone, usar `eye` / `eye-off` a 18px, cor `#ae1800`.

## Assets
Nenhuma imagem. Fonte Archivo via Google Fonts.

## Arquivos
- `Taskly Auth.dc.html` — o protótipo (abre no navegador; o markup e os estilos inline
  são a referência visual).
- `reference/modernist-styles.css` — folha de tokens e componentes do design system.
- `screenshots/login.png` — modo Entrar.
- `screenshots/cadastro.png` — modo Criar conta.
  (As capturas mostram a área visível; o CTA fica logo abaixo do corte. O HTML é a
  referência completa.)

## Regras do design system a respeitar
- Nenhum canto arredondado.
- Réguas de 2px, nunca hairlines.
- Tudo alinhado à esquerda, inclusive labels de botões largos.
- Vermelho usado com parcimônia; o painel-pôster é a única área em vermelho pleno.
