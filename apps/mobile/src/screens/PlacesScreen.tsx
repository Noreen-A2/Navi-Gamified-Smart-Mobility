import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/SectionTitle";
import { GlassCard } from "../components/GlassCard";
import { HoloButton } from "../components/HoloButton";
import { AnimatedBar } from "../components/AnimatedBar";
import { colors, gradients, radii, spacing, typography } from "../theme";
import { mockPlaces } from "../data/mockPlaces";
import { mockBusinesses } from "../data/mockBusinesses";

const categories = [
    { id: "all", label: "All", icon: "apps" },
    { id: "viewpoint", label: "Viewpoints", icon: "landscape" },
    { id: "culture", label: "Culture", icon: "account-balance" },
    { id: "food", label: "Food", icon: "restaurant" },
    { id: "waterfront", label: "Waterfront", icon: "water" }
];

const sponsorTone = {
    partner: "rgba(0, 105, 111, 0.12)",
    premium: "rgba(252, 212, 0, 0.25)",
    featured: "rgba(0, 242, 255, 0.2)"
};

export const PlacesScreen = () => {
    const insets = useSafeAreaInsets();
    const featured = mockPlaces[0];
    const categoryMix = useMemo(() => {
        const counts: Record<string, number> = {};
        mockPlaces.forEach((place) => {
            const key = place.category.toLowerCase();
            counts[key] = (counts[key] ?? 0) + 1;
        });
        const total = mockPlaces.length || 1;
        return { counts, total };
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 148 }]}>
            <LinearGradient colors={gradients.pearl as any} style={styles.background} />
            <SectionTitle
                title="Places to Visit"
                subtitle="Curated routes for neon explorers."
                trailing="New"
            />

            <LinearGradient colors={gradients.holo as any} style={styles.hero}>
                <View style={styles.heroBadge}>
                    <MaterialIcons name="auto-awesome" size={18} color={colors.onPrimary} />
                    <Text style={styles.heroBadgeText}>Featured</Text>
                </View>
                <Text style={styles.heroTitle}>{featured.name}</Text>
                <Text style={styles.heroDescription}>{featured.description}</Text>
                <View style={styles.heroMeta}>
                    <Text style={styles.heroMetaText}>{featured.etaMinutes} min</Text>
                    <Text style={styles.heroMetaText}>{featured.distanceKm} km</Text>
                    <Text style={styles.heroMetaText}>+{featured.rewardXp} XP</Text>
                </View>
            </LinearGradient>

            <View style={styles.categoryRow}>
                {categories.map((category) => (
                    <View key={category.id} style={styles.categoryPill}>
                        <MaterialIcons name={category.icon as any} size={16} color={colors.primary} />
                        <Text style={styles.categoryText}>{category.label}</Text>
                    </View>
                ))}
            </View>

            <SectionTitle title="Top picks" subtitle="Trending across NAVI explorers." />
            {mockPlaces.map((place) => (
                <GlassCard key={place.id} style={styles.placeCard}>
                    <View style={styles.placeHeader}>
                        <Text style={styles.placeTitle}>{place.name}</Text>
                        <View style={styles.ratingBlock}>
                            <MaterialIcons name="star" size={14} color={colors.secondary} />
                            <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
                        </View>
                    </View>
                    <Text style={styles.placeDescription}>{place.description}</Text>
                    <View style={styles.placeMeta}>
                        <Text style={styles.placeMetaText}>{place.category}</Text>
                        <Text style={styles.placeMetaText}>{place.vibe}</Text>
                    </View>
                    <View style={styles.tagRow}>
                        {place.tags.map((tag) => (
                            <View key={tag} style={styles.tagPill}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </GlassCard>
            ))}

            <GlassCard style={styles.chartCard}>
                <Text style={styles.chartTitle}>Category heat</Text>
                {Object.entries(categoryMix.counts).map(([category, count]) => (
                    <View key={category} style={styles.chartRow}>
                        <Text style={styles.chartLabel}>{category}</Text>
                        <AnimatedBar value={count} max={categoryMix.total} style={styles.chartTrack} />
                        <Text style={styles.chartValue}>{count}</Text>
                    </View>
                ))}
            </GlassCard>

            <SectionTitle title="Sponsored" subtitle="Business partners with rewards." />
            {mockBusinesses.map((business) => (
                <GlassCard key={business.id} style={styles.sponsorCard}>
                    <View
                        style={[
                            styles.sponsorBadge,
                            { backgroundColor: sponsorTone[business.sponsorLevel] }
                        ]}
                    >
                        <Text style={styles.sponsorBadgeText}>{business.sponsorLevel}</Text>
                    </View>
                    <Text style={styles.sponsorTitle}>{business.name}</Text>
                    <Text style={styles.sponsorSubtitle}>{business.tagline ?? business.reward}</Text>
                    <Text style={styles.sponsorOffer}>{business.offer ?? business.reward}</Text>
                </GlassCard>
            ))}

            <HoloButton title="Start a city route" onPress={() => undefined} />
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
    hero: {
        borderRadius: radii.xl,
        padding: spacing.containerPadding,
        gap: spacing.stackSm
    },
    heroBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    heroBadgeText: {
        ...typography.labelCaps,
        fontSize: 10,
        color: colors.onPrimary
    },
    heroTitle: {
        ...typography.headlineLg,
        color: colors.onPrimary
    },
    heroDescription: {
        ...typography.bodySm,
        color: colors.onPrimary
    },
    heroMeta: {
        flexDirection: "row",
        gap: spacing.stackSm
    },
    heroMetaText: {
        ...typography.bodySm,
        color: colors.onPrimary
    },
    categoryRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.stackSm
    },
    categoryPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: radii.full,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderWidth: 1,
        borderColor: "rgba(0, 105, 111, 0.12)"
    },
    categoryText: {
        ...typography.bodySm,
        color: colors.onSurface
    },
    placeCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm
    },
    placeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    placeTitle: {
        ...typography.headlineMd,
        color: colors.onSurface
    },
    ratingBlock: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    },
    ratingText: {
        ...typography.bodySm,
        color: colors.secondary
    },
    placeDescription: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    placeMeta: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    placeMetaText: {
        ...typography.bodySm,
        color: colors.primary
    },
    tagRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6
    },
    tagPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radii.full,
        backgroundColor: "rgba(0, 242, 255, 0.12)"
    },
    tagText: {
        ...typography.bodySm,
        color: colors.primary
    },
    sponsorCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm
    },
    sponsorBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radii.full
    },
    sponsorBadgeText: {
        ...typography.labelCaps,
        fontSize: 10,
        color: colors.primary
    },
    sponsorTitle: {
        ...typography.headlineMd,
        color: colors.onSurface
    },
    sponsorSubtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    sponsorOffer: {
        ...typography.bodySm,
        color: colors.primary
    },
    chartCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm
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
        width: 90,
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
    }
});
