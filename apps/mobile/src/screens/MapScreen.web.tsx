import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";
import { RotaPanel } from "../components/RotaPanel";

export const MapScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.placeholderContainer}>
                <Text style={styles.brand}>NAVI Web Version</Text>
                <Text style={styles.placeholderText}>
                    The interactive map is only available on the Android/iOS mobile app.
                    Please use the Expo Go app on your phone to view the full AR/Map experience!
                </Text>
            </View>

            <View style={styles.panelDock}>
                <View style={styles.panelCard}>
                    <RotaPanel />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    },
    brand: {
        ...typography.headlineMd,
        color: colors.primary,
        marginBottom: 16
    },
    placeholderText: {
        ...typography.bodyLg,
        color: colors.onSurface,
        textAlign: 'center'
    },
    panelDock: {
        paddingHorizontal: 24,
        paddingBottom: 24
    },
    panelCard: {
        alignSelf: "center",
        width: "100%",
        maxWidth: 520,
        minHeight: 320,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.5)",
        shadowColor: colors.primaryContainer,
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 }
    }
});
