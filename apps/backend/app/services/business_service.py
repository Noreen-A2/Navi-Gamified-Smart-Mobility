from app.db.mock_data import BUSINESSES
from app.models.schemas import Business


def list_businesses() -> list[Business]:
    return BUSINESSES
