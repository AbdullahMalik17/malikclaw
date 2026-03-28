package benchmark

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/benchmarks"
	"github.com/spf13/cobra"
)

func NewBenchmarkCommand() *cobra.Command {
	var (
		resultsPath string
		exportJSON  string
	)

	cmd := &cobra.Command{
		Use:   "benchmark",
		Short: "Performance analysis and reports",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, _ []string) error {
			return benchmarkCmd(resultsPath, exportJSON)
		},
	}

	cmd.Flags().StringVarP(&resultsPath, "file", "f", "", "Path to benchmark results JSON")
	cmd.Flags().StringVarP(&exportJSON, "export", "e", "", "Export results to a specific JSON file")

	return cmd
}

func benchmarkCmd(resultsPath, exportJSON string) error {
	b := benchmarks.NewBenchmark(context.Background(), 1000)

	// Load results
	if err := b.ImportJSON(resultsPath); err != nil {
		if os.IsNotExist(err) && resultsPath == "" {
			home, _ := os.UserHomeDir()
			defaultPath := filepath.Join(home, ".malikclaw", "benchmarks", "results.json")
			fmt.Printf("No benchmark data found at %s. Run some agent tasks first.\n", defaultPath)
			return nil
		}
		return fmt.Errorf("failed to load benchmark data: %w", err)
	}

	// Show report
	fmt.Println(b.GenerateReport())

	// Export if requested
	if exportJSON != "" {
		if err := b.ExportJSON(exportJSON); err != nil {
			return fmt.Errorf("failed to export results: %w", err)
		}
		fmt.Printf("Results exported to %s\n", exportJSON)
	}

	return nil
}
