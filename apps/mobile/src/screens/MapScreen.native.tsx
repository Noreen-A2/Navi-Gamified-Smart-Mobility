import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated as RNAnimated, Pressable, StyleSheet, Text, View, Vibration } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Circle, Marker, Polygon, Polyline } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, typography } from "../theme";
import { useLocation } from "../hooks/useLocation";
import { useMapStore } from "../store/useMapStore";
import { useQuestStore } from "../store/useQuestStore";
import { useTransitStore } from "../store/useTransitStore";
import { mockBusinesses } from "../data/mockBusinesses";
import { mockTransitVehicles } from "../data/mockTransit";
import { mockPlaces } from "../data/mockPlaces";
import { pointInPolygon } from "../utils/geo";
import { SwipeDownPanel } from "../components/SwipeDownPanel";
import { RotaPanel } from "../components/RotaPanel";
import { GlassCard } from "../components/GlassCard";

const INITIAL_REGION = {
    latitude: 31.003,
    longitude: 28.982,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03
};

type MapPoint = {
    id: string;
    title: string;
    subtitle: string;
    rewardXp: number;
    coordinate: { latitude: number; longitude: number };
    kind: "quest" | "place";
    category?: string;
};

type Cluster = {
    id: string;
    coordinate: { latitude: number; longitude: number };
    items: MapPoint[];
};

type PreviewData = {
    title: string;
    subtitle: string;
    meta?: string;
    detail?: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    accent: string;
    list?: string[];
    moreCount?: number;
};

const clusterPoints = (points: MapPoint[], size = 0.0045): Cluster[] => {
    const buckets = new Map<
        string,
        { items: MapPoint[]; latitudeSum: number; longitudeSum: number }
    >();

    points.forEach((point) => {
        const key = `${Math.floor(point.coordinate.latitude / size)}:${Math.floor(
            point.coordinate.longitude / size
        )}`;
        const bucket = buckets.get(key);
        if (bucket) {
            bucket.items.push(point);
            bucket.latitudeSum += point.coordinate.latitude;
            bucket.longitudeSum += point.coordinate.longitude;
        } else {
            buckets.set(key, {
                items: [point],
                latitudeSum: point.coordinate.latitude,
                longitudeSum: point.coordinate.longitude
            });
        }
    });

    return Array.from(buckets.entries()).map(([key, bucket]) => ({
        id: key,
        coordinate: {
            latitude: bucket.latitudeSum / bucket.items.length,
            longitude: bucket.longitudeSum / bucket.items.length
        },
        items: bucket.items
    }));
};

