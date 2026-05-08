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
        id: "quest-marina-boardwalk",
        title: "Marina Boardwalk Circuit",
        description: "Walk Marina 3 to Marina 5 and log a waterfront photo.",
        rewardXp: 120,
        questType: "visit",
        regionId: "marina",
        rarity: "rare",
        location: { latitude: 30.844, longitude: 28.972 }
    },
    {
        id: "quest-aiu-cafe",
        title: "AIU Study Break",
        description: "Grab a drink near AIU and check in at the student zone.",
        rewardXp: 90,
        questType: "explore",
        regionId: "old-town",
        rarity: "common",
        location: { latitude: 30.8288, longitude: 28.9441 }
    },
    {
        id: "quest-coastal-shuttle",
        title: "Coastal Shuttle Scout",
        description: "Ride the coastal shuttle for two stops and note the ETA.",
        rewardXp: 80,
        questType: "ride",
        regionId: "marina",
        rarity: "common",
        location: { latitude: 30.8415, longitude: 28.969 }
    },
    {
        id: "quest-qr-lighthouse",
        title: "Lighthouse QR Hunt",
        description: "Scan the QR at the Marina lighthouse lookout.",
        rewardXp: 150,
        questType: "qr",
        regionId: "marina",
        rarity: "epic",
        location: { latitude: 30.8465, longitude: 28.9755 }
    },
    {
        id: "quest-downtown-essentials",
        title: "Downtown Essentials Run",
        description: "Visit a pharmacy or supermarket in Downtown Core.",
        rewardXp: 70,
        questType: "explore",
        regionId: "old-town",
        rarity: "common",
        location: { latitude: 30.8315, longitude: 28.9505 }
    }
];
