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


def get_rota_response(payload: RotaChatRequest) -> RotaChatResponse:
    return provider.chat(payload)


def get_rota_route(payload: RotaRouteRequest) -> RotaRouteResponse:
    return provider.route(payload)


def get_rota_recommendations(payload: RotaRecommendRequest) -> RotaRecommendResponse:
    return provider.recommend(payload)
