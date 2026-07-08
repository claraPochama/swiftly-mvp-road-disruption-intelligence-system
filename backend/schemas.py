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
