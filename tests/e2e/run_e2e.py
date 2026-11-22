#!/usr/bin/env python3
"""Unified CLI runner for MalikClaw v2.0.0 Opaque-Box E2E Tests (Tiers 1-4)."""

from __future__ import annotations

import argparse
from collections import defaultdict
import json
from pathlib import Path
import sys
import time
import unittest
from typing import Any

E2E_DIR = Path(__file__).resolve().parent
if str(E2E_DIR) not in sys.path:
    sys.path.insert(0, str(E2E_DIR))

TIER_MODULES = {
    "1": "test_tier1_feature_coverage",
    "2": "test_tier2_boundaries",
    "3": "test_tier3_pairwise",
    "4": "test_tier4_scenarios",
}


def _extract_tier(test: unittest.TestCase) -> str:
    mod = type(test).__module__
    for tier, mod_name in TIER_MODULES.items():
        if mod_name in mod:
            return tier
    return "unknown"


def _extract_areas(test: unittest.TestCase) -> tuple[str, ...]:
    method_name = getattr(test, "_testMethodName", "")
    method_obj = getattr(type(test), method_name, None)
    if method_obj is not None and hasattr(method_obj, "AREAS"):
        return tuple(getattr(method_obj, "AREAS"))
    cls_areas = getattr(type(test), "AREAS", None)
    if cls_areas:
        return tuple(cls_areas)
    return ("unknown",)


def _iter_tests(suite: unittest.TestSuite):
    for item in suite:
        if isinstance(item, unittest.TestSuite):
            yield from _iter_tests(item)
        else:
            yield item


class _TrackingResult(unittest.TextTestResult):
    def __init__(self, stream, descriptions, verbosity):
        super().__init__(stream, descriptions, verbosity)
        self.records: list[dict[str, Any]] = []
        self._start_times: dict[str, float] = {}

    def startTest(self, test: unittest.TestCase) -> None:
        self._start_times[test.id()] = time.monotonic()
        super().startTest(test)

    def _record(self, test: unittest.TestCase, status: str, detail: str = "") -> None:
        elapsed = time.monotonic() - self._start_times.get(test.id(), time.monotonic())
        self.records.append(
            {
                "id": test.id(),
                "tier": _extract_tier(test),
                "areas": list(_extract_areas(test)),
                "status": status,
                "duration_sec": round(elapsed, 3),
                "detail": detail,
            }
        )

    def addSuccess(self, test: unittest.TestCase) -> None:
        super().addSuccess(test)
        self._record(test, "pass")

    def addFailure(self, test: unittest.TestCase, err) -> None:
        super().addFailure(test, err)
        self._record(test, "fail", self._exc_info_to_string(err, test))

    def addError(self, test: unittest.TestCase, err) -> None:
        super().addError(test, err)
        self._record(test, "error", self._exc_info_to_string(err, test))

    def addSkip(self, test: unittest.TestCase, reason: str) -> None:
        super().addSkip(test, reason)
        self._record(test, "skip", reason)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="MalikClaw v2.0.0 Opaque-Box E2E Runner")
    parser.add_argument(
        "--tier",
        choices=["1", "2", "3", "4", "all"],
        default="all",
        help="Run a specific tier (1-4) or all tiers (default: all)",
    )
    parser.add_argument(
        "--area",
        choices=["r1", "r2", "r3", "r4", "all"],
        default="all",
        help="Filter by requirement area (r1-r4) or all (default: all)",
    )
    parser.add_argument(
        "--json-report",
        type=Path,
        default=None,
        help="Optional path to write JSON test report",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Verbose test output",
    )
    args = parser.parse_args(argv)

    loader = unittest.TestLoader()
    tiers_to_load = list(TIER_MODULES.keys()) if args.tier == "all" else [args.tier]
    discovered = unittest.TestSuite()
    for t in tiers_to_load:
        mod_name = TIER_MODULES[t]
        discovered.addTests(loader.loadTestsFromName(mod_name))

    filtered = unittest.TestSuite()
    for test in _iter_tests(discovered):
        if args.area == "all" or args.area in _extract_areas(test):
            filtered.addTest(test)

    total_selected = filtered.countTestCases()
    if total_selected == 0:
        print(
            f"ERROR: 0 tests matched --tier={args.tier} --area={args.area}",
            file=sys.stderr,
        )
        return 1

    print(
        f"Running {total_selected} MalikClaw v2.0.0 E2E test(s) "
        f"(tier={args.tier}, area={args.area})...\n"
    )
    start_ts = time.monotonic()
    runner = unittest.TextTestRunner(
        verbosity=2 if args.verbose else 1,
        resultclass=_TrackingResult,
    )
    result: _TrackingResult = runner.run(filtered)  # type: ignore[assignment]
    total_duration = round(time.monotonic() - start_ts, 3)

    by_tier: dict[str, dict[str, int]] = defaultdict(
        lambda: {"total": 0, "pass": 0, "fail": 0, "error": 0, "skip": 0}
    )
    by_area: dict[str, dict[str, int]] = defaultdict(
        lambda: {"total": 0, "pass": 0, "fail": 0, "error": 0, "skip": 0}
    )
    for rec in result.records:
        t = rec["tier"]
        st = rec["status"]
        by_tier[t]["total"] += 1
        by_tier[t][st] += 1
        for a in rec["areas"]:
            by_area[a]["total"] += 1
            by_area[a][st] += 1

    passed = sum(1 for r in result.records if r["status"] == "pass")
    failed = len(result.failures)
    errors = len(result.errors)
    skipped = len(result.skipped)

    print("\n=== E2E Summary by Tier ===")
    for t in sorted(by_tier):
        s = by_tier[t]
        print(
            f"  Tier {t}: {s['pass']}/{s['total']} passed "
            f"(fail={s['fail']}, error={s['error']}, skip={s['skip']})"
        )

    print("\n=== E2E Summary by Area ===")
    for a in sorted(by_area):
        s = by_area[a]
        print(
            f"  {a.upper()}: {s['pass']}/{s['total']} passed "
            f"(fail={s['fail']}, error={s['error']}, skip={s['skip']})"
        )

    print(
        f"\nOVERALL: {passed}/{result.testsRun} passed in {total_duration}s "
        f"(fail={failed}, error={errors}, skip={skipped})"
    )

    if args.json_report:
        payload = {
            "total": result.testsRun,
            "passed": passed,
            "failed": failed,
            "errors": errors,
            "skipped": skipped,
            "duration_sec": total_duration,
            "tier_filter": args.tier,
            "area_filter": args.area,
            "by_tier": dict(by_tier),
            "by_area": dict(by_area),
            "results": result.records,
        }
        args.json_report.parent.mkdir(parents=True, exist_ok=True)
        args.json_report.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    return 0 if (result.testsRun > 0 and result.wasSuccessful() and skipped == 0) else 1


if __name__ == "__main__":
    raise SystemExit(main())
