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
    # "met_eireann_warning" and "council_notice" are institutional; "community_report"
    # is a public report that stays hidden from drivers until personnel confirm it.
    source_category: Mapped[str] = mapped_column(String)
    stated_or_inferred: Mapped[str] = mapped_column(String)  # "stated" | "inferred"
    # Current lifecycle state of the disruption. "reported" -> "confirmed"
    # (e.g. a community report confirmed by emergency personnel) -> "cleared".
    # The full history of state changes lives in the DisruptionUpdate table.
    status: Mapped[str] = mapped_column(String, default="reported")
    severity: Mapped[str] = mapped_column(String)
    confidence: Mapped[float] = mapped_column(Float)
    description: Mapped[str] = mapped_column(Text)
    expiry: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    segment: Mapped["RoadSegment"] = relationship(back_populates="disruptions")
    updates: Mapped[list["DisruptionUpdate"]] = relationship(
        back_populates="disruption",
        order_by="DisruptionUpdate.created_at",
        cascade="all, delete-orphan",
    )

    # Read-only convenience fields exposed on DisruptionOut so the frontend can
    # show a human road label without a second lookup against the segment.
    @property
    def road_ref(self) -> str | None:
        return self.segment.road_ref if self.segment else None

    @property
    def segment_label(self) -> str | None:
        return self.segment.label if self.segment else None


class DisruptionUpdate(Base):
    """One entry in a disruption's update timeline, e.g. "reported" at 14:35,
    "confirmed by emergency personnel" at 14:54. A disruption has many of these,
    ordered by time, which is what the frontend renders as the alert timeline."""

    __tablename__ = "disruption_updates"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    disruption_id: Mapped[str] = mapped_column(ForeignKey("disruption_records.id"))
    status: Mapped[str] = mapped_column(String)  # "reported" | "confirmed" | "cleared"
    note: Mapped[str] = mapped_column(Text)  # human-readable line for the timeline
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    disruption: Mapped["DisruptionRecord"] = relationship(back_populates="updates")


class BroadcastScript(Base):
    __tablename__ = "broadcast_scripts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    route_id: Mapped[str] = mapped_column(ForeignKey("routes.route_id"))
    script_text: Mapped[str] = mapped_column(Text)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
