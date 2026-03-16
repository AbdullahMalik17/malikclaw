---
name: android-remote
description: "Remote control and automation for Android devices. Best for testing apps, monitoring notifications, and performing tasks on old phones."
metadata: {"malikclaw":{"emoji":"📱","requires":{"tools":["android_control"]}}}
---

# Android Remote 🦅

Control and automate Android devices via ADB. This skill gives MalikClaw "hands" to interact with mobile apps and notifications.

## When to use (trigger phrases)

Use this skill when the user asks for:
- "Check notifications on my Android phone"
- "Open [App Name] and take a screenshot"
- "Tap the 'Connect' button in the center of the screen"
- "Type '[Text]' into the search bar of [App]"

## Tools
- **android_control**: A unified tool for ADB operations (screenshot, tap, type, swipe, open-url).

## Core Workflow

1. **Visualize**: Use `android_control` with `action="screenshot"` to see the current screen.
2. **Analyze**: Identify the elements on the screen (coordinates or visual cues).
3. **Act**: Use `android_control` to `tap`, `type`, or `swipe` to complete the task.

## Examples

### Check WhatsApp Notifications
```bash
# Capture the notification shade
android_control --action swipe --x1 500 --y1 0 --x2 500 --y2 1000
android_control --action screenshot
```

### Open a Website in Chrome
```bash
# Open URL directly
android_control --action open-url --text "https://malikclaw.vercel.app"
```

### Complex Navigation (Tap and Type)
```bash
# Tap search bar (assuming coords from prev screenshot)
android_control --action tap --x 200 --y 400

# Type search query
android_control --action type --text "MalikClaw the Edge Champion"
```

## Security & Privacy
- Always confirm with the user before performing high-impact actions (e.g., deleting data, sending personal messages).
- **Masking**: Be mindful of sensitive info (passwords, PII) visible in screenshots.
