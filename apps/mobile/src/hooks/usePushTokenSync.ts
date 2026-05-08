import { useEffect } from "react";
import { Platform } from "react-native";
import { registerForPushNotifications, registerPushToken } from "../services/notifications";
import { useAuthStore } from "../store/useAuthStore";

export const usePushTokenSync = () => {
    const session = useAuthStore((state) => state.session);

    useEffect(() => {
        if (!session) return;

        registerForPushNotifications()
            .then((token) => {
                if (token) {
                    return registerPushToken(token, Platform.OS);
                }
                return undefined;
            })
            .catch(() => undefined);
    }, [session?.user?.id]);
};
