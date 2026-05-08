import { apiFetch } from "./api";

export type TransitVehicle = {
    id: string;
    route: string;
    occupancy: number;
    etaMinutes: number;
    coordinate: { latitude: number; longitude: number };
};

export const fetchTransitVehicles = async () => {
    return apiFetch<TransitVehicle[]>("/transit/vehicles");
};
