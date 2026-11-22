"""Tier 1: Feature Coverage E2E Tests (24 tests: 6 each for R1, R2, R3, R4)."""

from __future__ import annotations

import json
from pathlib import Path
import re
import sys
import unittest

import yaml

E2E_DIR = Path(__file__).resolve().parent
if str(E2E_DIR) not in sys.path:
    sys.path.insert(0, str(E2E_DIR))

import helpers  # noqa: E402


class TestTier1R1Release(unittest.TestCase):
    AREAS = ("r1",)

    def test_r1_01_clean_git_state_and_v2_tag_alignment(self) -> None:
        root = helpers.get_repo_root()
        merge_head = helpers.run_subprocess(
            ["git", "rev-parse", "-q", "--verify", "MERGE_HEAD"], cwd=root
        )
        self.assertNotEqual(
            merge_head.returncode,
            0,
            f"Unresolved git MERGE_HEAD present: {merge_head.stdout.strip()}",
        )

        unmerged = helpers.run_subprocess(
            ["git", "diff", "--name-only", "--diff-filter=U"], cwd=root
        )
        self.assertEqual(unmerged.returncode, 0, unmerged.stderr)
        self.assertEqual(
            unmerged.stdout.strip(),
            "",
            f"Unmerged git conflict files remain:\n{unmerged.stdout}",
        )

        tag_sha = helpers.run_subprocess(
            ["git", "rev-parse", f"{helpers.TARGET_TAG}^{{commit}}"], cwd=root
        )
        self.assertEqual(
            tag_sha.returncode,
            0,
            f"Git tag {helpers.TARGET_TAG} missing: {tag_sha.stderr}",
        )
        head_sha = helpers.run_subprocess(["git", "rev-parse", "HEAD"], cwd=root)
        self.assertEqual(head_sha.returncode, 0, head_sha.stderr)
        self.assertEqual(
            tag_sha.stdout.strip(),
            head_sha.stdout.strip(),
            f"Tag {helpers.TARGET_TAG} ({tag_sha.stdout.strip()}) != HEAD ({head_sha.stdout.strip()})",
        )

        origin_main = helpers.run_subprocess(
            ["git", "rev-parse", "-q", "--verify", "origin/main"], cwd=root
        )
        if origin_main.returncode == 0:
            self.assertEqual(
                tag_sha.stdout.strip(),
                origin_main.stdout.strip(),
                f"Tag {helpers.TARGET_TAG} ({tag_sha.stdout.strip()}) != origin/main ({origin_main.stdout.strip()})",
            )

    def test_r1_02_pr_workflow_valid_lint_action_and_no_conflicts(self) -> None:
        root = helpers.get_repo_root()
        wf_dir = root / ".github" / "workflows"
        yml_files = sorted(list(wf_dir.glob("*.yml")) + list(wf_dir.glob("*.yaml")))
        self.assertGreaterEqual(len(yml_files), 4)

        for wf in yml_files:
            content = wf.read_text(encoding="utf-8")
            for marker in ("<<<<<<<", "=======", ">>>>>>>"):
                self.assertNotIn(marker, content, f"Conflict marker {marker!r} in {wf}")
            parsed = yaml.safe_load(content)
            self.assertIsInstance(parsed, dict, f"{wf} failed YAML parse")

        pr_cfg = yaml.safe_load((wf_dir / "pr.yml").read_text(encoding="utf-8"))
        jobs = pr_cfg.get("jobs", {})
        lint_versions: list[str] = []
        for job in jobs.values():
            for step in job.get("steps", []):
                uses = str(step.get("uses", ""))
                if uses.startswith("golangci/golangci-lint-action"):
                    ver = str(step.get("with", {}).get("version", ""))
                    lint_versions.append(ver)
        self.assertTrue(lint_versions, "pr.yml missing golangci/golangci-lint-action step")
        for ver in lint_versions:
            self.assertRegex(
                ver,
                r"^v\d+\.\d+\.\d+$",
                f"pr.yml golangci-lint version {ver!r} must be strict semver (e.g. v2.14.0)",
            )

    def test_r1_03_goreleaser_valid_v2_schema_and_no_broken_winget(self) -> None:
        root = helpers.get_repo_root()
        cfg = helpers.parse_goreleaser_config(root)
        self.assertEqual(cfg.get("version"), 2)

        assets = helpers.expected_goreleaser_assets(helpers.TARGET_VERSION, root)
        self.assertEqual(len(assets), 35, f"Expected 35 GoReleaser assets, got {len(assets)}")

        dockers = cfg.get("dockers_v2", [])
        self.assertTrue(dockers, ".goreleaser.yaml missing dockers_v2")
        all_tags = " ".join(str(t) for d in dockers for t in d.get("tags", []))
        self.assertIn("{{ .Tag }}", all_tags)

        winget = cfg.get("winget")
        if winget:
            entries = winget if isinstance(winget, list) else [winget]
            for entry in entries:
                skip = str(entry.get("skip_upload", "")).lower()
                self.assertIn(
                    skip,
                    {"true", "auto"},
                    "winget publisher points to missing AbdullahMalik17/winget-pkgs and must be removed or skip_upload: true",
                )

    def test_r1_04_website_version_ts_matches_v2(self) -> None:
        root = helpers.get_repo_root()
        version_ts = (root / "website" / "src" / "lib" / "version.ts").read_text(encoding="utf-8")
        self.assertIn(f'"{helpers.TARGET_TAG}"', version_ts)

    def test_r1_05_installer_urls_match_goreleaser_archives(self) -> None:
        root = helpers.get_repo_root()
        install_sh = helpers.strip_shell_comments(
            (root / "install.sh").read_text(encoding="utf-8")
        )
        install_ps1 = helpers.strip_shell_comments(
            (root / "install.ps1").read_text(encoding="utf-8")
        )
        expected_assets = helpers.expected_goreleaser_assets(helpers.TARGET_VERSION, root)

        for forbidden_pat in (
            r"malikclaw-linux-",
            r"malikclaw-windows-",
            r"\$\{?BINARY_NAME\}?-(?:linux|windows|darwin)",
        ):
            self.assertNotRegex(
                install_sh,
                re.compile(forbidden_pat, re.IGNORECASE),
                f"install.sh uses forbidden raw asset pattern {forbidden_pat}",
            )
            self.assertNotRegex(
                install_ps1,
                re.compile(forbidden_pat, re.IGNORECASE),
                f"install.ps1 uses forbidden raw asset pattern {forbidden_pat}",
            )

        literal_sh_urls = re.findall(
            r"https://github\.com/[^\s\"']+/releases/(?:latest/download|download/[^/]+)/(malikclaw_[^\s\"']+\.tar\.gz)",
            install_sh,
        )
        param_sh_match = re.search(
            r"https://github\.com/[^\s\"']+/releases/(?:latest/download|download/[^/]+)/\$\{?BINARY_NAME\}?_\$\{?ARCHIVE_OS\}?_\$\{?ARCHIVE_ARCH\}?\.tar\.gz",
            install_sh,
        )
        self.assertTrue(
            bool(literal_sh_urls) or param_sh_match is not None,
            "install.sh download URL must use GoReleaser archive naming (<binary>_<OS>_<arch>.tar.gz)",
        )
        if literal_sh_urls:
            for asset_name in literal_sh_urls:
                self.assertIn(
                    asset_name,
                    expected_assets,
                    f"install.sh literal archive {asset_name!r} not in GoReleaser matrix",
                )
        if param_sh_match is not None:
            self.assertRegex(
                install_sh,
                r'BINARY_NAME=["\']malikclaw["\']',
                "install.sh BINARY_NAME must be 'malikclaw'",
            )
            os_vals = set(re.findall(r'ARCHIVE_OS=["\']([A-Za-z0-9_]+)["\']', install_sh))
            arch_vals = set(re.findall(r'ARCHIVE_ARCH=["\']([A-Za-z0-9_]+)["\']', install_sh))
            self.assertTrue(
                {"Linux", "Darwin", "Freebsd"}.issubset(os_vals),
                f"install.sh ARCHIVE_OS branches incomplete: {sorted(os_vals)}",
            )
            self.assertTrue(
                {"x86_64", "arm64", "armv7", "armv6", "riscv64"}.issubset(arch_vals),
                f"install.sh ARCHIVE_ARCH branches incomplete: {sorted(arch_vals)}",
            )
            os_supported_arches = {
                "Linux": arch_vals,
                "Darwin": arch_vals & {"x86_64", "arm64"},
                "Freebsd": arch_vals & {"x86_64", "arm64", "armv7", "armv6"},
            }
            for os_val in os_vals:
                supported = os_supported_arches.get(os_val)
                self.assertIsNotNone(supported, f"Unexpected ARCHIVE_OS {os_val!r} in install.sh")
                for arch_val in supported:
                    candidate = f"malikclaw_{os_val}_{arch_val}.tar.gz"
                    self.assertIn(
                        candidate,
                        expected_assets,
                        f"install.sh ({os_val}, {arch_val}) resolves to {candidate!r}, missing from GoReleaser matrix",
                    )
            for arch_val in arch_vals:
                self.assertIn(
                    f"malikclaw_Linux_{arch_val}.tar.gz",
                    expected_assets,
                    f"install.sh ARCHIVE_ARCH={arch_val!r} has no matching GoReleaser Linux archive",
                )

        self.assertIn(".tar.gz", install_sh)
        self.assertIn("tar ", install_sh)

        self.assertNotRegex(
            install_ps1,
            re.compile(r"releases/(?:latest/download|download/[^/]+)/[^\s\"']*\.exe\b", re.IGNORECASE),
            "install.ps1 download URL must not target raw .exe binaries",
        )
        self.assertNotRegex(
            install_ps1,
            re.compile(r"\$\{?BINARY_NAME\}?-[^\s\"']*\.exe", re.IGNORECASE),
            "install.ps1 uses raw .exe asset naming",
        )
        literal_ps1_urls = re.findall(
            r"releases/(?:latest/download|download/[^/]+)/(malikclaw_Windows_[A-Za-z0-9_]+\.zip)",
            install_ps1,
        )
        param_ps1_match = re.search(
            r"releases/(?:latest/download|download/[^/]+)/\$\{?BINARY_NAME\}?_Windows_\$\{?archiveArch\}?\.zip",
            install_ps1,
        )
        self.assertTrue(
            bool(literal_ps1_urls) or param_ps1_match is not None,
            "install.ps1 download URL must target GoReleaser Windows zip archive (${BINARY_NAME}_Windows_${archiveArch}.zip)",
        )
        for asset_name in literal_ps1_urls:
            self.assertIn(asset_name, expected_assets)
        if param_ps1_match is not None:
            self.assertRegex(
                install_ps1,
                r'\$BINARY_NAME\s*=\s*["\']malikclaw["\']',
                "install.ps1 $BINARY_NAME must be 'malikclaw'",
            )
            ps_arches = set(
                re.findall(r'\$archiveArch\s*=\s*["\']([A-Za-z0-9_]+)["\']', install_ps1)
            )
            self.assertTrue(
                {"x86_64", "arm64"}.issubset(ps_arches),
                f"install.ps1 $archiveArch branches incomplete: {sorted(ps_arches)}",
            )
            for arch_val in ps_arches:
                win_zip = f"malikclaw_Windows_{arch_val}.zip"
                self.assertIn(
                    win_zip,
                    expected_assets,
                    f"install.ps1 Windows archive {win_zip!r} missing from GoReleaser matrix",
                )
            if "$wslDownloadUrl" in install_ps1:
                self.assertRegex(
                    install_ps1,
                    r"releases/(?:latest/download|download/[^/]+)/\$\{?BINARY_NAME\}?_Linux_\$\{?archiveArch\}?\.tar\.gz",
                    "install.ps1 WSL2 URL must target GoReleaser Linux tar.gz archive",
                )
                for arch_val in ps_arches:
                    linux_tgz = f"malikclaw_Linux_{arch_val}.tar.gz"
                    self.assertIn(
                        linux_tgz,
                        expected_assets,
                        f"install.ps1 WSL2 archive {linux_tgz!r} missing from GoReleaser matrix",
                    )

        self.assertIn(".zip", install_ps1)
        self.assertIn("Expand-Archive", install_ps1)

    def test_r1_06_live_github_v2_release_workflows_and_35_assets(self) -> None:
        root = helpers.get_repo_root()
        status, _, release = helpers.github_api_get(
            f"repos/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/releases/tags/{helpers.TARGET_TAG}"
        )
        self.assertEqual(
            status,
            200,
            f"GitHub Release {helpers.TARGET_TAG} returned HTTP {status}: {release}",
        )
        self.assertFalse(release.get("draft"), f"{helpers.TARGET_TAG} release is still draft")
        self.assertFalse(
            release.get("prerelease"), f"{helpers.TARGET_TAG} release is marked prerelease"
        )

        expected = helpers.expected_goreleaser_assets(helpers.TARGET_VERSION, root)
        actual_assets = {a["name"]: a for a in release.get("assets", [])}
        missing = sorted(expected - set(actual_assets))
        self.assertFalse(missing, f"Missing release assets for {helpers.TARGET_TAG}: {missing}")

        for name in sorted(expected):
            a = actual_assets[name]
            self.assertEqual(a.get("state"), "uploaded", f"{name} state != uploaded")
            self.assertGreater(a.get("size", 0), 0, f"{name} size <= 0")
            self.assertTrue(
                str(a.get("digest", "")).startswith("sha256:"),
                f"{name} missing sha256 digest: {a.get('digest')!r}",
            )

        tags_status, _, tags_data = helpers.github_api_get(
            f"repos/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/tags?per_page=30"
        )
        self.assertEqual(tags_status, 200, f"GitHub tags API failed: HTTP {tags_status}")
        tag_map = {t["name"]: t["commit"]["sha"] for t in tags_data}
        self.assertIn(
            helpers.TARGET_TAG,
            tag_map,
            f"Tag {helpers.TARGET_TAG} missing from GitHub tags",
        )
        target_sha = tag_map[helpers.TARGET_TAG]

        runs_status, _, runs_data = helpers.github_api_get(
            f"repos/{helpers.REPO_OWNER}/{helpers.REPO_NAME}/actions/runs?per_page=50"
        )
        self.assertEqual(runs_status, 200, f"GitHub Actions runs API failed: HTTP {runs_status}")
        latest_by_name: dict[str, dict] = {}
        for run in runs_data.get("workflow_runs", []):
            wf_name = run.get("name", "")
            head_sha = run.get("head_sha")
            head_branch = run.get("head_branch")
            if wf_name in ("CI", "build"):
                if head_branch == "main" and head_sha == target_sha and wf_name not in latest_by_name:
                    latest_by_name[wf_name] = run
            elif wf_name in ("Create Tag and Release", "Sync Version to Website"):
                if (
                    (head_sha == target_sha or head_branch == helpers.TARGET_TAG)
                    and wf_name not in latest_by_name
                ):
                    latest_by_name[wf_name] = run

        for required_wf in ("CI", "build", "Create Tag and Release", "Sync Version to Website"):
            self.assertIn(
                required_wf,
                latest_by_name,
                f"Workflow {required_wf!r} has no matching run for {helpers.TARGET_TAG} ({target_sha})",
            )
            run = latest_by_name[required_wf]
            self.assertEqual(
                run.get("status"),
                "completed",
                f"Workflow {required_wf!r} status={run.get('status')}",
            )
            self.assertEqual(
                run.get("conclusion"),
                "success",
                f"Workflow {required_wf!r} run {run.get('id')} conclusion={run.get('conclusion')}",
            )


