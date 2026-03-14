# MalikClaw چینل سسٹم: مکمل ڈویلپمنٹ گائیڈ

> **متاثرہ حصہ**: `pkg/channels/`, `pkg/bus/`, `pkg/media/`, `pkg/identity/`, `cmd/malikclaw/internal/gateway/`

---

## فہرستِ مضامین

- [پہلا حصہ: آرکیٹیکچر کا جائزہ](#پہلا-حصہ-آرکیٹیکچر-کا-جائزہ)
- [دوسرا حصہ: مائیگریشن گائیڈ—مین برانچ سے ری فیکٹر برانچ تک](#دوسرا-حصہ-مائیگریشن-گائیڈ-مین-برانچ-سے-ری-فیکٹر-برانچ-تک)
- [تیسرا حصہ: نیا چینل ڈویلپمنٹ گائیڈ—صفر سے ایک نیا چینل بنانا](#تیسرا-حصہ-نیا-چینل-ڈویلپمنٹ-گائیڈ-صفر-سے-ایک-نیا-چینل-بنانا)
- [چوتھا حصہ: بنیادی ذیلی سسٹمز کی تفصیل](#چوتھا-حصہ-بنیادی-ذیلی-سسٹمز-کی-تفصیل)
- [پانچواں حصہ: اہم ڈیزائن فیصلے اور معاہدے](#پانچواں-حصہ-اہم-ڈیزائن-فیصلے-اور-معاہدے)
- [ضمیمہ: فائلوں کی مکمل فہرست اور انٹرفیس حوالہ ٹیبل](#ضمیمہ-فائلوں-کی-مکمل-فہرست-اور-انٹرفیس-حوالہ-ٹیبل)

---

## پہلا حصہ: آرکیٹیکچر کا جائزہ

### 1.1 ری فیکٹرنگ سے پہلے اور بعد کا موازنہ

**ری فیکٹرنگ سے پہلے (main برانچ)**:

```
pkg/channels/
├── telegram.go          # ہر چینل براہ راست channels پیکیج میں ہے
├── discord.go
├── slack.go
├── manager.go           # Manager براہ راست چینل کی اقسام کا حوالہ دیتا ہے
├── ...
```

- چینل کی تمام امپلیمنٹیشنز `pkg/channels/` پیکیج کی ٹاپ لیول پر ہیں۔
- Manager `switch` یا `if-else` کے ذریعے براہ راست چینلز بناتا ہے۔
- Peer، MessageID جیسی روٹنگ معلومات `Metadata map[string]string` میں چھپی ہوئی ہیں۔
- پیغامات بھیجنے کے لیے کوئی ریٹ لمیٹ (rate limit) یا دوبارہ کوشش (retry) کا نظام نہیں ہے۔
- میڈیا فائلوں کی لائف سائیکل کا کوئی متحدہ انتظام نہیں ہے۔
- ہر چینل اپنا الگ HTTP سرور شروع کرتا ہے۔
- گروپ چیٹ فلٹرنگ کی منطق مختلف چینلز میں بکھری ہوئی ہے۔

**ری فیکٹرنگ کے بعد (refactor/channel-system برانچ)**:

```
pkg/channels/
├── base.go              # BaseChannel مشترکہ تجریدی تہہ (abstraction layer)
├── interfaces.go        # اختیاری صلاحیتوں کے انٹرفیس (TypingCapable, MessageEditor, ReactionCapable, PlaceholderCapable, PlaceholderRecorder)
├── README.md            # انگریزی دستاویزات
├── README.zh.md         # چینی دستاویزات
├── media.go             # MediaSender اختیاری انٹرفیس
├── webhook.go           # WebhookHandler, HealthChecker اختیاری انٹرفیس
├── errors.go            # غلطی کے اشارے (ErrNotRunning, ErrRateLimit, ErrTemporary, ErrSendFailed)
├── errutil.go           # غلطیوں کی درجہ بندی کے افعال
├── registry.go          # فیکٹری رجسٹری (RegisterFactory / getFactory)
├── manager.go           # متحدہ انتظام: ورکر قطار، ریٹ لمیٹ، ریٹری، Typing/Placeholder، مشترکہ HTTP
├── split.go             # طویل پیغامات کی ذہین تقسیم
├── telegram/            # ہر چینل کے لیے الگ ذیلی پیکیج
│   ├── init.go          # فیکٹری رجسٹریشن
│   ├── telegram.go      # امپلیمنٹیشن
│   └── telegram_commands.go
├── discord/
│   ├── init.go
│   └── discord.go
├── slack/ line/ onebot/ dingtalk/ feishu/ wecom/ qq/ whatsapp/ whatsapp_native/ maixcam/ pico/
│   └── ...

pkg/bus/
├── bus.go               # MessageBus (بفر 64، محفوظ بندش)
├── types.go             # ساختی پیغامات کی اقسام (Peer, SenderInfo, MediaPart, InboundMessage, OutboundMessage, OutboundMediaMessage)

pkg/media/
├── store.go             # MediaStore انٹرفیس + FileMediaStore امپلیمنٹیشن (TTL صفائی)

pkg/identity/
├── identity.go          # متحدہ صارف شناخت: "platform:id" فارمیٹ
```

### 1.2 پیغام کے بہاؤ کا نقشہ

```
┌────────────┐      InboundMessage       ┌───────────┐      LLM + Tools      ┌────────────┐
│  Telegram   │──┐                        │           │                        │            │
│  Discord    │──┤   PublishInbound()     │           │   PublishOutbound()   │            │
│  Slack      │──┼──────────────────────▶ │ MessageBus │ ◀─────────────────── │ AgentLoop  │
│  LINE       │──┤   (buffered chan, 64)  │           │   (buffered chan, 64) │            │
│  ...        │──┘                        │           │                        │            │
└────────────┘                            └─────┬─────┘                        └────────────┘
                                                │
                            SubscribeOutbound() │  SubscribeOutboundMedia()
                                                ▼
                                    ┌───────────────────┐
                                    │   Manager          │
                                    │   ├── dispatchOutbound()    ورکر قطار تک روٹنگ
                                    │   ├── dispatchOutboundMedia()
                                    │   ├── runWorker()           پیغام کی تقسیم + دوبارہ کوشش
                                    │   ├── runMediaWorker()      میڈیا بھیجنا + دوبارہ کوشش
                                    │   ├── preSend()             Typing روکنا + Reaction ہٹانا + Placeholder ترمیم
                                    │   └── runTTLJanitor()       پرانی اشیاء کی صفائی
                                    └────────┬──────────┘
                                             │
                                   channel.Send() / SendMedia()
                                             │
                                             ▼
                                    ┌────────────────┐
                                    │ مختلف پلیٹ فارم API  │
                                    └────────────────┘
```

### 1.3 بنیادی ڈیزائن کے اصول

| اصول | وضاحت |
|------|------|
| **ذیلی پیکیج علیحدگی** | ہر چینل کا ایک آزاد Go ذیلی پیکیج ہے، جو `channels` پیکیج کے فراہم کردہ `BaseChannel` اور انٹرفیس پر انحصار کرتا ہے۔ |
| **فیکٹری رجسٹریشن** | ہر ذیلی پیکیج `init()` کے ذریعے خود کو رجسٹر کرتا ہے، Manager نام کے ذریعے فیکٹری تلاش کرتا ہے۔ |
| **صلاحیتوں کی دریافت** | اختیاری صلاحیتوں کا اعلان انٹرفیس کے ذریعے کیا جاتا ہے، Manager رن ٹائم پر انہیں تلاش کرتا ہے۔ |
| **ساختی پیغامات** | Peer، MessageID اور SenderInfo کو Metadata سے نکال کر InboundMessage کے مستقل فیلڈز بنا دیا گیا ہے۔ |
| **غلطیوں کی درجہ بندی** | چینل مخصوص غلطیاں واپس کرتا ہے، جس کی بنیاد پر Manager دوبارہ کوشش کی حکمت عملی طے کرتا ہے۔ |
| **مرکزی انتظام** | ریٹ لمیٹ، پیغام کی تقسیم، دوبارہ کوشش اور دیگر تمام امور کا انتظام Manager اور BaseChannel متحدہ طور پر کرتے ہیں۔ |

---

## دوسرا حصہ: مائیگریشن گائیڈ—مین برانچ سے ری فیکٹر برانچ تک

### 2.1 اگر آپ کے پاس چینل کی ترامیم موجود ہیں

#### مرحلہ 1: فائلز کی تصدیق کریں

مین برانچ پر چینل فائلز `pkg/channels/` کی ٹاپ لیول پر تھیں، جیسے:
- `pkg/channels/telegram.go`

ری فیکٹرنگ کے بعد یہ فائلز ختم کر دی گئی ہیں اور کوڈ متعلقہ ذیلی پیکیج میں منتقل ہو گیا ہے:
- `pkg/channels/telegram/telegram.go`

#### مرحلہ 2: ساختی تبدیلیوں کو سمجھیں

| مین برانچ فائل | ری فیکٹر برانچ مقام | تبدیلی |
|---|---|---|
| `pkg/channels/telegram.go` | `pkg/channels/telegram/telegram.go` + `init.go` | پیکیج کا نام `channels` سے بدل کر `telegram` ہو گیا |
| `pkg/channels/manager.go` | `pkg/channels/manager.go` | بڑے پیمانے پر دوبارہ لکھا گیا |
| _(موجود نہیں تھی)_ | `pkg/channels/base.go` | نئی مشترکہ تجریدی تہہ شامل کی گئی |
| _(موجود نہیں تھی)_ | `pkg/channels/registry.go` | نئی فیکٹری رجسٹری شامل کی گئی |
| _(موجود نہیں تھی)_ | `pkg/channels/errors.go` | غلطیوں کی درجہ بندی کا نظام شامل کیا گیا |

#### مرحلہ 3: اپنے چینل کوڈ کو منتقل کریں

**3a. پیکیج کا اعلان اور امپورٹ**

```go
// نیا کوڈ
package telegram

import (
    "github.com/sipeed/malikclaw/pkg/bus"
    "github.com/sipeed/malikclaw/pkg/channels"     // پیرنٹ پیکیج کا حوالہ
    "github.com/sipeed/malikclaw/pkg/config"
    "github.com/sipeed/malikclaw/pkg/identity"
)
```

**3b. BaseChannel کا استعمال**

```go
// نیا کوڈ: BaseChannel کو شامل کریں
type TelegramChannel struct {
    *channels.BaseChannel
    bot    *telego.Bot
    config *config.Config
}
```

**3c. کنسٹرکٹر (Constructor)**

```go
// نیا کوڈ: NewBaseChannel کا استعمال کریں
func NewTelegramChannel(cfg *config.Config, bus *bus.MessageBus) (*TelegramChannel, error) {
    base := channels.NewBaseChannel(
        "telegram",
        cfg.Channels.Telegram,
        bus,
        cfg.Channels.Telegram.AllowFrom,
        channels.WithMaxMessageLength(4096),
    )
    return &TelegramChannel{
        BaseChannel: base,
        bot:         bot,
        config:      cfg,
    }, nil
}
```

**3d. Send میتھڈ اور غلطیوں کی واپسی**

```go
// نیا کوڈ: مینیجر کو دوبارہ کوشش کی حکمت عملی بتانے کے لیے مخصوص غلطیاں واپس کریں
func (c *TelegramChannel) Send(ctx context.Context, msg bus.OutboundMessage) error {
    if !c.IsRunning() {
        return channels.ErrNotRunning
    }
    // ...
    if err != nil {
        return channels.ClassifySendError(statusCode, err)
    }
    return nil
}
```

**3e. فیکٹری رجسٹریشن شامل کریں (ضروری)**

اپنے چینل کے لیے `init.go` بنائیں:

```go
// pkg/channels/telegram/init.go
package telegram

func init() {
    channels.RegisterFactory("telegram", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
        return NewTelegramChannel(cfg, b)
    })
}
```

---

## تیرا حصہ: نیا چینل ڈویلپمنٹ گائیڈ

اگر آپ ایک نیا پلیٹ فارم (مثلاً `matrix`) شامل کرنا چاہتے ہیں تو آپ کو درج ذیل کام کرنے ہوں گے:

1. ✅ ذیلی پیکیج ڈائرکٹری `pkg/channels/matrix/` بنائیں۔
2. ✅ `init.go` بنائیں — فیکٹری رجسٹریشن کے لیے۔
3. ✅ `matrix.go` بنائیں — چینل کی امپلیمنٹیشن کے لیے۔
4. ✅ Gateway کے مددگاروں (helpers) میں خالی امپورٹ (blank import) شامل کریں۔
5. ✅ `pkg/config/` میں کنفیگریشن اسٹرکچر شامل کریں۔

### مثال: `matrix.go` کا خاکہ

```go
package matrix

type MatrixChannel struct {
    *channels.BaseChannel
    config *config.Config
}

func (c *MatrixChannel) Start(ctx context.Context) error {
    c.SetRunning(true)
    return nil
}

func (c *MatrixChannel) Send(ctx context.Context, msg bus.OutboundMessage) error {
    if !c.IsRunning() {
        return channels.ErrNotRunning
    }
    // بھیجنے کی منطق یہاں آئے گی
    return nil
}
```

---

## چوتھا حصہ: بنیادی ذیلی سسٹمز کی تفصیل

### 4.1 MessageBus

یہ سسٹم کا مرکزی حصہ ہے جو پیغامات کو ایجنٹ اور چینلز کے درمیان منتقل کرتا ہے۔ بفر سائز کو بڑھا کر 64 کر دیا گیا ہے تاکہ زیادہ لوڈ کی صورت میں نظام متاثر نہ ہو۔

### 4.2 ساختی پیغامات (Structured Messages)

پیغامات اب زیادہ منظم ہیں۔ Peer (مخاطب)، SenderInfo (بھیجنے والے کی معلومات) اور دیگر اہم معلومات اب براہ راست میسج اسٹرکچر کا حصہ ہیں۔

### 4.3 غلطیوں کی درجہ بندی اور دوبارہ کوشش (Retry)

مینیجر درج ذیل بنیادوں پر دوبارہ کوشش کرتا ہے:
- `ErrRateLimit`: 1 سیکنڈ انتظار کے بعد دوبارہ کوشش۔
- `ErrTemporary`: بتدریج بڑھتے ہوئے وقفے (exponential backoff) کے ساتھ دوبارہ کوشش۔
- `ErrNotRunning` یا `ErrSendFailed`: کوئی دوبارہ کوشش نہیں کی جاتی۔

---

## پانچواں حصہ: اہم ڈیزائن فیصلے اور معاہدے

1. **غلطیوں کی درجہ بندی**: ہر چینل کو چاہیے کہ وہ `Send` میتھڈ میں درست غلطی کا کوڈ واپس کرے تاکہ مینیجر درست فیصلہ کر سکے۔
2. **SetRunning کا استعمال**: چینل کے تیار ہونے پر `SetRunning(true)` اور رکنے پر `SetRunning(false)` لازمی کال کریں۔
3. **میسج کی تقسیم**: چینلز کو خود طویل پیغامات تقسیم کرنے کی ضرورت نہیں، مینیجر یہ کام خود بخود کرتا ہے۔
4. **Typing اور دیگر اشارے**: اگر چینل متعلقہ انٹرفیس کو سپورٹ کرتا ہے، تو BaseChannel ان اشاروں کا انتظام خودکار طور پر کرتا ہے۔

---

## ضمیمہ: فائلوں کی فہرست

- `pkg/channels/base.go`: بنیادی ڈھانچہ۔
- `pkg/channels/manager.go`: تمام چینلز کا مینیجر۔
- `pkg/bus/bus.go`: میسج بس کا نظام۔
- `pkg/media/store.go`: میڈیا فائل اسٹور۔

اگر آپ کو کہیں کوئی چیز غیر ضروری طور پر پیچیدہ لگے تو بلا جھجھک Issue اوپن کر کے بحث کریں!

آپ کے تعاون کا شکریہ!
