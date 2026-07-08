from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter()


@router.get("/routes", response_model=list[schemas.RouteOut])
def list_routes(db: Session = Depends(get_db)):
    return db.scalars(select(models.Route)).all()


@router.get("/routes/{route_id}/disruptions", response_model=list[schemas.DisruptionOut])
def list_disruptions(route_id: str, db: Session = Depends(get_db)):
    route = db.get(models.Route, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")

    segment_ids = [rs.segment_id for rs in route.segments]
    if not segment_ids:
        return []
    return db.scalars(
        select(models.DisruptionRecord).where(models.DisruptionRecord.segment_id.in_(segment_ids))
    ).all()


@router.post("/routes/{route_id}/broadcast", response_model=schemas.BroadcastOut)
def generate_broadcast(route_id: str, db: Session = Depends(get_db)):
    route = db.get(models.Route, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")

    segment_ids = [rs.segment_id for rs in route.segments]
    disruptions = db.scalars(
        select(models.DisruptionRecord).where(models.DisruptionRecord.segment_id.in_(segment_ids))
    ).all()

    script_text = _build_script(route, disruptions)
    generated_at = datetime.now(timezone.utc)

    db.add(models.BroadcastScript(route_id=route_id, script_text=script_text, generated_at=generated_at))
    db.commit()

    return schemas.BroadcastOut(script_text=script_text, generated_at=generated_at)


def _build_script(route: "models.Route", disruptions: list["models.DisruptionRecord"]) -> str:
    """Week 1 placeholder. Week 2 swaps this for a Claude API call using a
    system prompt scoped to the DisruptionRecord schema, per the API
    contract's { script_text, generated_at } shape."""
    if not disruptions:
        return f"No disruptions currently reported on the {route.origin_label} to {route.destination_label} route."

    lines = [f"Route update: {route.origin_label} to {route.destination_label}."]
    for d in disruptions:
        lines.append(
            f"{d.severity.capitalize()} severity {d.disruption_type} on segment {d.segment_id} "
            f"({d.stated_or_inferred}, source: {d.source_category}). {d.description}"
        )
    return " ".join(lines)
