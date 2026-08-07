# Troubleshooting Guide 🛠️

If you encounter issues while setting up or running MalikClaw, use this reference guide to troubleshoot common problems.

---

## 🔐 Authentication & Model Credentials

### AntiGravity: "Missing required parameter: client_id"

This occurs when Google OAuth credentials are not detected.

- **Resolution**: Run `malikclaw auth login --provider google-antigravity` to generate credentials.
- **Environment Override**: Alternatively, export `MALIKCLAW_ANTIGRAVITY_CLIENT_ID` and `MALIKCLAW_ANTIGRAVITY_CLIENT_SECRET`.

### OpenRouter: "free is not a valid model ID"

- **Cause**: Using shorthand model aliases instead of full OpenRouter identifiers.
- **Resolution**: In `~/.malikclaw/config.json`, set `"model": "openrouter/auto"` or `"model": "google/gemini-2.0-flash-exp:free"`.

### "model ... not found in model_list"

The default model specified under `agents.defaults.model` does not match any entry in your `model_list`.

- **Resolution**: Open `~/.malikclaw/config.json` and ensure the `model_name` string matches the identifier defined in `model_list`.

---

## 🌐 Gateway & Web UI

### Port 18790 Already in Use

If the gateway server fails to start because port 18790 is occupied:

- **Resolution**: Specify a custom port when launching the gateway:
  ```bash
  malikclaw gateway --port 18791
  ```

---

## 📱 Mobile & Omnichannel Support

### Telegram / Discord Bot Not Responding

1. **Tokens**: Verify `BOT_TOKEN` in `config.json`.
2. **Access Control**: Confirm your account ID is listed under `allow_from` in channel settings.
3. **Group Privacy**: Disable "Group Privacy" via `@BotFather` on Telegram if group message monitoring is desired.

### WhatsApp Pairing Timeout

- If QR scanning fails or disconnects, clear existing session tokens:
  ```bash
  rm -rf ~/.malikclaw/whatsapp_session
  malikclaw gateway --channels whatsapp
  ```

---

## 🆘 Additional Support

- **Debug Mode**: Run `malikclaw agent --debug` for verbose execution logs.
- **GitHub Issues**: Search reported topics on [GitHub Issues](https://github.com/AbdullahMalik17/malikclaw/issues).
- **Discussions**: Connect with the community on [GitHub Discussions](https://github.com/AbdullahMalik17/malikclaw/discussions).


