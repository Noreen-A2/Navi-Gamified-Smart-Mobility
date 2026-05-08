import json
import math
import os
import re
import sys
from pathlib import Path
from typing import Any, Optional, Protocol

from app.core.config import settings
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


ROTA_SYSTEM_PROMPT = (
    "You are Rota AI, a concise city concierge for New Alamein, Egypt. "
    "Answer in 2-4 short sentences with clear next steps. "
    "Prefer local districts like Marina, Downtown Core, AIU Zone, and Hotel Strip."
)

ROTA_JSON_CHAT_PROMPT = (
    "You are Rota AI, a concise city concierge for New Alamein, Egypt. "
    "Return valid JSON only with keys: message, route_preview. "
    "message: 2-4 short sentences. route_preview: 6-12 words."
)

ROTA_JSON_ROUTE_PROMPT = (
    "You are Rota AI. Return valid JSON only with keys: summary, eta_minutes, steps. "
    "eta_minutes must be an integer. steps must be an array of 3-5 short strings."
)

ROTA_JSON_RECOMMEND_PROMPT = (
    "You are Rota AI. Return valid JSON only with key: recommendations, "
    "an array of 3-5 short suggestions for New Alamein."
)

_ROTA_AGENT: Optional[object] = None
_ROTA_AGENT_ERROR: Optional[str] = None


def _load_rota_agent() -> Optional[object]:
    global _ROTA_AGENT, _ROTA_AGENT_ERROR
    if _ROTA_AGENT or _ROTA_AGENT_ERROR:
        return _ROTA_AGENT

    api_key = settings.openrouter_api_key or os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        _ROTA_AGENT_ERROR = "OPENROUTER_API_KEY is not set"
        return None

    try:
        root = Path(__file__).resolve().parents[5]
        rota_dir = root / "Rota"
        if not rota_dir.is_dir():
            _ROTA_AGENT_ERROR = f"Rota directory not found: {rota_dir}"
            return None
        if str(rota_dir) not in sys.path:
            sys.path.insert(0, str(rota_dir))
        import ai_agent  # type: ignore

        _ROTA_AGENT = ai_agent.TerminalAIAgent(
            optimize_speed=True,
            stream_output=False,
            use_fallback=True,
            api_key=api_key
        )
        return _ROTA_AGENT
    except Exception as exc:
        _ROTA_AGENT_ERROR = str(exc)
        return None


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius_km = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return radius_km * c


def _preview_from_prompt(prompt: str) -> str:
    prompt_lower = prompt.lower()
    if any(keyword in prompt_lower for keyword in ("route", "go", "get to", "reach", "eta")):
        return "Preview: Marina Boulevard + short walk (~18 min)"
    if any(keyword in prompt_lower for keyword in ("food", "eat", "cafe", "restaurant")):
        return "Preview: Marina 3 food loop (3 stops)"
    if any(keyword in prompt_lower for keyword in ("beach", "sunset", "walk")):
        return "Preview: Marina boardwalk loop (~25 min)"
    return "Preview: Ask for a route to get step-by-step guidance"


def _extract_json(payload: str) -> Optional[Any]:
    text = payload.strip()
    text = text.replace("💨", "").strip()
    if text.startswith("```"):
        text = re.sub(r"^```(json)?\n|```$", "", text, flags=re.IGNORECASE | re.MULTILINE).strip()
    try:
        return json.loads(text)
    except Exception:
        pass

    match = re.search(r"\{.*\}|\[.*\]", text, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except Exception:
        return None


def _retry_json(agent: object, prompt: str, system_prompt: str, retries: int = 1) -> tuple[str, Optional[Any]]:
    last_reply = ""
    for attempt in range(retries + 1):
        if attempt:
            tightened_prompt = system_prompt + " Return JSON only. Do not add extra text."
        else:
            tightened_prompt = system_prompt
        last_reply = agent.chat(prompt, system_prompt=tightened_prompt, stream_output=False)
        parsed = _extract_json(last_reply)
        if parsed is not None:
            return last_reply, parsed
    return last_reply, None


class RotaAgentProvider:
    def __init__(self, allow_fallback: bool = False):
        self.allow_fallback = allow_fallback
        self.fallback = MockAIProvider()

    def _ensure_agent(self) -> object:
        agent = _load_rota_agent()
        if agent:
            return agent
        if self.allow_fallback:
            return None
        error = _ROTA_AGENT_ERROR or "Rota agent failed to initialize"
        raise RuntimeError(error)

    def chat(self, payload: RotaChatRequest) -> RotaChatResponse:
        agent = self._ensure_agent()
        if not agent:
            return self.fallback.chat(payload)

        kb_answer = agent.answer_from_kb(payload.prompt)
        if kb_answer:
            return RotaChatResponse(message=kb_answer, route_preview=_preview_from_prompt(payload.prompt))

        reply, parsed = _retry_json(agent, payload.prompt, ROTA_JSON_CHAT_PROMPT)
        if isinstance(parsed, dict) and parsed.get("message"):
            return RotaChatResponse(
                message=str(parsed.get("message")),
                route_preview=str(parsed.get("route_preview") or _preview_from_prompt(payload.prompt))
            )

        return RotaChatResponse(message=reply, route_preview=_preview_from_prompt(payload.prompt))

    def route(self, payload: RotaRouteRequest) -> RotaRouteResponse:
        agent = self._ensure_agent()
        if not agent:
            return self.fallback.route(payload)

        prompt = (
            "Provide a route plan in New Alamein. "
            f"Origin: {payload.origin.latitude}, {payload.origin.longitude}. "
            f"Destination: {payload.destination.latitude}, {payload.destination.longitude}. "
            f"Preference: {payload.preference or 'balanced'}."
        )
        reply, parsed = _retry_json(agent, prompt, ROTA_JSON_ROUTE_PROMPT)
        if isinstance(parsed, dict):
            summary = str(parsed.get("summary") or "Rota route")
            eta = parsed.get("eta_minutes")
            steps = parsed.get("steps") if isinstance(parsed.get("steps"), list) else None
            if isinstance(eta, (int, float)) and steps:
                return RotaRouteResponse(
                    summary=summary,
                    eta_minutes=int(eta),
                    steps=[str(step) for step in steps][:5]
                )

        return self.fallback.route(payload)

    def recommend(self, payload: RotaRecommendRequest) -> RotaRecommendResponse:
        agent = self._ensure_agent()
        if not agent:
            return self.fallback.recommend(payload)

        prompt = (
            "Suggest New Alamein activities. "
            f"Mood: {payload.mood or 'curious'}. "
            f"Region: {payload.region_id or 'any'}."
        )
        reply, parsed = _retry_json(agent, prompt, ROTA_JSON_RECOMMEND_PROMPT)
        if isinstance(parsed, dict) and isinstance(parsed.get("recommendations"), list):
            return RotaRecommendResponse(
                recommendations=[str(item) for item in parsed.get("recommendations")][:5]
            )

        return self.fallback.recommend(payload)


def get_ai_provider() -> AIProvider:
    allow_fallback = not bool(settings.openrouter_api_key or os.getenv("OPENROUTER_API_KEY"))
    return RotaAgentProvider(allow_fallback=allow_fallback)
