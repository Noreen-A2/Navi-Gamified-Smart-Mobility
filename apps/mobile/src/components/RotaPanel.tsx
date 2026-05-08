import { StyleSheet, Text, View } from "react-native";
import { useRotaStore } from "../store/useRotaStore";
import { colors, spacing, typography } from "../theme";
import { RotaComposer } from "./RotaComposer";

export const RotaPanel = () => {
    const messages = useRotaStore((state) => state.messages);
    const sendMessage = useRotaStore((state) => state.sendMessage);
    const isSending = useRotaStore((state) => state.isSending);

    return (
        <View style={styles.container}>
            <View style={styles.handle} />
            <Text style={styles.title}>ROTA AI</Text>
            <Text style={styles.subtitle}>Swipe down to talk with your city guide.</Text>
            <View style={styles.chatBlock}>
                {messages.map((message) => (
                    <View
                        key={message.id}
                        style={[styles.message, message.role === "user" && styles.userMessage]}
                    >
                        <Text style={styles.messageText}>{message.content}</Text>
                    </View>
                ))}
            </View>
            <RotaComposer onSend={sendMessage} isSending={isSending} />
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
    chatBlock: {
        flex: 1,
        gap: spacing.stackSm
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
    }
});
