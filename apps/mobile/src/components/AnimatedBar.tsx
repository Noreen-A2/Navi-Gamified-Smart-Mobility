import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../theme";

type AnimatedBarProps = {
    value: number;
    max?: number;
    orientation?: "horizontal" | "vertical";
    size?: number;
    fillColor?: string;
    trackColor?: string;
    style?: ViewStyle;
};

export const AnimatedBar = ({
    value,
    max = 100,
    orientation = "horizontal",
    size = 8,
    fillColor = colors.primary,
    trackColor = "rgba(0, 105, 111, 0.12)",
    style
}: AnimatedBarProps) => {
    const progress = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 900,
            useNativeDriver: false
        }).start();
    }, [animatedValue, progress]);

    const animatedSize = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"]
    });

    const isVertical = orientation === "vertical";

    return (
        <View
            style={[
                styles.track,
                isVertical ? styles.trackVertical : styles.trackHorizontal,
                isVertical ? { width: size } : { height: size },
                { backgroundColor: trackColor },
                style
            ]}
        >
            <Animated.View
                style={[
                    styles.fill,
                    isVertical ? styles.fillVertical : styles.fillHorizontal,
                    { backgroundColor: fillColor },
                    isVertical ? { height: animatedSize } : { width: animatedSize }
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        borderRadius: 999,
        overflow: "hidden"
    },
    trackHorizontal: {
        width: "100%"
    },
    trackVertical: {
        height: "100%",
        justifyContent: "flex-end"
    },
    fill: {
        borderRadius: 999
    },
    fillHorizontal: {
        height: "100%"
    },
    fillVertical: {
        width: "100%"
    }
});
