export type LatLng = { latitude: number; longitude: number };

export const pointInPolygon = (point: LatLng, polygon: LatLng[]) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].latitude;
        const yi = polygon[i].longitude;
        const xj = polygon[j].latitude;
        const yj = polygon[j].longitude;

        const intersect =
            yi > point.longitude !== yj > point.longitude &&
            point.latitude <
            ((xj - xi) * (point.longitude - yi)) / (yj - yi + Number.EPSILON) + xi;

        if (intersect) inside = !inside;
    }
    return inside;
};

export const toMeters = (meters: number) => Math.round(meters);
