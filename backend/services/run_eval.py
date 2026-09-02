"""Runs the 20-case eval against the real generate_script() in broadcast.py.

Usage:
    $env:ANTHROPIC_API_KEY = "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"   # your own key, never shared with anyone else
    python3 run_eval.py

Runs the 20-case eval against the real generate_script() in broadcast.py.

Usage:
    export ANTHROPIC_API_KEY=sk-ant-...   # your own key, never shared with anyone else
    python3 run_eval.py

Writes results.md with the raw output for every case, plus a few mechanical
heuristic flags (NOT authoritative — read the outputs yourself for the real
semantic safeguards: S1, S2a, S2b, S3, S6, S7).

"""
import re
import sys

import broadcast
import config
from fixtures import CASES
from models import DisruptionRecord, Route

# Windows defaults to the system codepage (often gbk/cp1252) for both stdout
# and file writes, which crashes on characters like the fada in "Éireann".
# Force UTF-8 everywhere so accented output never breaks the run.
for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, "reconfigure"):
        stream.reconfigure(encoding="utf-8")

MARKDOWN_CHARS = re.compile(r"[#*`|_]{2,}|^\s*[-*]\s", re.MULTILINE)


def heuristic_flags(text: str) -> list[str]:
    flags = []
    if MARKDOWN_CHARS.search(text):
        flags.append("possible markdown (check S5)")
    if len(text) < 20:
        flags.append("suspiciously short output")
    return flags


def run_case(case_id, safeguards, route_tuple, disruption_dicts):
    route = Route(origin_label=route_tuple[0], destination_label=route_tuple[1])
    disruptions = [DisruptionRecord(**d) for d in disruption_dicts]

    if case_id == "14":
        # No API key needed — this is the hardcoded guard-clause path.
        output = broadcast.generate_script(route, [])
        return output, ["confirmed: short-circuited before any API call"]

    if not config.ANTHROPIC_API_KEY:
        return None, ["SKIPPED — no ANTHROPIC_API_KEY set in environment"]

    try:
        output = broadcast.generate_script(route, disruptions)
    except Exception as e:  # noqa: BLE001 - eval harness, want to see any failure
        return None, [f"ERROR: {e}"]

    return output, heuristic_flags(output)


def write_case(f, case_id, safeguards, output, flags):
    f.write(f"## Case {case_id}  ·  safeguards: {safeguards}\n\n")
    if output:
        f.write(f"```\n{output}\n```\n\n")
    else:
        f.write("*(not run)*\n\n")
    if flags:
        f.write(f"**Heuristic flags:** {'; '.join(flags)}\n\n")
    f.write("**Manual scores:** S1:__ S2a:__ S2b:__ S3:__ S4:__ S5:__ S6:__ S7:__  \n")
    f.write("**Notes:**\n\n---\n\n")
    f.flush()  # each case is on disk immediately — a later crash can't lose it


def main():
    # encoding="utf-8" is required here — without it, Windows silently uses
    # the system codepage and crashes on accented output like "Éireann".
    with open("results.md", "w", encoding="utf-8") as f:
        f.write("# Eval run results\n\n")
        f.write("Raw output per case. Score S1/S2a/S2b/S3/S4/S6/S7 by reading the "
                "text yourself — the flags column is mechanical only.\n\n")
        for case_id, safeguards, route, disruptions in CASES:
            output, flags = run_case(case_id, safeguards, route, disruptions)
            write_case(f, case_id, safeguards, output, flags)
            status = "OK" if output else "SKIPPED/ERROR"
            print(f"case {case_id:>2} [{safeguards:<15}] {status}", file=sys.stderr)

    print("\nWrote results.md", file=sys.stderr)


if __name__ == "__main__":
    main()