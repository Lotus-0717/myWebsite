---
title: "Seclusion of Sage"
description: "A commercial interior styling and space rental studio website, built solo end-to-end — from client communication to design and development."
descriptionZh: "棲仙｜商業空間美學與場地租借工作室官網，從客戶溝通、視覺設計到全端開發，全程獨立完成。"
tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Sanity CMS", "Swiper"]
url: "https://www.seclusion-of-sage.com/"
featured: true
sortOrder: 2
cover: /images/portfolio/seclusionOfSage/logo.png
images:
  - /images/portfolio/seclusionOfSage/preview-1.png
  - /images/portfolio/seclusionOfSage/preview-2.png
  - /images/portfolio/seclusionOfSage/preview-3.png
  - /images/portfolio/seclusionOfSage/preview-4.png
  - /images/portfolio/seclusionOfSage/preview-5.png
---

## About This Project

Seclusion of Sage（棲仙）is a commercial interior styling studio offering soft furnishing design, space rental, and workshops. The website serves as a portfolio showcase and a service hub for prospective clients.

This was a solo end-to-end project — I handled client communication, requirements gathering, visual design, and full-stack development with no designer or PM involved. The project is structured as a monorepo with two independent packages: a Next.js frontend (`web/`) and a Sanity Studio CMS (`sanity/`), so the client can manage all content independently without touching code.

### Features

- **Homepage carousel** — full-screen image slideshow powered by Swiper
- **Work portfolio** — dynamic gallery with individual project pages and lightbox image viewer
- **News & blog** — paginated article listing with category filtering
- **Studio gallery** — custom justified layout algorithm for an organic photo grid, with separate desktop and mobile handling
- **Service, Profile, and Contact pages** — covering interior styling services, space rental, and workshop offerings

### Architecture

Content is entirely CMS-driven via Sanity v4. Pages are built as Next.js Server Components using GROQ queries, with ISR (Incremental Static Regeneration) at a 60-second revalidation interval for fast delivery without sacrificing freshness.

Rich text content is rendered via `@portabletext/react`, and all CMS images are served through `@sanity/image-url` for on-the-fly resizing and optimisation.

### Design

Typography combines Noto Serif TC for Chinese text with a custom Perpetua serif for Latin headings. The layout is fully responsive using Tailwind CSS v4 breakpoints, with CSS custom properties managing key spacing values.
