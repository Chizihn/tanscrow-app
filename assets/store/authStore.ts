import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ME } from "../graphql/queries/user";
import { apolloClient } from "../lib/apolloClient";
import type { User } from "../types/user";

export interface PersistAuth {
  user: Partial<User> | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface AuthState extends PersistAuth {
  setUser: (user: Partial<User> | null) => void;
  setToken: (token: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true,
      isInitialized: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      initializeAuth: async () => {
        const state = get();

        // Prevent multiple initializations
        if (state.isInitialized) {
          return;
        }

        try {
          set({ loading: true, error: null });

          const token = state.token;

          if (!token) {
            set({
              isAuthenticated: false,
              loading: false,
              isInitialized: true,
              user: null,
            });
            return;
          }

          // Verify token by fetching user data
          const { data } = await apolloClient.query({
            query: ME,
            fetchPolicy: "network-only",
            errorPolicy: "all",
          });

          if (data?.me) {
            set({
              user: data.me,
              isAuthenticated: true,
              loading: false,
              isInitialized: true,
              error: null,
            });
          } else {
            // Token exists but user data is invalid
            await get().logout();
          }
        } catch (error: any) {
          console.error("Auth initialization error:", error);

          // Set error message for UI to handle
          set({
            error: "Session expired. Please sign in again.",
            loading: false,
            isInitialized: true,
          });

          // Clear invalid auth state
          await get().logout();
        }
      },

      logout: async () => {
        try {
          // Clear AsyncStorage
          await AsyncStorage.multiRemove(["token", "tanscrow-auth"]);

          // Clear Apollo cache
          await apolloClient.clearStore();

          // Reset state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            isInitialized: true,
            error: null,
          });
        } catch (error) {
          console.error("Error during logout:", error);
          // Even if logout fails, reset the state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            isInitialized: true,
            error: null,
          });
        }
      },
    }),
    {
      name: "tanscrow-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Ensure loading is false after rehydration
        if (state) {
          state.loading = false;
        }
      },
    }
  )
);
