package dingtalk

import (
	"github.com/sipeed/malikclaw/pkg/bus"
	"github.com/sipeed/malikclaw/pkg/channels"
	"github.com/sipeed/malikclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("dingtalk", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewDingTalkChannel(cfg.Channels.DingTalk, b)
	})
}
