from supabase import create_client, Client

from app.core.config import settings


def get_supabase_client() -> Client | None:
    if not settings.supabase_url or not settings.supabase_service_key:
        return None
    return create_client(settings.supabase_url, settings.supabase_service_key)
