from app.models.schemas import (
    RotaChatRequest,
    RotaChatResponse,
    RotaRouteRequest,
    RotaRouteResponse,
    RotaRecommendRequest,
    RotaRecommendResponse
)
from app.services.ai_provider import get_ai_provider

provider = get_ai_provider()


def get_mock_rota_response(payload: RotaChatRequest) -> RotaChatResponse:
    return provider.chat(payload)


def get_mock_route_plan(payload: RotaRouteRequest) -> RotaRouteResponse:
    return provider.route(payload)


def get_mock_recommendations(payload: RotaRecommendRequest) -> RotaRecommendResponse:
    return provider.recommend(payload)
