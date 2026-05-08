import { create } from "zustand";
import { RotaMessage, fetchRotaResponse } from "../services/ai";

function newId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
type RotaState = {
    messages: RotaMessage[];
    isLoading: boolean;
    addMessage: (message: RotaMessage) => void;
    sendMessage: (text: string) => Promise<void>;
    reset: () => void;
};

const WELCOME: RotaMessage = {
    id: "rota-welcome",
    role: "assistant",
    content: "Hello explorer. I can map quests, optimize routes, and reveal rewards."
};

export const useRotaStore = create<RotaState>((set, get) => ({
    messages: [WELCOME],
    isLoading: false,

    addMessage: (message) => set({ messages: [...get().messages, message] }),

    sendMessage: async (text: string) => {
        const userMsg: RotaMessage = { id: newId(), role: "user", content: text };
        set({ messages: [...get().messages, userMsg], isLoading: true });
        try {
            const data = await fetchRotaResponse(text);
            const aiMsg: RotaMessage = { id: newId(), role: "assistant", content: data.message };
            set({ messages: [...get().messages, aiMsg] });
        } catch {
            const errMsg: RotaMessage = {
                id: newId(),
                role: "assistant",
                content: "⚠️ Could not reach Rota AI. Check your connection and try again."
            };
            set({ messages: [...get().messages, errMsg] });
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => set({ messages: [WELCOME], isLoading: false })
}));
