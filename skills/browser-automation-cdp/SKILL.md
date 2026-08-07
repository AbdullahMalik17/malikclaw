---
name: browser-automation-cdp
description: Headless browser automation via Chrome DevTools Protocol (CDP) for dynamic web scraping, UI interaction, and screenshotting.
version: 2.0.0
author: AbdullahMalik17
tags: [browser, cdp, automation, web, scraping]
---

# 🌐 Browser Automation via CDP Skill

Use this skill for interacting with dynamic JavaScript-rendered single-page apps (SPAs), taking screenshots, and extracting structured web data.

## Key Capabilities

- **DOM Navigation & Execution**: Execute JS scripts inside the browser context.
- **Visual Capture**: Take full-page screenshots or element clips.
- **Form Automation**: Click elements, input form text, handle file uploads.
- **Network Inspection**: Monitor HTTP headers, API calls, and performance metrics.

## Example Tool Usage

```json
{
  "url": "https://news.ycombinator.com",
  "action": "screenshot",
  "wait_selector": ".titleline"
}
```
