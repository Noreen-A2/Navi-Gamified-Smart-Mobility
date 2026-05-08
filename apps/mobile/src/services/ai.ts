import { apiFetch } from "./api";

export type RotaMessage = {
    id: string;
    role: "assistant" | "user";
    content: string;
};

export const fetchRotaResponse = async (prompt: string) => {
    return apiFetch<{ message: string; route_preview: string }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ prompt })
    });
};

export const fetchRotaRoute = async (origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }, preference: string) => {
    return apiFetch<{ summary: string; eta_minutes: number; steps: string[] }>("/ai/route", {
        method: "POST",
        body: JSON.stringify({ origin, destination, preference })
    });
};

export const fetchRotaRecommendations = async (mood: string, regionId?: string) => {
    return apiFetch<{ recommendations: string[] }>("/ai/recommend", {
        method: "POST",
        body: JSON.stringify({ mood, region_id: regionId })
    });
};
