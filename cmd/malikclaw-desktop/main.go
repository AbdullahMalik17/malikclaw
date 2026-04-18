package main

import (
	"context"
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	bridge := NewBridge()
	app := NewApp(bridge)

	err := wails.Run(&options.App{
		Title:  "MalikClaw Precision Desktop",
		Width:  1280,
		Height: 800,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
			bridge.startup(ctx)
		},
		Bind: []interface{}{
			app,
			bridge,
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
