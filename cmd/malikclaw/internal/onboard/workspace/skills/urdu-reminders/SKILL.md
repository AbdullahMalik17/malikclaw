---
name: urdu-reminders
description: "Natural English, Urdu, and Roman Urdu reminder and alarm assistant powered by the cron tool (one-time, interval, and recurring schedules)."
metadata: {"malikclaw":{"emoji":"⏰","requires":{"tools":["cron"]}}}
---

# Urdu & English Daily Reminders ⏰

Turn everyday reminder requests in **English**, **Urdu (اردو)**, or **Roman Urdu** into reliable scheduled jobs using the `cron` tool.

## Supported Natural Requests

- **One-time (`at_seconds`)**:
  - "Remind me in 20 minutes to check the stove"
  - "20 minute baad chai ki yaad dilana"
  - "20 منٹ بعد یاد دلانا"
- **Recurring interval (`every_seconds`)**:
  - "Remind me every 2 hours to drink water"
  - "Har 2 ghante baad paani peene ka reminder lagao"
- **Daily / Weekly (`cron_expr`)**:
  - "Set a daily Fajr reminder at 5:00 AM" -> `cron_expr: "0 5 * * *"`
  - "Roz subah 8 baje dawai lene ki yaad dilana" -> `cron_expr: "0 8 * * *"`
  - "ہر جمعہ کو دوپہر 1 بجے جمعہ کی یاددہانی" -> `cron_expr: "0 13 * * 5"`

## Execution Rules

1. Always call the `cron` tool (`action: "add"`) — never just say "I will remind you".
2. Set `deliver: true` for simple reminder text so it reaches the user's active WhatsApp, Telegram, or CLI channel immediately.
3. Reply in the same language/script the user used (English, Urdu script, or Roman Urdu) confirming the exact schedule.
4. For listing or canceling reminders, use `cron` with `action: "list"`, `"remove"`, `"enable"`, or `"disable"`.
