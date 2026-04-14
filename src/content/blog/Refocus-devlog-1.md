---
title: "Refocus devlog (1)"
description: "Help me regain my focus."
descriptionZh: "我用 Chrome 擴充功能追蹤自己浪費在社群媒體上的時間，試著把專注力找回來。"
pubDate: 2026-04-11
category: "Dev"
tags: ["Refocus", "extension"]
draft: false
---

One year ago, I tried overcome my tendency to get distracted. I saw a doctor and took medication. My situation improved, but I still often get distracted by social media while working.

There is no doubt that I am addicted to social media. In the past, I tried to block social media domains or delete those apps from my phone. But connections made it impossible to block them completely.

So, I changed my approach. I don't want to completely block these websites -- I want to remind myself how much time I waste on them.

I designed a Chrome extension that tracks how much time users spend on social media, It shows an overlay and plays a sound to remide them.

In the beginning, I predefined a few social media websites to monitor. When a user's browser tab is active on these domains, the extension starts counting time.

User can define a custom rule with three parameters:

1. a time window (parameter 1).
2. allowed social media usage time within that window (parameter 2).
3. and a reminder interval (parameter 3).

When usage exceeds the configuraed threshold, the extension will trigger reminders at the specified interval.

I used Claude Code to built an MVP last night. During tesing, I found that predefined website domains didn't mactch users's needs. So I added a feature that allows users to customize the domain list.

This extension only exists in my browser right now, and it still under developing. But just right now -- while I was writing this devlog, it helped me get my focus back a few times. I'm really looking forward to releasing it.
