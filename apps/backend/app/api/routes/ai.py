from fastapi import APIRouter

from app.models.schemas import (
    RotaChatRequest,
    RotaChatResponse,
    RotaRouteRequest,
    RotaRouteResponse,
    RotaRecommendRequest,
    RotaRecommendResponse
)
from app.services.ai_service import (
    get_rota_response,
    get_rota_route,
    get_rota_recommendations
)

router = APIRouter()


@router.post("/chat", response_model=RotaChatResponse)
async def chat(payload: RotaChatRequest):
    return get_rota_response(payload)


@router.post("/route", response_model=RotaRouteResponse)
async def route(payload: RotaRouteRequest):
    return get_rota_route(payload)


@router.post("/recommend", response_model=RotaRecommendResponse)
async def recommend(payload: RotaRecommendRequest):
    return get_rota_recommendations(payload)
