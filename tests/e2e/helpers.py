"""Shared opaque-box helpers for MalikClaw v2.0.0 E2E tests (Tiers 1-4)."""

from __future__ import annotations

import atexit
from contextlib import contextmanager
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import socket
import struct
import subprocess
import tempfile
import time
from typing import Any, Iterator
import urllib.error
import urllib.parse
import urllib.request

import yaml

REPO_OWNER = "AbdullahMalik17"
REPO_NAME = "malikclaw"
TARGET_TAG = "v2.0.0"
TARGET_VERSION = "2.0.0"
DEFAULT_VERCEL_URL = "https://malikclaw.vercel.app"

_GITHUB_CACHE: dict[tuple[str, bool], tuple[int, dict[str, str], Any]] = {}
_BUILT_CLI_CACHE: dict[tuple[str, str], Path] = {}
_WEBSITE_BUILD_CACHE: dict[str, tuple[int, str, str]] = {}
_MANAGED_TEMP_DIRS: list[Path] = []


def _cleanup_temp_dirs() -> None:
    for d in _MANAGED_TEMP_DIRS:
        shutil.rmtree(d, ignore_errors=True)


atexit.register(_cleanup_temp_dirs)


def get_repo_root() -> Path:
    """Resolve repository root dynamically, honoring MALIKCLAW_E2E_REPO_ROOT."""
    override = os.environ.get("MALIKCLAW_E2E_REPO_ROOT", "").strip()
    if override:
        return Path(override).resolve()
    return Path(__file__).resolve().parent.parent.parent


def strip_shell_comments(text: str) -> str:
    """Strip # comments from bash/PowerShell scripts while preserving #! shebangs and quoted #."""
    out_lines: list[str] = []
    for line in text.splitlines(keepends=True):
        if line.startswith("#!"):
            out_lines.append(line)
            continue
        in_single = False
        in_double = False
        escaped = False
        cut_idx: int | None = None
        for idx, ch in enumerate(line):
            if escaped:
                escaped = False
                continue
            if ch in ("\\", "`") and not in_single:
                escaped = True
                continue
            if ch == "'" and not in_double:
                in_single = not in_single
                continue
            if ch == '"' and not in_single:
                in_double = not in_double
                continue
            if ch == "#" and not in_single and not in_double:
                if idx == 0 or line[idx - 1].isspace():
                    cut_idx = idx
                    break
        if cut_idx is not None:
            eol = "\r\n" if line.endswith("\r\n") else ("\n" if line.endswith("\n") else "")
            out_lines.append(line[:cut_idx].rstrip() + eol)
        else:
            out_lines.append(line)
    return "".join(out_lines)


def _resolve_exe(cmd: str) -> str:
    resolved = shutil.which(cmd)
    if resolved:
        return resolved
    return cmd


def run_subprocess(
    args: list[str],
    *,
    cwd: Path | None = None,
    env_overrides: dict[str, str | None] | None = None,
    timeout: int = 120,
) -> subprocess.CompletedProcess[str]:
    """Run a subprocess cleanly without shell injection."""
    cmd = [_resolve_exe(args[0]), *args[1:]]
    env = os.environ.copy()
    if env_overrides:
        for k, v in env_overrides.items():
            if v is None:
                env.pop(k, None)
            else:
                env[k] = v
    return subprocess.run(
        cmd,
        cwd=str(cwd) if cwd else None,
        env=env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )


class _NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # type: ignore[override]
        return None


