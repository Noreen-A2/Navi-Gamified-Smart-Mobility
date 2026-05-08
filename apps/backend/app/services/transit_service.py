import time
from typing import List

from app.models.schemas import LatLng, TransitVehicle

ROUTE_PATH = [
    LatLng(latitude=31.0030, longitude=28.9750),
    LatLng(latitude=31.0060, longitude=28.9820),
    LatLng(latitude=31.0080, longitude=28.9900),
    LatLng(latitude=31.0030, longitude=28.9980)
]


def interpolate_point(points: List[LatLng], progress: float) -> LatLng:
    if not points:
        return LatLng(latitude=0.0, longitude=0.0)
    segment_count = len(points) - 1
    segment_progress = progress * segment_count
    index = int(segment_progress)
    local_progress = segment_progress - index
    if index >= segment_count:
        return points[-1]
    start = points[index]
    end = points[index + 1]
    return LatLng(
        latitude=start.latitude + (end.latitude - start.latitude) * local_progress,
        longitude=start.longitude + (end.longitude - start.longitude) * local_progress
    )


def get_transit_vehicles() -> List[TransitVehicle]:
    now = time.time()
    progress = (now % 60) / 60
    position = interpolate_point(ROUTE_PATH, progress)
    occupancy = int(30 + (now % 10))
    eta = int(5 - (now % 5))

    return [
        TransitVehicle(
            id="bus-402",
            route="Bus 402",
            occupancy=occupancy,
            eta_minutes=max(1, eta),
            coordinate=position
        )
    ]
