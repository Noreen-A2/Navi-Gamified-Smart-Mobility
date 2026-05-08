import json
from typing import List, Optional

from app.models.schemas import LatLng


def parse_geojson_point(value: Optional[str]) -> Optional[LatLng]:
    if not value:
        return None
    try:
        data = json.loads(value)
        coordinates = data.get("coordinates", [])
        if len(coordinates) >= 2:
            return LatLng(latitude=coordinates[1], longitude=coordinates[0])
    except (json.JSONDecodeError, TypeError):
        return None
    return None


def parse_geojson_polygon(value: Optional[str]) -> List[LatLng]:
    if not value:
        return []
    try:
        data = json.loads(value)
        rings = data.get("coordinates", [])
        if not rings:
            return []
        outer_ring = rings[0]
        return [LatLng(latitude=point[1], longitude=point[0]) for point in outer_ring]
    except (json.JSONDecodeError, TypeError, IndexError):
        return []
