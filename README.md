# Landing Page — Rede Estratégica de Talentos para RI

Landing page institucional da **Astri Solutions** para a Rede Estratégica de Talentos em Relações com Investidores (RI).

Projeto preparado para integração futura com o CMS proprietário **Workr** (ASP.NET / ASPX).

## Stack

- **HTML5** semântico e acessível (WCAG 2.1 AA / eMAG)
- **SCSS** modular compilado para CSS minificado
- **JavaScript vanilla** (sem frameworks) — compatível com renderização server-side
- **Bootstrap 5.3.8** (utilitários de grid e responsivo)
- Tipografia: **Plus Jakarta Sans** (títulos) + **Inter** (corpo)

## Estrutura

```
.
├── index.html                  HTML principal
├── package.json                Dependências e scripts
│
├── scss/
│   ├── import.scss             Entry point — importa todos os parciais
│   ├── main/                   Tokens, reset, tipografia, utilitários, animações
│   ├── components/             Botões, tags, navbar, footer
│   └── sections/               Hero, opportunities, about, connect, differential, form
│
├── css/
│   └── import.min.css          CSS compilado e minificado (gerado pelo build)
│
├── scripts/
│   ├── navbar.js               Efeito de sombra no scroll
│   ├── reveal.js               Fade-in bottom on scroll (IntersectionObserver)
│   ├── carousel.js             Carrossel do Diferencial (7 slides, autoplay 3s)
│   ├── tabs.js                 Tabs da seção Conecte-se (animação slide) e Form
│   └── form.js                 Validação visual do formulário
│
└── imgs/
    ├── banner.webp             Imagem do hero (executivos)
    └── bg-section-gradient.webp Background do card Oportunidades
```

## Comandos

```bash
# Instalar dependências
npm install

# Build de produção (CSS minificado)
npm run build

# Modo watch — recompila a cada salvamento (minificado)
npm run watch

# Modo dev — CSS expandido (mais fácil de debugar)
npm run dev
```

O build gera `css/import.min.css` (já minificado, sem sourcemap).

## Tokens de design

Definidos em `scss/main/_variables.scss` como **CSS Custom Properties** (`--var`), o que permite:
- Trocar paleta de cores em runtime (suporte futuro a dark mode)
- Mantém compatibilidade com Workr/ASPX
- Sem necessidade de recompilar SASS para ajustes pontuais

**Paleta principal:**
- Verde menta `#00d865` — CTAs, palavras-chave
- Verde escuro `#0b5b68` — fundos imersivos, títulos
- Verde profundo `#003b45` — variação

## Integração futura com Workr

O HTML está preparado para conversão direta para ASPX:

- Atributos `id="txtNome"` e `name="txtNome"` nos inputs → mapeiam direto para `<asp:TextBox ID="txtNome" runat="server">`
- `<form>` HTML5 padrão → trocar por `<form runat="server">` no Workr
- reCAPTCHA é placeholder → integrar via controle ASP.NET
- Caminhos relativos `imgs/...` → podem virar `<%= ResolveUrl("~/imgs/...") %>` se necessário

## Acessibilidade

- Estrutura semântica (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`)
- ARIA labels e roles em componentes interativos
- Respeita `prefers-reduced-motion` (desativa animações)
- Contraste WCAG AA
- Navegação por teclado preservada

## Responsividade

| Viewport | Container |
|---|---|
| > 1540px | 70% |
| 992–1540px | 80% |
| 768–991px | 80% |
| ≤ 767px | 90% (mobile, sem menu na navbar) |
