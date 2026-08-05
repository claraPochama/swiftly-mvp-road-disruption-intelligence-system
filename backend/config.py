import os
from pathlib import Path

from dotenv import load_dotenv

# Load backend/.env once at import time so os.getenv works everywhere.
load_dotenv(Path(__file__).parent / ".env")

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY") or ""

# Model used for broadcast generation. Claude Opus 4.8 is the current
# most-capable model; override via env if a teammate wants a cheaper one.
BROADCAST_MODEL = os.getenv("BROADCAST_MODEL", "claude-opus-4-8")
