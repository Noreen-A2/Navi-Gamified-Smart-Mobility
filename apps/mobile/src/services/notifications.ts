import * as Notifications from "expo-notifications";
import { apiFetch } from "./api";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true
    })
});

export const registerForPushNotifications = async () => {
    const settings = await Notifications.getPermissionsAsync();
    if (!(settings as any).granted) {
        await Notifications.requestPermissionsAsync();
    }

    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
};

export const scheduleQuestReminder = async (title: string, body: string) => {
    return Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: { seconds: 30, type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL }
    });
};

export const registerPushToken = async (token: string, platform: string) => {
    return apiFetch<{ stored: boolean }>("/notifications/register", {
        method: "POST",
        body: JSON.stringify({ token, platform })
    });
};
