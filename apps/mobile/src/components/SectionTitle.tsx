import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../theme";

type SectionTitleProps = {
    title: string;
    subtitle?: string;
    trailing?: string;
};

export const SectionTitle = ({ title, subtitle, trailing }: SectionTitleProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.textBlock}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {trailing ? <Text style={styles.trailing}>{trailing}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: spacing.stackSm
    },
    textBlock: {
        gap: 4
    },
    title: {
        ...typography.headlineMd,
        color: colors.onSurface
    },
    subtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    trailing: {
        ...typography.labelCaps,
        color: colors.primary
    }
});
