# Swiftly broadcast eval — run instructions

I've already verified this harness runs end-to-end (case 14 executed for
real with no key needed; a bad key was confirmed to fail cleanly per-case
rather than crashing the run).

## To get all 20 real results:

```bash
pip install anthropic --break-system-packages   # if not already installed
export ANTHROPIC_API_KEY=sk-ant-...              # YOUR key, from your own .env — never share this
cd swiftly_eval_harness
python3 run_eval.py
```

This produces `results.md` with the raw output for all 20 cases. Case 14
needs no key and already ran (see the eval plan doc for its output).

## Before you trust the results

- `broadcast.py` here is your real file, copied verbatim — not reimplemented.
- `models.py` and `config.py` are stubs I wrote (see comments in each) —
  they only implement what `broadcast.py` actually reads. If your real
  `DisruptionRecord` does Pydantic validation that would reject a fixture,
  that's worth knowing, but this harness skips that layer on purpose to
  isolate the prompt as the thing under test.
- `BROADCAST_MODEL` defaults to a guess in `config.py` — check it against
  your real `config.py` and override with `export BROADCAST_MODEL=...` if
  it's pinned to something specific in production.
- Scoring is manual by design (S1, S2a, S2b, S3, S4, S6, S7 need semantic
  judgment). `results.md` has blank score fields per case, and a couple of
  purely mechanical heuristic flags (markdown detection) that are hints,
  not verdicts.
