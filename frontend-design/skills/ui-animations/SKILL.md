---
name: ui-animations
description: Transições, micro-interações, motion design — durações, easings, performance, prefers-reduced-motion, view transitions. Ative ao adicionar animações, transições, ou polish de interação.
---

# UI Animations

## Princípios

- **Animação serve à função.** Comunica mudança de estado, orienta atenção, dá feedback. Não é decoração.
- **Curta e rápida.** 150-300ms cobre 90% dos casos. >500ms só para transições grandes (page change).
- **Easing certo:**
  - `ease-out` para coisas que **entram** (decelera ao chegar — natural)
  - `ease-in` para coisas que **saem** (acelera ao sair)
  - `ease-in-out` para coisas que **se movem entre dois lugares**
  - `linear` só para spinners

## Durações recomendadas

| Tipo de interação | Duração |
|---|---|
| Hover / micro feedback | 100-150ms |
| Transição de estado (button, input) | 150-200ms |
| Expansão/colapso (accordion, menu) | 200-300ms |
| Modal/sheet enter | 250-350ms |
| Modal/sheet exit | 150-200ms (saída mais rápida que entrada) |
| Page transition | 300-500ms |

## Performance

Anime **apenas** `transform` e `opacity` quando possível (GPU-accelerated, sem reflow).

Evite animar:
- `width`, `height` (causam reflow) → use `transform: scale()` + ajuste do layout
- `top`, `left`, `right`, `bottom` → use `transform: translate()`
- `box-shadow` em loops → use opacity em pseudo-element com sombra

`will-change` com parcimônia e remova quando termina (`onAnimationEnd`).

## `prefers-reduced-motion` — sempre respeite

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Mais cirúrgico: desabilite animações grandes e parallax, mantenha transições essenciais (foco, hover) em ~100ms.

## Micro-interações que valem ouro

- **Botão pressionado**: `scale(0.97)` no `:active`, 100ms
- **Input focus**: borda muda cor + leve glow (`box-shadow`), 150ms
- **Checkbox/toggle**: anime o checkmark/thumb suavemente (transform), 150-200ms
- **Loading**: skeleton (shimmer) > spinner quando possível
- **Empty state**: pequena animação no ícone na primeira render (chama atenção sem ser intrusivo)
- **Tooltip**: fade + slight translate de 4px, 150ms in / 100ms out
- **Toast**: slide-in de baixo (mobile) ou direita (desktop), 250ms

## Stagger (efeito cascata)

Em listas que aparecem juntas, dê pequeno delay incremental (50-80ms) entre itens. Sensação de fluidez.

```css
.item:nth-child(1) { transition-delay: 0ms; }
.item:nth-child(2) { transition-delay: 50ms; }
.item:nth-child(3) { transition-delay: 100ms; }
```

Limite a 5-7 itens — depois fica lento.

## View Transitions API

Transição suave entre estados/páginas com browser fazendo o trabalho pesado:

```js
document.startViewTransition(() => {
  // mutação do DOM
});
```

Funciona muito bem para list → detail transitions, theme toggles, e SPA navigations.

## Ferramentas (stack-agnóstico)

- **CSS transitions/animations**: padrão; cobre maioria dos casos
- **Web Animations API**: controle programático (`element.animate(...)`)
- **Framer Motion** (React), **Motion One** (vanilla/agnóstico): orquestração avançada
- **View Transitions API**: transições entre estados de página

## Anti-patterns

- Animação >500ms em interação direta (usuário fica esperando)
- Bounce/spring em todo lugar (cansa, parece brinquedo)
- Parallax excessivo (enjoo + problemas de a11y)
- Animar `box-shadow` ou `filter: blur()` em loop
- Ignorar `prefers-reduced-motion`
- Animar abertura **e** fechamento com mesma duração (saída deve ser mais rápida)
- Easing `ease` padrão em tudo (é genérico; use `ease-out` consciente)
- Múltiplas animações concorrentes na mesma região (compete pela atenção)

## Checklist antes de fazer merge

- [ ] Duração apropriada (150-300ms na maioria)
- [ ] Easing correto pro tipo de movimento
- [ ] Anima só `transform`/`opacity` quando possível
- [ ] Respeita `prefers-reduced-motion`
- [ ] Sem layout shift
- [ ] Funciona em 60fps em dispositivo mid-tier

## Aplique quando

- Polish final de componentes
- Feedback de interação (button press, input focus)
- Transições de estado (open/close, show/hide, mount/unmount)
- Navegação entre páginas/views
- Loading states
