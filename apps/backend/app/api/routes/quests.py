from fastapi import APIRouter, Depends

from app.core.auth import get_current_user_id
from app.models.schemas import Quest, QuestCompletionRequest
from app.services.quest_service import list_quests, complete_quest

router = APIRouter()


@router.get("/", response_model=list[Quest])
async def get_quests():
    return list_quests()


@router.post("/complete")
async def complete_quest_route(
    payload: QuestCompletionRequest,
    user_id: str = Depends(get_current_user_id)
):
    return complete_quest(user_id, payload)
