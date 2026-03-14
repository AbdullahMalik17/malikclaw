# کاروباری وی چیٹ (WeCom) خود سے تیار کردہ ایپلیکیشن

کاروباری وی چیٹ (WeCom) خود سے تیار کردہ ایپلیکیشن سے مراد وہ ایپس ہیں جو کسی کمپنی کی طرف سے کاروباری وی چیٹ کے اندر بنائی جاتی ہیں، جو بنیادی طور پر کمپنی کے اندرونی استعمال کے لیے ہوتی ہیں۔ ان ایپس کے ذریعے، کمپنیاں ملازمین کے ساتھ موثر مواصلت اور تعاون حاصل کر سکتی ہیں اور کام کی کارکردگی کو بہتر بنا سکتی ہیں۔

## کنفیگریشن

```json
{
  "channels": {
    "wecom_app": {
      "enabled": true,
      "corp_id": "wwxxxxxxxxxxxxxxxx",
      "corp_secret": "YOUR_CORP_SECRET",
      "agent_id": 1000002,
      "token": "YOUR_TOKEN",
      "encoding_aes_key": "YOUR_ENCODING_AES_KEY",
      "webhook_path": "/webhook/wecom-app",
      "allow_from": [],
      "reply_timeout": 5
    }
  }
}
```

| فیلڈ             | قسم   | لازمی | تفصیل                                     |
| ---------------- | ------ | ---- | ---------------------------------------- |
| corp_id          | string | ہاں   | کمپنی ID                                  |
| corp_secret      | string | ہاں   | ایپلیکیشن کی خفیہ کلید (Secret)                             |
| agent_id         | int    | ہاں   | ایپلیکیشن ایجنٹ ID                          |
| token            | string | ہاں   | کال بیک کی تصدیق کا ٹوکن                             |
| encoding_aes_key | string | ہاں   | 43 حروف پر مشتمل AES کلید                         |
| webhook_path     | string | نہیں   | Webhook کا راستہ (ڈیفالٹ: /webhook/wecom-app) |
| allow_from       | array  | نہیں   | صارف ID کی سفید فہرست                           |
| reply_timeout    | int    | نہیں   | جواب کا ٹائم آؤٹ (سیکنڈز میں)                       |

## سیٹ اپ کا طریقہ کار

1. [کاروباری وی چیٹ مینجمنٹ کنسول](https://work.weixin.qq.com/) میں لاگ ان کریں۔
2. "ایپ مینجمنٹ" (Application Management) -> "ایپ بنائیں" (Create Application) پر جائیں۔
3. کمپنی ID (CorpID) اور ایپ Secret حاصل کریں۔
4. ایپ سیٹنگز میں "پیغامات وصول کریں" (Receive Messages) کو کنفیگر کریں اور Token اور EncodingAESKey حاصل کریں۔
5. کال بیک URL کو `http://<your-server-ip>:<port>/webhook/wecom-app` پر سیٹ کریں۔
6. CorpID، Secret، AgentID وغیرہ جیسی معلومات کنفیگریشن فائل میں درج کریں۔

   نوٹ: MalikClaw اب تمام چینلز کے ویب ہک کال بیکس وصول کرنے کے لیے ایک مشترکہ Gateway HTTP سرور استعمال کرتا ہے، جو ڈیفالٹ طور پر 127.0.0.1:18790 پر سنتا ہے۔ اگر آپ پبلک نیٹ ورک سے کال بیکس وصول کرنا چاہتے ہیں، تو براہ کرم بیرونی ڈومین کو گیٹ وے (ڈیفالٹ پورٹ 18790) پر ریورس پراکسی کریں۔
