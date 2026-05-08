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
        coordinate: { latitude: 30.8412, longitude: 28.968 }
    },
    {
        id: "bus-118",
        route: "118",
        occupancy: 61,
        etaMinutes: 8,
        coordinate: { latitude: 30.8358, longitude: 28.952 }
    },
    {
        id: "bus-77",
        route: "77",
        occupancy: 78,
        etaMinutes: 11,
        coordinate: { latitude: 30.8298, longitude: 28.9468 }
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
        nextStop: "Downtown Market",
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
