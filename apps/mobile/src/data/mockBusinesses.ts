export type Business = {
    id: string;
    name: string;
    category: string;
    sponsorLevel: "partner" | "premium" | "featured";
    location: { latitude: number; longitude: number };
    reward: string;
    tagline?: string;
    offer?: string;
};

export const mockBusinesses: Business[] = [
    {
        id: "nitro",
        name: "Nitro Coffee Hub",
        category: "Cafe",
        sponsorLevel: "partner",
        location: { latitude: 30.8295, longitude: 28.9455 },
        reward: "15% discount + hidden marker clue",
        tagline: "Hyper-brewed energy for night explorers.",
        offer: "Free neon topper with any cold brew"
    },
    {
        id: "neural",
        name: "Neural Hub",
        category: "Work Lounge",
        sponsorLevel: "featured",
        location: { latitude: 30.8332, longitude: 28.9512 },
        reward: "Bonus XP + VIP access",
        tagline: "Focus pods with skyline views.",
        offer: "2-hour day pass unlock"
    },
    {
        id: "aurora",
        name: "Aurora Eats",
        category: "Street Food",
        sponsorLevel: "premium",
        location: { latitude: 30.8425, longitude: 28.9685 },
        reward: "Double stamps + night menu",
        tagline: "Late-night fusion bites with synthwave glow.",
        offer: "Buy 1 get 1 on signature ramen"
    },
    {
        id: "vista",
        name: "Vista Capsules",
        category: "Pop-up Hotel",
        sponsorLevel: "partner",
        location: { latitude: 30.848, longitude: 28.9605 },
        reward: "Explorer check-in XP",
        tagline: "Sleep pods with AR skyline alarms.",
        offer: "Early check-in after 9 PM"
    }
];
