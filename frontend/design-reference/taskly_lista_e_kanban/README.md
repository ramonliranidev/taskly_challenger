# Handoff: Taskly — Tela do aplicativo (Lista e Kanban)

## Visão geral
Tela principal do Taskly depois do login. Três regiões fixas:
**cabeçalho** (marca, projeto atual, toggle Lista/Kanban, ação primária),
**sidebar** de projetos (240px) e **área de conteúdo** que alterna entre lista e kanban.
Clicar em qualquer tarefa abre um **painel de edição sobreposto** à direita.

Stack alvo: **Angular + Tailwind CSS + lucide-angular**.
Os arquivos deste pacote são referência de design em HTML — reproduzir no codebase
existente com os padrões do time, não copiar o markup.

Fidelidade: **alta**. Cores, tipografia, espaçamentos e estados são finais.

---

## 1. Cabeçalho

Barra horizontal, `border-bottom: 2px solid` texto, fundo `#f3f2f2`, altura definida
pelo conteúdo (~52px).

**Esquerda** (padding `0 24px`, gap 18px, itens centralizados verticalmente):
- `TASKLY` — Archivo 800, 20px, `letter-spacing:-0.02em`
- divisor vertical `2px × 20px` na cor divisor
- nome do projeto ativo — 11px, uppercase, `letter-spacing:.14em`, cor `#605d5d`

**Direita** (blocos coladas, cada um com `border-left: 2px solid` texto):
- Toggle **Lista** / **Kanban** — dois botões, Archivo 800, 12px, uppercase,
  `letter-spacing:.14em`, padding `0 22px`, sem borda entre si.
  Ativo: fundo `#201e1d`, texto `#f3f2f2`. Inativo: transparente, texto `#201e1d`.
- Botão **NOVA TAREFA** — fundo `#ec3013`, texto `#f3f2f2`, mesmas métricas de tipo,
  padding `0 22px`, raio 0.

## 2. Sidebar de projetos

Largura fixa **240px**, `border-right: 2px solid` texto, coluna flex de altura total.

- **Cabeçalho:** `PROJETOS` (11px uppercase `letter-spacing:.18em`, cor `#605d5d`) à
  esquerda e a contagem total de projetos (Archivo 800, 11px) à direita.
  Padding `20px 24px 12px`.
- **Item de projeto:** linha flex; o botão principal ocupa o espaço restante
  (padding `12px 8px 12px 24px`, Archivo 600, 14px, alinhado à esquerda) e mostra o nome
  à esquerda e a contagem de tarefas à direita (11px).
  - Ativo: fundo `#eae9e9` na linha inteira, `border-left: 6px solid #ec3013`,
    contagem em `#ae1800`.
  - Inativo: fundo transparente, `border-left: 6px solid transparent` (evita salto de
    layout), contagem em `#605d5d`.
  - Botão **EDITAR** à direita de cada linha (11px uppercase, cor `#605d5d`,
    hover `#ae1800`) — renomeia o projeto.
- **+ NOVO PROJETO:** botão com `border: 2px solid` divisor, margem `16px 24px`,
  padding `10px 12px`, Archivo 600, 11px uppercase, cor `#ae1800`,
  hover muda a borda para `#ec3013`.
- **Rodapé** (`margin-top:auto`, `border-top: 2px solid` divisor, padding `20px 24px`):
  rótulo `NESTE PROJETO` (11px uppercase, `#605d5d`), contador
  `concluídas / total` em Archivo 800 / 30px, e a legenda `tarefas concluídas` (12px).

## 3. Visão em LISTA

**Cabeçalho de colunas** — flex com wrap, padding `14px 32px`,
`border-bottom: 2px solid` divisor, 11px uppercase `letter-spacing:.16em`, cor `#605d5d`:
- `Tarefa` — `flex: 1 1 260px`
- grupo fixo (`flex: 0 0 auto`, gap 16px): `Tags` 170px · `Situação` 140px · `Prazo` 90px

