from fastapi import APIRouter

from app.models.schemas import Business
from app.services.business_service import list_businesses

router = APIRouter()


@router.get("/", response_model=list[Business])
async def get_businesses():
    return list_businesses()
