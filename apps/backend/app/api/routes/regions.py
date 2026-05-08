from fastapi import APIRouter, Depends

from app.core.auth import get_current_user_id
from app.models.schemas import Region, UnlockRegionRequest
from app.services.region_service import list_regions, get_region_by_id
from app.services.progress_service import unlock_region

router = APIRouter()


@router.get("/", response_model=list[Region])
async def get_regions():
    return list_regions()


@router.post("/unlock")
async def unlock_region_route(
    payload: UnlockRegionRequest,
    user_id: str = Depends(get_current_user_id)
):
    region = get_region_by_id(payload.region_id)
    if region:
        unlock_region(user_id, payload.region_id, region.unlock_xp)
    return {"status": "unlocked", "region_id": payload.region_id}
