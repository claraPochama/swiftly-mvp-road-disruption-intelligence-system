"""Re-anchor the seeded disruption timestamps onto a demo date/time.

seed.py stamps its fixture records with whatever `now` was at the time it ran, so a
DB seeded a few days before a demo shows "2 days ago" on every alert card. This
script shifts every seeded row (ids prefixed "dr-" / "du-") by a single constant
delta so the whole set lands on the demo slot while keeping its internal shape:
the collision is still reported 19 minutes before personnel confirm it, delays
still build 8 minutes later, and each record still expires the same distance
after it was created.

Only seeded rows are touched. Live Met Eireann records ("live-metie-") and any
community report filed during the demo keep their real timestamps.

Run from backend/ (defaults to 10:00 on 31 July 2026):

    python set_demo_time.py
    python set_demo_time.py "2026-07-31 14:30"

Times are naive wall-clock, matching how the frontend parses `created_at`, so
10:00 here is what the app renders as 10:00.
"""

import sys
from datetime import datetime

from sqlalchemy import select

from database import SessionLocal
from models import DisruptionRecord, DisruptionUpdate

DEFAULT_TARGET = "2026-07-31 10:00"

# The moment seed.py calls `now`: the collision's "confirmed by emergency
# personnel" entry. Everything else is offset from it, so aligning this one onto
# the target and shifting the rest by the same delta preserves the timeline.
REFERENCE_UPDATE_ID = "du-collision-2"


def parse_target(raw: str) -> datetime:
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M"):
        try:
            return datetime.strptime(raw, fmt)
        except ValueError:
            continue
    raise SystemExit(f'Could not parse "{raw}". Expected e.g. "2026-07-31 10:00".')


def set_demo_time(target: datetime) -> None:
    db = SessionLocal()
    try:
        reference = db.get(DisruptionUpdate, REFERENCE_UPDATE_ID)
        if reference is None:
            raise SystemExit(
                f"No {REFERENCE_UPDATE_ID} row found -- run `python seed.py` first."
            )

        delta = target - reference.created_at

        records = db.scalars(
            select(DisruptionRecord).where(DisruptionRecord.id.like("dr-%"))
        ).all()
        for record in records:
            record.created_at += delta
            record.expiry += delta

        updates = db.scalars(
            select(DisruptionUpdate).where(DisruptionUpdate.id.like("du-%"))
        ).all()
        for update in updates:
            update.created_at += delta

        db.commit()

        print(f"Shifted {len(records)} records and {len(updates)} timeline entries by {delta}.")
        for record in sorted(records, key=lambda r: r.id):
            print(f"  {record.id}: created {record.created_at}, expires {record.expiry}")
        for update in sorted(updates, key=lambda u: u.created_at):
            print(f"  {update.id}: {update.created_at}")
    finally:
        db.close()


if __name__ == "__main__":
    set_demo_time(parse_target(sys.argv[1] if len(sys.argv) > 1 else DEFAULT_TARGET))
