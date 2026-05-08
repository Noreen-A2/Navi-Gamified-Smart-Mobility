import { ReactNode } from "react";
import { StyleSheet, ViewStyle, StyleProp } from "react-native";
import { BlurView } from "expo-blur";
import { colors, radii } from "../theme";

type GlassCardProps = {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
};

export const GlassCard = ({ children, style, intensity = 30 }: GlassCardProps) => {
    return (
        <BlurView intensity={intensity} tint="light" style={[styles.card, style]}>
            {children}
        </BlurView>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: radii.xl,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.35)",
        overflow: "hidden"
    }
});
