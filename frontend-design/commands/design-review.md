---
description: Revisão crítica de design de componente, página ou diff atual
argument-hint: [arquivo|componente|"diff"]
allowed-tools: Read, Grep, Glob, Bash
---

Faça uma revisão de design **profunda e crítica** do alvo: $ARGUMENTS

Se nenhum alvo foi especificado, revise o diff atual (`git diff`) ou os arquivos de UI modificados recentemente.

## Eixos de avaliação

Para cada eixo, dê uma nota de 1-5 e cite trechos específicos do código (`file:line`).

### 1. Hierarquia visual
- Tipografia: escala, peso, line-height, line-length (~60-75ch para corpo)
- Espaçamento: padding/margin consistentes, ritmo vertical
- Contraste visual entre níveis de informação

### 2. Sistema de design
- Uso de tokens (cores, espaçamentos, tipografia) vs valores hardcoded
- Consistência com o resto do codebase
- Reuso vs duplicação de componentes

### 3. Acessibilidade (WCAG 2.2 AA)
- HTML semântico (`<button>` vs `<div onClick>`, headings em ordem)
- ARIA correto e parcimonioso
- Contraste: ≥4.5:1 texto normal, ≥3:1 texto grande / UI
- Foco visível
- Touch targets ≥44×44px

### 4. Responsividade
- Mobile-first?
- Breakpoints baseados em conteúdo, não devices
- Layout estável de 320px a 1920px+
- Hover não-essencial em touch

### 5. Micro-interações & polish
- Estados completos: hover, active, focus-visible, disabled, loading, empty, error
- Durações 150-300ms, easing apropriado
- `prefers-reduced-motion` respeitado
- Feedback visual em ações destrutivas/críticas

## Formato da saída

```
# Design Review: <alvo>

## Nota geral: X/25

### Pontos fortes
- ...

### Problemas críticos
1. <problema> — `file:line`
   Por que importa: <impacto>
   Fix: <sugestão concreta>

### Melhorias recomendadas
1. ...

### Próximos passos sugeridos
- ...
```

Seja honesto. Não infle notas pra ser simpático. Cite código real, não hipotético.
