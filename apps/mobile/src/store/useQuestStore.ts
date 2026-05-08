import { create } from "zustand";
import { mockQuests, Quest } from "../data/mockQuests";
import { useMapStore } from "./useMapStore";
import { completeQuest as completeQuestApi, fetchQuests } from "../services/quests";

type QuestState = {
    quests: Quest[];
    completedQuestIds: string[];
    setQuests: (quests: Quest[]) => void;
    loadQuests: () => Promise<void>;
    completeQuest: (questId: string) => void;
    syncCompleteQuest: (questId: string, location: { latitude: number; longitude: number }) => Promise<void>;
};

export const useQuestStore = create<QuestState>((set, get) => ({
    quests: mockQuests,
    completedQuestIds: [],
    setQuests: (quests) => set({ quests }),
    loadQuests: async () => {
        try {
            const quests = await fetchQuests();
            if (quests.length) set({ quests });
        } catch {
            return;
        }
    },
    completeQuest: (questId) => {
        if (get().completedQuestIds.includes(questId)) return;
        set({ completedQuestIds: [...get().completedQuestIds, questId] });
        const quest = get().quests.find((item) => item.id === questId);
        if (quest) {
            useMapStore.getState().addXp(quest.rewardXp);
        }
    },
    syncCompleteQuest: async (questId, location) => {
        get().completeQuest(questId);
        try {
            await completeQuestApi(questId, location.latitude, location.longitude);
        } catch {
            return;
        }
    }
}));
