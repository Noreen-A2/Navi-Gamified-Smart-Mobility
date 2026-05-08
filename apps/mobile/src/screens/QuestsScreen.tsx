import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuestStore } from "../store/useQuestStore";
import { QuestCard } from "../components/QuestCard";
import { SectionTitle } from "../components/SectionTitle";
import { colors, gradients, spacing, typography } from "../theme";
import { HoloButton } from "../components/HoloButton";
import { useNavigation } from "@react-navigation/native";
import { useMapStore } from "../store/useMapStore";
import { levelFromXp, xpToNextLevel } from "../utils/xp";
import { GlassCard } from "../components/GlassCard";
import { AnimatedBar } from "../components/AnimatedBar";

export const QuestsScreen = () => {
    const insets = useSafeAreaInsets();
    const { quests, completedQuestIds, loadQuests } = useQuestStore();
    const navigation = useNavigation();
    const [qrUri, setQrUri] = useState<string | null>(null);
    const xp = useMapStore((state) => state.xp);
    const streak = useMapStore((state) => state.streak);
    const level = levelFromXp(xp);
    const toNext = xpToNextLevel(xp);
    const progress = Math.min(100, Math.round(((500 - toNext) / 500) * 100));
    const questMix = useMemo(() => {
        const mix = { visit: 0, ride: 0, qr: 0, explore: 0 };
        quests.forEach((quest) => {
            mix[quest.questType] += 1;
        });
        const total = quests.length || 1;
        return {
            mix,
            total
        };
    }, [quests]);

    useEffect(() => {
        QRCode.toDataURL("NAVI-QUEST-QR-01")
            .then(setQrUri)
            .catch(() => undefined);
    }, []);

    useEffect(() => {
        loadQuests().catch(() => undefined);
    }, [loadQuests]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 148 }]}>
            <LinearGradient colors={gradients.pearl as any} style={styles.background} />
            <SectionTitle
                title="Community Quests"
                subtitle="Discover hidden gems and earn rewards."
                trailing="Live"
            />
            <GlassCard style={styles.progressCard}>
                <View style={styles.progressHeader}>
                    <View>
                        <Text style={styles.progressTitle}>Explorer level {level}</Text>
                        <Text style={styles.progressSubtitle}>{toNext} XP to next level</Text>
                    </View>
                    <View style={styles.streakPill}>
                        <MaterialIcons name="local-fire-department" size={16} color={colors.primary} />
                        <Text style={styles.streakText}>{streak} day streak</Text>
                    </View>
                </View>
                <AnimatedBar value={progress} style={styles.progressTrack} />
            </GlassCard>
            <GlassCard style={styles.dailyCard}>
                <View style={styles.dailyHeader}>
                    <Text style={styles.dailyTitle}>Daily challenge</Text>
                    <Text style={styles.dailyBadge}>+120 XP</Text>
                </View>
                <Text style={styles.dailySubtitle}>Ride two stops on any bus route.</Text>
                <HoloButton title="Start challenge" onPress={() => undefined} />
            </GlassCard>
            <GlassCard style={styles.chartCard}>
                <Text style={styles.chartTitle}>Quest mix</Text>
                {Object.entries(questMix.mix).map(([type, count]) => (
                    <View key={type} style={styles.chartRow}>
                        <Text style={styles.chartLabel}>{type}</Text>
                        <AnimatedBar value={count} max={questMix.total} style={styles.chartTrack} />
                        <Text style={styles.chartValue}>{count}</Text>
                    </View>
                ))}
            </GlassCard>
            {quests.map((quest) => (
                <QuestCard
                    key={quest.id}
                    quest={quest}
                    isCompleted={completedQuestIds.includes(quest.id)}
                />
            ))}
            <View style={styles.scanBlock}>
                <Text style={styles.scanTitle}>Scan Hidden QR</Text>
                <Text style={styles.scanSubtitle}>Unlock rare quests and bonus XP.</Text>
                <HoloButton
                    title="Open Scanner"
                    onPress={() => navigation.navigate("ScanQuest" as never)}
                />
                {qrUri ? (
                    <View style={styles.qrCard}>
                        <Text style={styles.qrTitle}>Hidden Quest QR</Text>
                        <Image source={{ uri: qrUri }} style={styles.qrImage} />
                    </View>
                ) : null}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface
    },
    content: {
        padding: spacing.containerPadding,
        gap: spacing.stackMd
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.35
    },
    progressCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm,
        marginBottom: spacing.stackMd
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacing.stackSm
    },
    progressTitle: {
        ...typography.headlineMd,
        color: colors.primary
    },
    progressSubtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    streakPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: "rgba(0, 242, 255, 0.18)"
    },
    streakText: {
        ...typography.bodySm,
        color: colors.primary
    },
    progressTrack: {
        height: 8,
        borderRadius: 999
    },
    dailyCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm,
        marginBottom: spacing.stackMd
    },
    dailyHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    dailyTitle: {
        ...typography.labelCaps,
        color: colors.primary
    },
    dailyBadge: {
        ...typography.bodySm,
        color: colors.secondary
    },
    dailySubtitle: {
        ...typography.bodySm,
        color: colors.onSurface
    },
    chartCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm,
        marginBottom: spacing.stackMd
    },
    chartTitle: {
        ...typography.labelCaps,
        color: colors.primary
    },
    chartRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.stackSm
    },
    chartLabel: {
        width: 70,
        ...typography.bodySm,
        color: colors.onSurface
    },
    chartTrack: {
        flex: 1,
        height: 8
    },
    chartValue: {
        width: 24,
        textAlign: "right",
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    scanBlock: {
        backgroundColor: "rgba(255,255,255,0.7)",
        padding: spacing.containerPadding,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(0, 242, 255, 0.3)",
        gap: spacing.stackSm
    },
    scanTitle: {
        ...typography.headlineMd,
        color: colors.primary
    },
    scanSubtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    qrCard: {
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.7)",
        padding: spacing.stackMd,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(0, 242, 255, 0.2)"
    },
    qrTitle: {
        ...typography.bodyMd,
        color: colors.onSurface,
        marginBottom: spacing.stackSm
    },
    qrImage: {
        width: 160,
        height: 160
    }
});