**Linha de tarefa** — mesma estrutura flex (padding `18px 32px`, gap `12px 20px`,
`align-items: flex-start`, `border-bottom: 2px solid` divisor, cursor pointer):
- **Bloco de título** (`flex: 1 1 260px`, `min-width: 0`, coluna, gap 4px):
  - título — Archivo 600, 16px, `letter-spacing:-0.01em`
  - descrição curta — 14px (13px), cor `#605d5d`, `text-wrap: pretty`
  - contador de anexos — 11px uppercase `letter-spacing:.12em`, cor `#ae1800`,
    exibido só quando há anexos; texto `1 anexo` / `N anexos`
- **Grupo de metadados** (gap 16px, `flex: 0 0 auto`):
  - Tags: caixa de 170px, chips com wrap, gap 6px — 10px uppercase
    `letter-spacing:.12em`, padding `3px 7px`, `border: 2px solid` divisor, cor `#605d5d`
  - Situação: caixa de 140px com a etiqueta de status (ver tabela abaixo)
  - Prazo: caixa de 90px, coluna — data `DD/MM` em Archivo 600 / 13px e hora `HH:MM`
    em 11px cor `#605d5d`
- **Estados da linha:** hover fundo `#f8f4f4`; linha da tarefa aberta no painel fundo
  `#eae9e9`; tarefa cancelada com `opacity: .6`.
- **Última linha:** botão `+ NOVA TAREFA` de largura total, padding `18px 32px`,
  alinhado à esquerda, cor `#ae1800`, hover fundo `#f8f4f4`.

**Responsivo:** o grupo de metadados desce inteiro para uma segunda linha quando a
largura disponível não comporta 260px de título — nunca comprimir o título.

## 4. Visão em KANBAN

Grade de colunas com `grid-auto-flow: column`,
`grid-auto-columns: minmax(250px, 1fr)`, `overflow-x: auto`, altura total.
Colunas na ordem: **Não iniciada · Em andamento · Concluída · Cancelada**.

- **Coluna:** `border-right: 2px solid` divisor (exceto a última);
  a coluna `Cancelada` tem fundo `#f8f4f4`.
- **Cabeçalho da coluna:** `min-height: 52px` fixo, `align-items: center`,
  padding `0 20px`, `border-bottom: 2px solid` divisor.
  Nome 11px uppercase `letter-spacing:.16em` com `white-space: nowrap`;
  contagem à direita em Archivo 800 / 13px cor `#605d5d`.
  **A altura fixa é obrigatória** — sem ela as réguas das quatro colunas desalinham.
- **Cartão** (`border: 2px solid` divisor, fundo `#f3f2f2`, padding 14px, coluna, gap 10px):
  - título — Archivo 600, 14px, `line-height:1.25`
  - descrição curta — 12px, `line-height:1.4`, cor `#605d5d`
  - tags — chips 10px uppercase, `border: 2px solid #201e1d`, padding `3px 7px`
  - rodapé (`border-top: 2px solid` divisor, `padding-top:10px`, space-between):
    meta `DD/MM · HH:MM · N anexos` (Archivo 600, 11px, cor `#605d5d`) e o avatar —
    quadrado 24×24, fundo `#201e1d`, iniciais em Archivo 800 / 10px cor `#f3f2f2`
  - hover: borda passa a `#201e1d`; cartão aberto no painel: borda `#ec3013`;
    cancelado: `opacity: .6`
- **Fim da coluna:** botão `+ ADICIONAR` com `border: 2px dashed` divisor,
  padding `10px 12px`, 11px uppercase, cor `#605d5d`;
  hover cor `#ae1800` e borda `#ec3013`.

## 5. Painel de edição da tarefa

Sobreposição fixa: `position: fixed; top/right/bottom: 0`, `width: min(400px, 92vw)`,
`border-left: 2px solid` texto, fundo `#f3f2f2`, `overflow-y: auto`,
`box-shadow: var(--shadow-lg)`, `z-index: 20`.
**Não deve ocupar uma coluna do grid** — a lista atrás permanece intacta.

- **Topo:** `min-height: 52px`, `border-bottom: 2px solid` texto, padding `0 20px`;
  rótulo `EDITAR TAREFA` (11px uppercase `letter-spacing:.18em`, `#605d5d`) e botão
  `FECHAR` (Archivo 800, 11px uppercase, `#ae1800`).
