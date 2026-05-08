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
    get_mock_rota_response,
    get_mock_route_plan,
    get_mock_recommendations
)

router = APIRouter()


@router.post("/chat", response_model=RotaChatResponse)
async def chat(payload: RotaChatRequest):
    return get_mock_rota_response(payload)


@router.post("/route", response_model=RotaRouteResponse)
async def route(payload: RotaRouteRequest):
    return get_mock_route_plan(payload)


@router.post("/recommend", response_model=RotaRecommendResponse)
async def recommend(payload: RotaRecommendRequest):
    return get_mock_recommendations(payload)
