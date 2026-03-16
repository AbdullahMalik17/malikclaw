package googlechat

import (
	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/channels"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("googlechat", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewGoogleChatChannel(cfg.Channels.GoogleChat, b)
	})
}
