"""Populate the SQLite DB with the locked-scope fixture data: 2 routes,
their real-geometry segments (from seed_data/*.geojson), and the 2 seed
disruption records (one institutional/inferred, one community/stated).

Run once, from backend/:

    python seed.py
"""

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

from database import Base, SessionLocal, engine
from models import DisruptionRecord, RoadSegment, Route, RouteSegment

SEED_DIR = Path(__file__).parent / "seed_data"


def load_segments(geojson_file: str) -> list[dict]:
    data = json.loads((SEED_DIR / geojson_file).read_text(encoding="utf-8"))
    return [
        {
            "id": feature["properties"]["segment_id"],
            "road_ref": feature["properties"]["road_ref"],
            "label": feature["properties"]["label"],
            "sequence_order": feature["properties"]["sequence_order"],
            "geometry_geojson": json.dumps(feature["geometry"]),
        }
        for feature in data["features"]
    ]


def seed() -> None:
    Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        if db.query(Route).first() is not None:
            print("Already seeded, skipping. Delete swiftly.db to reseed.")
            return

        db.add_all(
            [
                Route(route_id="cork-killarney", origin_label="Cork", destination_label="Killarney"),
                Route(route_id="cork-carrigaline", origin_label="Cork", destination_label="Carrigaline"),
            ]
        )

        route_segments = {
            "cork-killarney": load_segments("n22_route.geojson"),
            "cork-carrigaline": load_segments("r613_route.geojson"),
        }
        for route_id, segments in route_segments.items():
            for seg in segments:
                db.add(
                    RoadSegment(
                        id=seg["id"],
                        road_ref=seg["road_ref"],
                        label=seg["label"],
                        geometry_geojson=seg["geometry_geojson"],
                    )
                )
                db.add(
                    RouteSegment(
                        route_id=route_id,
                        segment_id=seg["id"],
                        sequence_order=seg["sequence_order"],
                    )
                )

        now = datetime.now(timezone.utc)

        # Institutional, inferred: Met Eireann issues a regional warning polygon,
        # not a road ID -- resolved onto the Macroom Bypass via polygon -> segment
        # geometry matching. Mirrors the Macroom Bypass icing incident (Irish
        # Examiner, 2026).
        db.add(
            DisruptionRecord(
                id="dr-n22-macroom-icing",
                segment_id="n22-seg-2",
                disruption_type="ice",
                source_category="met_eireann_warning",
                stated_or_inferred="inferred",
                severity="high",
                confidence=0.75,
                description=(
                    "Met Eireann regional weather warning (status yellow, low temperatures / "
                    "icy surfaces) for Munster overlaps the Macroom Bypass. The warning is "
                    "issued as a polygon, not a road ID, so this disruption is inferred via "
                    "polygon-to-segment geometry matching rather than stated directly."
                ),
                expiry=now + timedelta(hours=6),
            )
        )

        # Community, stated: MapAlerter report carries an explicit road ID,
        # resolved via direct road-ID lookup (Claude-parsed) rather than
        # geometry matching.
        db.add(
            DisruptionRecord(
                id="dr-r613-carrigaline-flood",
                segment_id="r613-seg-2",
                disruption_type="flood",
                source_category="mapalerter_report",
                stated_or_inferred="stated",
                severity="high",
                confidence=0.9,
                description=(
                    "MapAlerter community report: road impassable due to flooding on the "
                    "R613 approaching Carrigaline. The report states the road ID directly, "
                    "so this disruption is stated rather than inferred."
                ),
                expiry=now + timedelta(hours=3),
            )
        )

        db.commit()
        print("Seeded 2 routes, their segments, and 2 disruption records.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
