from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class RoadSegment(Base):
    __tablename__ = "road_segments"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    road_ref: Mapped[str] = mapped_column(String)  # e.g. "N22", "R-613"
    label: Mapped[str] = mapped_column(String)  # e.g. "Ballincollig to Macroom"
    geometry_geojson: Mapped[str] = mapped_column(Text)  # GeoJSON LineString, as text

    disruptions: Mapped[list["DisruptionRecord"]] = relationship(back_populates="segment")


class Route(Base):
    __tablename__ = "routes"

    route_id: Mapped[str] = mapped_column(String, primary_key=True)
    origin_label: Mapped[str] = mapped_column(String)
    destination_label: Mapped[str] = mapped_column(String)

    segments: Mapped[list["RouteSegment"]] = relationship(
        back_populates="route", order_by="RouteSegment.sequence_order"
    )


class RouteSegment(Base):
    __tablename__ = "route_segments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    route_id: Mapped[str] = mapped_column(ForeignKey("routes.route_id"))
    segment_id: Mapped[str] = mapped_column(ForeignKey("road_segments.id"))
    sequence_order: Mapped[int] = mapped_column(Integer)

    route: Mapped["Route"] = relationship(back_populates="segments")
    segment: Mapped["RoadSegment"] = relationship()


class DisruptionRecord(Base):
    __tablename__ = "disruption_records"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    segment_id: Mapped[str] = mapped_column(ForeignKey("road_segments.id"))
    disruption_type: Mapped[str] = mapped_column(String)
    source_category: Mapped[str] = mapped_column(String)  # e.g. "met_eireann_warning", "mapalerter_report"
    stated_or_inferred: Mapped[str] = mapped_column(String)  # "stated" | "inferred"
    severity: Mapped[str] = mapped_column(String)
    confidence: Mapped[float] = mapped_column(Float)
    description: Mapped[str] = mapped_column(Text)
    expiry: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    segment: Mapped["RoadSegment"] = relationship(back_populates="disruptions")


class BroadcastScript(Base):
    __tablename__ = "broadcast_scripts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    route_id: Mapped[str] = mapped_column(ForeignKey("routes.route_id"))
    script_text: Mapped[str] = mapped_column(Text)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
