import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";
import { AnimatedBar } from "./AnimatedBar";

type SparklineChartProps = {
    values: number[];
    height?: number;
    color?: string;
    labelSuffix?: string;
};

export const SparklineChart = ({
    values,
    height = 90,
    color = colors.primary,
    labelSuffix = " XP"
}: SparklineChartProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const tooltipOpacity = useRef(new Animated.Value(0)).current;
    const maxValue = useMemo(() => Math.max(...values, 1), [values]);

    useEffect(() => {
        if (activeIndex === null) return;
        tooltipOpacity.setValue(0);
        Animated.timing(tooltipOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false
        }).start();
        const timer = setTimeout(() => setActiveIndex(null), 1800);
        return () => clearTimeout(timer);
    }, [activeIndex, tooltipOpacity]);

    return (
        <View style={[styles.container, { height }]}>
            {values.map((value, index) => {
                const isActive = index === activeIndex;
                const barHeight = Math.max(12, Math.round((value / maxValue) * (height - 24)));
                return (
                    <View key={`${value}-${index}`} style={styles.barWrap}>
                        <Pressable onPress={() => setActiveIndex(index)} style={styles.barPress}>
                            <AnimatedBar
                                value={value}
                                max={maxValue}
                                orientation="vertical"
                                size={10}
                                fillColor={color}
                                trackColor="rgba(0, 105, 111, 0.12)"
                                style={styles.barTrack}
                            />
                        </Pressable>
                        {isActive ? (
                            <Animated.View
                                style={[styles.tooltip, { opacity: tooltipOpacity, bottom: barHeight + 10 }]}
                            >
                                <Text style={styles.tooltipText}>
                                    {value}
                                    {labelSuffix}
                                </Text>
                            </Animated.View>
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10
    },
    barWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
        height: "100%"
    },
    barPress: {
        height: "100%",
        justifyContent: "flex-end"
    },
    barTrack: {
        height: "100%"
    },
    tooltip: {
        position: "absolute",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: "rgba(9, 20, 24, 0.85)"
    },
    tooltipText: {
        ...typography.bodySm,
        color: colors.inverseOnSurface
    }
});
