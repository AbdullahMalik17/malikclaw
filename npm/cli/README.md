# malikclaw

The npm distribution of the [MalikClaw](https://github.com/AbdullahMalik17/malikclaw) CLI.

```sh
npm install -g malikclaw
malikclaw onboard   # first run
malikclaw version
```

This package contains **no compiled code**. It is a tiny dependency-free Node
shim (`bin/malikclaw.js`) that finds and runs the real Go binary, which is
shipped in exactly one per-platform optional dependency selected by npm from
your OS and CPU:

```
malikclaw
└── optionalDependencies: @malikclaw/cli-<os>-<cpu>   ← npm installs the one that matches
```

There is no `postinstall` script and no download at install time, so
`--ignore-scripts`, air-gapped mirrors, and supply-chain review all behave
predictably.

Platforms, troubleshooting and release automation:
see [`npm/README.md`](https://github.com/AbdullahMalik17/malikclaw/tree/main/npm#readme).

## Escape hatches

- `MALIKCLAW_BIN=/path/to/malikclaw` — run a specific binary (dev builds,
  unsupported hosts).
- `MALIKCLAW_PKG=@malikclaw/cli-linux-x64` — force a platform package.

## License

MIT
