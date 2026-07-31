# API Contract

Locked for the 3-week MVP. All read endpoints take only a `route_id` obtained
from `GET /routes`. The **one** write path where the frontend sends content is
`POST /routes/{route_id}/reports` (a public user's community disruption report).
Any change to this file mid-sprint should go through a PR reviewed by both of us.

## `GET /routes`

Returns the fixed route list (2 routes, no path-finding).

```json
[
  { "route_id": "cork-killarney", "origin_label": "Cork", "destination_label": "Killarney" },
  { "route_id": "cork-carrigaline", "origin_label": "Cork", "destination_label": "Carrigaline" }
]
```

## The `DisruptionOut` object

Every disruption endpoint returns this shape (referred to below as
`DisruptionOut`):

```json
{
  "id": "string",
  "segment_id": "string",
  "road_ref": "string | null",
  "segment_label": "string | null",
  "disruption_type": "string",
  "source_category": "met_eireann_warning | council_notice | community_report",
  "stated_or_inferred": "stated | inferred",
  "status": "reported | confirmed | cleared",
  "severity": "low | medium | high",
  "confidence": "number",
  "description": "string",
  "created_at": "ISO 8601 datetime",
  "expiry": "ISO 8601 datetime",
  "updates": [
    {
      "id": "string",
      "status": "reported | confirmed | cleared",
      "note": "string",
      "created_at": "ISO 8601 datetime"
    }
  ]
}
```

`road_ref` / `segment_label` are the human road label for the disruption's
segment (e.g. `"N22"` / `"Ballincollig to Macroom"`), so the UI can show a title
and location without a second lookup; `description` is the full incident text.
`updates` is the ordered timeline the alert screen renders (e.g. "reported" →
"confirmed by emergency personnel"). `source_category` is one of two
institutional sources (`met_eireann_warning`, `council_notice`) or
`community_report`.

## `GET /routes/{route_id}/disruptions`

Returns `DisruptionOut[]` matched to the route's segments — the view **everyone**
sees. Unconfirmed community reports **are** included here (`status: "reported"`);
render them with an "unverified" badge. They are excluded only from the spoken
broadcast, not from this list. Reflects live Met Éireann overrides.

```json
[ "... DisruptionOut objects ..." ]
```

## `POST /routes/{route_id}/broadcast`

Generates a text broadcast script from the route's currently matched
disruption records. No request body — route context comes entirely from
the path parameter. This is the one place the verification gate applies:
unconfirmed community reports are excluded, so the bulletin only voices
confirmed or institutional information (even though they still show on the
list and overlay).

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
`has_institutional` is true for either institutional source (`met_eireann_warning`
or `council_notice`). Reflects live Met Éireann overrides, and — like the
disruptions endpoint — **includes** unconfirmed community reports (`status:
"reported"`), so `has_community` can be true for an unverified report; only the
broadcast filters them out.

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

## `POST /routes/{route_id}/reports`

A public user files a community disruption report on this route. This is the
only endpoint where the frontend sends content. The backend fixes
`source_category="community_report"`, `stated_or_inferred="stated"` and
`status="reported"`; the report is **visible to everyone as unverified** on the
disruptions list and overlay, but is **kept out of the spoken broadcast** until
emergency personnel confirm it. `segment_id` must be one of the route's segments
(otherwise `422`).

Request body:

```json
{
  "segment_id": "string",
  "disruption_type": "string",
  "severity": "low | medium | high",
  "description": "string",
  "note": "string | null"
}
```

Response `201`: the created `DisruptionOut` (with its first `updates` entry).

## `GET /disruptions/pending`

The emergency-personnel review queue: community reports still awaiting
confirmation (`community_report` records with `status="reported"`). Not used by
the driver flow.

```json
[ "... DisruptionOut objects ..." ]
```

## `POST /disruptions/{disruption_id}/updates`

Appends one entry to a disruption's timeline and advances its current `status`.
This is how emergency personnel **confirm** a pending report (`status:"confirmed"`),
and how a disruption is later marked `cleared`.

Request body:

```json
{
  "status": "reported | confirmed | cleared",
  "note": "string"
}
```

Response `200`: the updated `DisruptionOut` with its full ordered `updates`.

## `POST /admin/refresh-warnings`

Operator action (not used by the frontend): pulls live Met Éireann warnings
and upserts them as institutional/inferred disruption records. Returns a
per-route count summary.
