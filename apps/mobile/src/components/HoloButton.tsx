import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients, radii, typography } from "../theme";

type HoloButtonProps = {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    icon?: ReactNode;
};

export const HoloButton = ({ title, onPress, style, icon }: HoloButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={style}>
            <LinearGradient colors={gradients.holo as any} style={styles.button}>
                {icon}
                <Text style={styles.text}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: radii.full,
        paddingVertical: 14,
        paddingHorizontal: 28,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
        shadowColor: colors.primaryContainer,
        shadowOpacity: 0.4,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 }
    },
    text: {
        color: colors.onPrimary,
        ...typography.bodyLg,
        fontFamily: "SpaceGrotesk_600SemiBold"
    }
});
