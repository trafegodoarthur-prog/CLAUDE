---
description: Auditoria profunda de acessibilidade WCAG 2.2 AA
argument-hint: [arquivo|componente|"diff"]
allowed-tools: Read, Grep, Glob, Bash
---

Use o subagent `a11y-auditor` para auditar acessibilidade em: $ARGUMENTS

Se nenhum alvo foi especificado, audite as mudanças do diff atual (`git diff`).

## Output esperado

Lista de issues organizada por severidade, com:
- **Critério WCAG** correspondente (ex: `1.4.3 Contrast (Minimum)`, `2.4.7 Focus Visible`)
- **Localização**: `file:line`
- **Por que importa**: impacto real em usuários
- **Fix sugerido**: código ou abordagem concreta

## Severidades

- **Crítico**: bloqueia uso por tecnologia assistiva (ex: `<div onClick>` sem keyboard support)
- **Sério**: degrada uso significativamente (ex: contraste 3:1 em texto normal)
- **Moderado**: prejudica experiência (ex: foco visível pouco distinto)
- **Menor**: melhoria de qualidade (ex: `aria-label` redundante)

Se um aspecto está bem implementado, **diga**. Não invente problemas.
