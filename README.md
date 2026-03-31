# Easy Search

A clean, elegant multi-engine search page with custom site management, categories, and theme switching.

[中文文档](./README_CN.md)

## Features

- **Multi-engine search** — 19 built-in sites including Google, GitHub, Bilibili, Zhihu, Perplexity, Claude, and more
- **Custom sites** — Add any search engine, enable/disable, drag to reorder
- **Categories** — Group sites to keep the page organized
- **Default engine** — Set which engine the Enter key triggers
- **Theme switcher** — Solid colors and gradients with multiple presets
- **Bilingual UI** — Supports zh-CN / en language toggle
- **Local persistence** — All settings stored in localStorage, no account needed

## Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS** + **Framer Motion**
- **HeroUI** component library
- **Vite** build tool

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Adding a Custom Search Engine

Search URL format: `https://example.com/search?q=` (the query is automatically appended at the end)

## Font Licenses

- **Source Han Sans SC** — SIL Open Font License 1.1, © Adobe
- **Cormorant Garamond** — SIL Open Font License 1.1, © Christian Thalmann
- **ChillHuoFangSong** — Please refer to the font's original license terms

## License

[MIT](./LICENSE)
