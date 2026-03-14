package onebot

import (
	"github.com/sipeed/malikclaw/pkg/bus"
	"github.com/sipeed/malikclaw/pkg/channels"
	"github.com/sipeed/malikclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("onebot", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewOneBotChannel(cfg.Channels.OneBot, b)
	})
}
