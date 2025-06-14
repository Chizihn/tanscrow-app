import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AppState = {
  isLoading: boolean;
  error: string | null;
  isOnboarded: boolean;

  fromIndexTransaction: boolean;
  fromIndexFund: boolean;
  fromIndexWithdraw: boolean;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsOnboarded: (isOnboarded: boolean) => void;

  setFromIndexTransaction: (val: boolean) => void;
  setFromIndexFund: (val: boolean) => void;
  setFromIndexWithdraw: (val: boolean) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoading: false,
      error: null,
      isOnboarded: false,

      fromIndexTransaction: false,
      fromIndexFund: false,
      fromIndexWithdraw: false,

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setIsOnboarded: (isOnboarded) => set({ isOnboarded }),

      setFromIndexTransaction: (val) => set({ fromIndexTransaction: val }),
      setFromIndexFund: (val) => set({ fromIndexFund: val }),
      setFromIndexWithdraw: (val) => set({ fromIndexWithdraw: val }),
    }),
    {
      name: "tanscrow-app",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        fromIndexTransaction: state.fromIndexTransaction,
        fromIndexFund: state.fromIndexFund,
        fromIndexWithdraw: state.fromIndexWithdraw,
      }),
    }
  )
);
