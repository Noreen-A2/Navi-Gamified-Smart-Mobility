from app.db.mock_data import REWARDS
from app.models.schemas import Reward


def list_rewards() -> list[Reward]:
    return REWARDS