export const MapScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { location } = useLocation();
    const {
        regions,
        unlockedRegionIds,
        unlockRegion,
        addVisitedLocation,
        visitedLocations,
        xp,
        loadRegions,
        syncProgress,
        syncUnlockRegion
    } = useMapStore();
    const quests = useQuestStore((state) => state.quests);
    const completedQuestIds = useQuestStore((state) => state.completedQuestIds);
    const loadQuests = useQuestStore((state) => state.loadQuests);
    const { vehicles, startSimulation, stopSimulation } = useTransitStore();
    const [xpBurst, setXpBurst] = useState<number | null>(null);
    const mapRef = useRef<MapView>(null);
    const [unlockPulsePoint, setUnlockPulsePoint] = useState<{ x: number; y: number } | null>(
        null
    );
    const pulseScale = useSharedValue(0.4);
    const pulseOpacity = useSharedValue(0);
    const xpScale = useSharedValue(0.8);
    const xpOpacity = useSharedValue(0);
    const revealScale = useSharedValue(1);
    const revealOpacity = useSharedValue(0.25);
    const [revealPoint, setRevealPoint] = useState<{ x: number; y: number } | null>(null);
    const [preview, setPreview] = useState<PreviewData | null>(null);
    const [previewSnapshot, setPreviewSnapshot] = useState<PreviewData | null>(null);
    const previewAnim = useRef(new RNAnimated.Value(0)).current;
    const [regionState, setRegionState] = useState(INITIAL_REGION);

    // compute dynamic paddings to avoid overlays overlapping map controls
    const overlayTop = insets.top + spacing.containerPadding;
    const transitTop = overlayTop + 62;
    const bottomControlsBottom = insets.bottom + 86;
    const topMapPadding = Math.max(170, transitTop + 120);
    const bottomMapPadding = Math.max(240, bottomControlsBottom + 120);

    useEffect(() => {
        startSimulation();
        return () => stopSimulation();
    }, [startSimulation, stopSimulation]);

    useEffect(() => {
        loadRegions().catch(() => undefined);
        loadQuests().catch(() => undefined);
        syncProgress().catch(() => undefined);
    }, [loadRegions, loadQuests, syncProgress]);

    useEffect(() => {
        if (!location) return;
        const point = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        };

        regions.forEach((region) => {
            if (!unlockedRegionIds.includes(region.id) && pointInPolygon(point, region.polygon)) {
                unlockRegion(region.id);
                syncUnlockRegion(region.id, point).catch(() => undefined);
                triggerUnlockPulse(point);
                setXpBurst(region.unlockXp);
            }
        });

        addVisitedLocation(point);
    }, [location, regions, unlockedRegionIds, unlockRegion, addVisitedLocation]);

    useEffect(() => {
        if (!completedQuestIds.length) return;
        completedQuestIds.forEach((questId) => {
            const quest = quests.find((item) => item.id === questId);
            if (!quest) return;
            if (unlockedRegionIds.includes(quest.regionId)) return;
            unlockRegion(quest.regionId);
            const unlockPoint = quest.location ??
                (location
                    ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
                    : null);
            if (unlockPoint) {
                syncUnlockRegion(quest.regionId, unlockPoint).catch(() => undefined);
            }
        });
    }, [completedQuestIds, quests, unlockedRegionIds, unlockRegion, syncUnlockRegion, location]);

    useEffect(() => {
        if (!xpBurst) return;
        xpScale.value = 0.8;
        xpOpacity.value = 1;
        xpScale.value = withTiming(1.15, { duration: 800 });
        xpOpacity.value = withTiming(0, { duration: 1400 });
        const timer = setTimeout(() => setXpBurst(null), 1600);
        return () => clearTimeout(timer);
    }, [xpBurst, xpOpacity, xpScale]);

    useEffect(() => {
        revealScale.value = 1;
        revealOpacity.value = 0.35;
        revealScale.value = withRepeat(withTiming(1.7, { duration: 2400 }), -1, false);
        revealOpacity.value = withRepeat(withTiming(0, { duration: 2400 }), -1, false);
    }, [revealOpacity, revealScale]);

    const updateRevealPoint = useCallback(async () => {
        if (!location || !mapRef.current) return;
        try {
            const point = await mapRef.current.pointForCoordinate({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
            setRevealPoint(point);
        } catch {
            return;
        }
    }, [location]);

    useEffect(() => {
        updateRevealPoint();
    }, [updateRevealPoint]);

    useEffect(() => {
        if (preview) {
            setPreviewSnapshot(preview);
            RNAnimated.spring(previewAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 7
            }).start();
            return;
        }

        RNAnimated.timing(previewAnim, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true
        }).start(({ finished }) => {
            if (finished) setPreviewSnapshot(null);
        });
    }, [preview, previewAnim]);

    const triggerUnlockPulse = async (coordinate: { latitude: number; longitude: number }) => {
        if (!mapRef.current) return;
        try {
            const point = await mapRef.current.pointForCoordinate(coordinate);
            setUnlockPulsePoint(point);
            pulseScale.value = 0.4;
            pulseOpacity.value = 0.8;
            pulseScale.value = withTiming(1.6, { duration: 1200 });
            pulseOpacity.value = withTiming(0, { duration: 1200 }, () => {
                runOnJS(setUnlockPulsePoint)(null);
            });
        } catch {
            return;
        }
    };

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
        opacity: pulseOpacity.value
    }));

    const xpBurstStyle = useAnimatedStyle(() => ({
        transform: [{ scale: xpScale.value }],
        opacity: xpOpacity.value
    }));

    const revealStyle = useAnimatedStyle(() => ({
        transform: [{ scale: revealScale.value }],
        opacity: revealOpacity.value
    }));

    const previewTranslate = previewAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [40, 0]
    });
    const previewScale = previewAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.98, 1]
    });

    const questPoints = useMemo<MapPoint[]>(
        () =>
            quests
                .filter((quest) => quest.location)
                .map((quest) => ({
                    id: quest.id,
                    title: quest.title,
                    subtitle: quest.description,
                    rewardXp: quest.rewardXp,
                    coordinate: quest.location!,
                    kind: "quest"
                })),
        [quests]
    );

    const placePoints = useMemo<MapPoint[]>(
        () =>
            mockPlaces.map((place) => ({
                id: place.id,
                title: place.name,
                subtitle: place.description,
                rewardXp: place.rewardXp,
                coordinate: place.location,
                kind: "place",
                category: place.category
            })),
        []
    );

    const clusterSize = useMemo(() => {
        const maxDelta = Math.max(regionState.latitudeDelta, regionState.longitudeDelta);
        return Math.max(0.0025, Math.min(0.01, maxDelta * 0.12));
    }, [regionState.latitudeDelta, regionState.longitudeDelta]);

    const questClusters = useMemo(
        () => clusterPoints(questPoints, clusterSize),
        [questPoints, clusterSize]
    );
    const placeClusters = useMemo(
        () => clusterPoints(placePoints, clusterSize),
        [placePoints, clusterSize]
    );

    const showPreview = useCallback((data: PreviewData) => {
        setPreview(data);
        Vibration.vibrate(10);
    }, []);

    const liveVehicles = useMemo(
        () => (vehicles.length ? vehicles.slice(0, 2) : mockTransitVehicles.slice(0, 2)),
        [vehicles]
    );

    const handleLocate = useCallback(() => {
        if (!location || !mapRef.current) return;
        mapRef.current.animateToRegion(
            {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            },
            600
        );
    }, [location]);

    const progress = regions.length
        ? Math.round((unlockedRegionIds.length / regions.length) * 100)
        : 0;

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={INITIAL_REGION}
                showsUserLocation
                showsMyLocationButton={false}
                mapPadding={{ top: topMapPadding, right: 16, bottom: bottomMapPadding, left: 16 }}
                onRegionChangeComplete={(region) => {
                    setRegionState(region);
                    updateRevealPoint();
                }}
                onPress={() => setPreview(null)}
            >

                {regions.map((region) => {
                    const isUnlocked = unlockedRegionIds.includes(region.id);
                    return (
                        <Polygon
                            key={region.id}
                            coordinates={region.polygon}
                            strokeColor={isUnlocked ? colors.primary : "rgba(9, 20, 24, 0.35)"}
                            strokeWidth={1}
                            fillColor={
                                isUnlocked
                                    ? "rgba(0, 242, 255, 0.1)"
                                    : "rgba(9, 20, 24, 0.55)"
                            }
                        />
                    );
                })}

                {location ? (
                    <Circle
                        center={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        }}
                        radius={180}
                        strokeColor="rgba(0, 242, 255, 0.45)"
                        fillColor="rgba(0, 242, 255, 0.12)"
                    />
                ) : null}

                {questClusters.map((cluster) => {
                    if (cluster.items.length > 1) {
                        const totalXp = cluster.items.reduce(
                            (sum, item) => sum + item.rewardXp,
                            0
                        );
                        return (
                            <Marker
                                key={`quest-cluster-${cluster.id}`}
                                coordinate={cluster.coordinate}
                                onPress={() =>
                                    showPreview({
                                        title: `${cluster.items.length} quests nearby`,
                                        subtitle: "Clustered challenges with high XP yield.",
                                        meta: `${totalXp} XP total`,
                                        icon: "emoji-events",
                                        accent: "rgba(0, 242, 255, 0.25)",
                                        list: cluster.items.slice(0, 2).map((item) => item.title),
                                        moreCount: Math.max(0, cluster.items.length - 2)
                                    })
                                }
                            >
                                <View style={[styles.clusterMarker, styles.clusterQuest]}>
                                    <MaterialIcons name="emoji-events" size={14} color={colors.onPrimary} />
                                    <Text style={styles.clusterText}>{cluster.items.length}</Text>
                                </View>
                            </Marker>
                        );
                    }

                    const quest = cluster.items[0];
                    return (
                        <Marker
                            key={quest.id}
                            coordinate={quest.coordinate}
                            onPress={() =>
                                showPreview({
                                    title: quest.title,
                                    subtitle: quest.subtitle,
                                    meta: `+${quest.rewardXp} XP`,
                                    detail: "Quest reward",
                                    icon: "emoji-events",
                                    accent: "rgba(0, 242, 255, 0.2)"
                                })
                            }
                        >
                            <View style={styles.questMarker}>
                                <MaterialIcons name="emoji-events" size={14} color={colors.primary} />
                                <Text style={styles.questMarkerText}>+{quest.rewardXp}</Text>
                            </View>
                        </Marker>
                    );
                })}

                {placeClusters.map((cluster) => {
                    if (cluster.items.length > 1) {
                        return (
                            <Marker
                                key={`place-cluster-${cluster.id}`}
                                coordinate={cluster.coordinate}
                                onPress={() =>
                                    showPreview({
                                        title: `${cluster.items.length} places nearby`,
                                        subtitle: "Curated spots with bonus XP.",
                                        meta: `+${cluster.items.reduce(
                                            (sum, item) => sum + item.rewardXp,
                                            0
                                        )} XP`,
                                        icon: "place",
                                        accent: "rgba(0, 105, 111, 0.25)",
                                        list: cluster.items.slice(0, 2).map((item) => item.title),
                                        moreCount: Math.max(0, cluster.items.length - 2)
                                    })
                                }
                            >
                                <View style={[styles.clusterMarker, styles.clusterPlace]}>
                                    <MaterialIcons name="place" size={14} color={colors.onPrimary} />
                                    <Text style={styles.clusterText}>{cluster.items.length}</Text>
                                </View>
                            </Marker>
                        );
                    }

                    const place = cluster.items[0];
                    return (
                        <Marker
                            key={place.id}
                            coordinate={place.coordinate}
                            onPress={() =>
                                showPreview({
                                    title: place.title,
                                    subtitle: place.subtitle,
                                    meta: `+${place.rewardXp} XP`,
                                    detail: place.category ?? "Place",
                                    icon: "place",
                                    accent: "rgba(0, 105, 111, 0.25)"
                                })
                            }
                        >
                            <View style={styles.placeMarker}>
                                <MaterialIcons name="place" size={14} color={colors.onPrimary} />
                                <Text style={styles.placeMarkerText}>{place.rewardXp} XP</Text>
                            </View>
                        </Marker>
                    );
                })}

                {mockBusinesses.map((business) => (
                    <Marker
                        key={business.id}
                        coordinate={business.location}
                        onPress={() =>
                            showPreview({
                                title: business.name,
                                subtitle: business.tagline ?? business.reward,
                                meta: business.offer ?? business.reward,
                                detail: business.category,
                                icon: "store",
                                accent: "rgba(252, 212, 0, 0.35)"
                            })
                        }
                    >
                        <View style={styles.businessMarker}>
                            <Text style={styles.businessMarkerText}>$</Text>
                        </View>
                    </Marker>
                ))}

                {vehicles.map((vehicle) => (
                    <Marker key={vehicle.id} coordinate={vehicle.coordinate}>
                        <View style={styles.busMarker}>
                            <Text style={styles.busMarkerText}>{vehicle.route}</Text>
                        </View>
                    </Marker>
                ))}

                {visitedLocations.length > 1 ? (
                    <Polyline
                        coordinates={visitedLocations}
                        strokeColor="rgba(252, 212, 0, 0.55)"
                        strokeWidth={3}
                    />
                ) : null}
            </MapView>

            <View style={[styles.overlayHeader, { top: overlayTop }]}>
                <View>
                    <Text style={styles.brand}>NAVI</Text>
                    <Text style={styles.progressText}>{progress}% explored</Text>
                </View>
            </View>

            <GlassCard style={[styles.transitDock, { top: transitTop }]}>
                <View style={styles.transitHeader}>
                    <View style={styles.transitIcon}>
                        <MaterialIcons name="directions-bus" size={18} color={colors.primary} />
                    </View>
                    <Text style={styles.transitTitle}>Bus tracking</Text>
                    <Text style={styles.transitLive}>LIVE</Text>
                </View>
                {liveVehicles.map((vehicle) => (
                    <View key={vehicle.id} style={styles.transitRow}>
                        <Text style={styles.transitRoute}>Route {vehicle.route}</Text>
                        <Text style={styles.transitEta}>{vehicle.etaMinutes} min</Text>
                        <Text style={styles.transitLoad}>{vehicle.occupancy}%</Text>
                    </View>
                ))}
                <Pressable
                    onPress={() => navigation.navigate("TransitPulse" as never)}
                    style={styles.transitLink}
                >
                    <Text style={styles.transitLinkText}>Open transit pulse</Text>
                    <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                </Pressable>
            </GlassCard>

            <View style={[styles.bottomControls, { bottom: bottomControlsBottom }]}>
                <View style={styles.scorePill}>
                    <Text style={styles.scoreLabel}>NAVI SCORE</Text>
                    <Text style={styles.scoreValue}>{xp} XP</Text>
                </View>
                <Pressable onPress={handleLocate} style={styles.locateButton}>
                    <MaterialIcons name="my-location" size={18} color={colors.primary} />
                </Pressable>
            </View>

            {revealPoint ? (
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.revealPulse,
                        {
                            left: revealPoint.x - 140,
                            top: revealPoint.y - 140
                        },
                        revealStyle
                    ]}
                />
            ) : null}

            {unlockPulsePoint ? (
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.unlockPulse,
                        {
                            left: unlockPulsePoint.x - 120,
                            top: unlockPulsePoint.y - 120
                        },
                        pulseStyle
                    ]}
                />
            ) : null}

            {xpBurst ? (
                <Animated.View style={[styles.xpBurst, { top: transitTop + 88 }, xpBurstStyle]}>
                    <Text style={styles.xpBurstText}>+{xpBurst} XP</Text>
                </Animated.View>
            ) : null}

            {previewSnapshot ? (
                <RNAnimated.View
                    style={[
                        styles.previewWrap,
                        { bottom: insets.bottom + 176 },
                        {
                            opacity: previewAnim,
                            transform: [{ translateY: previewTranslate }, { scale: previewScale }]
                        }
                    ]}
                >
                    <GlassCard style={styles.previewCard}>
                        <View style={styles.previewHeader}>
                            <View
                                style={[styles.previewIcon, { backgroundColor: previewSnapshot.accent }]}
                            >
                                <MaterialIcons
                                    name={previewSnapshot.icon}
                                    size={16}
                                    color={colors.primary}
                                />
                            </View>
                            <View style={styles.previewHeaderText}>
                                <Text style={styles.previewTitle}>{previewSnapshot.title}</Text>
                                <Text style={styles.previewSubtitle}>{previewSnapshot.subtitle}</Text>
                            </View>
                            <Pressable
                                onPress={() => setPreview(null)}
                                style={styles.previewClose}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={16}
                                    color={colors.onSurfaceVariant}
                                />
                            </Pressable>
                        </View>
                        {previewSnapshot.meta ? (
                            <Text style={styles.previewMeta}>{previewSnapshot.meta}</Text>
                        ) : null}
                        {previewSnapshot.detail ? (
                            <Text style={styles.previewDetail}>{previewSnapshot.detail}</Text>
                        ) : null}
                        {previewSnapshot.list ? (
                            <View style={styles.previewList}>
                                {previewSnapshot.list.map((item) => (
                                    <Text key={item} style={styles.previewListItem}>
                                        {item}
                                    </Text>
                                ))}
                                {previewSnapshot.moreCount ? (
                                    <Text style={styles.previewMore}>
                                        +{previewSnapshot.moreCount} more
                                    </Text>
                                ) : null}
                            </View>
                        ) : null}
                    </GlassCard>
                </RNAnimated.View>
            ) : null}

            <SwipeDownPanel>
                <RotaPanel />
            </SwipeDownPanel>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface
    },
    map: {
        flex: 1
    },
    overlayHeader: {
        position: "absolute",
        left: spacing.gutter,
        right: spacing.gutter,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.7)",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18
    },
    brand: {
        ...typography.headlineMd,
        color: colors.primary
    },
    xpText: {
        ...typography.dataPoint,
        color: colors.onSurface
    },
    bottomControls: {
        position: "absolute",
        left: spacing.gutter,
        right: spacing.gutter,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    scorePill: {
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "rgba(0, 242, 255, 0.25)"
    },
    scoreLabel: {
        ...typography.labelCaps,
        fontSize: 9,
        color: colors.onSurfaceVariant
    },
    scoreValue: {
        ...typography.dataPoint,
        color: colors.primary
    },
    locateButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.92)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(0, 242, 255, 0.25)"
    },
    progressText: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    transitDock: {
        position: "absolute",
        top: spacing.containerPadding + 56,
        left: spacing.gutter,
        right: spacing.gutter,
        padding: 12,
        gap: 8
    },
    transitHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    transitIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "rgba(0, 242, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center"
    },
    transitTitle: {
        ...typography.bodyMd,
        color: colors.onSurface
    },
    transitLive: {
        marginLeft: "auto",
        ...typography.labelCaps,
        fontSize: 9,
        color: colors.primary
    },
    transitRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    transitLink: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 105, 111, 0.12)"
    },
    transitLinkText: {
        ...typography.bodySm,
        color: colors.primary
    },
    transitRoute: {
        ...typography.bodySm,
        color: colors.onSurface
    },
    transitEta: {
        ...typography.bodySm,
        color: colors.primary
    },
    transitLoad: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    questMarker: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: colors.primaryContainer,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.6)"
    },
    questMarkerText: {
        ...typography.dataPoint,
        color: colors.onPrimaryContainer
    },
    businessMarker: {
        backgroundColor: colors.secondaryContainer,
        padding: 10,
        borderRadius: 12
    },
    businessMarkerText: {
        ...typography.dataPoint,
        color: colors.onSecondaryContainer
    },
    placeMarker: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16
    },
    placeMarkerText: {
        ...typography.dataPoint,
        color: colors.onPrimary
    },
    clusterMarker: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.6)"
    },
    clusterQuest: {
        backgroundColor: "rgba(0, 242, 255, 0.8)"
    },
    clusterPlace: {
        backgroundColor: "rgba(0, 105, 111, 0.8)"
    },
    clusterText: {
        ...typography.dataPoint,
        color: colors.onPrimary
    },
    busMarker: {
        backgroundColor: colors.primary,
        padding: 8,
        borderRadius: 12
    },
    busMarkerText: {
        ...typography.labelCaps,
        color: colors.onPrimary
    },
    xpBurst: {
        position: "absolute",
        top: 108,
        left: spacing.gutter,
        backgroundColor: "rgba(252, 212, 0, 0.9)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16
    },
    xpBurstText: {
        ...typography.dataPoint,
        color: colors.onSecondaryContainer
    },
    unlockPulse: {
        position: "absolute",
        width: 240,
        height: 240,
        borderRadius: 120,
        borderWidth: 2,
        borderColor: "rgba(0, 242, 255, 0.7)",
        backgroundColor: "rgba(0, 242, 255, 0.1)"
    },
    revealPulse: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 2,
        borderColor: "rgba(0, 242, 255, 0.25)",
        backgroundColor: "rgba(0, 242, 255, 0.06)"
    },
    previewCard: {
        padding: 16,
        gap: 8
    },
    previewWrap: {
        position: "absolute",
        left: spacing.gutter,
        right: spacing.gutter,
        bottom: 148
    },
    previewHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    previewIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    previewHeaderText: {
        flex: 1
    },
    previewTitle: {
        ...typography.bodyMd,
        color: colors.onSurface
    },
    previewSubtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    previewMeta: {
        ...typography.bodySm,
        color: colors.primary
    },
    previewDetail: {
        ...typography.bodySm,
        color: colors.onSurface
    },
    previewList: {
        gap: 4
    },
    previewListItem: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    previewMore: {
        ...typography.bodySm,
        color: colors.primary
    },
    previewClose: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)"
    }
});
