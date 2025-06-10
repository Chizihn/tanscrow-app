import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AppState = {
  isLoading: boolean;
  error: string | null;
  isOnboarded: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsOnboarded: (isOnboarded: boolean) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoading: false,
      error: null,
      isOnboarded: false, // This should be false initially
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setIsOnboarded: (isOnboarded) => set({ isOnboarded }),
    }),
    {
      name: "tanscrow-app",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);
