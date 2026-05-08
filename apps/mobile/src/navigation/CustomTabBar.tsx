import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View, Text, Vibration } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, radii, typography } from "../theme";

const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    Map: "map",
    Places: "place",
    Quests: "explore",
    Rota: "auto-awesome",
    Profile: "person"
};

const badgeMap: Record<string, string | undefined> = {
    Quests: "3",
    Rota: "AI"
};

const TabButton = ({
    label,
    icon,
    isFocused,
    onPress
}: {
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    isFocused: boolean;
    onPress: () => void;
}) => {
    const focusAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
    const pressAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 220,
            useNativeDriver: true
        }).start();
    }, [focusAnim, isFocused]);

    const labelOpacity = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1]
    });

    return (
        <Pressable
            onPress={() => {
                // trace presses for debugging
                // eslint-disable-next-line no-console
                console.log("Tab pressed:", label);
                Vibration.vibrate(10);
                onPress();
            }}
            onPressIn={() =>
                Animated.spring(pressAnim, { toValue: 0.94, useNativeDriver: true }).start()
            }
            onPressOut={() =>
                Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true }).start()
            }
            style={styles.tabItem}
        >
            <Animated.View
                style={[
                    styles.tabGlow,
                    {
                        opacity: focusAnim,
                        transform: [{ scale: focusAnim }]
                    }
                ]}
            />
            {/* Use a regular View for the icon to avoid transform-related blanking while debugging */}
            <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <MaterialIcons
                    name={icon}
                    size={22}
                    color={isFocused ? colors.primary : colors.onSurfaceVariant}
                />
            </View>
            <Animated.Text
                style={[
                    styles.label,
                    { opacity: labelOpacity, color: isFocused ? colors.primary : colors.onSurfaceVariant }
                ]}
            >
                {label}
            </Animated.Text>
            {badgeMap[label] ? (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeMap[label]}</Text>
                </View>
            ) : null}
        </Pressable>
    );
};

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <View style={styles.barWrapper}>
                <BlurView intensity={60} tint="light" style={styles.bar}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const label = options.tabBarLabel ?? route.name;
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        return (
                            <TabButton
                                key={route.key}
                                label={String(label)}
                                icon={iconMap[route.name]}
                                isFocused={isFocused}
                                onPress={onPress}
                            />
                        );
                    })}
                </BlurView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.1)"
    },
    barWrapper: {
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 8
    },
    bar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "stretch",
        borderRadius: radii.full,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        overflow: "hidden"
    },
    tabItem: {
        flex: 1,
        position: "relative",
        alignItems: "center",
        justifyContent: "flex-end",
        overflow: "visible",
        paddingHorizontal: 4,
        paddingVertical: 8,
        gap: 2
    },
    tabGlow: {
        position: "absolute",
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(0, 242, 255, 0.2)",
        top: 6,
        left: "50%",
        marginLeft: -19,
        zIndex: -1
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center"
    },
    iconWrapActive: {
        backgroundColor: "rgba(0, 242, 255, 0.15)",
        zIndex: 2
    },
    label: {
        ...typography.labelCaps,
        fontSize: 10,
        color: colors.onSurfaceVariant
    },
    badge: {
        position: "absolute",
        top: 2,
        right: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: "rgba(252, 212, 0, 0.95)"
    },
    badgeText: {
        ...typography.labelCaps,
        fontSize: 8,
        color: colors.onSecondaryContainer
    }
});
