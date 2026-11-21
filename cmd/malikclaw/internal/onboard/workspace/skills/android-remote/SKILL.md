---
name: android-remote
description: "Remote control and automation for Android devices via ADB using android_control (screenshot, tap, type, swipe, keyevent)."
metadata: {"malikclaw":{"emoji":"📱","requires":{"tools":["android_control"]}}}
---

# Android Remote 🦅

Control and automate Android devices via ADB using the `android_control` tool.

## When to use (trigger phrases)

Use this skill when the user asks for:
- "Check notifications on my Android phone"
- "Take a screenshot of my phone"
- "Tap on [element] or type '[Text]' on my Android device"
- "Swipe down or press HOME/BACK on Android"

## Tool Schema (`android_control`)

- `operation` (required): `"screenshot"`, `"tap"`, `"type"`, `"swipe"`, `"keyevent"`
- `serial` (optional): Android device serial if multiple devices are attached
- `x`, `y` (integers): Screen coordinates for `"tap"` and start coordinates for `"swipe"`
- `x2`, `y2` (integers): End coordinates for `"swipe"`
- `text` (string): Text input for `"type"`
- `key` (string): Key event code for `"keyevent"` (e.g. `"HOME"`, `"BACK"`, `"ENTER"`)

## Core Workflow

1. **Visualize**: Call `android_control` with `{"operation": "screenshot"}` to inspect the screen.
2. **Navigate / Interact**: Call `tap`, `swipe`, `type`, or `keyevent` with exact coordinates or text.
3. **Verify**: Take another `screenshot` to confirm the action succeeded.

## Examples

### Check Notifications
```json
{"operation": "swipe", "x": 500, "y": 20, "x2": 500, "y2": 1000}
```
```json
{"operation": "screenshot"}
```

### Tap & Type in Search Bar
```json
{"operation": "tap", "x": 200, "y": 400}
```
```json
{"operation": "type", "text": "MalikClaw Assistant"}
```

### Press Home or Back
```json
{"operation": "keyevent", "key": "HOME"}
```

## Security & Privacy
- Always confirm with the user before sending messages, making payments, or deleting data on their phone.
- Be careful not to expose passwords or OTP codes from screenshots.
