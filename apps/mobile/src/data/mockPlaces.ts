export type Place = {
    id: string;
    name: string;
    category: string;
    description: string;
    vibe: string;
    rating: number;
    etaMinutes: number;
    distanceKm: number;
    rewardXp: number;
    location: { latitude: number; longitude: number };
    tags: string[];
};

export const mockPlaces: Place[] = [
    {
        id: "skyline-terrace",
        name: "Skyline Terrace",
        category: "Viewpoint",
        description: "Panoramic skyline deck with soft neon mist after sunset.",
        vibe: "Chill / Photos",
        rating: 4.8,
        etaMinutes: 18,
        distanceKm: 2.1,
        rewardXp: 90,
        location: { latitude: 30.8475, longitude: 28.9625 },
        tags: ["Sunset", "Citylights", "Open air"]
    },
    {
        id: "old-town-galleria",
        name: "Downtown Galleria",
        category: "Culture",
        description: "Hidden alley galleries and street murals with AR lore.",
        vibe: "Creative / Walk",
        rating: 4.6,
        etaMinutes: 12,
        distanceKm: 1.3,
        rewardXp: 70,
        location: { latitude: 30.8322, longitude: 28.949 },
        tags: ["Mural", "AR", "Walk"]
    },
    {
        id: "marina-lights",
        name: "Marina Lights",
        category: "Waterfront",
        description: "Dockside glow, floating cafes, and late-night ambient music.",
        vibe: "Social / Night",
        rating: 4.7,
        etaMinutes: 22,
        distanceKm: 2.6,
        rewardXp: 110,
        location: { latitude: 30.8445, longitude: 28.9735 },
        tags: ["Night", "Music", "Food"]
    },
    {
        id: "market-lab",
        name: "Market Lab",
        category: "Food",
        description: "Street food micro-lab with rotating chef pop-ups.",
        vibe: "Taste / Quick",
        rating: 4.5,
        etaMinutes: 9,
        distanceKm: 0.9,
        rewardXp: 60,
        location: { latitude: 30.8308, longitude: 28.9518 },
        tags: ["Snacks", "Local", "Fast"]
    }
];