class TestTier1R2Submissions(unittest.TestCase):
    AREAS = ("r2",)

    def test_r2_01_server_json_valid_and_2025_schema(self) -> None:
        root = helpers.get_repo_root()
        data = json.loads((root / "docs" / "submissions" / "server.json").read_text(encoding="utf-8"))
        self.assertEqual(
            data.get("$schema"),
            "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
        )
        self.assertEqual(data.get("name"), "io.github.AbdullahMalik17/malikclaw")
        self.assertEqual(data.get("title"), "MalikClaw")
        self.assertEqual(data.get("version"), helpers.TARGET_VERSION)
        self.assertEqual(data.get("websiteUrl"), "https://malikclaw.vercel.app")
        self.assertEqual(
            data.get("repository", {}).get("url"),
            f"https://github.com/{helpers.REPO_OWNER}/{helpers.REPO_NAME}",
        )
        self.assertEqual(data.get("repository", {}).get("source"), "github")

        packages = data.get("packages", [])
        self.assertTrue(packages)
        self.assertEqual(packages[0].get("registryType"), "oci")
        self.assertEqual(packages[0].get("transport", {}).get("type"), "stdio")

        remotes = data.get("remotes", [])
        self.assertTrue(remotes)
        self.assertEqual(remotes[0].get("type"), "streamable-http")
        self.assertEqual(remotes[0].get("url"), "http://localhost:18790/mcp")

    def test_r2_02_smithery_yaml_valid_and_schema_consistent(self) -> None:
        root = helpers.get_repo_root()
        data = yaml.safe_load(
            (root / "docs" / "submissions" / "smithery.yaml").read_text(encoding="utf-8")
        )
        self.assertIsInstance(data, dict)
        self.assertEqual(data.get("runtime"), "container")
        build = data.get("build", {})
        dockerfile = build.get("dockerfile", "")
        self.assertEqual(dockerfile, "Dockerfile")
        self.assertTrue((root / dockerfile).is_file(), f"Missing {dockerfile}")
        self.assertEqual(build.get("dockerBuildPath"), ".")

        start_cmd = data.get("startCommand", {})
        self.assertIn(start_cmd.get("type"), {"stdio", "http"})
        schema = start_cmd.get("configSchema", {})
        self.assertEqual(schema.get("type"), "object")
        props = schema.get("properties", {})
        example = start_cmd.get("exampleConfig", {})
        self.assertTrue(example, "smithery.yaml missing exampleConfig")
        self.assertTrue(set(example).issubset(set(props)))

        type_map = {"string": str, "boolean": bool, "integer": int, "number": (int, float)}
        for k, v in example.items():
            expected_type = type_map[props[k]["type"]]
            if props[k]["type"] == "integer":
                self.assertIsInstance(v, int)
                self.assertNotIsInstance(v, bool)
            else:
                self.assertIsInstance(v, expected_type, f"smithery.yaml exampleConfig.{k} type mismatch")

    def test_r2_03_software_malikclaw_yml_valid_and_selfhosted_compliant(self) -> None:
        root = helpers.get_repo_root()
        data = yaml.safe_load(
            (root / "docs" / "submissions" / "software-malikclaw.yml").read_text(encoding="utf-8")
        )
        allowed = {
            "name",
            "website_url",
            "source_code_url",
            "description",
            "licenses",
            "platforms",
            "tags",
            "depends_3rdparty",
            "documentation_url",
        }
        self.assertTrue(set(data).issubset(allowed), f"Unexpected keys: {set(data) - allowed}")
        self.assertEqual(data.get("name"), "MalikClaw")
        self.assertEqual(data.get("website_url"), "https://malikclaw.vercel.app")
        self.assertEqual(
            data.get("source_code_url"),
            f"https://github.com/{helpers.REPO_OWNER}/{helpers.REPO_NAME}",
        )
        self.assertEqual(
            data.get("documentation_url"),
            "https://malikclaw.vercel.app/docs/quick-start",
        )
        self.assertIn("MIT", data.get("licenses", []))
        self.assertIn("Docker", data.get("platforms", []))
        self.assertIn("Go", data.get("platforms", []))
        self.assertIs(data.get("depends_3rdparty"), False)

    def test_r2_04_mcp_directories_geo_word_counts_and_cli_commands(self) -> None:
        root = helpers.get_repo_root()
        text = (root / "docs" / "submissions" / "mcp-directories.md").read_text(encoding="utf-8")

        def _extract_section_words(pattern: str, label: str) -> int:
            m = re.search(pattern, text, flags=re.DOTALL)
            self.assertIsNotNone(m, f"Missing GEO section {label} in mcp-directories.md")
            body = re.sub(r"^>\s*", "", m.group(1).strip(), flags=re.MULTILINE)
            return len(body.split())

        mcp_market_wc = _extract_section_words(
            r"#### Canonical GEO Summary[^\n]*\n\n([^\n]+)",
            "MCP Market GEO Summary",
        )
        self.assertTrue(
            134 <= mcp_market_wc <= 167,
            f"MCP Market GEO Summary word count {mcp_market_wc} outside 134..167",
        )

        alt_wc = _extract_section_words(
            r"- \*\*GEO-Optimized Purpose / Description[^\n]*\n\s+([^\n]+)",
            "AlternativeTo GEO Description",
        )
        self.assertTrue(
            134 <= alt_wc <= 167,
            f"AlternativeTo GEO Description word count {alt_wc} outside 134..167",
        )

        open_wc = _extract_section_words(
            r"##### Opening Definition[^\n]*\n>\s*\*\*What is MalikClaw\?\*\*\s+([^\n]+)",
            "DEV.to Opening Definition",
        )
        # "What is MalikClaw?" is 3 words + body
        self.assertTrue(
            40 <= open_wc + 3 <= 60,
            f"DEV.to Opening Definition word count {open_wc + 3} outside 40..60",
        )

        norm_text = text.replace("\r\n", "\n")
        outline = norm_text.split("#### Passage-Optimized Article Outline")[1]
        h2_sections = [
            s
            for s in re.split(r"(?=^##### `## )", outline, flags=re.MULTILINE)
            if s.startswith("##### `## ")
            and "answer block" in s.splitlines()[0].lower()
        ]
        self.assertGreaterEqual(len(h2_sections), 4)
        for idx, sec in enumerate(h2_sections, start=1):
            q_m = re.search(r"^>\s*(.+)$", sec, flags=re.MULTILINE)
            self.assertIsNotNone(q_m, f"Missing blockquote in DEV.to GEO H2 block #{idx}")
            wc = len(q_m.group(1).strip().split())
            self.assertTrue(
                134 <= wc <= 167,
                f"DEV.to GEO H2 answer block #{idx} word count {wc} outside 134..167",
            )

        # Verify cited CLI subcommands in Part A & Part C against real compiled CLI
        exe = helpers.get_built_cli(repo_root=root)
        help_res = helpers.run_cli_isolated(exe, ["--help"])
        self.assertEqual(help_res.returncode, 0, help_res.stderr)
        avail_match = re.search(
            r"Available Commands:\s*\n(.*?)(?:\n\s*\n|\nFlags:)",
            help_res.stdout,
            flags=re.DOTALL,
        )
        self.assertIsNotNone(avail_match, f"Missing Available Commands section in --help:\n{help_res.stdout}")
        available_cmds = {
            line.strip().split()[0]
            for line in avail_match.group(1).splitlines()
            if line.strip()
        }
        self.assertTrue(available_cmds, "Parsed 0 CLI commands from Available Commands")
        part_a_c = text.split("## Part B")[0] + "\n" + text.split("## Part C")[1]
        cited = set(re.findall(r"malikclaw\s+([a-z][a-z0-9_-]*)", part_a_c))
        for subcmd in sorted(cited):
            if subcmd in {"mcp"}:  # gated note explicitly mentions mcp serve
                continue
            self.assertIn(
                subcmd,
                available_cmds,
                f"CLI command 'malikclaw {subcmd}' cited in mcp-directories.md missing from Available Commands {sorted(available_cmds)}",
            )

    def test_r2_05_awesome_list_prs_6_targets_and_v2_tag_status(self) -> None:
        root = helpers.get_repo_root()
        text = (root / "docs" / "submissions" / "awesome-list-prs.md").read_text(encoding="utf-8")
        expected_repos = [
            "punkpeye/awesome-mcp-clients",
            "e2b-dev/awesome-ai-agents",
            "aloth/awesome-ai-agents",
            "awesome-selfhosted/awesome-selfhosted-data",
            "avelino/awesome-go",
            "punkpeye/awesome-mcp-servers",
        ]
        for repo in expected_repos:
            self.assertIn(repo, text, f"Missing target repo {repo} in awesome-list-prs.md")

        self.assertNotIn("stops at `v0.2.4`", text)
        self.assertNotIn("scheduled for Milestone M6", text)
        self.assertIn("v2.0.0", text)

    def test_r2_06_submissions_no_brand_leaks_and_valid_https_urls(self) -> None:
        root = helpers.get_repo_root()
        sub_dir = root / "docs" / "submissions"
        files = sorted(sub_dir.iterdir())
        self.assertEqual(len(files), 5)

        for path in files:
            content = path.read_text(encoding="utf-8")
            self.assertNotIn("sipeed", content.lower(), f"Brand leak 'sipeed' in {path.name}")
            for lineno, line in enumerate(content.splitlines(), start=1):
                if "Alternatives To:" in line:
                    continue
                self.assertNotIn(
                    "picoclaw",
                    line.lower(),
                    f"Brand leak 'picoclaw' in {path.name}:{lineno}",
                )
            urls = re.findall(r"https?://[^\s\)\]\`\">,]+", content)
            self.assertTrue(urls, f"No URLs found in {path.name}")
            for url in urls:
                if url.startswith("http://"):
                    self.assertTrue(
                        url.startswith("http://localhost:18790")
                        or url.startswith("http://localhost:11434"),
                        f"Non-HTTPS external URL {url!r} in {path.name}",
                    )


