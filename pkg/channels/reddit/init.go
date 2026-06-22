package reddit

import (
	"github.com/AbdullahMalik17/malikclaw/pkg/bus"
	"github.com/AbdullahMalik17/malikclaw/pkg/channels"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("reddit", func(cfg *config.Config, messageBus *bus.MessageBus) (channels.Channel, error) {
		return NewChannel(cfg, messageBus)
	})
}
