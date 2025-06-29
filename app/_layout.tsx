import { ME } from "@/assets/graphql/queries/user";
import { useAuthStore } from "@/assets/store/authStore";
import { User } from "@/assets/types/user";
import { Provider } from "@/components/Provider";
import toastConfig from "@/components/ToastConfig";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { tokenStorage } from "@/services/TokenStorage";
import { useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

function AppContent() {
  const router = useRouter();
  const { isReady } = useNavigationGuard();
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    const handleActions = async () => {
      await AsyncStorage.removeItem("tanscrow-app");
      logout();
      router.replace("/auth");
    };
    handleActions();
  }, [logout, router]);

  useQuery<{ me: User }>(ME, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !tokenStorage.getToken || !isReady,
    onCompleted: (data) => {
      if (data.me) {
        setUser(data.me);
      }
    },
    onError: (error) => {
      logout();
      router.replace("/auth");
      toastConfig.error({
        text1: "Session expired",
        text2: "Your login session is invalid",
      });
      console.error("Error fetching user data:", error);
    },
  });

  // Show loading overlay while navigation is settling
  if (!isReady) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="_loading"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen name="(dashboard)" options={{ title: "Dashboard" }} />
        <Stack.Screen name="auth" />
        <Stack.Screen name="logs" />
        <Stack.Screen name="notification" />
        <Stack.Screen name="verification" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="onboarding" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Always render all screens - no conditional rendering */}
      <Stack.Screen name="(dashboard)" options={{ title: "Dashboard" }} />
      <Stack.Screen name="auth" />
      <Stack.Screen name="logs" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
}
