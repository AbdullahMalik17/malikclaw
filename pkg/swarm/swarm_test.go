package swarm

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestSwarmDispatchTask_SSRFPolicy(t *testing.T) {
	t.Run("blocks cloud metadata and loopback peers by default", func(t *testing.T) {
		s := NewSwarm(Config{NodeID: "local", AllowLocalhost: false, AllowPrivatePeers: false}, nil)
		s.AddPeer("meta", "http://169.254.169.254", nil)
		s.AddPeer("loopback", "http://127.0.0.1:7331", nil)

		if _, err := s.DispatchTask(context.Background(), "meta", Task{ID: "t1"}); err == nil || !strings.Contains(err.Error(), "SSRF") {
			t.Fatalf("expected SSRF block for metadata peer, got: %v", err)
		}
		if _, err := s.DispatchTask(context.Background(), "loopback", Task{ID: "t2"}); err == nil || !strings.Contains(err.Error(), "SSRF") {
			t.Fatalf("expected SSRF block for loopback peer, got: %v", err)
		}
	})

	t.Run("dispatches task to localhost peer when AllowLocalhost is true", func(t *testing.T) {
		srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.URL.Path != "/swarm/task" {
				t.Errorf("unexpected path: %s", r.URL.Path)
			}
			w.Header().Set("Content-Type", "application/json")
			_, _ = w.Write([]byte(`{"task_id":"t3","result":"done","node_id":"remote-1"}`))
		}))
		defer srv.Close()

		s := NewSwarm(Config{NodeID: "local", AllowLocalhost: true}, nil)
		s.AddPeer("remote-1", srv.URL, nil)

		res, err := s.DispatchTask(context.Background(), "remote-1", Task{ID: "t3", Payload: "hello"})
		if err != nil {
			t.Fatalf("DispatchTask error: %v", err)
		}
		if res.Result != "done" || res.NodeID != "remote-1" {
			t.Fatalf("unexpected task result: %+v", res)
		}
	})
}
