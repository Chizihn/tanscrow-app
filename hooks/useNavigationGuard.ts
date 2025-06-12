"use client";

import { useAppStore } from "@/assets/store/appStore";
import { useAuthStore } from "@/assets/store/authStore";
import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

export function useNavigationGuard() {
  const { isOnboarded } = useAppStore();
  const { isAuthenticated, loading, isInitialized } = useAuthStore();
  const appStoreHydrated = useAppStore.persist.hasHydrated();
  const authStoreHydrated = useAuthStore.persist.hasHydrated();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't navigate until both stores are hydrated and auth is initialized
    if (!appStoreHydrated || !authStoreHydrated || !isInitialized || loading)
      return;

    // Define protected and auth routes
    const isAuthRoute = pathname === "/auth";
    const isOnboardingRoute = pathname === "/onboarding";
    // const isDashboardRoute = pathname.startsWith("/(dashboard)")

    // Navigation logic
    if (!isOnboarded && !isOnboardingRoute) {
      // Not onboarded, redirect to onboarding
      router.replace("/onboarding");
    } else if (isOnboarded && !isAuthenticated && !isAuthRoute) {
      // Onboarded but not authenticated, redirect to auth
      router.replace("/auth");
    } else if (isAuthenticated && (isAuthRoute || isOnboardingRoute)) {
      // Authenticated but on auth or onboarding page, redirect to dashboard
      router.replace("/(dashboard)");
    }
  }, [
    isAuthenticated,
    isInitialized,
    isOnboarded,
    loading,
    pathname,
    router,
    appStoreHydrated,
    authStoreHydrated,
  ]);
}
