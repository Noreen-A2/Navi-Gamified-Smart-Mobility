export type Region = {
    id: string;
    name: string;
    rarity: "common" | "rare" | "epic";
    unlockXp: number;
    polygon: { latitude: number; longitude: number }[];
};

export const mockRegions: Region[] = [
    {
        id: "marina",
        name: "Marina District",
        rarity: "rare",
        unlockXp: 120,
        polygon: [
            { latitude: 31.0035, longitude: 28.975 },
            { latitude: 31.009, longitude: 28.985 },
            { latitude: 31.0015, longitude: 29.001 },
            { latitude: 30.9955, longitude: 28.992 }
        ]
    },
    {
        id: "old-town",
        name: "Old Town",
        rarity: "common",
        unlockXp: 80,
        polygon: [
            { latitude: 30.998, longitude: 28.955 },
            { latitude: 31.005, longitude: 28.962 },
            { latitude: 30.998, longitude: 28.974 },
            { latitude: 30.991, longitude: 28.967 }
        ]
    }
];
