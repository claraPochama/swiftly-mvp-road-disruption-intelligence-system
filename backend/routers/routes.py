import json
import uuid
from collections import defaultdict
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from services import broadcast, met_eireann

router = APIRouter()

_SEVERITY_RANK = {"low": 0, "medium": 1, "high": 2}

# How long a fresh community report stays live before it expires, unless
# emergency personnel act on it sooner.
_REPORT_EXPIRY_HOURS = 6

_INSTITUTIONAL_SOURCES = ("met_eireann_warning", "council_notice")


def _worst_severity(disruptions: list["models.DisruptionRecord"]) -> str | None:
    if not disruptions:
        return None
    return max((d.severity for d in disruptions), key=lambda s: _SEVERITY_RANK.get(s, -1))


def _matched_disruptions(db: Session, route: "models.Route") -> list["models.DisruptionRecord"]:
    """Driver-facing disruption records matched to a route's segments. Two rules
    are applied:

    1. Live-warning override: when a live Met Eireann record (id prefixed
       "live-metie-") exists for the route, the static seeded institutional
       record is suppressed so we don't show both.
    2. Verification gate: a community report is provisional until emergency
       personnel confirm it, so unconfirmed ones are withheld from drivers and
       broadcasts. They surface only in the GET /disruptions/pending queue.
       Institutional records (Met Eireann, council) are shown as-is."""
    segment_ids = [rs.segment_id for rs in route.segments]
    if not segment_ids:
        return []

    records = db.scalars(
        select(models.DisruptionRecord).where(models.DisruptionRecord.segment_id.in_(segment_ids))
    ).all()

    has_live_metie = any(
        r.source_category == "met_eireann_warning" and r.id.startswith("live-metie-")
        for r in records
    )
    if has_live_metie:
        records = [
            r
            for r in records
            if not (r.source_category == "met_eireann_warning" and not r.id.startswith("live-metie-"))
        ]

    records = [
        r
        for r in records
        if not (r.source_category == "community_report" and r.status != "confirmed")
    ]
    return records


@router.get("/routes", response_model=list[schemas.RouteOut])
def list_routes(db: Session = Depends(get_db)):
    return db.scalars(select(models.Route)).all()


