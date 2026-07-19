"""One-off script: build the R613 (Cork -> Carrigaline) route geometry from a
routing service instead of by OSM ref.

Why not Overpass-by-ref (like the N22)? The N22 is a national primary road and
is tagged `ref=N22` end to end in OSM, so fetch_overpass_geometry.py +
build_route_segments.py capture it fully. The R613 is a regional road whose
urban sections through Cork city and Douglas are tagged by street name with no
`ref=R613`, so the ref query returned only a short rural sliver near Carrigaline
-- the map showed the route starting halfway down.

Here we ask the public OSRM demo server for the driving path through a Douglas
via-point (Douglas is unambiguously on the R613), which keeps the line on the
real R613 corridor rather than the parallel N28. The result is split at Douglas
into the same two segments the rest of the app expects.

Run once, from backend/:

    python scripts/fetch_r613_osrm.py

Overwrites backend/seed_data/r613_route.geojson. Re-run seed.py afterwards.
"""

import json
from pathlib import Path

import requests
from shapely.geometry import LineString, Point, mapping
from shapely.ops import substring

OSRM_URL = "https://router.project-osrm.org/route/v1/driving/"
SEED_DIR = Path(__file__).parent.parent / "seed_data"

# (lon, lat) waypoints along the R613 corridor.
CORK = (-8.4794, 51.8829)       # Kinsale Road, R613 north end
DOUGLAS = (-8.4436, 51.8730)    # Douglas, on the R613 -- also the segment split
CARRIGALINE = (-8.3986, 51.8106)

LEGS = [
    ("r613-seg-1", "Cork to Douglas", 0),
    ("r613-seg-2", "Douglas to Carrigaline", 1),
]


def fetch_route(waypoints: list[tuple[float, float]]) -> LineString:
    coords = ";".join(f"{lon},{lat}" for lon, lat in waypoints)
    url = f"{OSRM_URL}{coords}"
    resp = requests.get(
        url,
        params={"overview": "full", "geometries": "geojson", "steps": "false"},
        headers={"User-Agent": "swiftly-mvp/0.1 (UCC MScDDDB capstone project)"},
        timeout=45,
    )
    resp.raise_for_status()
    data = resp.json()
    if data.get("code") != "Ok" or not data.get("routes"):
        raise RuntimeError(f"OSRM returned no route: {data.get('code')}")
    return LineString(data["routes"][0]["geometry"]["coordinates"])


def main() -> None:
    line = fetch_route([CORK, DOUGLAS, CARRIGALINE])

    split_at = line.project(Point(DOUGLAS))
    cuts = [(0.0, split_at), (split_at, line.length)]

    features = []
    for (segment_id, label, order), (start, end) in zip(LEGS, cuts):
        leg = substring(line, start, end)
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "segment_id": segment_id,
                    "road_ref": "R613",
                    "label": label,
                    "sequence_order": order,
                },
                "geometry": mapping(leg),
            }
        )

    out_path = SEED_DIR / "r613_route.geojson"
    out_path.write_text(json.dumps({"type": "FeatureCollection", "features": features}, indent=2))
    for f in features:
        n = len(f["geometry"]["coordinates"])
        print(f"  {f['properties']['segment_id']:12} {f['properties']['label']:26} {n} pts")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
