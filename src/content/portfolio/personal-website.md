---
title: "Personal Website"
description: "A personal website and blog built with Astro, React, and Tailwind CSS."
tech: ["Astro", "React", "Tailwind CSS", "TypeScript"]
url: "https://lotus-yeh.com"
repo: "https://github.com/Lotus-0717/myWebsite"
featured: true
sortOrder: 4
---

## About This Project

This is my personal website — built from scratch as a place to practise, write, and showcase my work. The goal was to solve real product problems end-to-end rather than reach for a template.

### Features

- **Blog** — Markdown-based posts with category and tag filtering
- **Portfolio** — project showcase with individual detail pages
- **Interactive tools** — Word Counter and CSS Triangle Generator, built as React islands
- **Dual-theme system** — alternate colour theme unlocked via a hidden Easter egg in the footer, persisted to `localStorage`
- **SEO** — sitemap, robots.txt, Open Graph tags, and canonical links

### Architecture

Built with Astro 5 and deployed to Vercel. Pages are statically generated; interactive components hydrate selectively with `client:load` (React islands).
