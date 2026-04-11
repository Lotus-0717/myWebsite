# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production (always run to verify before pushing)
npm run preview   # Preview production build locally
```

There are no tests or linters configured.

## Architecture

**Framework**: Astro 5 with React islands (`client:load`) and Tailwind CSS v4.

### Routing & Pages

All pages live in `src/pages/`. Dynamic routes:
- `/blog/[id]` — individual blog posts
- `/portfolio/[id]` — individual portfolio projects
- `/categories/[category]` and `/tags/[tag]` — filtered blog listings

### Content Collections

Defined in `src/content.config.ts`. Two collections:
- `blog` — Markdown files in `src/content/blog/`. Required frontmatter: `title`, `description`, `pubDate`, `category`, `tags`, `draft`.
- `portfolio` — Markdown files in `src/content/portfolio/`. Required frontmatter: `title`, `description`, `tech[]`, `status` (`completed` | `in-progress` | `archived`), `featured`, `sortOrder`.

### Theming

CSS custom properties defined in `src/styles/global.css` under `:root` (default) and `[data-theme="eva02"]` (alternate). Always use `var(--color-theme-*)` variables, never hardcode colours. Theme is toggled via a hidden Easter egg on the footer text, persisted to `localStorage`.

### Fonts

- **Body default**: Ubuntu Mono + Noto Sans TC (fallback for CJK)
- **Display headings** (`SecTit` component): Poppins — must be explicitly set with `font-family: 'Poppins', sans-serif;` on any element that needs it
- **Logo**: StretchPro (`public/stretch-pro.regular.ttf`), loaded via `@font-face` in `global.css`

### Tailwind

Using Tailwind v4 (Vite plugin, not PostCSS). CSS-first config via `@theme` in `global.css`. The `@tailwindcss/typography` plugin is used for prose content in blog/portfolio detail pages.

To override typography plugin styles, rules must be placed **outside** any `@layer` block — layered styles lose to unlayered plugin styles in the cascade.

### Component Notes

- `SectionCard` — primary card container, `p-4 md:p-8` responsive padding
- `SecTit` — styled section title with stacked shadow effect, uses Poppins explicitly
- `GlitchPhoto` — React island using PixiJS for glitch effect on profile photo
- `Header` — sticky, handles mobile hamburger (two-line → X animation) with frosted glass slide-in drawer; the logo text is a special character and must not be replaced
- `ThemeToggle` — currently commented out in `BaseLayout.astro`, kept for future use
