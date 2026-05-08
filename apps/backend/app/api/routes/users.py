from fastapi import APIRouter

from app.db.mock_data import USER_PROFILE
from app.models.schemas import UserProfile

router = APIRouter()


@router.get("/me", response_model=UserProfile)
async def get_profile():
    return USER_PROFILE
