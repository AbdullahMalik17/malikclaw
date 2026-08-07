---
name: gmail
description: Send, read, and manage Gmail messages and email attachments automatically.
version: 2.0.0
author: AbdullahMalik17
tags: [email, gmail, google, attachments, built-in]
---

# 📧 Gmail Integration Skill

Use this skill to read incoming messages, send emails, and process email attachments.

## Supported Operations

- **List & Search Messages**: Query inbox using standard Gmail filters (`is:unread`, `from:sender@example.com`).
- **Send Emails**: Compose and deliver plain text or HTML emails with attachments.
- **Draft Creation**: Prepare draft messages for user review prior to sending.

## Usage Example

```json
{
  "action": "send",
  "to": "user@example.com",
  "subject": "System Update Summary",
  "body": "All MalikClaw agent skills have been upgraded to v2.0.0."
}
```
