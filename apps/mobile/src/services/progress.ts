import { apiFetch } from "./api";

export type ProgressResponse = {
    level: number;
    xp: number;
    streak: number;
    unlocked_regions: string[];
    achievements: string[];
    badges?: string[];
};

export const fetchProgress = async () => {
    return apiFetch<ProgressResponse>("/progress");
};
