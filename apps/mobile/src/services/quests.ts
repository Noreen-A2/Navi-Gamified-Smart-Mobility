import { apiFetch } from "./api";
import { Quest } from "../data/mockQuests";

type QuestResponse = {
    id: string;
    title: string;
    description: string;
    reward_xp: number;
    qr_code?: string | null;
    region_id?: string | null;
    quest_type: "visit" | "qr" | "ride" | "explore";
    rarity: "common" | "rare" | "epic";
    location?: { latitude: number; longitude: number } | null;
};

export const fetchQuests = async (): Promise<Quest[]> => {
    const data = await apiFetch<QuestResponse[]>("/quests");
    return data.map((quest) => ({
        id: quest.id,
        title: quest.title,
        description: quest.description,
        rewardXp: quest.reward_xp,
        questType: quest.quest_type,
        regionId: quest.region_id ?? "",
        rarity: quest.rarity,
        location: quest.location ?? undefined
    }));
};

export const completeQuest = async (questId: string, latitude: number, longitude: number) => {
    return apiFetch<{ status: string }>("/quests/complete", {
        method: "POST",
        body: JSON.stringify({ quest_id: questId, latitude, longitude })
    });
};
