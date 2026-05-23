---
description: Auditoria de responsividade e comportamento mobile-first
argument-hint: [arquivo|"layout atual"]
allowed-tools: Read, Grep, Glob, Bash
---

Audite responsividade de: $ARGUMENTS

## Checklist

### Mobile-first
- [ ] CSS base é mobile, com `min-width` queries pra cima
- [ ] Não usa `max-width` queries como padrão

### Breakpoints
- [ ] Baseados em conteúdo, não em devices específicos
- [ ] Layout não quebra entre 320px e 1920px+
- [ ] Pontos de quebra fazem sentido (não há "buraco" entre breakpoints)

### Tipografia
- [ ] Texto escalável (não fixo em px sem fallback)
- [ ] Considera `clamp()` ou similar para tipografia fluida
- [ ] Line-length não passa de ~75ch em telas largas

### Touch & hover
- [ ] Touch targets ≥44×44px (WCAG 2.2 SC 2.5.8)
- [ ] Hover não revela conteúdo essencial
- [ ] `@media (hover: hover)` usado quando apropriado

### Imagens & mídia
- [ ] `srcset`/`sizes` em imagens responsivas
- [ ] `loading="lazy"` em imagens fora do viewport inicial
- [ ] Vídeos com `width: 100%; height: auto`

### Layout
- [ ] Nenhum overflow horizontal inesperado
- [ ] Grid/flex se adapta sem hardcoded width
- [ ] Container queries quando o componente reaparece em múltiplos contextos

### A11y de responsivo
- [ ] Zoom até 200% sem perda de funcionalidade (WCAG 1.4.4)
- [ ] Reflow funciona em viewport 320px (WCAG 1.4.10)

## Output

```
## Responsive Audit: <alvo>

### Problemas
1. <descrição> — `file:line`
   Fix: <sugestão>

### Observações
- <coisas que estão OK ou trade-offs aceitáveis>
```
