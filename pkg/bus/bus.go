// Package bus provides an in-memory async message bus for routing messages
// between agents, channels, and subagents.
package bus

import (
	"context"
	"errors"
	"sync/atomic"

	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

// ErrBusClosed is returned when publishing to or consuming from a closed MessageBus.
var ErrBusClosed = errors.New("message bus closed")

const defaultBusBufferSize = 64

// MessageBus routes inbound and outbound messages asynchronously using buffered channels.
type MessageBus struct {
	inbound       chan InboundMessage
	outbound      chan OutboundMessage
	outboundMedia chan OutboundMediaMessage
	done          chan struct{}
	closed        atomic.Bool
}

// NewMessageBus constructs a new MessageBus with default channel buffering.
func NewMessageBus() *MessageBus {
	return &MessageBus{
		inbound:       make(chan InboundMessage, defaultBusBufferSize),
		outbound:      make(chan OutboundMessage, defaultBusBufferSize),
		outboundMedia: make(chan OutboundMediaMessage, defaultBusBufferSize),
		done:          make(chan struct{}),
	}
}

// PublishInbound sends an InboundMessage to the bus. Returns ErrBusClosed if closed, or ctx.Err() on context cancellation.
func (mb *MessageBus) PublishInbound(ctx context.Context, msg InboundMessage) error {
	if mb.closed.Load() {
		return ErrBusClosed
	}
	select {
	case mb.inbound <- msg:
		return nil
	case <-mb.done:
		return ErrBusClosed
	case <-ctx.Done():
		return ctx.Err()
	}
}

// ConsumeInbound receives an InboundMessage from the bus. Returns false if closed or context is cancelled.
func (mb *MessageBus) ConsumeInbound(ctx context.Context) (InboundMessage, bool) {
	select {
	case msg, ok := <-mb.inbound:
		return msg, ok
	case <-mb.done:
		return InboundMessage{}, false
	case <-ctx.Done():
		return InboundMessage{}, false
	}
}

// PublishOutbound sends an OutboundMessage to the bus. Returns ErrBusClosed if closed, or ctx.Err() on context cancellation.
func (mb *MessageBus) PublishOutbound(ctx context.Context, msg OutboundMessage) error {
	if mb.closed.Load() {
		return ErrBusClosed
	}
	select {
	case mb.outbound <- msg:
		return nil
	case <-mb.done:
		return ErrBusClosed
	case <-ctx.Done():
		return ctx.Err()
	}
}

// SubscribeOutbound receives an OutboundMessage from the bus. Returns false if closed or context is cancelled.
func (mb *MessageBus) SubscribeOutbound(ctx context.Context) (OutboundMessage, bool) {
	select {
	case msg, ok := <-mb.outbound:
		return msg, ok
	case <-mb.done:
		return OutboundMessage{}, false
	case <-ctx.Done():
		return OutboundMessage{}, false
	}
}

// PublishOutboundMedia sends an OutboundMediaMessage to the bus. Returns ErrBusClosed if closed, or ctx.Err() on context cancellation.
func (mb *MessageBus) PublishOutboundMedia(ctx context.Context, msg OutboundMediaMessage) error {
	if mb.closed.Load() {
		return ErrBusClosed
	}
	select {
	case mb.outboundMedia <- msg:
		return nil
	case <-mb.done:
		return ErrBusClosed
	case <-ctx.Done():
		return ctx.Err()
	}
}

// SubscribeOutboundMedia receives an OutboundMediaMessage from the bus. Returns false if closed or context is cancelled.
func (mb *MessageBus) SubscribeOutboundMedia(ctx context.Context) (OutboundMediaMessage, bool) {
	select {
	case msg, ok := <-mb.outboundMedia:
		return msg, ok
	case <-mb.done:
		return OutboundMediaMessage{}, false
	case <-ctx.Done():
		return OutboundMediaMessage{}, false
	}
}

// Close gracefully closes the message bus, preventing further publishing and draining buffered messages.
func (mb *MessageBus) Close() {
	if mb.closed.CompareAndSwap(false, true) {
		close(mb.done)

		// Drain buffered channels so pending messages do not leak memory.
		// Channels are NOT closed to prevent send-on-closed panics from concurrent publishers.
		drained := drainChannel(mb.inbound) + drainChannel(mb.outbound) + drainChannel(mb.outboundMedia)

		if drained > 0 {
			logger.DebugCF("bus", "Drained buffered messages during close", map[string]any{
				"count": drained,
			})
		}
	}
}

// drainChannel non-blockingly drains all buffered elements from a channel and returns the count drained.
func drainChannel[T any](ch chan T) int {
	count := 0
	for {
		select {
		case <-ch:
			count++
		default:
			return count
		}
	}
}

