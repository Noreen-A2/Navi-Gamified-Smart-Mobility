import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { View, Text } from "react-native";
import { CustomTabBar } from "./CustomTabBar";
import { MapScreen } from "../screens/MapScreen";
import { TransitScreen } from "../screens/TransitScreen";
import { PlacesScreen } from "../screens/PlacesScreen";
import { QuestsScreen } from "../screens/QuestsScreen";
import { RotaScreen } from "../screens/RotaScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { OnboardingScreen } from "../screens/auth/OnboardingScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { PhoneOtpScreen } from "../screens/auth/PhoneOtpScreen";
import { ScanQuestScreen } from "../screens/ScanQuestScreen";
import { usePushTokenSync } from "../hooks/usePushTokenSync";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppTabs = () => (
    <Tab.Navigator
        initialRouteName="Map"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
    >
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Places" component={PlacesScreen} />
        <Tab.Screen name="Quests" component={QuestsScreen} />
        <Tab.Screen name="Rota" component={RotaScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PhoneOtp" component={PhoneOtpScreen} />
    </Stack.Navigator>
);

export const RootNavigator = () => {
    const { session, isLoading, initialize } = useAuthStore();
    usePushTokenSync();

    useEffect(() => {
        initialize().catch(() => undefined);
    }, [initialize]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading Navigator...</Text>
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!session ? (
                <Stack.Screen name="Auth" component={AuthStack} />
            ) : (
                <Stack.Screen name="App" component={AppTabs} />
            )}
            <Stack.Screen name="ScanQuest" component={ScanQuestScreen} />
            <Stack.Screen name="TransitPulse" component={TransitScreen} />
        </Stack.Navigator>
    );
};
