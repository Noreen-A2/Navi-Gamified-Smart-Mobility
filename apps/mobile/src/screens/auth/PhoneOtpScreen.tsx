import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { HoloButton } from "../../components/HoloButton";
import { colors, spacing, typography } from "../../theme";
import { useAuthStore } from "../../store/useAuthStore";
import { useRoute } from "@react-navigation/native";

export const PhoneOtpScreen = () => {
    const route = useRoute<any>();
    const [phone, setPhone] = useState(route.params?.phone ?? "");
    const [token, setToken] = useState("");
    const signInWithPhone = useAuthStore((state) => state.signInWithPhone);
    const verifyOtp = useAuthStore((state) => state.verifyOtp);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Phone Login</Text>
            <Text style={styles.subtitle}>We will send a one-time code.</Text>
            <TextInput
                style={styles.input}
                placeholder="+20 1X XXX XXXX"
                placeholderTextColor={colors.onSurfaceVariant}
                value={phone}
                onChangeText={setPhone}
            />
            <HoloButton title="Send Code" onPress={() => signInWithPhone(phone)} />
            <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor={colors.onSurfaceVariant}
                value={token}
                onChangeText={setToken}
            />
            <HoloButton title="Verify" onPress={() => verifyOtp(phone, token)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.containerPadding,
        gap: spacing.stackMd
    },
    title: {
        ...typography.headlineLg,
        color: colors.onSurface
    },
    subtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    input: {
        borderWidth: 1,
        borderColor: colors.outlineVariant,
        borderRadius: 16,
        padding: 14,
        backgroundColor: "rgba(255,255,255,0.8)",
        ...typography.bodyMd,
        color: colors.onSurface
    }
});
