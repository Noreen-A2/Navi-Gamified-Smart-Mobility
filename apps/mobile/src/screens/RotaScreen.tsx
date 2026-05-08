import { useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRotaStore } from "../store/useRotaStore";
import { GlassCard } from "../components/GlassCard";
import { colors, gradients, radii, spacing, typography } from "../theme";

export const RotaScreen = () => {
    const insets = useSafeAreaInsets();
    const messages = useRotaStore((state) => state.messages);
    const isLoading = useRotaStore((state) => state.isLoading);
    const sendMessage = useRotaStore((state) => state.sendMessage);
    const [input, setInput] = useState("");
    const listRef = useRef<FlatList>(null);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isLoading) return;
        setInput("");
        await sendMessage(text);
        listRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={insets.top + 56}
        >
            <LinearGradient colors={gradients.pearl as any} style={StyleSheet.absoluteFillObject} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <View style={styles.orb} />
                <View>
                    <Text style={styles.headerTitle}>ROTA AI</Text>
                    <Text style={styles.headerSubtitle}>Your Alamein city guide</Text>
                </View>
            </View>

            {/* Messages */}
            <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.messageList, { paddingBottom: insets.bottom + 100 }]}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.bubble,
                            item.role === "user" ? styles.userBubble : styles.aiBubble
                        ]}
                    >
                        <Text
                            style={[
                                styles.bubbleText,
                                item.role === "user" ? styles.userText : styles.aiText
                            ]}
                        >
                            {item.content}
                        </Text>
                    </View>
                )}
                ListFooterComponent={
                    isLoading ? (
                        <View style={styles.typingRow}>
                            <ActivityIndicator size="small" color={colors.primary} />
                            <Text style={styles.typingText}>Rota is thinking…</Text>
                        </View>
                    ) : null
                }
            />

            {/* Input bar */}
            <GlassCard style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Ask about routes, places, quests…"
                    placeholderTextColor={colors.onSurfaceVariant}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                    editable={!isLoading}
                    multiline={false}
                />
                <TouchableOpacity
                    style={[styles.sendBtn, (isLoading || !input.trim()) && styles.sendBtnDisabled]}
                    onPress={handleSend}
                    disabled={isLoading || !input.trim()}
                    accessibilityLabel="Send message"
                >
                    <MaterialIcons name="send" size={20} color={colors.onPrimary} />
                </TouchableOpacity>
            </GlassCard>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: colors.surface
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.stackMd,
        paddingHorizontal: spacing.containerPadding,
        paddingBottom: spacing.stackMd
    },
    orb: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0, 242, 255, 0.25)",
        borderWidth: 1,
        borderColor: "rgba(0, 242, 255, 0.5)"
    },
    headerTitle: {
        ...typography.headlineMd,
        color: colors.primary
    },
    headerSubtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    messageList: {
        paddingHorizontal: spacing.containerPadding,
        gap: spacing.stackSm,
        flexGrow: 1
    },
    bubble: {
        maxWidth: "80%",
        padding: 14,
        borderRadius: radii.lg,
        marginBottom: spacing.stackSm
    },
    aiBubble: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderWidth: 1,
        borderColor: "rgba(0, 105, 111, 0.12)"
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: "rgba(0, 242, 255, 0.2)",
        borderWidth: 1,
        borderColor: "rgba(0, 242, 255, 0.35)"
    },
    bubbleText: {
        ...typography.bodyMd
    },
    aiText: {
        color: colors.onSurface
    },
    userText: {
        color: colors.primary
    },
    typingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: spacing.containerPadding,
        paddingBottom: spacing.stackSm
    },
    typingText: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    inputBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.containerPadding,
        paddingTop: spacing.stackMd,
        gap: spacing.stackSm,
        borderTopLeftRadius: radii.xl,
        borderTopRightRadius: radii.xl,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    textInput: {
        flex: 1,
        height: 44,
        paddingHorizontal: 14,
        borderRadius: radii.lg,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
        borderColor: "rgba(0, 105, 111, 0.15)",
        ...typography.bodyMd,
        color: colors.onSurface
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: radii.full,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center"
    },
    sendBtnDisabled: {
        opacity: 0.4
    }
});

