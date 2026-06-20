package swarm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"

	"github.com/AbdullahMalik17/malikclaw/pkg/logger"
)

// Task represents a work unit dispatched to a swarm node
type Task struct {
	ID         string            `json:"id"`
	AgentID    string            `json:"agent_id"` // Target agent ID on the remote node
	Payload    string            `json:"payload"`
	SessionKey string            `json:"session_key"`
	Metadata   map[string]string `json:"metadata"`
}

// TaskResult is the outcome of a dispatched task
type TaskResult struct {
	TaskID  string `json:"task_id"`
	Result  string `json:"result"`
	Error   string `json:"error,omitempty"`
	NodeID  string `json:"node_id"`
}

// Node represents a MalikClaw instance in the swarm
type Node struct {
	ID        string
	Address   string // e.g. "192.168.1.10:7331"
	Tags      []string
	LastSeen  time.Time
}

// Swarm manages the local node's server and peer connections
type Swarm struct {
	localID      string
	bindAddr     string
	peers        map[string]*Node
	mu           sync.RWMutex
	client       *http.Client
	server       *http.Server
	taskHandler  func(ctx context.Context, task Task) (TaskResult, error)
}

// Config for the swarm node
type Config struct {
	NodeID   string
	BindAddr string // e.g. ":7331"
}

// NewSwarm initializes a new swarm node
func NewSwarm(cfg Config, handler func(ctx context.Context, task Task) (TaskResult, error)) *Swarm {
	if cfg.NodeID == "" {
		cfg.NodeID = fmt.Sprintf("node-%d", time.Now().UnixNano())
	}
	if cfg.BindAddr == "" {
		cfg.BindAddr = ":7331"
	}

	return &Swarm{
		localID:     cfg.NodeID,
		bindAddr:    cfg.BindAddr,
		peers:       make(map[string]*Node),
		taskHandler: handler,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// Start boots the HTTP server for receiving tasks and peer discovery
func (s *Swarm) Start(ctx context.Context) error {
	mux := http.NewServeMux()
	mux.HandleFunc("/swarm/task", s.handleTask)
	mux.HandleFunc("/swarm/ping", s.handlePing)
	mux.HandleFunc("/swarm/peers", s.handlePeers)

	s.server = &http.Server{
		Addr:    s.bindAddr,
		Handler: mux,
	}

	go func() {
		logger.InfoCF("swarm", "Swarm node starting", map[string]any{"addr": s.bindAddr, "id": s.localID})
		if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.ErrorCF("swarm", "Server error", map[string]any{"error": err.Error()})
		}
	}()

	return nil
}

// Stop halts the swarm node gracefully
func (s *Swarm) Stop(ctx context.Context) error {
	if s.server != nil {
		return s.server.Shutdown(ctx)
	}
	return nil
}

// AddPeer manually registers a known peer node
func (s *Swarm) AddPeer(id, address string, tags []string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.peers[id] = &Node{
		ID:       id,
		Address:  address,
		Tags:     tags,
		LastSeen: time.Now(),
	}
}

// ListPeers returns all known active peers
func (s *Swarm) ListPeers() []Node {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	nodes := make([]Node, 0, len(s.peers))
	for _, n := range s.peers {
		nodes = append(nodes, *n)
	}
	return nodes
}

// DispatchTask sends a task to a specific peer node
func (s *Swarm) DispatchTask(ctx context.Context, targetNodeID string, task Task) (TaskResult, error) {
	s.mu.RLock()
	peer, exists := s.peers[targetNodeID]
	s.mu.RUnlock()

	if !exists {
		return TaskResult{}, fmt.Errorf("peer %q not found", targetNodeID)
	}

	payload, err := json.Marshal(task)
	if err != nil {
		return TaskResult{}, err
	}

	url := fmt.Sprintf("http://%s/swarm/task", peer.Address)
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(payload))
	if err != nil {
		return TaskResult{}, err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return TaskResult{}, fmt.Errorf("failed to dispatch task: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return TaskResult{}, fmt.Errorf("peer returned status %d: %s", resp.StatusCode, string(body))
	}

	var result TaskResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return TaskResult{}, fmt.Errorf("failed to decode task result: %w", err)
	}

	return result, nil
}

// --- HTTP Handlers ---

func (s *Swarm) handleTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "Invalid task payload", http.StatusBadRequest)
		return
	}

	// Process the task using the registered handler
	result, err := s.taskHandler(r.Context(), task)
	if err != nil {
		result = TaskResult{
			TaskID: task.ID,
			Error:  err.Error(),
			NodeID: s.localID,
		}
	} else {
		result.NodeID = s.localID
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (s *Swarm) handlePing(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ok", "id":"` + s.localID + `"}`))
}

func (s *Swarm) handlePeers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s.ListPeers())
}
