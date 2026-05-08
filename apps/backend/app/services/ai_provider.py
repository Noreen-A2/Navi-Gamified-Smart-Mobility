import json
import re
from pathlib import Path
from typing import Protocol

from app.models.schemas import (
    RotaChatRequest,
    RotaChatResponse,
    RotaRouteRequest,
    RotaRouteResponse,
    RotaRecommendRequest,
    RotaRecommendResponse
)

_KB_PATH = Path(__file__).parent / "alamein_knowledge_base.json"

def _load_knowledge_base() -> str:
    try:
        with _KB_PATH.open("r", encoding="utf-8") as f:
            kb = json.load(f)
        return json.dumps(kb, ensure_ascii=False)
    except Exception:
        return "{}"

_KNOWLEDGE_BASE = _load_knowledge_base()

_SYSTEM_PROMPT = (
    "You are Rota AI, the intelligent city guide and route planner for New Alamein City, Egypt. "
    "You help users explore the city, plan routes, discover quests, and earn XP in the NAVI app. "
    "Be concise, enthusiastic, and futuristic in tone. Use the city knowledge base below to give "
    "accurate, location-specific answers.\n\n"
    f"CITY KNOWLEDGE BASE:\n{_KNOWLEDGE_BASE}"
)

_OPENROUTER_BASE = "https://openrouter.ai/api/v1"
_OPENROUTER_HEADERS = {
    "HTTP-Referer": "http://localhost:8000",
    "X-Title": "NAVI Rota AI"
}
_DEFAULT_MODEL = "openai/gpt-oss-120b:free"
_FALLBACK_MODELS = [
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "mistralai/mistral-7b-instruct:free"
]
_MAX_TOKENS = 500
_TIMEOUT = 30


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


class OpenRouterAIProvider:
    """Live AI provider using OpenRouter (free-tier models) with the Alamein knowledge base."""

    def __init__(self, api_key: str) -> None:
        from openai import OpenAI
        self._client = OpenAI(
            base_url=_OPENROUTER_BASE,
            api_key=api_key,
            timeout=_TIMEOUT,
            max_retries=1,
        )
        self._model = self._resolve_model()

    def _resolve_model(self) -> str:
        """Try the default model, fall back to alternatives if unavailable."""
        for model in [_DEFAULT_MODEL] + _FALLBACK_MODELS:
            try:
                self._client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": "ping"}],
                    max_tokens=1,
                    extra_headers=_OPENROUTER_HEADERS,
                )
                return model
            except Exception:
                continue
        return _DEFAULT_MODEL

    def _complete(self, user_message: str) -> str:
        """Send a single-turn message and return the text reply."""
        try:
            completion = self._client.chat.completions.create(
                model=self._model,
                messages=[
                    {"role": "system", "content": _SYSTEM_PROMPT},
                    {"role": "user", "content": user_message},
                ],
                max_tokens=_MAX_TOKENS,
                temperature=0.5,
                extra_headers=_OPENROUTER_HEADERS,
            )
            return completion.choices[0].message.content or ""
        except Exception as exc:
            return f"⚠️ Rota AI is temporarily unavailable: {str(exc)[:120]}"

    def chat(self, payload: RotaChatRequest) -> RotaChatResponse:
        reply = self._complete(payload.prompt)
        # Extract a short route preview from the reply (first sentence / up to 60 chars)
        preview_match = re.match(r"([^.!?\n]{5,60}[.!?]?)", reply)
        route_preview = preview_match.group(1).strip() if preview_match else reply[:60]
        return RotaChatResponse(message=reply, route_preview=route_preview)

    def route(self, payload: RotaRouteRequest) -> RotaRouteResponse:
        prompt = (
            f"Plan a route from ({payload.origin.latitude}, {payload.origin.longitude}) "
            f"to ({payload.destination.latitude}, {payload.destination.longitude}) "
            f"with preference: {payload.preference}. "
            "Reply as JSON with keys: summary (string), eta_minutes (int), steps (list of strings)."
        )
        raw = self._complete(prompt)
        try:
            json_match = re.search(r"\{.*\}", raw, re.DOTALL)
            data = json.loads(json_match.group()) if json_match else {}
            return RotaRouteResponse(
                summary=str(data.get("summary", raw[:80])),
                eta_minutes=int(data.get("eta_minutes", 20)),
                steps=list(data.get("steps", [raw])),
            )
        except Exception:
            return RotaRouteResponse(
                summary=raw[:120],
                eta_minutes=20,
                steps=[raw],
            )

    def recommend(self, payload: RotaRecommendRequest) -> RotaRecommendResponse:
        region_hint = f" in region {payload.region_id}" if payload.region_id else ""
        prompt = (
            f"Recommend 3 experiences{region_hint} for someone feeling {payload.mood}. "
            "Reply as a JSON array of strings, e.g. [\"item1\", \"item2\", \"item3\"]."
        )
        raw = self._complete(prompt)
        try:
            arr_match = re.search(r"\[.*?\]", raw, re.DOTALL)
            items = json.loads(arr_match.group()) if arr_match else []
            if not isinstance(items, list):
                items = []
        except Exception:
            items = []
        if not items:
            items = [raw[:120]]
        return RotaRecommendResponse(recommendations=[str(i) for i in items[:5]])


def get_ai_provider() -> AIProvider:
    from app.core.config import settings
    if settings.openrouter_api_key:
        return OpenRouterAIProvider(api_key=settings.openrouter_api_key)
    return MockAIProvider()
