---
name: android-adb-control
description: Direct control of Android physical devices and Termux environments via Android Debug Bridge (ADB).
version: 2.0.0
author: AbdullahMalik17
tags: [android, adb, mobile, termux, edge]
---

# 📱 Android ADB & Termux Control Skill

Use this skill to automate mobile interactions on connected Android devices or edge SBCs running Termux.

## Supported Commands

- **Touch & Gesture**: `tap <x> <y>`, `swipe <x1> <y1> <x2> <y2>`
- **Text Entry**: `type <text>`
- **UI Dump**: Inspect view trees and hierarchy using `uiautomator dump`
- **Application Control**: Start/stop packages, grant permissions, launch activities
- **Screen Capture**: Take screenshots and record screen sessions

## Usage Pattern

Always run UI dump first to resolve coordinate targets:
```bash
adb shell uiautomator dump /sdcard/window_dump.xml
adb pull /sdcard/window_dump.xml
```