def http_request(
    url: str,
    *,
    method: str = "GET",
    data: bytes | None = None,
    headers: dict[str, str] | None = None,
    follow_redirects: bool = True,
    timeout: int = 20,
) -> tuple[int, dict[str, str], bytes]:
    """Perform an HTTP request via stdlib urllib.request (never curl.exe or node fetch)."""
    req_headers = {"User-Agent": "MalikClaw-E2E/2.0.0"}
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, data=data, headers=req_headers, method=method)
    hostname = (urllib.parse.urlparse(url).hostname or "").lower()
    handlers: list[urllib.request.BaseHandler] = []
    if hostname in {"127.0.0.1", "localhost", "::1"}:
        handlers.append(urllib.request.ProxyHandler({}))
    if not follow_redirects:
        handlers.append(_NoRedirectHandler())
    opener = urllib.request.build_opener(*handlers)
    try:
        with opener.open(req, timeout=timeout) as resp:
            resp_headers = {k.lower(): v for k, v in resp.headers.items()}
            return resp.status, resp_headers, resp.read()
    except urllib.error.HTTPError as exc:
        resp_headers = {k.lower(): v for k, v in exc.headers.items()} if exc.headers else {}
        body = b""
        try:
            body = exc.read()
        except Exception:
            pass
        finally:
            try:
                exc.close()
            except Exception:
                pass
        return exc.code, resp_headers, body


def github_api_get(path_or_url: str, *, timeout: int = 20) -> tuple[int, dict[str, str], Any]:
    """Cached GitHub REST API GET with optional GITHUB_TOKEN/GH_TOKEN Bearer auth."""
    url = (
        path_or_url
        if path_or_url.startswith("http")
        else f"https://api.github.com/{path_or_url.lstrip('/')}"
    )
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN") or ""
    cache_key = (url, bool(token))
    if cache_key in _GITHUB_CACHE:
        return _GITHUB_CACHE[cache_key]

    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    status, resp_headers, raw = http_request(url, headers=headers, timeout=timeout)
    text = raw.decode("utf-8", errors="replace")
    parsed: Any
    try:
        parsed = json.loads(text) if text.strip() else None
    except json.JSONDecodeError:
        parsed = text

    result = (status, resp_headers, parsed)
    if status == 200:
        _GITHUB_CACHE[cache_key] = result
    return result


