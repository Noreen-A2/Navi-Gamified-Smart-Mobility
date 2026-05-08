import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";
import { SwipeDownPanel } from "../components/SwipeDownPanel";
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

            <SwipeDownPanel>
                <RotaPanel />
            </SwipeDownPanel>
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
        padding: 24,
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
    }
});
