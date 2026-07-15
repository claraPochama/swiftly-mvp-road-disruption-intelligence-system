"""Fetch live weather warnings from Met Eireann (via the PyMetEireann library)
and upsert them into the DB as institutional, *inferred* DisruptionRecords.

Met Eireann issues warnings per county (region codes like EI04=Cork), not per
road. We infer a warning onto a route by mapping the route's counties to a
representative road segment -- the same "institutional source, inferred
location" idea the project is built around, now backed by real data instead of
a hand-written seed.

Records created here are id-prefixed "live-metie-" so the read layer in
routers/routes.py can let them override the static seed fallback. The
community MapAlerter records are never touched.

Async note: PyMetEireann is aiohttp-based; refresh_warnings() wraps the async
fetch in asyncio.run() so the existing sync endpoints and sync SQLAlchemy
session stay unchanged (FastAPI runs sync endpoints in a threadpool, so there
is no running event loop to clash with).
"""

import asyncio
from datetime import datetime, timezone

import aiohttp
import meteireann
from sqlalchemy import delete

import models

# Which counties each route passes through.
ROUTE_COUNTIES: dict[str, list[str]] = {
    "cork-killarney": ["Cork", "Kerry"],
    "cork-carrigaline": ["Cork"],
}

# Representative segment to attach an inferred county-level warning to.
COUNTY_SEGMENT: dict[tuple[str, str], str] = {
    ("cork-killarney", "Cork"): "n22-seg-2",   # Macroom Bypass
    ("cork-killarney", "Kerry"): "n22-seg-3",   # Macroom -> Killarney
    ("cork-carrigaline", "Cork"): "r613-seg-2",
}

_SEVERITY_RANK = {"low": 0, "medium": 1, "high": 2}


def _level_to_severity(level: str) -> str:
    return {"yellow": "medium", "orange": "high", "red": "high"}.get(level.lower(), "medium")


def _certainty_to_confidence(certainty: str | None) -> float:
    return {
        "observed": 0.95,
        "likely": 0.8,
        "possible": 0.5,
        "unlikely": 0.3,
    }.get((certainty or "").lower(), 0.7)


def _headline_to_type(headline: str) -> str:
    h = (headline or "").lower()
    for keyword, dtype in (
        ("temperature", "high_temperature"),
        ("rain", "rain"),
        ("flood", "flood"),
        ("wind", "wind"),
        ("gale", "wind"),
        ("snow", "snow_ice"),
        ("ice", "snow_ice"),
        ("fog", "fog"),
        ("thunder", "thunderstorm"),
    ):
        if keyword in h:
            return dtype
    return "weather_warning"


async def _gather(counties: set[str]) -> dict[str, list[dict]]:
    out: dict[str, list[dict]] = {}
    async with aiohttp.ClientSession() as session:
        for county in counties:
            warning_data = meteireann.WarningData(websession=session, region=county)
            await warning_data.fetching_data()
            out[county] = warning_data.get_warnings().get("warnings", [])
    return out


def refresh_warnings(db) -> dict:
    """Pull live warnings for every route's counties and replace this route's
    live-metie records. Returns a small per-route summary."""
    all_counties = {c for counties in ROUTE_COUNTIES.values() for c in counties}
    warnings_by_county = asyncio.run(_gather(all_counties))

    summary: dict[str, int] = {}
    for route_id, counties in ROUTE_COUNTIES.items():
        # Clear any previous live records for this route before re-inserting.
        db.execute(
            delete(models.DisruptionRecord).where(
                models.DisruptionRecord.id.like(f"live-metie-{route_id}-%")
            )
        )

        seen_cap_ids: set[str] = set()
        # Collapse to one record per (segment, hazard type), keeping most severe.
        best: dict[tuple[str, str], dict] = {}
        for county in counties:
            segment_id = COUNTY_SEGMENT[(route_id, county)]
            for w in warnings_by_county.get(county, []):
                # Skip Advisories (status "Advisory"); keep colour-coded Warnings.
                if (w.get("status") or "").lower() != "warning":
                    continue
                level = (w.get("level") or "").lower()
                cap_id = w.get("capId")
                if cap_id in seen_cap_ids:
                    continue  # same national warning seen via another county
                seen_cap_ids.add(cap_id)

                severity = _level_to_severity(level)
                candidate = {
                    "cap_id": cap_id,
                    "segment_id": segment_id,
                    "disruption_type": _headline_to_type(w.get("headline", "")),
                    "severity": severity,
                    "confidence": _certainty_to_confidence(w.get("certainty")),
                    "headline": (w.get("headline") or "").strip(),
                    "description": (w.get("description") or "").strip(),
                    "expiry": w.get("expiry"),
                }
                key = (segment_id, candidate["disruption_type"])
                if key not in best or _SEVERITY_RANK[severity] > _SEVERITY_RANK[best[key]["severity"]]:
                    best[key] = candidate

        for candidate in best.values():
            db.add(
                models.DisruptionRecord(
                    id=f"live-metie-{route_id}-{candidate['cap_id']}",
                    segment_id=candidate["segment_id"],
                    disruption_type=candidate["disruption_type"],
                    source_category="met_eireann_warning",
                    stated_or_inferred="inferred",
                    severity=candidate["severity"],
                    confidence=candidate["confidence"],
                    description=(
                        f"Met Eireann {candidate['severity']} warning, inferred onto this "
                        f"segment via county-region matching rather than stated directly: "
                        f"{candidate['headline']}. {candidate['description']}"
                    ).strip(),
                    expiry=candidate["expiry"] or datetime.now(timezone.utc),
                )
            )
        summary[route_id] = len(best)

    db.commit()
    return {"routes": summary}
