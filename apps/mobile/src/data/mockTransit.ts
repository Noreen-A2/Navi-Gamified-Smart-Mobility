import { TransitVehicle } from "../services/transit";

export type TransitRoute = {
    id: string;
    route: string;
    name: string;
    status: "On Time" | "Delayed" | "Reroute";
    nextStop: string;
    headwayMinutes: number;
    occupancy: number;
};

export const mockTransitVehicles: TransitVehicle[] = [
    {
        id: "bus-402",
        route: "402",
        occupancy: 32,
        etaMinutes: 4,
        coordinate: { latitude: 31.0018, longitude: 28.972 }
    },
    {
        id: "bus-118",
        route: "118",
        occupancy: 61,
        etaMinutes: 8,
        coordinate: { latitude: 31.0052, longitude: 28.984 }
    },
    {
        id: "bus-77",
        route: "77",
        occupancy: 78,
        etaMinutes: 11,
        coordinate: { latitude: 30.9984, longitude: 28.965 }
    }
];

export const mockTransitRoutes: TransitRoute[] = [
    {
        id: "route-402",
        route: "402",
        name: "Marina Loop",
        status: "On Time",
        nextStop: "Marina Gate",
        headwayMinutes: 6,
        occupancy: 38
    },
    {
        id: "route-118",
        route: "118",
        name: "Civic Spine",
        status: "Delayed",
        nextStop: "Old Town Market",
        headwayMinutes: 10,
        occupancy: 72
    },
    {
        id: "route-77",
        route: "77",
        name: "Harbor Drift",
        status: "On Time",
        nextStop: "Harbor Point",
        headwayMinutes: 7,
        occupancy: 51
    },
    {
        id: "route-12",
        route: "12",
        name: "University Arc",
        status: "Reroute",
        nextStop: "Tech Quarter",
        headwayMinutes: 12,
        occupancy: 44
    }
];
