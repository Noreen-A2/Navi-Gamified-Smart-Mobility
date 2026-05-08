from app.models.schemas import (
    Business,
    LatLng,
    Quest,
    Region,
    Reward,
    TransitVehicle,
    UserProfile
)

REGIONS = [
    Region(
        id="marina",
        name="Marina District",
        coordinates=[
            LatLng(latitude=31.0035, longitude=28.9750),
            LatLng(latitude=31.0090, longitude=28.9850),
            LatLng(latitude=31.0015, longitude=29.0010),
            LatLng(latitude=30.9955, longitude=28.9920)
        ],
        unlock_xp=120,
        rarity="rare"
    ),
    Region(
        id="old-town",
        name="Old Town",
        coordinates=[
            LatLng(latitude=30.9980, longitude=28.9550),
            LatLng(latitude=31.0050, longitude=28.9620),
            LatLng(latitude=30.9980, longitude=28.9740),
            LatLng(latitude=30.9910, longitude=28.9670)
        ],
        unlock_xp=80,
        rarity="common"
    )
]

QUESTS = [
    Quest(
        id="quest-marina",
        title="Visit Marina District",
        description="Walk the waterfront and unlock the marina gates.",
        reward_xp=120,
        qr_code=None,
        region_id="marina",
        quest_type="visit",
        rarity="rare",
        location=LatLng(latitude=31.0048, longitude=28.9860)
    ),
    Quest(
        id="quest-bus-4",
        title="Ride Bus Route 4",
        description="Hop on Bus 402 and ride 3 stops.",
        reward_xp=80,
        qr_code=None,
        region_id="old-town",
        quest_type="ride",
        rarity="common",
        location=LatLng(latitude=31.0008, longitude=28.9680)
    ),
    Quest(
        id="quest-qr",
        title="Scan Hidden QR",
        description="Find the hidden QR at Sunset Spot.",
        reward_xp=140,
        qr_code="NAVI-QUEST-QR-01",
        region_id="old-town",
        quest_type="qr",
        rarity="epic",
        location=LatLng(latitude=30.9968, longitude=28.9630)
    )
]

BUSINESSES = [
    Business(
        id="nitro",
        name="Nitro Coffee Hub",
        category="Cafe",
        coordinates=LatLng(latitude=31.0062, longitude=28.9820),
        rewards="15% discount + hidden marker clue",
        sponsor_level="partner"
    ),
    Business(
        id="neural",
        name="Neural Hub",
        category="Work Lounge",
        coordinates=LatLng(latitude=31.0012, longitude=28.9920),
        rewards="Bonus XP + VIP access",
        sponsor_level="featured"
    )
]

REWARDS = [
    Reward(id="reward-1", title="Marina Pass", reward_type="real", xp_cost=800),
    Reward(id="reward-2", title="Aero Glider", reward_type="digital", xp_cost=1200)
]

USER_PROFILE = UserProfile(
    id="demo-user",
    username="Ammar",
    phone=None,
    level=32,
    xp=8600,
    unlocked_regions=["marina"],
    visited_locations=[],
    streak=12,
    achievements=["Night Owl", "Pioneer"]
)

TRANSIT_VEHICLES = [
    TransitVehicle(
        id="bus-402",
        route="Bus 402",
        occupancy=40,
        eta_minutes=4,
        coordinate=LatLng(latitude=31.0020, longitude=28.9810)
    )
]
