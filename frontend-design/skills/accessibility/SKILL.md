---
name: accessibility
description: WCAG 2.2 AA, ARIA, HTML semântico, foco, contraste, keyboard. Ative ao escrever ou revisar qualquer componente UI, formulário, modal, navegação, ou interação keyboard.
---

# Acessibilidade Web (WCAG 2.2 AA)

## Princípios fundamentais

1. **HTML semântico primeiro.** `<button>` > `<div onClick>`. `<a href>` > `<div onClick>`. `<input type="checkbox">` > custom div.
2. **ARIA é último recurso.** "No ARIA is better than bad ARIA." Use só quando HTML semântico não resolve.
3. **Keyboard funciona em tudo.** Tab order lógico, foco visível, Escape fecha overlays, Enter/Space ativam.
4. **Contraste mínimo:** 4.5:1 texto normal, 3:1 texto grande (≥18pt ou 14pt bold), 3:1 elementos UI.
5. **Touch targets ≥44×44px** (WCAG 2.2 SC 2.5.8).

## Patterns comuns

### Botões vs links
- **Ação** (submit, abrir modal, toggle): `<button>`
- **Navegação** (mudar URL): `<a href>`
- Se precisa `<a>` sem URL real, repense — provavelmente é botão

### Forms
- Toda input tem `<label>` (via `for` ou wrapping)
- Erros: `aria-describedby` apontando para a mensagem, `role="alert"` ou `aria-live="polite"`
- Required: `required` + opcionalmente `aria-required="true"`
- `autocomplete` em campos comuns (email, name, address) — ajuda muito quem usa preenchimento automático

### Modal / Dialog
- `role="dialog"` + `aria-modal="true"`
- `aria-labelledby` apontando para o título
- Foco vai pro modal ao abrir, volta pro trigger ao fechar
- Escape fecha
- Foco fica **trapped** dentro
- Bloqueia interação com fundo

### Dropdown / Menu
- `aria-expanded` no trigger reflete estado
- `aria-haspopup="menu"` (ou `listbox`, `dialog` conforme tipo)
- Setas navegam itens, Enter/Space seleciona, Escape fecha
- Foco volta pro trigger ao fechar

### Tabs
- `role="tablist"` no container, `role="tab"` em cada, `role="tabpanel"` no conteúdo
- `aria-selected` no tab ativo
- Setas mudam tab focado, Enter/Space ativa

### Imagens
- Informativas: `alt="descrição concisa"`
- Decorativas: `alt=""` (importante — sem alt, screen reader anuncia o filename)
- SVG ícone com label do botão: `aria-hidden="true"` no SVG
- SVG standalone: `<title>` dentro do SVG ou `aria-label` no SVG

### Cores
- **Nunca** informação só por cor (use cor + ícone + texto)
- Foco visível com contraste 3:1 contra fundo
- Estados (hover, active, disabled) discerníveis por mais que cor

## Anti-patterns (frequentes)

- `<div role="button">` sem `tabIndex={0}`, sem keyboard handler
- `onClick` em `<div>` ou `<span>` sem nada mais
- `aria-label` em elemento que já tem texto visível (causa conflito)
- `outline: none` sem substituir foco visível
- Placeholder como label
- Headings fora de ordem (h1 → h3 sem h2)
- Skip link ausente em páginas com muito conteúdo de navegação
- `tabindex` positivo (quebra ordem natural)
- Modal sem foco trap
- Toast/notification que some rápido demais sem `aria-live`

## WCAG quick reference (critérios mais quebrados)

| Critério | O que valida |
|---|---|
| 1.1.1 | Alt em imagens |
| 1.3.1 | Estrutura semântica (headings, listas, labels associadas) |
| 1.4.3 | Contraste mínimo de texto |
| 1.4.10 | Reflow em 320px |
| 1.4.11 | Contraste de UI / foco |
| 2.1.1 | Tudo acessível via keyboard |
| 2.4.3 | Foco em ordem lógica |
| 2.4.7 | Foco visível |
| 2.5.8 | Touch targets ≥24px (AA) ou ≥44px (recomendado) |
| 3.3.1 | Erros identificados |
| 3.3.2 | Labels ou instruções |
| 4.1.2 | Name, role, value (ARIA correto) |

## Aplique quando

- Qualquer componente interativo
- Formulários
- Navegação, skip links, landmarks
- Modais, dropdowns, tooltips, accordions, tabs
- Validação de erro
- Conteúdo dinâmico (live regions)
