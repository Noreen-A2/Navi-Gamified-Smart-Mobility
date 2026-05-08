import { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/SectionTitle";
import { GlassCard } from "../components/GlassCard";
import { HoloButton } from "../components/HoloButton";
import { AnimatedBar } from "../components/AnimatedBar";
import { colors, gradients, radii, spacing, typography } from "../theme";
import { useTransitStore } from "../store/useTransitStore";
import { mockTransitRoutes, mockTransitVehicles } from "../data/mockTransit";

const occupancyLabel = (value: number) => {
    if (value >= 70) return "Busy";
    if (value >= 45) return "Steady";
    return "Light";
};

export const TransitScreen = () => {
    const insets = useSafeAreaInsets();
    const { vehicles, startSimulation, stopSimulation } = useTransitStore();

    useEffect(() => {
        startSimulation();
        return () => stopSimulation();
    }, [startSimulation, stopSimulation]);

    const liveVehicles = useMemo(
        () => (vehicles.length ? vehicles : mockTransitVehicles),
        [vehicles]
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 148 }]}>
            <LinearGradient colors={gradients.pearl as any} style={styles.background} />
            <SectionTitle title="Transit Pulse" subtitle="Live buses and city tempo." trailing="Live" />

            <GlassCard style={styles.heroCard}>
                <View style={styles.heroHeader}>
                    <View style={styles.heroIcon}>
                        <MaterialIcons name="directions-bus" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.heroText}>
                        <Text style={styles.heroTitle}>Next arrivals</Text>
                        <Text style={styles.heroSubtitle}>Syncing every 5 seconds</Text>
                    </View>
                    <View style={styles.livePill}>
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                </View>

                {liveVehicles.slice(0, 3).map((vehicle) => (
                    <View key={vehicle.id} style={styles.vehicleRow}>
                        <View style={styles.routeBadge}>
                            <Text style={styles.routeText}>Route {vehicle.route}</Text>
                        </View>
                        <View style={styles.vehicleMeta}>
                            <Text style={styles.vehicleEta}>{vehicle.etaMinutes} min</Text>
                            <Text style={styles.vehicleLoad}>
                                {occupancyLabel(vehicle.occupancy)} load
                            </Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={18} color={colors.primary} />
                    </View>
                ))}
            </GlassCard>

            <SectionTitle title="Route radar" subtitle="Track active lines and alerts." />
            <View style={styles.routeGrid}>
                {mockTransitRoutes.map((route) => (
                    <GlassCard key={route.id} style={styles.routeCard}>
                        <View style={styles.routeHeader}>
                            <Text style={styles.routeName}>{route.name}</Text>
                            <Text style={styles.routeCode}>{route.route}</Text>
                        </View>
                        <Text style={styles.routeNext}>Next stop: {route.nextStop}</Text>
                        <View style={styles.routeFooter}>
                            <Text style={styles.routeStatus}>{route.status}</Text>
                            <Text style={styles.routeHeadway}>Every {route.headwayMinutes} min</Text>
                        </View>
                    </GlassCard>
                ))}
            </View>

            <GlassCard style={styles.chartCard}>
                <Text style={styles.chartTitle}>Occupancy chart</Text>
                {mockTransitRoutes.map((route) => (
                    <View key={route.id} style={styles.chartRow}>
                        <Text style={styles.chartLabel}>{route.route}</Text>
                        <AnimatedBar value={route.occupancy} style={styles.chartTrack} />
                        <Text style={styles.chartValue}>{route.occupancy}%</Text>
                    </View>
                ))}
            </GlassCard>

            <GlassCard style={styles.alertCard}>
                <Text style={styles.alertTitle}>Service alerts</Text>
                <View style={styles.alertRow}>
                    <MaterialIcons name="campaign" size={18} color={colors.secondary} />
                    <Text style={styles.alertText}>Route 118 detour near Old Town Market.</Text>
                </View>
                <View style={styles.alertRow}>
                    <MaterialIcons name="speed" size={18} color={colors.primary} />
                    <Text style={styles.alertText}>Marina Loop is running ahead of schedule.</Text>
                </View>
            </GlassCard>

            <HoloButton title="Open live map" onPress={() => undefined} />
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
        padding: spacing.containerPadding,
        gap: spacing.stackSm
    },
    heroHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.stackSm
    },
    heroIcon: {
        width: 36,
        height: 36,
        borderRadius: radii.full,
        backgroundColor: "rgba(0, 242, 255, 0.15)",
        alignItems: "center",
        justifyContent: "center"
    },
    heroText: {
        flex: 1
    },
    heroTitle: {
        ...typography.headlineMd,
        color: colors.onSurface
    },
    heroSubtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    livePill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radii.full,
        backgroundColor: "rgba(0, 242, 255, 0.2)"
    },
    liveText: {
        ...typography.labelCaps,
        fontSize: 10,
        color: colors.primary
    },
    vehicleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.stackSm,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 105, 111, 0.08)"
    },
    routeBadge: {
        backgroundColor: colors.primaryContainer,
        borderRadius: radii.full,
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    routeText: {
        ...typography.dataPoint,
        color: colors.onPrimaryContainer
    },
    vehicleMeta: {
        flex: 1
    },
    vehicleEta: {
        ...typography.bodyMd,
        color: colors.onSurface
    },
    vehicleLoad: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    routeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.stackSm
    },
    routeCard: {
        flexBasis: "47%",
        padding: spacing.stackMd,
        gap: spacing.stackSm
    },
    routeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    routeName: {
        ...typography.bodyMd,
        color: colors.onSurface
    },
    routeCode: {
        ...typography.labelCaps,
        color: colors.primary
    },
    routeNext: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    routeFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    routeStatus: {
        ...typography.bodySm,
        color: colors.secondary
    },
    routeHeadway: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    alertCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm
    },
    alertTitle: {
        ...typography.labelCaps,
        color: colors.primary
    },
    alertRow: {
        flexDirection: "row",
        gap: spacing.stackSm,
        alignItems: "center"
    },
    alertText: {
        ...typography.bodySm,
        color: colors.onSurface
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
        width: 50,
        ...typography.bodySm,
        color: colors.onSurface
    },
    chartTrack: {
        flex: 1,
        height: 8
    },
    chartValue: {
        width: 44,
        textAlign: "right",
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    }
});
