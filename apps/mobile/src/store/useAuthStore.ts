import { create } from "zustand";
import { supabase } from "../services/supabase";
import { Session, User } from "@supabase/supabase-js";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

type AuthState = {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    initialize: () => Promise<void>;
    signInWithPhone: (phone: string) => Promise<void>;
    verifyOtp: (phone: string, token: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    skipAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    isLoading: true,
    skipAuth: () => {
        set({
            session: { user: { id: "guest" } } as any,
            user: { id: "guest" } as any,
            isLoading: false
        });
    },
    initialize: async () => {
        try {
            const { data } = await supabase.auth.getSession();
            set({ session: data.session, user: data.session?.user ?? null, isLoading: false });
            supabase.auth.onAuthStateChange((_event, session) => {
                set({ session, user: session?.user ?? null, isLoading: false });
            });
        } catch (error) {
            console.error("Auth initialize error:", error);
            set({ isLoading: false });
        }
    },
    signInWithPhone: async (phone: string) => {
        const { error } = await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
    },
    verifyOtp: async (phone: string, token: string) => {
        const { error } = await supabase.auth.verifyOtp({
            phone,
            token,
            type: "sms"
        });
        if (error) throw error;
    },
    signInWithGoogle: async () => {
        const redirectUri = AuthSession.makeRedirectUri({ scheme: "navi" });
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: redirectUri
            }
        });
        if (error) throw error;
        if (data?.url) {
            await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
        }
    },
    signOut: async () => {
        await supabase.auth.signOut();
    }
}));
