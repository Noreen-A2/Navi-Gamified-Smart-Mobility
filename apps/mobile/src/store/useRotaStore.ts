import { create } from "zustand";
import { RotaMessage } from "../services/ai";

type RotaState = {
    messages: RotaMessage[];
    addMessage: (message: RotaMessage) => void;
    reset: () => void;
};

export const useRotaStore = create<RotaState>((set, get) => ({
    messages: [
        {
            id: "rota-welcome",
            role: "assistant",
            content: "Hello explorer. I can map quests, optimize routes, and reveal rewards."
        }
    ],
    addMessage: (message) => set({ messages: [...get().messages, message] }),
    reset: () => set({ messages: [] })
}));
