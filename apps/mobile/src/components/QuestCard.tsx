import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { GlassCard } from "./GlassCard";
import { Quest } from "../data/mockQuests";
import { colors, spacing, typography } from "../theme";
import { XPBadge } from "./XPBadge";

type QuestCardProps = {
    quest: Quest;
    isCompleted?: boolean;
};

export const QuestCard = ({ quest, isCompleted }: QuestCardProps) => {
    const questTypeIcon: Record<Quest["questType"], keyof typeof MaterialIcons.glyphMap> = {
        visit: "place",
        qr: "qr-code",
        ride: "directions-bus",
        explore: "explore"
    };

    return (
        <GlassCard style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{quest.title}</Text>
                <Text style={styles.rarity}>{quest.rarity.toUpperCase()}</Text>
            </View>
            <Text style={styles.description}>{quest.description}</Text>
            <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                    <MaterialIcons name={questTypeIcon[quest.questType]} size={14} color={colors.primary} />
                    <Text style={styles.metaText}>{quest.questType}</Text>
                </View>
                <View style={styles.metaChip}>
                    <MaterialIcons name="shield" size={14} color={colors.primary} />
                    <Text style={styles.metaText}>{quest.regionId}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <XPBadge value={quest.rewardXp} />
                <Text style={[styles.status, isCompleted && styles.statusDone]}>
                    {isCompleted ? "Completed" : "Live"}
                </Text>
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: spacing.containerPadding,
        marginBottom: spacing.stackMd
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.stackSm
    },
    title: {
        ...typography.headlineMd,
        color: colors.onSurface
    },
    rarity: {
        ...typography.labelCaps,
        color: colors.primary
    },
    description: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.stackSm
    },
    metaRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.stackSm,
        marginBottom: spacing.stackSm
    },
    metaChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: "rgba(0, 242, 255, 0.15)"
    },
    metaText: {
        ...typography.bodySm,
        color: colors.primary
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    status: {
        ...typography.labelCaps,
        color: colors.primary
    },
    statusDone: {
        color: colors.secondary
    }
});
