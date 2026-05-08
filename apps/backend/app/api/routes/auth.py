from fastapi import APIRouter, Header, HTTPException

from app.core.config import settings
from app.db.supabase_client import get_supabase_client

router = APIRouter()


@router.get("/health")
async def auth_health():
    return {"status": "ok"}


@router.post("/verify")
async def verify_token(authorization: str | None = Header(default=None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    token = authorization.replace("Bearer ", "")
    supabase = get_supabase_client()
    if not supabase or settings.use_mock_data:
        return {"valid": True, "user_id": "demo-user"}

    response = supabase.auth.get_user(token)
    if response.user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"valid": True, "user_id": response.user.id}
