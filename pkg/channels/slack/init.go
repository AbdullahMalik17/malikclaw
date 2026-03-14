package slack

import (
	"github.com/sipeed/malikclaw/pkg/bus"
	"github.com/sipeed/malikclaw/pkg/channels"
	"github.com/sipeed/malikclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("slack", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewSlackChannel(cfg.Channels.Slack, b)
	})
}
