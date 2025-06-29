import { useAppStore } from "@/assets/store/appStore";
import { useAuthStore } from "@/assets/store/authStore";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export function useNavigationGuard() {
  const { isOnboarded } = useAppStore();
  const { isAuthenticated, loading, isInitialized } = useAuthStore();
  const appStoreHydrated = useAppStore.persist.hasHydrated();
  const authStoreHydrated = useAuthStore.persist.hasHydrated();
  const router = useRouter();
  const pathname = usePathname();

  // Track if we've completed initial navigation
  const [hasNavigated, setHasNavigated] = useState(false);
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const isReady =
    appStoreHydrated && authStoreHydrated && isInitialized && !loading;

  useEffect(() => {
    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    if (!isReady) {
      return;
    }

    // Define route types
    const isAuthRoute = pathname === "/auth";
    const isOnboardingRoute = pathname === "/onboarding";

    // Determine target route
    let targetRoute: "/auth" | "/onboarding" | "/(dashboard)" | null = null;

    if (!isOnboarded) {
      targetRoute = "/onboarding";
    } else if (!isAuthenticated) {
      targetRoute = "/auth";
    } else {
      // User is onboarded and authenticated
      if (isAuthRoute || isOnboardingRoute) {
        targetRoute = "/(dashboard)";
      }
    }

    // Only navigate if we need to and haven't already navigated
    if (targetRoute && pathname !== targetRoute) {
      // Use RAF to ensure navigation happens after render
      navigationTimeoutRef.current = setTimeout(() => {
        router.replace(targetRoute!);
        setHasNavigated(true);
      }, 50); // Small delay to prevent flash
    } else {
      setHasNavigated(true);
    }

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [
    isAuthenticated,
    isInitialized,
    isOnboarded,
    loading,
    pathname,
    router,
    appStoreHydrated,
    authStoreHydrated,
    isReady,
  ]);

  // useEffect(() => {
  //   setHasNavigated(false);
  // }, [isAuthenticated, isOnboarded]);

  return {
    isReady: isReady && hasNavigated,
  };
}
