import os

# Reads from your shell environment when you run this locally — never paste
# your key into a file or into chat. Set it before running:
#   export ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# CHECK THIS against your real config.py before running — if your project
# pins a specific model string, use that one so the eval reflects what's
# actually deployed, not a default I guessed.
BROADCAST_MODEL = os.environ.get("BROADCAST_MODEL", "claude-sonnet-4-6")
