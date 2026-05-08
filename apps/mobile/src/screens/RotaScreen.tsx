import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRotaStore } from "../store/useRotaStore";
import { SectionTitle } from "../components/SectionTitle";
import { HoloButton } from "../components/HoloButton";
import { GlassCard } from "../components/GlassCard";
import { colors, gradients, radii, spacing, typography } from "../theme";

export const RotaScreen = () => {
    const insets = useSafeAreaInsets();
    const messages = useRotaStore((state) => state.messages);
    const intents = ["Scenic", "Fast", "Quiet", "Quest", "Night"];
    const savedRoutes = ["Marina Loop", "Old Town Drift", "Skyline Pulse"];

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 148 }]}>
            <LinearGradient colors={gradients.pearl as any} style={styles.background} />
            <SectionTitle title="Rota Studio" subtitle="Design routes with cinematic flow." />
            <GlassCard style={styles.orbCard}>
                <View style={styles.orb} />
                <Text style={styles.orbTitle}>Route intelligence core</Text>
                <Text style={styles.orbSubtitle}>
                    Build a journey soundtrack with live city pulses and quest trails.
                </Text>
            </GlassCard>
            <GlassCard style={styles.routeCard}>
                <Text style={styles.routeTitle}>Route inputs</Text>
                <View style={styles.inputRow}>
                    <MaterialIcons name="radio-button-checked" size={16} color={colors.primary} />
                    <Text style={styles.inputText}>Current location</Text>
                </View>
                <View style={styles.inputRow}>
                    <MaterialIcons name="place" size={16} color={colors.primary} />
                    <Text style={styles.inputText}>Pick a destination</Text>
                </View>
            </GlassCard>
            <GlassCard style={styles.intentCard}>
                <Text style={styles.routeTitle}>Intent filters</Text>
                <View style={styles.intentRow}>
                    {intents.map((intent) => (
                        <View key={intent} style={styles.intentPill}>
                            <Text style={styles.intentText}>{intent}</Text>
                        </View>
                    ))}
                </View>
            </GlassCard>
            <GlassCard style={styles.messageCard}>
                <Text style={styles.routeTitle}>Cinematic cues</Text>
                {messages.map((message) => (
                    <View key={message.id} style={styles.message}>
                        <Text style={styles.messageText}>{message.content}</Text>
                    </View>
                ))}
            </GlassCard>
            <GlassCard style={styles.savedCard}>
                <Text style={styles.routeTitle}>Saved journeys</Text>
                {savedRoutes.map((route) => (
                    <View key={route} style={styles.savedRow}>
                        <MaterialIcons name="bookmark" size={16} color={colors.primary} />
                        <Text style={styles.savedText}>{route}</Text>
                    </View>
                ))}
            </GlassCard>
            <HoloButton title="Preview cinematic route" onPress={() => undefined} />
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
    orbCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm,
        alignItems: "center"
    },
    orb: {
        alignSelf: "center",
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: "rgba(0, 242, 255, 0.25)",
        borderWidth: 1,
        borderColor: "rgba(0, 242, 255, 0.4)"
    },
    orbTitle: {
        ...typography.headlineMd,
        color: colors.primary
    },
    orbSubtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
        textAlign: "center"
    },
    routeCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm
    },
    routeTitle: {
        ...typography.labelCaps,
        color: colors.primary
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 12,
        borderRadius: radii.lg,
        backgroundColor: "rgba(255, 255, 255, 0.75)"
    },
    inputText: {
        ...typography.bodySm,
        color: colors.onSurface
    },
    intentCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm
    },
    intentRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8
    },
    intentPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: radii.full,
        backgroundColor: "rgba(0, 242, 255, 0.15)"
    },
    intentText: {
        ...typography.bodySm,
        color: colors.primary
    },
    messageCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm
    },
    message: {
        backgroundColor: "rgba(255,255,255,0.8)",
        padding: 16,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(0, 105, 111, 0.12)"
    },
    messageText: {
        ...typography.bodyMd,
        color: colors.onSurface
    },
    savedCard: {
        padding: spacing.containerPadding,
        gap: spacing.stackSm
    },
    savedRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 6
    },
    savedText: {
        ...typography.bodySm,
        color: colors.onSurface
    }
});
