from typing import Protocol

from app.models.schemas import (
    RotaChatRequest,
    RotaChatResponse,
    RotaRouteRequest,
    RotaRouteResponse,
    RotaRecommendRequest,
    RotaRecommendResponse
)


class AIProvider(Protocol):
    def chat(self, payload: RotaChatRequest) -> RotaChatResponse: ...

    def route(self, payload: RotaRouteRequest) -> RotaRouteResponse: ...

    def recommend(self, payload: RotaRecommendRequest) -> RotaRecommendResponse: ...


class MockAIProvider:
    def chat(self, payload: RotaChatRequest) -> RotaChatResponse:
        return RotaChatResponse(
            message=(
                "Here is the quickest route using the elevated tramway. "
                "It avoids surface congestion and earns +50 XP."
            ),
            route_preview="Elevated Line: 22 min total"
        )

    def route(self, payload: RotaRouteRequest) -> RotaRouteResponse:
        return RotaRouteResponse(
            summary="Elevated tramway + short walk",
            eta_minutes=22,
            steps=[
                "Walk 5 min to Marina Tram",
                "Ride Elevated Line for 12 min",
                "Walk 5 min to destination"
            ]
        )

    def recommend(self, payload: RotaRecommendRequest) -> RotaRecommendResponse:
        return RotaRecommendResponse(
            recommendations=[
                "Marina District sunset loop",
                "Neural Hub discovery quest",
                "Old Town hidden mural trail"
            ]
        )


def get_ai_provider() -> AIProvider:
    return MockAIProvider()
