"""One-off script: build the geometry for BOTH driving routes from the public
OSRM routing service, and cut each into its named road segments.

Why a routing service (and not OpenStreetMap `ref` tags)? A national road like
the N22 is tagged `ref=N22` end to end in OSM, but a regional road like the R613
has city sections tagged only by street name, so a ref query returns a broken,
half-missing line. Asking OSRM for the driving path between waypoints gives a
complete, continuous route for either kind of road, so both are built the same
way here. This replaces the older fetch_overpass_geometry.py +
build_route_segments.py (N22) and fetch_r613_osrm.py (R613).

Each route is defined as an ordered list of waypoints. OSRM is asked for the
path through all of them in one call; the returned line is then split at each
intermediate waypoint into one segment per leg. The first waypoint of each leg
carries that leg's segment id and label; the final waypoint is the destination.

Run once, from backend/:

    python scripts/fetch_route_geometry.py

Writes backend/seed_data/<route>_route.geojson. Re-run seed.py afterwards.
"""

import json
from pathlib import Path

import requests
from shapely.geometry import LineString, Point, mapping
from shapely.ops import substring

OSRM_URL = "https://router.project-osrm.org/route/v1/driving/"
SEED_DIR = Path(__file__).parent.parent / "seed_data"

# Each waypoint: (lon, lat, segment_id, label). segment_id/label describe the
# leg that STARTS at this waypoint; the last waypoint is the destination and
# carries (None, None).
ROUTES = {
    "n22": {
        "road_ref": "N22",
        "waypoints": [
            (-8.5100, 51.8880, "n22-seg-1", "Cork to Ballincollig"),
            (-8.5987, 51.8869, "n22-seg-2", "Ballincollig to Macroom (Macroom Bypass)"),
            (-8.9633, 51.9016, "n22-seg-3", "Macroom to Killarney"),
            (-9.5044, 52.0599, None, None),  # Killarney (destination)
        ],
    },
    "r613": {
        "road_ref": "R613",
        "waypoints": [
            (-8.4794, 51.8829, "r613-seg-1", "Cork to Douglas"),
            (-8.4436, 51.8730, "r613-seg-2", "Douglas to Carrigaline"),
            (-8.3986, 51.8106, None, None),  # Carrigaline (destination)
        ],
    },
}


def fetch_route(waypoints: list[tuple]) -> tuple[LineString, list[tuple[float, float]]]:
    coords = ";".join(f"{lon},{lat}" for lon, lat, _, _ in waypoints)
    resp = requests.get(
        f"{OSRM_URL}{coords}",
        params={"overview": "full", "geometries": "geojson", "steps": "false"},
        headers={"User-Agent": "swiftly-mvp/0.1 (UCC MScDDDB capstone project)"},
        timeout=45,
    )
    resp.raise_for_status()
    data = resp.json()
    if data.get("code") != "Ok" or not data.get("routes"):
        raise RuntimeError(f"OSRM returned no route: {data.get('code')}")
    line = LineString(data["routes"][0]["geometry"]["coordinates"])
    # OSRM snaps each input waypoint to the nearest road; use those snapped
    # locations to cut the line so the splits land exactly on the route.
    snapped = [tuple(wp["location"]) for wp in data["waypoints"]]
    return line, snapped


def build_features(spec: dict) -> list[dict]:
    line, snapped = fetch_route(spec["waypoints"])

    # Distance along the line for each (snapped) waypoint, forced non-decreasing.
    cuts = []
    prev = 0.0
    for point in snapped:
        d = max(line.project(Point(point)), prev)
        cuts.append(d)
        prev = d
    cuts[-1] = line.length  # destination = end of line

    features = []
    for i, (_, _, segment_id, label) in enumerate(spec["waypoints"][:-1]):
        leg = substring(line, cuts[i], cuts[i + 1])
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
    return features


def main() -> None:
    for key, spec in ROUTES.items():
        features = build_features(spec)
        out_path = SEED_DIR / f"{key}_route.geojson"
        out_path.write_text(json.dumps({"type": "FeatureCollection", "features": features}, indent=2))
        print(f"{key} -> {out_path}")
        for f in features:
            coords = f["geometry"]["coordinates"]
            print(f"   {f['properties']['segment_id']:12} {f['properties']['label']:42} {len(coords)} pts")


if __name__ == "__main__":
    main()
