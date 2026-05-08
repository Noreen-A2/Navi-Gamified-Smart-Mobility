from typing import List, Optional
from pydantic import BaseModel


class LatLng(BaseModel):
    latitude: float
    longitude: float


class Region(BaseModel):
    id: str
    name: str
    coordinates: List[LatLng]
    unlock_xp: int
    rarity: str


class Quest(BaseModel):
    id: str
    title: str
    description: str
    reward_xp: int
    qr_code: Optional[str] = None
    region_id: str
    quest_type: str
    rarity: str
    location: Optional[LatLng] = None


class Business(BaseModel):
    id: str
    name: str
    category: str
    coordinates: LatLng
    rewards: str
    sponsor_level: str


class TransitVehicle(BaseModel):
    id: str
    route: str
    occupancy: int
    eta_minutes: int
    coordinate: LatLng


class Reward(BaseModel):
    id: str
    title: str
    reward_type: str
    xp_cost: int


class UserProfile(BaseModel):
    id: str
    username: str
    phone: Optional[str] = None
    level: int
    xp: int
    unlocked_regions: List[str]
    visited_locations: List[LatLng]
    streak: int
    achievements: List[str]
    badges: List[str] = []


class RotaChatRequest(BaseModel):
    prompt: str


class RotaChatResponse(BaseModel):
    message: str
    route_preview: str


class RotaRouteRequest(BaseModel):
    origin: LatLng
    destination: LatLng
    preference: str


class RotaRouteResponse(BaseModel):
    summary: str
    eta_minutes: int
    steps: List[str]


class RotaRecommendRequest(BaseModel):
    mood: str
    region_id: Optional[str] = None


class RotaRecommendResponse(BaseModel):
    recommendations: List[str]


class UnlockRegionRequest(BaseModel):
    region_id: str
    latitude: float
    longitude: float


class QuestCompletionRequest(BaseModel):
    quest_id: str
    latitude: float
    longitude: float


class PushNotificationRequest(BaseModel):
    title: str
    body: str
    user_id: Optional[str] = None


class PushTokenRequest(BaseModel):
    token: str
    platform: str
