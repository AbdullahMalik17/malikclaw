package tools

import (
	"context"
	"testing"
	"github.com/stretchr/testify/assert"
)

func TestBrowserTool_Execute_Errors(t *testing.T) {
	bTool := &BrowserTool{}
	res := bTool.Execute(context.Background(), nil)
	assert.NotNil(t, res)
	assert.True(t, res.IsError)

	res2 := bTool.Execute(context.Background(), map[string]interface{}{"action": "unknown"})
	assert.NotNil(t, res2)
	assert.True(t, res2.IsError)
}

func TestCalendarTool_Execute_Errors(t *testing.T) {
	cTool := NewCalendarTool()
	res := cTool.Execute(context.Background(), nil)
	assert.NotNil(t, res)
	assert.True(t, res.IsError)
}

func TestEvolutionTool_Execute_Errors(t *testing.T) {
	eTool := NewEvolutionTool("")
	res := eTool.Execute(context.Background(), nil)
	assert.NotNil(t, res)
	assert.True(t, res.IsError)
}

func TestGmailTool_Execute_Errors(t *testing.T) {
	gTool := NewGmailTool()
	res := gTool.Execute(context.Background(), nil)
	assert.NotNil(t, res)
	assert.True(t, res.IsError)
}

func TestI2CTool_Execute_Errors(t *testing.T) {
	iTool := NewI2CTool()
	res := iTool.Execute(context.Background(), nil)
	assert.NotNil(t, res)
	assert.True(t, res.IsError)
}

func TestCronTool_Execute_Errors(t *testing.T) {
	crTool, _ := NewCronTool(nil, nil, nil, "", false, 0, nil)
	if crTool != nil {
	    res := crTool.Execute(context.Background(), nil)
	    assert.NotNil(t, res)
	    assert.True(t, res.IsError)
    }
}
