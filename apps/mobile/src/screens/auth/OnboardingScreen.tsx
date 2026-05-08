import { StyleSheet, Text, View, Image, Animated, Platform } from "react-native";
import { HoloButton } from "../../components/HoloButton";
import { colors, spacing, typography, shadows, radii } from "../../theme";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useRef } from "react";

export const OnboardingScreen = () => {
    const { skipAuth } = useAuthStore();
    
    // Animation Values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: Platform.OS !== "web", // Fix web warning
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: Platform.OS !== "web", // Fix web warning
            })
        ]).start();
    }, [fadeAnim, slideAnim]);

    return (
        <LinearGradient colors={["#ffffff", "#eefbfc"]} style={styles.container}>
            <Animated.View style={[styles.logoBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <Image 
                    source={require("../../../assets/navilogo.png")} 
                    style={styles.logoImage} 
                    resizeMode="contain" 
                />
                <Text style={styles.title}>See the city.</Text>
                <Text style={styles.subtitle}>Turn every ride into a treasure hunt.</Text>
            </Animated.View>
            <Animated.View style={[styles.ctaBlock, { opacity: fadeAnim }]}>
                <View style={styles.glowContainer}>
                    <HoloButton
                        title="Start Exploring"
                        onPress={() => skipAuth()}
                    />
                </View>
                <Text style={styles.helper}>Authentication is skipped for now.</Text>
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.containerPadding,
        justifyContent: "space-between"
    },
    logoBlock: {
        marginTop: spacing.stackLg * 2,
        alignItems: "center",
        gap: spacing.stackMd
    },
    logoImage: {
        width: 160,
        height: 160,
        marginBottom: spacing.stackSm
    },
    title: {
        ...typography.displayXL,
        color: colors.onSurface,
        textAlign: "center"
    },
    subtitle: {
        ...typography.bodyLg,
        color: colors.onSurfaceVariant,
        textAlign: "center",
        maxWidth: 280,
    },
    ctaBlock: {
        gap: spacing.stackSm,
        marginBottom: spacing.stackLg * 2
    },
    glowContainer: {
        ...(Platform.OS === "web" ? shadows.glowWeb : shadows.glow),
        borderRadius: radii.full,
    },
    helper: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
        textAlign: "center",
        opacity: 0.6,
        marginTop: spacing.stackSm
    }
});
