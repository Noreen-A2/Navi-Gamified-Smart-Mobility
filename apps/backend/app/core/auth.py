from fastapi import Header, HTTPException

from app.core.config import settings
from app.db.supabase_client import get_supabase_client


def get_bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    if authorization.lower().startswith("bearer "):
        return authorization.split(" ", 1)[1].strip()
    return authorization.strip()


async def get_current_user_id(authorization: str | None = Header(default=None)) -> str:
    supabase = get_supabase_client()
    if settings.use_mock_data or not supabase:
        return "demo-user"

    token = get_bearer_token(authorization)
    if not token:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    response = supabase.auth.get_user(token)
    if response.user is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return response.user.id
