from app.core.config import settings
from app.db.mock_data import QUESTS
from app.db.supabase_client import get_supabase_client
from app.models.schemas import Quest, QuestCompletionRequest
from app.services.progress_service import add_xp
from app.utils.geo import parse_geojson_point


def list_quests() -> list[Quest]:
    supabase = get_supabase_client()
    if settings.use_mock_data or not supabase:
        return QUESTS

    response = supabase.table("quests_view").select("*").execute()
    data = response.data or []
    quests: list[Quest] = []
    for item in data:
        location = parse_geojson_point(item.get("location_geojson"))
        quests.append(
            Quest(
                id=str(item.get("id")),
                title=item.get("title", ""),
                description=item.get("description", ""),
                reward_xp=int(item.get("reward_xp", 0)),
                qr_code=item.get("qr_code"),
                region_id=str(item.get("region_id")) if item.get("region_id") else "",
                quest_type=item.get("quest_type", "visit"),
                rarity=item.get("rarity", "common"),
                location=location
            )
        )
    return quests


def complete_quest(user_id: str, payload: QuestCompletionRequest) -> dict:
    supabase = get_supabase_client()
    if settings.use_mock_data or not supabase:
        return {"status": "completed", "quest_id": payload.quest_id}

    quest = supabase.table("quests").select("reward_xp").eq("id", payload.quest_id).single().execute()
    reward_xp = int((quest.data or {}).get("reward_xp", 0))

    supabase.table("quest_completions").insert({
        "user_id": user_id,
        "quest_id": payload.quest_id
    }).execute()

    add_xp(user_id, reward_xp)
    return {"status": "completed", "quest_id": payload.quest_id, "reward_xp": reward_xp}
