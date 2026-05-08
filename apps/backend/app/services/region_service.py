from app.core.config import settings
from app.db.mock_data import REGIONS
from app.db.supabase_client import get_supabase_client
from app.models.schemas import Region
from app.utils.geo import parse_geojson_polygon


def list_regions() -> list[Region]:
    supabase = get_supabase_client()
    if settings.use_mock_data or not supabase:
        return REGIONS

    response = supabase.table("regions_view").select("*").execute()
    data = response.data or []
    regions: list[Region] = []
    for item in data:
        coordinates = parse_geojson_polygon(item.get("boundary_geojson"))
        regions.append(
            Region(
                id=str(item.get("id")),
                name=item.get("name", ""),
                coordinates=coordinates,
                unlock_xp=int(item.get("unlock_xp", 0)),
                rarity=item.get("rarity", "common")
            )
        )
    return regions


def get_region_by_id(region_id: str) -> Region | None:
    regions = list_regions()
    for region in regions:
        if region.id == region_id:
            return region
    return None
