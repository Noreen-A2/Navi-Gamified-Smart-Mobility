import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { colors, spacing, typography } from "../theme";
import { useQuestStore } from "../store/useQuestStore";

export const ScanQuestScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const syncCompleteQuest = useQuestStore((state) => state.syncCompleteQuest);

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    if (!permission?.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>Camera permission required.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={(result) => {
                    if (scanned) return;
                    setScanned(true);
                    if (result.data.includes("quest")) {
                        syncCompleteQuest("quest-qr", {
                            latitude: 31.003,
                            longitude: 28.982
                        }).catch(() => undefined);
                    }
                }}
            />
            <View style={styles.overlay}>
                <Text style={styles.title}>Scan Quest QR</Text>
                <Text style={styles.subtitle}>Align the code inside the frame.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface
    },
    overlay: {
        position: "absolute",
        bottom: 60,
        left: 24,
        right: 24,
        backgroundColor: "rgba(255,255,255,0.8)",
        padding: spacing.containerPadding,
        borderRadius: 20
    },
    title: {
        ...typography.headlineMd,
        color: colors.primary
    },
    subtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant
    }
});
