---
title: "今天買貴了嗎"
description: "A Vite + React app that compares your grocery prices against Taiwan's official wholesale market data, telling you whether you got a good deal."
tech:
  ["React", "Vite", "Tailwind CSS", "Recharts", "Vercel Serverless Functions"]
repo: "https://github.com/Lotus-0717/VeggiePrice"
url: "https://veggie-price.vercel.app/"
featured: true
sortOrder: 1
# cover: /images/portfolio/veggiePrice/cover.png
# images:
#   - /images/portfolio/veggiePrice/preview-1.png
#   - /images/portfolio/veggiePrice/preview-2.png
---

## About This Project

「今天買貴了嗎」solves a small everyday question: when you buy vegetables at the market, is the price you paid actually reasonable? The app pulls real wholesale transaction data from Taiwan's Council of Agriculture (農業部農糧署) Open Data API and converts it into a per-unit comparison, so you can tell at a glance whether your purchase was a bargain, average, or overpriced.

This was a solo personal project, built end-to-end — from API research and pricing-logic design to UI and data visualisation.

### Features

- **Price comparison** — enter what you paid and the quantity; the app converts it to a per-kilogram price and compares it against the wholesale average using a configurable retail markup ratio, then classifies the result as 划算 (good deal) / 普通 (average) / 偏貴 (overpriced)
- **Historical price charts** — visualises recent wholesale price trends alongside the same period last year, powered by Recharts, with your own purchase history overlaid as a separate line
- **Item & variant browsing** — covers a wide range of produce with sub-variant chips (e.g. 高麗菜 → 甘藍-改良種 / 甘藍-初秋), each mapped to the correct API query parameters
- **Purchase log** — records every comparison you make (item, price, quantity, date) in `localStorage`, building a personal price-tracking history over time
- **Favourites & daily cache** — star frequently checked items for quick access; query results are cached per item/market/day to avoid redundant API calls

### Architecture

Built with Vite, React 19, and Tailwind CSS v4 — fully client-side with no database; all user data (purchase logs, cache, favourites) lives in `localStorage`.

The core data flow normalises raw transaction records into time series, separating domestic and imported produce, then computing both an overall average series and per-variant series. A small Vercel serverless function (`api/proxy.js`) proxies requests to the government Open Data endpoint to work around CORS restrictions, with `Cache-Control` headers tuned to the API's known daily update schedule.

Pricing logic is intentionally simple and transparent: a configurable wholesale-to-retail multiplier converts the official average price into an expected retail price, and the ratio between what you paid and that expectation determines the verdict.
