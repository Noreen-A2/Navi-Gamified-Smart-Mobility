import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        const start = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setError("Location permission denied");
                return;
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 5000,
                    distanceInterval: 10
                },
                (loc) => setLocation(loc)
            );
        };

        start().catch((err) => setError(String(err)));

        return () => {
            subscription?.remove();
        };
    }, []);

    return { location, error };
};
