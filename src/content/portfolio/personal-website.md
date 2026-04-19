---
title: "Personal Website"
description: "A personal website and blog built with Astro, React, and Tailwind CSS."
descriptionZh: "以 Astro、React 與 Tailwind CSS 打造的個人網站，包含部落格、作品集與小工具頁面。"
tech: ["Astro", "React", "Tailwind CSS", "TypeScript", "Claude API"]
url: "https://lotus-yeh.com"
repo: "https://github.com/Lotus-0717/myWebsite"
featured: true
sortOrder: 3
status: "completed"
---

## About This Project

This is my personal website — built from scratch as a place to practise, write, and showcase my work. The goal was to solve real product problems end-to-end rather than reach for a template.

### Features

- **Blog** — Markdown-based posts with category and tag filtering
- **Portfolio** — project showcase with individual detail pages
- **Interactive tools** — Word Counter and CSS Triangle Generator, built as React islands
- **AI translation mode** — `?lang=zh` triggers a client-side script that batch-translates the page via a Claude API SSR endpoint, with session caching and progressive rendering
- **Dual-theme system** — alternate colour theme unlocked via a hidden Easter egg in the footer, persisted to `localStorage`
- **SEO** — sitemap, robots.txt, Open Graph tags, canonical links, and `hreflang` for bilingual content

### Architecture

Built with Astro 5 and deployed to Vercel. Most pages are statically generated; interactive components hydrate selectively with `client:load` (React islands). The `/api/translate` endpoint opts into SSR and calls the Claude API to power the translation feature.
