import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRotaStore } from "../store/useRotaStore";
import { colors, radii, spacing, typography } from "../theme";

export const RotaPanel = () => {
    const messages = useRotaStore((state) => state.messages);
    const isLoading = useRotaStore((state) => state.isLoading);
    const sendMessage = useRotaStore((state) => state.sendMessage);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isLoading) return;
        setInput("");
        await sendMessage(text);
    };

    return (
        <View style={styles.container}>
            <View style={styles.handle} />
            <Text style={styles.title}>ROTA AI</Text>
            <Text style={styles.subtitle}>Your city-intelligent route guide.</Text>

            <ScrollView style={styles.chatScroll} contentContainerStyle={styles.chatContent}>
                {messages.map((message) => (
                    <View
                        key={message.id}
                        style={[styles.message, message.role === "user" && styles.userMessage]}
                    >
                        <Text style={styles.messageText}>{message.content}</Text>
                    </View>
                ))}
                {isLoading && (
                    <View style={styles.typingRow}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={styles.typingText}>Thinking…</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Ask Rota AI…"
                    placeholderTextColor={colors.onSurfaceVariant}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                    editable={!isLoading}
                />
                <TouchableOpacity
                    style={[styles.sendBtn, (isLoading || !input.trim()) && styles.sendBtnDisabled]}
                    onPress={handleSend}
                    disabled={isLoading || !input.trim()}
                    accessibilityLabel="Send message"
                >
                    <MaterialIcons name="send" size={18} color={colors.onPrimary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacing.stackSm
    },
    handle: {
        alignSelf: "center",
        width: 60,
        height: 6,
        borderRadius: 99,
        backgroundColor: colors.surfaceContainerHigh
    },
    title: {
        ...typography.headlineMd,
        color: colors.primary
    },
    subtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    chatScroll: {
        flex: 1
    },
    chatContent: {
        gap: spacing.stackSm,
        paddingBottom: 8
    },
    message: {
        padding: 12,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderWidth: 1,
        borderColor: "rgba(0, 105, 111, 0.1)"
    },
    userMessage: {
        alignSelf: "flex-end",
        backgroundColor: "rgba(0, 242, 255, 0.2)"
    },
    messageText: {
        ...typography.bodySm,
        color: colors.onSurface
    },
    typingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    typingText: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.stackSm
    },
    textInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 12,
        borderRadius: radii.lg,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
        borderColor: "rgba(0, 105, 111, 0.15)",
        ...typography.bodySm,
        color: colors.onSurface
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: radii.full,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center"
    },
    sendBtnDisabled: {
        opacity: 0.4
    }
});

