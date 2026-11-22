"""Tier 2: Boundary, Corner-Case & Negative E2E Tests (24 tests: 6 each for R1-R4)."""

from __future__ import annotations

import json
from pathlib import Path
import re
import sys
import tempfile
import unittest

E2E_DIR = Path(__file__).resolve().parent
if str(E2E_DIR) not in sys.path:
    sys.path.insert(0, str(E2E_DIR))

import helpers  # noqa: E402


class TestTier2R1Boundaries(unittest.TestCase):
    AREAS = ("r1",)

    def test_r1_b01_compiled_cli_version_ok_and_unknown_flag_fails(self) -> None:
        exe = helpers.get_built_cli()
        ok = helpers.run_cli_isolated(exe, ["version"])
        self.assertEqual(ok.returncode, 0, f"malikclaw version failed:\n{ok.stdout}\n{ok.stderr}")
        self.assertIn(helpers.TARGET_VERSION, ok.stdout)

        bad = helpers.run_cli_isolated(exe, ["--invalid-e2e-flag"])
        self.assertNotEqual(bad.returncode, 0, "Expected unknown flag to exit non-zero")
        self.assertIn("unknown flag", (bad.stdout + bad.stderr).lower())

    def test_r1_b02_installer_and_demo_version_flags_work_on_built_cli(self) -> None:
        root = helpers.get_repo_root()
        exe = helpers.get_built_cli(repo_root=root)

        invocations: list[tuple[str, list[str]]] = []
        install_sh = helpers.strip_shell_comments(
            (root / "install.sh").read_text(encoding="utf-8")
        )
        m_sh = re.search(
            r'"?\$INSTALL_BIN/\$\{?BINARY_NAME\}?"?[ \t]+(--?version|version)\b',
            install_sh,
        )
        self.assertIsNotNone(m_sh, "Could not locate binary version invocation in install.sh")
        invocations.append(("install.sh", [m_sh.group(1)]))

        install_ps1 = helpers.strip_shell_comments(
            (root / "install.ps1").read_text(encoding="utf-8")
        )
        m_ps1 = re.search(r'&\s+"?\$outputFile"?[ \t]+(--?version|version)\b', install_ps1)
        self.assertIsNotNone(m_ps1, "Could not locate binary version invocation in install.ps1")
        invocations.append(("install.ps1", [m_ps1.group(1)]))

        demo_sh = helpers.strip_shell_comments(
            (root / "demo.sh").read_text(encoding="utf-8")
        )
        m_demo = re.search(r'"?\$\{?MALIKCLAW_CMD\}?"?[ \t]+(--?version|version)\b', demo_sh)
        self.assertIsNotNone(m_demo, "Could not locate binary version invocation in demo.sh")
        invocations.append(("demo.sh", [m_demo.group(1)]))

        for script_name, args in invocations:
            res = helpers.run_cli_isolated(exe, args)
            self.assertEqual(
                res.returncode,
                0,
                f"{script_name} invokes `malikclaw {' '.join(args)}`, which exited {res.returncode}:\n{res.stdout}\n{res.stderr}",
            )
            self.assertIn(
                helpers.TARGET_VERSION,
                res.stdout,
                f"{script_name} version call did not output {helpers.TARGET_VERSION}",
            )

    def test_r1_b03_demo_sh_no_unsupported_agent_timeout_flag(self) -> None:
        root = helpers.get_repo_root()
        demo_sh = helpers.strip_shell_comments(
            (root / "demo.sh").read_text(encoding="utf-8")
        )
        self.assertNotRegex(
            demo_sh,
            r'(?:"?\$\{?MALIKCLAW_CMD\}?"?|\bmalikclaw)\s+agent\b[^\n]*--timeout\b',
            "demo.sh passes unsupported --timeout flag to `malikclaw agent`",
        )

        exe = helpers.get_built_cli(repo_root=root)
        agent_help = helpers.run_cli_isolated(exe, ["agent", "--help"])
        self.assertEqual(agent_help.returncode, 0, agent_help.stderr)
        self.assertIn("--message", agent_help.stdout)

    def test_r1_b04_install_ps1_powershell_ast_and_help_exits_0(self) -> None:
        root = helpers.get_repo_root()
        ps1 = root / "install.ps1"
        helpers.check_powershell_ast(ps1)

        proc = helpers.run_subprocess(
            [
                "powershell",
                "-NoProfile",
                "-NonInteractive",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                str(ps1),
                "-Help",
            ],
            cwd=root,
            timeout=30,
        )
        self.assertEqual(proc.returncode, 0, f"install.ps1 -Help failed:\n{proc.stdout}\n{proc.stderr}")
        self.assertIn("MalikClaw Windows Installer", proc.stdout)

    def test_r1_b05_isolated_home_cli_does_not_touch_real_user_config(self) -> None:
        root = helpers.get_repo_root()
        exe = helpers.get_built_cli(repo_root=root)
        real_cfg_dir = Path.home() / ".malikclaw"
        real_cfg_file = real_cfg_dir / "config.json"
        before_mtime = real_cfg_file.stat().st_mtime if real_cfg_file.exists() else None

        with tempfile.TemporaryDirectory(prefix="malikclaw_iso_home_") as tmp:
            iso_home = Path(tmp)
            cfg_path = helpers.run_cli_isolated(exe, ["config", "path"], home_dir=iso_home)
            self.assertEqual(cfg_path.returncode, 0, cfg_path.stderr)
            self.assertIn(
                str(iso_home).lower(),
                cfg_path.stdout.lower(),
                f"Expected isolated config path inside {iso_home}, got:\n{cfg_path.stdout}",
            )

            status_res = helpers.run_cli_isolated(exe, ["status"], home_dir=iso_home)
            self.assertEqual(status_res.returncode, 0, status_res.stderr)

        after_mtime = real_cfg_file.stat().st_mtime if real_cfg_file.exists() else None
        self.assertEqual(before_mtime, after_mtime, "CLI touched real user ~/.malikclaw/config.json")

    def test_r1_b06_no_stale_deb_or_raw_archive_naming_leaks(self) -> None:
        root = helpers.get_repo_root()
        for rel in ("install.sh", "install.ps1", ".goreleaser.yaml"):
            text = (root / rel).read_text(encoding="utf-8")
            self.assertNotIn("malikclaw_amd64.deb", text, f"Stale deb name in {rel}")
            self.assertNotIn("malikclaw-linux-", text, f"Raw binary naming leak in {rel}")
            self.assertNotIn("malikclaw-windows-", text, f"Raw binary naming leak in {rel}")


