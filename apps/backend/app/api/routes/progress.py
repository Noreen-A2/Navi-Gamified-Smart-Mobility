from fastapi import APIRouter, Depends

from app.core.auth import get_current_user_id
from app.models.schemas import UserProfile
from app.services.progress_service import get_progress

router = APIRouter()


@router.get("/", response_model=UserProfile)
async def get_progress_route(user_id: str = Depends(get_current_user_id)):
    return get_progress(user_id)
