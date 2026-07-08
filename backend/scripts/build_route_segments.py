"""One-off script: turn the raw Overpass way fragments (n22_segments.geojson,
r613_segments.geojson -- one row per tiny OSM way, hundreds of them) into a
small ordered list of named RoadSegment legs suitable for the route fixture
table (route_id, origin_label, destination_label, ordered segment_ids[]).

Merges the fragments into a single continuous line per road, then cuts that
line at known waypoints (Cork, Ballincollig, Macroom, Killarney / Cork,
Douglas, Carrigaline) so each leg is independently addressable -- e.g. the
Macroom Bypass icing incident tags n22-seg-2 specifically, not the whole N22.

Run once, from backend/, after fetch_overpass_geometry.py:

    python scripts/build_route_segments.py
"""

import json
from pathlib import Path

from shapely.geometry import LineString, Point, mapping
from shapely.ops import substring

SEED_DIR = Path(__file__).parent.parent / "seed_data"

# (segment_id, label, waypoint lon/lat marking the END of this leg)
ROUTES = {
    "n22": {
        "raw_file": "n22_segments.geojson",
        "road_ref": "N22",
        "start": ("Cork", (-8.5100, 51.8880)),
        "max_perp_deg": 0.08,
        "legs": [
            ("n22-seg-1", "Cork to Ballincollig", (-8.5987, 51.8869)),
            ("n22-seg-2", "Ballincollig to Macroom (Macroom Bypass)", (-8.9633, 51.9016)),
            ("n22-seg-3", "Macroom to Killarney", (-9.5044, 52.0599)),
        ],
    },
    "r613": {
        "raw_file": "r613_segments.geojson",
        "road_ref": "R613",
        "start": ("Cork", (-8.4794, 51.8829)),  # Kinsale Road roundabout, R613 origin
        "max_perp_deg": 0.03,
        "legs": [
            ("r613-seg-1", "Cork to Douglas", (-8.4520, 51.8687)),
            ("r613-seg-2", "Douglas to Carrigaline", (-8.3986, 51.8106)),
        ],
    },
}


def load_lines(raw_path: Path) -> list[LineString]:
    data = json.loads(raw_path.read_text(encoding="utf-8"))
    lines = []
    for feature in data["features"]:
        coords = feature["geometry"]["coordinates"]
        if len(coords) >= 2:
            lines.append(LineString(coords))
    return lines


def build_ordered_line(
    lines: list[LineString], origin: tuple, destination: tuple, max_perp_deg: float, num_bins: int = 150
) -> LineString:
    """Real OSM way fragments rarely share exact endpoints (roundabouts, dual
    carriageways, gaps in ref tagging break topological linemerge). Instead,
    project every fragment point onto the straight origin->destination
    reference line, bucket by distance-along-corridor, and average each
    bucket to a centroid -- tolerant of gaps, and smooths out the zigzag
    that raw point ordering produces where parallel carriageways or slip
    roads sit within the corridor tolerance."""
    ref = LineString([origin, destination])
    bin_size = ref.length / num_bins
    buckets: dict[int, list[tuple]] = {}
    for line in lines:
        for coord in line.coords:
            point = Point(coord)
            if ref.distance(point) <= max_perp_deg:
                bin_index = int(ref.project(point) / bin_size)
                buckets.setdefault(bin_index, []).append(coord)

    coords = []
    for bin_index in sorted(buckets):
        pts = buckets[bin_index]
        centroid = (sum(c[0] for c in pts) / len(pts), sum(c[1] for c in pts) / len(pts))
        coords.append(centroid)
    return LineString(coords)


def build_route(key: str, spec: dict) -> dict:
    raw_path = SEED_DIR / spec["raw_file"]
    lines = load_lines(raw_path)
    origin = spec["start"][1]
    destination = spec["legs"][-1][2]
    line = build_ordered_line(lines, origin, destination, spec["max_perp_deg"])

    cursor = line.project(Point(origin))
    features = []
    for i, (segment_id, label, waypoint) in enumerate(spec["legs"]):
        end_dist = line.project(Point(waypoint))
        if end_dist <= cursor:
            end_dist = cursor + 0.0001  # degenerate guard, shouldn't happen with real data
        leg = substring(line, cursor, end_dist)
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "segment_id": segment_id,
                    "road_ref": spec["road_ref"],
                    "label": label,
                    "sequence_order": i,
                },
                "geometry": mapping(leg),
            }
        )
        cursor = end_dist

    return {"type": "FeatureCollection", "features": features}


def main() -> None:
    for key, spec in ROUTES.items():
        fc = build_route(key, spec)
        out_path = SEED_DIR / f"{key}_route.geojson"
        out_path.write_text(json.dumps(fc, indent=2))
        lengths_km = [
            LineString(f["geometry"]["coordinates"]).length * 111  # rough deg->km
            for f in fc["features"]
        ]
        print(f"{key}: {len(fc['features'])} legs -> {out_path}")
        for f, km in zip(fc["features"], lengths_km):
            print(f"   {f['properties']['segment_id']:<12} {f['properties']['label']:<40} ~{km:.1f} km")


if __name__ == "__main__":
    main()
