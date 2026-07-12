"""Generate a text broadcast script for a route from its matched disruption
records, using the Claude API with a system prompt scoped to the
DisruptionRecord schema.

The whole thesis of this project is the institutional-vs-community and
stated-vs-inferred distinction, so the system prompt tells Claude to preserve
and surface that provenance in the spoken script rather than flattening it.

If no ANTHROPIC_API_KEY is configured, we fall back to a deterministic
template so the endpoint still works for teammates who haven't set a key.
"""

import json

import anthropic

import models
from config import ANTHROPIC_API_KEY, BROADCAST_MODEL

SYSTEM_PROMPT = """\
You are the broadcast writer for Swiftly, a road-disruption intelligence \
system for Irish emergency personnel. You turn structured disruption records \
into a short spoken-radio-style text broadcast.

Each disruption record has these fields:
- disruption_type: the hazard (e.g. ice, flood).
- source_category: where it came from. "met_eireann_warning" is an \
institutional/official source; "mapalerter_report" is a community-sourced \
report.
- stated_or_inferred: "stated" means the source named the road directly; \
"inferred" means the location was derived (e.g. a weather-warning polygon \
matched onto a road segment) and is therefore less certain.
- severity: low, medium, or high.
- confidence: 0.0-1.0, how sure we are.
- segment_id: which road segment it affects.

Rules for the broadcast:
- Open by naming the route (origin to destination).
- For each disruption, state the hazard, the road segment, and the severity.
- Make the provenance audible: say whether it is an official/institutional \
warning or a community report, and whether the location is confirmed \
(stated) or inferred. This distinction is the point of the system — never \
drop it.
- Convey lower confidence with hedged language ("reported", "unconfirmed", \
"possible") and higher confidence plainly.
- Keep it concise and clear enough to read aloud. Plain text only — no \
markdown, no bullet points, no headings.
- Do not invent disruptions or details beyond the records provided."""


def _records_payload(route: "models.Route", disruptions: list["models.DisruptionRecord"]) -> str:
    return json.dumps(
        {
            "route": {
                "origin": route.origin_label,
                "destination": route.destination_label,
            },
            "disruptions": [
                {
                    "disruption_type": d.disruption_type,
                    "source_category": d.source_category,
                    "stated_or_inferred": d.stated_or_inferred,
                    "severity": d.severity,
                    "confidence": d.confidence,
                    "segment_id": d.segment_id,
                    "description": d.description,
                }
                for d in disruptions
            ],
        },
        indent=2,
    )


def generate_script(route: "models.Route", disruptions: list["models.DisruptionRecord"]) -> str:
    if not disruptions:
        return (
            f"No disruptions are currently reported on the {route.origin_label} "
            f"to {route.destination_label} route."
        )

    if not ANTHROPIC_API_KEY:
        return _fallback_script(route, disruptions)

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    response = client.messages.create(
        model=BROADCAST_MODEL,
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": (
                    "Write the broadcast for the following route and disruption "
                    "records:\n\n" + _records_payload(route, disruptions)
                ),
            }
        ],
    )
    return "".join(block.text for block in response.content if block.type == "text").strip()


def _fallback_script(route: "models.Route", disruptions: list["models.DisruptionRecord"]) -> str:
    """Deterministic template used when no ANTHROPIC_API_KEY is set."""
    lines = [f"Route update: {route.origin_label} to {route.destination_label}."]
    for d in disruptions:
        provenance = (
            "official Met Eireann warning"
            if d.source_category == "met_eireann_warning"
            else "community report"
        )
        location = "confirmed location" if d.stated_or_inferred == "stated" else "inferred location"
        lines.append(
            f"{d.severity.capitalize()} severity {d.disruption_type} on segment "
            f"{d.segment_id} ({provenance}, {location}). {d.description}"
        )
    return " ".join(lines)
