from fastapi import APIRouter

from app.models.schemas import TransitVehicle
from app.services.transit_service import get_transit_vehicles

router = APIRouter()


@router.get("/vehicles", response_model=list[TransitVehicle])
async def get_vehicles():
    return get_transit_vehicles()
