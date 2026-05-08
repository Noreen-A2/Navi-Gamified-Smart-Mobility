import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients, radii, typography, colors } from "../theme";

type XPBadgeProps = {
    value: number;
};

export const XPBadge = ({ value }: XPBadgeProps) => {
    return (
        <LinearGradient colors={gradients.xp as any} style={styles.container}>
            <Text style={styles.text}>+{value} XP</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: radii.full,
        alignSelf: "flex-start"
    },
    text: {
        color: colors.onSecondaryContainer,
        ...typography.dataPoint
    }
});
