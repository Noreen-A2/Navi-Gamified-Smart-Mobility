import { StyleSheet, Text, View } from "react-native";
import { HoloButton } from "../../components/HoloButton";
import { colors, spacing, typography } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../services/supabase";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

export const LoginScreen = () => {
    const navigation = useNavigation();
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
    });

    useEffect(() => {
        if (response?.type === "success") {
            const idToken = response.params.id_token;
            if (idToken) {
                supabase.auth.signInWithIdToken({ provider: "google", token: idToken });
            }
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join NAVI</Text>
            <Text style={styles.subtitle}>Unlock quests, rewards, and live mobility.</Text>
            <View style={styles.ctaBlock}>
                <HoloButton
                    title="Continue with Phone"
                    onPress={() => navigation.navigate("PhoneOtp" as never)}
                />
                <HoloButton
                    title="Continue with Google"
                    onPress={() => (request ? promptAsync() : undefined)}
                    style={!request ? styles.disabled : undefined}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.containerPadding,
        justifyContent: "center",
        gap: spacing.stackMd
    },
    title: {
        ...typography.headlineLg,
        color: colors.onSurface
    },
    subtitle: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant
    },
    ctaBlock: {
        gap: spacing.stackMd
    },
    disabled: {
        opacity: 0.6
    }
});
