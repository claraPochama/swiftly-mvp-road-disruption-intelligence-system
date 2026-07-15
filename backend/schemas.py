from datetime import datetime

from pydantic import BaseModel


class RouteOut(BaseModel):
    route_id: str
    origin_label: str
    destination_label: str

    model_config = {"from_attributes": True}


class DisruptionOut(BaseModel):
    id: str
    segment_id: str
    disruption_type: str
    source_category: str
    stated_or_inferred: str
    severity: str
    confidence: float
    expiry: datetime

    model_config = {"from_attributes": True}


class BroadcastOut(BaseModel):
    script_text: str
    generated_at: datetime


class SegmentGeometryOut(BaseModel):
    segment_id: str
    road_ref: str
    label: str
    sequence_order: int
    geometry: dict  # GeoJSON LineString


# --- Map overlay: a GeoJSON FeatureCollection the frontend can render directly.
# Each segment is a Feature whose properties summarise its disruptions so the
# map can colour by severity and by source (institutional vs community).

class OverlayProperties(BaseModel):
    segment_id: str
    road_ref: str
    label: str
    sequence_order: int
    disruption_count: int
    has_disruption: bool
    worst_severity: str | None  # "low" | "medium" | "high" | None
    has_institutional: bool  # any met_eireann_warning
    has_community: bool  # any mapalerter_report
    disruptions: list[DisruptionOut]


class OverlayFeature(BaseModel):
    type: str = "Feature"
    geometry: dict  # GeoJSON LineString
    properties: OverlayProperties


class OverlayFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: list[OverlayFeature]