class TestTier1R3Marketing(unittest.TestCase):
    AREAS = ("r3",)

    def _read_campaign(self) -> str:
        root = helpers.get_repo_root()
        return (root / "docs" / "MARKETING_CAMPAIGN_V2.md").read_text(encoding="utf-8")

    def test_r3_01_marketing_campaign_has_all_10_required_sections(self) -> None:
        text = self._read_campaign()
        for num in range(1, 11):
            self.assertRegex(
                text,
                rf"(?m)^##\s+{num}\.\s+",
                f"MARKETING_CAMPAIGN_V2.md missing section ## {num}.",
            )

        # Verify Reddit (3 subreddits), LinkedIn, and Urdu Community Kit are substantive & v2.0.0-aligned
        sec4 = text.split("## 4. Tailored Reddit")[1].split("## 5. LinkedIn")[0]
        for sub_idx, subreddit in (("4.1", "r/LocalLLaMA"), ("4.2", "r/golang"), ("4.3", "r/selfhosted")):
            m_sub = re.search(
                rf"### {re.escape(sub_idx)}\s+`{re.escape(subreddit)}`.*?\n(.*?)(?=\n### 4\.|\Z)",
                sec4,
                flags=re.DOTALL,
            )
            self.assertIsNotNone(m_sub, f"Missing Reddit subsection {sub_idx} {subreddit}")
            body = m_sub.group(1).strip()
            self.assertGreaterEqual(len(body), 200, f"Reddit {subreddit} copy is unexpectedly stubbed")
            self.assertIn(helpers.TARGET_TAG, body, f"Reddit {subreddit} missing {helpers.TARGET_TAG}")
            self.assertIn("AbdullahMalik17/malikclaw", body, f"Reddit {subreddit} missing repo link")
            self.assertIn("malikclaw.vercel.app", body, f"Reddit {subreddit} missing website link")

        sec5 = text.split("## 5. LinkedIn")[1].split("## 6. Product Hunt")[0].strip()
        self.assertGreaterEqual(len(sec5), 200, "LinkedIn Founder Story section is stubbed")
        self.assertIn(helpers.TARGET_TAG, sec5, "LinkedIn section missing v2.0.0")
        self.assertIn("AbdullahMalik17/malikclaw", sec5, "LinkedIn section missing repo link")
        self.assertIn("malikclaw.vercel.app", sec5, "LinkedIn section missing website link")

        sec8 = text.split("## 8. Regional / Urdu")[1].split("## 9. 14-Day")[0].strip()
        self.assertGreaterEqual(len(sec8), 200, "Urdu Community Kit section is stubbed")
        self.assertIn(helpers.TARGET_TAG, sec8, "Urdu Community Kit missing v2.0.0")
        self.assertIn("AbdullahMalik17/malikclaw", sec8, "Urdu Community Kit missing repo link")
        self.assertIn("malikclaw.vercel.app", sec8, "Urdu Community Kit missing website link")
        self.assertIn("آگے بڑھو", sec8, "Urdu Community Kit missing Urdu script copy")

    def test_r3_02_show_hn_title_and_hook_within_limits(self) -> None:
        text = self._read_campaign()
        hook_match = re.search(
            r"### 1\.1 One-Line Hook[^\n]*\n>\s*\*\*(.+?)\*\*",
            text,
        )
        self.assertIsNotNone(hook_match, "Missing 1.1 One-Line Hook")
        hook = hook_match.group(1).replace("`", "").strip()
        self.assertLessEqual(len(hook.split()), 12, f"Hook exceeds 12 words: {hook!r}")

        hn_match = re.search(
            r"### Title[^\n]*\n```text\n([^\n]+)\n```",
            text,
        )
        self.assertIsNotNone(hn_match, "Missing Show HN Title")
        hn_title = hn_match.group(1).strip()
        self.assertLessEqual(
            len(hn_title),
            80,
            f"Show HN title exceeds 80 chars ({len(hn_title)}): {hn_title!r}",
        )

    def test_r3_03_all_9_tweets_within_280_chars(self) -> None:
        text = self._read_campaign()
        sec3 = text.split("## 3. X / Twitter 9-Tweet Launch Thread")[1].split("## 4. Tailored Reddit")[0]
        tweets = re.findall(
            r"\*\*Tweet (\d+)[^\n]*\*\*\s*\n((?:>.*\n?)+)",
            sec3,
        )
        self.assertEqual(len(tweets), 9, f"Expected 9 tweets, found {len(tweets)}")
        for num, raw_block in tweets:
            lines = [re.sub(r"^>\s?", "", ln) for ln in raw_block.strip().splitlines()]
            body = "\n".join(lines).strip()
            self.assertGreater(len(body), 0, f"Tweet {num} empty")
            self.assertLessEqual(
                len(body),
                280,
                f"Tweet {num} exceeds 280 chars ({len(body)}): {body!r}",
            )

    def test_r3_04_product_hunt_tagline_desc_and_5_gallery_slides(self) -> None:
        text = self._read_campaign()
        tagline_m = re.search(r"\*\*Tagline[^\n]*:\*\*\s*`([^`]+)`", text)
        self.assertIsNotNone(tagline_m, "Missing Product Hunt Tagline")
        tagline = tagline_m.group(1).strip()
        self.assertLessEqual(len(tagline), 60, f"PH Tagline {len(tagline)} > 60: {tagline!r}")

        desc_m = re.search(r"\*\*Short Description[^\n]*:\*\*\s*`([^`]+)`", text)
        self.assertIsNotNone(desc_m, "Missing Product Hunt Short Description")
        desc = desc_m.group(1).strip()
        self.assertLessEqual(len(desc), 260, f"PH Short Description {len(desc)} > 260")

        slides = re.findall(r"(?m)^\d+\.\s+\*\*Slide (\d+)\s+—", text)
        self.assertEqual(slides, ["1", "2", "3", "4", "5"])

    def test_r3_05_launch_calendar_14_days_and_no_unexpected_placeholders(self) -> None:
        text = self._read_campaign()
        cal = text.split("## 9. 14-Day Step-by-Step Launch Calendar")[1].split("## 10. Social Preview")[0]
        days = re.findall(r"\|\s*\*\*Day (\d+)[^|]*\|", cal)
        self.assertEqual([int(d) for d in days], list(range(1, 15)))

        days_1_to_13 = cal.split("**Day 14")[0]
        self.assertNotIn("[INSERT", days_1_to_13)
        self.assertNotIn("TBD", days_1_to_13)

    def test_r3_06_visual_assets_binary_dimensions(self) -> None:
        root = helpers.get_repo_root()
        checks = [
            (root / "assets" / "social-preview.png", 1280, 640, "PNG"),
            (root / "website" / "public" / "assets" / "og-banner.png", 1200, 630, "PNG"),
            (root / "assets" / "logo.png", 640, 640, "PNG"),
            (root / "website" / "public" / "assets" / "logo.png", 640, 640, "PNG"),
            (root / "assets" / "demo.gif", 900, 520, "GIF89a"),
        ]
        for path, exp_w, exp_h, exp_fmt in checks:
            w, h, fmt = helpers.read_image_dimensions(path)
            self.assertEqual(fmt, exp_fmt, f"{path} format {fmt} != {exp_fmt}")
            self.assertEqual((w, h), (exp_w, exp_h), f"{path} dims {w}x{h} != {exp_w}x{exp_h}")


