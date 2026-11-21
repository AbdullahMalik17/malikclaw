---
name: morning-briefing
description: "Daily morning briefing combining weather, Google Calendar events, unread Gmail summary, and scheduled cron delivery in English or Urdu."
metadata: {"malikclaw":{"emoji":"☀️","requires":{"tools":["calendar","gmail","cron","web_fetch"]}}}
---

# Morning Briefing ☀️

Deliver a concise, friendly daily briefing covering weather, today's schedule, and important unread emails—in English, Urdu, or Roman Urdu.

## When to use

Use this skill when the user asks for:
- "Give me my morning briefing" / "Aaj ka morning briefing do" / "صبح کی بریفنگ بتاؤ"
- "Set up a daily 8 AM briefing" / "Roz subah 8 baje summary bhejna"

## Workflow

1. **Weather**: Check local weather (using `weather` skill / `web_fetch` for user's city from `USER.md`).
2. **Today's Calendar**: Call `calendar` with `{"operation": "list_events", "max_results": 10}` (gracefully skip if Google Calendar is not authenticated yet).
3. **Unread Emails**: Call `gmail` with `{"operation": "list_unread", "max_results": 5}` (gracefully skip if Gmail is not authenticated yet).
4. **Format & Deliver**: Present a clean 5-bullet summary matching the user's preferred language (English, Urdu, or Roman Urdu).
5. **Schedule Daily (if requested)**: Use `cron` tool:
   ```json
   {
     "action": "add",
     "cron_expr": "0 8 * * *",
     "message": "Run my morning briefing: check weather, today's calendar events, and top unread emails.",
     "deliver": false
   }
   ```
