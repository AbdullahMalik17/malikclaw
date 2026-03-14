# میٹرکس (Matrix) چینل کنفیگریشن گائیڈ

## 1. کنفیگریشن کی مثال

`config.json` میں شامل کریں:

```json
{
  "channels": {
    "matrix": {
      "enabled": true,
      "homeserver": "https://matrix.org",
      "user_id": "@your-bot:matrix.org",
      "access_token": "YOUR_MATRIX_ACCESS_TOKEN",
      "device_id": "",
      "join_on_invite": true,
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "placeholder": {
        "enabled": true,
        "text": "Thinking... 💭"
      },
      "reasoning_channel_id": ""
    }
  }
}
```

## 2. پیرامیٹرز کی تفصیل

| فیلڈ | قسم | لازمی | تفصیل |
|----------------------|----------|------|------|
| enabled | bool | ہاں | کیا میٹرکس چینل کو فعال کرنا ہے |
| homeserver | string | ہاں | میٹرکس سرور کا پتہ (مثلاً `https://matrix.org`) |
| user_id | string | ہاں | بوٹ کا میٹرکس یوزر آئی ڈی (مثلاً `@bot:matrix.org`) |
| access_token | string | ہاں | بوٹ کا ایکسیس ٹوکن |
| device_id | string | نہیں | ڈیوائس آئی ڈی (اختیاری) |
| join_on_invite | bool | نہیں | کیا دعوت ملنے پر خود بخود روم میں شامل ہونا ہے |
| allow_from | []string | نہیں | وائٹ لسٹ صارفین (میٹرکس یوزر آئی ڈی) |
| group_trigger | object | نہیں | گروپ چیٹ ٹرگر پالیسی (`mention_only` / `prefixes` کو سپورٹ کرتا ہے) |
| placeholder | object | نہیں | پلیس ہولڈر میسج کنفیگریشن |
| reasoning_channel_id | string | نہیں | سوچنے کے عمل (reasoning chain) کا آؤٹ پٹ چینل |

## 3. موجودہ سپورٹ

- ٹیکسٹ پیغامات بھیجنا اور وصول کرنا
- ان باؤنڈ امیج/آڈیو/ویڈیو/فائل پیغامات ڈاؤن لوڈ کرنا (MediaStore یا مقامی پاتھ پر محفوظ کرنا)
- آڈیو پیغامات کو موجودہ ٹرانسکرپشن کے عمل میں بھیجنا (`[audio: ...]` ٹیگ کے ذریعے)
- آؤٹ باؤنڈ امیج/آڈیو/ویڈیو/فائل پیغامات بھیجنا (میٹرکس میڈیا لائبریری میں اپ لوڈ کرنے کے بعد)
- گروپ چیٹ ٹرگر رولز (صرف @ تذکرے پر جواب دینے کی سپورٹ)
- ٹائپنگ سٹیٹس (`m.typing`)
- پلیس ہولڈر میسج (`Thinking... 💭`) + حتمی جواب سے تبدیلی
- دعوت ملنے پر خود بخود شامل ہونا (اسے بند کیا جا سکتا ہے)

## 4. آئندہ کے کام (TODO)

- بھرپور میڈیا کی تفصیلات میں اضافہ (مثلاً تصویر/ویڈیو کا سائز، تھمب نیل وغیرہ)
