---
name: responsive-design
description: Mobile-first, breakpoints, fluid typography, container queries, touch vs hover. Ative ao trabalhar com layouts, media queries, grids, ou comportamento entre viewports.
---

# Responsive Design

## Mobile-first

Escreva o CSS base para mobile e adicione `min-width` queries pra cima:

```css
/* base: mobile */
.card { padding: 16px; font-size: 14px; }

/* tablet+ */
@media (min-width: 640px) {
  .card { padding: 24px; font-size: 16px; }
}
```

**Por quê:** mobile é o cenário mais restrito; mais fácil adicionar do que remover.

## Breakpoints

Use **breakpoints baseados em conteúdo**, não em devices específicos.

Convenções comuns (Tailwind-like):

| Token | Largura | Uso típico |
|---|---|---|
| `sm` | 640px | tablet portrait |
| `md` | 768px | tablet landscape |
| `lg` | 1024px | laptop |
| `xl` | 1280px | desktop |
| `2xl` | 1536px | wide desktop |

Mas: **se o layout quebrar antes do próximo breakpoint, ajuste o CSS, não force um device-specific breakpoint**.

Evite `@media (max-width: 414px)` (iPhone X) — vira manutenção infinita.

## Container queries

Quando um componente precisa se adaptar ao **container** (não à viewport), use `@container`:

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { display: grid; grid-template-columns: auto 1fr; gap: 16px; }
}
```

Caso clássico: card que aparece em sidebar (estreito) e em main (largo).

## Tipografia fluida

`clamp()` reduz necessidade de breakpoints:

```css
font-size: clamp(1rem, 0.875rem + 0.5vw, 1.25rem);
/* min 16px, escala com viewport, máx 20px */
```

Aplique em headings principalmente. Corpo geralmente fixo dá experiência mais consistente.

## Grid & flex responsivo

Padrões úteis:

```css
/* grid que vira coluna automática */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

/* flex wrap simples */
.row { display: flex; flex-wrap: wrap; gap: 12px; }
.row > * { flex: 1 1 240px; }
```

Esses padrões respondem sem media queries.

## Touch vs hover

- `hover` em desktop, evite efeitos "stick" em mobile (sticky hover bug)
- Touch targets ≥44×44px (WCAG 2.2)
- Não dependa de hover para revelar conteúdo essencial

```css
@media (hover: hover) and (pointer: fine) {
  .btn:hover { background: var(--surface-hover); }
}

/* fallback para touch: aplicar via :active */
.btn:active { background: var(--surface-hover); }
```

## Imagens responsivas

```html
<img
  src="default.jpg"
  srcset="small.jpg 480w, large.jpg 1080w"
  sizes="(min-width: 768px) 50vw, 100vw"
  loading="lazy"
  decoding="async"
  alt="..."
/>
```

`<picture>` quando precisa art direction diferente entre breakpoints (não só tamanho).

## Viewport meta

Sempre no `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**Não** use `user-scalable=no` ou `maximum-scale=1` — quebra zoom, anti-a11y.

## A11y de responsivo (WCAG)

- **1.4.4 Resize text:** zoom até 200% sem perda de funcionalidade
- **1.4.10 Reflow:** conteúdo funciona em 320×256 sem scroll bidirecional (exceto mapas/tabelas)

## Anti-patterns

- `max-width` queries como padrão (não é mobile-first)
- Breakpoints em devices específicos
- Texto fixo em px sem considerar zoom (use rem ou clamp)
- Layout que quebra entre breakpoints intermediários
- Hover único para feature crítica
- `width: 100vw` (gera scroll horizontal por causa de scrollbar)

## Aplique quando

- Definindo grid/flex layouts
- Escolhendo onde colocar media queries
- Implementando componentes que aparecem em múltiplos contextos (container queries)
- Auditando comportamento mobile / wide screen
- Tipografia que precisa escalar
