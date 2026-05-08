import { create } from "zustand";
import { TransitVehicle, fetchTransitVehicles } from "../services/transit";

type TransitState = {
    vehicles: TransitVehicle[];
    isRunning: boolean;
    startSimulation: () => void;
    stopSimulation: () => void;
};

let intervalRef: ReturnType<typeof setInterval> | null = null;

export const useTransitStore = create<TransitState>((set, get) => ({
    vehicles: [],
    isRunning: false,
    startSimulation: () => {
        if (get().isRunning) return;
        set({ isRunning: true });
        intervalRef = setInterval(async () => {
            try {
                const vehicles = await fetchTransitVehicles();
                set({ vehicles });
            } catch (error) {
                set({ vehicles: [] });
            }
        }, 5000);
    },
    stopSimulation: () => {
        if (intervalRef) clearInterval(intervalRef);
        intervalRef = null;
        set({ isRunning: false });
    }
}));
