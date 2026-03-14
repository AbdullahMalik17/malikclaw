package wecom

import (
	"github.com/sipeed/malikclaw/pkg/bus"
	"github.com/sipeed/malikclaw/pkg/channels"
	"github.com/sipeed/malikclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("wecom", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewWeComBotChannel(cfg.Channels.WeCom, b)
	})
	channels.RegisterFactory("wecom_app", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewWeComAppChannel(cfg.Channels.WeComApp, b)
	})
	channels.RegisterFactory("wecom_aibot", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewWeComAIBotChannel(cfg.Channels.WeComAIBot, b)
	})
}
