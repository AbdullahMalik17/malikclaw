# Troubleshooting Guide 🛠️

If you're encountering issues with MalikClaw, check this list of common problems and their solutions.

---

## 🔐 Authentication & Connectivity

### AntiGravity: "Missing required parameter: client_id"

This error occurs when the backend is missing the Google OAuth client credentials.

- **Solution**: Restart the MalikClaw backend. The latest version includes built-in fallback credentials.
- **Advanced**: You can manually set `MALIKCLAW_ANTIGRAVITY_CLIENT_ID` and `MALIKCLAW_ANTIGRAVITY_CLIENT_SECRET` in your environment variables.

### OpenAI: "unknown_error" during Login

This usually indicates a **Redirect URI mismatch** or an expired session.

- **Solution**: 
  1. Ensure you are using the latest version of MalikClaw.
  2. Clear your browser cookies for the MalikClaw dashboard.
  3. Try logging out and logging back in from the Settings/Credentials page.
- **Note**: If using standard API keys, ensure `auth_method` is **NOT** set to "oauth" in your `config.json`.

### OpenRouter: "free is not a valid model ID"

**Cause**: You are using a shorthand for the model name.

- **Wrong**: `"model": "free"`
- **Right**: `"model": "openrouter/free"` (or specific models like `google/gemini-2.0-flash-exp:free`).

---

## ⚙️ Configuration Issues

### "model ... not found in model_list"

The model you've selected as default in `agents.defaults.model` does not exist in your `model_list` array.

- **Fix**: Open `~/.malikclaw/config.json` and ensure the `model_name` in your list exactly matches the default model name.

### Port 18800 Already in Use

If the Web Launcher fails to start, another process might be using the port.

- **Solution**: Run `malikclaw launcher -port 18801` to start on a different port.

---

## 💬 Channel Problems

### Telegram Bot Not Responding

1. **Token**: Verify your `BOT_TOKEN` is correct.
2. **Allow List**: Ensure your Telegram User ID is in the `allow_from` list.
3. **Privacy**: Ensure "Group Privacy" is disabled in @BotFather if you want the bot to see all messages in groups.

### WhatsApp Pairing Fails

- **Bridge**: If not using native mode, ensure the WhatsApp bridge server is running.
- **Session**: If pairing fails repeatedly, delete the `session_store_path` folder and try scanning the QR code again.

---

## 🆘 Still Need Help?

- **Logs**: Run `malikclaw agent --debug` to see detailed execution logs.
- **GitHub**: Search through [Existing Issues](https://github.com/AbdullahMalik17/malikclaw/issues).
- **Discord**: Join our community for real-time support.

