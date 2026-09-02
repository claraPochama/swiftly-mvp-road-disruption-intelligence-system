"""Minimal stand-ins for Swiftly's real ORM models.

These are NOT copies of your actual models.py. They only implement the
attributes broadcast.py actually reads (see _records_payload), so the real
generate_script() function runs unmodified against fixture data. If your
real DisruptionRecord validates fields (e.g. via Pydantic) in ways that
would reject one of the eval fixtures, that's worth knowing too — but this
harness intentionally skips that validation layer to isolate the prompt.
"""

from dataclasses import dataclass


@dataclass
class Route:
    origin_label: str
    destination_label: str


@dataclass
class DisruptionRecord:
    disruption_type: str
    source_category: str
    stated_or_inferred: str
    status: str
    severity: str
    confidence: float
    segment_id: str
    description: str
