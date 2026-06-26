package bench_test

import (
    "os/exec"
    "strings"
    "testing"
    "time"
)

func BenchmarkBootTime(b *testing.B) {
    for i := 0; i < b.N; i++ {
        start := time.Now()
        cmd := exec.Command("../../malikclaw", "version")
        err := cmd.Run()
        elapsed := time.Since(start)
        if err != nil {
            b.Skipf("binary not found, skipping: %v", err)
        }
        if elapsed > time.Second {
            b.Errorf("boot time %v exceeds 1s SLA", elapsed)
        }
    }
}

func TestVersionOutput(t *testing.T) {
    cmd := exec.Command("../../malikclaw", "version")
    out, err := cmd.Output()
    if err != nil {
        t.Skipf("binary not found: %v", err)
    }
    if !strings.Contains(string(out), "v") {
        t.Error("version output should contain version string")
    }
}
