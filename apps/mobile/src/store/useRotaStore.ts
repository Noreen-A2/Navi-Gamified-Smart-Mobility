import { create } from "zustand";
import { fetchRotaResponse, RotaMessage } from "../services/ai";

type RotaState = {
    messages: RotaMessage[];
    isSending: boolean;
    addMessage: (message: RotaMessage) => void;
    sendMessage: (prompt: string) => Promise<void>;
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
    isSending: false,
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    sendMessage: async (prompt) => {
        const trimmed = prompt.trim();
        if (!trimmed || get().isSending) return;

        const userMessage: RotaMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: trimmed
        };

        set((state) => ({
            messages: [...state.messages, userMessage],
            isSending: true
        }));

        try {
            const response = await fetchRotaResponse(trimmed);
            const preview = response.route_preview ? `\n\nRoute: ${response.route_preview}` : "";
            const assistantMessage: RotaMessage = {
                id: `rota-${Date.now()}`,
                role: "assistant",
                content: `${response.message}${preview}`
            };
            set((state) => ({ messages: [...state.messages, assistantMessage] }));
        } catch {
            const fallbackMessage: RotaMessage = {
                id: `rota-error-${Date.now()}`,
                role: "assistant",
                content: "Rota AI is offline. Try again in a moment."
            };
            set((state) => ({ messages: [...state.messages, fallbackMessage] }));
        } finally {
            set({ isSending: false });
        }
    },
    reset: () => set({ messages: [], isSending: false })
}));
