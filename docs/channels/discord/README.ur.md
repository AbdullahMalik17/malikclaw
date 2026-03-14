# Discord

ڈسکارڈ (Discord) ایک مفت صوتی، ویڈیو اور ٹیکسٹ چیٹ ایپلی کیشن ہے جو خاص طور پر کمیونٹیز کے لیے ڈیزائن کی گئی ہے۔ MalikClaw ڈسکارڈ بوٹ API کے ذریعے ڈسکارڈ سرورز سے جڑتا ہے، اور پیغامات وصول کرنے اور بھیجنے کو سپورٹ کرتا ہے۔

## کنفیگریشن

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "token": "YOUR_BOT_TOKEN",
      "allow_from": ["YOUR_USER_ID"],
      "group_trigger": {
        "mention_only": false
      }
    }
  }
}
```

| فیلڈ | قسم | لازمی | تفصیل |
| ------------ | ------ | ---- | -------------------------------- |
| enabled | bool | ہاں | کیا ڈسکارڈ چینل کو فعال کرنا ہے |
| token | string | ہاں | ڈسکارڈ بوٹ ٹوکن |
| allow_from | array | نہیں | یوزر آئی ڈی کی وائٹ لسٹ، خالی کا مطلب ہے تمام صارفین کی اجازت ہے |
| group_trigger | object | نہیں | گروپ ٹرگر سیٹنگز (مثال: { "mention_only": false }) |

## ترتیب کا عمل

1. ایک نئی ایپلی کیشن بنانے کے لیے [Discord Developer Portal](https://discord.com/developers/applications) پر جائیں
2. انٹینٹس (Intents) کو فعال کریں:
   - Message Content Intent
   - Server Members Intent
3. بوٹ ٹوکن حاصل کریں
4. بوٹ ٹوکن کو کنفیگریشن فائل میں درج کریں
5. بوٹ کو سرور میں مدعو کریں اور ضروری اجازتیں دیں (مثلاً پیغامات بھیجنا، پیغام کی ہسٹری پڑھنا وغیرہ)
