# API Contract

Locked for the 3-week MVP. Frontend never sends raw text — it only ever
sends a `route_id` obtained from `GET /routes`. Any change to this file
mid-sprint should go through a PR reviewed by both of us.

## `GET /routes`

Returns the fixed route list (2 routes, no path-finding).

```json
[
  { "route_id": "cork-killarney", "origin_label": "Cork", "destination_label": "Killarney" },
  { "route_id": "cork-carrigaline", "origin_label": "Cork", "destination_label": "Carrigaline" }
]
```

## `GET /routes/{route_id}/disruptions`

Returns disruption records matched to the route's segments.

```json
[
  {
    "id": "string",
    "segment_id": "string",
    "disruption_type": "string",
    "source_category": "string",
    "stated_or_inferred": "stated | inferred",
    "severity": "string",
    "confidence": "number",
    "expiry": "ISO 8601 datetime"
  }
]
```

## `POST /routes/{route_id}/broadcast`

Generates a text broadcast script from the route's currently matched
disruption records. No request body — route context comes entirely from
the path parameter.

```json
{
  "script_text": "string",
  "generated_at": "ISO 8601 datetime"
}
```
