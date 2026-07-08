"""One-off script: pull real segment geometry for the two locked routes
from OpenStreetMap via the Overpass API and save as GeoJSON seed data.

    N22  Cork -> Killarney (via Macroom)
    R613 Cork -> Carrigaline

Run once, from backend/:

    python scripts/fetch_overpass_geometry.py

Output is written to backend/seed_data/*.geojson and is committed to the
repo, so this script does not need to run again unless the geometry
needs refreshing. If Overpass is unreachable, seed.py falls back to
straight-line approximations so the rest of the stack still works.
"""

import json
from pathlib import Path

import requests

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
SEED_DIR = Path(__file__).parent.parent / "seed_data"

# south, west, north, east
QUERIES = {
    "n22": {
        "ref": "N22",
        "bbox": (51.85, -9.60, 52.10, -8.40),
        "label": "Cork to Killarney via Macroom",
    },
    "r613": {
        "ref": "R613",
        "bbox": (51.75, -8.55, 51.92, -8.35),
        "label": "Cork to Carrigaline",
    },
}


def fetch_ways(ref: str, bbox: tuple[float, float, float, float]) -> list[dict]:
    south, west, north, east = bbox
    query = f"""
    [out:json][timeout:60];
    way["ref"="{ref}"]["highway"]({south},{west},{north},{east});
    out geom;
    """
    response = requests.post(
        OVERPASS_URL,
        data={"data": query},
        headers={"User-Agent": "swiftly-mvp/0.1 (UCC MScDDDB capstone project)"},
        timeout=90,
    )
    response.raise_for_status()
    return response.json()["elements"]


def ways_to_feature_collection(ways: list[dict], road_ref: str) -> dict:
    features = []
    for way in ways:
        coords = [[node["lon"], node["lat"]] for node in way.get("geometry", [])]
        if len(coords) < 2:
            continue
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "osm_way_id": way["id"],
                    "road_ref": road_ref,
                    "name": way.get("tags", {}).get("name", road_ref),
                },
                "geometry": {"type": "LineString", "coordinates": coords},
            }
        )
    return {"type": "FeatureCollection", "features": features}


def main() -> None:
    SEED_DIR.mkdir(exist_ok=True)
    for key, spec in QUERIES.items():
        print(f"Fetching {spec['ref']} ({spec['label']}) from Overpass...")
        try:
            ways = fetch_ways(spec["ref"], spec["bbox"])
        except requests.RequestException as exc:
            print(f"  Overpass request failed: {exc}. Skipping {key}.")
            continue

        fc = ways_to_feature_collection(ways, spec["ref"])
        out_path = SEED_DIR / f"{key}_segments.geojson"
        out_path.write_text(json.dumps(fc, indent=2))
        print(f"  Wrote {len(fc['features'])} way segments to {out_path}")


if __name__ == "__main__":
    main()
