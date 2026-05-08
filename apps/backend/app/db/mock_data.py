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
            LatLng(latitude=30.8390, longitude=28.9650),
            LatLng(latitude=30.8485, longitude=28.9715),
            LatLng(latitude=30.8460, longitude=28.9815),
            LatLng(latitude=30.8370, longitude=28.9750)
        ],
        unlock_xp=120,
        rarity="rare"
    ),
    Region(
        id="old-town",
        name="Downtown Core",
        coordinates=[
            LatLng(latitude=30.8285, longitude=28.9450),
            LatLng(latitude=30.8350, longitude=28.9495),
            LatLng(latitude=30.8335, longitude=28.9560),
            LatLng(latitude=30.8270, longitude=28.9510)
        ],
        unlock_xp=80,
        rarity="common"
    )
]

QUESTS = [
    Quest(
        id="quest-marina-boardwalk",
        title="Marina Boardwalk Circuit",
        description="Walk Marina 3 to Marina 5 and log a waterfront photo.",
        reward_xp=120,
        qr_code=None,
        region_id="marina",
        quest_type="visit",
        rarity="rare",
        location=LatLng(latitude=30.8440, longitude=28.9720)
    ),
    Quest(
        id="quest-aiu-cafe",
        title="AIU Study Break",
        description="Grab a drink near AIU and check in at the student zone.",
        reward_xp=90,
        qr_code=None,
        region_id="old-town",
        quest_type="explore",
        rarity="common",
        location=LatLng(latitude=30.8288, longitude=28.9441)
    ),
    Quest(
        id="quest-coastal-shuttle",
        title="Coastal Shuttle Scout",
        description="Ride the coastal shuttle for two stops and note the ETA.",
        reward_xp=80,
        qr_code=None,
        region_id="marina",
        quest_type="ride",
        rarity="common",
        location=LatLng(latitude=30.8415, longitude=28.9690)
    ),
    Quest(
        id="quest-qr-lighthouse",
        title="Lighthouse QR Hunt",
        description="Scan the QR at the Marina lighthouse lookout.",
        reward_xp=150,
        qr_code="NAVI-ALM-QR-02",
        region_id="marina",
        quest_type="qr",
        rarity="epic",
        location=LatLng(latitude=30.8465, longitude=28.9755)
    ),
    Quest(
        id="quest-downtown-essentials",
        title="Downtown Essentials Run",
        description="Visit a pharmacy or supermarket in Downtown Core.",
        reward_xp=70,
        qr_code=None,
        region_id="old-town",
        quest_type="explore",
        rarity="common",
        location=LatLng(latitude=30.8315, longitude=28.9505)
    )
]

BUSINESSES = [
    Business(
        id="nitro",
        name="Nitro Coffee Hub",
        category="Cafe",
        coordinates=LatLng(latitude=30.8295, longitude=28.9455),
        rewards="15% discount + hidden marker clue",
        sponsor_level="partner"
    ),
    Business(
        id="neural",
        name="Neural Hub",
        category="Work Lounge",
        coordinates=LatLng(latitude=30.8332, longitude=28.9512),
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
        coordinate=LatLng(latitude=30.8412, longitude=28.9680)
    )
]