class TestTier2R2Boundaries(unittest.TestCase):
    AREAS = ("r2",)

    def test_r2_b01_server_json_description_length_and_strict_semver(self) -> None:
        root = helpers.get_repo_root()
        data = json.loads((root / "docs" / "submissions" / "server.json").read_text(encoding="utf-8"))
        desc = data.get("description", "")
        self.assertTrue(desc)
        self.assertLessEqual(
            len(desc),
            100,
            f"server.json description ({len(desc)} chars) exceeds 100 char MCP Registry limit",
        )
        ver = data.get("version", "")
        self.assertRegex(
            ver,
            r"^\d+\.\d+\.\d+$",
            f"server.json version {ver!r} must be strict SemVer without leading 'v'",
        )
        self.assertRegex(
            data.get("name", ""),
            r"^[a-zA-Z0-9.-]+/[a-zA-Z0-9._-]+$",
        )

    def test_r2_b02_software_malikclaw_yml_description_boundaries_and_no_promo(self) -> None:
        import yaml

        root = helpers.get_repo_root()
        data = yaml.safe_load(
            (root / "docs" / "submissions" / "software-malikclaw.yml").read_text(encoding="utf-8")
        )
        desc = str(data.get("description", ""))
        self.assertGreater(len(desc), 20)
        self.assertLessEqual(
            len(desc),
            250,
            f"software-malikclaw.yml description ({len(desc)} chars) exceeds 250 limit",
        )
        self.assertTrue(desc[0].isupper(), "description must start with an uppercase letter")
        self.assertTrue(desc.endswith("."), "description must end with a period")
        promo_match = re.search(
            r"\b(open[- ]source|free|best|revolutionary|leading|world[- ]class)\b",
            desc,
            flags=re.IGNORECASE,
        )
        if promo_match is not None:
            self.fail(
                f"Promotional word {promo_match.group(0)!r} forbidden by awesome-selfhosted-data"
            )

    def test_r2_b03_submissions_zero_stale_v02x_or_m6_pending_tag_claims(self) -> None:
        root = helpers.get_repo_root()
        for path in sorted((root / "docs" / "submissions").iterdir()):
            content = path.read_text(encoding="utf-8")
            self.assertNotRegex(
                content,
                r"v0\.2\.\d+",
                f"Stale v0.2.x version claim in {path.name}",
            )
            self.assertNotIn(
                "Milestone M6",
                content,
                f"Stale Milestone M6 pending tag claim in {path.name}",
            )

    def test_r2_b04_gated_manifests_absent_from_repo_root_while_mcp_serve_absent(self) -> None:
        root = helpers.get_repo_root()
        exe = helpers.get_built_cli(repo_root=root)
        help_res = helpers.run_cli_isolated(exe, ["--help"])
        self.assertEqual(help_res.returncode, 0)
        mcp_serve = helpers.run_cli_isolated(exe, ["mcp", "serve", "--help"])
        has_mcp_serve = (
            mcp_serve.returncode == 0
            and "serve" in mcp_serve.stdout.lower()
            and "unknown command" not in (mcp_serve.stdout + mcp_serve.stderr).lower()
        )
        if not has_mcp_serve:
            for gated_root_file in ("smithery.yaml", "server.json", "glama.json"):
                self.assertFalse(
                    (root / gated_root_file).exists(),
                    f"Gated manifest {gated_root_file} must NOT be placed at repo root while `malikclaw mcp serve` is absent",
                )

    def test_r2_b05_awesome_list_and_mcp_dirs_distinguish_immediate_vs_gated(self) -> None:
        root = helpers.get_repo_root()
        awesome = (root / "docs" / "submissions" / "awesome-list-prs.md").read_text(encoding="utf-8")
        mcp_dirs = (root / "docs" / "submissions" / "mcp-directories.md").read_text(encoding="utf-8")

        self.assertIn("Ready Now", awesome)
        self.assertIn("Gated", awesome)
        self.assertIn("Part A", mcp_dirs)
        self.assertIn("Part B", mcp_dirs)
        self.assertIn("malikclaw mcp serve", mcp_dirs)

    def test_r2_b06_mcp_directories_no_unresolved_placeholders_in_immediate_blocks(self) -> None:
        root = helpers.get_repo_root()
        text = (root / "docs" / "submissions" / "mcp-directories.md").read_text(encoding="utf-8")
        part_a = text.split("## Part A")[1].split("## Part B")[0]
        for lineno, line in enumerate(part_a.splitlines(), start=1):
            if "Contact Email:" in line and "[INSERT MAINTAINER EMAIL]" in line:
                continue  # explicit manual web form maintainer notice
            self.assertNotIn("[INSERT", line, f"Unresolved [INSERT placeholder in Part A line {lineno}: {line}")
            self.assertNotIn("TBD", line, f"Unresolved TBD in Part A line {lineno}: {line}")


