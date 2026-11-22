"""Tier 3: Cross-Feature Pairwise Contract E2E Tests (7 tests: T3-01 .. T3-07)."""

from __future__ import annotations

import json
from pathlib import Path
import re
import shutil
import sys
import tempfile
import unittest

import yaml

E2E_DIR = Path(__file__).resolve().parent
if str(E2E_DIR) not in sys.path:
    sys.path.insert(0, str(E2E_DIR))

import helpers  # noqa: E402


def areas(*names: str):
    def decorator(fn):
        fn.AREAS = names
        return fn

    return decorator


class TestTier3Pairwise(unittest.TestCase):
    @areas("r1")
    def test_t3_01_installers_goreleaser_live_release_assets(self) -> None:
        root = helpers.get_repo_root()
        matrix = helpers.expected_goreleaser_assets(helpers.TARGET_VERSION, root)

        install_sh = (root / "install.sh").read_text(encoding="utf-8")
        install_ps1 = (root / "install.ps1").read_text(encoding="utf-8")

        # Require installers to target archive names from GoReleaser, not raw binaries
        self.assertNotIn("${BINARY_NAME}-linux-${ARCH}", install_sh)
        self.assertNotIn("$BINARY_NAME-windows-$goArch.exe", install_ps1)

        # Verify expected cross-platform archive names exist in both GoReleaser matrix and live release
        expected_installer_archives = {
            "malikclaw_Linux_x86_64.tar.gz",
            "malikclaw_Linux_arm64.tar.gz",
            "malikclaw_Linux_armv7.tar.gz",
            "malikclaw_Windows_x86_64.zip",
            "malikclaw_Windows_arm64.zip",
        }
        for archive in sorted(expected_installer_archives):
            self.assertIn(archive, matrix, f"{archive} missing from .goreleaser.yaml matrix")

        # Verify installer scripts contain archive suffixes and OS/arch tokens
        self.assertIn(".tar.gz", install_sh)
        self.assertRegex(install_sh, r"x86_64|amd64")
        self.assertIn("arm64", install_sh)
        self.assertIn(".zip", install_ps1)
        self.assertIn("x86_64", install_ps1)

        status, _, release = helpers.github_api_get(
            f"repos/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/releases/tags/{helpers.TARGET_TAG}"
        )
        self.assertEqual(status, 200, f"GitHub Release {helpers.TARGET_TAG} returned HTTP {status}")
        live_names = {a["name"] for a in release.get("assets", [])}
        for archive in sorted(expected_installer_archives):
            self.assertIn(
                archive,
                live_names,
                f"Installer archive {archive} missing from live {helpers.TARGET_TAG} release",
            )

    @areas("r1", "r4")
    def test_t3_02_website_download_pages_goreleaser_live_release(self) -> None:
        root = helpers.get_repo_root()
        matrix = helpers.expected_goreleaser_assets(helpers.TARGET_VERSION, root)
        helpers.ensure_website_built(root)

        sources_to_scan = [
            root / "website" / "src" / "app" / "download" / "page.tsx",
            root / "website" / "src" / "components" / "download.tsx",
            root / "website" / "src" / "app" / "docs" / "installation" / "linux" / "page.tsx",
            root / "website" / "src" / "app" / "docs" / "installation" / "android" / "page.tsx",
            root / "website" / "src" / "app" / "docs" / "installation" / "macos" / "page.tsx",
            root / "website" / "src" / "app" / "docs" / "installation" / "windows" / "page.tsx",
        ]
        found_assets: set[str] = set()
        url_pattern = re.compile(
            r"https://github\.com/AbdullahMalik17/malikclaw/releases/(?:latest/download|download/[^/]+)/([A-Za-z0-9._-]+)"
        )
        for src in sources_to_scan:
            text = src.read_text(encoding="utf-8")
            for m in url_pattern.finditer(text):
                found_assets.add(m.group(1))

        # Also scan built HTML/JS bundles (static + SSR chunks)
        next_dir = root / "website" / ".next"
        for f in (
            list((next_dir / "server" / "app").rglob("*.html"))
            + list((next_dir / "static" / "chunks").rglob("*.js"))
            + list((next_dir / "server" / "chunks").rglob("*.js"))
        ):
            text = f.read_text(encoding="utf-8", errors="replace")
            for m in url_pattern.finditer(text):
                found_assets.add(m.group(1))

        self.assertTrue(found_assets, "No release asset URLs found in website/")
        for asset in sorted(found_assets):
            self.assertIn(
                asset,
                matrix,
                f"Website links to {asset!r}, which does NOT exist in .goreleaser.yaml 35-asset matrix",
            )

        status, _, release = helpers.github_api_get(
            f"repos/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/releases/tags/{helpers.TARGET_TAG}"
        )
        self.assertEqual(status, 200, f"GitHub Release {helpers.TARGET_TAG} returned HTTP {status}")
        live_names = {a["name"] for a in release.get("assets", [])}
        for asset in sorted(found_assets):
            self.assertIn(
                asset,
                live_names,
                f"Website release asset {asset!r} missing from live {helpers.TARGET_TAG} release",
            )

    @areas("r2")
    def test_t3_03_mcp_directories_json_vs_go_load_config(self) -> None:
        root = helpers.get_repo_root()
        md = (root / "docs" / "submissions" / "mcp-directories.md").read_text(encoding="utf-8")
        m = re.search(
            r"Configuration Snippet.*?```json\s*(\{.*?\})\s*```",
            md,
            flags=re.DOTALL,
        )
        self.assertIsNotNone(m, "Could not extract JSON config snippet from mcp-directories.md")
        snippet = m.group(1)
        json.loads(snippet)  # ensure valid JSON first

        with tempfile.TemporaryDirectory(prefix="malikclaw_mcp_cfg_") as tmp:
            cfg_file = Path(tmp) / "config.json"
            cfg_file.write_text(snippet, encoding="utf-8")
            cfg_posix = cfg_file.as_posix()
            go_src = f"""package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)

func main() {{
	cfg, err := config.LoadConfig({json.dumps(cfg_posix)})
	if err != nil {{
		fmt.Fprintf(os.Stderr, "LoadConfig error: %v\\n", err)
		os.Exit(2)
	}}
	out, _ := json.Marshal(cfg.Tools.MCP)
	fmt.Println(string(out))
}}
"""
            proc = helpers.run_go_probe(go_src, repo_root=root)
            self.assertEqual(proc.returncode, 0, f"Go LoadConfig probe failed:\n{proc.stderr}")
            mcp_cfg = json.loads(proc.stdout.strip().splitlines()[-1])

        self.assertTrue(
            mcp_cfg.get("enabled"),
            f"mcp-directories.md snippet leaves tools.mcp.enabled=false when parsed by config.LoadConfig: {mcp_cfg}",
        )
        servers = mcp_cfg.get("servers") or {}
        self.assertTrue(
            servers,
            f"mcp-directories.md snippet leaves tools.mcp.servers empty when parsed by config.LoadConfig: {mcp_cfg}",
        )
        for srv_name, srv in servers.items():
            self.assertTrue(
                srv.get("enabled"),
                f"Server {srv_name!r} has enabled=false when parsed by config.LoadConfig",
            )
            srv_type = srv.get("type", "")
            self.assertIn(
                srv_type,
                {"stdio", "sse", "http"},
                f"Server {srv_name!r} has invalid/missing type {srv_type!r} (must be stdio|sse|http)",
            )

    @areas("r2")
    def test_t3_04_smithery_env_vars_vs_pkg_config_env_tags(self) -> None:
        root = helpers.get_repo_root()
        smithery = yaml.safe_load(
            (root / "docs" / "submissions" / "smithery.yaml").read_text(encoding="utf-8")
        )
        cmd_fn = smithery.get("startCommand", {}).get("commandFunction", "")
        self.assertTrue(cmd_fn, "smithery.yaml missing commandFunction")

        emitted_env_keys = set(re.findall(r"\b([A-Z][A-Z0-9_]{3,})\s*:", cmd_fn))
        self.assertTrue(emitted_env_keys, "No env keys found in smithery.yaml commandFunction")

        # Collect authoritative env vars bound in pkg/ and cmd/ Go sources
        bound_envs: set[str] = set()
        go_files = list((root / "pkg").rglob("*.go")) + list((root / "cmd").rglob("*.go"))
        for gf in go_files:
            src = gf.read_text(encoding="utf-8", errors="replace")
            for m in re.finditer(r'env:"([A-Z0-9_]+)"', src):
                bound_envs.add(m.group(1))
            for m in re.finditer(r'envPrefix:"([A-Z0-9_]+)"', src):
                prefix = m.group(1)
                bound_envs.add(prefix)
                # Common ToolConfig/fields combined with envPrefix
                bound_envs.add(f"{prefix}ENABLED")
            for m in re.finditer(r'os\.(?:Getenv|LookupEnv|Setenv)\("([A-Z0-9_]+)"', src):
                bound_envs.add(m.group(1))

        missing = sorted(k for k in emitted_env_keys if k not in bound_envs)
        self.assertFalse(
            missing,
            f"smithery.yaml emits env vars not bound anywhere in pkg/ or cmd/: {missing}",
        )

    @areas("r1", "r2")
    def test_t3_05_server_json_oci_tag_vs_goreleaser_dockers_v2(self) -> None:
        root = helpers.get_repo_root()
        server_json = json.loads(
            (root / "docs" / "submissions" / "server.json").read_text(encoding="utf-8")
        )
        gr_cfg = helpers.parse_goreleaser_config(root)
        dockers = gr_cfg.get("dockers_v2", [])
        self.assertTrue(dockers, ".goreleaser.yaml missing dockers_v2")
        primary_docker = dockers[0]
        image_repo = primary_docker.get("images", [""])[0]
        tags = primary_docker.get("tags", [])
        self.assertTrue(any("{{ .Tag }}" in str(t) for t in tags))

        packages = server_json.get("packages") or []
        self.assertTrue(packages, "server.json missing non-empty packages list")
        oci_id = packages[0].get("identifier", "")
        expected_id = f"{image_repo}:{helpers.TARGET_TAG}"
        self.assertEqual(
            oci_id,
            expected_id,
            f"server.json OCI identifier {oci_id!r} != GoReleaser dockers_v2 tag {expected_id!r}",
        )

    @areas("r1", "r3", "r4")
    def test_t3_06_marketing_go_snippet_symbols_21_channels_and_og_dims(self) -> None:
        root = helpers.get_repo_root()
        campaign = (root / "docs" / "MARKETING_CAMPAIGN_V2.md").read_text(encoding="utf-8")

        # 1. Extract r/golang Go embedding snippet and compile-check against real Go packages
        snippet_m = re.search(
            r"\*\*Minimal embedding example:\*\*\s*```go\s*(.*?)\s*```",
            campaign,
            flags=re.DOTALL,
        )
        self.assertIsNotNone(snippet_m, "Missing Minimal embedding example in MARKETING_CAMPAIGN_V2.md")
        snippet = snippet_m.group(1)

        go_probe = f"""package main

import (
	"context"
	"fmt"
	"net/netip"

	"github.com/AbdullahMalik17/malikclaw/pkg/agent/agentloop"
	"github.com/AbdullahMalik17/malikclaw/pkg/providers"
	"github.com/AbdullahMalik17/malikclaw/pkg/routing"
	"github.com/AbdullahMalik17/malikclaw/pkg/security"
	"github.com/AbdullahMalik17/malikclaw/pkg/tools"
)

func compileCheck(ctx context.Context, toolRegistry *tools.ToolRegistry, provider providers.LLMProvider) {{
	{snippet}
	_ = result
	_ = err
}}

func main() {{
	_ = security.ValidateURL
	_ = security.IsBlockedIP(netip.Addr{{}}, false)
	_ = security.WrapUntrusted("src", "body")
	_ = security.ScanPromptInjection("hello")
	r := routing.NewSmartCostRouter(routing.DefaultCostRouterConfig())
	d := r.ClassifyAndRoute("hi", 0)
	_ = r.FallbackModels(routing.TierFast)
	_ = routing.TierBalanced
	_ = routing.TierReasoning
	fmt.Println(d.Tier)
}}
"""
        proc = helpers.run_go_probe(go_probe, repo_root=root)
        self.assertEqual(
            proc.returncode,
            0,
            f"MARKETING_CAMPAIGN_V2.md Go snippet / symbol compile probe failed:\n{proc.stderr}",
        )

        # 2. Verify 21+ channels in pkg/channels/manager.go
        mgr_src = (root / "pkg" / "channels" / "manager.go").read_text(encoding="utf-8")
        init_calls = re.findall(r'm\.initChannel\("([^"]+)"', mgr_src)
        self.assertGreaterEqual(
            len(set(init_calls)),
            21,
            f"Expected >=21 channels in pkg/channels/manager.go, found {len(set(init_calls))}: {init_calls}",
        )

        # 3. Verify installer scripts referenced in campaign exist
        self.assertTrue((root / "install.sh").is_file())
        self.assertTrue((root / "install.ps1").is_file())

        # 4. Verify website/src/app/layout.tsx OG image dimensions match og-banner.png
        layout_tsx = (root / "website" / "src" / "app" / "layout.tsx").read_text(encoding="utf-8")
        self.assertIn('url: "/assets/og-banner.png"', layout_tsx)
        w_m = re.search(r"width:\s*(\d+)", layout_tsx)
        h_m = re.search(r"height:\s*(\d+)", layout_tsx)
        self.assertIsNotNone(w_m)
        self.assertIsNotNone(h_m)
        w, h, _ = helpers.read_image_dimensions(
            root / "website" / "public" / "assets" / "og-banner.png"
        )
        self.assertEqual((int(w_m.group(1)), int(h_m.group(1))), (w, h))

    @areas("r2", "r4")
    def test_t3_07_software_malikclaw_urls_vs_website_built_routes(self) -> None:
        root = helpers.get_repo_root()
        data = yaml.safe_load(
            (root / "docs" / "submissions" / "software-malikclaw.yml").read_text(encoding="utf-8")
        )
        sitemap_paths = set(helpers.parse_sitemap_paths(root))

        for key in ("website_url", "documentation_url"):
            url = str(data.get(key, ""))
            self.assertTrue(url.startswith("https://malikclaw.vercel.app"), f"Unexpected {key}: {url}")
            route = url[len("https://malikclaw.vercel.app") :] or "/"
            self.assertIn(route, sitemap_paths, f"{key} route {route!r} missing from sitemap.ts")

        with helpers.next_start_server(root) as base_url:
            for route in ("/", "/docs/quick-start"):
                st, hdrs, _ = helpers.http_request(f"{base_url}{route}")
                self.assertEqual(st, 200, f"Local next start {route} returned HTTP {st}")
                self.assertIn("text/html", hdrs.get("content-type", "").lower())


if __name__ == "__main__":
    unittest.main()
