#!/bin/bash
set -e
echo "=== MalikClaw RAM Benchmark ==="
./malikclaw gateway &
PID=$!
sleep 2
RSS=$(ps -o rss= -p $PID 2>/dev/null || echo "0")
RSS_MB=$(echo "scale=2; $RSS/1024" | bc)
echo "RAM Usage: ${RSS_MB}MB"
kill $PID 2>/dev/null || true
if (( $(echo "$RSS_MB > 10" | bc -l) )); then
  echo "FAIL: RAM usage ${RSS_MB}MB exceeds 10MB SLA"
  exit 1
fi
echo "PASS: RAM usage ${RSS_MB}MB is within 10MB SLA"
