import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockRegions, Region } from "../data/mockRegions";
import { fetchRegions, unlockRegion as unlockRegionApi } from "../services/regions";
import { fetchProgress } from "../services/progress";

type MapState = {
    regions: Region[];
    unlockedRegionIds: string[];
    visitedLocations: { latitude: number; longitude: number }[];
    xp: number;
    streak: number;
    achievements: string[];
    badges: string[];
    setRegions: (regions: Region[]) => void;
    setProgress: (progress: {
        xp: number;
        streak: number;
        unlockedRegions: string[];
        achievements: string[];
        badges: string[];
    }) => void;
    loadRegions: () => Promise<void>;
    syncProgress: () => Promise<void>;
    syncUnlockRegion: (regionId: string, location: { latitude: number; longitude: number }) => Promise<void>;
    unlockRegion: (regionId: string) => void;
    addVisitedLocation: (location: { latitude: number; longitude: number }) => void;
    addXp: (amount: number) => void;
    addAchievement: (achievement: string) => void;
    addBadge: (badge: string) => void;
    setStreak: (value: number) => void;
};

export const useMapStore = create<MapState>()(
    persist(
        (set, get) => ({
            regions: mockRegions,
            unlockedRegionIds: [],
            visitedLocations: [],
            xp: 0,
            streak: 12,
            achievements: ["Night Owl", "Pioneer"],
            badges: ["Eco Rider", "Skyline Scout"],
            setRegions: (regions) => set({ regions }),
            setProgress: (progress) =>
                set({
                    xp: progress.xp,
                    streak: progress.streak,
                    unlockedRegionIds: progress.unlockedRegions,
                    achievements: progress.achievements,
                    badges: progress.badges
                }),
            loadRegions: async () => {
                try {
                    const regions = await fetchRegions();
                    if (regions.length) set({ regions });
                } catch {
                    return;
                }
            },
            syncProgress: async () => {
                try {
                    const progress = await fetchProgress();
                    set({
                        xp: progress.xp,
                        streak: progress.streak,
                        unlockedRegionIds: progress.unlocked_regions,
                        achievements: progress.achievements,
                        badges: progress.badges ?? []
                    });
                } catch {
                    return;
                }
            },
            syncUnlockRegion: async (regionId, location) => {
                try {
                    await unlockRegionApi(regionId, location.latitude, location.longitude);
                } catch {
                    return;
                }
            },
            unlockRegion: (regionId) => {
                if (get().unlockedRegionIds.includes(regionId)) return;
                const region = get().regions.find((item) => item.id === regionId);
                set({ unlockedRegionIds: [...get().unlockedRegionIds, regionId] });
                if (region) get().addXp(region.unlockXp);
            },
            addVisitedLocation: (location) => {
                set({ visitedLocations: [...get().visitedLocations, location] });
            },
            addXp: (amount) => {
                set({ xp: get().xp + amount });
            },
            addAchievement: (achievement) => {
                if (get().achievements.includes(achievement)) return;
                set({ achievements: [...get().achievements, achievement] });
            },
            addBadge: (badge) => {
                if (get().badges.includes(badge)) return;
                set({ badges: [...get().badges, badge] });
            },
            setStreak: (value) => {
                set({ streak: value });
            }
        }),
        {
            name: "navi-map-store",
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);
