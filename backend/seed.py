"""Populate the SQLite DB with the locked-scope fixture data: 2 routes,
their real-geometry segments (from seed_data/*.geojson), and 4 seed disruption
records spanning the provenance grid: institutional/inferred (Met Eireann),
institutional/stated (Cork County Council notice), and community/stated (two
public reports, one confirmed and one still pending).

Run once, from backend/:

    python seed.py
"""

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

from database import Base, SessionLocal, engine
from models import DisruptionRecord, DisruptionUpdate, RoadSegment, Route, RouteSegment

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

        # Cork -> Killarney: institutional, inferred. Met Eireann issues a
        # regional high-temperature warning as a polygon, not a road ID --
        # resolved onto the Macroom Bypass via polygon -> segment geometry
        # matching.
        db.add(
            DisruptionRecord(
                id="dr-n22-macroom-heat",
                segment_id="n22-seg-2",
                disruption_type="high_temperature",
                source_category="met_eireann_warning",
                stated_or_inferred="inferred",
                status="confirmed",
                severity="medium",
                confidence=0.75,
                description=(
                    "Met Eireann regional weather warning (status yellow, high temperatures) "
                    "for Munster overlaps the Macroom Bypass this week, with a risk of road "
                    "surface softening and heat stress for stranded motorists. The warning is "
                    "issued as a polygon, not a road ID, so this disruption is inferred via "
                    "polygon-to-segment geometry matching rather than stated directly."
                ),
                expiry=now + timedelta(days=3),
            )
        )

        # Cork -> Killarney: institutional, STATED. A Cork County Council road
        # notice (modelled on the real MapAlerter "N20 Ballyhay resurfacing"
        # alert) names the road directly, so unlike the Met Eireann polygon
        # warning above it is stated, not inferred. This fills the fourth cell
        # of the provenance grid: institutional + stated.
        db.add(
            DisruptionRecord(
                id="dr-n22-ballincollig-resurfacing",
                segment_id="n22-seg-1",
                disruption_type="roadworks",
                source_category="council_notice",
                stated_or_inferred="stated",
                status="confirmed",
                severity="low",
                confidence=0.95,
                description=(
                    "Cork County Council road notice: overnight road resurfacing on the "
                    "N22 Cork-to-Ballincollig stretch, Tuesday to Friday 19:00-07:00 "
                    "(night works). Temporary stop/go shuttle system in operation, expect "
                    "delays, use an alternative route where possible. The notice names the "
                    "road directly, so this disruption is stated rather than inferred."
                ),
                expiry=now + timedelta(days=4),
            )
        )

        # Cork -> Carrigaline: two community, stated records. A community report
        # is filed by a member of the public naming the road directly, so it is
        # stated (resolved via direct road-ID lookup rather than geometry
        # matching). Two records so the broadcast has more than one thing to
        # summarise.
        db.add(
            DisruptionRecord(
                id="dr-r613-carrigaline-collision",
                segment_id="r613-seg-2",
                disruption_type="collision",
                source_category="community_report",
                stated_or_inferred="stated",
                status="confirmed",
                severity="high",
                confidence=0.9,
                description=(
                    "Community report: two-car collision on the R613 approaching "
                    "Carrigaline, one lane blocked and emergency services on scene. The report "
                    "names the road directly, so this disruption is stated rather than inferred."
                ),
                expiry=now + timedelta(hours=2),
            )
        )
        db.add(
            DisruptionRecord(
                id="dr-r613-carrigaline-delays",
                segment_id="r613-seg-1",
                disruption_type="delay",
                source_category="community_report",
                stated_or_inferred="stated",
                status="reported",
                severity="medium",
                confidence=0.8,
                description=(
                    "Community report: long delays building on the R613 between "
                    "Cork and Douglas, traffic backing up behind the Carrigaline collision. "
                    "The report names the road directly, so this disruption is stated."
                ),
                expiry=now + timedelta(hours=2),
            )
        )

        # Update timelines. The collision was reported by a member of the public,
        # then confirmed by emergency personnel on scene -- exactly the alert
        # timeline the frontend renders per disruption.
        db.add_all(
            [
                DisruptionUpdate(
                    id="du-collision-1",
                    disruption_id="dr-r613-carrigaline-collision",
                    status="reported",
                    note="Two-car collision reported by a member of the public on the R613.",
                    created_at=now - timedelta(minutes=19),
                ),
                DisruptionUpdate(
                    id="du-collision-2",
                    disruption_id="dr-r613-carrigaline-collision",
                    status="confirmed",
                    note="Emergency personnel confirmed on scene, one lane blocked.",
                    created_at=now,
                ),
                DisruptionUpdate(
                    id="du-delays-1",
                    disruption_id="dr-r613-carrigaline-delays",
                    status="reported",
                    note="Delays reported building behind the Carrigaline collision.",
                    created_at=now - timedelta(minutes=8),
                ),
            ]
        )

        db.commit()
        print("Seeded 2 routes, their segments, 4 disruption records, and their update timelines.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
