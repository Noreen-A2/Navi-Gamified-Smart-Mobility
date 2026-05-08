from fastapi import APIRouter, Depends

from app.core.auth import get_current_user_id
from app.models.schemas import PushNotificationRequest, PushTokenRequest
from app.services.notification_service import register_push_token

router = APIRouter()


@router.post("/push")
async def push_notification(payload: PushNotificationRequest):
    return {"status": "queued", "title": payload.title}


@router.post("/register")
async def register_token(
    payload: PushTokenRequest,
    user_id: str = Depends(get_current_user_id)
):
    return register_push_token(user_id, payload.token, payload.platform)
