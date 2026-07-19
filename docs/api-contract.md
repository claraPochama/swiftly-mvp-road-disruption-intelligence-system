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

## `GET /routes/{route_id}/geometry`

Returns the route's ordered road segments with real OSM `LineString`
geometry, for drawing the route on a map.

```json
[
  {
    "segment_id": "string",
    "road_ref": "string",
    "label": "string",
    "sequence_order": 0,
    "geometry": { "type": "LineString", "coordinates": [[-8.51, 51.88], "..."] }
  }
]
```

## `GET /routes/{route_id}/overlay`

Map-ready GeoJSON `FeatureCollection`: one `Feature` per segment, whose
`properties` summarise that segment's disruptions so the map can colour by
`worst_severity` and by source (`has_institutional` / `has_community`).
Reflects live Met Éireann overrides.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "LineString", "coordinates": [["..."]] },
      "properties": {
        "segment_id": "string",
        "road_ref": "string",
        "label": "string",
        "sequence_order": 0,
        "disruption_count": 0,
        "has_disruption": false,
        "worst_severity": "low | medium | high | null",
        "has_institutional": false,
        "has_community": false,
        "disruptions": [ "... DisruptionOut objects ..." ]
      }
    }
  ]
}
```

## `POST /admin/refresh-warnings`

Operator action (not used by the frontend): pulls live Met Éireann warnings
and upserts them as institutional/inferred disruption records. Returns a
per-route count summary.