- **Corpo:** padding `24px 20px`, coluna, gap 22px. Todos os labels em 11px uppercase
  `letter-spacing:.14em`. Todos os inputs com `border: 2px`, raio 0, fundo `#f8f4f4`.
  1. **Título** — input, `min-height: 44px`, Archivo 600 / 16px
  2. **Descrição curta** — input, `min-height: 44px`, 14px
  3. **Descrição completa** — textarea 5 linhas, 14px, `line-height:1.5`,
     `resize: vertical`
  4. **Prazo** — grade `1fr 120px`: input `type="date"` (Prazo — data) +
     input `type="time"` (Hora), ambos `min-height: 44px`
  5. **Situação** — grade 2×2 dentro de `border: 2px solid` texto; cada opção é um botão
     Archivo 600, 11px uppercase, alinhado à esquerda, padding `12px 14px`;
     bordas internas de 2px entre as células; opção ativa com fundo `#ec3013` e
     texto `#f3f2f2`
  6. **Tags** — chips com `border: 2px solid` texto, padding `5px 8px`, 11px uppercase,
     cada um com um `×` clicável em `#ae1800`; ao final o botão `+ TAG` com
     `border: 2px dashed` divisor
  7. **Anexos e fotos** — caixa com `border: 2px solid` divisor; cada arquivo é uma
     linha (padding `10px 12px`, separada por `border-top: 2px solid` divisor a partir
     da segunda) com: selo de tipo (`PNG`, `PDF`…) em Archivo 800 / 10px, fundo
     `#201e1d`, texto `#f3f2f2`, padding `2px 6px`; nome do arquivo 13px com
     `text-overflow: ellipsis`; tamanho 11px cor `#605d5d`; botão `REMOVER` 11px
     uppercase cor `#ae1800`. No rodapé da caixa, o botão
     `+ ANEXAR ARQUIVO OU FOTO` com `border-top: 2px dashed` divisor.
- **Rodapé:** `border-top: 2px solid` texto; botão primário
  `SALVAR ALTERAÇÕES` ocupando o espaço (`min-height: 52px`, fundo `#ec3013`) e
  `EXCLUIR` à direita (`border-left: 2px solid` texto, 11px uppercase, cor `#605d5d`,
  hover `#ae1800`).

## 6. Status — tabela de estilos

Etiqueta base: Archivo 600, 10px, uppercase, `letter-spacing:.14em`, padding `4px 8px`,
`border: 2px solid`, raio 0.

| Status | Fundo | Borda | Texto | Extra |
|---|---|---|---|---|
| Não iniciada | transparente | divisor | `#605d5d` | — |
| Em andamento | `#ec3013` | `#ec3013` | `#f3f2f2` | — |
| Concluída | `#201e1d` | `#201e1d` | `#f3f2f2` | — |
| Cancelada | transparente | divisor | `#605d5d` | `text-decoration: line-through`; a tarefa inteira a 60% de opacidade |

## 7. Modelo de dados

```ts
type Status = 'Não iniciada' | 'Em andamento' | 'Concluída' | 'Cancelada';

interface Attachment {
  kind: string;    // 'PNG', 'PDF', 'JPG'… derivado da extensão
  name: string;
  size: string;    // exibição pronta: '412 KB'
}

interface Task {
  id: number;
  title: string;       // obrigatório
  desc: string;        // descrição curta — uma linha
  full: string;        // descrição completa — multilinha
  date: string;        // ISO 'YYYY-MM-DD', exibido como DD/MM
  time: string;        // 'HH:MM'
  tags: string[];
  status: Status;
  who: string;         // iniciais do responsável
  files: Attachment[];
}

interface Project {
  id: number;
  name: string;
  tasks: Task[];
}
```

Todos os campos de `Task` são **editáveis após a criação** pelo painel de edição.

## 8. Comportamento