@router.get("/routes/{route_id}/disruptions", response_model=list[schemas.DisruptionOut])
def list_disruptions(route_id: str, db: Session = Depends(get_db)):
    route = db.get(models.Route, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    return _matched_disruptions(db, route)


@router.post(
    "/routes/{route_id}/reports", response_model=schemas.DisruptionOut, status_code=201
)
def submit_community_report(
    route_id: str, report: schemas.DisruptionReportIn, db: Session = Depends(get_db)
):
    """A member of the public files a community disruption report on this route.
    It is stored as an unconfirmed community record (source_category
    "community_report", stated, status "reported") and is deliberately hidden
    from drivers and broadcasts until emergency personnel confirm it via
    POST /disruptions/{id}/updates. Personnel find it via GET /disruptions/pending."""
    route = db.get(models.Route, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")

    if report.segment_id not in {rs.segment_id for rs in route.segments}:
        raise HTTPException(status_code=422, detail="segment_id is not part of this route")

    disruption_id = f"cr-{uuid.uuid4().hex[:12]}"
    disruption = models.DisruptionRecord(
        id=disruption_id,
        segment_id=report.segment_id,
        disruption_type=report.disruption_type,
        source_category="community_report",
        stated_or_inferred="stated",  # a public reporter names the road directly
        status="reported",
        severity=report.severity,
        confidence=0.5,  # provisional; personnel confirmation is what raises trust
        description=report.description,
        expiry=datetime.now(timezone.utc) + timedelta(hours=_REPORT_EXPIRY_HOURS),
    )
    db.add(disruption)
    db.add(
        models.DisruptionUpdate(
            id=f"du-{uuid.uuid4().hex[:12]}",
            disruption_id=disruption_id,
            status="reported",
            note=report.note or "Disruption reported by a member of the public.",
        )
    )
    db.commit()
    db.refresh(disruption)
    return disruption


@router.get("/disruptions/pending", response_model=list[schemas.DisruptionOut])
def list_pending_reports(db: Session = Depends(get_db)):
    """The emergency-personnel review queue: community reports still awaiting
    confirmation. These are hidden from drivers and broadcasts (see
    _matched_disruptions) until a confirmation advances them to "confirmed"."""
    return db.scalars(
        select(models.DisruptionRecord).where(
            models.DisruptionRecord.source_category == "community_report",
            models.DisruptionRecord.status == "reported",
        )
    ).all()


@router.post("/disruptions/{disruption_id}/updates", response_model=schemas.DisruptionOut)
def add_disruption_update(
    disruption_id: str, update: schemas.DisruptionUpdateIn, db: Session = Depends(get_db)
):
    """Append one entry to a disruption's update timeline (e.g. a user report,
    then an emergency-personnel confirmation) and advance the disruption's
    current status to match. Returns the disruption with its full timeline."""
    disruption = db.get(models.DisruptionRecord, disruption_id)
    if disruption is None:
        raise HTTPException(status_code=404, detail="Disruption not found")

    db.add(
        models.DisruptionUpdate(
            id=f"du-{uuid.uuid4().hex[:12]}",
            disruption_id=disruption_id,
            status=update.status,
            note=update.note,
        )
    )
    disruption.status = update.status
    db.commit()
    db.refresh(disruption)
    return disruption


@router.get("/routes/{route_id}/geometry", response_model=list[schemas.SegmentGeometryOut])
def route_geometry(route_id: str, db: Session = Depends(get_db)):
    route = db.get(models.Route, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    return [
        schemas.SegmentGeometryOut(
            segment_id=rs.segment.id,
            road_ref=rs.segment.road_ref,
            label=rs.segment.label,
            sequence_order=rs.sequence_order,
            geometry=json.loads(rs.segment.geometry_geojson),
        )
        for rs in route.segments
    ]


@router.get("/routes/{route_id}/overlay", response_model=schemas.OverlayFeatureCollection)
def route_overlay(route_id: str, db: Session = Depends(get_db)):
    """Segment geometry + per-segment disruption summary as a GeoJSON
    FeatureCollection, so the map can render and colour segments directly.
    Reflects live-warning overrides via _matched_disruptions."""
    route = db.get(models.Route, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")

    by_segment: dict[str, list[models.DisruptionRecord]] = defaultdict(list)
    for d in _matched_disruptions(db, route):
        by_segment[d.segment_id].append(d)

    features = []
    for rs in route.segments:
        seg = rs.segment
        seg_disruptions = by_segment.get(seg.id, [])
        features.append(
            schemas.OverlayFeature(
                geometry=json.loads(seg.geometry_geojson),
                properties=schemas.OverlayProperties(
                    segment_id=seg.id,
                    road_ref=seg.road_ref,
                    label=seg.label,
                    sequence_order=rs.sequence_order,
                    disruption_count=len(seg_disruptions),
                    has_disruption=bool(seg_disruptions),
                    worst_severity=_worst_severity(seg_disruptions),
                    has_institutional=any(
                        d.source_category in _INSTITUTIONAL_SOURCES for d in seg_disruptions
                    ),
                    has_community=any(
                        d.source_category == "community_report" for d in seg_disruptions
                    ),
                    disruptions=seg_disruptions,
                ),
            )
        )
    return schemas.OverlayFeatureCollection(features=features)


@router.post("/routes/{route_id}/broadcast", response_model=schemas.BroadcastOut)
def generate_broadcast(route_id: str, db: Session = Depends(get_db)):
    route = db.get(models.Route, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")

    disruptions = _matched_disruptions(db, route)
    script_text = broadcast.generate_script(route, disruptions)
    generated_at = datetime.now(timezone.utc)

    db.add(models.BroadcastScript(route_id=route_id, script_text=script_text, generated_at=generated_at))
    db.commit()

    return schemas.BroadcastOut(script_text=script_text, generated_at=generated_at)


@router.post("/admin/refresh-warnings")
def refresh_warnings(db: Session = Depends(get_db)):
    """Operator action: pull live Met Eireann warnings and upsert them as
    institutional/inferred disruption records. Out of the frontend contract."""
    return met_eireann.refresh_warnings(db)