class TestTier2R3Boundaries(unittest.TestCase):
    AREAS = ("r3",)

    def test_r3_b01_twitter_utf8_rtl_and_tight_boundaries(self) -> None:
        root = helpers.get_repo_root()
        text = (root / "docs" / "MARKETING_CAMPAIGN_V2.md").read_text(encoding="utf-8")
        sec3 = text.split("## 3. X / Twitter 9-Tweet Launch Thread")[1].split("## 4. Tailored Reddit")[0]
        tweets = dict(re.findall(r"\*\*Tweet (\d+)[^\n]*\*\*\s*\n((?:>.*\n?)+)", sec3))
        self.assertEqual(len(tweets), 9)

        def _clean(raw: str) -> str:
            normalized = raw.replace("\r\n", "\n")
            lines = [re.sub(r"^>\s?", "", ln) for ln in normalized.strip().splitlines()]
            return "\n".join(lines).strip()

        t8 = _clean(tweets["8"])
        self.assertIn("آگے بڑھو، ملک کلاؤ!", t8)
        self.assertLessEqual(len(t8), 280)

        for tight_idx in ("2", "9"):
            body = _clean(tweets[tight_idx])
            self.assertGreaterEqual(len(body), 250, f"Tweet {tight_idx} unexpectedly short ({len(body)})")
            self.assertLessEqual(len(body), 280, f"Tweet {tight_idx} exceeds 280 ({len(body)})")

    def test_r3_b02_marketing_zero_v02x_or_picoclaw_leaks(self) -> None:
        root = helpers.get_repo_root()
        text = (root / "docs" / "MARKETING_CAMPAIGN_V2.md").read_text(encoding="utf-8")
        self.assertNotRegex(text, r"v0\.2\.\d+")
        self.assertNotIn("picoclaw", text.lower())
        self.assertNotIn("sipeed", text.lower())

    def test_r3_b03_readme_and_readme_ur_image_paths_resolve(self) -> None:
        root = helpers.get_repo_root()
        for fname in ("README.md", "README.ur.md"):
            content = (root / fname).read_text(encoding="utf-8")
            img_srcs = re.findall(r'<img[^>]+src="([^"]+)"', content)
            md_imgs = re.findall(r"!\[[^\]]*\]\(([^)]+)\)", content)
            local_refs = [
                ref for ref in img_srcs + md_imgs
                if not ref.startswith(("http://", "https://", "data:"))
            ]
            self.assertTrue(local_refs, f"No local image references found in {fname}")
            for ref in local_refs:
                target = (root / ref.lstrip("./")).resolve()
                self.assertTrue(target.is_file(), f"Broken image reference {ref!r} in {fname}")
                self.assertGreater(target.stat().st_size, 0, f"Empty image file {target}")

    def test_r3_b04_render_banners_ps1_passes_powershell_ast(self) -> None:
        root = helpers.get_repo_root()
        helpers.check_powershell_ast(root / "assets" / "banners" / "v2-launch" / "render-banners.ps1")

    def test_r3_b05_geo_blocks_forbid_howto_faqpage_and_fid(self) -> None:
        root = helpers.get_repo_root()
        for rel in ("docs/submissions/mcp-directories.md", "docs/MARKETING_CAMPAIGN_V2.md"):
            content = (root / rel).read_text(encoding="utf-8")
            self.assertNotRegex(content, r'"@type"\s*:\s*"HowTo"')
            self.assertNotRegex(content, r'"@type"\s*:\s*"FAQPage"')
            self.assertNotRegex(content, r"\bFID\s*[<≤=]")

    def test_r3_b06_visual_assets_non_empty_and_magic_bytes(self) -> None:
        root = helpers.get_repo_root()
        png_magic = b"\x89PNG\r\n\x1a\n"
        for rel in (
            "assets/social-preview.png",
            "website/public/assets/og-banner.png",
            "assets/logo.png",
            "website/public/assets/logo.png",
        ):
            p = root / rel
            self.assertTrue(p.is_file(), f"Missing {p}")
            data = p.read_bytes()
            self.assertGreater(len(data), 10 * 1024, f"{rel} <= 10KB")
            self.assertEqual(data[:8], png_magic, f"{rel} invalid PNG magic")

        gif = root / "assets" / "demo.gif"
        self.assertTrue(gif.is_file(), f"Missing {gif}")
        gdata = gif.read_bytes()
        self.assertGreater(len(gdata), 10 * 1024, "assets/demo.gif <= 10KB")
        self.assertEqual(gdata[:6], b"GIF89a", "assets/demo.gif invalid GIF89a magic")


