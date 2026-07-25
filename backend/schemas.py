from datetime import datetime

from pydantic import BaseModel


class RouteOut(BaseModel):
    route_id: str
    origin_label: str
    destination_label: str

    model_config = {"from_attributes": True}


class DisruptionUpdateOut(BaseModel):
    id: str
    status: str
    note: str
    created_at: datetime

    model_config = {"from_attributes": True}


class DisruptionUpdateIn(BaseModel):
    status: str  # "reported" | "confirmed" | "cleared"
    note: str  # the timeline line, e.g. "Emergency personnel confirmed on scene"


class DisruptionReportIn(BaseModel):
    """A community disruption report submitted by a member of the public. The
    backend fixes source_category="community_report", stated_or_inferred="stated"
    (a public reporter names the road directly) and status="reported"; the record
    stays out of driver views until emergency personnel confirm it."""

    segment_id: str  # must be one of the route's segments
    disruption_type: str  # e.g. "collision", "flood", "roadworks"
    severity: str  # "low" | "medium" | "high"
    description: str
    note: str | None = None  # optional first timeline line; a default is used if absent


class DisruptionOut(BaseModel):
    id: str
    segment_id: str
    road_ref: str | None = None  # e.g. "N22" — the segment's road reference
    segment_label: str | None = None  # e.g. "Ballincollig to Macroom"
    disruption_type: str
    source_category: str
    stated_or_inferred: str
    status: str
    severity: str
    confidence: float
    description: str
    created_at: datetime
    expiry: datetime
    updates: list[DisruptionUpdateOut] = []

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
    has_institutional: bool  # any institutional source (met_eireann_warning or council_notice)
    has_community: bool  # any community_report
    disruptions: list[DisruptionOut]


class OverlayFeature(BaseModel):
    type: str = "Feature"
    geometry: dict  # GeoJSON LineString
    properties: OverlayProperties


class OverlayFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: list[OverlayFeature]
