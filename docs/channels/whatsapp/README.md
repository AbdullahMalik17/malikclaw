# WhatsApp Channel Configuration Guide 📱

MalikClaw supports WhatsApp through two main methods: **Native (via `whatsmeow`)** and **Bridge (via external WebSocket bridge)**.

## 1. Native WhatsApp (Recommended)

Native mode runs directly within the MalikClaw process using the [whatsmeow](https://github.com/tulir/whatsmeow) library. This is the simplest way to connect but requires a specific build tag.

### Build with Native Support
To use native WhatsApp, you must build MalikClaw with the `whatsapp_native` tag:
```bash
make build-whatsapp-native
# or
go build -tags whatsapp_native ./cmd/malikclaw/...
```

### Configuration
Update your `config.json`:
```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "use_native": true,
      "session_store_path": "",
      "allow_from": []
    }
  }
}
```
- `use_native`: Set to `true`.
- `session_store_path`: If empty, it defaults to `<workspace>/whatsapp/`.
- `allow_from`: Add WhatsApp IDs (e.g., `923XXXXXXXXX@s.whatsapp.net`) to restrict access.

### First Run & Pairing
1. Run `malikclaw gateway`.
2. A QR code will be printed in your terminal.
3. Open WhatsApp on your phone -> **Linked Devices** -> **Link a Device**.
4. Scan the QR code.
5. Your session will be saved locally for future use.

---

## 2. WhatsApp Bridge

Bridge mode allows you to connect MalikClaw to an external WhatsApp WebSocket bridge. This is useful for containerized environments or if you want to keep your MalikClaw binary smaller.

### Configuration
Update your `config.json`:
```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "use_native": false,
      "bridge_url": "ws://your-bridge-url:3001",
      "allow_from": []
    }
  }
}
```
- `use_native`: Set to `false`.
- `bridge_url`: The WebSocket URL of your WhatsApp bridge.

---

## 💬 Usage

Once connected, you can talk to MalikClaw just like any other WhatsApp contact.
- **Private Chat**: MalikClaw responds directly.
- **Groups**: Use the `@malikclaw` mention or prefix if configured.

## ⚠️ Security Notice

- WhatsApp sessions are stored as SQLite databases in your workspace. Keep these files secure.
- Use `allow_from` to ensure only authorized users can interact with your AI assistant.
