---
title: "ReFocus"
description: "A Chrome extension that tracks time spent on social media and nudges you to refocus with a rolling-window alert system."
descriptionZh: "Chrome 擴充功能，追蹤社群媒體使用時間，並以滾動視窗演算法在你超標時發出提醒，幫助你重新找回專注。"
tech: ["Chrome Extension", "Manifest V3", "JavaScript", "Web Audio API", "CSS"]
url: "https://chromewebstore.google.com/detail/refocus/obmclnbkajfhbkgmjnclfciipgehpcif"
repo: "https://github.com/Lotus-0717/ReFocus"
featured: true
sortOrder: 1
status: "in-progress"
cover: /images/portfolio/ReFocus/icon.svg
images:
  - /images/portfolio/ReFocus/preview-1.png
  - /images/portfolio/ReFocus/preview-2.png
---

## About This Project

ReFocus is a Chrome extension I built to solve a personal problem: I was spending more time on social media than I intended, and I had no real sense of how much. The extension tracks time on any domain you configure, and alerts you when you exceed a threshold — with a full-screen overlay, a system notification, and an audio chime, all firing in parallel so you can't easily ignore it.

### Features

- **Rolling-window tracking** — thresholds are evaluated against a sliding time window (e.g. "30 minutes in the last 60 minutes"), not a fixed daily reset, so overuse is caught in real time
- **Full-screen overlay** — a Shadow DOM overlay that displays your recent usage stats and a countdown; requires interaction before dismissal
- **Configurable sites** — add any domain; custom labels and colours per site; `twitter.com` is normalised to `x.com` automatically
- **Popup stats** — shows today, yesterday, and 7-day rolling average at a glance, with a live session indicator
- **Options page** — configure tracked sites, alert threshold, observation window, and cooldown period
- **i18n** — UI follows the browser's language setting; Traditional Chinese and English supported
- **System theme** — dark/light mode follows the OS setting

### Architecture

Pure Manifest V3 Chrome Extension — no framework, no build step. The entire logic lives in `background.js` as a Service Worker.

Because Service Workers can be terminated at any time by Chrome, all state is persisted to `chrome.storage.local` rather than in-memory globals. A heartbeat alarm writes a checkpoint every minute as crash protection; `stopTracking()` commits the full `{start, end}` session to `usageStats` when the tab loses focus.

Alert evaluation uses a rolling window: each `checkAlert()` call computes the intersection of stored sessions with the window `[now − N minutes, now]`, summing across all tracked domains. There is no fixed reset point — time simply slides out of the window naturally.

Audio playback runs in a dedicated Offscreen Document, since the Web Audio API is unavailable in a Service Worker context.