| Ação | Resultado |
|---|---|
| Clicar em Lista / Kanban | alterna a visão; a seleção de projeto e o painel aberto permanecem |
| Clicar em um projeto | troca o projeto ativo e **fecha** o painel de edição |
| `+ Novo projeto` | cria um projeto vazio e o torna ativo |
| `Editar` no projeto | renomeia o projeto |
| `Nova tarefa` (cabeçalho, fim da lista, fim da coluna) | cria uma tarefa com título `Nova tarefa`, status `Não iniciada`, sem tags nem anexos, e **abre o painel** já focado nela |
| Clicar em linha ou cartão | abre o painel com aquela tarefa; a linha/cartão fica destacado |
| Editar qualquer campo | grava imediatamente no estado; lista e kanban refletem na hora |
| Trocar a situação no painel | move o cartão de coluna no kanban |
| `Salvar alterações` | fecha o painel (a gravação já ocorreu a cada mudança) |
| `Excluir` | remove a tarefa e fecha o painel |
| `Fechar` | fecha o painel sem alterar nada |

No protótipo, criar projeto, adicionar tag e anexar arquivo usam `window.prompt`.
**No Angular:** substituir por um diálogo próprio (`.dialog` do design system) para
projeto e tag, e por um `<input type="file" multiple accept="image/*,.pdf,.doc,.docx">`
real para anexos, com preview de imagem e leitura de tamanho do `File`.

## 9. Comportamento responsivo (obrigatório)

- **Lista:** o título tem piso de **260px**; quando não cabe, o grupo
  Tags/Situação/Prazo quebra para a linha de baixo. Nunca deixar o título encolher —
  o defeito original era `grid-template-columns` com trilhas fixas.
- **Painel:** sempre sobreposto, `width: min(400px, 92vw)`, com scroll próprio.
- **Kanban:** colunas de no mínimo 250px com rolagem horizontal; nunca comprimir
  quatro colunas em qualquer largura.
- Abaixo de ~720px: colapsar a sidebar em um menu (fora do escopo desta entrega —
  confirmar com design antes de implementar).

## 10. Design tokens (Modernist)

Registrar no `tailwind.config` como cores e fontes customizadas.

| Token | Hex | Uso |
|---|---|---|
| bg | `#f3f2f2` | fundo geral, cartões |
| surface | `#eae9e9` | linha/projeto selecionado |
| neutral-100 | `#f8f4f4` | hover de linha, inputs, coluna Cancelada |
| neutral-700 | `#605d5d` | texto secundário, rótulos |
| text | `#201e1d` | texto, aba ativa, avatar, status Concluída |
| accent | `#ec3013` | status Em andamento, seleção, foco, botão primário |
| accent-600 | `#dd2b0f` | hover do botão primário |
| accent-700 | `#ae1800` | texto e links em vermelho |
| divider | `#201e1d` a 40% | todas as réguas de 2px |

**Tipografia:** Archivo — 800 para títulos e números, 600 para rótulos e títulos de
tarefa, 400 para corpo. Escala usada: 30 · 20 · 16 · 14 · 13 · 12 · 11 · 10px.

**Espaçamento:** múltiplos de 4 — 4 · 6 · 8 · 10 · 12 · 14 · 16 · 20 · 22 · 24 · 32px.

**Raio de borda: 0 em todos os elementos. Sombras:** apenas `--shadow-lg` no painel
sobreposto; o resto da tela usa réguas de 2px, nunca sombra.

**Foco de teclado:** `outline: 2px solid #ec3013; outline-offset: 2px` em todos os
elementos interativos — nunca o anel azul padrão.

## 11. Ícones (lucide-angular)

A tela atual é toda em texto. Onde o time quiser ícones, usar em 16–18px, cor herdada:
`folder` (projeto), `list` / `kanban-square` (toggle), `plus` (criar),
`calendar-clock` (prazo), `tag` (tags), `paperclip` (anexos), `image` (fotos),
`pencil` (renomear), `trash-2` (excluir), `x` (fechar).

## 12. Regras do design system a respeitar

- Nenhum canto arredondado, em lugar nenhum.
- Réguas de 2px, nunca hairlines; a estrutura é feita por linhas, não por sombra.
- Tudo alinhado à esquerda, inclusive labels dentro de botões largos.
- Vermelho com parcimônia: ação primária, status Em andamento, seleção e foco.
- Fotos e imagens sempre em preto e branco (classe `.grayscale`).

## 13. Arquivos deste pacote

- `Taskly App.dc.html` — o protótipo funcional (abre no navegador).
- `reference/modernist-styles.css` — folha de tokens do design system.
- `screenshots/lista.png`, `screenshots/kanban.png`, `screenshots/painel-edicao.png`.