class TestTier2R4Boundaries(unittest.TestCase):
    AREAS = ("r4",)
    _server_cm = None
    _base_url: str = ""

    @classmethod
    def setUpClass(cls) -> None:
        root = helpers.get_repo_root()
        cls._server_cm = helpers.next_start_server(
            root,
            env_overrides={"GEMINI_API_KEY": "", "GOOGLE_API_KEY": ""},
        )
        cls._base_url = cls._server_cm.__enter__()

    @classmethod
    def tearDownClass(cls) -> None:
        if cls._server_cm is not None:
            cls._server_cm.__exit__(None, None, None)
            cls._server_cm = None

    def test_r4_b01_unknown_route_returns_404_on_next_start(self) -> None:
        status, _, _ = helpers.http_request(f"{self._base_url}/docs/nonexistent-e2e-probe")
        self.assertEqual(status, 404)

    def test_r4_b02_api_chat_malformed_json_returns_500_without_crash(self) -> None:
        status, _, raw = helpers.http_request(
            f"{self._base_url}/api/chat",
            method="POST",
            data=b"{bad-json",
            headers={"Content-Type": "application/json"},
        )
        self.assertEqual(status, 500)
        parsed = json.loads(raw.decode("utf-8"))
        self.assertIn("error", parsed)

        ok_status, _, _ = helpers.http_request(f"{self._base_url}/")
        self.assertEqual(ok_status, 200)

    def test_r4_b03_api_chat_empty_api_key_clean_error_and_server_healthy(self) -> None:
        payload = json.dumps(
            {
                "messages": [
                    {
                        "id": "e2e-msg-1",
                        "role": "user",
                        "parts": [{"type": "text", "text": "Hello"}],
                    }
                ]
            }
        ).encode("utf-8")
        status, _, raw = helpers.http_request(
            f"{self._base_url}/api/chat",
            method="POST",
            data=payload,
            headers={"Content-Type": "application/json"},
        )
        body_text = raw.decode("utf-8", errors="replace")
        # Either clean HTTP 4xx/5xx error JSON or stream error frame without crashing server
        self.assertTrue(
            status >= 400 or "error" in body_text.lower(),
            f"Expected clean error on empty GEMINI_API_KEY, got HTTP {status}: {body_text[:300]}",
        )
        ok_status, _, _ = helpers.http_request(f"{self._base_url}/")
        self.assertEqual(ok_status, 200)

    def test_r4_b04_website_built_html_js_no_stale_deb_or_raw_arm64_links(self) -> None:
        root = helpers.get_repo_root()
        helpers.ensure_website_built(root)
        next_dir = root / "website" / ".next"
        scan_files = (
            list((next_dir / "server" / "app").rglob("*.html"))
            + list((next_dir / "static" / "chunks").rglob("*.js"))
            + list((next_dir / "server" / "chunks").rglob("*.js"))
        )
        self.assertTrue(scan_files, "No built HTML/JS artifacts found in website/.next")
        for f in scan_files:
            content = f.read_text(encoding="utf-8", errors="replace")
            self.assertNotIn(
                "malikclaw_amd64.deb",
                content,
                f"Stale 404 deb filename malikclaw_amd64.deb found in built artifact {f}",
            )
            self.assertNotRegex(
                content,
                r"releases/(?:latest/download|download/[^/]+)/malikclaw_Linux_arm64(?!\.tar\.gz)",
                f"Stale raw unarchived malikclaw_Linux_arm64 URL found in built artifact {f}",
            )

    def test_r4_b05_public_metadata_and_9_assets_return_200(self) -> None:
        text_endpoints = [
            ("/robots.txt", "Sitemap: https://malikclaw.vercel.app/sitemap.xml"),
            ("/sitemap.xml", "https://malikclaw.vercel.app"),
            ("/llms.txt", helpers.TARGET_TAG),
            ("/manifest.json", "MalikClaw"),
            ("/sw.js", "self."),
        ]
        for path, expected_sub in text_endpoints:
            status, _, raw = helpers.http_request(f"{self._base_url}{path}")
            self.assertEqual(status, 200, f"GET {path} returned HTTP {status}")
            text = raw.decode("utf-8", errors="replace")
            self.assertIn(expected_sub, text, f"GET {path} missing {expected_sub!r}")

        status, _, ico = helpers.http_request(f"{self._base_url}/favicon.ico")
        self.assertEqual(status, 200)
        self.assertGreater(len(ico), 0)

        assets = [
            "/assets/og-banner.png",
            "/assets/logo.png",
            "/assets/licheervnano.png",
            "/assets/nano_bana_pro.jpg",
            "/assets/termux.jpg",
            "/assets/malikclaw_code.png",
            "/assets/malikclaw_scedule.png",
            "/assets/malikclaw_search.png",
            "/assets/malikclaw_memory.png",
        ]
        for asset in assets:
            st, headers, raw = helpers.http_request(f"{self._base_url}{asset}")
            self.assertEqual(st, 200, f"GET {asset} returned HTTP {st}")
            self.assertGreater(len(raw), 100, f"GET {asset} returned tiny/empty payload")
            self.assertIn("image/", headers.get("content-type", "").lower())

    def test_r4_b06_website_zero_stale_v02x_versions(self) -> None:
        root = helpers.get_repo_root()
        targets = list((root / "website" / "src").rglob("*.ts*")) + [
            root / "website" / "public" / "llms.txt"
        ]
        for f in targets:
            content = f.read_text(encoding="utf-8", errors="replace")
            self.assertNotRegex(
                content,
                r"v0\.2\.\d+",
                f"Stale v0.2.x version string found in {f}",
            )


if __name__ == "__main__":
    unittest.main()
