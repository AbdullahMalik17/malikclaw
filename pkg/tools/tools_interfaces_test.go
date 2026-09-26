package tools

import (
	"testing"
	"github.com/stretchr/testify/assert"
)

func TestToolInterfaces_Basic(t *testing.T) {
	registry := NewToolRegistry()

	// search_tool
	regexTool := NewRegexSearchTool(registry, 10, 100)
	assert.Equal(t, "tool_search_tool_regex", regexTool.Name())
	assert.NotEmpty(t, regexTool.Description())
	assert.NotNil(t, regexTool.Parameters())

	bm25Tool := NewBM25SearchTool(registry, 10, 100)
	assert.Equal(t, "tool_search_tool_bm25", bm25Tool.Name())
	assert.NotEmpty(t, bm25Tool.Description())
	assert.NotNil(t, bm25Tool.Parameters())

	// send_file
	sendFileTool := NewSendFileTool("", false, 0, nil)
	assert.Equal(t, "send_file", sendFileTool.Name())
	assert.NotEmpty(t, sendFileTool.Description())
	assert.NotNil(t, sendFileTool.Parameters())

	// shell
	execTool, _ := NewExecTool("", false)
	assert.Equal(t, "exec", execTool.Name())
	assert.NotEmpty(t, execTool.Description())
	assert.NotNil(t, execTool.Parameters())

	// spawn
	spawnTool := NewSpawnTool(nil)
	assert.Equal(t, "spawn", spawnTool.Name())
	assert.NotEmpty(t, spawnTool.Description())
	assert.NotNil(t, spawnTool.Parameters())

	// spi
	spiTool := NewSPITool()
	assert.Equal(t, "spi", spiTool.Name())
	assert.NotEmpty(t, spiTool.Description())
	assert.NotNil(t, spiTool.Parameters())

	// swarm_dispatch
	swarmDispatchTool := NewSwarmDispatchTool(nil)
	assert.Equal(t, "swarm_dispatch", swarmDispatchTool.Name())
	assert.NotEmpty(t, swarmDispatchTool.Description())
	assert.NotNil(t, swarmDispatchTool.Parameters())

	// web
	webSearchTool := &WebSearchTool{}
	assert.Equal(t, "web_search", webSearchTool.Name())
	assert.NotEmpty(t, webSearchTool.Description())
	assert.NotNil(t, webSearchTool.Parameters())

	webFetchTool := &WebFetchTool{}
	assert.Equal(t, "web_fetch", webFetchTool.Name())
	assert.NotEmpty(t, webFetchTool.Description())
	assert.NotNil(t, webFetchTool.Parameters())

    // skills_install
    installSkillTool := NewInstallSkillTool(nil, "")
    assert.Equal(t, "install_skill", installSkillTool.Name())
    assert.NotEmpty(t, installSkillTool.Description())
    assert.NotNil(t, installSkillTool.Parameters())

    // team_tool
	teamRunTool := NewTeamRunTool(nil)
	assert.Equal(t, "team_run", teamRunTool.Name())
	assert.NotEmpty(t, teamRunTool.Description())
	assert.NotNil(t, teamRunTool.Parameters())
}

func TestToolInterfaces_MoreBasic(t *testing.T) {
    // android
    androidTool := NewAndroidControlTool()
    assert.Equal(t, "android_control", androidTool.Name())
    assert.NotEmpty(t, androidTool.Description())
    assert.NotNil(t, androidTool.Parameters())

    // browser
    bTool := &BrowserTool{}
    assert.Equal(t, "browser_automation", bTool.Name())
    assert.NotEmpty(t, bTool.Description())
    assert.NotNil(t, bTool.Parameters())

    // calendar
    calendarTool := NewCalendarTool()
    assert.Equal(t, "calendar", calendarTool.Name())
    assert.NotEmpty(t, calendarTool.Description())
    assert.NotNil(t, calendarTool.Parameters())

    // cron
    cTool := &CronTool{}
    assert.Equal(t, "cron", cTool.Name())
    assert.NotEmpty(t, cTool.Description())
    assert.NotNil(t, cTool.Parameters())

    // edit - EditFileTool
    editTool := NewEditFileTool("", false)
    assert.Equal(t, "edit_file", editTool.Name())
    assert.NotEmpty(t, editTool.Description())
    assert.NotNil(t, editTool.Parameters())

    // edit - AppendFileTool
    appendTool := NewAppendFileTool("", false)
    assert.Equal(t, "append_file", appendTool.Name())
    assert.NotEmpty(t, appendTool.Description())
    assert.NotNil(t, appendTool.Parameters())

    // evolution
    evolTool := NewEvolutionTool("")
    assert.Equal(t, "self_improve", evolTool.Name())
    assert.NotEmpty(t, evolTool.Description())
    assert.NotNil(t, evolTool.Parameters())

    // filesystem - ReadFileTool
    readTool := NewReadFileTool("", false, 0)
    assert.Equal(t, "read_file", readTool.Name())
    assert.NotEmpty(t, readTool.Description())
    assert.NotNil(t, readTool.Parameters())

    // filesystem - WriteFileTool
    writeTool := NewWriteFileTool("", false)
    assert.Equal(t, "write_file", writeTool.Name())
    assert.NotEmpty(t, writeTool.Description())
    assert.NotNil(t, writeTool.Parameters())

    // filesystem - ListDirTool
    listDirTool := NewListDirTool("", false)
    assert.Equal(t, "list_dir", listDirTool.Name())
    assert.NotEmpty(t, listDirTool.Description())
    assert.NotNil(t, listDirTool.Parameters())

    // gmail
    gmailTool := NewGmailTool()
    assert.Equal(t, "gmail", gmailTool.Name())
    assert.NotEmpty(t, gmailTool.Description())
    assert.NotNil(t, gmailTool.Parameters())

    // i2c
    i2cTool := NewI2CTool()
    assert.Equal(t, "i2c", i2cTool.Name())
    assert.NotEmpty(t, i2cTool.Description())
    assert.NotNil(t, i2cTool.Parameters())
}