def parse_goreleaser_config(repo_root: Path | None = None) -> dict[str, Any]:
    root = repo_root or get_repo_root()
    cfg_path = root / ".goreleaser.yaml"
    data = yaml.safe_load(cfg_path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise AssertionError(f"{cfg_path} did not parse into a YAML mapping")
    return data


# Go OS/Arch pairs supported by Go toolchain for GoReleaser builds[0]
_GO_SUPPORTED_COMBOS: dict[str, list[tuple[str, str]]] = {
    "darwin": [("amd64", ""), ("arm64", "")],
    "freebsd": [("amd64", ""), ("arm64", ""), ("arm", "6"), ("arm", "7")],
    "linux": [
        ("amd64", ""),
        ("arm64", ""),
        ("arm", "6"),
        ("arm", "7"),
        ("loong64", ""),
        ("mipsle", ""),
        ("riscv64", ""),
        ("s390x", ""),
    ],
    "netbsd": [("amd64", ""), ("arm64", "")],
    "windows": [("amd64", ""), ("arm64", "")],
}


def expected_goreleaser_assets(
    version: str = TARGET_VERSION,
    repo_root: Path | None = None,
) -> set[str]:
    """Generate the exact 35-asset matrix from .goreleaser.yaml for v<version>."""
    cfg = parse_goreleaser_config(repo_root)
    builds = cfg.get("builds", [])
    if not builds:
        raise AssertionError(".goreleaser.yaml missing builds section")
    primary = builds[0]
    project_name = primary.get("id", "malikclaw")

    goos_list = set(primary.get("goos", []))
    goarch_list = set(primary.get("goarch", []))
    goarm_list = {str(a) for a in primary.get("goarm", [])}
    ignored = {
        (item.get("goos"), item.get("goarch"))
        for item in primary.get("ignore", [])
        if isinstance(item, dict)
    }

    archives_cfg = cfg.get("archives", [{}])[0]
    win_formats = ["zip"]
    for ov in archives_cfg.get("format_overrides", []):
        if ov.get("goos") == "windows":
            win_formats = ov.get("formats", ["zip"])

    assets: set[str] = {f"{project_name}_{version}_checksums.txt"}

    for goos in sorted(goos_list):
        for goarch, goarm in _GO_SUPPORTED_COMBOS.get(goos, []):
            if goarch not in goarch_list:
                continue
            if goarm and goarm not in goarm_list:
                continue
            if (goos, goarch) in ignored:
                continue
            arch_label = "x86_64" if goarch == "amd64" else ("i386" if goarch == "386" else goarch)
            if goarm:
                arch_label = f"{arch_label}v{goarm}"
            ext = win_formats[0] if goos == "windows" else "tar.gz"
            assets.add(f"{project_name}_{goos.capitalize()}_{arch_label}.{ext}")

    nfpms_cfg = cfg.get("nfpms", [{}])[0]
    pkg_name = nfpms_cfg.get("package_name", project_name)
    nfpm_formats = nfpms_cfg.get("formats", ["rpm", "deb"])
    if "linux" in goos_list:
        for goarch, goarm in _GO_SUPPORTED_COMBOS["linux"]:
            if goarch not in goarch_list:
                continue
            if goarm and goarm not in goarm_list:
                continue
            if ("linux", goarch) in ignored:
                continue
            if goarch == "amd64":
                pkg_arch = "x86_64"
            elif goarch == "arm64":
                pkg_arch = "aarch64"
            elif goarch == "arm":
                pkg_arch = f"armv{goarm}"
            else:
                pkg_arch = goarch
            for fmt in nfpm_formats:
                assets.add(f"{pkg_name}_{pkg_arch}.{fmt}")

    return assets


def read_image_dimensions(path: Path) -> tuple[int, int, str]:
    """Read PNG (IHDR 16..24 BE uint32) or GIF (6..10 LE uint16) dimensions without PIL."""
    if not path.is_file():
        raise FileNotFoundError(f"Visual asset missing: {path}")
    data = path.read_bytes()
    if len(data) < 24:
        raise ValueError(f"Asset too small ({len(data)} bytes): {path}")

    if data[:8] == b"\x89PNG\r\n\x1a\n":
        if data[12:16] != b"IHDR":
            raise ValueError(f"PNG missing IHDR chunk at offset 12: {path}")
        width, height = struct.unpack(">II", data[16:24])
        return width, height, "PNG"

    if data[:6] in (b"GIF87a", b"GIF89a"):
        width, height = struct.unpack("<HH", data[6:10])
        return width, height, data[:6].decode("ascii")

    raise ValueError(f"Unsupported image header {data[:8]!r} in {path}")


def build_malikclaw_cli(
    out_dir: Path,
    *,
    version: str = TARGET_VERSION,
    repo_root: Path | None = None,
) -> Path:
    """Compile ./cmd/malikclaw into out_dir with ldflags Version=<version>."""
    root = repo_root or get_repo_root()
    exe_name = "malikclaw.exe" if os.name == "nt" else "malikclaw"
    out_path = out_dir / exe_name
    ldflags = f"-X github.com/AbdullahMalik17/malikclaw/pkg/config.Version={version}"
    proc = run_subprocess(
        ["go", "build", "-ldflags", ldflags, "-o", str(out_path), "./cmd/malikclaw"],
        cwd=root,
        timeout=180,
    )
    if proc.returncode != 0:
        raise AssertionError(
            f"go build ./cmd/malikclaw failed (exit {proc.returncode}):\n"
            f"STDOUT:\n{proc.stdout}\nSTDERR:\n{proc.stderr}"
        )
    return out_path


def get_built_cli(
    *,
    version: str = TARGET_VERSION,
    repo_root: Path | None = None,
) -> Path:
    """Return a cached compiled malikclaw binary in a managed temp dir."""
    root = repo_root or get_repo_root()
    key = (str(root), version)
    cached = _BUILT_CLI_CACHE.get(key)
    if cached and cached.is_file():
        return cached
    tmp_dir = Path(tempfile.mkdtemp(prefix="malikclaw_e2e_cli_"))
    _MANAGED_TEMP_DIRS.append(tmp_dir)
    exe = build_malikclaw_cli(tmp_dir, version=version, repo_root=root)
    _BUILT_CLI_CACHE[key] = exe
    return exe


def run_cli_isolated(
    exe_path: Path,
    args: list[str],
    *,
    home_dir: Path | None = None,
    extra_env: dict[str, str | None] | None = None,
    timeout: int = 30,
) -> subprocess.CompletedProcess[str]:
    """Execute malikclaw binary in an isolated HOME/USERPROFILE/MALIKCLAW_HOME."""
    owned_tmp: Path | None = None
    if home_dir is None:
        owned_tmp = Path(tempfile.mkdtemp(prefix="malikclaw_e2e_home_"))
        home_dir = owned_tmp
    try:
        env: dict[str, str | None] = {
            "HOME": str(home_dir),
            "USERPROFILE": str(home_dir),
            "MALIKCLAW_HOME": str(home_dir / ".malikclaw"),
            "MALIKCLAW_CONFIG": None,
        }
        if extra_env:
            env.update(extra_env)
        return run_subprocess([str(exe_path), *args], cwd=home_dir, env_overrides=env, timeout=timeout)
    finally:
        if owned_tmp is not None:
            shutil.rmtree(owned_tmp, ignore_errors=True)


def run_go_probe(
    main_go_source: str,
    *,
    repo_root: Path | None = None,
    timeout: int = 120,
) -> subprocess.CompletedProcess[str]:
    """Compile and run a temporary Go probe outside the repo using go.mod replace."""
    root = repo_root or get_repo_root()
    root_posix = root.as_posix()
    with tempfile.TemporaryDirectory(prefix="malikclaw_e2e_goprobe_") as tmp:
        tmp_path = Path(tmp)
        go_mod_src = (root / "go.mod").read_text(encoding="utf-8")
        go_mod_rewritten = re.sub(
            r"^module\s+\S+",
            "module malikclawe2eprobe",
            go_mod_src,
            count=1,
            flags=re.MULTILINE,
        )
        go_mod_rewritten += (
            f"\nrequire github.com/AbdullahMalik17/malikclaw v0.0.0\n"
            f'replace github.com/AbdullahMalik17/malikclaw => "{root_posix}"\n'
        )
        (tmp_path / "go.mod").write_text(go_mod_rewritten, encoding="utf-8")
        shutil.copy2(root / "go.sum", tmp_path / "go.sum")
        (tmp_path / "main.go").write_text(main_go_source, encoding="utf-8")
        return run_subprocess(["go", "run", "."], cwd=tmp_path, timeout=timeout)


def check_powershell_ast(ps1_path: Path) -> None:
    """Validate PowerShell syntax using System.Management.Automation.Language.Parser."""
    escaped = str(ps1_path).replace("'", "''")
    script = (
        f"$tokens = $null; $errors = $null; "
        f"[void][System.Management.Automation.Language.Parser]::ParseFile('{escaped}', [ref]$tokens, [ref]$errors); "
        f"if ($errors -and $errors.Count -gt 0) {{ "
        f"  $errors | ForEach-Object {{ Write-Error $_.ToString() }}; exit 1 "
        f"}}"
    )
    proc = run_subprocess(
        ["powershell", "-NoProfile", "-NonInteractive", "-Command", script],
        timeout=30,
    )
    if proc.returncode != 0:
        raise AssertionError(
            f"PowerShell AST parse failed for {ps1_path}:\n{proc.stdout}\n{proc.stderr}"
        )


def run_website_tsc(repo_root: Path | None = None) -> subprocess.CompletedProcess[str]:
    root = repo_root or get_repo_root()
    return run_subprocess(["npx", "tsc", "--noEmit"], cwd=root / "website", timeout=120)


def run_website_lint(repo_root: Path | None = None) -> subprocess.CompletedProcess[str]:
    root = repo_root or get_repo_root()
    return run_subprocess(["npm", "run", "lint"], cwd=root / "website", timeout=120)


def run_website_build(
    repo_root: Path | None = None,
    *,
    force: bool = False,
) -> tuple[int, str, str]:
    """Run `npm run build` (`node scripts/run-build.js`) in website/, cached per repo_root."""
    root = repo_root or get_repo_root()
    key = str(root)
    if not force and key in _WEBSITE_BUILD_CACHE:
        return _WEBSITE_BUILD_CACHE[key]
    proc = run_subprocess(["npm", "run", "build"], cwd=root / "website", timeout=300)
    res = (proc.returncode, proc.stdout, proc.stderr)
    if proc.returncode == 0:
        _WEBSITE_BUILD_CACHE[key] = res
    return res


def ensure_website_built(repo_root: Path | None = None) -> None:
    root = repo_root or get_repo_root()
    key = str(root)
    if key in _WEBSITE_BUILD_CACHE:
        return
    rc, out, err = run_website_build(root)
    if rc != 0:
        raise AssertionError(f"website npm run build failed (exit {rc}):\n{out}\n{err}")


def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return int(s.getsockname()[1])


@contextmanager
def next_start_server(
    repo_root: Path | None = None,
    *,
    env_overrides: dict[str, str | None] | None = None,
    startup_timeout: int = 30,
) -> Iterator[str]:
    """Boot `next start -p <free_port>` in website/ and guarantee clean teardown."""
    root = repo_root or get_repo_root()
    website_dir = root / "website"
    ensure_website_built(root)

    next_bin = website_dir / "node_modules" / "next" / "dist" / "bin" / "next"
    if not next_bin.is_file():
        raise AssertionError(f"Next.js binary not found: {next_bin}")

    port = _free_port()
    env = os.environ.copy()
    if env_overrides:
        for k, v in env_overrides.items():
            if v is None:
                env.pop(k, None)
            else:
                env[k] = v

    proc = subprocess.Popen(
        [_resolve_exe("node"), str(next_bin), "start", "-H", "127.0.0.1", "-p", str(port)],
        cwd=str(website_dir),
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    base_url = f"http://127.0.0.1:{port}"
    deadline = time.monotonic() + startup_timeout
    try:
        ready = False
        while time.monotonic() < deadline:
            if proc.poll() is not None:
                out, err = proc.communicate(timeout=5)
                raise AssertionError(
                    f"next start exited prematurely ({proc.returncode}):\n{out}\n{err}"
                )
            try:
                status, _, _ = http_request(f"{base_url}/", timeout=2)
                if status == 200:
                    ready = True
                    break
            except Exception:
                pass
            time.sleep(0.3)

        if not ready:
            raise AssertionError(f"next start did not become ready on {base_url} within {startup_timeout}s")

        yield base_url
    finally:
        if proc.poll() is None:
            proc.terminate()
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                if os.name == "nt":
                    subprocess.run(
                        ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                        capture_output=True,
                        timeout=5,
                    )
                else:
                    proc.kill()
                try:
                    proc.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    pass
        if proc.stdout:
            proc.stdout.close()
        if proc.stderr:
            proc.stderr.close()


def verify_release_asset_download(
    asset: dict[str, Any],
    *,
    expected_sha256: str | None = None,
) -> dict[str, Any]:
    """Verify release asset metadata, 302 CDN redirect, and download/checksum when unblocked."""
    name = asset.get("name", "<unknown>")
    if asset.get("state") != "uploaded":
        raise AssertionError(f"Asset {name} state is {asset.get('state')!r}, expected 'uploaded'")
    if not isinstance(asset.get("size"), int) or asset["size"] <= 0:
        raise AssertionError(f"Asset {name} has invalid size: {asset.get('size')!r}")
    digest = asset.get("digest", "")
    if not isinstance(digest, str) or not digest.startswith("sha256:") or len(digest) < 71:
        raise AssertionError(f"Asset {name} missing sha256 digest: {digest!r}")

    dl_url = asset.get("browser_download_url", "")
    if not dl_url:
        raise AssertionError(f"Asset {name} missing browser_download_url")

    status, headers, _ = http_request(dl_url, follow_redirects=False, timeout=20)
    if status == 404:
        raise AssertionError(f"Asset {name} download URL returned HTTP 404: {dl_url}")
    if status in (301, 302, 303, 307, 308):
        loc = headers.get("location", "")
        loc_host = (urllib.parse.urlparse(loc).hostname or "").lower()
        if not (
            loc_host in {"release-assets.githubusercontent.com", "objects.githubusercontent.com"}
            or loc_host.endswith(".githubusercontent.com")
        ):
            raise AssertionError(f"Asset {name} redirect location unexpected: {loc!r}")
    elif status != 200:
        raise AssertionError(f"Asset {name} unexpected initial HTTP {status} for {dl_url}")

    dl_status, _, raw_bytes = http_request(dl_url, follow_redirects=True, timeout=60)
    if dl_status == 404:
        raise AssertionError(f"Asset {name} CDN download returned HTTP 404: {dl_url}")

    if (
        dl_status == 403
        and "not allowed by policy" in raw_bytes.decode("utf-8", errors="replace").lower()
        and os.environ.get("E2E_REQUIRE_CDN_DOWNLOAD") != "1"
    ):
        return {
            "name": name,
            "cdn_blocked": True,
            "api_digest": digest,
            "size": asset["size"],
        }

    if dl_status != 200:
        raise AssertionError(f"Asset {name} download failed with HTTP {dl_status} from {dl_url}")

    actual_sha = "sha256:" + hashlib.sha256(raw_bytes).hexdigest()
    if actual_sha != digest:
        raise AssertionError(
            f"Asset {name} downloaded SHA-256 {actual_sha} != GitHub API digest {digest}"
        )
    if expected_sha256 and actual_sha != f"sha256:{expected_sha256}":
        raise AssertionError(
            f"Asset {name} downloaded SHA-256 {actual_sha} != checksums.txt {expected_sha256}"
        )
    return {
        "name": name,
        "cdn_blocked": False,
        "api_digest": digest,
        "bytes": raw_bytes,
    }


def parse_sitemap_paths(repo_root: Path | None = None) -> list[str]:
    """Parse canonical route paths from website/src/app/sitemap.ts."""
    root = repo_root or get_repo_root()
    sitemap_src = (root / "website" / "src" / "app" / "sitemap.ts").read_text(encoding="utf-8")
    paths = re.findall(r'\{\s*path:\s*"([^"]*)"', sitemap_src)
    if not paths:
        raise AssertionError("Failed to parse routes from website/src/app/sitemap.ts")
    return ["/" if p == "" else p for p in paths]


def parse_static_doc_slugs(repo_root: Path | None = None) -> dict[str, str]:
    """Parse STATIC_MAPPING slug -> doc relative file from website/src/app/docs/[...slug]/page.tsx."""
    root = repo_root or get_repo_root()
    page_src = (
        root / "website" / "src" / "app" / "docs" / "[...slug]" / "page.tsx"
    ).read_text(encoding="utf-8")
    block_match = re.search(
        r"const\s+STATIC_MAPPING[^=]*=\s*\{(.*?)\n\};",
        page_src,
        flags=re.DOTALL,
    )
    if not block_match:
        raise AssertionError("Could not locate STATIC_MAPPING in docs/[...slug]/page.tsx")
    entries = re.findall(
        r'"([^"]+)":\s*\{\s*file:\s*"([^"]+)"',
        block_match.group(1),
    )
    if not entries:
        raise AssertionError("STATIC_MAPPING parsed 0 entries")
    return dict(entries)


def parse_channel_doc_slugs(repo_root: Path | None = None) -> list[str]:
    """Parse /docs/channels/<id> slugs from website/src/app/docs/layout.tsx."""
    root = repo_root or get_repo_root()
    layout_src = (root / "website" / "src" / "app" / "docs" / "layout.tsx").read_text(encoding="utf-8")
    channels = re.findall(r'href:\s*"/docs/channels/([a-z0-9_-]+)"', layout_src)
    if not channels:
        raise AssertionError("Could not find /docs/channels/* entries in docs/layout.tsx")
    return channels


def verify_external_url(url: str, *, allow_sandbox_policy_block: bool = True) -> dict[str, Any]:
    """Check HTTP 200 on an external URL, honoring explicit sandbox egress policy blocks."""
    status, headers, raw = http_request(url, timeout=20)
    body = raw.decode("utf-8", errors="replace")
    if status == 200:
        return {"url": url, "status": 200, "sandbox_blocked": False, "body": body}
    if (
        allow_sandbox_policy_block
        and status == 403
        and "not allowed by policy" in body.lower()
        and os.environ.get("E2E_REQUIRE_EXTERNAL_URLS") != "1"
    ):
        return {"url": url, "status": 403, "sandbox_blocked": True, "body": body}
    raise AssertionError(f"GET {url} failed with HTTP {status}: {body[:200]}")


def check_live_vercel_or_package(repo_root: Path | None = None) -> dict[str, Any]:
    """Verify live Vercel endpoints and either live M2 updates or full deployment readiness."""
    root = repo_root or get_repo_root()
    base_url = os.environ.get("VERCEL_TEST_URL", DEFAULT_VERCEL_URL).rstrip("/")
    key_routes = [
        "/",
        "/download",
        "/trust",
        "/docs",
        "/docs/quick-start",
        "/docs/installation",
        "/docs/installation/linux",
        "/docs/installation/android",
        "/docs/channels/whatsapp",
        "/robots.txt",
        "/sitemap.xml",
        "/llms.txt",
        "/assets/og-banner.png",
    ]

    require_live_updated = (
        os.environ.get("E2E_REQUIRE_LIVE_UPDATED") == "1"
        or bool(os.environ.get("VERCEL_TOKEN"))
    )

    bodies: dict[str, str] = {}
    sandbox_blocked = False
    error_markers = (
        "__next_error__",
        "Application error",
        "NEXT_NOT_FOUND",
        "404: This page could not be found",
    )
    for route in key_routes:
        status, _, raw = http_request(f"{base_url}{route}", timeout=25)
        text = raw.decode("utf-8", errors="replace")
        if status == 403 and "not allowed by policy" in text.lower() and not require_live_updated:
            sandbox_blocked = True
            break
        if status != 200:
            raise AssertionError(f"Live Vercel {base_url}{route} returned HTTP {status} (expected 200)")
        if route != "/assets/og-banner.png":
            for marker in error_markers:
                if marker in text:
                    raise AssertionError(
                        f"Live Vercel {base_url}{route} returned HTTP 200 with error marker {marker!r}"
                    )
        if route.startswith("/docs/installation/") or route == "/download" or route == "/":
            bodies[route] = text

    live_updated = False
    if not sandbox_blocked:
        if "MalikClaw v2.0.0" not in bodies.get("/", ""):
            raise AssertionError(f"Live {base_url}/ missing 'MalikClaw v2.0.0'")
        android_html = bodies.get("/docs/installation/android", "")
        download_html = bodies.get("/download", "")
        live_updated = (
            "malikclaw_Linux_arm64.tar.gz" in android_html
            and "malikclaw_amd64.deb" not in download_html
        )

    if require_live_updated and not live_updated:
        raise AssertionError(
            f"Live Vercel {base_url} still serves pre-M2 links while E2E_REQUIRE_LIVE_UPDATED/VERCEL_TOKEN is set"
        )

    if not live_updated:
        # Must verify full deployment package readiness when live is pre-M2 or sandbox-blocked
        website_dir = root / "website"
        if not (website_dir / "docs").is_dir():
            raise AssertionError("website/docs/ missing: deployment package is not self-contained")
        if not (website_dir / ".next" / "BUILD_ID").is_file():
            raise AssertionError("website/.next/BUILD_ID missing: production build not verified")
        deploy_md = (website_dir / "DEPLOYMENT.md").read_text(encoding="utf-8")
        if "GEMINI_API_KEY" not in deploy_md and "GOOGLE_API_KEY" not in deploy_md:
            raise AssertionError("website/DEPLOYMENT.md missing GEMINI_API_KEY / GOOGLE_API_KEY documentation")

    return {
        "base_url": base_url,
        "sandbox_blocked": sandbox_blocked,
        "live_updated": live_updated,
        "routes_checked": 0 if sandbox_blocked else len(key_routes),
    }
