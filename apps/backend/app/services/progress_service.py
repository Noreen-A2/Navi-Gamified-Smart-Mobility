from app.core.config import settings
from app.db.mock_data import USER_PROFILE
from app.db.supabase_client import get_supabase_client
from app.models.schemas import UserProfile


def _level_from_xp(xp: int) -> int:
    return max(1, (xp // 500) + 1)


def get_progress(user_id: str) -> UserProfile:
    supabase = get_supabase_client()
    if settings.use_mock_data or not supabase:
        return USER_PROFILE

    response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
    data = response.data or {}

    xp = int(data.get("xp", 0))
    level = int(data.get("level", _level_from_xp(xp)))

    return UserProfile(
        id=str(data.get("id", user_id)),
        username=data.get("username", "Explorer"),
        phone=data.get("phone"),
        level=level,
        xp=xp,
        unlocked_regions=[str(item) for item in data.get("unlocked_regions", [])],
        visited_locations=[],
        streak=int(data.get("streak", 0)),
        achievements=data.get("achievements", []),
        badges=data.get("badges", []) if isinstance(data.get("badges", []), list) else []
    )


def add_xp(user_id: str, xp_delta: int) -> int:
    supabase = get_supabase_client()
    if settings.use_mock_data or not supabase:
        return USER_PROFILE.xp + xp_delta

    profile = supabase.table("profiles").select("xp", "level").eq("id", user_id).single().execute()
    data = profile.data or {}
    xp = int(data.get("xp", 0)) + xp_delta
    level = _level_from_xp(xp)

    supabase.table("profiles").update({"xp": xp, "level": level}).eq("id", user_id).execute()
    return xp


def unlock_region(user_id: str, region_id: str, xp_reward: int) -> None:
    supabase = get_supabase_client()
    if settings.use_mock_data or not supabase:
        return

    profile = supabase.table("profiles").select("unlocked_regions").eq("id", user_id).single().execute()
    data = profile.data or {}
    unlocked = [str(item) for item in data.get("unlocked_regions", [])]
    if region_id not in unlocked:
        unlocked.append(region_id)

    supabase.table("profiles").update({"unlocked_regions": unlocked}).eq("id", user_id).execute()
    add_xp(user_id, xp_reward)
    supabase.table("user_progress").insert({
        "user_id": user_id,
        "region_id": region_id,
        "xp_earned": xp_reward
    }).execute()
