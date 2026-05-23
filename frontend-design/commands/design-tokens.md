---
description: Gera, audita ou refina design tokens (cor, tipografia, espaçamento, motion)
argument-hint: generate|audit|refine [escopo opcional]
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

Trabalhe com design tokens do projeto: $ARGUMENTS

## Modos

### `generate`
Crie um sistema de tokens base:

- **Cor**
  - Primitivas: paleta neutra (`gray-50` … `gray-950`) + paleta primária
  - Semânticas: `bg-surface`, `bg-elevated`, `text-primary`, `text-muted`, `border-default`, `border-strong`, `success/warning/error/info`
  - Light + dark com contraste WCAG validado (4.5:1 para texto)

- **Tipografia**
  - Escala modular (1.125, 1.2 ou 1.25)
  - Famílias (sans, mono) com fallback robusto
  - Pesos: 400, 500, 600, 700 (limite 4)
  - Line-heights: ~1.5 corpo, ~1.2 títulos

- **Espaçamento**
  - Base 4px ou 8px
  - Escala não-linear: 4, 8, 12, 16, 24, 32, 48, 64

- **Radius**: 0, 4, 8, 12, 16, 9999 (pill)

- **Shadow**: 3-4 níveis de elevação

- **Motion**
  - Durações: `fast=150ms`, `base=200ms`, `slow=300ms`
  - Easings: `ease-out` (entrada), `ease-in` (saída), `ease-in-out` (entre estados)

Detecte a stack e escolha formato: CSS variables, Tailwind config, JS object, JSON, etc.

### `audit`
Procure valores hardcoded que deveriam usar tokens:
- Cores hex/rgb fora de tokens
- `px` arbitrários em padding/margin
- Durações de animação fora do sistema
- Sombras inline

Liste em `file:line` com sugestão de token.

### `refine`
Otimize tokens existentes:
- Identifique inconsistências
- Pares de contraste fora do WCAG
- Tokens redundantes ou nunca usados
- Naming confuso ou inconsistente
