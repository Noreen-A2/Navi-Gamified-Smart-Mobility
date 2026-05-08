from fastapi import APIRouter

from app.models.schemas import Reward
from app.services.reward_service import list_rewards

router = APIRouter()


@router.get("/", response_model=list[Reward])
async def get_rewards():
    return list_rewards()
