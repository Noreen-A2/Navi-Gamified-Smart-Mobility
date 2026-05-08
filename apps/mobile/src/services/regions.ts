import { apiFetch } from "./api";
import { Region } from "../data/mockRegions";

type RegionResponse = {
    id: string;
    name: string;
    rarity: "common" | "rare" | "epic";
    unlock_xp: number;
    coordinates: { latitude: number; longitude: number }[];
};

export const fetchRegions = async (): Promise<Region[]> => {
    const data = await apiFetch<RegionResponse[]>("/regions");
    return data.map((region) => ({
        id: region.id,
        name: region.name,
        rarity: region.rarity,
        unlockXp: region.unlock_xp,
        polygon: region.coordinates
    }));
};

export const unlockRegion = async (regionId: string, latitude: number, longitude: number) => {
    return apiFetch<{ status: string }>("/regions/unlock", {
        method: "POST",
        body: JSON.stringify({ region_id: regionId, latitude, longitude })
    });
};
