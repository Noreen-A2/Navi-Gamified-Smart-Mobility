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
            { latitude: 30.839, longitude: 28.965 },
            { latitude: 30.8485, longitude: 28.9715 },
            { latitude: 30.846, longitude: 28.9815 },
            { latitude: 30.837, longitude: 28.975 }
        ]
    },
    {
        id: "old-town",
        name: "Downtown Core",
        rarity: "common",
        unlockXp: 80,
        polygon: [
            { latitude: 30.8285, longitude: 28.945 },
            { latitude: 30.835, longitude: 28.9495 },
            { latitude: 30.8335, longitude: 28.956 },
            { latitude: 30.827, longitude: 28.951 }
        ]
    }
];
