"""
FastAPI gateway for the Al‑Alamein AI assistant & the hard‑accuracy suite.

Endpoints
---------
POST   /chat          → ask a natural‑language question
GET    /models        → list the free models that the agent can use
GET    /accuracy      → run the hard‑accuracy test suite (optional, heavy)

Run with:
    uvicorn api:app --host 0.0.0.0 --port 8000 --reload
"""
import asyncio
# ----------------------------------------------------------------------
# Standard library
# ----------------------------------------------------------------------
import json
from pathlib import Path
from typing import List, Dict, Any

# ----------------------------------------------------------------------
# Third‑party
# ----------------------------------------------------------------------
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import uvicorn

# Import the two modules you already have
from ai_agent import TerminalAIAgent          # ← the chatbot class
from Accuracy import HardTestRunner           # ← the hard‑accuracy runner (renamed in the file you posted)

# ----------------------------------------------------------------------
# FastAPI app
# ----------------------------------------------------------------------
app = FastAPI(
    title="Al‑Alamein AI Gateway",
    version="0.1.0",
    description=(
        "Expose the terminal AI‑agent (OpenRouter‑backed) and the hard‑"
        "accuracy test suite as HTTP endpoints.  All heavy lifting "
        "remains in the original modules – this file is only a thin "
        "adapter."
    ),
)

# ----------------------------------------------------------------------
# Pydantic models – request / response payloads
# ----------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str = Field(..., description="User question / prompt")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="AI answer")
    model: str = Field(..., description="Model that generated the answer")
    cached: bool = Field(..., description="True if the answer came from the local cache")

class AccuracyReport(BaseModel):
    """A lightweight view of the full JSON report produced by HardTestRunner."""
    total_tests: int
    passed: int
    failed: int
    overall_accuracy_pct: float
    average_score: float
    timestamp: str

# ----------------------------------------------------------------------
# Global, long‑living objects
# ----------------------------------------------------------------------
# 1️⃣  The chat‑agent – we create **one** instance and keep it alive for the
#     whole lifetime of the server, so model loading / caching only happens
#     once.
agent = TerminalAIAgent(optimize_speed=True)

# 2️⃣  The accuracy runner – created on‑demand (the suite is cheap, but the
#     full report can be a bit heavy, so we lazily instantiate it).
def get_accuracy_runner() -> HardTestRunner:
    return HardTestRunner()

# ----------------------------------------------------------------------
# Helper – tiny wrapper to expose the internal cache flag
# ----------------------------------------------------------------------
def _chat_with_cache_flag(message: str) -> Dict[str, Any]:
    """
    Calls ``agent.chat`` and returns a dict with:
        * reply – the string answer
        * model – the model name the agent used
        * cached – whether the answer was pulled from the local cache
    """
    # The ``TerminalAIAgent.chat`` method **already** checks its own cache and
    # returns a string ending with the emoji "💨" when it was cached.
    # We use that convention to expose the flag in a clean way.
    raw_reply = agent.chat(message)

    cached = raw_reply.endswith("💨")
    # Strip the visual hint before sending it back to the caller
    reply = raw_reply.rstrip(" 💨")

    return {
        "reply": reply,
        "model": agent.model,
        "cached": cached,
    }

# ----------------------------------------------------------------------
# Endpoints
# ----------------------------------------------------------------------
@app.post("/chat", response_model=ChatResponse, summary="Ask the AI assistant")
async def chat_endpoint(payload: ChatRequest):
    """
    Send a free‑form question to the AI assistant.

    Example with **httpie**:

        http POST http://localhost:8000/chat message="Where is the nearest pharmacy?"
    """
    try:
        result = _chat_with_cache_flag(payload.message)
        return ChatResponse(**result)
    except Exception as exc:   # pragma: no cover – unexpected errors
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/models", summary="List free models currently available")
async def list_models():
    """
    Returns the list of free models that the ``TerminalAIAgent`` found
    when it started up, together with the one currently in use.
    """
    return {
        "available_models": agent.free_models,
        "current_model": agent.model,
    }


@app.get("/accuracy", response_model=AccuracyReport, summary="Run the hard‑accuracy suite")
async def run_accuracy():
    """
    Execute the **hard‑accuracy** test suite on‑the‑fly and return a short
    summary.  The full JSON report is also stored on disk (``accuracy_report.json``)
    for later inspection.

    Because the suite is CPU‑bound, it runs in a thread‑pool executor so the
    async event‑loop stays responsive.

    Example:

        curl http://localhost:8000/accuracy
    """
    import concurrent.futures
    loop = asyncio.get_running_loop()

    # Run the heavy work in a separate thread – it does not block the server.
    runner = get_accuracy_runner()
    report: dict = await loop.run_in_executor(
        concurrent.futures.ThreadPoolExecutor(max_workers=1), runner.run
    )

    # Build a tiny public view (the full JSON stays on disk)
    summary = report["metadata"]
    return AccuracyReport(
        total_tests=summary["total_tests"],
        passed=summary["passed"],
        failed=summary["failed"],
        overall_accuracy_pct=summary["overall_accuracy_pct"],
        average_score=summary["average_score"],
        timestamp=summary["timestamp"],
    )
