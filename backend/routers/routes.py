from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from services import broadcast

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

    script_text = broadcast.generate_script(route, disruptions)
    generated_at = datetime.now(timezone.utc)

    db.add(models.BroadcastScript(route_id=route_id, script_text=script_text, generated_at=generated_at))
    db.commit()

    return schemas.BroadcastOut(script_text=script_text, generated_at=generated_at)