class TestTier1R4Website(unittest.TestCase):
    AREAS = ("r4",)

    def test_r4_01_website_typescript_typecheck_exits_0(self) -> None:
        proc = helpers.run_website_tsc()
        self.assertEqual(proc.returncode, 0, f"tsc --noEmit failed:\n{proc.stdout}\n{proc.stderr}")

    def test_r4_02_website_eslint_exits_0(self) -> None:
        proc = helpers.run_website_lint()
        self.assertEqual(proc.returncode, 0, f"npm run lint failed:\n{proc.stdout}\n{proc.stderr}")

    def test_r4_03_website_production_build_creates_build_id(self) -> None:
        root = helpers.get_repo_root()
        rc, out, err = helpers.run_website_build(root)
        self.assertEqual(rc, 0, f"website npm run build failed:\n{out}\n{err}")
        self.assertTrue((root / "website" / ".next" / "BUILD_ID").is_file())

    def test_r4_04_website_self_contained_docs_dir_exists(self) -> None:
        root = helpers.get_repo_root()
        docs_dir = root / "website" / "docs"
        self.assertTrue(
            docs_dir.is_dir(),
            "website/docs/ missing: Vercel build with Root Directory=website cannot resolve docs self-containedly",
        )
        for slug, rel_file in helpers.parse_static_doc_slugs(root).items():
            self.assertTrue(
                (docs_dir / rel_file).is_file(),
                f"website/docs/{rel_file} missing for /docs/{slug}",
            )
        for ch in helpers.parse_channel_doc_slugs(root):
            candidates = [
                docs_dir / "channels" / ch / "README.md",
                docs_dir / "channels" / ch / "README.ur.md",
                docs_dir / "channels" / ch / f"{ch}_app" / "README.ur.md",
            ]
            self.assertTrue(
                any(c.is_file() for c in candidates),
                f"No channel doc found inside website/docs/channels/{ch}",
            )

    def test_r4_05_next_prerendered_html_includes_static_docs_and_12_channels(self) -> None:
        root = helpers.get_repo_root()
        helpers.ensure_website_built(root)
        app_out = root / "website" / ".next" / "server" / "app"

        static_html = [
            app_out / "index.html",
            app_out / "download.html",
            app_out / "trust.html",
            app_out / "docs.html",
            app_out / "docs" / "installation.html",
            app_out / "docs" / "installation" / "windows.html",
            app_out / "docs" / "installation" / "macos.html",
            app_out / "docs" / "installation" / "linux.html",
            app_out / "docs" / "installation" / "android.html",
        ]
        for p in static_html:
            self.assertTrue(p.is_file(), f"Missing prerendered HTML: {p}")

        for slug in helpers.parse_static_doc_slugs(root):
            html_file = app_out / "docs" / Path(f"{slug}.html")
            self.assertTrue(html_file.is_file(), f"Missing prerendered doc HTML: {html_file}")

        channels = helpers.parse_channel_doc_slugs(root)
        self.assertGreaterEqual(len(channels), 12)
        for ch in channels:
            ch_html = app_out / "docs" / "channels" / f"{ch}.html"
            self.assertTrue(
                ch_html.is_file(),
                f"Channel /docs/channels/{ch} not statically prerendered at {ch_html}",
            )

    def test_r4_06_website_package_version_and_deployment_doc_gemini_key(self) -> None:
        root = helpers.get_repo_root()
        pkg = json.loads((root / "website" / "package.json").read_text(encoding="utf-8"))
        self.assertEqual(pkg.get("version"), helpers.TARGET_VERSION)

        version_ts = (root / "website" / "src" / "lib" / "version.ts").read_text(encoding="utf-8")
        self.assertIn(helpers.TARGET_TAG, version_ts)

        deploy_md = (root / "website" / "DEPLOYMENT.md").read_text(encoding="utf-8")
        self.assertTrue(
            "GEMINI_API_KEY" in deploy_md or "GOOGLE_API_KEY" in deploy_md,
            "website/DEPLOYMENT.md must document GEMINI_API_KEY / GOOGLE_API_KEY for /api/chat",
        )


if __name__ == "__main__":
    unittest.main()
