package tools

import (
	"testing"
	"github.com/stretchr/testify/assert"
	"encoding/json"
	"github.com/modelcontextprotocol/go-sdk/mcp"
)

func TestMCPTool_Interfaces(t *testing.T) {
	mcpTool := NewMCPTool(nil, "my_server", &mcp.Tool{
		Name: "my_tool",
		Description: "my_desc",
	})

	assert.Equal(t, "mcp_my_server_my_tool", mcpTool.Name())
	assert.NotEmpty(t, mcpTool.Description())
	assert.NotNil(t, mcpTool.Parameters())
}

func TestMCPTool_Interfaces_ComplexName(t *testing.T) {
	mcpTool := NewMCPTool(nil, "Server Name!@#", &mcp.Tool{
		Name: "Tool-Name!@#",
		Description: "my_desc",
	})

	assert.Contains(t, mcpTool.Name(), "mcp_")
	assert.NotEmpty(t, mcpTool.Description())
	assert.NotNil(t, mcpTool.Parameters())

    mcpTool2 := NewMCPTool(nil, "very_long_server_name_that_exceeds_sixty_four_characters_when_combined", &mcp.Tool{
		Name: "very_long_tool_name_that_exceeds_sixty_four_characters_when_combined",
		Description: "my_desc",
	})
    assert.Contains(t, mcpTool2.Name(), "mcp_")
}

func TestMCPTool_Interfaces_Parameters(t *testing.T) {
	// with nil schema
	mcpTool := NewMCPTool(nil, "my_server", &mcp.Tool{
		Name: "my_tool",
		Description: "my_desc",
	})
	params := mcpTool.Parameters()
	assert.Equal(t, "object", params["type"])

	// with schema properties
	mcpTool2 := NewMCPTool(nil, "my_server", &mcp.Tool{
		Name: "my_tool",
		Description: "my_desc",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"prop1": map[string]interface{}{
					"type": "string",
				},
			},
			"required": []string{"prop1"},
		},
	})
	params2 := mcpTool2.Parameters()
	assert.Equal(t, "object", params2["type"])
}

func TestMCPTool_Interfaces_Parameters_JSON(t *testing.T) {

	// with json.RawMessage
	mcpTool3 := NewMCPTool(nil, "my_server", &mcp.Tool{
		Name: "my_tool",
		Description: "my_desc",
		InputSchema: json.RawMessage(`{"type":"object","properties":{"p1":{"type":"string"}}}`),
	})
	params3 := mcpTool3.Parameters()
	assert.Equal(t, "object", params3["type"])

    // with []byte
    mcpTool4 := NewMCPTool(nil, "my_server", &mcp.Tool{
		Name: "my_tool",
		Description: "my_desc",
		InputSchema: []byte(`{"type":"object","properties":{"p1":{"type":"string"}}}`),
	})
	params4 := mcpTool4.Parameters()
	assert.Equal(t, "object", params4["type"])

    // with unmarshalable object
    mcpTool5 := NewMCPTool(nil, "my_server", &mcp.Tool{
		Name: "my_tool",
		Description: "my_desc",
		InputSchema: struct{ Type string `json:"type"` }{ Type: "object" },
	})
	params5 := mcpTool5.Parameters()
	assert.Equal(t, "object", params5["type"])

    // invalid json
    mcpTool6 := NewMCPTool(nil, "my_server", &mcp.Tool{
		Name: "my_tool",
		Description: "my_desc",
		InputSchema: []byte(`{invalid`),
	})
	params6 := mcpTool6.Parameters()
    assert.Equal(t, "object", params6["type"])

    // func
    mcpTool7 := NewMCPTool(nil, "my_server", &mcp.Tool{
		Name: "my_tool",
		Description: "my_desc",
		InputSchema: func(){},
	})
	params7 := mcpTool7.Parameters()
    assert.Equal(t, "object", params7["type"])
}

func TestMCPTool_Interfaces_Parameters_JSON_String(t *testing.T) {
	// string json
	mcpTool8 := NewMCPTool(nil, "my_server", &mcp.Tool{
		Name: "my_tool",
		Description: "my_desc",
		InputSchema: `{"type":"object","properties":{"p1":{"type":"string"}}}`,
	})
	params8 := mcpTool8.Parameters()
	assert.Equal(t, "object", params8["type"])
}
