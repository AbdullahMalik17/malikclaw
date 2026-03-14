package matrix

import (
	"github.com/sipeed/malikclaw/pkg/bus"
	"github.com/sipeed/malikclaw/pkg/channels"
	"github.com/sipeed/malikclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("matrix", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewMatrixChannel(cfg.Channels.Matrix, b)
	})
}
