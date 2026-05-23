---
name: design-systems
description: Princípios e práticas de design systems — tokens (cor, tipografia, espaçamento, motion), arquitetura de componentes, naming, e versionamento. Ative ao trabalhar com tokens, themes, biblioteca de componentes, ou padronização visual.
---

# Design Systems

## Tokens

### Cor

Estruture em camadas:

- **Primitivas** (`gray-50` … `gray-950`, `blue-50` … `blue-950`): paleta crua, sem semântica.
- **Semânticas** (`bg-surface`, `text-primary`, `border-default`, `accent`): mapeiam primitivas para uso.
- **Componente** (`btn-primary-bg`): opcional, só para casos extremos.

Cada par texto/fundo precisa passar WCAG (4.5:1 normal, 3:1 grande/UI). Valide antes de commitar.

Dark mode: tokens semânticos mudam, primitivas geralmente não.

### Tipografia

- Escala modular: 1.125 (minor third) para denso, 1.25 (major third) para padrão, 1.333 para impactante.
- Pesos: limite a 3-4 (ex: 400, 500, 600, 700).
- Line-height: 1.5-1.75 para corpo, 1.1-1.3 para títulos grandes.
- Line-length: ~60-75 caracteres para texto longo (use `max-width: 65ch`).

### Espaçamento

Base 4px ou 8px. Escala **não-linear** captura uso real:

```
4, 8, 12, 16, 24, 32, 48, 64, 96, 128
```

Linear (4, 8, 12, 16, 20, 24...) tem valores demais que ninguém usa.

### Radius

`0, 4, 8, 12, 16, 9999` (último para pill).

### Shadow

3-4 níveis de elevação. Mais que isso vira inconsistência.

```
sm: 0 1px 2px rgb(0 0 0 / 0.05)
md: 0 4px 6px rgb(0 0 0 / 0.07), 0 2px 4px rgb(0 0 0 / 0.04)
lg: 0 10px 15px rgb(0 0 0 / 0.07), 0 4px 6px rgb(0 0 0 / 0.04)
xl: 0 25px 50px rgb(0 0 0 / 0.12)
```

### Motion

- Durações: `fast=150ms`, `base=200ms`, `slow=300ms`. >500ms só pra page transitions.
- Easings: `ease-out` (entrada), `ease-in` (saída), `ease-in-out` (entre estados), `linear` só pra spinners.

## Componentes

- **Headless + estilo separado** > componentes monolíticos. Lógica + a11y reusável independente do visual.
- **Composição > configuração**. Slots/children > props booleanas que crescem sem limite.
- **Controlled + uncontrolled**. Ofereça ambos quando faz sentido (ex: `value`/`defaultValue`).
- **`as` polimórfico** com parcimônia — útil em `Box`/`Stack`, ruim em componentes específicos.

## Naming

- Use **intenção**, não aparência: `text-danger` > `text-red`.
- Use **role**, não posição: `bg-surface` > `bg-light`.
- Consistente: se tem `text-primary`, tem `text-secondary` (não `text-muted` aleatório).

## Versionamento (se for distribuir)

- Semver estrito: breaking change = major. Mudou contraste de uma cor? minor. Mudou nome de token? major.
- Changelog descritivo (não "v2.0.0: várias mudanças").
- Codemods para mudanças não-triviais.

## Anti-patterns

- Valores hardcoded (`#3b82f6`, `padding: 13px`) em componentes
- Tokens demais (`primary-blue-500-light-hover-disabled`) — vira intratável
- Inconsistência: dois ícones para a mesma ação, dois pesos pra mesma hierarquia
- `!important` para superar especificidade — sintoma de arquitetura ruim
- Dark mode que apenas inverte (sem ajuste de saturação)

## Aplique quando

- Criando tokens do zero ou refinando existentes
- Decidindo API de componente base
- Padronizando design em codebase fragmentado
- Auditando uso de tokens vs valores hardcoded
