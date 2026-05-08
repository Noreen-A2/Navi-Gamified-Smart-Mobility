from app.core.config import settings
from app.db.supabase_client import get_supabase_client


def register_push_token(user_id: str, token: str, platform: str) -> dict:
    supabase = get_supabase_client()
    if settings.use_mock_data or not supabase:
        return {"stored": True, "token": token}

    supabase.table("push_tokens").upsert(
        {"user_id": user_id, "token": token, "platform": platform},
        on_conflict="token"
    ).execute()

    return {"stored": True, "token": token}
