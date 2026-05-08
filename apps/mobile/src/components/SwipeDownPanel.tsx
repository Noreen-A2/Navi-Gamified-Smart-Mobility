import { ReactNode } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { colors, radii } from "../theme";

const { height } = Dimensions.get("window");
const PANEL_HEIGHT = Math.min(height * 0.55, 520);
const HANDLE_HEIGHT = 32;

type SwipeDownPanelProps = {
    children: ReactNode;
};

export const SwipeDownPanel = ({ children }: SwipeDownPanelProps) => {
    const translateY = useSharedValue(-PANEL_HEIGHT + HANDLE_HEIGHT);
    const startY = useSharedValue(translateY.value);

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            const next = startY.value + event.translationY;
            translateY.value = Math.min(0, Math.max(-PANEL_HEIGHT + HANDLE_HEIGHT, next));
        })
        .onEnd(() => {
            const shouldOpen = translateY.value > -PANEL_HEIGHT / 2;
            translateY.value = withSpring(shouldOpen ? 0 : -PANEL_HEIGHT + HANDLE_HEIGHT);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.panel, animatedStyle]}>{children}</Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    panel: {
        position: "absolute",
        top: 0,
        left: 16,
        right: 16,
        height: PANEL_HEIGHT,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: radii.xl,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.5)",
        shadowColor: colors.primaryContainer,
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 }
    }
});
