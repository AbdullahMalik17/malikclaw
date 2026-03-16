package providers

import (
	"context"
	"strings"
	"testing"

	copilot "github.com/github/copilot-sdk/go"
)

type fakeCopilotClient struct {
	startErr       error
	createSession  copilotSession
	createErr      error
	stopCalled     int
	capturedConfig *copilot.ClientOptions
}

func (f *fakeCopilotClient) Start(ctx context.Context) error {
	return f.startErr
}

func (f *fakeCopilotClient) CreateSession(ctx context.Context, config *copilot.SessionConfig) (copilotSession, error) {
	if f.createErr != nil {
		return nil, f.createErr
	}
	return f.createSession, nil
}

func (f *fakeCopilotClient) Stop() error {
	f.stopCalled++
	return nil
}

type fakeCopilotSession struct {
	response *copilot.SessionEvent
	err      error
}

func (f *fakeCopilotSession) SendAndWait(ctx context.Context, opts copilot.MessageOptions) (*copilot.SessionEvent, error) {
	return f.response, f.err
}

func TestNewGitHubCopilotProvider_StdioInitialization(t *testing.T) {
	original := newCopilotClient
	defer func() { newCopilotClient = original }()

	fakeSession := &fakeCopilotSession{}
	fakeClient := &fakeCopilotClient{createSession: fakeSession}
	newCopilotClient = func(options *copilot.ClientOptions) copilotClient {
		fakeClient.capturedConfig = options
		return fakeClient
	}

	provider, err := NewGitHubCopilotProvider("/usr/local/bin/copilot", "stdio", "gpt-4.1")
	if err != nil {
		t.Fatalf("NewGitHubCopilotProvider() error = %v", err)
	}
	if provider == nil {
		t.Fatal("NewGitHubCopilotProvider() returned nil provider")
	}
	if provider.connectMode != "stdio" {
		t.Fatalf("connectMode = %q, want %q", provider.connectMode, "stdio")
	}
	if provider.uri != "/usr/local/bin/copilot" {
		t.Fatalf("uri = %q, want %q", provider.uri, "/usr/local/bin/copilot")
	}
	if fakeClient.capturedConfig == nil {
		t.Fatal("expected client options to be captured")
	}
	if fakeClient.capturedConfig.CLIPath != "/usr/local/bin/copilot" {
		t.Fatalf("CLIPath = %q, want %q", fakeClient.capturedConfig.CLIPath, "/usr/local/bin/copilot")
	}
	if fakeClient.capturedConfig.UseStdio == nil || !*fakeClient.capturedConfig.UseStdio {
		t.Fatal("expected UseStdio=true for stdio mode")
	}
	if fakeClient.capturedConfig.CLIUrl != "" {
		t.Fatalf("CLIUrl = %q, want empty", fakeClient.capturedConfig.CLIUrl)
	}
}

func TestNewGitHubCopilotProvider_StdioInvalidURI(t *testing.T) {
	provider, err := NewGitHubCopilotProvider("http://localhost:4321", "stdio", "gpt-4.1")
	if err == nil {
		t.Fatal("expected error for stdio URL input, got nil")
	}
	if provider != nil {
		t.Fatalf("provider = %#v, want nil", provider)
	}
	if !strings.Contains(err.Error(), "invalid stdio cli path") {
		t.Fatalf("error = %q, want invalid stdio path message", err.Error())
	}
}

func TestGitHubCopilotProvider_CloseLifecycle(t *testing.T) {
	client := &fakeCopilotClient{}
	provider := &GitHubCopilotProvider{
		connectMode: "stdio",
		client:      client,
		session:     &fakeCopilotSession{},
	}

	provider.Close()
	if client.stopCalled != 1 {
		t.Fatalf("stopCalled = %d, want 1", client.stopCalled)
	}

	provider.Close()
	if client.stopCalled != 1 {
		t.Fatalf("stopCalled = %d, want 1 after second Close()", client.stopCalled)
	}

	_, err := provider.Chat(context.Background(), []Message{{Role: "user", Content: "hello"}}, nil, "gpt-4.1", nil)
	if err == nil || !strings.Contains(err.Error(), "provider closed") {
		t.Fatalf("error = %v, want provider closed", err)
	}
}
