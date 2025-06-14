import { useAuthStore } from "@/assets/store/authStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initializeAuth, isInitialized, error, clearError } = useAuthStore();
  const authStoreHydrated = useAuthStore.persist.hasHydrated();
  const router = useRouter();

  // Initialize auth after store hydration
  useEffect(() => {
    if (authStoreHydrated && !isInitialized) {
      initializeAuth();
    }
  }, [authStoreHydrated, isInitialized, initializeAuth]);

  // Handle auth errors
  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: error,
      });
      clearError();

      // Navigate to auth if needed
      if (error.includes("Session expired")) {
        router.replace("/auth");
      }
    }
  }, [error, clearError, router]);

  return <>{children}</>;
}
