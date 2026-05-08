import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, radii, spacing, typography } from "../theme";

type RotaComposerProps = {
    onSend: (prompt: string) => void;
    isSending?: boolean;
    placeholder?: string;
};

export const RotaComposer = ({ onSend, isSending = false, placeholder = "Ask Rota AI..." }: RotaComposerProps) => {
    const [prompt, setPrompt] = useState("");

    const handleSend = () => {
        const trimmed = prompt.trim();
        if (!trimmed || isSending) return;
        setPrompt("");
        onSend(trimmed);
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={prompt}
                onChangeText={setPrompt}
                placeholder={placeholder}
                placeholderTextColor={colors.outline}
                style={styles.input}
                onSubmitEditing={handleSend}
                returnKeyType="send"
            />
            <Pressable
                onPress={handleSend}
                disabled={isSending}
                style={({ pressed }) => [styles.sendButton, pressed && styles.sendPressed]}
            >
                {isSending ? (
                    <ActivityIndicator size="small" color={colors.onPrimary} />
                ) : (
                    <MaterialIcons name="send" size={18} color={colors.onPrimary} />
                )}
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.stackSm
    },
    input: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: radii.full,
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderWidth: 1,
        borderColor: "rgba(0, 105, 111, 0.12)",
        ...typography.bodySm,
        color: colors.onSurface
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: radii.full,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary
    },
    sendPressed: {
        opacity: 0.85
    }
});
