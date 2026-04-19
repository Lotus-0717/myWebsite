---
title: "ReFocus devlog (2)"
description: "Help me regain my focus."
descriptionZh: "我用 Chrome 擴充功能追蹤自己浪費在社群媒體上的時間，試著把專注力找回來。"
pubDate: 2026-04-19
category: "Dev"
tags: ["ReFocus", "extension"]
draft: false
---

Last week, I released the first version. I introduced it to my friend, and we found some bugs related to the cooldowm time and a few other issues. However, I've been too busy recently to optimize it. Until yesterday, when a hot topic appeared online -- Anthropic released a design tool called _Claude Design_.

In the first version, I didn't intentionally design the UI. I let Claude Code handle the MVP, and I planned to redesign it later. Yesterday, I tried using Claude Design to improve ReFocus's UI, and the results were better than expected. It completed the full design -- from the logo to the interface -- in just a few minutes.

We redesigned the whole theme. Now the theme follows the system settings to show a dark theme or light theme.
We also adjusted all the information's layout, and the whole extension looks much more premium.

However, I wasn't satisfied with the ring chart that Claude Design gave me for the topbar. I didn't understand this way of displaying the data. But I realized that I forgot about it after submmiting.
In addtion, I added i18n into this extension, so it now follows the borwser's settings to show an English or Traditional Chinese UI.

In short, this was the first major update!
