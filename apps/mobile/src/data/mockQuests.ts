export type Quest = {
    id: string;
    title: string;
    description: string;
    rewardXp: number;
    questType: "visit" | "qr" | "ride" | "explore";
    regionId: string;
    rarity: "common" | "rare" | "epic";
    location?: { latitude: number; longitude: number };
};

export const mockQuests: Quest[] = [
    {
        id: "quest-marina",
        title: "Visit Marina District",
        description: "Walk the waterfront and unlock the marina gates.",
        rewardXp: 120,
        questType: "visit",
        regionId: "marina",
        rarity: "rare",
        // moved to New Alamein city
        location: { latitude: 30.8312, longitude: 28.9556 }
    },
    {
        id: "quest-bus-4",
        title: "Ride Bus Route 4",
        description: "Hop on Bus 402 and ride 3 stops.",
        rewardXp: 80,
        questType: "ride",
        regionId: "old-town",
        rarity: "common",
        location: { latitude: 30.8324, longitude: 28.9572 }
    },
    {
        id: "quest-qr",
        title: "Scan Hidden QR",
        description: "Find the hidden QR at Sunset Spot.",
        rewardXp: 140,
        questType: "qr",
        regionId: "old-town",
        rarity: "epic",
        location: { latitude: 30.8304, longitude: 28.9542 }
    }
];
