import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Alert } from "react-native";
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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true, // Start with loading true
      isInitialized: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      initializeAuth: async () => {
        // Don't initialize if already initialized
        if (get().isInitialized) return;

        try {
          set({ loading: true });

          // Check if token exists in storage
          const token = get().token;

          if (!token) {
            // Alert.alert("Session expired!. Signin again");

            // No token, so we're not authenticated
            set({
              isAuthenticated: false,
              loading: false,
              isInitialized: true,
            });
            return;
          }

          // We have a token, verify it by fetching user data
          const { data } = await apolloClient.query({
            query: ME,
            fetchPolicy: "network-only",
          });

          if (data?.me) {
            set({
              user: data.me,
              isAuthenticated: true,
              loading: false,
              isInitialized: true,
            });
          } else {
            // Token invalid or expired
            await get().logout();
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          // Token is invalid, clear everything
          await get().logout();
        }
      },

      logout: async () => {
        try {
          await AsyncStorage.multiRemove(["token", "tanscrow-auth"]);
          await apolloClient.clearStore();
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
          throw error;
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
        error: state.error,
        // Don't persist loading and isInitialized states
      }),
    }
  )
);
