import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useMapStore } from "../store/useMapStore";
import { colors, gradients, spacing, typography } from "../theme";
import { SectionTitle } from "../components/SectionTitle";
import { levelFromXp, xpToNextLevel } from "../utils/xp";
import { GlassCard } from "../components/GlassCard";
import { SparklineChart } from "../components/SparklineChart";

export const ProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const xp = useMapStore((state) => state.xp);
    const level = levelFromXp(xp);
    const toNext = xpToNextLevel(xp);
    const achievements = useMapStore((state) => state.achievements);
    const badges = useMapStore((state) => state.badges);
    const streak = useMapStore((state) => state.streak);
    const unlockedRegionIds = useMapStore((state) => state.unlockedRegionIds);
    const regionCount = useMapStore((state) => state.regions.length);
    const unlockProgress = regionCount ? Math.round((unlockedRegionIds.length / regionCount) * 100) : 0;
    const weeklyXp = [24, 48, 36, 72, 64, 80, 92];

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 148 }]}>
            <LinearGradient colors={gradients.pearl as any} style={styles.background} />
            <SectionTitle title="Master Explorer" subtitle="Urban Vanguard Class" />
            <View style={styles.heroCard}>
                <Text style={styles.level}>Level {level}</Text>
                <Text style={styles.xp}>{xp} XP</Text>
                <Text style={styles.next}>Next level in {toNext} XP</Text>
            </View>
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{streak} days</Text>
                    <Text style={styles.statLabel}>Weekly streak</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{unlockProgress}%</Text>
                    <Text style={styles.statLabel}>District unlock</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>342</Text>
                    <Text style={styles.statLabel}>Hidden spots</Text>
                </View>
            </View>
            <GlassCard style={styles.card}>
                <Text style={styles.statTitle}>Achievements</Text>
                <Text style={styles.statValue}>{achievements.join(" · ")}</Text>
                <Text style={styles.statCaption}>City elite rewards unlocked.</Text>
            </GlassCard>
            <GlassCard style={styles.card}>
                <Text style={styles.statTitle}>Badges</Text>
                <Text style={styles.statValue}>{badges.join(" · ")}</Text>
                <Text style={styles.statCaption}>Collect rare holographic badges.</Text>
            </GlassCard>
            <GlassCard style={styles.card}>
                <Text style={styles.statTitle}>Weekly momentum</Text>
                <SparklineChart values={weeklyXp} height={90} />
                <Text style={styles.statCaption}>XP collected over the last 7 days.</Text>
            </GlassCard>
            <GlassCard style={styles.card}>
                <Text style={styles.statTitle}>Perks</Text>
                <View style={styles.perkRow}>
                    <MaterialIcons name="local-cafe" size={16} color={colors.primary} />
                    <Text style={styles.perkText}>Free recharge at partner cafes</Text>
                </View>
                <View style={styles.perkRow}>
                    <MaterialIcons name="directions-bus" size={16} color={colors.primary} />
                    <Text style={styles.perkText}>Priority boarding on Route 402</Text>
                </View>
            </GlassCard>
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
    heroCard: {
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 20,
        padding: spacing.containerPadding,
        borderWidth: 1,
        borderColor: "rgba(0, 242, 255, 0.2)",
        gap: 8
    },
    level: {
        ...typography.headlineLg,
        color: colors.primary
    },
    xp: {
        ...typography.bodyLg,
        color: colors.onSurface
    },
    next: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    statsGrid: {
        flexDirection: "row",
        gap: spacing.stackSm,
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    statCard: {
        flex: 1,
        minWidth: "47%",
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(0, 242, 255, 0.15)"
    },
    statValue: {
        ...typography.headlineMd,
        color: colors.primary
    },
    statLabel: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    card: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm
    },
    statTitle: {
        ...typography.labelCaps,
        color: colors.primary
    },
    statCaption: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    perkRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    perkText: {
        ...typography.bodySm,
        color: colors.onSurface
    }
});
