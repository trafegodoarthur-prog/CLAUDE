---
description: Cria um componente UI seguindo best practices de design, a11y e responsividade
argument-hint: <nome-do-componente> <descrição breve>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

Crie um novo componente UI seguindo design e a11y best practices.

**Especificação:** $ARGUMENTS

## Antes de codar

1. **Detecte a stack** — leia `package.json`, framework files, e config de CSS (Tailwind, CSS Modules, vanilla, etc.)
2. **Detecte o design system existente** — tokens, utilities, primitivas, padrões de componentes já estabelecidos
3. **Se algo estiver ambíguo** (stack, design system, escopo) → **pergunte antes de implementar**

## Passos

1. **Proponha a API** brevemente:
   - Props (nome, tipo, default, obrigatoriedade)
   - Composição: slots/children vs props
   - Variantes (`variant`, `size`, `intent`)
   - Estados controlados vs não-controlados

2. **Implemente** respeitando:
   - **Semântica HTML correta** (`<button>` para ações, `<a>` para nav, `<input>` apropriado)
   - **Keyboard**: tab order, foco visível, Enter/Space/Escape conforme padrão
   - **ARIA mínimo necessário** (não excessivo)
   - **Estados visuais**: default, hover, active, focus-visible, disabled, loading (quando aplicável)
   - **Tokens** — nada de cores hex ou padding em px hardcoded
   - **Mobile-first responsivo**
   - **`prefers-reduced-motion`** se houver animação

3. **Documente o uso** com 2-3 exemplos curtos.

## Não faça

- Não implemente sem entender o sistema de design existente
- Não invente uma stack — use o que o projeto já usa
- Não adicione dependências sem confirmar
