from fastapi import APIRouter

from app.api.routes import auth, users, regions, quests, rewards, transit, businesses, ai, notifications, progress

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(regions.router, prefix="/regions", tags=["regions"])
api_router.include_router(quests.router, prefix="/quests", tags=["quests"])
api_router.include_router(rewards.router, prefix="/rewards", tags=["rewards"])
api_router.include_router(transit.router, prefix="/transit", tags=["transit"])
api_router.include_router(businesses.router, prefix="/businesses", tags=["businesses"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
