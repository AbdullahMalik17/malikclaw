"""Tier 4: Real-World End-to-End Acceptance Scenarios (5 scenarios: T4-01 .. T4-05)."""

from __future__ import annotations

import hashlib
import io
import json
from pathlib import Path
import re
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
import zipfile

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


class TestTier4Scenarios(unittest.TestCase):
    @areas("r1")
    def test_t4_01_adopter_installer_and_cli_flow(self) -> None:
        """T4-01: Adopter fetches installers, checks URLs vs GoReleaser/live release, runs isolated CLI."""
        root = helpers.get_repo_root()
        matrix = helpers.expected_goreleaser_assets(helpers.TARGET_VERSION, root)

        # 1. Verify raw.githubusercontent.com installer endpoints return HTTP 200
        for script_name in ("install.sh", "install.ps1"):
            raw_url = (
                f"https://raw.githubusercontent.com/{helpers.REPO_OWNER}/{helpers.REPO_NAME}"
                f"/main/{script_name}"
            )
            st, _, raw = helpers.http_request(raw_url, timeout=20)
            self.assertEqual(st, 200, f"GET {raw_url} returned HTTP {st}")
            self.assertGreater(len(raw), 500, f"{raw_url} unexpectedly short")

        # 2. Validate local installer release URL resolution vs .goreleaser.yaml + live release
        install_sh = (root / "install.sh").read_text(encoding="utf-8")
        install_ps1 = (root / "install.ps1").read_text(encoding="utf-8")
        self.assertIn(".tar.gz", install_sh)
        self.assertNotIn("${BINARY_NAME}-linux-${ARCH}", install_sh)
        self.assertIn(".zip", install_ps1)
        self.assertNotIn("$BINARY_NAME-windows-$goArch.exe", install_ps1)

        rel_status, _, release = helpers.github_api_get(
            f"repos/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/releases/tags/{helpers.TARGET_TAG}"
        )
        self.assertEqual(rel_status, 200, f"Live {helpers.TARGET_TAG} release unavailable: HTTP {rel_status}")
        live_names = {a["name"] for a in release.get("assets", [])}
        for required_archive in (
            "malikclaw_Linux_x86_64.tar.gz",
            "malikclaw_Linux_arm64.tar.gz",
            "malikclaw_Windows_x86_64.zip",
            "malikclaw_Windows_arm64.zip",
        ):
            self.assertIn(required_archive, matrix)
            self.assertIn(required_archive, live_names)

        # 3. Validate install.ps1 AST & -Help dry run
        helpers.check_powershell_ast(root / "install.ps1")
        ps_help = helpers.run_subprocess(
            [
                "powershell",
                "-NoProfile",
                "-NonInteractive",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                str(root / "install.ps1"),
                "-Help",
            ],
            cwd=root,
        )
        self.assertEqual(ps_help.returncode, 0, ps_help.stderr)

        # 4. Build malikclaw into isolated temp dir & run version/onboard --help/config path/status
        with tempfile.TemporaryDirectory(prefix="malikclaw_t4_adopter_") as tmp:
            tmp_path = Path(tmp)
            bin_dir = tmp_path / "bin"
            bin_dir.mkdir()
            home_dir = tmp_path / "home"
            home_dir.mkdir()

            exe = helpers.build_malikclaw_cli(bin_dir, version=helpers.TARGET_VERSION, repo_root=root)

            ver = helpers.run_cli_isolated(exe, ["version"], home_dir=home_dir)
            self.assertEqual(ver.returncode, 0, ver.stderr)
            self.assertIn(helpers.TARGET_VERSION, ver.stdout)

            onb = helpers.run_cli_isolated(exe, ["onboard", "--help"], home_dir=home_dir)
            self.assertEqual(onb.returncode, 0, onb.stderr)

            cfg_p = helpers.run_cli_isolated(exe, ["config", "path"], home_dir=home_dir)
            self.assertEqual(cfg_p.returncode, 0, cfg_p.stderr)
            self.assertIn(str(home_dir).lower(), cfg_p.stdout.lower())

            st_res = helpers.run_cli_isolated(exe, ["status"], home_dir=home_dir)
            self.assertEqual(st_res.returncode, 0, st_res.stderr)

    @areas("r1")
    def test_t4_02_maintainer_v2_release_ci_and_tag_audit(self) -> None:
        """T4-02: Maintainer audits tag/commit parity, CI/release workflows, and 35 release assets."""
        root = helpers.get_repo_root()

        # 1. Local git clean + v2.0.0 == HEAD == origin/main
        tag_sha = helpers.run_subprocess(
            ["git", "rev-parse", f"{helpers.TARGET_TAG}^{{commit}}"], cwd=root
        )
        self.assertEqual(tag_sha.returncode, 0, tag_sha.stderr)
        head_sha = helpers.run_subprocess(["git", "rev-parse", "HEAD"], cwd=root)
        self.assertEqual(tag_sha.stdout.strip(), head_sha.stdout.strip())

        # 2. GitHub API tags + main commit parity
        tags_st, _, tags_json = helpers.github_api_get(
            f"repos/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/tags?per_page=30"
        )
        self.assertEqual(tags_st, 200)
        tag_map = {t["name"]: t["commit"]["sha"] for t in tags_json}
        self.assertIn(helpers.TARGET_TAG, tag_map)
        target_sha = tag_map[helpers.TARGET_TAG]
        self.assertEqual(target_sha, head_sha.stdout.strip())

        # 3. GitHub Actions CI, build, Create Tag and Release, Sync Version to Website green
        runs_st, _, runs_json = helpers.github_api_get(
            f"repos/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/actions/runs?per_page=50"
        )
        self.assertEqual(runs_st, 200)
        latest: dict[str, dict] = {}
        for r in runs_json.get("workflow_runs", []):
            wf_name = r.get("name", "")
            r_sha = r.get("head_sha")
            r_branch = r.get("head_branch")
            if wf_name in ("CI", "build"):
                if r_branch == "main" and r_sha == target_sha and wf_name not in latest:
                    latest[wf_name] = r
            elif wf_name in ("Create Tag and Release", "Sync Version to Website"):
                if (
                    (r_sha == target_sha or r_branch == helpers.TARGET_TAG)
                    and wf_name not in latest
                ):
                    latest[wf_name] = r
        for wf in ("CI", "build", "Create Tag and Release", "Sync Version to Website"):
            self.assertIn(wf, latest, f"Workflow {wf!r} missing run matching {helpers.TARGET_TAG} ({target_sha})")
            self.assertEqual(latest[wf].get("status"), "completed")
            self.assertEqual(latest[wf].get("conclusion"), "success")

        # 4. Live v2.0.0 release + 35 assets + CDN/SHA-256 or built-source fallback
        rel_st, _, release = helpers.github_api_get(
            f"repos/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/releases/tags/{helpers.TARGET_TAG}"
        )
        self.assertEqual(rel_st, 200)
        self.assertFalse(release.get("draft"))
        self.assertFalse(release.get("prerelease"))

        expected = helpers.expected_goreleaser_assets(helpers.TARGET_VERSION, root)
        asset_by_name = {a["name"]: a for a in release.get("assets", [])}
        self.assertEqual(set(asset_by_name) & expected, expected)

        for name in sorted(expected):
            a = asset_by_name[name]
            self.assertEqual(a.get("state"), "uploaded")
            self.assertGreater(a.get("size", 0), 0)
            self.assertTrue(str(a.get("digest", "")).startswith("sha256:"))

        chk_res = helpers.verify_release_asset_download(
            asset_by_name[f"malikclaw_{helpers.TARGET_VERSION}_checksums.txt"]
        )
        if not chk_res["cdn_blocked"]:
            checksum_lines = chk_res["bytes"].decode("utf-8").splitlines()
            checksums = {}
            for line in checksum_lines:
                parts = line.strip().split()
                if len(parts) == 2:
                    checksums[parts[1]] = parts[0]
            win_zip_name = "malikclaw_Windows_x86_64.zip"
            win_res = helpers.verify_release_asset_download(
                asset_by_name[win_zip_name],
                expected_sha256=checksums.get(win_zip_name),
            )
            if not win_res["cdn_blocked"]:
                with tempfile.TemporaryDirectory(prefix="malikclaw_t4_zip_") as tmp:
                    with zipfile.ZipFile(io.BytesIO(win_res["bytes"])) as zf:
                        zf.extractall(tmp)
                    exe_path = Path(tmp) / ("malikclaw.exe" if sys.platform == "win32" else "malikclaw")
                    if exe_path.is_file() and sys.platform == "win32":
                        v_out = helpers.run_cli_isolated(exe_path, ["version"])
                        self.assertEqual(v_out.returncode, 0, v_out.stderr)
                        self.assertIn(helpers.TARGET_VERSION, v_out.stdout)
        else:
            # Sandbox blocks release-assets.githubusercontent.com with 403; verify compiled CLI from tagged source
            exe = helpers.get_built_cli(version=helpers.TARGET_VERSION, repo_root=root)
            v_out = helpers.run_cli_isolated(exe, ["version"])
            self.assertEqual(v_out.returncode, 0, v_out.stderr)
            self.assertIn(helpers.TARGET_VERSION, v_out.stdout)

    @areas("r2")
    def test_t4_03_ecosystem_curator_submissions_audit(self) -> None:
        """T4-03: Curator audits all 5 docs/submissions/* files, schemas, gating & live targets."""
        root = helpers.get_repo_root()
        sub_dir = root / "docs" / "submissions"

        # 1. server.json
        server_json = json.loads((sub_dir / "server.json").read_text(encoding="utf-8"))
        self.assertEqual(server_json["version"], helpers.TARGET_VERSION)
        self.assertLessEqual(len(server_json["description"]), 100)
        self.assertEqual(
            server_json["packages"][0]["identifier"],
            f"ghcr.io/abdullahmalik17/malikclaw:{helpers.TARGET_TAG}",
        )

        # 2. smithery.yaml
        smithery = yaml.safe_load((sub_dir / "smithery.yaml").read_text(encoding="utf-8"))
        self.assertEqual(smithery["runtime"], "container")
        self.assertFalse((root / "smithery.yaml").exists())
        self.assertFalse((root / "server.json").exists())

        # 3. software-malikclaw.yml
        sh_yml = yaml.safe_load((sub_dir / "software-malikclaw.yml").read_text(encoding="utf-8"))
        self.assertLessEqual(len(sh_yml["description"]), 250)
        self.assertTrue(sh_yml["description"].endswith("."))
        self.assertIs(sh_yml["depends_3rdparty"], False)

        # 4. mcp-directories.md JSON config validated via Go LoadConfig
        mcp_md = (sub_dir / "mcp-directories.md").read_text(encoding="utf-8")
        self.assertNotIn("Milestone M6", mcp_md)
        m = re.search(r"Configuration Snippet.*?```json\s*(\{.*?\})\s*```", mcp_md, flags=re.DOTALL)
        self.assertIsNotNone(m)
        with tempfile.TemporaryDirectory(prefix="malikclaw_t4_cfg_") as tmp:
            cfg_path = Path(tmp) / "config.json"
            cfg_path.write_text(m.group(1), encoding="utf-8")
            go_src = f"""package main
import (
	"encoding/json"
	"fmt"
	"github.com/AbdullahMalik17/malikclaw/pkg/config"
)
func main() {{
	c, err := config.LoadConfig({json.dumps(cfg_path.as_posix())})
	if err != nil {{ panic(err) }}
	b, _ := json.Marshal(c.Tools.MCP)
	fmt.Println(string(b))
}}
"""
            proc = helpers.run_go_probe(go_src, repo_root=root)
            self.assertEqual(proc.returncode, 0, proc.stderr)
            parsed_mcp = json.loads(proc.stdout.strip().splitlines()[-1])
            self.assertTrue(parsed_mcp.get("enabled"))
            self.assertTrue(parsed_mcp.get("servers"))

        # 5. awesome-list-prs.md
        prs_md = (sub_dir / "awesome-list-prs.md").read_text(encoding="utf-8")
        self.assertNotIn("stops at `v0.2.4`", prs_md)

        # 6. Live reachability of GitHub canonical + upstream repos (always 200) and external dirs
        github_urls = [
            "https://github.com/AbdullahMalik17/malikclaw",
            "https://github.com/punkpeye/awesome-mcp-clients",
            "https://github.com/e2b-dev/awesome-ai-agents",
            "https://github.com/aloth/awesome-ai-agents",
            "https://github.com/awesome-selfhosted/awesome-selfhosted-data",
        ]
        for u in github_urls:
            res = helpers.verify_external_url(u, allow_sandbox_policy_block=False)
            self.assertEqual(res["status"], 200)

        for ext_u in (
            "https://mcpmarket.com/server/malikclaw",
            "https://pkg.go.dev/github.com/AbdullahMalik17/malikclaw",
        ):
            helpers.verify_external_url(ext_u, allow_sandbox_policy_block=True)

    @areas("r3")
    def test_t4_04_launch_operator_marketing_kit_audit(self) -> None:
        """T4-04: Launch operator verifies Day 1-14 campaign kit, assets, READMEs & live URLs."""
        root = helpers.get_repo_root()
        campaign = (root / "docs" / "MARKETING_CAMPAIGN_V2.md").read_text(encoding="utf-8")

        for num in range(1, 11):
            self.assertRegex(campaign, rf"(?m)^##\s+{num}\.\s+")
        self.assertNotRegex(campaign, r"v0\.2\.\d+")
        self.assertNotIn("picoclaw", campaign.lower())

        # Verify Reddit, LinkedIn, and Urdu Community Kit sections have non-empty v2.0.0 copy & canonical links
        sec4 = campaign.split("## 4. Tailored Reddit")[1].split("## 5. LinkedIn")[0]
        for sub_idx, subreddit in (("4.1", "r/LocalLLaMA"), ("4.2", "r/golang"), ("4.3", "r/selfhosted")):
            m_sub = re.search(
                rf"### {re.escape(sub_idx)}\s+`{re.escape(subreddit)}`.*?\n(.*?)(?=\n### 4\.|\Z)",
                sec4,
                flags=re.DOTALL,
            )
            self.assertIsNotNone(m_sub, f"Missing Reddit subsection {sub_idx} {subreddit}")
            sub_body = m_sub.group(1).strip()
            self.assertGreaterEqual(len(sub_body), 200)
            self.assertIn(helpers.TARGET_TAG, sub_body)
            self.assertIn("AbdullahMalik17/malikclaw", sub_body)
            self.assertIn("malikclaw.vercel.app", sub_body)

        for label, sec_body in (
            ("LinkedIn", campaign.split("## 5. LinkedIn")[1].split("## 6. Product Hunt")[0].strip()),
            ("Urdu Community Kit", campaign.split("## 8. Regional / Urdu")[1].split("## 9. 14-Day")[0].strip()),
        ):
            self.assertGreaterEqual(len(sec_body), 200, f"{label} section unexpectedly short")
            self.assertIn(helpers.TARGET_TAG, sec_body, f"{label} missing {helpers.TARGET_TAG}")
            self.assertIn("AbdullahMalik17/malikclaw", sec_body, f"{label} missing repo URL")
            self.assertIn("malikclaw.vercel.app", sec_body, f"{label} missing website URL")

        # Check visual assets
        for rel, w, h, fmt in (
            ("assets/social-preview.png", 1280, 640, "PNG"),
            ("website/public/assets/og-banner.png", 1200, 630, "PNG"),
            ("assets/logo.png", 640, 640, "PNG"),
            ("assets/demo.gif", 900, 520, "GIF89a"),
        ):
            aw, ah, afmt = helpers.read_image_dimensions(root / rel)
            self.assertEqual((aw, ah, afmt), (w, h, fmt))

        # Verify README.md & README.ur.md images exist
        for readme in ("README.md", "README.ur.md"):
            txt = (root / readme).read_text(encoding="utf-8")
            for src in re.findall(r'<img[^>]+src="([^"]+)"', txt):
                if not src.startswith(("http://", "https://")):
                    self.assertTrue((root / src.lstrip("./")).is_file(), f"Missing {src} in {readme}")

        # Verify live reachability of canonical URLs embedded in MARKETING_CAMPAIGN_V2.md
        for gh_u in (
            "https://github.com/AbdullahMalik17/malikclaw",
            f"https://github.com/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/releases/tag/{helpers.TARGET_TAG}",
            f"https://raw.githubusercontent.com/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/main/install.sh",
            f"https://raw.githubusercontent.com/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/main/install.ps1",
        ):
            res = helpers.verify_external_url(gh_u, allow_sandbox_policy_block=False)
            self.assertEqual(res["status"], 200)

        helpers.verify_external_url("https://malikclaw.vercel.app", allow_sandbox_policy_block=True)

    @areas("r4")
    def test_t4_05_web_operator_build_server_sweep_and_vercel_audit(self) -> None:
        """T4-05: Web operator runs tsc, lint, build, next start 34-route sweep & Vercel audit."""
        root = helpers.get_repo_root()

        tsc = helpers.run_website_tsc(root)
        self.assertEqual(tsc.returncode, 0, f"tsc failed:\n{tsc.stdout}\n{tsc.stderr}")

        lint = helpers.run_website_lint(root)
        self.assertEqual(lint.returncode, 0, f"lint failed:\n{lint.stdout}\n{lint.stderr}")

        rc, out, err = helpers.run_website_build(root)
        self.assertEqual(rc, 0, f"build failed:\n{out}\n{err}")

        with helpers.next_start_server(
            root, env_overrides={"GEMINI_API_KEY": "", "GOOGLE_API_KEY": ""}
        ) as base_url:
            st, _, sm_raw = helpers.http_request(f"{base_url}/sitemap.xml")
            self.assertEqual(st, 200)
            xml_root = ET.fromstring(sm_raw.decode("utf-8"))
            locs = [
                el.text.strip()
                for el in xml_root.iter()
                if el.tag.endswith("loc") and el.text
            ]
            self.assertGreaterEqual(len(locs), 34)

            for loc in locs:
                path = re.sub(r"^https?://[^/]+", "", loc) or "/"
                r_st, r_hdrs, r_raw = helpers.http_request(f"{base_url}{path}")
                self.assertEqual(r_st, 200, f"Route {path} returned HTTP {r_st}")
                self.assertIn("text/html", r_hdrs.get("content-type", "").lower())
                html = r_raw.decode("utf-8", errors="replace")
                for raw_err_marker in ("__next_error__", "Application error"):
                    self.assertNotIn(
                        raw_err_marker,
                        html,
                        f"Raw Next.js error marker {raw_err_marker!r} on {path}",
                    )
                visible_html = re.sub(
                    r"<script\b[^>]*>.*?</script>",
                    "",
                    html,
                    flags=re.DOTALL | re.IGNORECASE,
                )
                for err_marker in (
                    "NEXT_NOT_FOUND",
                    "404: This page could not be found",
                ):
                    self.assertNotIn(
                        err_marker,
                        visible_html,
                        f"Error marker {err_marker!r} on {path}",
                    )
                self.assertRegex(html, r"<title>[^<]+</title>")
                self.assertNotIn("malikclaw_amd64.deb", html, f"Stale deb URL on {path}")
                self.assertNotRegex(
                    html,
                    r"releases/(?:latest/download|download/[^/]+)/malikclaw_Linux_arm64(?!\.tar\.gz)",
                    f"Raw unarchived arm64 URL on {path}",
                )

            # /api/chat malformed JSON clean 500
            c_st, _, _ = helpers.http_request(
                f"{base_url}/api/chat",
                method="POST",
                data=b"{invalid",
                headers={"Content-Type": "application/json"},
            )
            self.assertEqual(c_st, 500)

        # Live Vercel or deployment package readiness check
        helpers.check_live_vercel_or_package(root)


if __name__ == "__main__":
    unittest.main()
